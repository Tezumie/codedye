/* ──────────────── languages/json.js ──────────────── */
import { registerLanguage } from '../utils.js';
import CodeDye from '../codedye.js';

export function getJsonRules() {
    return {
      /* use empty default so unknown chars stay uncoloured instead of “invalid” */
      defaultToken: '',
      tokenPostfix: '.json',
  
      /* booleans + null */
      keywords: [ 'true', 'false', 'null' ],
  
      /* single–char punctuation */
      symbols: /[{}\[\]:,]/,
  
      /* escape sequences allowed in JSON */
      escapes: /\\(?:["\\/bfnrt]|u[0-9A-Fa-f]{4})/,
  
      /* helpers for numbers */
      digits: /\d+(_+\d+)*/,
      hexdigits: /[0-9A-Fa-f]+(_+[0-9A-Fa-f]+)*/,
  
      tokenizer: {
        root: [
          /* ── punctuation ─────────────────────────────── */
          [/{|}/, 'delimiter.bracket'],
          [/\[|\]/, 'delimiter.bracket'],
          [/[:,]/,  'delimiter'],
  
          /* ── object-key strings  ───────────────────────
             string followed (look-ahead) by optional
             whitespace and a colon → highlight as key   */
          [/\"([^\"\\]|\\.)*\"(?=\s*:)/, 'string.key'],
  
          /* ── normal string values ───────────────────── */
          [/\"([^\"\\]|\\.)*\"/, 'string.value'],
  
          /* ── numbers ────────────────────────────────── */
          [/0[xX]@hexdigits/,             'number.hex'],
          [/-?@digits\.\d+([eE][+\-]?\d+)?/, 'number.float'],
          [/-?@digits([eE][+\-]?\d+)?/,     'number'],
  
          /* ── literals (true / false / null) ─────────── */
          [/\b(?:true|false|null)\b/, 'keyword.constant'],
  
          /* ── whitespace & comments (JSON5-style) ───── */
          { include: '@whitespace' }
        ],
  
        whitespace: [
          [/[ \t\r\n]+/,  ''],
          [/\/\/.*$/,     'comment'],
          [/\/\*/,        'comment', '@comment']
        ],
  
        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//,    'comment', '@pop'],
          [/[\/*]/,   'comment']
        ]
      }
    };
  }

registerLanguage('json', getJsonRules);

if (typeof window !== 'undefined' && !window.CodeDye) {
  window.CodeDye = CodeDye;
}
