import {test, expect} from '@playwright/test';
import {AxeBuilder} from '@axe-core/playwright';
import {writeFileSync, mkdirSync} from 'node:fs';
import {parse, rgb, formatHex, oklch, differenceCiede2000} from 'culori';

/**
 * §4.4–§4.5 QA gates. Serves ./out via Playwright's static server
 * (playwright.config.ts), scans every route in BOTH colour modes with axe
 * (zero critical/serious allowed), captures screenshots at 4 breakpoints × 2
 * modes, asserts rendered colours match documented Wada tokens (ΔE2000 ≤ 1.0
 * in a common colour space — never string comparison), and checks SC 2.5.8
 * target sizes on the contact form.
 */

const BP = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const ROUTES = ['/', '/teas/', '/estate/', '/brew-guide/', '/contact/', '/thank-you/', '/404.html'].map(
  r => `${BP}${r}`,
);
const VIEWPORTS = [
  {name: '1440', width: 1440, height: 900},
  {name: '1024', width: 1024, height: 768},
  {name: '768', width: 768, height: 1024},
  {name: '390', width: 390, height: 844},
];

mkdirSync('qa/axe', {recursive: true});
mkdirSync('qa/screenshots', {recursive: true});
mkdirSync('qa/test-results', {recursive: true});

const axeSummaries: Array<Record<string, unknown>> = [];

async function axeScan(page: import('@playwright/test').Page, route: string, mode: 'light' | 'dark') {
  await page.goto(route, {waitUntil: 'networkidle'});
  const results = await new AxeBuilder({page})
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const violations = results.violations.filter(
    v => v.impact === 'critical' || v.impact === 'serious',
  );
  axeSummaries.push({
    route,
    mode,
    criticalOrSerious: violations.length,
    details: violations.map(v => ({id: v.id, impact: v.impact, nodes: v.nodes.length, summary: v.help})),
  });
  expect(violations, `${route} [${mode}]: ${JSON.stringify(violations.map(v => v.id))}`).toEqual([]);
}

test.describe('axe scans — every route, both modes (§4.4)', () => {
  for (const route of ROUTES) {
    for (const mode of ['light', 'dark'] as const) {
      test(`${route} [${mode}]`, async ({page}) => {
        await page.emulateMedia({colorScheme: mode});
        await axeScan(page, route, mode);
      });
    }
  }
});

test.describe('screenshots — 4 breakpoints × 2 modes (§4.4)', () => {
  for (const vp of VIEWPORTS) {
    for (const mode of ['light', 'dark'] as const) {
      test(`home @ ${vp.name}px ${mode}`, async ({page}) => {
        await page.setViewportSize({width: vp.width, height: vp.height});
        await page.emulateMedia({colorScheme: mode});
        await page.goto(`${BP}/`, {waitUntil: 'networkidle'});
        await page.screenshot({path: `qa/screenshots/home-${vp.name}-${mode}.png`, fullPage: true});
      });
      test(`teas @ ${vp.name}px ${mode}`, async ({page}) => {
        await page.setViewportSize({width: vp.width, height: vp.height});
        await page.emulateMedia({colorScheme: mode});
        await page.goto(`${BP}/teas/`, {waitUntil: 'networkidle'});
        await page.screenshot({path: `qa/screenshots/teas-${vp.name}-${mode}.png`, fullPage: true});
      });
    }
  }
});

