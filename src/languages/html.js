/* ────────────────  languages/html.js  ──────────────── */
import { registerLanguage } from '../utils.js';
import './js.js';   // html uses <script>
import './css.js';  // html uses <style>
import CodeDye from '../codedye.js';    
export function getHtmlRules() {
    return {
       defaultToken: '',
       tokenPostfix: '.html',
       ignoreCase: true,
 
       // Main tokenizer for HTML
       tokenizer: {
          root: [
             [/<!DOCTYPE/, 'metatag', '@doctype'],                             // DOCTYPE declaration
             [/<!--/, 'comment', '@comment'],                                  // HTML comment start
             [/(<)((?:[\w\-]+:)?[\w\-]+)(\s*)(\/>)/,                           // Self-closing tag
                ['delimiter', 'tag', '', 'delimiter']],
             [/(<)(script)/, ['delimiter', { token: 'tag', next: '@script' }]], // <script> tag
             [/(<)(style)/, ['delimiter', { token: 'tag', next: '@style' }]],   // <style> tag
             [/(<)((?:[\w\-]+:)?[\w\-]+)/,                                    // Opening tag
                ['delimiter', { token: 'tag', next: '@otherTag' }]],
             [/(<\/)((?:[\w\-]+:)?[\w\-]+)/,                                  // Closing tag
                ['delimiter', { token: 'tag', next: '@otherTag' }]],
             [/</, 'delimiter'],                                              // Lone < character
             [/[^<]+/],                                                       // Text content
             [/<\/style/, { token: '@rematch', embedExit: true }]             // Exiting <style> embedded mode
          ],
 
          // DOCTYPE content until >
          doctype: [
             [/[^>]+/, 'metatag.content'],
             [/>/, 'metatag', '@pop'],
          ],
 
          // HTML comments
          comment: [
             [/-->/, 'comment', '@pop'],               // End of comment
             [/[^-]+/, 'comment.content'],             // Comment body
             [/./, 'comment.content']                  // Catch-all
          ],
 
          // Generic tag attributes handler
          otherTag: [
             [/\/?>/, 'delimiter', '@pop'],            // End of tag
             [/"([^"]*)"/, 'attribute.value'],         // Double-quoted attribute value
             [/'([^']*)'/, 'attribute.value'],         // Single-quoted attribute value
             [/[\w\-]+/, 'attribute.name'],            // Attribute name
             [/=/, 'delimiter'],                       // Equals sign
             [/[ \t\r\n]+/]                            // Whitespace
          ],
 
          // ───── <script> Tag Handling ───── //
 
          script: [
             [/type/, 'attribute.name', '@scriptAfterType'], // Handle <script type=...>
             [/"([^"]*)"/, 'attribute.value'],
             [/'([^']*)'/, 'attribute.value'],
             [/[\w\-]+/, 'attribute.name'],
             [/=/, 'delimiter'],
             [/>/, { token: 'delimiter', next: '@scriptEmbedded', embedEnter: 'js' }],
             [/[ \t\r\n]+/],                             // Whitespace
             [/(<\/)(script\s*)(>)/, ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }]]
          ],
 
          scriptAfterType: [
             [/=/, 'delimiter', '@scriptAfterTypeEquals'],
             [/>/, { token: 'delimiter', next: '@scriptEmbedded', nextEmbedded: 'text/javascript' }],
             [/[ \t\r\n]+/],
             [/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
          ],
 
          scriptAfterTypeEquals: [
             [/"([^"]*)"/, { token: 'attribute.value', switchTo: '@scriptWithCustomType.$1' }],
             [/'([^']*)'/, { token: 'attribute.value', switchTo: '@scriptWithCustomType.$1' }],
             [/>/, { token: 'delimiter', next: '@scriptEmbedded', nextEmbedded: 'text/javascript' }],
             [/[ \t\r\n]+/],
             [/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
          ],
 
          scriptWithCustomType: [
             [/>/, { token: 'delimiter', next: '@scriptEmbedded.$S2', nextEmbedded: '$S2' }],
             [/"([^"]*)"/, 'attribute.value'],
             [/'([^']*)'/, 'attribute.value'],
             [/[\w\-]+/, 'attribute.name'],
             [/=/, 'delimiter'],
             [/[ \t\r\n]+/],
             [/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
          ],
 
          scriptEmbedded: [
             [/(?=<\/script)/, { token: '', next: '@pop', embedExit: true }],
             [/[^<]+/, '']
          ],
 
          // ───── <style> Tag Handling ───── //
 
          style: [
             [/type/, 'attribute.name', '@styleAfterType'],
             [/"([^"]*)"/, 'attribute.value'],
             [/'([^']*)'/, 'attribute.value'],
             [/[\w\-]+/, 'attribute.name'],
             [/=/, 'delimiter'],
             [/>/, { token: 'delimiter', next: '@styleEmbedded', embedEnter: 'css' }],
             [/[ \t\r\n]+/],
             [/(<\/)(style\s*)(>)/, ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }]],
             [/./, { token: 'invalid', next: '@styleEmbedded', embedEnter: 'css' }] // Fallback for unexpected content
          ],
 
          styleAfterType: [
             [/=/, 'delimiter', '@styleAfterTypeEquals'],
             [/>/, { token: 'delimiter', next: '@styleEmbedded', embedEnter: 'css' }],
             [/[ \t\r\n]+/],
             [/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
          ],
 
          styleAfterTypeEquals: [
             [/"([^"]*)"/, { token: 'attribute.value', switchTo: '@styleWithCustomType.$1' }],
             [/'([^']*)'/, { token: 'attribute.value', switchTo: '@styleWithCustomType.$1' }],
             [/>/, { token: 'delimiter', next: '@styleEmbedded', embedEnter: 'css' }],
             [/[ \t\r\n]+/],
             [/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
          ],
 
          styleWithCustomType: [
             [/>/, { token: 'delimiter', next: '@styleEmbedded.$S2', nextEmbedded: '$S2' }],
             [/"([^"]*)"/, 'attribute.value'],
             [/'([^']*)'/, 'attribute.value'],
             [/[\w\-]+/, 'attribute.name'],
             [/=/, 'delimiter'],
             [/[ \t\r\n]+/],
             [/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
          ],
 
          styleEmbedded: [
             [/<\/style>/, { token: '@rematch', next: '@pop', embedExit: true }],    // End of embedded style
             [/[\s\S]*?(?=<\/style>)/, ''],                                          // Match until </style>
             [/./, '']                                                               // Fallback rule
          ]
       }
    };
 }
 registerLanguage('html', getHtmlRules);
 if (typeof window !== 'undefined' && !window.CodeDye) {
   window.CodeDye = CodeDye;
 }