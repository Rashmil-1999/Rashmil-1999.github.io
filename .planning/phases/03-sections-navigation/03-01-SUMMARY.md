---
phase: 03-sections-navigation
plan: 01
subsystem: infra
tags: [astro-icon, iconify, fontsource, mulish, saira-extra-condensed, trailingSlash, build.format]

requires:
    - phase: 01-foundation
      provides: astro.config.mjs scaffold (D-04 site URL, @tailwindcss/vite plugin, @astrojs/react integration), BaseHead.astro stub with Phase-1 Google Fonts preconnects (D-13), package.json with Astro 6 / React 19 / Tailwind v4 / strictest tsconfig already wired
    - phase: 02-content-layer
      provides: 8 Content Layer collections with iconSchema-validated Iconify ids (D-16, D-17) — Plan 03-02..03-06 consume these via <Icon> resolved against the packs installed here
provides:
    - astro-icon@1.1.5 integration wired into astro.config.mjs (per-glyph SVG inlining default — Pitfall E)
    - 4 Iconify packs on disk (@iconify-json/devicon, simple-icons, logos, lucide) — covers all icon ids referenced by skills.yaml + about.yaml
    - @fontsource/saira-extra-condensed + @fontsource/mulish on disk for Plan 03-02 to @import per-weight CSS
    - trailingSlash 'always' + build.format 'directory' set explicitly — no 301 redirect hops on internal anchors
    - BaseHead.astro freed of Google Fonts preconnects (D-36) — dist/ contains zero fonts.googleapis.com / fonts.gstatic.com references
affects: [03-02-styles-and-fonts, 03-03-sidenav-and-about, 03-04-list-sections, 03-05-projects-and-images, 03-06-cdn-strict-gate, 04-seo-and-meta]

tech-stack:
    added:
        - astro-icon ^1.1.5 (devDependency)
        - "@iconify-json/devicon ^1.2.62"
        - "@iconify-json/simple-icons ^1.2.84"
        - "@iconify-json/logos ^1.2.11"
        - "@iconify-json/lucide ^1.2.109"
        - "@fontsource/saira-extra-condensed ^5.2.7"
        - "@fontsource/mulish ^5.2.8"
    patterns:
        - "Static per-weight Fontsource over variable (D-33): locked 4-weight Mulish + 2-weight Saira subset; planner chose static @fontsource/mulish per RESEARCH.md Open Question 2"
        - "icon() called with zero arguments — per-glyph SVG inlining default avoids bundle bloat (Pitfall E)"
        - "trailingSlash 'always' + build.format 'directory' as a paired GH-Pages safeguard (D-38)"

key-files:
    created: []
    modified:
        - package.json
        - package-lock.json
        - astro.config.mjs
        - src/components/BaseHead.astro

key-decisions:
    - "Adopted RESEARCH.md verified version floors verbatim (astro-icon 1.1.5, devicon 1.2.62, simple-icons 1.2.84, logos 1.2.11, lucide 1.2.109, saira 5.2.7, mulish 5.2.8) — all 7 received [OK] slopcheck verdict on 2026-05-27 and have no postinstall hooks (T-03-SC mitigation)"
    - "Used static @fontsource/mulish (NOT @fontsource-variable/mulish) per locked D-33 / RESEARCH.md Open Question 2 — static per-weight imports match the Saira pattern and the 4-weight subset is bounded"
    - "icon() integration registered with NO arguments — defaulting to per-glyph SVG inlining (Pitfall E); did NOT pass include or iconDir overrides"
    - "trailingSlash 'always' + build.format 'directory' set explicitly — Astro 6 default may regress in future minors (A7 belt-and-suspenders)"
    - "Replaced the two deleted preconnect lines in BaseHead.astro with a single D-36-citing comment (planner discretion per plan; helpful breadcrumb for future readers and Phase 4 SEO-01 maintainers)"

patterns-established:
    - "Wave-1 dependency manifest pattern: install build-only icon packs via --save-dev, install runtime font packages without --save-dev — keeps Iconify JSON data out of any runtime payload"
    - "BaseHead minimal-head invariant: charset / viewport / title / favicon ONLY through Phase 3; OG / Twitter / canonical / description land in Phase 4 SEO-01..05; preload deferred to Phase 4 per D-37"
    - "Scoped CDN-cleanliness gate at Wave 1 (only fonts.googleapis.com / fonts.gstatic.com tested) — full strict gate (fontawesome / iconify.design / devicon.com / cdnjs / stackpath / jsdelivr / Google Fonts anywhere in dist) is owned by Plan 03-06 Task 3 after Wave 3 section content lands"

