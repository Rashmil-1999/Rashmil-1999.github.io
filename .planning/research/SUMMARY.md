# Project Research Summary

**Project:** Rashmil Panchani Portfolio — CRA to Astro Modernization
**Domain:** Static personal developer portfolio (single-page, GitHub Pages user-site)
**Researched:** 2026-05-26
**Confidence:** HIGH (stack, architecture, pitfalls); MEDIUM (Tailwind v4 + Astro in combination)

---

## Open Decision: Astro 5 vs Astro 6

**This must be resolved before requirements are finalized.**

PROJECT.md says "Astro 5." Stack research found that as of 2026-05-26, Astro 5 has been superseded — current stable is **Astro 6.3.8**. The user's stated intent is "latest of everything that plays well together." All integrations verified for Astro 6 (`@astrojs/react@5.0.5`, `@tailwindcss/vite@4.1.7`, `astro-icon@1.1.5`, `withastro/action@v6`) also support Astro 5 (5.18.2 is the last 5.x). The code and patterns in the research files apply identically to both.

**Recommendation:** Default to Astro 6.3.8. If the orchestrator/user wants to honor the "Astro 5" wording in PROJECT.md literally, pin `astro@~5.18.2` — nothing else changes.

---

## Executive Summary

This is a re-platforming of an existing Create React App single-page portfolio onto Astro + TypeScript + Tailwind v4, deployed to GitHub Pages. The existing site has the right content and structure (8 resume sections, anchor navigation, PDF download) but ships on a deprecated build tool with CDN-loaded icon fonts, jQuery scroll-spy, Bootstrap 4 CSS, and a hand-maintained image map — all documented anti-patterns in the codebase audit. The modernization goal is to produce the same visible result with a maintainable, accessible, typed foundation that a future editing surface (M2) can write to.

The recommended approach is Astro's hybrid component model: every section is a `.astro` file (zero client JS by default), React 19 is installed but reserved for genuinely interactive islands that do not exist on day one. Content migrates from a single `resumeData.json` into Astro's Content Layer using `glob()` loaders for list collections (projects, work, education, leadership, testimonials) and `file()` loaders for singleton YAML files (about, skills, links). Per-item markdown files with colocated images eliminate the `image_map` anti-pattern and create the per-file edit surface M2 will need. Tailwind v4 replaces Bootstrap 4 via the `@tailwindcss/vite` plugin (not the deprecated `@astrojs/tailwind`), with CSS-first token configuration. Deployment switches from the local `gh-pages` npm script to `withastro/action@v6` + `actions/deploy-pages@v4` triggered by GitHub Actions.

The primary risks are all implementation-time traps, not architectural unknowns: using legacy Astro 4 config patterns instead of the Content Layer loader API, setting `base` on a user-site repo (breaks every asset URL), porting CRA components as React islands instead of `.astro` files (ships React for static markup), and failing to use the `image()` schema helper (silently skips image optimization and re-creates the existing 5 MB image problem). All are mechanical to prevent with correct scaffolding and the pitfall checklist below.

---

## Key Findings

### Recommended Stack

The stack is settled and all versions are verified against the npm registry as of 2026-05-26. The core is `astro@6.3.8` (or `5.18.2`) + `@astrojs/react@5.0.5` + `react@19.2.6` + `tailwindcss@4.1.7` + `@tailwindcss/vite@4.1.7` + `typescript@5.9.x`. Icons consolidate into `astro-icon@1.1.5` + `@iconify-json/simple-icons` + `@iconify-json/devicon`, replacing three CDN dependencies with one build-time-inlined solution. Testing is `vitest@3.2.x` via `getViteConfig()`. Deploy is `withastro/action@v6`. All versions are cross-compatible.

