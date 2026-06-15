# Portfolio Improvement Plan

Status: **live-site parity achieved in the Astro stack.** The app (`npm run dev`)
now renders the recovered live-site design — purple hero with typewriter titles and
owl/sun theme switch, terminal-card About with polaroid, Education + Experience
vertical timelines, clickable project cards with modal image carousel and tech-stack
icons, colored Devicon skills grid, dark footer, GitHub corner, and the full dark
theme (now persisted to localStorage, which the live site never did). All content is
the live site's 2022 data in typed Content Collections. See
`docs/live-site-recovery.md` for provenance.

## P0 — Ship it

1. ~~**Deployment pipeline.**~~ DONE. `.github/workflows/deploy.yml` builds and
   publishes to GitHub Pages via the **Actions** Pages source (the repo's
   `build_type` was flipped from `legacy`/`gh-pages` to `workflow`). It runs the full
   gate (lint + format:check + astro check + test) before building, so a red `main`
   never ships. `ci.yml` now only gates pull requests. The old `gh-pages` branch is no
   longer the source but is retained for history (the 2022 build + source maps live
   there).
2. ~~**Push `main`.**~~ DONE — `main` pushed to `origin/main`; pushing triggers the
   deploy workflow.
3. ~~**Custom domain.**~~ DONE — `rashmilpanchani.me` is retired; Pages `cname` is
   null and no `CNAME` file exists. The site serves at the default
   `rashmil-1999.github.io`.
4. **Content freshness pass.** All content is verbatim from Sept 2022: "August 2022 -
   Present" on the NCSA pyincore role, `current_status`, and the resume PDF
   (`public/Rashmil_Resume.pdf`, 2022 — note `Rashmil_Resume.pdf` is now the live
   one). Update durations, add 2022→2026 roles and projects (e.g. IN-CORE/pyincore as
   a project entry), and drop in a current resume PDF. The live text also carries
   typos worth fixing while editing ("managable", "ans is available", "fron the
   college").

## P1 — UI polish (beyond parity)

1. **Timeline entrance animations.** The original react-vertical-timeline faded
   elements in on scroll. Recreate with CSS scroll-driven animations
   (`animation-timeline: view()`) behind `@supports` + `prefers-reduced-motion`
   guards — no JS needed.
2. **Two-column timeline on wide screens.** The live timelines alternated cards
   left/right of a center rail on desktop. The port uses a single left rail; an
   `xl:` two-column variant would complete the look.
3. **Carousel transitions.** The modal slider cuts between images; the live
   react-awesome-slider animated. A CSS crossfade (or View Transitions API) on slide
   change, reduced-motion-guarded, restores the feel.
4. **Real screenshot alt text.** Carousel images currently get generic
   "screenshot N of M" alt text. Add an optional per-image caption/alt field to the
   projects schema (also feeds a visible caption line in the modal).
5. **Dark-theme contrast tuning.** The recovered dark palette has weak spots the
   port inherited deliberately (parity first): white-on-`#7f7f7f` About headings sit
   near 4:1. Nudge surfaces darker (e.g. `#6d6d6d`-range) to clear WCAG AA without
   changing the look meaningfully.
6. **Hero responsiveness extras.** Subtle gradient or particle-free texture on the
   hero, larger laptop glyph on desktop, and `scroll-margin-top` on sections if a nav
   ever returns.
7. **Skills hover affordance.** Grayscale→color or slight scale on hover/focus for
   the Devicon grid (cheap, classy, reduced-motion-safe).

## P2 — Platform & quality

1. **SEO/social meta.** OG + Twitter cards, canonical URL, JSON-LD `Person`, custom
   favicon set (current `favicon.svg` is the Astro default), `@astrojs/sitemap`, and
   a real `manifest.webmanifest`.
2. **CI quality gates.** Lighthouse CI (perf/a11y/SEO ≥ 95), `@axe-core/playwright`
   a11y pass over the built page, Playwright smoke (theme toggle persists, modal
   opens/closes with keyboard, PDF link 200s).
3. **Analytics (optional).** Privacy-friendly (Plausible/GoatCounter) — the live
   site's react-ga/Universal Analytics is long dead.
4. **M2 editing surface.** Content is in typed collections (md + yaml). Evaluate
   Keystatic (first-class Astro content-collection support, GitHub-app mode works on
   GitHub Pages) vs Decap CMS.
5. **Old-design assets cleanup.** `public/Rashmil_Panchani.pdf` (superseded by
   `Rashmil_Resume.pdf` but kept so old links work), `src/assets/profile.jpg` (old
   photo; live one is `profile.jpeg`), and `src/content/_orphans/` are unused —
   prune once you're sure nothing external links to them.

## Notes

- Live-site provenance + recovery method: `docs/live-site-recovery.md`.
- The deployed 2022 build (and its source maps) live forever in `gh-pages` branch
  history (`8c0cb75`); the old Bootstrap CRA is at `c83c1e6`; the pre-wipe snapshot
  is at `.planning/snapshots/m1-source/` per commit `30f8cab`.
