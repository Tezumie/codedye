// utils.js

const _langRuleCache = new Map();
const _ruleLoaders = new Map();

/**
 * Register a language dynamically
 */
export function registerLanguage(lang, loaderFn) {
    _ruleLoaders.set(lang, loaderFn);
  }
/**
 * Detect from class="language-xxx"
 */
export function detectLangFromClass(el) {
  for (const cls of el.classList) {
    if (cls.startsWith('language-')) return cls.slice(9);
  }
  return 'js';
}

export function getRulesFor(lang = 'js') {
    if (_langRuleCache.has(lang)) return _langRuleCache.get(lang);
  
    const loader = _ruleLoaders.get(lang);
    if (typeof loader !== 'function') {
      throw new Error(`Language "${lang}" not registered`);
    }
  
    const rules = loader();
    _langRuleCache.set(lang, rules);
    return rules;
  }

// Optional utility functions
const _escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const _escapeRe = /[&<>"']/g;
export function escapeHtml(str = '') {
  return str.replace(_escapeRe, c => _escapeMap[c]);
}

export function debounce(fn, ms = 0) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
