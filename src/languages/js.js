/* ────────────────  languages/js.js  ──────────────── */
import { registerLanguage } from '../utils.js';
import CodeDye from '../codedye.js';    
export function getJsRules() {
   return {
      // Set to 'invalid' to help detect un-tokenized elements
      defaultToken: 'invalid',
      tokenPostfix: '.js',

      // ─────────────── Keywords ───────────────
      keywords: [
         'break', 'case', 'catch', 'class', 'continue', 'const',
         'constructor', 'debugger', 'default', 'delete', 'do', 'else',
         'export', 'extends', 'false', 'finally', 'for', 'from', 'function',
         'get', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null',
         'return', 'set', 'super', 'switch', 'symbol', 'this', 'throw', 'true',
         'try', 'typeof', 'undefined', 'var', 'void', 'while', 'with', 'yield',
         'async', 'await', 'of'
      ],

      typeKeywords: [
         'any', 'boolean', 'number', 'object', 'string', 'undefined'
      ],

      operators: [
         '<=', '>=', '==', '!=', '===', '!==', '=>', '+', '-', '**',
         '*', '/', '%', '++', '--', '<<', '</', '>>', '>>>', '&',
         '|', '^', '!', '~', '&&', '||', '?', ':', '=', '+=', '-=',
         '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=',
         '^=', '@',
      ],

      // ─────────────── Regex Utilities ───────────────
      symbols: /[=><!~?:&|+\-*\/\^%]+/,
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      digits: /\d+(_+\d+)*/,
      octaldigits: /[0-7]+(_+[0-7]+)*/,
      binarydigits: /[0-1]+(_+[0-1]+)*/,
      hexdigits: /[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
      regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
      regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

      // ─────────────── Main Tokenizer ───────────────
      tokenizer: {
         root: [
            [/[{}]/, 'delimiter.bracket'],

            // 🎯 Flow-control keywords (highlighted separately)
            [/\b(?:if|else|for|while|do|switch|case|break|continue|return|await|yield|throw|try|catch|finally|import|export|from)\b/, 'keyword.flow'],

            // 🎯 Declaration keywords
            [/\b(?:const|let|var|function|class|async|default|extends|new|typeof|instanceof|in|of)\b/, 'keyword.declaration'],

            // 🎯 Object name followed by property access
            [/(?!\b(?:Array|Math|Date|JSON|Promise|String|Number|Boolean|RegExp|Error|Object|Function)\b)([a-zA-Z_$][\w$]*)(?=(\.[a-zA-Z_$][\w$]*)+)/, 'objectName'],

            // 🎯 Function calls (non-class identifiers followed by ())
            [/\b(?![A-Z][\w$]*\b)[a-zA-Z_$][\w$]*(?=\()/, 'functionName'],

            // Include generic/common rules
            { include: 'common' }
         ],

         // ─────────────── Common Rules ───────────────
         common: [
            // Identifiers and keywords
            [/[a-z_$][\w$]*/, {
               cases: {
                  '@typeKeywords': 'keyword',
                  '@keywords': 'keyword',
                  '@default': 'identifier'
               }
            }],
            [/[A-Z][\w\$]*/, 'type.identifier'], // Class names

            { include: '@whitespace' },

            // 🎯 Regular expressions (very carefully matched)
            [/\/(?=([^\\\/]|\\.)+\/([gimsuy]*)(\s*)(\.|;|\/|,|\)|\]|\}|$))/, { token: 'regexp', bracket: '@open', next: '@regexp' }],

            // Brackets and delimiters
            [/[()\[\]]/, 'delimiter.bracket'],
            [/[<>](?!@symbols)/, 'delimiter.bracket'],
            [/@symbols/, {
               cases: {
                  '@operators': 'delimiter',
                  '@default': ''
               }
            }],

            // Numbers
            [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
            [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
            [/0[xX](@hexdigits)/, 'number.hex'],
            [/0[oO]?(@octaldigits)/, 'number.octal'],
            [/0[bB](@binarydigits)/, 'number.binary'],
            [/(@digits)/, 'number'],

            [/[;,.]/, 'delimiter'],

            // Strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
            [/'([^'\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
            [/`/, 'string', '@string_backtick'],
         ],

         // ─────────────── Whitespace & Comments ───────────────
         whitespace: [
            [/[ \t\r\n]+/, ''],
            [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
         ],

         comment: [
            [/[^\/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[\/*]/, 'comment']
         ],

         jsdoc: [
            [/[^\/*]+/, 'comment.doc'],
            [/\*\//, 'comment.doc', '@pop'],
            [/[\/*]/, 'comment.doc']
         ],

         // ─────────────── RegExp Tokenizer ───────────────
         regexp: [
            [/(\{)(\d+(?:,\d*)?)(\})/, ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']],
            [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]],
            [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
            [/[()]/, 'regexp.escape.control'],
            [/@regexpctl/, 'regexp.escape.control'],
            [/[^\\\/]+/, 'regexp'],
            [/@regexpesc/, 'regexp.escape'],
            [/\\\./, 'regexp.invalid'],
            [/(\/)([gimsuy]*)/, [{ token: 'regexp', bracket: '@close', next: '@pop' }, { token: 'regexp.escape.other' }]],
         ],

         regexrange: [
            [/-/, 'regexp.escape.control'],
            [/\^/, 'regexp.invalid'],
            [/@regexpesc/, 'regexp.escape'],
            [/[^\]]/, 'regexp'],
            [/\]/, { token: 'regexp.escape.control', next: '@pop', bracket: '@close' }],
         ],

         // ─────────────── Strings ───────────────
         string_double: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop']
         ],

         string_single: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop']
         ],

         string_backtick: [
            [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
            [/[^\\`$]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/`/, 'string', '@pop']
         ],

         // ─────────────── Embedded ${} in template strings ───────────────
         bracketCounting: [
            [/\{/, 'delimiter.bracket', '@bracketCounting'],
            [/\}/, 'delimiter.bracket', '@pop'],
            { include: 'common' }
         ],
      },
   };
}
registerLanguage('js', getJsRules);
if (typeof window !== 'undefined' && !window.CodeDye) {
   window.CodeDye = CodeDye;
 }