**Core technologies:**
- **Astro 6.3.8** (or 5.18.2): Static-first framework, Content Layer, Islands architecture — zero JS by default; see Open Decision above
- **@astrojs/react@5.0.5 + React 19.2.6**: Islands only — none on day one; `.astro` is the default port target
- **Tailwind v4.1.7 via @tailwindcss/vite**: Replaces 186 KB Bootstrap 4 CSS + CDN; CSS-first `@theme` config, no `tailwind.config.js`
- **TypeScript strict (5.9.x via Astro)**: Typed Content Layer schemas catch resume-data errors at build, not at render
- **astro-icon@1.1.5**: Build-time SVG inlining from Iconify JSON sets; replaces Font Awesome 5 + Devicon CDN + Iconify runtime
- **withastro/action@v6**: GitHub Actions deploy; replaces `gh-pages` npm package and local-machine deploy risk

**What NOT to use:** `@astrojs/tailwind` (Tailwind v3 only, last published Sept 2024), `tailwind.config.js` (replaced by `@theme`), the legacy `src/content/config.ts` location (Astro 4), CDN-loaded Bootstrap/Font Awesome/Devicon/jQuery, `gh-pages` npm package, `yarn.lock` (delete it; standardize on npm).

### Expected Features

The site's feature set is fixed: 8 resume sections ported without regression, plus a small set of missing table-stakes added in M1. No new sections, no visual redesign, no dark mode.

**Must have — port without regression (Validated):**
- 8 resume sections: About, Education, Work, Skills, Projects, Leadership, Testimonials
- Anchor navigation with smooth scroll (native CSS + IntersectionObserver, no jQuery)
- Profile photo, social links, email
- Resume PDF download (`/Rashmil_Panchani.pdf`)
- Project cards with images, tech-stack chips, links
- Mobile-responsive layout
- Favicon, `robots.txt`, functional `<title>`
- GitHub Pages static hosting at `https://Rashmil-1999.github.io/`

**Must add in M1 — new P1 SEO/meta requirements (table stakes in 2026, currently absent):**
- **OpenGraph tags** (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) in a shared `<BaseHead>` component — needed for link previews on LinkedIn, Slack, iMessage
- **Twitter Card tags** (`twitter:card`, `twitter:title`, `twitter:image`) — same `<BaseHead>`
- **Canonical URL** (`<link rel="canonical">`) — prevents duplicate-content penalty between `*.github.io` and any future custom domain
- **Real `<meta name="description">`** — current value is the generic CRA default "Personal Website"
- **`@astrojs/sitemap` integration** — drop-in; required by Google Search Console
- **Prerequisite for all four:** `site:` must be set in `astro.config.mjs` first

**Should add in M1 — P2 polish (cut without guilt if M1 gets long):**
- Real `manifest.webmanifest` (current CRA default manifest is leakage)
- JSON-LD Person schema (~15 lines, high signal-to-cost)
- Custom `404.astro` page (Astro generates trivially)

**Defer to M2+:** Dark mode (PROJECT.md Out of Scope), View Transitions (zero value on single-page site), analytics, PWA/service worker, custom domain, i18n, per-page OG image generation, scroll-reveal animations, project case studies, live GitHub stats.

**Anti-features (never add):** Splash screens, typewriter/particle animations, auto-playing media, custom cursor, horizontal scroll layouts, embedded chatbots, more than 2 web fonts, cookie consent banners on a cookieless static site.

### Architecture Approach

The architecture is a build-time static pipeline: Content Layer collections in `src/content/` (typed via Zod schemas in `src/content.config.ts`) are fetched by `src/pages/index.astro`, passed as props to section components in `src/components/sections/`, and assembled inside `BaseLayout.astro`. There is no client-side data fetching, no state management, and no React hydration on day one. The `src/components/islands/` directory exists but is empty — its presence enforces the convention that React components must be intentional.

**Major components:**
1. `src/content.config.ts` — Zod schemas + loader declarations; the single source of type truth for all resume data
2. `src/pages/index.astro` — composition root; the only file that calls `getCollection()` / `getEntry()`; fans data into section props
3. `src/layouts/BaseLayout.astro` — HTML shell, `<head>` (BaseHead with OG/canonical/sitemap), semantic landmarks, global CSS import, skip link
4. `src/components/sections/*.astro` — one per resume area; presentational, zero client JS
5. `src/components/ui/*.astro` — reusable atoms (Card, Chip, IconLink, SrOnly, ExternalLink)
6. `src/components/nav/SideNav.astro` — fixed sidebar + inline `<script>` with IntersectionObserver for `aria-current` scroll-spy
7. `src/components/islands/` — empty in M1; reserved for future React 19 islands

