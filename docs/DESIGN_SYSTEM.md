# Design System — Misty Darjeeling Tea

> GENERATED artifact assembled by `scripts/generate-theme.mjs` from the computed
> palette (`scripts/derive-palette.mjs`). Numeric values are authoritative in
> `theme/wada-palette.json`; this document mirrors them.

## Palette authority — Sanzo Wada

Selected plates from *A Dictionary of Color Combinations* (Sanzo Wada, 1933 — public domain):

| Plate | Colours (official names) | Role |
|---|---|---|
| **#102** | Ivory Buff · Orange Rufous | surfaces (Ivory Buff) + primary action (Orange Rufous) |
| **#137** | Etruscan Red · Cinnamon Buff · Pistachio Green | accent, warning tint, success |
| **#139** | Salvia Blue · Deep Indigo · Neutral Gray | info, primary ink, dark-mode secondary text |

Hex values digitised from public reference digitisations:
- https://sanzo-wada.dmbk.io/ (archive, §0 #5)
- https://wscolors.com/colors (159-colour table: Etruscan Red #c55347, Ivory Buff #ebd3a2, Orange Rufous #c16b27, Pistachio Green #648f7b, Salvia Blue #97acc8, Deep Indigo #051230, Neutral Gray #b6bfc1)
- https://colors.elwyn.co/ (combination index: #102/#137/#139 compositions)

**Provenance note:** the archive serves colour values but no programmatic per-plate
endpoint (assets/data.json → 404, verified). Plate numbers + official names are cited
from the archive/combination indexes above; no images, code, or scans are bundled.

## Derivation rule (§3.2.3)

Hue is **preserved** from the Wada source. Only lightness (OKLCH L) and chroma (C)
are adjusted — automatically, by `derive-palette.mjs` — until each documented
text/background pair meets WCAG 2.2 AA in **both** modes. Body text targets ≥7:1.

## Semantic tokens

