```md
# 🎨 CodeDye

**CodeDye** is a lightweight, dependency-free syntax highlighter with Monaco/VS Code–style tokenization. It supports live previews, static highlighting, and custom theming — perfect for docs, playgrounds, and dev tools.

> Try the [🔗 Live Playground Demo](./demo/index.html)

---

## 🚀 Features

- 🔧 **Accurate** token-based highlighting (VS Code-style)
- ⚡ **Fast** and dependency-free (no Prism/Highlight.js)
- 🎛️ **Live preview** mode with debounce support
- 🌈 **Custom themes** with fine-grained token control
- 🧠 **Auto language detection** for static blocks
- 💡 **Built-in support** for: JavaScript, CSS, HTML, Python, Markdown

---

## 📦 Installation

+++html
<!-- 1) Add a theme -->
<link rel="stylesheet" href="themes/vs-code-dark.css" />

<!-- 2) Load CodeDye UMD bundle -->
<script src="builds/codedye.all.umd.js"></script>
+++

> Or load individual bundles per language (e.g. `codedye.css.umd.js`) to keep things lean.

---

## ✍️ Usage

### 🔧 Live Preview

+++js
CodeDye.init({
  source: '#editor',      // <textarea> selector or element
  target: '#preview',     // <pre> or <div> selector or element
  language: 'js',         // 'js' | 'html' | 'css' | 'py' | 'md'
  debounce: 30            // optional (ms)
});
+++

### 📄 Static Highlighting

Highlight all code blocks with a `language-xxx` class:

+++js
CodeDye.highlight(); // Call once after DOMContentLoaded
+++

Or highlight a single block:

+++js
CodeDye.highlightBlock('#someCodeBlock');
+++

### 🎨 Custom Highlighting to String

Convert code to highlighted HTML string:

+++js
const html = CodeDye.highlightElement('const x = 1;', { language: 'js' });
+++

---

## 🌐 Supported Languages

- JavaScript / TypeScript (`js`, `ts`)
- HTML (`html`)
- CSS (`css`)
- Python (`py`)
- Markdown (`md`)

> You can register new languages by implementing tokenizer rules in `src/languages/`.

---

## 🎨 Themes

Comes with two built-in themes:

- `vs-code-dark.css`
- `vs-code-light.css`

Theme files target language-aware classes like:

+++html
<span class="keyword css-keyword">...</span>
<span class="string py-string">...</span>
+++

You can build your own theme by overriding these styles.

---

## 🧩 Rollup Build

Languages are modular and bundled with Rollup:

```bash
# Full build (all languages)
codedye.all.umd.js

# Individual language builds
codedye.css.umd.js
codedye.js.umd.js
codedye.py.umd.js
...
```

To create new language builds, just add a `.js` file under `src/languages/` and re-run Rollup.

---

## 🛠️ Development

```bash
# Install dependencies (just dev tools like rollup)
npm install

# Build all UMD bundles
npm run build
```

> Rollup plugins include `@rollup/plugin-virtual`, `resolve`, and `terser`.

---

## 📚 License

MIT License © 2025 — Built with ❤️ by you
```