### Non-Negotiable Architectural Contracts for M2-Readiness

These constraints must be honored in M1 so M2 is not blocked:

1. **Mixed-loader Content Layer split:** List collections (projects, work, education, leadership, testimonials) use `glob()` with one `.md` file per item. Singleton collections (about, skills, links) use `file()` with a single `.yaml` file. Do not collapse list collections into one JSON/YAML — removes the per-item edit story for every CMS option.

2. **Per-item images via `image()` schema:** Project images live in `src/content/projects/<slug>/` next to their markdown, referenced as `image: ./cover.webp`. The schema uses `schema: ({ image }) => z.object({ image: image().optional() })`. No image map object.

3. **CMS-neutral field names:** Schema fields use plain names (`title`, `image`, `imageAlt`, `url`, `techStack`, `order`) — not CMS-specific names. Icon fields use local enum strings (`"github"`) resolved to bundled SVGs by `ui/IconLink.astro`, never CSS class strings (`"fab fa-github"`).

4. **`order: number` on every list item:** Lets a future CMS expose drag-to-reorder without filename changes.

5. **No HTML in frontmatter:** Use markdown body for prose. A CMS can write markdown; it cannot safely write raw HTML strings.

6. **Section components never call `getCollection()`:** Only `index.astro` fetches data; sections are pure presentational components.

### Carry-Forward Anti-Patterns to Explicitly Address

| Anti-pattern | Current location | M1 fix |
|---|---|---|
| Hand-maintained `image_map` JS object | `Projects.jsx` | Delete; use `image()` schema + colocated files |
| jQuery scroll-spy IIFE | `public/index.html` | Delete; use IntersectionObserver in `SideNav.astro` |
| CDN-loaded jQuery + Bootstrap 4 CSS | `public/index.html` | Delete; Tailwind v4 replaces Bootstrap |
| CDN-loaded Font Awesome 5 + Devicon + Iconify | `public/index.html` | Delete; `astro-icon` + `@iconify-json/*` replaces all three |
| `react-scroll` and `react-script-tag` dead deps | `package.json` | Delete |
| `<StrictMode>` at app root | `src/index.js` | Deleted with `src/index.js` |
| Parallel `sections`/`links` arrays in `resumeData.json` | `resumeData.json` | Merge into single `src/content/links.yaml` |
| Icon-only social links with no `aria-label` | `About.jsx` | Every icon-only `<a>` or `<button>` gets `aria-label` |
| `public/CNAME` for dead custom domain | `public/` | Delete |
| CRA-default `manifest.json` | `public/` | Replace or delete |
| `src/serviceWorker.js` (unregistered) | `src/` | Delete |
| `src/App.css` (186 KB Bootstrap 4) | `src/` | Delete; re-derive in `global.css` |
| `yarn.lock` (dual lockfile) | repo root | Delete; standardize on npm |

### Critical Pitfalls

Top pitfalls by severity shaping phase ordering (30 total in PITFALLS.md):

1. **Setting `base` on a user-site repo (Pitfall 10, build-breaking)** — `base: '/Rashmil-1999.github.io/'` breaks every asset URL in production; works locally. Fix: omit `base` entirely; set only `site: 'https://Rashmil-1999.github.io'`. Address in foundation.

2. **Content Layer config at wrong path (Pitfall 1, build-breaking)** — `src/content/config.ts` (Astro 4 location) is silently ignored; all `getCollection()` calls return empty/untyped. Fix: use `src/content.config.ts`; delete `.astro/` cache after moving. Address in content phase.

3. **`public/CNAME` surviving into new repo (Pitfall 24, runtime-breaking)** — GitHub Pages routes traffic to dead `rashmilpanchani.me` domain; site unreachable. Fix: delete `public/CNAME` in foundation cleanup.

