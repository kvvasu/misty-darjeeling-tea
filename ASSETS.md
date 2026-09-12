# ASSETS — Provenance & Licences (§2.1, §5.2)

Every visual asset on the site is listed here. No third-party imagery is used.

## Fonts (self-hosted via npm — no runtime CDN fetch, §3.8)

| Font | Package | Weights used | Licence | Source |
|---|---|---|---|---|
| Space Mono (body, headings, code) | `@fontsource/space-mono@5.3.0` | 400 normal, 700 normal (latin) | SIL Open Font License 1.1 (bundled in package) | Google Fonts project, via Fontsource npm |
| Caveat (script accents) | `@fontsource/caveat@5.3.0` | 400 normal (latin) | SIL Open Font License 1.1 (bundled in package) | Google Fonts project, via Fontsource npm |

Preload/`font-display: swap` handled by Fontsource CSS; subsets limited to
`latin` by import choice.

## Original / AI-generated assets

| Asset | Path | Provenance | Model | Date | Prompt |
|---|---|---|---|---|---|
| Favicon mark (tealeaf on rust) | `app/icon.svg` | AI-generated, original work | Codebuff agent (GLM), hand-authored SVG | 2026-09-12 | "Simple flat tealeaf glyph, ivory on Wada Orange Rufous #b35d15 rounded square, 32×32" |
| Hand-drawn ellipse underline | `components/HandDrawnEllipse.tsx` (inline SVG path) | AI-generated, original work | Codebuff agent (GLM), hand-authored SVG | 2026-09-12 | "Single-stroke imperfect ellipse, 3.5px round cap, enclosing an H1, decorative" |

No AI raster images, photographs, or scans are used. No Touchy Coffee assets,
code, SVG paths, or CSS were copied (moodboard reference only, §2.1). No Sanzo
Wada scans, plates, or images are bundled — only colour values + official names
(see `docs/DESIGN_SYSTEM.md` provenance note).