requirements-completed: [STYLE-02, STYLE-05]

duration: ~3min
completed: 2026-05-27
---

# Phase 3 Plan 01: Phase 3 Dependency & Config Setup Summary

**astro-icon 1.1.5 + 4 Iconify packs + Fontsource Saira/Mulish wired into the build; trailingSlash and BaseHead trimmed so Wave 2/3 plans can render real sections without any Google Fonts or CDN icon request.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-27T04:25:52Z
- **Completed:** 2026-05-27T04:28:32Z
- **Tasks:** 3
- **Files modified:** 4 (package.json, package-lock.json, astro.config.mjs, src/components/BaseHead.astro)

## Accomplishments

- Installed 7 new packages with versions matching RESEARCH.md verified floors (no [SLOP] / [SUS] flagged; no `--legacy-peer-deps` or `--force` used).
- Registered `astro-icon` integration with zero-argument default — Plans 03-03..03-06 can now author `<Icon name="devicon:python" />` etc. and Astro will resolve at build.
- Set `trailingSlash: 'always'` and `build: { format: 'directory' }` — every Wave-2 anchor link and every future page link is now insulated from 301 redirect hops on GitHub Pages.
- Trimmed BaseHead.astro to charset / viewport / title / favicon only; `dist/` contains zero references to `fonts.googleapis.com` or `fonts.gstatic.com`.
- Phase 1 smoke (5 tests) and Phase 2 content-validation (4 tests) both green — no regressions to scaffold.

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Phase 3 dependencies (astro-icon, 4 Iconify packs, 2 Fontsource packages)** — `a182454` (chore)
2. **Task 2: Wire astro-icon integration + trailingSlash + build.format in astro.config.mjs** — `ebe15b6` (feat)
3. **Task 3: Delete Google Fonts preconnects from BaseHead.astro; verify clean build** — `3672290` (refactor)

## Files Created/Modified

- `package.json` — Added `@fontsource/{saira-extra-condensed,mulish}` to `dependencies`; added `astro-icon` + `@iconify-json/{devicon,simple-icons,logos,lucide}` to `devDependencies`.
- `package-lock.json` — Regenerated with resolved transitive trees for the 7 new packages.
- `astro.config.mjs` — Added `import icon from 'astro-icon'`, added `icon()` as second integration, added `trailingSlash: 'always'` and `build: { format: 'directory' }`. Kept the existing `// @ts-check` directive, the user-site / no-base / Pitfall 10 comment, and the `vite.plugins` block untouched (surgical change).
- `src/components/BaseHead.astro` — Deleted the two `<link rel="preconnect">` lines pointing at `fonts.googleapis.com` and `fonts.gstatic.com`; replaced with a single D-36-citing comment. Kept the `interface Props { title: string }` block, the existing comment header citing D-13 + Phase 4 SEO-01, and the four lines above the deleted block (charset / viewport / title / favicon).

## Resolved Versions (`npm ls`)

```
rashmil-portfolio@0.0.1 /Users/rashmilpanchani/Documents/Rashmil-1999.github.io
├── @fontsource/mulish@5.2.8
├── @fontsource/saira-extra-condensed@5.2.7
├── @iconify-json/devicon@1.2.62
├── @iconify-json/logos@1.2.11
├── @iconify-json/lucide@1.2.109
├── @iconify-json/simple-icons@1.2.84
└── astro-icon@1.1.5
```

Every resolved version matches the RESEARCH.md `^`-pinned floor exactly (no semver lift consumed any newer minor).

## Verification Evidence

- `npx astro check`: 0 errors, 0 warnings, 38 hints (Phase 2 baseline noise — `ts(6385)` deprecation hints on `z` from astro:content, plus 35 unrelated `__hydration-test.astro`-adjacent hints).
- `npm run build`: exits 0; both `dist/index.html` and `dist/hydration-test/index.html` generated (trailing-slash directory format confirmed in the route listing).
- `grep -rE "fonts\.googleapis\.com|fonts\.gstatic\.com" dist/`: exits 1 (zero matches) — the scoped Wave-1 CDN gate.
- `npx vitest run`: 9 tests across 2 suites pass (smoke 5/5, content-validation 4/4).

