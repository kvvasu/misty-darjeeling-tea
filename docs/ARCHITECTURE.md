# Architecture — Misty Darjeeling Tea

> Status: **Checkpoint C (QA & Ship) — complete.** Sections marked *(Phase B/C)*
> were filled in as those phases completed.

## Stack (all versions pinned exact, §0.4)

| Package | Version | Role |
|---|---|---|
| next | 16.3.5 | App Router, `output: 'export'`, **webpack bundler** (explicit) |
| react / react-dom | 19.3.0 | Astryx hard requirement (>=19) |
| @astryxdesign/core | 0.6.0 | Components + theme system (source build) |
| @astryxdesign/cli | 0.6.0 | devDependency — theme build, docs, inventory |
| @astryxdesign/build | 0.6.0 | babel + PostCSS StyleX pipeline |
| @stylexjs/stylex | 0.19.0 | Astryx peer requirement (^0.19) |
| @stylexjs/babel-plugin | 0.19.0 | StyleX compiler |
| @babel/core | 7.29.7 | StyleX 0.19 requires Babel ^7 (Babel 8 fails: verified) |
| tailwindcss / @tailwindcss/postcss | 4.3.3 | Utility layer via `@theme inline` bridge |
| @fontsource/space-mono, @fontsource/caveat | 5.3.0 | Self-hosted fonts (§3.8) — no CDN fetch |

Toolchain: Node 24.19.0 (matches upstream Astryx `.nvmrc` = "24"), pnpm 12.4.1
via corepack, pinned in `package.json#packageManager`. `pnpm-lock.yaml` committed.

## Build pipeline (verified end-to-end)

1. `prebuild`: `scripts/compute-csp-hash.mjs` → SHA-256 of the inline theme
   script → writes `public/_headers` CSP (§3.4; auto-recomputed every build).
2. `build`: `next build --webpack` — **webpack is mandatory**: `withAstryx()`
   configures resolution via `nextConfig.webpack`, which Turbopack never calls
   (vendor-verified; Turbopack would render unstyled with no error).
3. `postbuild`: `scripts/assert-export.mjs` — asserts `out/` has HTML routes
   AND compiled StyleX CSS. Catches the "build succeeds, styles missing"
   silent failure (it did, once, during setup — by design).

### StyleX wiring

- `babel.config.js`: `@astryxdesign/build/babel` — splits class prefixes:
  library (`astryx*`) vs product (`x*`) so each lands in its own CSS layer.
- `postcss.config.js`: `@astryxdesign/build/postcss` (compiles StyleX from
  Astryx node_modules source + our `app/` on the `@stylex;` at-rule) +
  `@tailwindcss/postcss`.
- `next.config.mjs`: `withAstryx()` — transpilePackages, `source` export
  condition, pnpm symlink-safe resolution.

## Tailwind ↔ StyleX token bridge (§3.1)

**CSS custom properties are the single source of truth.**

1. `theme/wada-theme.ts` (project-owned `defineTheme`, **no vendor theme
   package**) defines Astryx's semantic `--color-*` variables as
   `[light, dark]` tuples, compiled by `astryx theme build` to CSS
   `light-dark()` in `theme/wada.css`.
2. `@astryxdesign/core/tailwind-theme.css` (vendor bridge, `@theme inline`)
   maps Tailwind utilities (`bg-surface`, `text-primary`, …) onto those same
   variables — no colour literals emitted.
3. Project CSS consumes `var(--color-*)` only. **Neither engine hardcodes a
   colour literal.**

Regeneration chain: `pnpm palette` → `derive-palette.mjs` (computes OKLCH +
contrast) → `generate-theme.mjs` (emits theme + DESIGN_SYSTEM.md) →
`astryx theme build` (compiles CSS/JS). Hand edits to `wada-theme.ts` are
prohibited — it is generated.

## Cascade layer order (§3.1 — BLOCKING gate)

Declared once in `app/layers.css` (separate file: webpack hoists `@import`
content above inline CSS):

```
@layer reset, theme, base, astryx-base, astryx-theme, project, utilities;
```

| Layer | Contents |
|---|---|
| `reset` | `@astryxdesign/core/reset.css` (self-declares `@layer reset`) |
| `theme` | `tailwindcss/theme.css` |
| `base` | `tailwindcss/preflight.css` |
| `astryx-base` | `@astryxdesign/core/astryx.css` (pre-compiled StyleX) |
| `astryx-theme` | `theme/wada.css` (self-declares; also in source build output) |
| `project` | our globals (tokens only, zero colour literals) |
| `utilities` | `tailwindcss/utilities.css` |

No unlayered global CSS exists; `assert-export` and code review enforce this.

