# REPORT — Misty Darjeeling Tea

Production-grade, accessible, secure **static** site. Next.js App Router
(`output: 'export'`), Astryx design system (source build), Tailwind v4 via the
vendor `@theme inline` bridge, project-owned Sanzo Wada token layer, Netlify
static hosting with Netlify Forms.

**Status: COMPLETE** (with recorded tooling substitutions and honest
limitations — none of them gate failures).

---

## 1. Scope

- 7 content routes derived from `content/site-content.md` (H1/H2 hierarchy →
  route map): `/`, `/teas/`, `/estate/`, `/brew-guide/`, `/contact/`,
  `/thank-you/`, plus static `404.html`.
- All copy verbatim from the content file; framework-required microcopy
  (validation errors, sending state, no-JS fallback, 404) is declared **in**
  the content file itself.
- Phase-wise execution per §4.9: Checkpoint A (foundations) → B (build) →
  C (QA & ship), halting for review at each gate.

## 2. Environment

| Item | Value |
|---|---|
| Node | 24.19.0 (matches Astryx upstream `.nvmrc` = "24") |
| pnpm | 12.4.1 via corepack, pinned in `package.json#packageManager` |
| Lockfile | `pnpm-lock.yaml` committed |
| OS | Linux (WSL container; headless — see limitations) |

Pinned versions (exact, §0.4): next 16.3.5, react/react-dom 19.3.0,
@astryxdesign/core + cli + build 0.6.0, @stylexjs/stylex 0.19.0,
@stylexjs/babel-plugin 0.19.0, @babel/core 7.29.7, tailwindcss 4.3.3,
@fontsource/space-mono & caveat 5.3.0.

## 3. Preflight (§0) — executed, not inferred

Raw output: `logs/preflight.txt`.

| Check | Result |
|---|---|
| Astryx core provenance | ✅ `@astryxdesign/core@0.6.0` → `github.com/facebook/astryx` |
| Theme layer | ✅ CLI inventory: **163 components / 284 theming targets** (94 components). Note: the prompt's `theme --list` flag does not exist in CLI 0.6.0; `theme list` is the working form (recorded as tooling note). |
| Astryx CLI | ✅ 0.6.0 |
| React 19 peer deps | ✅ react 19.3.0 satisfies `>=19`; `@stylexjs/stylex@0.19.0` present |
| Sanzo Wada archive | ✅ HTTP 200; plate data cited from published digitisations (see ASSETS.md) |
| Netlify Forms | ✅ free tier 100 submissions/month — sufficient for low-volume contact |
| Content source | ⚠️ **missing at start** → user approved agent-drafting (see §7) |
| Node toolchain | ✅ Node 24.19.0, pnpm 12.4.1 |

## 4. Build results

`typecheck` ✅ · `lint` ✅ (0 problems) · `next build --webpack` ✅ ·
`assert-export` ✅ — `out/` contains all 9 HTML routes (7 pages + 404 variants),
`robots.txt`, `sitemap.xml`, favicon, `_headers`, and compiled StyleX CSS
(asserted — this assertion caught one real silent failure during setup).

CSP hash regenerated on every build by `scripts/compute-csp-hash.mjs` (§3.4);
`'unsafe-inline'` absent from `script-src`; verified in `public/_headers`.

## 5. QA evidence (§4.4–§4.7)

| Gate | Result | Artifact |
|---|---|---|
| axe scan, 7 routes × 2 modes | **0 critical/serious violations** (49 runs) | `qa/axe/axe-summary.json` |
| Playwright suite | **34/34 passed** + 2 keyboard-traversal tests | `qa/test-results/playwright-report.json` |
| Screenshots | 4 breakpoints × 2 modes × pages | `qa/screenshots/` |
| Palette sync | ΔE2000 = 0.0 on every asserted token pair, both modes | `qa/test-results/palette-sync.json` |
| Rendered contrast | all pairs AA (body 17.13:1 / 14.51:1 worst-case logged) | `qa/test-results/contrast-rendered.json` |
| Source-palette contrast | **24/24 pairs PASS** both modes | `logs/palette-contrast.txt` |
| Target size (SC 2.5.8) | all interactive targets ≥ 24×24 | `qa/test-results/target-sizes.json` |
| Keyboard traversal | skip link first stop, focus→`#main`, visible focus on every stop, form fully operable | `qa/keyboard-traversal.txt` |
| Manual a11y pass | done; AT-audibility items flagged as environment-limited | `qa/manual-a11y-notes.md` |
| Lighthouse (mobile, 3 runs, median) | Performance **95–98**, Accessibility **100**, Best Practices **100**, SEO **100** (canonical routes) | `qa/lighthouse/`, `scripts/median-lighthouse.mjs` |
| SEO artifacts | meta description, canonical, OG/Twitter, sitemap, robots, favicon, `lang` | `out/` |
| 404 | `404.html` exported; noindex by design | `out/404.html` |

Lighthouse per-route medians:

```
PAGE                    perf  a11y  bp    seo
/404.html                96   100   100   (66 — noindex by design, excluded)
/404/index.html          96   100   100   (66 — noindex by design, excluded)
/brew-guide/index.html   96   100   100   100
/contact/index.html      95   100   100   100
/estate/index.html       98   100   100   100
/index.html              96   100   100   100
/_not-found/index.html   97   100   100   (66 — noindex by design, excluded)
/teas/index.html         96   100   100   100
/thank-you/index.html    97   100   100   (66 — noindex by design, excluded)
```

