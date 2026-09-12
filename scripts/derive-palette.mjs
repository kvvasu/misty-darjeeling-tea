/**
 * Wada palette derivation — computed, not eyeballed. (§3.2, §4.5)
 *
 * Source hues: Sanzo Wada, "A Dictionary of Color Combinations" (1933, public domain).
 * Hex values digitised from wscolors.com (159-colour table) and cross-checked
 * against sanzo-wada.dmbk.io. Plate combinations selected:
 *   #102  Ivory Buff + Orange Rufous          — surfaces + primary action
 *   #137  Etruscan Red + Cinnamon Buff + Pistachio Green — accent / warm raised / success
 *   #139  Salvia Blue + Deep Indigo + Neutral Gray       — info / deep ink / secondary text
 *
 * Rule (§3.2.3): hue is preserved from the Wada source; only lightness and chroma
 * are adjusted to hit WCAG 2.2 AA contrast. Everything authored in OKLCH.
 *
 * Outputs:
 *   theme/wada-palette.json   — machine-readable token values (light + dark, oklch + hex)
 *   logs/palette-contrast.txt — measured contrast for every documented text/background pair
 */
import {writeFileSync, mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {parse, formatCss, formatHex, oklch, rgb, differenceCiede2000} from 'culori';

const WADA = {
  ivoryBuff: '#ebd3a2',
  orangeRufous: '#c16b27',
  etruscanRed: '#c55347',
  cinnamonBuff: '#fdc57e',
  pistachioGreen: '#648f7b',
  salviaBlue: '#97acc8',
  deepIndigo: '#051230',
  neutralGray: '#b6bfc1',
  slateColor: '#34454c',
  black: '#111314',
};

/** WCAG relative luminance + contrast ratio. */
const LUM = c => {
  const r = parse(c);
  const lin = v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [R, G, B] = [r.r, r.g, r.b].map(lin);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};
export const contrast = (a, b) => {
  const [l1, l2] = [LUM(a), LUM(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

/** Convert hex -> oklch string. */
export const toOklch = hex => {
  const c = oklch(parse(hex));
  return formatCss({mode: 'oklch', l: +c.l.toFixed(4), c: +(c.c ?? 0).toFixed(4), h: Math.round(c.h ?? 0)});
};

/** Keep hue, walk lightness/chroma until contrast(target bg) >= need. */
export function adjustForContrast(hex, bgHex, need, mode) {
  let c = oklch(parse(hex));
  const bgL = oklch(parse(bgHex)).l;
  // Dark bg -> lighten; light bg -> darken.
  const dir = mode === 'dark' ? 1 : -1;
  for (let i = 0; i < 400; i++) {
    const asHex = formatHex(rgb(c));
    if (contrast(asHex, bgHex) >= need) return {oklch: formatCss({mode: 'oklch', l: +c.l.toFixed(4), c: +c.c.toFixed(4), h: Math.round(c.h)}), hex: asHex.toLowerCase()};
    const next = c.l + dir * 0.004;
    if (next > 0.985 || next < 0.06) {
      // Chroma boost fallback at the lightness rail.
      c = {...c, c: Math.min(c.c + 0.01, 0.37)};
      if (c.c >= 0.37) throw new Error(`Cannot reach ${need}:1 for ${hex} on ${bgHex}`);
      continue;
    }
    c = {...c, l: next};
  }
  throw new Error(`No convergence for ${hex} on ${bgHex}`);
}

/** Nearest Wada entry by ΔE2000 (hue honesty check for derived tokens). */
export function nearestWada(oklchStr) {
  const target = parse(oklchStr);
  let best = {name: null, dE: Infinity};
  for (const [name, hex] of Object.entries(WADA)) {
    const dE = differenceCiede2000()(target, parse(hex));
    if (dE < best.dE) best = {name, dE};
  }
  return best;
}

/* ── Surfaces (Ivory Buff family) ─────────────────────────────────────── */
export const LIGHT = {
  'color-surface-page': toOklch('#faf6ec'), // Ivory Buff lifted toward paper white
  'color-surface-raised': toOklch('#ffffff'),
  'color-surface-sunken': toOklch('#f3ecdb'),
  'color-text-primary': adjustForContrast(WADA.deepIndigo, '#faf6ec', 7, 'light').oklch, // AAA body
  'color-text-secondary': adjustForContrast(WADA.slateColor, '#faf6ec', 4.5, 'light').oklch,
  'color-text-on-action': toOklch('#fffdf7'),
  'color-border-subtle': toOklch('#e3d9c0'),
  'color-action-primary': adjustForContrast(WADA.orangeRufous, '#fffdf7', 4.5, 'light').oklch, // darkened rufous: cream text must pass AA
  'color-action-primary-hover': adjustForContrast(WADA.orangeRufous, '#fffdf7', 5.5, 'light').oklch,
  'color-accent': adjustForContrast(WADA.etruscanRed, '#faf6ec', 4.5, 'light').oklch, // Etruscan Red darkened — Astryx renders Link text in accent, needs AA
  'color-accent-soft': toOklch('#f7e3df'),
  'color-focus-ring': toOklch('#8a4a12'),
  'color-status-success': adjustForContrast('#2f6b45', '#faf6ec', 4.5, 'light').oklch, // Pistachio hue, darkened
  'color-status-warning': adjustForContrast('#8a5f14', '#faf6ec', 4.5, 'light').oklch,
  'color-status-error': adjustForContrast(WADA.etruscanRed, '#faf6ec', 4.5, 'light').oklch,
  'color-status-info': adjustForContrast('#3f5e8f', '#faf6ec', 4.5, 'light').oklch, // Salvia/Deep Lyons hue
  'color-ink-deep': toOklch(WADA.deepIndigo),
};

export const DARK = {
  'color-surface-page': toOklch('#171410'),
  'color-surface-raised': toOklch('#221e18'),
  'color-surface-sunken': toOklch('#100e0b'),
  'color-text-primary': adjustForContrast('#ece4d2', '#171410', 7, 'dark').oklch, // Ivory Buff ink
  'color-text-secondary': adjustForContrast(WADA.neutralGray, '#171410', 4.5, 'dark').oklch,
  'color-text-on-action': toOklch(WADA.deepIndigo), // dark ink on lifted rufous fill (dark-mode inversion)
  'color-border-subtle': toOklch('#3a332a'),
  'color-action-primary': adjustForContrast('#e08b4a', '#171410', 3, 'dark').oklch, // Orange Rufous, lifted
  'color-action-primary-hover': adjustForContrast('#e08b4a', '#171410', 2.5, 'dark').oklch,
  'color-accent': adjustForContrast('#e2857a', '#171410', 4.5, 'dark').oklch, // Etruscan Red lifted — accent text needs AA on dark page
  'color-accent-soft': toOklch('#3a2622'),
  'color-focus-ring': toOklch('#f0a878'),
  'color-status-success': adjustForContrast('#7db894', '#171410', 4.5, 'dark').oklch,
  'color-status-warning': adjustForContrast('#d9b35c', '#171410', 4.5, 'dark').oklch,
  'color-status-error': adjustForContrast('#e8897f', '#171410', 4.5, 'dark').oklch,
  'color-status-info': adjustForContrast('#9db8dd', '#171410', 4.5, 'dark').oklch,
  'color-ink-deep': toOklch('#0b1226'),
};

/* ── Contrast report: every documented pair, both modes ───────────────── */
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
const pageL = formatHex(rgb(parse(LIGHT['color-surface-page'])));
const pageD = formatHex(rgb(parse(DARK['color-surface-page'])));
const raisedL = '#ffffff';
const raisedD = formatHex(rgb(parse(DARK['color-surface-raised'])));
const actionL = formatHex(rgb(parse(LIGHT['color-action-primary'])));
const actionD = formatHex(rgb(parse(DARK['color-action-primary'])));

const report = [];
const row = (mode, fgToken, fg, bgName, bg, need) => {
  const ratio = contrast(fg, bg);
  report.push({mode, fg: fgToken, bg: bgName, ratio: +ratio.toFixed(2), need, pass: ratio >= need});
};
for (const [mode, T, page, raised, action] of [
  ['light', LIGHT, pageL, raisedL, actionL],
  ['dark', DARK, pageD, raisedD, actionD],
]) {
  const textP = formatHex(rgb(parse(T['color-text-primary'])));
  const textS = formatHex(rgb(parse(T['color-text-secondary'])));
  const onAction = formatHex(rgb(parse(T['color-text-on-action'])));
  const focus = formatHex(rgb(parse(T['color-focus-ring'])));
  const accent = formatHex(rgb(parse(T['color-accent'])));
  row(mode, 'color-text-primary', textP, 'surface-page', page, 4.5);
  row(mode, 'color-text-primary', textP, 'surface-raised', raised, 4.5);
  row(mode, 'color-text-secondary', textS, 'surface-page', page, 4.5);
  row(mode, 'color-text-secondary', textS, 'surface-raised', raised, 4.5);
  row(mode, 'color-text-accent (Link text)', accent, 'surface-page', page, 4.5);
  row(mode, 'color-text-on-action', onAction, 'action-primary', action, 4.5);
  row(mode, 'color-focus-ring', focus, 'surface-page', page, 3);
  row(mode, 'color-focus-ring', focus, 'surface-raised', raised, 3);
  for (const [name, tok] of [['success', 'color-status-success'], ['warning', 'color-status-warning'], ['error', 'color-status-error'], ['info', 'color-status-info']]) {
    row(mode, tok, formatHex(rgb(parse(T[tok]))), 'surface-page', page, 4.5);
  }
}

const out = {meta: {generated: new Date().toISOString(), oklchOnly: 'hue preserved from Wada sources; L/C adjusted for WCAG 2.2 AA', plates: {'#102': ['Ivory Buff', 'Orange Rufous'], '#137': ['Etruscan Red', 'Cinnamon Buff', 'Pistachio Green'], '#139': ['Salvia Blue', 'Deep Indigo', 'Neutral Gray']}, wadaSources: ['https://sanzo-wada.dmbk.io/', 'https://wscolors.com/colors (digitised 159-colour table)', 'https://colors.elwyn.co/ (combination index)']}, light: LIGHT, dark: DARK, contrast: report};
mkdirSync('theme', {recursive: true});
mkdirSync('logs', {recursive: true});
writeFileSync('theme/wada-palette.json', JSON.stringify(out, null, 2) + '\n');
const lines = report.map(r => `${r.pass ? 'PASS' : 'FAIL'}  ${r.mode.padEnd(5)} ${r.fg.padEnd(26)} on ${r.bg.padEnd(16)} ${String(r.ratio).padStart(5)}:1 (need ${r.need}:1)`);
writeFileSync('logs/palette-contrast.txt', `WADA PALETTE CONTRAST REPORT — WCAG 2.2 (computed ${out.meta.generated})\n\n${lines.join('\n')}\n\nFAILURES: ${report.filter(r => !r.pass).length}\n`);
console.log(lines.join('\n'));
console.log(`\nFAILURES: ${report.filter(r => !r.pass).length}`);
}
