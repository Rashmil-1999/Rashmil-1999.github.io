# Roadmap: Rashmil Panchani Portfolio — M1 (Refresh & Modernize)

## Overview

This is a re-platforming of an existing Create React App portfolio onto Astro 6 + TypeScript + Tailwind v4, deployed to GitHub Pages. The visitor sees the same 8 resume sections in the same order; under the hood, the build is static, the components are mostly zero-JS `.astro` files, resume data lives in typed Content Layer collections, and deploy moves from local `gh-pages` to GitHub Actions. M1 ships when the site is live at `https://Rashmil-1999.github.io/` with full content parity, zero WCAG 2.1 AA violations, the documented anti-patterns deleted, and SEO meta hygiene present that the existing site never had.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Astro 6 + TS strict + Tailwind v4 + ESLint + Vitest scaffold builds to `dist/` and passes a smoke test (completed 2026-05-26)
- [x] **Phase 2: Content Layer** - All 8 resume collections defined and `resumeData.json` migrated with zero data loss (completed 2026-05-27)
- [ ] **Phase 3: Sections & Navigation** - All 8 sections render from collections, side nav with scroll-spy works, all CDN UI libs gone
- [ ] **Phase 4: SEO, A11Y & Meta Polish** - Shared `<BaseHead>`, sitemap, OG/Twitter/canonical, zero axe-core WCAG 2.1 AA violations
- [ ] **Phase 5: Cleanup & Deploy** - CRA / yarn.lock / CNAME / gh-pages branch removed, GitHub Actions publishes the live site

## Phase Details

### Phase 1: Foundation

**Goal**: A working Astro 6 + TypeScript + Tailwind v4 project that builds to `dist/`, type-checks clean, lints clean, runs a smoke test, and is wired to a (not-yet-publishing) GitHub Actions workflow — with no dual-lockfile risk and the `site:` URL set so every later SEO/meta requirement can build on it.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, FOUND-08
**Success Criteria** (what must be TRUE):

  1. `npm run build` on a clean clone produces a `dist/` directory containing a working `index.html` (Hello-world placeholder is acceptable at this phase).
  2. `npx astro check` exits 0 with TypeScript strict mode enabled, and `npm run lint` exits 0.
  3. `npm test` runs the Vitest smoke suite (which actually spawns `astro build` as a subprocess) and exits 0; deliberately breaking the build causes the test to fail.
  4. Repo contains exactly one lockfile (`package-lock.json`); `yarn.lock` is deleted; `npm ls react react-dom @astrojs/react` reports no duplicate or invalid React versions.
  5. `astro.config.mjs` sets `site: 'https://Rashmil-1999.github.io'` and `output: 'static'`, does NOT set `base`, and wires `@tailwindcss/vite` (not `@astrojs/tailwind`); a Tailwind utility used in a `.astro` file produces matching CSS in `dist/_astro/`.

**Plans:** 5/5 plans complete
**Wave 1**

- [x] 01-01-PLAN.md — Snapshot pre-wipe source, commit `.claude/`, rename master→main, wipe CRA tree, baseline Astro scaffold (FOUND-01, FOUND-07) — completed 2026-05-26, rollup commit `30f8cab`

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Wire React + Tailwind v4 integrations; tighten tsconfig to strictest; verify single-lockfile npm tree (FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-07, FOUND-08)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-03-PLAN.md — Author BaseLayout + BaseHead + 8 section stubs (D-23 ids; About carries Tailwind marker) + React 19 hydration fixture + Tailwind entry CSS + content.config.ts placeholder (FOUND-03, FOUND-04, FOUND-06)

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 01-04-PLAN.md — Install ESLint 9 + Prettier + husky + lint-staged; author flat config + Prettier rules + ignore lists; npm run lint + format:check exit 0 (FOUND-05)

**Wave 5** *(blocked on Wave 4 completion)*

