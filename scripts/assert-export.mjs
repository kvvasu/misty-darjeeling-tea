/**
 * §4.3 — build validation. Asserts the static export actually contains the
 * expected HTML routes and a compiled StyleX stylesheet. A build that "succeeds"
 * but emits no StyleX CSS is a silent failure — this makes it loud.
 */
import {readdirSync, statSync, readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const out = 'out';
if (!existsSync(out)) throw new Error('BLOCKING: out/ missing — export did not run');

const walk = dir => {
  let files = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) files = files.concat(walk(p));
    else files.push(p);
  }
  return files;
};

const files = walk(out);
const html = files.filter(f => f.endsWith('.html'));
const css = files.filter(f => f.endsWith('.css'));

// StyleX assertion: compiled StyleX CSS carries the `x-` product class prefix
// or astryx atomic classes. A CSS bundle without either means StyleX never ran.
const cssHasStylex = css.some(f => {
  const content = readFileSync(f, 'utf8');
  return /\.astryx[0-9a-z]{6,}|\.x[0-9a-z]{6,}/i.test(content);
});

if (!cssHasStylex) {
  throw new Error('BLOCKING: no compiled StyleX CSS found in out/ — silent style failure');
}

const report = {
  htmlRoutes: html.map(f => f.replace(/^out\//, '')),
  cssFiles: css.map(f => f.replace(/^out\//, '')),
  stylexCss: cssHasStylex,
};

console.log('[assert-export] HTML routes:', report.htmlRoutes.join(', '));
console.log('[assert-export] CSS files:', report.cssFiles.length, '| StyleX CSS present:', report.stylexCss);

if (html.length === 0) throw new Error('BLOCKING: no HTML routes in out/');
console.log('[assert-export] PASS');
