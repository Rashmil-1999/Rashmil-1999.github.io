# Requirements: Rashmil Panchani Portfolio

**Defined:** 2026-05-26
**Core Value:** The site looks and reads the same to a visitor, but underneath the stack is modern, the code is conventional, and resume content lives in typed Content Collections that a future editing surface can write to without touching code.

## v1 Requirements (M1 — Refresh & Modernize)

### Foundation (FOUND)

Scaffolding, tooling, and the build baseline the rest of M1 sits on.

- [x] **FOUND-01**: Project builds with Astro 6 (current stable) configured for static output to `dist/`
- [x] **FOUND-02**: TypeScript 5 is enabled with `strict: true` and `astro check` passes with zero errors
- [x] **FOUND-03**: Tailwind v4 is installed via `@tailwindcss/vite` (not the deprecated `@astrojs/tailwind` integration) and processes a single `src/styles/global.css` with `@theme` directive
- [x] **FOUND-04**: `@astrojs/react` is installed and a React 19 island can hydrate from `client:*` directives (verified by a throwaway test component)
- [x] **FOUND-05**: ESLint 9 (flat config) and Prettier are configured for `.astro`, `.ts`, `.tsx`, `.md`; `npm run lint` passes
- [x] **FOUND-06**: Vitest 3 is configured with one smoke test that runs `astro build` and asserts the produced `dist/index.html` contains a marker from each of the 8 sections
- [x] **FOUND-07**: A single canonical package manager (npm) is used; `yarn.lock` is removed and `package-lock.json` is the only lockfile committed
- [x] **FOUND-08**: `astro.config.mjs` sets `site: 'https://Rashmil-1999.github.io'`, `output: 'static'`, and does NOT set `base` (user-site repo serves at root)

### Content Layer (CONTENT)

Resume data moves from a single JSON to typed Content Layer collections — the M2 CMS contract.

- [x] **CONTENT-01**: `src/content.config.ts` (Astro 6 location, NOT `src/content/config.ts`) defines all 8 collections with Zod schemas
- [x] **CONTENT-02**: List-collections — `projects`, `work`, `education`, `leadership`, `testimonials` — use `glob()` loader over per-item markdown files in `src/content/<name>/`
- [x] **CONTENT-03**: Singleton-collections — `about`, `skills`, `links` — use `file()` loader over a single YAML file each (e.g., `src/content/about.yaml`)
- [x] **CONTENT-04**: Every list-collection item has an `order: z.number().default(0)` field so a future CMS can drag-to-reorder without filename hacks
- [x] **CONTENT-05**: Project images use Astro's `image()` schema helper and live co-located with their markdown (e.g., `src/content/projects/<slug>.png` referenced as `./<slug>.png` in frontmatter)
- [x] **CONTENT-06**: All content currently in `src/resumeData.json` round-trips into the new collections with zero data loss (verified by manual diff of rendered output against current site)
- [x] **CONTENT-07**: Schemas use CMS-neutral field names (no `_id`, `_ref`, `sys.*`); enums are plain strings (no raw CSS class names)
- [x] **CONTENT-08**: `npx astro check` validates all content against schemas at build; a deliberately-malformed test fixture fails the build with a useful error

### Section Components (SECTION)