| Token | Usage | Wada source | Light oklch | Light hex | Dark oklch | Dark hex |
|---|---|---|---|---|---|---|
| `color-surface-page` | Page background | Ivory Buff (#102) — lightness raised | `oklch(0.9735 0.0139 89)` | `#faf6ec` | `oklch(0.1933 0.0092 75)` | `#171410` |
| `color-surface-raised` | Cards, popovers, raised UI | White (Ivory Buff family) | `oklch(1 0 0)` | `#ffffff` | `oklch(0.2375 0.0127 78)` | `#221e18` |
| `color-surface-sunken` | Wells, code blocks, inset areas | Ivory Buff (#102) — chroma reduced | `oklch(0.944 0.0238 88)` | `#f3ecdb` | `oklch(0.165 0.007 78)` | `#100e0b` |
| `color-text-primary` | Body and heading text | Deep Indigo (#139) | `oklch(0.1919 0.0631 263)` | `#051230` | `oklch(0.9203 0.0255 87)` | `#ece4d2` |
| `color-text-secondary` | Supporting text, captions | Slate Color (#57) family | `oklch(0.3786 0.0247 225)` | `#34454c` | `oklch(0.7982 0.0104 213)` | `#b6bfc1` |
| `color-text-on-action` | Text on primary action fill | Warm white (Ivory Buff family) | `oklch(0.9939 0.0082 91)` | `#fffdf7` | `oklch(0.1919 0.0631 263)` | `#051230` |
| `color-border-subtle` | Hairline borders, dividers | Ivory Buff (#102) — darkened | `oklch(0.8867 0.0351 89)` | `#e3d9c0` | `oklch(0.3256 0.0183 74)` | `#3a332a` |
| `color-action-primary` | Primary buttons, key CTAs | Orange Rufous (#102) | `oklch(0.5706 0.1346 54)` | `#b35d15` | `oklch(0.7134 0.1311 56)` | `#e08b4a` |
| `color-action-primary-hover` | Primary action hover state | Orange Rufous (#102) — darkened | `oklch(0.5226 0.1346 54)` | `#a34f00` | `oklch(0.7134 0.1311 56)` | `#e08b4a` |
| `color-accent` | Accent highlights (Etruscan Red) | Etruscan Red (#137) | `oklch(0.563 0.1485 28)` | `#bd4b41` | `oklch(0.7134 0.1163 28)` | `#e28579` |
| `color-accent-soft` | Accent tint background | Etruscan Red (#137) — tint | `oklch(0.9308 0.0227 31)` | `#f7e3df` | `oklch(0.2918 0.0315 32)` | `#3a2622` |
| `color-focus-ring` | Focus indicator (≥3:1 adjacent) | Orange Rufous (#102) — darkened | `oklch(0.478 0.1082 56)` | `#8a4a11` | `oklch(0.7903 0.1061 54)` | `#f0a878` |
| `color-status-success` | Success status text/icons | Pistachio Green (#137) | `oklch(0.4769 0.0881 154)` | `#2e6b45` | `oklch(0.7319 0.0807 157)` | `#7db894` |
| `color-status-warning` | Warning status text/icons | Cinnamon Buff (#137) — darkened | `oklch(0.5188 0.1016 75)` | `#8a5f14` | `oklch(0.7831 0.1146 86)` | `#d9b35c` |
| `color-status-error` | Error status text/icons | Etruscan Red (#137) | `oklch(0.563 0.1485 28)` | `#bd4b41` | `oklch(0.7286 0.1179 27)` | `#e8897f` |
| `color-status-info` | Informational status text/icons | Salvia Blue (#139) / Deep Lyons Blue family | `oklch(0.4808 0.0876 259)` | `#3f5e8f` | `oklch(0.7752 0.0609 256)` | `#9db8dd` |


## Measured contrast (computed, WCAG-relative-luminance)

| Mode | Foreground | Background | Ratio | Required | Result |
|---|---|---|---|---|---|
| light | `color-text-primary` | surface-page | 17.13:1 | 4.5:1 | PASS |
| light | `color-text-primary` | surface-raised | 18.49:1 | 4.5:1 | PASS |
| light | `color-text-secondary` | surface-page | 9.26:1 | 4.5:1 | PASS |
| light | `color-text-secondary` | surface-raised | 9.99:1 | 4.5:1 | PASS |
| light | `color-text-accent (Link text)` | surface-page | 4.58:1 | 4.5:1 | PASS |
| light | `color-text-on-action` | action-primary | 4.59:1 | 4.5:1 | PASS |
| light | `color-focus-ring` | surface-page | 6.34:1 | 3:1 | PASS |
| light | `color-focus-ring` | surface-raised | 6.84:1 | 3:1 | PASS |
| light | `color-status-success` | surface-page | 5.89:1 | 4.5:1 | PASS |
| light | `color-status-warning` | surface-page | 5.22:1 | 4.5:1 | PASS |
| light | `color-status-error` | surface-page | 4.58:1 | 4.5:1 | PASS |
| light | `color-status-info` | surface-page | 6.06:1 | 4.5:1 | PASS |
| dark | `color-text-primary` | surface-page | 14.51:1 | 4.5:1 | PASS |
| dark | `color-text-primary` | surface-raised | 13.1:1 | 4.5:1 | PASS |
| dark | `color-text-secondary` | surface-page | 9.8:1 | 4.5:1 | PASS |
| dark | `color-text-secondary` | surface-raised | 8.85:1 | 4.5:1 | PASS |
| dark | `color-text-accent (Link text)` | surface-page | 6.88:1 | 4.5:1 | PASS |
| dark | `color-text-on-action` | action-primary | 7.01:1 | 4.5:1 | PASS |
| dark | `color-focus-ring` | surface-page | 9.25:1 | 3:1 | PASS |
| dark | `color-focus-ring` | surface-raised | 8.35:1 | 3:1 | PASS |
| dark | `color-status-success` | surface-page | 8:1 | 4.5:1 | PASS |
| dark | `color-status-warning` | surface-page | 9.22:1 | 4.5:1 | PASS |
| dark | `color-status-error` | surface-page | 7.27:1 | 4.5:1 | PASS |
| dark | `color-status-info` | surface-page | 9.03:1 | 4.5:1 | PASS |

## Focus & target sizes (§3.5)

- Focus ring: `color-focus-ring`, ≥3:1 against adjacent colours in both modes (verified above).
- SC 2.5.8: all interactive targets ≥24×24 CSS px (see ARCHITECTURE.md component notes).
- SC 2.4.11: sticky header must not obscure focused elements — header is non-sticky below
  1024px; on desktop it uses `scroll-margin-top` on all anchor targets.

## Dark mode

Single mechanism: blocking inline `<head>` script reads `localStorage.theme`, falls back to
`prefers-color-scheme`, sets `data-theme` on `<html>` before first paint (§3.3). The
`[light, dark]` token tuples compile to CSS `light-dark()`, resolved by `color-scheme`
which the reset stylesheet binds to `data-theme`.

## Token bridge (§3.1) — summary

CSS custom properties are the single source of truth. The project-owned Wada theme
(`theme/wada-theme.ts`) defines Astryx's own `--color-*` variables via `defineTheme`;
`@astryxdesign/core/tailwind-theme.css` (vendor bridge) maps Tailwind v4 `@theme inline`
utilities onto those same variables. Neither engine hardcodes a colour literal. Full
rationale in `docs/ARCHITECTURE.md`.
