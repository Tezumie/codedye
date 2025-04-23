/* ────────────────  languages/css.js  ──────────────── */
import { registerLanguage } from '../utils.js';
import CodeDye from '../codedye.js';

export function getCssRules() {
  return {
    defaultToken: '',
    tokenPostfix: '.css',

    //CSS is WIP 

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
    ],

    tokenizer: {
      root: [
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],


        // 🎯 At-rules (e.g. @media, @keyframes)
        [/@[a-zA-Z\-]+/, {
          cases: {
            '@keywords': 'keyword.at-rule',
            '@default': 'keyword'
          }
        }],
        // 🎯 Pseudo-classes & pseudo-elements
        [/::?[A-Za-z][\w-]*/, {
          cases: {
            '@pseudoClasses': 'keyword.pseudo-class',
            '@pseudoElements': 'keyword.pseudo-element',
            '@default': 'attribute.name'
          }
        }],

        // 🎯 Selectors (fallback match before '{')
        // [/[^@{};]+(?=\{)/, 'selector'],
        [/[^@{};,][^@{};]*,/, { token: 'selector', next: '@selectors' }],
        [/[^@{};]+(?=\{)/, { token: 'selector', next: '@selectors' }],
        // 🎯 Blocks
        [/\{/, { token: 'delimiter.bracket', next: '@block' }],
      ],

      // comma-separated selectors
      selectors: [
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],
        [/\,/, 'delimiter'],
        [/::?[A-Za-z][\w-]*/, 'keyword'],          // pseudo-classes/elements
        [/[.#]?[A-Za-z_][\w-]*/, 'selector'],      // tags, IDs, classes
        [/\{/, { token: 'delimiter.bracket', next: '@block' }]
      ],

      // generic "{ … }" block
      block: [
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],
        [/\}/, { token: 'delimiter.bracket', next: '@pop' }],

        [/(\d+%|from|to)/, 'constant.numeric'],      // keyframe steps
        [/[A-Za-z_-][\w-]*(?=\s*:)/, 'attribute.name'],
        [/:\s*/, 'delimiter'],
        { include: '@value' },
        [/;/, 'delimiter'],
        [/\{/, { token: 'delimiter.bracket', next: '@block' }]  // nested
      ],

      // @keyframes block opener
      keyframesBlock: [
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],
        [/\{/, { token: 'delimiter.bracket', next: '@block' }]
      ],

      // property values
      value: [
        [/[ \t\r\n]+/, ''],
        [/-?\d*\.?\d+(?:em|rem|px|vw|vh|%|s|ms)?/, 'number'],
        [/#([0-9A-Fa-f]{3,8})/, 'number.hex'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/([A-Za-z_-][\w-]*)(\()/, ['function', { token: 'delimiter.parenthesis', next: '@func' }]],
        [/!important\b/, 'keyword'],
        [/[A-Za-z_-][\w-]*/, 'identifier']
      ],

      func: [
        { include: '@value' },
        [/\)/, 'delimiter.parenthesis', '@pop']
      ],

      // comments
      comment: [
        [/[^*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/./, 'comment']
      ],

      // strings
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
    }
  };
}

registerLanguage('css', getCssRules);
if (typeof window !== 'undefined' && !window.CodeDye) {
  window.CodeDye = CodeDye;
}
