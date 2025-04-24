/* ────────────────  languages/css.js  ──────────────── */
import { registerLanguage } from '../utils.js';
import CodeDye from '../codedye.js';

export function getCssRules() {
  return {
    /* every un-matched character is wrapped in <span class="foreground css-foreground"> */
    defaultToken: 'foreground',
    tokenPostfix: '.css',

    /* ───── keyword tables ───── */
    keywords: [
      '@charset', '@import', '@namespace', '@media', '@supports', '@document',
      '@font-face', '@page', '@counter-style', '@font-feature-values',
      '@keyframes', '@-webkit-keyframes', '@-moz-keyframes', '@-o-keyframes'
    ],

    /* note the leading “:” / “::” in every entry ⬇ */
    pseudoClasses: [
      ':active', ':any', ':checked', ':default', ':disabled', ':empty',
      ':enabled', ':first', ':first-child', ':first-of-type', ':fullscreen',
      ':focus', ':hover', ':indeterminate', ':in-range', ':invalid',
      ':last-child', ':last-of-type', ':link', ':only-child', ':only-of-type',
      ':optional', ':out-of-range', ':read-only', ':read-write', ':required',
      ':root', ':target', ':valid', ':visited'
    ],

    pseudoElements: [
      '::after', '::before', '::first-letter', '::first-line',
      '::selection', '::backdrop', '::placeholder'
    ],

    /* ───── tokenizer definition ───── */
    tokenizer: {
      /* ───────────── root (top-level) ───────────── */
      root: [
        /* whitespace & comments */
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],

        /* @-rules */
        [/@[A-Za-z-]+/, {
          cases: { '@keywords': 'keyword.at-rule', '@default': 'keyword' }
        }],

        /* pseudo-classes / pseudo-elements (now match because arrays include the colon) */
        [/::?[A-Za-z][\w-]*/, {
          cases: {
            '@pseudoClasses': 'keyword.pseudo-class',
            '@pseudoElements': 'keyword.pseudo-element',
            '@default': 'keyword.pseudo-class'
          }
        }],

        /* selector parts */
        [/,/, 'delimiter'],          // comma
        [/[>+~]/, 'delimiter'],          // combinators
        [/\[[^\]]+\]/, 'attribute'],          // [type="text"]
        [/[.#]?[A-Za-z_-][\w-]*/, 'selector'], // tag, .class, #id, *

        /* open declaration block */
        [/\{/, { token: 'delimiter.bracket', next: '@block' }],

        /* fallback: anything else in selectors */
        [/[^@{};,]+/, 'foreground']
      ],

      /* ───────────── declaration block { … } ───────────── */
      block: [
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],
        [/\}/, { token: 'delimiter.bracket', next: '@pop' }],

        [/(\d+%|from|to)/, 'constant.numeric'],          // keyframe steps
        [/[A-Za-z_-][\w-]*(?=\s*:)/, 'attribute.name'],  // property
        [/:\s*/, 'delimiter'],

        { include: '@value' },

        [/;/, 'delimiter'],
        [/\{/, { token: 'delimiter.bracket', next: '@block' }]  // nested
      ],

      /* ───────────── property values ───────────── */
      value: [
        [/[ \t\r\n]+/, ''],
        [/-?\d*\.?\d+(?:em|rem|px|vw|vh|%|s|ms)?/, 'number'],
        [/#([0-9A-Fa-f]{3,8})/, 'number.hex'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/([A-Za-z_-][\w-]*)(\()/,
          ['function', { token: 'delimiter.parenthesis', next: '@func' }]],
        [/!important\b/, 'keyword'],
        [/[A-Za-z_-][\w-]*/, 'identifier']
      ],

      func: [
        { include: '@value' },
        [/\)/, 'delimiter.parenthesis', '@pop']
      ],

      /* comments */
      comment: [
        [/[^*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/./, 'comment']
      ],

      /* strings */
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
