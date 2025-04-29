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
- ✅ JSON (`json`)

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

### 🧑‍🎨 Create Custom Themes Easily

Want to build your own theme?

I've included a ready-to-edit base template at: `src/themes/custom-theme.css`

This file replicates the structure of our built-in themes but uses `:root` variables for every major token color.  
💡 Just tweak the variables at the top — no need to touch the rest of the selectors.

   ```css
:root {
  --editor-background: #1e1e1e;
  --editor-foreground: #d4d4d4;
  --color-keyword: #569cd6;
  --color-string: #ce9178;
  /* ...and so on */
}
   ```

The rest of the theme uses these variables under the hood:

   ```css
.keyword { color: var(--color-keyword); }
.string  { color: var(--color-string); }
/* etc. */
   ```

This makes it super easy to create and preview new themes  
without digging through hundreds of lines of styles.

---

## 🔍 Monarch-Style Tokenizer (Monaco/VS Code vs. CodeDye)

Monaco Editor (and by extension VS Code) ships with a powerful, TypeScript-based Monarch tokenizer and a rich ecosystem of TextMate grammars—ideal for large IDEs but sometimes heavy for smaller projects.  

**CodeDye’s approach**  
- 📝 **Pure JavaScript** — no TypeScript, no external dependencies  
- 🔍 **Monarch-inspired rules** — you write the same familiar `tokenizer` object, but in plain JS  
- ⚙️ **Runtime-friendly** — small footprint that runs in any browser or Node environment  
- 🔄 **Drop-in compatibility** — many existing Monarch grammars “just work” with minor tweaks  
- ✨ **Easily extendable** — add or override language rules quick and easy

> **Why this matters:**  
> - If you just need syntax highlighting in a widget or small site, CodeDye loads in a tiny script.  
> - You get the expressiveness of Monarch’s rule syntax without pulling in the entire Monaco editor.  
> - A nice balance of familiarity (Monarch grammar) and simplicity (plain JS runtime).

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