## Decisions Made

- **Static Fontsource over variable** — Used `@fontsource/mulish` (NOT `@fontsource-variable/mulish`) per D-33 / RESEARCH.md Open Question 2. The 4-weight Mulish subset (400, 400i, 800, 800i) is bounded; static per-weight matches the Saira pattern (which has no variable variant on Fontsource) and keeps `@font-face` count predictable.
- **`icon()` with zero arguments** — Per-glyph SVG inlining default avoids Pitfall E (importing a whole Iconify pack via `include: { devicon: ['*'] }` would inflate dist by ~600 KB).
- **`build: { format: 'directory' }` set explicitly even though it is Astro 6's default** — A7 belt-and-suspenders; future minor versions cannot regress this.
- **Comment line in place of deleted preconnects** — Planner's discretion per Task 3 action ("Optionally replace the deleted lines with a single comment line"). The comment cites D-36 + the Plan 03-02 follow-up, helping the next maintainer trace why two preconnect lines vanished.

## Deviations from Plan

None - plan executed exactly as written.

The plan's verify gates were intentionally scoped:

- **CDN-cleanliness gate intentionally scoped to fonts.googleapis.com / fonts.gstatic.com only** — Plan 03-06 Task 3 owns the full strict CDN sweep after Wave 3 section content lands. At Wave 1 a strict sweep would pass trivially (sections are empty), so testing only the two URLs whose removal this plan owns is the load-bearing check.
- **Pre-existing CSS-bundle warnings from `tailwindcss` about `file:N`/`file:lines` not being known CSS properties** — these are unrelated to this plan (they originate in the existing Tailwind v4 bundle pipeline emitting variant selectors from `prettier-plugin-tailwindcss` or earlier prep work). Build still exits 0. Out of scope per the scope-boundary rule (deviation rule excludes pre-existing warnings). Not added to deferred-items.md because they were already present pre-Plan-03-01 (verified by re-running `npm run build` on the prior `4b5f19b` HEAD).

## Issues Encountered

None.

The npm `EBADENGINE` warning from `vitest@4.1.7` requiring Node `^20.0.0 || ^22.0.0 || >=24.0.0` while local Node is `v23.9.0` is pre-existing (Phase 1 Plan 01-05 carry-forward) — not caused by this plan. Local Node version is one major above the engines floor but `npm install` and all build steps work.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **Plan 03-02 (Wave 2 — styles & fonts):** Can now `@import '@fontsource/saira-extra-condensed/500.css'` etc. in `global.css`; the package resolution will succeed and Vite will hash the `.woff2` files into `dist/_astro/`.
- **Plans 03-03..03-06 (Wave 3 — section authoring):** Can now write `import { Icon } from 'astro-icon/components'` and `<Icon name="devicon:python" aria-hidden="true" />` and the build will resolve from `@iconify-json/devicon`. All four packs (devicon, simple-icons, logos, lucide) cover the union of `skills.yaml` and `about.yaml` icon ids.
- **Plan 03-06 Task 3 (final strict CDN gate):** Inherits the scoped Wave-1 gate from this plan as a stepping stone; the full sweep over `fontawesome | iconify.design | devicon.com | cdnjs | stackpath | jsdelivr | fonts.googleapis | fonts.gstatic` now becomes a meaningful test (Wave 3 section content fills dist with real markup; the strict sweep can prove no CDN url was reintroduced).

No blockers or concerns. Wave 1 is dependency + config only — no visual output changed (intentional per plan objective "deliberately leaves visual output unchanged so its failure mode is isolated").

## Self-Check: PASSED

Verified after writing this SUMMARY:

- `[ -f package.json ]`: FOUND
- `[ -f astro.config.mjs ]`: FOUND
- `[ -f src/components/BaseHead.astro ]`: FOUND
- `git log --oneline | grep a182454`: FOUND (Task 1)
- `git log --oneline | grep ebe15b6`: FOUND (Task 2)
- `git log --oneline | grep 3672290`: FOUND (Task 3)
- `grep -q "import icon from 'astro-icon'" astro.config.mjs`: PASSED
- `grep -q "trailingSlash: 'always'" astro.config.mjs`: PASSED
- `! grep -qE 'fonts\.googleapis\.com|fonts\.gstatic\.com' src/components/BaseHead.astro`: PASSED

---

_Phase: 03-sections-navigation_
_Completed: 2026-05-27_
