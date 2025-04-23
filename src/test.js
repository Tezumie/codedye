/* ────────────────  languages/css.js  ──────────────── */
import { registerLanguage } from '../utils.js';
import CodeDye from '../codedye.js';

export function getCssRules() {
  return {
    defaultToken: '',
    tokenPostfix: '.css',

    keywords: [
      '@charset', '@import', '@namespace', '@media', '@supports', '@document',
      '@font-face', '@page', '@counter-style', '@font-feature-values',
      '@keyframes', '@-webkit-keyframes', '@-moz-keyframes', '@-o-keyframes'
    ],

    tokenizer: {
      root: [
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],

        // 🎯 At-rules (e.g. @media, @keyframes)
        [/@-?(webkit-|moz-|o-)?keyframes\b/, 'keyword.at-rule.keyframes'],
        [/@[a-zA-Z\-]+/, {
          cases: {
            '@keywords': 'keyword.at-rule',
            '@default': 'keyword'
          }
        }],

        // 🎯 Keyframe identifiers
        [/(@(?:-webkit-|-moz-|-o-)?keyframes\s+)([a-zA-Z_-][\w-]*)/, [
          'keyword.at-rule.keyframes', // @keyframes
          'entity.name.function.keyframes' // animation name
        ]],

        // 🎯 Selectors (fallback match before '{')
        [/[^@{};]+(?=\{)/, 'selector'],

        // 🎯 Blocks
        [/\{/, { token: 'delimiter.bracket', next: '@block' }]
      ],

      block: [
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],
        [/\}/, { token: 'delimiter.bracket', next: '@pop' }],

        // Keyframe step (0%, from, to)
        [/(\d+%|from|to)/, 'constant.numeric'],
        [/[A-Za-z_-][\w-]*(?=\s*:)/, 'attribute.name'], // property name
        [/:\s*/, 'delimiter'],
        { include: '@value' },
        [/;/, 'delimiter']
      ],

      value: [
        [/[ \t\r\n]+/, ''],
        [/-?\d*\.?\d+(em|rem|px|vw|vh|%|s|ms)?/, 'number'],
        [/#([0-9a-fA-F]{3,8})/, 'number.hex'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/([a-zA-Z\-]+)(\()/, ['function', { token: 'delimiter.parenthesis', next: '@func' }]],
        [/!important\b/, 'keyword'],
        [/::?[a-zA-Z\-]+/, {
          cases: {
            '@pseudoClasses': 'keyword',
            '@pseudoElements': 'keyword',
            '@default': 'attribute.name'
          }
        }],
        [/[a-zA-Z\-_]+/, 'identifier']
      ],

      func: [
        { include: '@value' },
        [/\)/, 'delimiter.parenthesis', '@pop']
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
      ],

      comment: [
        [/[^*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/./, 'comment']
      ]
    },

    keywords: [
      '@charset', '@import', '@namespace', '@media', '@supports', '@document',
      '@font-face', '@page', '@counter-style', '@font-feature-values',
      '@keyframes', '@-webkit-keyframes', '@-moz-keyframes', '@-o-keyframes'
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

registerLanguage('css', getCssRules);
if (typeof window !== 'undefined' && !window.CodeDye) {
  window.CodeDye = CodeDye;
}
