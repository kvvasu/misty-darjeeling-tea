# Manual Accessibility Pass — Notes

**Required completion artifact (§4.4).** This file records the manual accessibility
verification performed in addition to the automated axe scan. Automated scanners
catch only a subset of real failures; this pass covers the judgement-based checks.

**Environment note (honest limitation):** this session ran in a headless Linux
container with **no VoiceOver/NVDA screen reader available**. The screen-reader
checks below were executed **programmatically** (ARIA attribute and landmark
structure assertions via Playwright) rather than by listening to an actual
screen reader. They verify the *markup contract* a screen reader consumes, not
the announced experience itself. A human spot-check on real AT is still
recommended before public launch — see "Open items".

## 1. Keyboard-only traversal — PASS

Executed programmatically per route; raw evidence in `qa/keyboard-traversal.txt`
(2 Playwright tests, all green):

- Skip link is the **first** tab stop on every route; Enter moves focus to `#main`
  (fixed this pass: `<main>` now carries `tabindex="-1"`, the WCAG-documented
  requirement for a focusable skip-link target).
- Full tab order on fresh load: skip link → logo → primary nav (Our Teas, Our
  Estate, Brew Guide, Contact) → theme toggle → in-content actions → footer.
  Logical and matches visual order.
- Every interactive tab stop shows a **visible focus indicator** (computed
  outline or box-shadow) — verified per stop, not sampled.
- Contact form reachable end-to-end by keyboard: name → email → topic
  (combobox) → message → submit. Submitting the empty form does **not**
  navigate; inline errors render in a `aria-live="polite"` region.
- Theme toggle is a real `<button>`, keyboard operable, with `aria-pressed`
  state (verified in the axe/Playwright suite, test #34).
- Marquee links in the ticker: ticker is decorative `aria-hidden` content for
  the animated track; no interactive elements are trapped or moving (static
  list under `prefers-reduced-motion`).

## 2. Landmarks & structure — PASS

Verified in emitted HTML across all routes:

- Exactly one `<main>` per route (`id="main"`), one `<nav aria-label="Primary">`,
  `<header>`/`<footer>` present; single `<h1>` per route; heading levels
  descend without skips (axe `heading-order` zero violations).
- `lang="en"` on `<html>`; document titles unique per route.

## 3. Forms — PASS (markup contract)

- Every field has a programmatic label (`<label>` association via Astryx
  `TextInput`/`TextArea`/`Selector` primitives); honeypot is `aria-hidden` +
  `tabindex="-1"` so it is invisible to AT and untabbable.
- Required fields and error text wired with `aria-invalid`, `aria-describedby`,
  announcements via `aria-live="polite"` (asserted in the keyboard-flow test).
- Honest limitation: the *audibility* of error announcements (e.g. timing,
  verbosity) was not verified with a real screen reader.

## 4. Screen-reader spot-check — PARTIAL (environment limitation)

What was verified programmatically (markup contract): landmark names, label
associations, `aria-pressed` on the toggle, `aria-live` regions, decorative
elements (`aria-hidden` on marquee track, HandDrawnEllipse) — all correct.

What was **not** verified and needs a human with VoiceOver/NVDA:

- Actual announcement order and phrasing of the live-region errors.
- Focus-order announcement coherence on route navigation (SPA-style).
- Reading-mode behaviour of the marquee's duplicated (aria-hidden) track.

## 5. SC 2.4.11 (Focus Not Obscured) — PASS (by construction)

The header is **not sticky** (position: static), so no fixed element can obscure
a focused element. The marquee is not fixed either. No `scroll-margin` issues:
anchor targets carry `scroll-margin-top` as belt-and-braces.

## 6. SC 2.5.8 (Target Size ≥ 24×24) — PASS

Asserted programmatically in the Playwright suite (tests #33–#34): all form
controls, the theme toggle, and every interactive target measure ≥ 24×24 CSS px.

## 7. Colour contrast — PASS

All 24 documented text/background pairs pass AA (≥ 4.5:1 body, ≥ 3:1 large) in
**both** modes — computed with culori, logged in `logs/palette-contrast.txt`,
and re-asserted against **rendered** computed styles in the browser (ΔE2000 ≤ 1.0
palette sync + contrast tests).

## Open items (recommend before launch)

1. Human VoiceOver/NVDA spot-check of the form error announcements (§4 above).
2. Confirm marquee duplication reads acceptably in a real screen reader's
   reading mode (it is aria-hidden; risk is low but unverified by ear).
