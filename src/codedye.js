import { escapeHtml, debounce, detectLangFromClass } from './utils.js';
import { MultiTokenizer } from './tokenizer.js';
const LANGUAGE_ALIASES = {
  javascript: 'js',
  typescript: 'ts',
  html: 'html',
  css: 'css',
  python: 'py',
  csharp: 'cs',
  markdown: 'md',
};
class PlainTokenizer {
  constructor() {
    this.language = 'txt';
    this.stateStack = [];     
    this.bracketDepth = 0; 
  }

  tokenizeLine(line) {
    return [{ text: line, token: null, lang: 'txt' }];
  }

  setState(_) { }
}


const CodeDye = {
  _resetTokenizer(tk) {
    tk.setState('root');
    tk.stateStack.length = 0;
    tk.bracketDepth = 0;
  },

  /* ── Live preview ───────────────────────────── */
  init(src, target, opts = {}) {
    if (typeof src === 'object') ({ source: src, target, ...opts } = src);

    const sourceEl = typeof src === 'string' ? document.querySelector(src) : src;
    const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
    if (!sourceEl || !targetEl) throw new Error('Invalid source / target');

    const cfg = { language: 'js', debounce: 0, ...opts };
    cfg.language = LANGUAGE_ALIASES[cfg.language] || cfg.language;
    let tokenizer;
    try {
      tokenizer = new MultiTokenizer(cfg.language);
    } catch (e) {
      console.warn(`Language "${cfg.language}" not registered, falling back to plain text.`);
      tokenizer = new PlainTokenizer();
      cfg.language = 'txt'; // Also update the class name used later
    }



    /* render one frame */
    const render = () => {
      this._resetTokenizer(tokenizer);

      const lines = sourceEl.value.split('\n');
      let html = '';

      for (const line of lines) {
        for (const tok of tokenizer.tokenizeLine(line)) {
          html += tok.token
            ? `<span class="${tok.token} ${tok.lang}-${tok.token}">${escapeHtml(tok.text)}</span>`
            : escapeHtml(tok.text);
        }
        html += '\n';
      }

      /* 👉 wrap in <code class="language-xxx"> so theme CSS matches */
      targetEl.innerHTML =
        `<code class="language-${cfg.language}">${html}</code>`;
    };

    const listener = cfg.debounce ? debounce(render, cfg.debounce) : render;
    sourceEl.addEventListener('input', listener);
    render();
  },
  /* ── Highlight a code string to HTML ───────────── */
  highlightElement(code = '', opts = {}) {
    const cfg = { language: 'js', ...opts };
    cfg.language = LANGUAGE_ALIASES[cfg.language] || cfg.language;
    let tokenizer;
    try {
      tokenizer = new MultiTokenizer(cfg.language);
    } catch (e) {
      console.warn(`Language "${cfg.language}" not registered, falling back to plain text.`);
      tokenizer = new PlainTokenizer();
      cfg.language = 'txt'; // Also update the class name used later
    }


    this._resetTokenizer(tokenizer);

    const lines = code.split('\n');
    let html = '';

    for (const line of lines) {
      for (const tok of tokenizer.tokenizeLine(line)) {
        html += tok.token
          ? `<span class="${tok.token} ${tok.lang}-${tok.token}">${escapeHtml(tok.text)}</span>`
          : escapeHtml(tok.text);
      }
      html += '\n';
    }

    return `<code class="language-${cfg.language}">${html}</code>`;
  },

  /* ── Static block highlighting ──────────────── */
  highlightBlock(el, opts = {}) {
    if (typeof el === 'string') el = document.querySelector(el);
    const cfg = { language: detectLangFromClass(el), ...opts };
    cfg.language = LANGUAGE_ALIASES[cfg.language] || cfg.language;
    let tokenizer;
    try {
      tokenizer = new MultiTokenizer(cfg.language);
    } catch (e) {
      console.warn(`Language "${cfg.language}" not registered, falling back to plain text.`);
      tokenizer = new PlainTokenizer();
      cfg.language = 'txt'; // Also update the class name used later
    }

    this._resetTokenizer(tokenizer);

    const lines = el.textContent.split('\n');
    let html = '';

    for (const line of lines) {
      for (const tok of tokenizer.tokenizeLine(line)) {
        html += tok.token
          ? `<span class="${tok.token} ${tok.lang}-${tok.token}">${escapeHtml(tok.text)}</span>`
          : escapeHtml(tok.text);
      }
      html += '\n';
    }
    el.innerHTML = html;
  },

  /* ── Highlight every <pre><code class="language‑…"> ── */
  highlight() {
    document.querySelectorAll('pre code[class*="language-"],code[class*="language-"]')
      .forEach(el => { try { this.highlightBlock(el); } catch (e) { console.warn(e); } });
  }
};

window.addEventListener('DOMContentLoaded', () => CodeDye.highlight());

export default CodeDye;
