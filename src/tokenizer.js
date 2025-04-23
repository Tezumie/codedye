// src/tokenizer.js
import { getRulesFor } from './utils.js';

export class Tokenizer {
   constructor(rules) {
      this.rules = rules;
      this.stateStack = [];
      this.bracketDepth = 0;
      this._regexCache = new Map();
      this._compileAllRules();
      this.setState('root');
   }

   setState(s) { this.currentState = s; }
   pushState(s) { this.stateStack.push(this.currentState); this.setState(s); }
   popState() { if (this.stateStack.length) this.setState(this.stateStack.pop()); return this.currentState; }

   _compileAllRules() {
      this._compiled = {};
      const tkRules = this.rules.tokenizer || {};
      for (const [state, rules] of Object.entries(tkRules)) {
         this._compiled[state] = rules.map(rule => {
            if (rule.include) {
               return { include: rule.include.replace(/^@/, '') };
            }
            const [pat, outSpec, nextHint] = rule;
            const re = this._expandRegex(pat, true);
            return { re, outSpec, nextHint };
         });
      }
   }

   _expandRegex(pat, sticky = false) {
      const key = pat.toString() + (sticky ? 'y' : '');
      if (this._regexCache.has(key)) return this._regexCache.get(key);

      let regex;
      if (typeof pat === 'string') {
         regex = new RegExp('^' + pat, sticky ? 'y' : '');
      } else {
         let flags = pat.flags || '';
         if (sticky && !flags.includes('y')) flags += 'y';
         const src = pat.source.replace(/@(\w+)/g, (_, n) => {
            const repl = this.rules[n];
            return repl instanceof RegExp
               ? repl.source
               : (typeof repl === 'string' ? repl : '');
         });
         regex = new RegExp(src, flags);
      }

      this._regexCache.set(key, regex);
      return regex;
   }

   tokenize(line) {
      const out = [];
      let pos = 0;
      while (pos < line.length) {
         const { pos: newPos, matches } = this._processState(this.currentState, line, pos);
         if (matches.length) { out.push(...matches); pos = newPos; }
         else { out.push({ text: line[pos], token: this.rules.defaultToken }); pos++; }
      }
      return out;
   }

   _stripPost(t) {
      const pf = this.rules.tokenPostfix;
      return (typeof t === 'string' && pf && t.endsWith(pf))
         ? t.slice(0, -pf.length)
         : t;
   }

   _makeTok(txt, tok, embedEnter, embedExit) {
      const o = { text: txt, token: this._stripPost(tok) };
      if (embedEnter) o.embedEnter = embedEnter;
      if (embedExit) o.embedExit = true;
      return o;
   }

