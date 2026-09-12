/** §4.6 — compute 3-run Lighthouse medians per route. */
import {readdirSync, readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';

const dir = 'qa/lighthouse';
const files = readdirSync(dir).filter(f => f.endsWith('.json'));
const byPage = {};
for (const f of files) {
  let r;
  try {
    r = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  } catch {
    continue;
  }
  if (!r.categories || !r.requestedUrl) continue;
  const p = new URL(r.requestedUrl).pathname;
  (byPage[p] = byPage[p] || []).push(r);
}

const med = arr => {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

const summary = {};
const rows = [];
for (const [p, rs] of Object.entries(byPage)) {
  const c = k => med(rs.map(r => r.categories[k].score));
  summary[p] = {
    runs: rs.length,
    performance: c('performance'),
    accessibility: c('accessibility'),
    bestPractices: c('best-practices'),
    seo: c('seo'),
  };
  const fmt = n => (n === null ? ' n/a' : String(Math.round(n * 100)).padStart(4));
  rows.push(
    p.padEnd(15) +
      fmt(summary[p].performance) +
      fmt(summary[p].accessibility) +
      fmt(summary[p].bestPractices) +
      fmt(summary[p].seo),
  );
}

const report = `Lighthouse medians (mobile defaults, simulated throttling, 3 runs) — ${new Date().toISOString()}

PAGE            perf   a11y   bp     seo
${rows.join('\n')}
`;
mkdirSync('qa/lighthouse', {recursive: true});
writeFileSync('qa/lighthouse/medians.txt', report);
writeFileSync('qa/lighthouse/medians.json', JSON.stringify(summary, null, 2));
console.log(report);