Port every existing section as `.astro`. React only if state genuinely exists (it doesn't, day one).

- [ ] **SECTION-01**: `src/pages/index.astro` is the only page route and composes all 8 sections in their current order
- [ ] **SECTION-02**: `About.astro` renders name, role, contact info, social links, and links to `/Rashmil_Panchani.pdf` for resume download
- [ ] **SECTION-03**: `Education.astro` renders the education collection in current order with school, degree, dates
- [ ] **SECTION-04**: `Work.astro` renders the work collection with company, role, dates, and bullet descriptions
- [ ] **SECTION-05**: `Skills.astro` renders the skills collection grouped by category, with bundled icons (no Devicon/Iconify CDN)
- [ ] **SECTION-06**: `Projects.astro` renders the projects collection as cards with optimized images via `<Image />`, tech-stack chips, and external links with `rel="noopener noreferrer"`
- [ ] **SECTION-07**: `Leadership.astro` renders the leadership collection with role, org, dates, and description
- [ ] **SECTION-08**: `Testimonials.astro` renders the testimonials collection as quoted blocks with attribution
- [ ] **SECTION-09**: No section ships React runtime; every component is `.astro` unless a SECTION-* requirement is later split out for an interactive island
- [ ] **SECTION-10**: The hand-maintained `image_map` lookup from `Projects.jsx` is gone — image references flow from frontmatter through the schema, not through a side-table

### Navigation (NAV)

Side nav and scroll-spy without jQuery and without `react-scroll`.

- [ ] **NAV-01**: `SideNav.astro` renders the same anchor links as today, sourced from the `links` / `about` collections
- [ ] **NAV-02**: Smooth scrolling uses CSS `scroll-behavior: smooth` with a `prefers-reduced-motion: reduce` guard that disables it
- [ ] **NAV-03**: Active-section highlighting uses inline `<script>` + `IntersectionObserver` (no jQuery, no React island), setting `aria-current="page"` on the active link
- [ ] **NAV-04**: Mobile nav toggle is keyboard-operable and has correct `aria-expanded` / `aria-controls`
- [ ] **NAV-05**: No CDN scripts for nav behavior — the jQuery IIFE in `public/index.html` (existing site) is deleted, not ported

### Style (STYLE)

Light visual polish — preserve current layout, fix presentation rough edges.

- [ ] **STYLE-01**: Bootstrap 4 (CDN and class names) is fully removed; no `bootstrap` package is installed
- [ ] **STYLE-02**: All icons are bundled via `astro-icon` + `@iconify-json/simple-icons` (brand/social) + `@iconify-json/devicon` (tech stack); no CDN icon scripts in `<head>`
- [ ] **STYLE-03**: Project images are served through Astro's `<Image />` with appropriate `width` / `height` / `format` to prevent the 4.8 MB / 1 MB asset weights flagged in the codebase concerns map
- [ ] **STYLE-04**: Section spacing, heading typography, and link/button hover states are tidied for visual consistency without redesigning the layout
- [ ] **STYLE-05**: Fonts (currently Saira Extra Condensed + Muli from Google Fonts) are loaded via `<link rel="preconnect">` + `<link rel="stylesheet">` in the shared head, or self-hosted via `@fontsource/*`; no FOIT on a fresh load

### Accessibility (A11Y)

WCAG 2.1 AA — hard gate per `.claude/CLAUDE.md`.

- [ ] **A11Y-01**: Every interactive element has an accessible name (`aria-label` on icon-only buttons, real `<label>` on any future form)
- [ ] **A11Y-02**: Heading hierarchy is correct (single `<h1>`, then `<h2>` per section, no skipped levels)
- [ ] **A11Y-03**: Text/background color combinations all meet WCAG AA contrast (4.5:1 for normal text, 3:1 for large) — verified with an axe-core or pa11y scan against the built `dist/index.html`
- [ ] **A11Y-04**: Active nav link state is conveyed by more than color alone (border, weight, or `aria-current` styling)
- [ ] **A11Y-05**: Keyboard navigation reaches every interactive element in logical order; visible focus rings are not removed
- [ ] **A11Y-06**: External links (project repos, social) use `rel="noopener noreferrer"` and convey "opens in new tab" to assistive tech
- [ ] **A11Y-07**: `prefers-reduced-motion: reduce` disables smooth scroll and any future motion (currently no animations exist)

### SEO / Meta Hygiene (SEO)

Currently absent. P1 only — P2 (manifest, JSON-LD, 404) is deferred to v2.

- [ ] **SEO-01**: A shared `BaseHead.astro` component is used by `index.astro` and any future page
- [ ] **SEO-02**: `<meta name="description">` contains a real per-page description sourced from the `about` collection (not the CRA default "Personal Website")
- [ ] **SEO-03**: OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) are rendered in `<head>`
- [ ] **SEO-04**: Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) are rendered in `<head>`
- [ ] **SEO-05**: `<link rel="canonical">` is rendered, derived from `Astro.site` + current path
- [ ] **SEO-06**: `@astrojs/sitemap` is installed and emits `/sitemap-index.xml` referenced from `robots.txt`
- [ ] **SEO-07**: One OG image asset (1200×630) is authored and committed; defaults work for share-link previews

### Cleanup (CLEAN)

Delete what's no longer needed; reconcile working-tree drift documented in PROJECT.md Context.

