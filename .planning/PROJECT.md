# Rashmil Panchani Portfolio (rashmil-1999.github.io)

## What This Is

A single-page personal portfolio site for Rashmil Panchani — about, education, work, skills, projects, leadership, and testimonials, with a downloadable résumé PDF. Today it is a Create React App SPA published to GitHub Pages. This project rebuilds it on a modern static stack so the same content renders cleanly and the data is structured for in-place editing in a future milestone.

## Core Value

The site looks and reads the same to a visitor, but underneath the stack is modern, the code is conventional, and resume content lives in typed Content Collections that a future editing surface can write to without touching code.

## Requirements

### Validated

<!-- Inferred from existing code at the start of this project — verified to be working today. -->

- ✓ Renders 8 resume sections (SideNav, About, Education, Work, Skills, Projects, Leadership, Testimonials) — existing
- ✓ Anchor-based navigation with smooth scroll between sections — existing
- ✓ Static deploy to GitHub Pages from this repo — existing
- ✓ Downloadable résumé PDF (`public/Rashmil_Panchani.pdf`) linked from About — existing
- ✓ Content driven from a single source of truth (`src/resumeData.json` today) — existing
- ✓ Mobile-responsive layout (Bootstrap 4 grid) — existing
- ✓ Tooling baseline: ESLint 9 flat config, Prettier (with `prettier-plugin-astro`), `tsconfig` extends `astro/tsconfigs/strictest`, Vitest 4 smoke suite spawning `astro build` as a subprocess (Validated in Phase 1: Foundation, 2026-05-26 — commit `4d8d24c`)

### Active

<!-- M1: Refresh & Modernize. Hypotheses until shipped. -->

- [x] Replace Create React App with **Astro 6 + TypeScript** (hybrid: `.astro` for static, React 19 islands only where genuinely interactive) — Phase 1 complete (Astro 6.3.8 scaffold, React 19.2.6 via `@astrojs/react`, tsconfig strictest)
- [x] Replace Bootstrap 4 CDN with **Tailwind v4**, bundled (no third-party UI CDNs) — Phase 1 wired `@tailwindcss/vite` + CSS-first entry (Phase 3 applies utilities to real markup)
- [ ] Migrate `src/resumeData.json` to **Astro Content Layer** collections (defined in `src/content.config.ts`) with typed schemas: `glob()` loader + markdown frontmatter for `projects` / `work` / `education` / `leadership` / `testimonials`; `file()` loader + YAML for `about` / `skills` / `links` (this split is the M2 CMS contract — folder collections vs file collections)
- [ ] Port every existing section preserving its layout and information, applying light visual polish (spacing, typography, icon set consistency, color contrast)
- [ ] Native scroll-spy and smooth scrolling (no jQuery, no `react-scroll`)
- [ ] Eliminate documented anti-patterns from `.planning/codebase/`: dead `react-scroll` / `react-script-tag` deps, jQuery scroll-spy IIFE in `public/index.html`, hand-maintained `image_map` in `Projects.jsx`, missing Bootstrap CSS, `<StrictMode>` placement
- [ ] WCAG 2.1 AA accessibility: semantic landmarks, ARIA on nav toggles and icon-only buttons, keyboard navigation, color-contrast pass, focus management
- [ ] SEO / social meta hygiene (currently absent): shared `<BaseHead>` with OpenGraph + Twitter Card tags, canonical URL, real `<meta name="description">`, and `@astrojs/sitemap` integration — prerequisite is setting `site` in `astro.config.mjs`
- [x] Tooling baseline: ESLint, Prettier, `tsconfig` strict, single Vitest smoke test asserting `astro build` succeeds and each section renders — Phase 1 complete
- [x] **GitHub Actions** workflow on push/PR to `main` running 4-step gate (lint, format:check, astro check, test) — Phase 1 complete (deploy step deferred to Phase 5)
- [x] Site serves at `https://Rashmil-1999.github.io/` (user-site repo, root path) — Phase 1 set `site: 'https://Rashmil-1999.github.io'` in `astro.config.mjs`

### Out of Scope

<!-- M1 explicit boundaries. M2 items live in REQUIREMENTS.md "v2 Requirements", not here. -->

- Full visual redesign — scope is "light visual polish," not a new look
- New sections beyond the current 8 (blog, case studies, demos) — not part of refresh
- Server-rendered routes, API endpoints, or any backend — Astro is configured for static output only
- Dark mode, internationalization, analytics — not requested
- Custom domain — site moves to default GitHub URL; the old `rashmilpanchani.me` domain is no longer valid and `public/CNAME` is deleted
- A PWA / service worker — current one is unregistered; not reintroduced
- Astro View Transitions — zero benefit on a single-page anchor-nav site; introduces script-re-execution bug class
- Dark mode toggle, view-transitions polish, JSON-LD, real webmanifest, custom 404 page — P2 SEO/meta items deferred from M1
- Cloudflare Pages / Netlify / Vercel hosting — staying on GitHub Pages
- Migrations to React Native / mobile app

## Context