## Theming modes

- Astryx `<Theme theme={wadaTheme} mode={light|dark}>` (client provider).
- `[light, dark]` tuples compile to CSS `light-dark()`; `color-scheme` is
  bound to `data-theme` on `<html>` (Astryx reset.css, vendor-verified).
- §3.3 dark mode: blocking inline `<head>` script (no cookies, no server, no
  middleware) sets `data-theme` pre-paint from `localStorage.theme` →
  `prefers-color-scheme`. Toggle writes localStorage + explicit mode.
- §3.4 CSP: the script's SHA-256 is computed at build time into `_headers`;
  no `'unsafe-inline'` in `script-src`.

## Astryx component inventory (§3.6)

163 components / 284 theming targets (94 components) — full list:
`logs/astryx-component-inventory.txt`. **Astryx primitives are the default
wherever an equivalent exists.**

### Primitives used (route inventory)

| Primitive | Used for |
|---|---|
| `Theme` | Root provider (wadaTheme, explicit light/dark mode) |
| `Link` | All navigation CTAs and footer link |
| `IconButton` | Theme toggle (aria-pressed, keyboard-operable, ≥24px target) |
| `Card` | Tea flush cards on `/teas` |
| `TextInput` | Contact form name + email (controlled) |
| `TextArea` | Contact form message (controlled) |
| `Selector` | Contact form topic (accessible listbox) |
| `FieldStatus` | Inline validation errors + form-level errors (§4.7) |
| `Button` | Contact form submit (primary) |

All interactive elements on every route are Astryx primitives; none were
custom-built where a primitive exists.

### Custom components — justified gap records

1. **`MarqueeTicker`** (components/MarqueeTicker.tsx)
   - *Gap:* Astryx's 163-component inventory contains no marquee/ticker
     primitive (verified via `astryx component` listing).
   - *Behaviour:* moving track is `aria-hidden`; a visually-hidden static
     `<ul>` carries the content once for screen readers. Component self-
     serialises content (author passes items once). `prefers-reduced-motion:
     reduce` disables the animation entirely — static list, no auto-scroll.
   - *Workaround attempted:* none possible with primitives; `Card`/`Banner`
     do not animate, and hand-rolling an Astryx-adjacent scroller would patch
     vendor internals — rejected.

2. **`HandDrawnEllipse`** (components/HandDrawnEllipse.tsx)
   - *Gap:* decorative hand-drawn ink mark is not a UI primitive in any
     design system; Astryx correctly has no equivalent.
   - *Behaviour:* `aria-hidden="true"`, inline SVG, no external fetch,
     pointer-events none, accent-token colour.

3. **`PointerPillSlider` — NOT BUILT (per §3.6).** The prompt anticipated a
   custom slider, but the installed Astryx 0.6.0 ships a full-featured
   `Slider` primitive (label, value/onChange/onChangeEnd, min/max/step,
   `formatValue` for `aria-valuetext`, marks) — verified via
   `astryx component Slider`. Building a custom replacement would violate
   the "custom where a primitive exists is BLOCKING" rule. If a flush-
   strength slider is wanted later, the primitive is the implementation.

### Known primitive integration notes

- Astryx form primitives do not forward an HTML `name` attribute; the contact
  form renders hidden named inputs mirroring controlled state (Netlify field
  registration) while Astryx carries labelling/focus/ARIA behaviour.
- StyleX 0.19 emits class-name objects; JSX usage goes through
  `props(styles.x)` (StyleX 0.19 API, `create` + `props`).

## Routes (derived from content/site-content.md)

| Route | H1 | Source section |
|---|---|---|
| `/` | Misty Darjeeling Tea | Page: Home |
| `/teas/` | Our Teas | Page: Our Teas |
| `/estate/` | Our Estate | Page: Our Estate |
| `/brew-guide/` | Brew Guide | Page: Brew Guide |
| `/contact/` | Contact | Page: Contact |
| `/thank-you/` | Thank you | Page: Thank you |
| `/404` (404.html) | Page not found | Page: Not found |

All copy is used verbatim from `content/site-content.md`; framework-required
microcopy (validation errors, sending state, no-JS fallback) is declared in
the content file itself.

## Static boundaries

- `output: 'export'`; no server, no middleware, no mock APIs, no secrets.
- `images.unoptimized: true` (§3.7): next/image optimizer does not run under
  static export — no on-demand resizing or format negotiation; source assets
  must ship correctly sized, modern formats. *(Phase B: assets)*
- Forms: Netlify Forms only (`data-netlify="true"`, same-origin POST,
  honeypot + time-trap + provider spam filtering + client debounce).
  `/thank-you` static success route. *(Phase B)*