- [x] 01-05-PLAN.md — Install Vitest; author vitest.config.ts + globalSetup spawning `astro build` + 5-assertion smoke test; author .github/workflows/ci.yml (lint+format:check+astro-check+test on main, no deploy) (FOUND-06)

### Phase 2: Content Layer

**Goal**: All resume data migrated from `src/resumeData.json` into typed Content Layer collections at the M2-compatible per-item shape (markdown files for lists, YAML for singletons), with Zod schemas that catch malformed data at build and project images bound through the `image()` helper so the optimization pipeline is active.
**Depends on**: Phase 1
**Requirements**: CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06, CONTENT-07, CONTENT-08
**Success Criteria** (what must be TRUE):

  1. `src/content.config.ts` (Astro 6 location, NOT `src/content/config.ts`) defines all 8 collections; `await getCollection('projects')` returns `length > 0` and entries are typed (no `any`).
  2. Every list collection (`projects`, `work`, `education`, `leadership`, `testimonials`) uses `glob()` over per-item markdown files; every singleton (`about`, `skills`, `links`) uses `file()` over one YAML file each.
  3. Every resume item from the old `src/resumeData.json` is reachable through the new collections — a manual diff of fields (names, dates, links, descriptions, tech stacks) shows zero data loss.
  4. `npx astro check` validates content against schemas; introducing a deliberately-malformed test fixture (missing required field) fails the build with a useful Zod error referencing the field path.
  5. Project images are colocated with their markdown in `src/content/projects/` and referenced via the `image()` schema helper; no hand-maintained `image_map` lookup object exists anywhere in the codebase.

**Plans:** 7/7 plans complete

**Wave 1**

- [x] 02-01-PLAN.md — Fill src/content.config.ts with 8 defineCollection exports + Zod 4 schemas (CONTENT-01, CONTENT-04, CONTENT-07)

**Wave 2** *(blocked on Wave 1)*

- [x] 02-02-PLAN.md — Author about.yaml + skills.yaml + links.yaml singletons; relocate profile.jpg (CONTENT-03)
- [x] 02-03-PLAN.md — Colocate 16 project images + 4 orphans; rename graduino.png → garduino.png (CONTENT-05 asset side)

**Wave 3** *(blocked on Wave 2)*

- [x] 02-04-PLAN.md — Author 13 project markdown entries with cover/alternates refs (CONTENT-02, CONTENT-05)
- [x] 02-05-PLAN.md — Author 2 work + 3 education + 1 leadership + 1 testimonial entries (CONTENT-02)

**Wave 4** *(blocked on Wave 3)*

- [x] 02-06-PLAN.md — Author tests/content-validation.test.ts + malformed fixture (CONTENT-08)

**Wave 5** *(blocked on Wave 4)*

- [x] 02-07-PLAN.md — Author 02-PARITY.md and human-verify zero-data-loss checkpoint (CONTENT-06) — completed 2026-05-27

### Phase 3: Sections & Navigation

**Goal**: A composed `index.astro` page that renders all 8 resume sections from collection data with visual parity to the existing site (light polish only), side nav with native scroll-spy and smooth scroll, all icons bundled via `astro-icon`, all CDN UI dependencies gone, and zero React runtime shipped for static markup.
**Depends on**: Phase 2
**Requirements**: SECTION-01, SECTION-02, SECTION-03, SECTION-04, SECTION-05, SECTION-06, SECTION-07, SECTION-08, SECTION-09, SECTION-10, NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, STYLE-01, STYLE-02, STYLE-03, STYLE-04, STYLE-05
**Success Criteria** (what must be TRUE):

  1. Visiting `npm run preview` shows all 8 resume sections (About, Education, Work, Skills, Projects, Leadership, Testimonials, plus SideNav) populated with real content from the Content Layer collections, in the same order and information density as the existing site.
  2. Clicking a side-nav link smooth-scrolls to its section; scrolling the page updates `aria-current="page"` on the matching nav link via IntersectionObserver; `prefers-reduced-motion: reduce` disables smooth scroll; mobile nav toggle is keyboard-operable with correct `aria-expanded` / `aria-controls`.
  3. `grep -r "client:load\|client:visible\|client:idle" src/` returns zero hits on section components — no React runtime ships for static sections; `dist/_astro/` contains no React chunk for the home page.
  4. No CDN `<script>` or `<link>` for Bootstrap, jQuery, Font Awesome, Devicon, or Iconify exists in any generated HTML; the `bootstrap` package is not installed; all icons render from bundled `astro-icon` + `@iconify-json/*` SVGs.
  5. Project images render via Astro's `<Image />` as optimized WebP/AVIF served at rendered dimensions (not the original 4.8 MB / 1 MB binaries); total image weight on `dist/index.html` is under 500 KB.

