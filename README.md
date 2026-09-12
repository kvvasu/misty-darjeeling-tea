# Misty Darjeeling Tea

**Live:** https://kvvasu.github.io/misty-darjeeling-tea/ (deploys automatically
on every push to `main` via GitHub Actions — `.github/workflows/deploy.yml`).

Production-grade, accessible, secure static site — Next.js (App Router,
`output: 'export'`) + Astryx design system (source build) + Tailwind CSS v4,
themed with Sanzo Wada-derived tokens.

## Setup

```bash
corepack enable          # pnpm (pinned in package.json#packageManager)
pnpm install
```

Node >= 24 required (`.nvmrc`).

## Develop

```bash
pnpm dev                 # next dev --webpack (webpack is REQUIRED, not Turbopack)
```

## Build & preview

```bash
pnpm run build           # CSP hash → next build --webpack → export assertions
npx serve out            # preview the static export
```

The build fails loudly if the export lacks routes or compiled StyleX CSS.

## Design-system regeneration

```bash
pnpm palette             # recompute Wada tokens → theme + docs
```

## Deploy (Netlify)

`netlify.toml` is committed: build `pnpm run build`, publish `out/`,
Node 24. `public/_headers` (security headers + CSP with auto-computed inline
script hash) is deployed automatically from the export.

Enable **Forms** in the Netlify UI for the contact form (free tier: 100
submissions/month) and turn on spam filtering.

## Docs

- `docs/ARCHITECTURE.md` — stack, token bridge, cascade layers, build wiring
- `docs/DESIGN_SYSTEM.md` — Wada plates, tokens, measured contrast (generated)
- `logs/preflight.txt` — executed §0 preflight evidence