4. **React 19 + `@astrojs/react` version mismatch (Pitfall 7, runtime-breaking)** — mismatched versions cause "Invalid hook call" at hydration; risk is elevated by the current dual lockfile situation. Fix: delete `yarn.lock` before installing; use `npx astro add react`; pin matching React/React-DOM minors.

5. **Wrong GitHub Pages source setting (Pitfall 11, silent-degradation)** — workflow runs green but site never updates (still serving `gh-pages` branch). Fix: change Settings → Pages → Source to "GitHub Actions" before removing the `gh-pages` package.

6. **Porting CRA components as React islands with `client:load` (Pitfalls 5/6, silent-degradation)** — ships React for static markup; may ship more JS than the CRA original. Fix: default port target is `.astro`. No `client:load` on this site — all sections are stateless.

7. **Image schema using `z.string()` instead of `image()` (Pitfall 4, silent-degradation)** — no build-time validation, no optimization; re-creates the 5 MB PNG perf bug. Fix: `schema: ({ image }) => z.object({ cover: image() })`; colocate images with markdown; render with `<Image />`.

8. **Tailwind v4 default gray scale fails WCAG AA (Pitfall 15, a11y hard requirement)** — `text-gray-400` (2.85:1) and `text-gray-500` (4.13:1) both fail the 4.5:1 requirement. Fix: project rule is `gray-700` or darker on white/light backgrounds; axe-core CI gate.

---

## Implications for Roadmap

### Phase 1: Foundation

**Rationale:** `astro.config.mjs` (especially `site:`, no `base`, `output: 'static'`) is a prerequisite for the Content Layer, sitemap, canonical URLs, and the entire build pipeline. Getting it right at the start prevents the most severe pitfalls from compounding.

**Delivers:** Working Astro project that builds to `dist/index.html`, serves at the correct URL, passes `astro check`, and deploys via Actions. Single lockfile. No legacy artifacts.

**Addresses from FEATURES.md:** GitHub Pages hosting at root URL; WCAG semantic landmarks in `BaseLayout.astro`

**Avoids:** Pitfall 7 (React mismatch — delete yarn.lock first), Pitfall 8 (no View Transitions), Pitfall 10 (no `base`), Pitfall 12 (correct `permissions` block), Pitfall 13 (Tailwind `--color-*` naming), Pitfall 24 (CNAME deleted), Pitfall 29 (Tailwind source detection via Vite plugin), Pitfall 30 (smoke test runs `astro build` as subprocess)

**Verify:** `npm run build` produces `dist/index.html`; smoke test passes on clean clone; no `yarn.lock`; `public/CNAME` absent; `base` unset.

### Phase 2: Content Layer Migration

**Rationale:** Schemas define the prop types that section components consume. Changing a schema after sections are built forces section rewrites. Data first, components second.

**Delivers:** All 8 collections defined; `resumeData.json` migrated to per-item markdown + YAML files; project images colocated; `astro build` succeeds with real data; Zod errors surface bad data at build.

**Addresses from FEATURES.md:** Content driven from typed single source of truth; M2-compatible per-item file structure

**Avoids:** Pitfall 1 (correct config path), Pitfall 2 (loader API not `type: 'content'`), Pitfall 3 (`file()` schema shape), Pitfall 4 (`image()` helper), Pitfall 19 (parallel arrays merged), Pitfall 20 (`image_map` eliminated), Pitfall 28 (`getCollection` filtering convention)

**Verify:** `.astro/content.d.ts` lists all 8 collections; `getCollection('projects')` returns `length > 0`; `astro check` passes.

### Phase 3: Section Components

**Rationale:** With typed data available, sections are pure presentational work. Build one at a time, wiring each into `index.astro` as you go.

**Delivers:** All 8 resume sections rendered with real content; visual parity with existing site; all icon CDNs replaced with `astro-icon` inlined SVGs; all icon-only links have `aria-label`.

**Build order:** About → Education → Work → Skills → Projects → Leadership → Testimonials

