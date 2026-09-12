import {test, expect} from '@playwright/test';
import {appendFileSync} from 'node:fs';

/**
 * Keyboard-only traversal evidence (§4.4 — automation half of the manual pass).
 *
 * Walks every interactive flow by keyboard only, recording tab order, focus
 * visibility (computed outline/box-shadow), and keyboard interactions into
 * qa/keyboard-traversal.txt. This is the reproducible evidence base; the human
 * judgement layer lives in qa/manual-a11y-notes.md.
 */

const LOG = 'qa/keyboard-traversal.txt';
const BP = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const ROUTES = ['/', '/teas/', '/estate/', '/brew-guide/', '/contact/', '/thank-you/'].map(
  r => `${BP}${r}`,
);

function describe(el: {
  tag: string; id: string; label: string | null; text: string; role: string | null;
}) {
  const parts = [el.tag];
  if (el.id) parts.push(`#${el.id}`);
  if (el.role) parts.push(`[role=${el.role}]`);
  if (el.label) parts.push(`"${el.label}"`);
  else if (el.text) parts.push(`"${el.text}"`);
  return parts.join(' ');
}

test('keyboard traversal of every route — tab order + focus visibility (§4.4)', async ({page}) => {
  appendFileSync(LOG, `\n=== Keyboard traversal run — ${new Date().toISOString()} ===\n`);
  let failures = 0;

  for (const route of ROUTES) {
    appendFileSync(LOG, `\n--- ${route} ---\n`);
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    // Skip link must be the FIRST tab stop (§4.2).
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      return {
        tag: el.tagName.toLowerCase(), id: el.id,
        label: el.getAttribute('aria-label'), text: (el.textContent ?? '').trim().slice(0, 50),
        role: el.getAttribute('role'),
        cls: el.className,
      };
    });
    const isSkipLink = !!first && first.cls.includes('skip-link');
    appendFileSync(LOG, `1. ${first ? describe(first) : '(none)'}${isSkipLink ? '  ← skip link ✓' : '  ← NOT a skip link ✗'}\n`);
    if (!isSkipLink) failures++;

    if (isSkipLink) {
      await page.keyboard.press('Enter');
      const onMain = await page.evaluate(() => document.activeElement?.id === 'main');
      appendFileSync(LOG, `   Enter on skip link → focus target: ${onMain ? '#main ✓' : 'NOT main ✗'}\n`);
      if (!onMain) failures++;
    }

    // Continue the tab walk (max 40 stops).
    for (let i = isSkipLink ? 1 : 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(), id: el.id,
          label: el.getAttribute('aria-label'), text: (el.textContent ?? '').trim().slice(0, 50),
          role: el.getAttribute('role'),
          outline: `${cs.outlineWidth} ${cs.outlineStyle}`,
          shadow: cs.boxShadow !== 'none',
        };
      });
      if (!stop) break; // wrapped past the last stop
      const visibleFocus = stop.outline !== '0px none' || stop.shadow;
      appendFileSync(
        LOG,
        `${i + 1}. ${describe(stop)}  focus: ${visibleFocus ? 'visible ✓' : 'NOT VISIBLE ✗'}\n`,
      );
      if (!visibleFocus) failures++;
    }

    // Full tab order from a fresh load (skip link NOT activated), so the walk
    // records every stop from the very first: header nav → content → footer.
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    appendFileSync(LOG, '   Full tab order (fresh load):\n');
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        return {
          tag: el.tagName.toLowerCase(), id: el.id,
          label: el.getAttribute('aria-label'), text: (el.textContent ?? '').trim().slice(0, 50),
          role: el.getAttribute('role'),
          outline: `${getComputedStyle(el).outlineWidth} ${getComputedStyle(el).outlineStyle}`,
          shadow: getComputedStyle(el).boxShadow !== 'none',
        };
      });
      if (!stop) break;
      appendFileSync(LOG, `   ${i + 1}. ${describe(stop)}${stop.outline !== '0px none' || stop.shadow ? '' : '  [no visible focus ✗]'}\n`);
    }
  }

  appendFileSync(LOG, `\n=== traversal failures: ${failures} ===\n`);
  expect(failures, 'keyboard traversal failures (see qa/keyboard-traversal.txt)').toBe(0);
});

test('keyboard flow: contact form validation is reachable and announced (§4.4, §4.7)', async ({page}) => {
  await page.goto(`${BP}/contact/`);
  await page.waitForLoadState('networkidle');

  // Walk to the submit button and press Enter with empty required fields.
  let reached = false;
  for (let i = 0; i < 25 && !reached; i++) {
    await page.keyboard.press('Tab');
    reached = await page.evaluate(
      () =>
        (document.activeElement as HTMLElement | null)?.getAttribute('type') === 'submit' ||
        (document.activeElement as HTMLElement | null)?.textContent?.trim().toLowerCase() === 'send message',
    );
  }
  expect(reached, 'submit button reachable by keyboard').toBe(true);
  await page.keyboard.press('Enter');

  // Inline validation must appear (no navigation), and live region must exist.
  await page.waitForTimeout(400);
  const stillOnForm = page.url().includes('/contact');
  expect(stillOnForm, 'Enter on empty form must not navigate away').toBe(true);

  const live = await page.evaluate(() => {
    const region = document.querySelector('[aria-live]');
    const error = document.querySelector('[role="alert"], .field-error, [aria-invalid="true"]');
    return {
      liveRegion: !!region,
      livePolite: region?.getAttribute('aria-live') === 'polite',
      errorShown: !!error,
    };
  });
  appendFileSync(
    LOG,
    `\n--- /contact/ empty-submit flow ---\nlive region: ${live.liveRegion} (polite: ${live.livePolite})\nerror surfaced: ${live.errorShown}\n`,
  );
  expect(live.liveRegion, 'aria-live region present for error announcement').toBe(true);
  expect(live.errorShown, 'validation error rendered after keyboard submit').toBe(true);
});
