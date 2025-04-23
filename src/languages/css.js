/* ────────────────  languages/css.js  ──────────────── */
import { registerLanguage } from '../utils.js';
import CodeDye from '../codedye.js';

export function getCssRules() {
  return {
    defaultToken: '',
    tokenPostfix: '.css',

    // ─────────────────────────────────────────────────────
    // Tokenizer Rules
    // ─────────────────────────────────────────────────────
    tokenizer: {
      root: [
        [/[ \t\r\n]+/, ''],                          // 🆕 Consume whitespace first
        [/\/\*/, 'comment', '@comment'],             // Block comment
        [/(@)(\s*)([a-zA-Z\-]+)/, [                  // @rules
          'keyword', '',
          { cases: { '@atDirectives': 'keyword.at-rule', '@default': 'keyword' } }
        ]],
        [/[^@{};]+(?=\{)/, {                         // Selectors
          cases: { '@default': { token: 'selector', next: '@selectorBody' } }
        }]
      ],

      selectorBody: [
        [/\{/, 'delimiter.bracket'],
        [/[ \t\r\n]+/, ''],                          // 🆕 Whitespace here too
        [/\/\*/, 'comment', '@comment'],
        [/[A-Za-z_-][\w-]*(?=\s*:)/, 'attribute.name'], // property name before “:”
        [/:\s*/, 'delimiter'],                          // the colon itself
        { include: '@value' },
        [/;/, 'delimiter'],
        [/\}/, 'delimiter.bracket', '@pop'],
      ],

      value: [
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],
        [/-?\d*\.?\d+(em|rem|px|vw|vh|%|s|ms)?/, 'number'],
        [/#([0-9a-fA-F]{3,8})/, 'number.hex'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/([a-zA-Z\-]+)(\()/, ['function', { token: 'delimiter.parenthesis', next: '@func' }]],
        [/::?[a-zA-Z\-]+/, {
          cases: {
            '@pseudoClasses': 'keyword',
            '@pseudoElements': 'keyword',
            '@default': 'attribute.name'
          }
        }],
        [/!important\b/, 'keyword'],
        [/[a-zA-Z\-_]+/, 'identifier'],
      ],

      func: [
        { include: '@value' },
        [/\)/, 'delimiter.parenthesis', '@pop'],
      ],

      comment: [
        [/[^*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/./, 'comment']
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop']
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, 'string', '@pop']
      ]
    },

    atDirectives: [
      'charset', 'import', 'namespace', 'media', 'supports', 'document',
      'keyframes', '-webkit-keyframes', '-moz-keyframes', '-o-keyframes',
      'font-face', 'page', 'counter-style', 'font-feature-values'
    ],

    pseudoClasses: [
      'active', 'any', 'checked', 'default', 'disabled', 'empty', 'enabled',
      'first', 'first-child', 'first-of-type', 'fullscreen', 'focus', 'hover',
      'indeterminate', 'in-range', 'invalid', 'last-child', 'last-of-type',
      'link', 'only-child', 'only-of-type', 'optional', 'out-of-range',
      'read-only', 'read-write', 'required', 'root', 'target', 'valid', 'visited'
    ],

    pseudoElements: [
      'after', 'before', 'first-letter', 'first-line', 'selection',
      'backdrop', 'placeholder'
    ]
  };
}

// Register language
registerLanguage('css', getCssRules);
if (typeof window !== 'undefined' && !window.CodeDye) {
  window.CodeDye = CodeDye;
}
