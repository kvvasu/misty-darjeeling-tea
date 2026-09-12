# Architecture — Misty Darjeeling Tea

> Status: **Checkpoint A (Foundations)**. Sections marked *(Phase B/C)* are filled
> in as those phases complete.

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
wherever an equivalent exists.** Custom components permitted only:
`MarqueeTicker`, `PointerPillSlider`, `HandDrawnEllipse` — justified gap
records to be finalised in Phase B below. *(Phase B)*

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

Documented above; per-route asset inventory in `ASSETS.md`. *(Phase B)*

## Form success/error pattern (§4.7)

*(Phase B)*