- [ ] **CLEAN-01**: Create React App is fully removed — `react-scripts`, `src/serviceWorker.js`, `src/setupTests.js`, `public/manifest.json` (CRA default), and all CRA build artifacts
- [ ] **CLEAN-02**: Dead dependencies are removed — `react-scroll`, `react-script-tag`, `gh-pages`
- [ ] **CLEAN-03**: `src/resumeData.json` is deleted after CONTENT-06 verifies round-trip
- [ ] **CLEAN-04**: `public/CNAME` is deleted (custom domain no longer valid)
- [ ] **CLEAN-05**: The inline jQuery scroll-spy IIFE in `public/index.html` is gone — no jQuery anywhere
- [ ] **CLEAN-06**: `yarn.lock` is deleted (npm is canonical per FOUND-07)
- [ ] **CLEAN-07**: The deleted `src/App.js` / `src/App.test.js` files (per `git status` at project start) are not resurrected — Astro replaces them
- [ ] **CLEAN-08**: README is updated to reflect the new stack and dev commands (`npm run dev`, `npm run build`, `npm run preview`)

### Deploy (DEPLOY)

GitHub Actions → Pages, no laptop deploys.

- [ ] **DEPLOY-01**: A `.github/workflows/deploy.yml` workflow uses `withastro/action@v6` + `actions/deploy-pages@v4` with correct `permissions: { contents: read, pages: write, id-token: write }`
- [ ] **DEPLOY-02**: The workflow triggers on push to the default branch and on manual `workflow_dispatch`
- [ ] **DEPLOY-03**: Repo Pages source is set to "GitHub Actions" (not "Deploy from a branch") — verified after first successful run
- [ ] **DEPLOY-04**: A successful workflow run publishes the site at `https://Rashmil-1999.github.io/` and the live page loads with all 8 sections, the resume PDF downloadable, and no 404s on assets
- [ ] **DEPLOY-05**: The old `gh-pages` git branch is deleted after DEPLOY-04 succeeds
- [ ] **DEPLOY-06**: `npm run` includes `predeploy`/`deploy` scripts only if they're meaningful in the new world (likely just removed — Actions does the publishing)

## v2 Requirements (M2 — Editable Content, deferred)

### Content Editing (EDIT)

- **EDIT-01**: Content editors can update About / Skills / Links without writing code
- **EDIT-02**: Content editors can add / edit / reorder / remove items in Projects / Work / Education / Leadership / Testimonials without writing code
- **EDIT-03**: Edits trigger a rebuild and publish via the existing GitHub Actions workflow (or equivalent)
- **EDIT-04**: Schema validation from CONTENT-01 still gates publish — broken edits fail the build, not the live site
- **EDIT-05**: Image uploads land in the correct `src/content/projects/<slug>/` location or are referenced from a managed asset store

(Architecture choice — Decap CMS / Sanity / custom admin UI / git-based editor — deferred to M2 planning.)

### Polish — P2 SEO / Meta (META)

- **META-01**: `public/manifest.webmanifest` is real (not the CRA default) and references real icons in correct sizes
- **META-02**: JSON-LD `Person` schema is injected in `<head>` for entity recognition
- **META-03**: Custom `404.astro` page matches the site design

### Polish — Visual (VISUAL)

- **VISUAL-01**: Dark mode toggle with `prefers-color-scheme` default
- **VISUAL-02**: Section enter animations with `prefers-reduced-motion` guard

## Out of Scope

Explicitly excluded from M1. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Full visual redesign | M1 scope is "light polish," not new look-and-feel |
| New sections (blog, case studies, demos) | Not part of refresh |
| Astro View Transitions | Single-page anchor-nav site — zero benefit, introduces script-re-execution bugs |
| Custom domain (`rashmilpanchani.me` or new) | Old domain expired; M1 ships to default GitHub URL; can be reintroduced later |
| Server-side rendering / API routes | Astro is configured for static output only |
| Internationalization | Not requested |
| Analytics / tracking | Not requested |
| Contact form with backend | No backend in scope |
| PWA / service worker reintroduction | Existing one is unregistered; not needed |
| Cookie banner | No cookies used |
| Splash screens, hero animations, custom cursors, scroll-jacking, AI chatbot | Anti-features for a portfolio per features research |
| Cloudflare Pages / Netlify / Vercel hosting | Staying on GitHub Pages |
| Migration of project images to a CDN / asset service | `<Image />` build optimization is sufficient for M1 |
| Adding a database / `astro:db` | No dynamic data in M1 |

## Traceability