**Plans:** 4/6 plans executed
**Wave 1**

- [x] 03-01-PLAN.md — Install astro-icon + 4 Iconify packs + 2 Fontsource packages; wire icon() integration + trailingSlash + build.format in astro.config.mjs; delete Google Fonts preconnects from BaseHead.astro (STYLE-02, STYLE-05)

**Wave 2** *(blocked on Wave 1)*

- [x] 03-02-PLAN.md — Fill src/styles/global.css with @theme tokens (recovered CRA colors + Saira/Mulish fonts) + 6 Fontsource per-weight @imports + base body/heading + smooth-scroll + reduced-motion guard + recovered semantic classes (.subheading, .lead, .resume-section, sidebar layout media queries, .nav-link[aria-current='page'], .profile-pic, .text-primary, .btn-primary, .text-muted, .social-icon, .project-card:nth-child(even) row-reverse fallback) (STYLE-01, STYLE-04, NAV-02)

**Wave 3** *(blocked on Wave 2)*

- [x] 03-03-PLAN.md — Fill About.astro (h1 + accent span + status + email + Download Resume CTA + social row + mobile-only profile photo) + Skills.astro (6 categories + bundled icons + decorative ARIA) + Testimonials.astro (blockquote + cite + role/org; no trailing hr) (SECTION-02, SECTION-05, SECTION-08, SECTION-09)
- [x] 03-04-PLAN.md — Fill Education.astro + Work.astro + Leadership.astro (3 flat-row list-collection sections; shared draft predicate + sort by order + Content body rendering; canonical 'Work' label per Phase 2 D-24) (SECTION-03, SECTION-04, SECTION-07, SECTION-09)
- [ ] 03-05-PLAN.md — Fill Projects.astro (13 alternating-row cards with Astro <Image /> optimized covers, stretched-link a11y, name-only tech-stack pills, external-link safety triple); verify total home-page image weight < 500 KB (SECTION-06, SECTION-09, SECTION-10, STYLE-03)

**Wave 4** *(blocked on Wave 3)*

- [ ] 03-06-PLAN.md — Fill SideNav.astro (desktop fixed sidebar + mobile sticky top bar + hamburger toggle script reading 7 anchors from links.yaml) + add IntersectionObserver scroll-spy <script> to BaseLayout.astro; run all 5 Phase 3 ROADMAP success-criteria gates (SECTION-01, SECTION-09, NAV-01, NAV-03, NAV-04, NAV-05, STYLE-01)
**UI hint**: yes

### Phase 4: SEO, A11Y & Meta Polish