**Addresses from FEATURES.md:** All 8 sections (Validated); project cards with `<Image>` optimization; skills icons; social links with accessible labels

**Avoids:** Pitfall 5 (no `client:load`), Pitfall 6 (sections are `.astro` not React), Pitfall 17 (typed `Props` interfaces), Pitfall 18 (no `<StrictMode>`), Pitfall 22 (icon-only `aria-label`), Pitfall 23 (no whole-library icon imports)

**Verify:** All 8 section IDs in `dist/index.html`; project images render as WebP/AVIF; no React chunk for static sections; `grep -r "client:load" src/` returns 0 lines.

### Phase 4: Navigation and Scroll-Spy

**Rationale:** Navigation is the only client JavaScript in M1. Keeping it as a separate phase enforces the constraint that it is a `<script>` in `SideNav.astro` (not a React island) and makes accessibility acceptance criteria testable in isolation.

**Delivers:** Fixed sidebar; smooth-scroll via CSS; `IntersectionObserver`-based `aria-current`; keyboard-accessible; Lighthouse a11y ≥ 95.

**Addresses from FEATURES.md:** Anchor navigation; mobile-responsive layout; WCAG 2.1 AA compliance for nav

**Avoids:** Pitfall 8 (no View Transitions — no re-init concern), Pitfall 21 (IntersectionObserver not React scroll listener)

**Verify:** Anchors jump; smooth-scroll works; active link updates on scroll; keyboard tab order sane; mobile menu collapses on link click.

### Phase 5: Meta, SEO, and Polish

**Rationale:** SEO/meta requires `site:` (Phase 1) and section HTML (Phase 3) to already exist. The a11y pass requires rendered output to audit. The `<BaseHead>` OG image content requires knowing the final section structure.

**Delivers:** `<BaseHead>` with OpenGraph + Twitter Cards + canonical + real description; `@astrojs/sitemap`; color-contrast pass; WCAG 2.1 AA conformance; `manifest.webmanifest` (P2); JSON-LD Person schema (P2); custom `404.astro` (P2).

**Addresses from FEATURES.md:** All new P1 SEO/meta requirements; WCAG 2.1 AA compliance; Lighthouse ≥ 90

**Avoids:** Pitfall 14 (v4 border default `currentColor`), Pitfall 15 (gray scale contrast), Pitfall 16 (no accidental `dark:` utilities)

**Verify:** Lighthouse Performance ≥ 90, a11y = 100; axe-core 0 violations; OG tags in `dist/index.html`; `dist/sitemap-index.xml` exists; VoiceOver announces all icon-only links by name.

### Phase 6: Cleanup and Deploy Hardening

**Rationale:** Final verification on a clean clone and removal of all CRA artifacts. Nothing here should cause a regression if Phases 1–5 were done correctly.

**Delivers:** Site live at `https://Rashmil-1999.github.io/`; all CRA artifacts deleted; Actions workflow green; PDF download works; image optimization verified.

**Addresses from FEATURES.md:** GitHub Actions deploy workflow; PDF download; single `package-lock.json`

**Avoids:** Pitfall 9 (`trailingSlash: 'always'`), Pitfall 11 (Pages source = "GitHub Actions"), Pitfall 25 (PDF cache-busting), Pitfall 26 (404.html in dist), Pitfall 27 (branch protection)

**Verify:** Clean-clone build passes; smoke test passes; live site shows all 8 sections; PDF link works; no `gh-pages` branch; no `public/CNAME`.

### Phase Ordering Rationale

- Foundation before content: `site:` in `astro.config.mjs` gates sitemap, canonical, OG, and the entire build pipeline
- Content before sections: schemas define prop types; changing schemas after sections forces rewrites
- Sections before navigation: `IntersectionObserver` requires `<section id="...">` elements to already exist in the DOM
- Sections before polish: a11y and contrast audits require real rendered HTML
- SEO/meta in its own phase (not Foundation): `<BaseHead>` content (OG description, image) requires knowing the final section structure
- Cleanup last: deleting CRA artifacts mid-build risks leaving the site in an unverifiable intermediate state

