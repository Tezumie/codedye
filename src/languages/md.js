/* ────────────────  languages/md.js  ──────────────── */
import { registerLanguage } from '../utils.js';
import './html.js';    // inline HTML support
import './js.js';      // fenced JavaScript blocks
import './css.js';     // fenced CSS blocks
import './py.js';      // fenced Python blocks
import CodeDye from '../codedye.js';

export function getMdRules() {
  return {
    defaultToken: '',
    tokenPostfix: '.md',

    control: /[\\`*_\[\]{}()#+\-.!]/,
    noncontrol: /[^\\`*_\[\]{}()#+\-.!]/,
    escapes: /\\(?:@control)/,

    // self‑closing HTML tags
    empty: ['area','base','br','col','hr','img','input','link','meta','param'],

    tokenizer: {
      root: [
        [/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/, ['white','keyword','keyword','keyword']],
        [/^\s*(=+|\-+)\s*$/, 'keyword'],
        [/^\s*((\*[ ]?)+)\s*$/, 'meta.separator'],

        [/^\s*>+/,              'comment'],
        [/^\s*([*\-+]|[0-9]+\.)\s/, 'keyword'],

        [/^(\t| {4})[^ ].*$/,    'string'],

        // fenced code (tilde)
        [/^\s*~~~\s*$/,                   { token: 'string', next: '@codeblock' }],
        [/^\s*~~~\s*(js|javascript)\s*$/, { token: 'string', next: '@codeblockjs',   embedEnter: 'js' }],
        [/^\s*~~~\s*(css)\s*$/,           { token: 'string', next: '@codeblockcss',  embedEnter: 'css' }],
        [/^\s*~~~\s*(py|python)\s*$/,     { token: 'string', next: '@codeblockpy',   embedEnter: 'py' }],
        [/^\s*~~~\s*(html?)\s*$/,         { token: 'string', next: '@codeblockhtml', embedEnter: 'html' }],

        // fenced code (backticks)
        [/^\s*```\s*$/,                    { token: 'string', next: '@codeblock' }],
        [/^\s*```\s*(js|javascript)\s*$/,  { token: 'string', next: '@codeblockjs',   embedEnter: 'js' }],
        [/^\s*```\s*(css)\s*$/,            { token: 'string', next: '@codeblockcss',  embedEnter: 'css' }],
        [/^\s*```\s*(py|python)\s*$/,      { token: 'string', next: '@codeblockpy',   embedEnter: 'py' }],
        [/^\s*```\s*(html?)\s*$/,          { token: 'string', next: '@codeblockhtml', embedEnter: 'html' }],

        // inline content + HTML tags
        { include: '@linecontent' },
      ],

      codeblock: [
        [/^\s*~~~\s*$/, { token: 'string', next: '@pop', embedExit: true }],
        [/^\s*```\s*$/, { token: 'string', next: '@pop', embedExit: true }],
        [/.*$/,           'variable.source'],
      ],
      codeblockjs:   [[/.*$/, 'variable.source'], [/^\s*```|~~~\s*$/, { token: 'string', next: '@pop', embedExit: true }]],
      codeblockcss:  [[/.*$/, 'variable.source'], [/^\s*```|~~~\s*$/, { token: 'string', next: '@pop', embedExit: true }]],
      codeblockpy:   [[/.*$/, 'variable.source'], [/^\s*```|~~~\s*$/, { token: 'string', next: '@pop', embedExit: true }]],
      codeblockhtml: [[/.*$/, 'variable.source'], [/^\s*```|~~~\s*$/, { token: 'string', next: '@pop', embedExit: true }]],

      linecontent: [
        // match opening/closing tag delimiter + tag name
        [/(<\/?)\s*([A-Za-z][\w-]*)(?=\s|>)/, ['delimiter','tag']],
        // match whitespace
        [/\s+/, 'white'],
        // match attributes (name="value" or name='value')
        [/([A-Za-z-]+)(=)("[^"]*"|'[^']*')/, ['attribute.name','delimiter','attribute.value']],
        // match closing delimiter
        [/(\/>|>)/, 'delimiter'],

        // escaped entities & markdown escapes
        [/&\w+;/,    'string.escape'],
        [/@escapes/,  'escape'],

        // markdown inline
        [/\*\*(.*?)\*\*/, 'strong'],
        [/__(.*?)__/,         'strong'],
        [/\*(.*?)\*/,       'emphasis'],
        [/_(.*?)_/,           'emphasis'],
        [/`([^`]+)`/,         'variable'],

        // links
        [/(!?\[)([^\]]+)(\]\([^\)]+\))/, ['string.link','string.link','string.link']],
        [/(!?\[)([^\]]+)(\])/,             ['string.link','string.link','string.link']],
      ]
    }
  };
}

registerLanguage('md', getMdRules);
if (typeof window !== 'undefined' && !window.CodeDye) {
  window.CodeDye = CodeDye;
}