**Goal**: A shared `<BaseHead>` component delivers OpenGraph + Twitter Card + canonical + real description on every page; `@astrojs/sitemap` emits `sitemap-index.xml`; the rendered site passes WCAG 2.1 AA contrast and label requirements with zero axe-core / pa11y violations; semantic landmarks and heading hierarchy are correct; keyboard-only navigation reaches every interactive element with a visible focus ring.
**Depends on**: Phase 3
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06, A11Y-07
**Success Criteria** (what must be TRUE):

  1. Viewing source of `dist/index.html` shows a real `<meta name="description">` sourced from the `about` collection (not the CRA default "Personal Website"), OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`), Twitter Card tags, and a `<link rel="canonical">` derived from `Astro.site` + current path — all rendered by a single shared `BaseHead.astro` component.
  2. `dist/sitemap-index.xml` exists after build, references the homepage, and `robots.txt` points to it; one OG image asset (1200×630) is committed and resolves to a 200 from the built site.
  3. Running axe-core (or pa11y) against the built `dist/index.html` reports zero WCAG 2.1 AA violations — every icon-only link/button has an `aria-label`, every text/background combination meets 4.5:1 contrast, single `<h1>` with `<h2>` per section in correct order, no skipped heading levels.
  4. Tab-only keyboard walkthrough reaches every interactive element in logical order with a visible focus ring (no `outline: none` without a replacement); the active side-nav link is conveyed by more than color alone (border or weight in addition to `aria-current`); `prefers-reduced-motion: reduce` is honored.
  5. All external links (project repos, social) include `rel="noopener noreferrer"` and the new-tab behavior is announced to assistive tech (e.g., visually-hidden "(opens in new tab)" or `aria-describedby`).

**Plans**: TBD
**UI hint**: yes

### Phase 5: Cleanup & Deploy

**Goal**: All CRA artifacts and dead dependencies deleted, the old `gh-pages` branch and `public/CNAME` removed, README updated to reflect the new stack, GitHub Actions workflow publishes the site, and the live URL `https://Rashmil-1999.github.io/` serves the new build with all 8 sections, the résumé PDF downloadable, and zero 404s on assets.
**Depends on**: Phase 4
**Requirements**: CLEAN-01, CLEAN-02, CLEAN-03, CLEAN-04, CLEAN-05, CLEAN-06, CLEAN-07, CLEAN-08, DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04, DEPLOY-05, DEPLOY-06
**Success Criteria** (what must be TRUE):

  1. `package.json` contains no `react-scripts`, `react-scroll`, `react-script-tag`, `gh-pages`, or `bootstrap`; `src/App.css`, `src/App.js`, `src/App.test.js`, `src/serviceWorker.js`, `src/setupTests.js`, `src/index.js`, `src/components/*.jsx`, `src/resumeData.json`, `public/CNAME`, `public/manifest.json` (the CRA default), `public/index.html` (the CRA shell), and the inline jQuery scroll-spy IIFE are all absent from the working tree.
  2. `.github/workflows/deploy.yml` uses `withastro/action@v6` + `actions/deploy-pages@v4` with `permissions: { contents: read, pages: write, id-token: write }`, triggers on push to the default branch and on `workflow_dispatch`; the repo's Pages source is set to "GitHub Actions" (not "Deploy from a branch").
  3. Pushing to the default branch triggers the workflow, which publishes a fresh build visible at `https://Rashmil-1999.github.io/` within 5 minutes; the live page loads all 8 sections, the résumé PDF at `/Rashmil_Panchani.pdf` returns 200 and downloads, and no asset URL 404s.
  4. The old `gh-pages` git branch is deleted after the first successful Actions deploy; `npm run` no longer includes meaningful `predeploy` / `deploy` scripts pointing at the `gh-pages` package.
  5. README documents the new dev commands (`npm run dev`, `npm run build`, `npm run preview`), the new stack, and the GitHub Actions deploy model.

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 5/5 | Complete    | 2026-05-26 |
| 2. Content Layer | 7/7 | Complete    | 2026-05-27 |
| 3. Sections & Navigation | 4/6 | In Progress|  |
| 4. SEO, A11Y & Meta Polish | 0/TBD | Not started | - |
| 5. Cleanup & Deploy | 0/TBD | Not started | - |

---
*Roadmap created: 2026-05-26 — milestone M1 (Refresh & Modernize), 5 phases, 64 v1 requirements mapped*