The SEO exclusions are **interpretation, not suppression**: 404 pages are
crawl-blocked by Next; `/thank-you` is a transactional confirmation page that
must not be indexed. Lighthouse's `is-crawlable` audit scores 0 for any
noindex page regardless of intent. The `assertMatrix` config documents this.

## 6. Palette synchronisation (§4.5)

- Tokens derived programmatically from Wada plates **#102** (Ivory Buff +
  Orange Rufous), **#137** (Etruscan Red + Cinnamon Buff + Pistachio Green),
  **#139** (Salvia Blue + Deep Indigo + Neutral Gray); hex values from
  digitised public-domain references (ASSETS.md).
- `scripts/derive-palette.mjs` computes OKLCH and **auto-adjusts lightness/
  chroma only** (hues preserved) until every WCAG pair passes — 24/24 in both
  modes.
- Browser-side assertions parse rendered computed styles and documented hex
  into a common space: **ΔE2000 ≤ 1.0 (actual: 0.0)** on every asserted pair,
  light and dark — the Tailwind layer, the Astryx variable overrides, and the
  project tokens render identically.

## 7. Copy Requested (§2.2)

All site copy was agent-drafted in `content/site-content.md` **with user
approval at Checkpoint A** ("Draft it for me"), because the prompt requires a
content source and none existed. Content previously requested and still
outstanding (currently satisfied by the draft):

- **Brand confirmation** — "Misty Darjeeling Tea" name, estate name
  ("Singtom-style single estate" phrasing), and any legal/registered details
  are drafted placeholders; replace with real brand copy before launch.
- **Real contact details** — the contact form's target email/owner and any
  physical address/phone are placeholder-free by design; the form is wired to
  Netlify Forms and needs the owner's Netlify account + notification email.
- **Photography/illustration** — none shipped; if brand imagery is supplied,
  provenance must be logged in `ASSETS.md` per §2.1.

No copy was invented outside the content file; nothing in the app hardcodes
marketing text.

## 8. Tooling substitutions & environment quirks (§4.8 WARNING)

All are environment/tooling notes; none substitute a §0 verification:

1. **`theme --list` → `theme list`** — CLI 0.6.0 has no `--list` flag.
2. **`next lint` removed in Next 16** — ESLint wired directly via
   `eslint-config-next` flat config (`pnpm lint`).
3. **`CHROME_PATH` for LHCI** — Lighthouse's Chrome discovery picked up a
   Windows binary across the WSL boundary; pointed at the Playwright
   Chromium. Environment quirk only.
4. **LHCI `maxAutodiscoverUrls: 0`** — default silently caps collection at 5
   URLs; disabled so all 9 routes are audited.
5. **LHCI `assertMatrix`** — `matchingUrlPattern` is only valid per matrix
   entry (not per-assertion); SEO asserted on canonical routes only (see §5).
6. **Pre-built Astryx consumption attempted and reverted** — vendor `dist/`
   ships uncompiled `stylex.defineVars`; the source build is a functional
   requirement (full record in `docs/ARCHITECTURE.md`). The switch briefly
   replaced the build pipeline mid-Phase-C; it was reverted via git before
   this report, and all gates re-verified on the source-build pipeline.
7. **Babel 8 → 7.29.7** — StyleX 0.19's plugin is incompatible with Babel 8
   (verified at build time).

## 9. Honest limitations

1. **Screen-reader spot-check is programmatic, not auditory.** No VoiceOver/
   NVDA exists in this headless environment. The markup contract (landmarks,
   labels, `aria-live`, `aria-pressed`, focusability) is verified; the
   *announced experience* is not. Human AT spot-check recommended before
   launch — listed in `qa/manual-a11y-notes.md` open items.
2. **Content is agent-drafted** (user-approved); brand/legal/contact details
   need owner substitution (§7).
3. **`style-src 'unsafe-inline'`** is required by the Astryx/StyleX engine
   (runtime style injection). Script execution is unaffected; `script-src`
   remains hash-only. This is a design-system tradeoff, documented in
   `docs/SECURITY_HEADERS.md`.
4. **404 + thank-you SEO scores (66)** are structural (noindex by design),
   not regressions; explained above and in the LHCI config.
5. **Spam mitigation honesty (§2.3):** the client-side debounce is UX only;
   real gatekeeping is Netlify's honeypot heuristics, spam filtering, and
   quota. Documented in `docs/ARCHITECTURE.md`.
6. **Palette data provenance:** plate numbers are cited against published
   digitisations of the public-domain dictionary (the archive serves no
   machine-readable plate API); colour values were cross-checked between two
   digitisations. No archive code or imagery was bundled.

## 10. Deliverables map (§5)

| Deliverable | Path |
|---|---|
| Source | `app/`, `components/`, `theme/`, `scripts/` |
| Setup/build/deploy | `README.md` |
| Design system | `docs/DESIGN_SYSTEM.md` |
| Architecture | `docs/ARCHITECTURE.md` |
| Security headers | `docs/SECURITY_HEADERS.md` + `public/_headers` |
| Asset provenance | `ASSETS.md` |
| QA evidence | `qa/` + `logs/` |
| This report | `REPORT.md` |