test.describe('palette synchronisation (§4.5)', () => {
  const dE = (a: string, b: string) => differenceCiede2000()(parse(a)!, parse(b)!);

  test('rendered tokens match documented Wada palette, both modes', async ({page}) => {
    const outcomes: Array<Record<string, unknown>> = [];

    for (const mode of ['light', 'dark'] as const) {
      await page.emulateMedia({colorScheme: mode});
      await page.goto(`${BP}/`, {waitUntil: 'networkidle'});

      const probe = await page.evaluate(() => {
        const styleOf = (el: Element) => getComputedStyle(el);
        const body = styleOf(document.body);
        const h1 = styleOf(document.querySelector('h1')!);
        const link = styleOf(document.querySelector('header nav ul a')!);
        const button = document.querySelector('header button');
        return {
          pageBg: body.backgroundColor,
          bodyText: body.color,
          headingText: h1.color,
          linkText: link.color,
          buttonBg: button ? styleOf(button).backgroundColor : null,
        };
      });

      const expectedPairs: Array<[string, string, string]> = [
        ['pageBg', 'color-surface-page', mode === 'light' ? '#faf6ec' : '#171410'],
        ['bodyText', 'color-text-primary', mode === 'light' ? '#051230' : '#ece4d2'],
        ['headingText', 'color-text-primary', mode === 'light' ? '#051230' : '#ece4d2'],
        ['linkText', 'color-text-accent', mode === 'light' ? '#bd4b41' : '#e2857a'],
      ];

      for (const [prop, token, docHex] of expectedPairs) {
        const rendered = (probe as Record<string, string | null>)[prop] ?? '';
        // Normalise both sides into a common colour space (oklch), then ΔE2000.
        const renderedOklch = formatCssSafe(rendered);
        const docOklch = formatCssSafe(docHex);
        const delta = dE(renderedOklch, docOklch);
        outcomes.push({mode, prop, token, rendered, docHex, deltaE2000: +delta.toFixed(3), pass: delta <= 1.0});
        expect(delta, `${mode}/${prop}: rendered ${rendered} vs doc ${docHex} dE=${delta}`).toBeLessThanOrEqual(1.0);
      }
    }
    writeFileSync('qa/test-results/palette-sync.json', JSON.stringify(outcomes, null, 2));
  });

  // Helper local to this test file
  function formatCssSafe(color: string): string {
    const parsed = parse(color) ?? parse(normalise(color));
    if (!parsed) throw new Error(`Unparseable colour: ${color}`);
    const o = oklch(parsed);
    return `oklch(${o!.l} ${o!.c} ${o!.h ?? 0})`;
  }
  function normalise(color: string): string {
    // computed rgb() strings parse natively; keep for safety
    return color;
  }

  test('contrast of rendered text pairs (computed, both modes)', async ({page}) => {
    const lum = (hex: string) => {
      const c = rgb(parse(hex)!) as {r: number; g: number; b: number};
      const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    };
    const ratio = (a: string, b: string) => {
      const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    };
    const toHex = (color: string) => formatHex(parse(color)!);

    const results: Array<Record<string, unknown>> = [];
    for (const mode of ['light', 'dark'] as const) {
      await page.emulateMedia({colorScheme: mode});
      await page.goto(`${BP}/`, {waitUntil: 'networkidle'});
      const probe = await page.evaluate(() => {
        const body = getComputedStyle(document.body);
        return {bg: body.backgroundColor, fg: body.color};
      });
      const r = ratio(toHex(probe.fg), toHex(probe.bg));
      results.push({mode, fg: probe.fg, bg: probe.bg, ratio: +r.toFixed(2), pass: r >= 4.5});
      expect(r, `${mode} body text contrast`).toBeGreaterThanOrEqual(4.5);
    }
    writeFileSync('qa/test-results/contrast-rendered.json', JSON.stringify(results, null, 2));
  });
});

test.describe('SC 2.5.8 target size (§3.5)', () => {
  test('contact form interactive targets >= 24px', async ({page}) => {
    await page.goto(`${BP}/contact/`, {waitUntil: 'networkidle'});
    const targets = page.locator('button, a, input, [role="combobox"]');
    const count = await targets.count();
    const checked: Array<Record<string, unknown>> = [];
    for (let i = 0; i < Math.min(count, 15); i++) {
      const el = targets.nth(i);
      if (!(await el.isVisible())) continue;
      const box = await el.boundingBox();
      if (!box) continue;
      const ok = box.width >= 24 && box.height >= 24;
      checked.push({index: i, w: +box.width.toFixed(1), h: +box.height.toFixed(1), pass: ok});
      expect(ok, `target ${i}: ${box.width}x${box.height}`).toBe(true);
    }
    writeFileSync('qa/test-results/target-sizes.json', JSON.stringify(checked, null, 2));
  });

  test('theme toggle >= 24px and keyboard operable (§3.3, SC 2.5.8)', async ({page}) => {
    await page.goto(`${BP}/`, {waitUntil: 'networkidle'});
    const toggle = page.getByRole('button', {name: /switch to (dark|light) mode/i});
    const box = await toggle.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);
    await toggle.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const attr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(['light', 'dark']).toContain(attr);
  });
});

test.afterAll(async () => {
  writeFileSync('qa/axe/axe-summary.json', JSON.stringify(axeSummaries, null, 2));
});