### Research Flags

**No phase needs a full research pass.** All patterns are standard and documented:
- Phase 1 (Foundation): `withastro/action`, `@tailwindcss/vite` — official docs
- Phase 2 (Content Layer): loader API — official Astro docs; YAML `file()` shape is a doc-check, not research
- Phase 3 (Sections): `.astro` component authoring — official docs; icon name lookup is minor
- Phase 4 (Navigation): IntersectionObserver — standard browser API
- Phase 5 (SEO/Polish): OG, sitemap, axe-core — all official docs
- Phase 6 (Deploy): `withastro/action` workflow — directly from Astro's official deploy guide

Flag as acceptance-criteria pre-checks (not research): Tailwind v4 source detection in production builds (verify `dist/_astro/` CSS after Phase 1), actual repo branch protection rules (audit before Phase 6), OG image authoring (content task, flag before Phase 5 starts).

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified against npm registry on 2026-05-26. Tailwind v4 + Astro integration verified via two independent sources. |
| Features | HIGH | SEO table-stakes are consistent across all 2026 developer portfolio sources. Feature additions are Astro drop-ins with official docs. |
| Architecture | HIGH | Content Layer loader API, image pipeline, GH Pages user-site config — all from official Astro docs. Decap CMS M2 shape verified against Decap docs. |
| Pitfalls | HIGH (most) / MEDIUM (Tailwind v4 specifics) | Astro 5/6, GH Pages, React 19 pitfalls from official docs and issue tracker. Tailwind v4 + Astro interaction details from community guides — newer pairing. |

**Overall confidence:** HIGH. The single credible unknown is whether `@tailwindcss/vite` automatic source detection covers `.astro` files in all configurations — mitigated by the explicit `@source` fallback (Pitfall 29) and the official Vite plugin route.

### Gaps to Address

- **Astro 5 vs Astro 6 (Open Decision):** Confirm with user/orchestrator before requirements are finalized. Nothing else in the plan changes.
- **Tailwind v4 source detection in production:** Verify one generated CSS file in `dist/_astro/` for a class known to be in `.astro` source — do this at the end of Phase 1. Fix with `@source` if missing.
- **Repo branch protection rules:** Audit Settings → Branches before Phase 6 starts.
- **OG image asset:** A static `og.png` (1200×630) is needed before Phase 5. Flag as a content authoring task.
- **PDF cache-busting strategy:** Decide in Phase 6 whether to use a query param or Vite hashing via `src/assets/` import.

---

## Sources

### Primary (HIGH confidence)

- Astro docs (content collections, images, GitHub Pages deploy, project structure, client directives, TypeScript) — https://docs.astro.build/
- Tailwind CSS v4 framework guide for Astro + theme variable docs — https://tailwindcss.com/docs/
- npm registry live queries — all pinned versions in STACK.md
- Decap CMS docs (folder + file collections) — https://decapcms.org/docs/
- `withastro/action` GitHub repository + GitHub Pages official docs
- `.planning/codebase/CONCERNS.md`, `ARCHITECTURE.md`, `STRUCTURE.md` — existing-site audit (this repo)
- `.planning/PROJECT.md` — locked decisions and constraints (this repo)

### Secondary (MEDIUM confidence)

- Tailwind v4 migration guides and `@theme` namespace behavior (community-authored, consistent with Tailwind core docs)
- Astro issue tracker threads on View Transitions script re-execution (#7773, #9798) and custom 404 issues (#2661, #8054)
- GitHub Pages trailing-slash redirect behavior (community-documented)
- Astro portfolio / SEO references: Joost.blog Astro SEO guide, Dante/Astrogaia theme analysis

### Tertiary (LOW confidence — validate during implementation)

- GitHub Pages Cloudflare caching TTL specifics (behavior documented but varies)
- Tailwind v4 + Astro 5 combination-specific edge cases (newer pairing; verify against actual built output)

---

*Research completed: 2026-05-26*
*Ready for roadmap: yes*
