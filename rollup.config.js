import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import virtual from '@rollup/plugin-virtual';
import fs from 'fs';
import path from 'path';

const langDir = './src/languages';

const languageFiles = fs.readdirSync(langDir)
  .filter(f => f.endsWith('.js'))
  .map(f => `import '${path.posix.join('src/languages', f)}';`)
  .join('\n');


// Virtual module named `virtual:all-langs`
const virtualAllLangs = virtual({
  'virtual:all-langs': languageFiles
});

const make = (input, out) => ({
  input,
  output: {
    file: `dist/builds/${out}`,
    format: 'umd',
    name: 'CodeDye',
    sourcemap: true
  },
  plugins: [virtualAllLangs, resolve(), terser()]
});

export default [
  make('src/languages/md.js',  'codedye.md.umd.js'),
  make('src/languages/py.js',  'codedye.py.umd.js'),
  make('src/languages/js.js',   'codedye.js.umd.js'),
  make('src/languages/css.js',  'codedye.css.umd.js'),
  make('src/languages/html.js', 'codedye.html.umd.js'),
  make('virtual:all-langs',     'codedye.all.umd.js') // 🪄 Dynamic full build
];
