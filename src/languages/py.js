/* ────────────────  languages/py.js  ──────────────── */
import { registerLanguage } from '../utils.js';
import CodeDye from '../codedye.js';
export function getPyRules() {
    return {
        defaultToken: 'foreground',
        tokenPostfix: '.python',

        keywords: [
            'del', 'exec', 'print',

            'int', 'float', 'long', 'complex', 'hex',

            'abs', 'all', 'any', 'apply', 'basestring', 'bin', 'bool', 'buffer',
            'bytearray', 'callable', 'chr', 'classmethod', 'cmp', 'coerce', 'compile',
            'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'execfile',
            'file', 'filter', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash',
            'help', 'id', 'input', 'intern', 'isinstance', 'issubclass', 'iter', 'len',
            'locals', 'list', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct',
            'open', 'ord', 'pow', 'print', 'property', 'reversed', 'range', 'raw_input',
            'reduce', 'reload', 'repr', 'round', 'set', 'setattr', 'slice', 'sorted',
            'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'unichr', 'unicode',
            'vars', 'xrange', 'zip',

            '__dict__', '__methods__', '__members__', '__class__', '__bases__',
            '__name__', '__mro__', '__subclasses__', '__init__', '__import__'
        ],

        brackets: [
            { open: '{', close: '}', token: 'delimiter.curly' },
            { open: '[', close: ']', token: 'delimiter.bracket' },
            { open: '(', close: ')', token: 'delimiter.parenthesis' }
        ],

        tokenizer: {
            root: [
                { include: '@whitespace' },
                { include: '@numbers' },
                { include: '@strings' },
              
                [/[,:;]/, 'delimiter'],
                [/[{}\[\]()]/, '@brackets'],
              
                // 🎯 Control flow keywords
                [/\b(?:if|elif|else|for|while|break|continue|return|try|except|finally|raise|with|assert|pass|yield|import|from)\b/, 'keyword.flow'],
              
                // 🎯 Declaration keywords
                [/\b(?:def|class|lambda|global|as)\b/, 'keyword.declaration'],
              
                // 🎯 Logical / boolean operators
                [/\b(?:and|or|not|is|in)\b/, 'keyword.operator'],
              
                // 🎯 Decorators (e.g. @staticmethod)
                [/@[a-zA-Z_]\w*/, 'tag'],
              
                // 🎯 Identifiers used in assignment or comma/grouping contexts
                [/\b[a-z_]\w*\b(?=\s*[=,\)])/, 'identifier'],
              
                // 🎯 Class names (heuristic: capitalized)
                [/\b[A-Z][a-zA-Z0-9_]*\b/, 'type.identifier'],
              
                // 🎯 Function calls (heuristic: lowercase and followed by `(`)
                [/\b[a-z_]\w*(?=\s*\()/, 'functionName'],
              
                // 🎯 Everything else
                [/[a-zA-Z_]\w*/, {
                  cases: {
                    'self': 'keyword.self',
                    'True|False|None': 'constant.language',
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                  }
                }]
              ]
              ,

            // Deal with white space, including single and multi-line comments
            whitespace: [
                [/\s+/, 'white'],
                [/#.*/, 'comment'],

                [/'''/, 'string', '@tripleSingleQuote'],
                [/"""/, 'string', '@tripleDoubleQuote'],

            ],
            endDocString: [
                [/\\'/, 'string'],
                [/.*'''/, 'string', '@popall'],
                [/.*$/, 'string']
            ],
            endDblDocString: [
                [/\\"/, 'string'],
                [/.*"""/, 'string', '@popall'],
                [/.*$/, 'string']
            ],

            // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
            numbers: [
                [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
                [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, 'number']
            ],

            // Recognize strings, including those broken across lines with \ (but not without)
            strings: [
                [/'''/, 'string', '@tripleSingleQuote'],
                [/"""/, 'string', '@tripleDoubleQuote'],

                // ✅ Match single-line single-quoted strings
                [/'([^'\\]|\\.)*'/, 'string'],

                // ✅ Match single-line double-quoted strings
                [/"([^"\\]|\\.)*"/, 'string'],

                // ⬇ fallback to body parsing for multiline or weird cases
                [/'/, 'string', '@stringBody'],
                [/"/, 'string', '@dblStringBody']
            ],

            stringBody: [
                [/[^\\']+$/, 'string', '@popall'],
                [/[^\\']+/, 'string'],
                [/\\./, 'string'],
                [/'/, 'string.escape', '@popall'],
                [/\\$/, 'string']
            ],
            dblStringBody: [
                [/[^\\"]+$/, 'string', '@popall'],
                [/[^\\"]+/, 'string'],
                [/\\./, 'string'],
                [/"/, 'string.escape', '@popall'],
                [/\\$/, 'string']
            ],
            tripleSingleQuote: [
                [/.*?'''/, 'string', '@pop'],
                [/.*$/, 'string']
            ],

            tripleDoubleQuote: [
                [/.*?"""/, 'string', '@pop'],
                [/.*$/, 'string']
            ]


        }
    };
}
registerLanguage('py', getPyRules);
if (typeof window !== 'undefined' && !window.CodeDye) {
    window.CodeDye = CodeDye;
}