Every v1 requirement maps to exactly one phase. See `.planning/ROADMAP.md` for phase details.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1: Foundation | Complete |
| FOUND-02 | Phase 1: Foundation | Complete |
| FOUND-03 | Phase 1: Foundation | Complete |
| FOUND-04 | Phase 1: Foundation | Complete |
| FOUND-05 | Phase 1: Foundation | Complete |
| FOUND-06 | Phase 1: Foundation | Complete |
| FOUND-07 | Phase 1: Foundation | Complete |
| FOUND-08 | Phase 1: Foundation | Complete |
| CONTENT-01 | Phase 2: Content Layer | Complete |
| CONTENT-02 | Phase 2: Content Layer | Complete |
| CONTENT-03 | Phase 2: Content Layer | Complete |
| CONTENT-04 | Phase 2: Content Layer | Complete |
| CONTENT-05 | Phase 2: Content Layer | Complete |
| CONTENT-06 | Phase 2: Content Layer | Complete |
| CONTENT-07 | Phase 2: Content Layer | Complete |
| CONTENT-08 | Phase 2: Content Layer | Complete |
| SECTION-01 | Phase 3: Sections & Navigation | Pending |
| SECTION-02 | Phase 3: Sections & Navigation | Pending |
| SECTION-03 | Phase 3: Sections & Navigation | Pending |
| SECTION-04 | Phase 3: Sections & Navigation | Pending |
| SECTION-05 | Phase 3: Sections & Navigation | Pending |
| SECTION-06 | Phase 3: Sections & Navigation | Pending |
| SECTION-07 | Phase 3: Sections & Navigation | Pending |
| SECTION-08 | Phase 3: Sections & Navigation | Pending |
| SECTION-09 | Phase 3: Sections & Navigation | Pending |
| SECTION-10 | Phase 3: Sections & Navigation | Pending |
| NAV-01 | Phase 3: Sections & Navigation | Pending |
| NAV-02 | Phase 3: Sections & Navigation | Pending |
| NAV-03 | Phase 3: Sections & Navigation | Pending |
| NAV-04 | Phase 3: Sections & Navigation | Pending |
| NAV-05 | Phase 3: Sections & Navigation | Pending |
| STYLE-01 | Phase 3: Sections & Navigation | Pending |
| STYLE-02 | Phase 3: Sections & Navigation | Pending |
| STYLE-03 | Phase 3: Sections & Navigation | Pending |
| STYLE-04 | Phase 3: Sections & Navigation | Pending |
| STYLE-05 | Phase 3: Sections & Navigation | Pending |
| A11Y-01 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| A11Y-02 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| A11Y-03 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| A11Y-04 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| A11Y-05 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| A11Y-06 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| A11Y-07 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| SEO-01 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| SEO-02 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| SEO-03 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| SEO-04 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| SEO-05 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| SEO-06 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| SEO-07 | Phase 4: SEO, A11Y & Meta Polish | Pending |
| CLEAN-01 | Phase 5: Cleanup & Deploy | Pending |
| CLEAN-02 | Phase 5: Cleanup & Deploy | Pending |
| CLEAN-03 | Phase 5: Cleanup & Deploy | Pending |
| CLEAN-04 | Phase 5: Cleanup & Deploy | Pending |
| CLEAN-05 | Phase 5: Cleanup & Deploy | Pending |
| CLEAN-06 | Phase 5: Cleanup & Deploy | Pending |
| CLEAN-07 | Phase 5: Cleanup & Deploy | Pending |
| CLEAN-08 | Phase 5: Cleanup & Deploy | Pending |
| DEPLOY-01 | Phase 5: Cleanup & Deploy | Pending |
| DEPLOY-02 | Phase 5: Cleanup & Deploy | Pending |
| DEPLOY-03 | Phase 5: Cleanup & Deploy | Pending |
| DEPLOY-04 | Phase 5: Cleanup & Deploy | Pending |
| DEPLOY-05 | Phase 5: Cleanup & Deploy | Pending |
| DEPLOY-06 | Phase 5: Cleanup & Deploy | Pending |

**Coverage:**
- v1 requirements: 64 total (8 FOUND + 8 CONTENT + 10 SECTION + 5 NAV + 5 STYLE + 7 A11Y + 7 SEO + 8 CLEAN + 6 DEPLOY)
- Mapped to phases: 64 / 64 (100%)
- Unmapped: 0
- Phase distribution: Phase 1 = 8, Phase 2 = 8, Phase 3 = 20, Phase 4 = 14, Phase 5 = 14

---
*Requirements defined: 2026-05-26*
*Last updated: 2026-05-26 after roadmap creation — traceability populated*