- Repo is a `<username>.github.io` user-site repo (`Rashmil-1999.github.io`), so Pages serves at the domain root — no `base` path required in Astro config.
- Working tree is mid-something at project start: `src/App.js` and `src/App.test.js` are deleted, `package.json` / `package-lock.json` / `yarn.lock` / `src/index.js` are modified, and `.claude/` is untracked. These changes will be reconciled by the M1 phases (most of these files are being replaced anyway).
- Existing codebase analysis lives in `.planning/codebase/` (ARCHITECTURE.md, STACK.md, CONCERNS.md, CONVENTIONS.md, INTEGRATIONS.md, STRUCTURE.md, TESTING.md) — refreshed 2026-05-26. Concerns and anti-patterns documented there are the cleanup backlog for M1.
- Both `package-lock.json` and `yarn.lock` are committed — npm is the canonical package manager going forward (M1 normalizes this).
- Existing custom domain `rashmilpanchani.me` (configured in `public/CNAME`) is no longer registered; the site needs to fall back to the default GitHub URL.
- Visitor traffic and SEO impact of the URL change are not a concern for M1.

## Constraints

- **Hosting**: GitHub Pages (free tier) — no backend, no server runtime, must publish as static files
- **Tech stack**: Astro 6, React 19 (islands only), Tailwind v4 (via `@tailwindcss/vite`, NOT the deprecated `@astrojs/tailwind` integration which is v3-only), TypeScript 5 (strict), Node 22 LTS — current stable as of 2026-05; "use the latest features where they help, not for the sake of it"
- **Repo type**: User-site repo → site serves at root path `/`, not a subpath
- **Content**: All resume content must round-trip from the current `src/resumeData.json` shape into the new Content Layer collections — no data loss
- **PDF**: `public/Rashmil_Panchani.pdf` download link must keep working
- **Accessibility**: WCAG 2.1 AA is a hard requirement (per `.claude/CLAUDE.md`), not a stretch goal
- **No CDN UI libs**: Bootstrap, jQuery, Font Awesome, Devicon, Iconify are CDN-loaded today and must be replaced with bundled equivalents (or dropped)
- **Compatibility with M2**: Content shape and storage must be amenable to an editing surface (admin UI / headless CMS / git-based editor) in M2 — informs the Content Layer choice

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro 6 over Vite / Next.js / staying on CRA | Static-first portfolio, best Lighthouse story, Content Layer fits M2's "editable content" goal natively; CRA is deprecated. Bumped from Astro 5 to 6 after research confirmed 6.3.8 is current stable and all integrations support it. | — Pending |
| TypeScript with strict mode | Typed Content Layer schemas catch resume-data errors at build; modernization is the point of M1 | — Pending |
| Tailwind v4 over Bootstrap 5 / plain CSS | Utility-first makes "light visual polish" iterative; CSS-first config in v4 means no `tailwind.config.js` for a small site | — Pending |
| Hybrid component model (`.astro` + selective React 19 islands) | Today's components have zero interactivity; shipping React for static markup is wasted JS. Keeps React available the moment we need it. | — Pending |
| Astro Content Layer (markdown + YAML) over keeping single JSON | Per-item files map directly to "edit one project / one job" in M2; typed schemas; native Astro pattern | — Pending |
| GitHub Pages via `withastro/action` over Cloudflare/Netlify/Vercel | No new accounts, stays in repo, simplest continuation; can re-host later without code changes | — Pending |
| Drop custom domain `rashmilpanchani.me`, use `Rashmil-1999.github.io` root URL | Domain is no longer registered; default GitHub URL works immediately, custom domain can be reintroduced later | — Pending |
| Vitest scaffold + 1 smoke test (not full a11y suite) | Portfolio is mostly static — `astro build` + manual smoke is enough; scaffold is in place if M2 adds real behavior | — Pending |
| Latest stable versions across all deps; use modern APIs (Content Layer, React 19, Tailwind v4) | User asked for "latest of everything that plays well together"; modernization is M1's whole reason | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

| Add P1 SEO/meta hygiene (OpenGraph, Twitter Card, canonical, real meta description, sitemap) to M1 | Current site has none of this; trivially cheap on Astro and table-stakes for any modern portfolio. Surfaced by features research. | — Pending |
| Skip Astro View Transitions in M1 | Single-page anchor-nav site — View Transitions add no benefit and introduce script-re-execution bugs. Surfaced by pitfalls research. | — Pending |

---
*Last updated: 2026-05-27 after Phase 2 (Content Layer) completion — all 8 CONTENT-* requirements validated. 8 Content Layer collections defined in `src/content.config.ts` (Zod 4 schemas); 20 list-collection markdown entries authored (13 projects + 2 work + 3 education + 1 leadership + 1 testimonial); 3 singleton YAMLs (about/skills/links) + `profile.jpg` relocated to `src/assets/`; 16 project images colocated via `image()` helper; 4 orphans isolated in `src/content/_orphans/`; Garduino rename applied per D-09. Vitest content-validation suite (3 sub-tests) passing; CONTENT-06 parity diff (`02-PARITY.md`) human-approved with zero unexpected data loss. Code review found 1 critical (CR-01: dj-archive `archive.jpg` is actually a PNG — Phase 3 STYLE-03 risk) and 6 warnings, advisory. Phase 1 carry-forwards still pending: Phase 5 CNAME/site URL (D-06); 5 moderate npm-audit vulnerabilities; `ts(6387)` deprecation hint on `tseslint.config` (waiting on upstream).*
