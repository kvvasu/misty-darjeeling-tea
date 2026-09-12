/**
 * §3.4 (GitHub Pages variant) — CSP hash injection.
 *
 * Next.js's static export inlines several scripts per page: our pre-paint
 * theme script PLUS the framework's own hydration/flight-data bootstraps.
 * Their hashes cannot be known before the build (they change whenever page
 * data changes), so the authoritative policy is computed FROM the emitted
 * HTML: every inline <script> in out/ is hashed and the complete hash set is
 * injected into each page's <meta http-equiv="Content-Security-Policy">.
 *
 * Runs as `postbuild` (after the export exists). The earlier
 * scripts/compute-csp-hash.mjs keeps writing public/_headers from the
 * theme-script source — the host-portability header artifact — while this
 * step makes the *actually served* meta CSP exact and stale-hash-proof.
 * Manual hash entry is a BLOCKING failure; nothing here is hand-maintained.
 */
import {readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

const out = 'out';
if (!statSync(out).isDirectory?.()) throw new Error('BLOCKING: out/ missing — run the build first');

const walk = dir => {
  let files = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) files = files.concat(walk(p));
    else files.push(p);
  }
  return files;
};

const htmlFiles = walk(out).filter(f => f.endsWith('.html'));
if (htmlFiles.length === 0) throw new Error('BLOCKING: no HTML files in out/');

// Collect every distinct inline script body across the export.
const bodies = new Set();
for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const body = m[1];
    if (body.trim().length > 0) bodies.add(body);
  }
}
if (bodies.size === 0) throw new Error('BLOCKING: no inline scripts found — CSP would be empty');

const hashes = [...bodies]
  .map(b => `'sha256-${createHash('sha256').update(b, 'utf8').digest('base64')}'`)
  .sort();

// Start from the theme-script-derived policy so directives stay in sync.
const themeSrc = readFileSync('app/theme-script.ts', 'utf8');
const tm = themeSrc.match(/THEME_SCRIPT = `([^`]*)`;/);
if (!tm) throw new Error('BLOCKING: THEME_SCRIPT not found');
const themeScript = tm[1].replace(/\\\`/g, '`').replace(/\\\$/g, '$').replace(/\\\\/g, '\\');
const themeHash = `'sha256-${createHash('sha256').update(themeScript, 'utf8').digest('base64')}'`;

const scriptSrc = ["'self'", ...hashes.filter(h => h !== themeHash), themeHash].join(' ');

const cspDirectives = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
];

// frame-ancestors / sandbox / upgrade-insecure-requests / report-uri are
// IGNORED when a CSP is delivered via <meta> — and Chromium logs a console
// warning for frame-ancestors, which would itself cost Best-Practices
// points. They remain in public/_headers (header-delivered, where they work).
const IGNORED_IN_META = ['frame-ancestors', 'upgrade-insecure-requests', 'sandbox', 'report-uri'];
const csp = cspDirectives.filter(d => !IGNORED_IN_META.some(i => d.startsWith(i))).join('; ');

let patched = 0;
for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  const metaRe = /<meta http-equiv="Content-Security-Policy" content="[^"]*"/;
  const meta = `<meta http-equiv="Content-Security-Policy" content="${csp.replace(/"/g, '&quot;')}"`;
  let next;
  if (metaRe.test(html)) {
    next = html.replace(metaRe, meta);
  } else {
    // No placeholder meta present — inject one right after <head>.
    next = html.replace(/<head>/, `<head>${meta}/>`);
  }
  if (next !== html) {
    writeFileSync(f, next);
    patched++;
  }
}

console.log(`[csp-inject] hashed ${bodies.size} distinct inline scripts across ${htmlFiles.length} pages`);
console.log(`[csp-inject] script-src: ${scriptSrc}`);
console.log(`[csp-inject] patched ${patched}/${htmlFiles.length} pages`);
if (patched !== htmlFiles.length) throw new Error('BLOCKING: some pages were not patched with the meta CSP');
