# 🎨 CodeDye

**CodeDye** is a lightweight, dependency-free syntax highlighter powered by Monaco/VS Code–style tokenization.  
It supports static code highlighting, live previews, and fully custom themes — perfect for playgrounds, docs, and dev tools.

> 🔗 [Live Playground Demo](https://tezumie.github.io/codedye/)

![Playground Screenshot](docs/demo.PNG)

---

## 🚀 Features

- 🎯 Accurate VS Code–style syntax tokenization
- ⚡ Fast, no dependencies (no Prism/Highlight.js)
- 🧠 Auto language detection from `language-xxx` classes
- 💡 Built-in support: JavaScript, CSS, HTML, Python, Markdown
- 🌈 Custom themes with per-token CSS targeting
- 🪄 Live preview for editors/playgrounds
- 🧩 Extendable with (mostly) Monaco-compatible tokenizer rules

---

## 📦 Getting Started

Include a theme + script using CDN:

```html
<!-- 1. Theme (dark or light) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Tezumie/codedye@main/dist/themes/vs-code-dark.css" />

<!-- 2. Core Script -->
<script src="https://cdn.jsdelivr.net/gh/Tezumie/codedye@main/dist/builds/codedye.all.umd.js"></script>

<!-- Optional: Other themes -->
<!-- <link rel="stylesheet" href=".../vs-code-light.css" /> -->
<!-- <link rel="stylesheet" href=".../one-dark.css" /> -->
```

---

## ✍️ Usage

### ✅ Auto Highlighting

All `<pre><code class="language-xxx">` blocks are automatically highlighted on `DOMContentLoaded`.

```html
<pre><code class="language-js">const x = 42;</code></pre>
```

---

### 🔁 Manually Re-highlight

```js
CodeDye.highlight();
```

---

### 🧱 Highlight a Specific Block

```js
CodeDye.highlightBlock(document.querySelector('#myCodeBlock'));
```

---

### ⚡ Live Preview Setup

#### Method 1: Manual control (recommended for overlays)

```js
const textarea = document.getElementById('editor');
const preview  = document.getElementById('preview');

textarea.addEventListener('input', () => {
  const html = CodeDye.highlightElement(textarea.value, { language: 'js' });
  preview.innerHTML = html.replace(/^<code[^>]*>|<\/code>$/g, '');
});
```

#### Method 2: Simple setup with `init()`

```js
CodeDye.init({
  source: '#editor',
  target: '#preview',
  language: 'js',
  debounce: 30
});
```

---

### 🔄 Convert Code to Highlighted HTML

```js
const html = CodeDye.highlightElement('const x = 1;', { language: 'js' });
```

You can inject this HTML anywhere in your DOM.

---

## 🧪 API Overview

| Method                      | Description                                           |
|----------------------------|-------------------------------------------------------|
| `highlight()`              | Re-highlights all `<pre><code>` blocks                |
| `highlightBlock(el)`       | Highlights a single code block element                |
| `highlightElement(str, options)` | Returns highlighted HTML string for raw code     |
| `init({ source, target, language, debounce })` | Live preview binding for editors     |

---

## 🌐 Supported Languages

- ✅ JavaScript / TypeScript (`js`, `ts`)
- ✅ HTML (`html`)
- ✅ CSS (`css`)
- ✅ Python (`py`)
- ✅ Markdown (`md`)

> Add your own by extending `src/languages/`.

---

## 🎨 Theming

Tokens are decorated with semantic classes for easy styling:

```html
<span class="keyword css-keyword">...</span>
<span class="string py-string">...</span>
```

### Built-in Themes

- `vs-code-dark.css`
- `vs-code-light.css`
- `one-dark.css`

To create a new theme, override token classes in your own CSS file.

---

## 🔍 Monaco Tokenizer Compatibility

CodeDye is built using the Monaco Editor’s Monarch tokenizer system, offering:

- ✅ Familiar rule syntax
- 🔁 Easy reuse of existing grammars
- 🔧 Extendability for custom languages

> Thanks to the Monaco team for making this tokenizer system open-source!

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build full and per-language UMD bundles
npm run build
```

> Powered by Rollup, Terser, and a lightweight virtual module system.

---

## 📦 Rollup Output

```bash
# Full bundle
dist/builds/codedye.all.umd.js

# Language-specific builds
dist/builds/codedye.js.umd.js
dist/builds/codedye.css.umd.js
...
```

---

## 📚 License

MIT License © 2025 — Made with ❤️ by [Tezumie](https://github.com/Tezumie)