- **Honesty note (§2.3):** client-side debounce is a UX affordance, not a
  security control — trivially bypassed by a direct POST. Real gatekeeping is
  Netlify's (honeypot heuristics + spam filtering + quota).

## Security headers

`public/_headers` (Netlify) — CSP (hash-authorised inline theme script),
HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
`frame-ancestors 'none'`. Committed artifact; regenerated each build.
Full policy documented in `docs/SECURITY_HEADERS.md`. *(Phase C)*

## Image-handling tradeoff (§3.7)

`images.unoptimized: true` (§3.7): next/image's optimizer does not run under
static export — no on-demand resizing or format negotiation. Current site
ships **zero raster images** (typography + token-colour-led design, inline
SVG only), so the tradeoff currently costs nothing; if photography is added
later it must be pre-sized and pre-formatted (e.g. AVIF/WebP variants
committed at required breakpoints). Asset provenance: `ASSETS.md`.

## Form success/error pattern (§4.7)

- Static export cannot redirect back with server state → dedicated
  `/thank-you` route is the Netlify `action` target (excluded from sitemap
  and robots).
- Inline client-side validation with `FieldStatus` errors; form-level errors
  (time-trap, send failure) announced via a wrapper with
  `aria-live="polite"`.
- Submission uses `fetch` POST (same-origin, `application/x-www-form-urlencoded`)
  then navigates to `/thank-you/`; a no-JS `<noscript>` fallback explains
  alternatives (copy sourced from `content/site-content.md`).
- Spam defences (§2.3): honeypot (`company`, visually-hidden, `aria-hidden`,
  `tabindex=-1`), 2-second time-trap, Netlify UI spam filtering, and a
  1.5 s client debounce.
- **Honest statement (§2.3):** the client-side debounce is a UX affordance,
  not a security control — it is trivially bypassed by a direct POST. Real
  gatekeeping is Netlify's honeypot heuristics, spam filtering, and the
  100/month form quota.

## Performance decisions (Phase C, evidence-driven)

Initial load measured ~533 KB gz JS on the first Lighthouse run (Performance
49–62). Two causes, both fixed and re-measured:

1. **Barrel import pulled all 163 Astryx components.**
   `import {Theme} from '@astryxdesign/core'` dragged every component's
   implementation into the client bundle (~312 KB unused JS, Lighthouse
   estimate). Fix: subpath import `@astryxdesign/core/theme` (exports `Theme`
   + theme authoring APIs only). All other primitives were already subpath
   imports.
2. **Legacy transpilation bloat.** `browserslist` now targets the last two
   versions of evergreen browsers, cutting regenerator/polyfill output
   (polyfills chunk dropped from the initial set).

Result: initial JS **243 KB gz** (home route, measured from emitted HTML);
Lighthouse Performance **95–98** across all routes.

### Rejected alternative — pre-built package consumption (recorded per §4.8)

The vendor README documents a "pre-built" mode (import `astryx.css`, drop the
babel/PostCSS pipeline, keep SWC). An attempt to switch was **reverted**:
verification showed `@astryxdesign/core`'s `dist/` ships **uncompiled**
`stylex.defineVars` calls — the runtime throws
`Unexpected 'stylex.defineVars' call at runtime` — and the `<Theme>` provider
(that the entire token-bridge architecture depends on) imports the token
module unconditionally. The vendor's own `next.js` source states the pre-built
path means *dropping* `withAstryx()`, which is incompatible with consuming
`dist/` at all. The source build is therefore not a stylistic choice but a
functional requirement of this Astryx version.

## Lighthouse CI configuration notes (§4.6)

- **All 9 exported routes** are collected: LHCI's default `maxAutodiscoverUrls`
  is 5 (silently truncated the set — found and fixed); set to `0` = unlimited.
- Assertions use `assertMatrix`: Performance/Accessibility/Best-Practices ≥ 90
  on every route; **SEO ≥ 90 only on canonical routes** — `404.html`,
  `_not-found`, and `/thank-you` are `noindex` **by design** (404s are
  crawl-blocked by Next; a transactional confirmation page must not be
  indexed), which Lighthouse's `is-crawlable` audit scores 0 regardless of
  intent. Excluding them is the correct interpretation, not a suppression.
- Runs: mobile default emulation, simulated throttling, 3 runs, medians
  aggregated by `scripts/median-lighthouse.mjs` → `qa/lighthouse/`.
- `CHROME_PATH` points at the Playwright Chromium (the LHCI default Chrome
  discovery grabbed a Windows binary across the WSL boundary — environment
  quirk, not a project dependency).
