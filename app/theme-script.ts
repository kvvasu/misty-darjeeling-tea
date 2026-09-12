/**
 * Blocking inline theme script (§3.3, §3.4).
 *
 * Single source of truth for the pre-paint theme resolution. Runs BEFORE first
 * paint from <head>, sets data-theme on <html>. No cookies, no server read,
 * no middleware — the inline script alone prevents flash-of-wrong-theme.
 *
 * CSP: the SHA-256 hash of this exact string is auto-computed at build time by
 * scripts/compute-csp-hash.mjs and injected into the Netlify _headers CSP
 * (script-src). Never edit the string without rebuilding (the build does it).
 */
export const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var m=s==='light'||s==='dark'?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;