   _processState(state, line, pos) {
      const rules = this._compiled[state];
      if (!rules) return { pos, matches: [] };

      for (const rule of rules) {
         if (rule.include) {
            const res = this._processState(rule.include, line, pos);
            if (res.matches.length || res.rematch) return res;
            continue;
         }

         const { re, outSpec, nextHint } = rule;
         re.lastIndex = pos;
         const m = re.exec(line);
         if (!m) continue;

         if (Array.isArray(outSpec)) {
            const full = m[0], caps = m.slice(1);
            const toks = caps.map((txt, i) => {
               const spec = outSpec[i];
               let tok = this.rules.defaultToken, ee = null, ex = null;
               if (typeof spec === 'string') {
                  tok = spec;
               } else if (spec && typeof spec === 'object') {
                  tok = spec.token || tok;
                  if (spec.next) this._handleNext(spec.next);
                  ee = spec.embedEnter || null;
                  ex = !!spec.embedExit;
               }
               return this._makeTok(txt, tok, ee, ex);
            });
            return { pos: pos + full.length, matches: toks };
         }

         let token = this.rules.defaultToken;
         let next = nextHint;
         let ee = null, ex = null;

         if (typeof outSpec === 'string') {
            token = outSpec;
         } else if (outSpec && typeof outSpec === 'object') {
            if (outSpec.token) token = outSpec.token;
            if (outSpec.cases) {
               let chosen = outSpec.cases['@default'];
               for (const [k, v] of Object.entries(outSpec.cases)) {
                  const testVal = this.rules[k.slice(1)];
                  if ((k.startsWith('@') && Array.isArray(testVal) && testVal.includes(m[0])) || k === m[0]) {
                     chosen = v;
                     break;
                  }
               }
               if (typeof chosen === 'string') {
                  token = chosen;
               } else if (chosen && typeof chosen === 'object') {
                  token = chosen.token || token;
                  if (chosen.next) next = chosen.next;
               }
            }
            if (outSpec.next) next = outSpec.next;
            ee = outSpec.embedEnter || null;
            ex = !!outSpec.embedExit;
         }

         if (typeof next === 'string') this._handleNext(next);

         if (token === 'delimiter.bracket') {
            let lvl;
            if (/^[\{\(\[]$/.test(m[0])) {
               lvl = (this.bracketDepth % 6) + 1;
               this.bracketDepth++;
            } else {
               this.bracketDepth = Math.max(0, this.bracketDepth - 1);
               lvl = (this.bracketDepth % 6) + 1;
            }
            token += `.level${lvl}`;
         }

         if (token === '@rematch') {
            return {
               pos,
               matches: [{ text: '', token: this.rules.defaultToken, embedExit: true }]
            };
         }

         return {
            pos: pos + m[0].length,
            matches: [this._makeTok(m[0], token, ee, ex)]
         };
      }

      return { pos, matches: [] };
   }

   _handleNext(n) {
      if (n === '@pop') this.popState();
      else if (n.startsWith('@')) this.pushState(n.slice(1));
      else this.pushState(n);
   }
}

export class MultiTokenizer {
   constructor(rootLang) {
      this.langStack = [{ lang: rootLang, tk: new Tokenizer(getRulesFor(rootLang)) }];
   }

   _cur() { return this.langStack[this.langStack.length - 1]; }

   tokenizeLine(line) {
      const out = [];
      const stack = this.langStack;

      // Handle closing fenced-code when in Markdown
      if (stack.length > 1 && stack[0].lang === 'md' && /^\s*(```|~~~)/.test(line)) {
         // pop all embedded (HTML/CSS/JS)
         this.langStack.length = 1;
         // exit md codeblock
         const mdTk = this.langStack[0].tk;
         mdTk.popState();
         return [{ text: line, token: 'string', lang: 'md' }];
      }

      // Handle script/style embedded exit
      if (stack.length > 1) {
         const { lang, tk } = this._cur();
         const closeTag = lang === 'css' ? '</style>' : (lang === 'js' ? '</script>' : null);
         if (closeTag && line.includes(closeTag)) {
            const idx = line.indexOf(closeTag);
            // tokenize pre-close part in current sub-language
            if (idx > 0) tk.tokenize(line.slice(0, idx)).forEach(t => out.push({ ...t, lang }));
            // pop sub-language (css/js)
            stack.pop();
            // now tokenize the closing tag and rest in the new current language
            const host = this._cur();
            host.tk.tokenize(line.slice(idx)).forEach(t => out.push({ ...t, lang: host.lang }));
            return out;
         }
      }

      // Normal tokenization
      for (const tok of this._cur().tk.tokenize(line)) {
         if (tok.embedEnter) {
            out.push({ ...tok, lang: this._cur().lang });
            const subTk = new Tokenizer(getRulesFor(tok.embedEnter));
            subTk.setState('root');
            stack.push({ lang: tok.embedEnter, tk: subTk });
         } else if (tok.embedExit) {
            if (stack.length > 1) stack.pop();
            const host = this._cur().tk;
            host.setState('root'); host.stateStack = []; host.bracketDepth = 0;
         } else {
            out.push({ ...tok, lang: this._cur().lang });
         }
      }

      return out;
   }

   setState(s) { this._cur().tk.setState(s); }
   get stateStack() { return this._cur().tk.stateStack; }
   set stateStack(v) { this._cur().tk.stateStack = v; }
   get bracketDepth() { return this._cur().tk.bracketDepth; }
   set bracketDepth(v) { this._cur().tk.bracketDepth = v; }
}
