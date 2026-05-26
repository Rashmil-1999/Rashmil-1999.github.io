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

### Active

<!-- M1: Refresh & Modernize. Hypotheses until shipped. -->

- [ ] Replace Create React App with **Astro 5 + TypeScript** (hybrid: `.astro` for static, React 19 islands only where genuinely interactive)
- [ ] Replace Bootstrap 4 CDN with **Tailwind v4**, bundled (no third-party UI CDNs)
- [ ] Migrate `src/resumeData.json` to **Astro 5 Content Layer** collections with typed schemas: markdown frontmatter for `projects` / `work` / `education` / `leadership` / `testimonials`; YAML for `about` / `skills` / `links`
- [ ] Port every existing section preserving its layout and information, applying light visual polish (spacing, typography, icon set consistency, color contrast)
- [ ] Native scroll-spy and smooth scrolling (no jQuery, no `react-scroll`)
- [ ] Eliminate documented anti-patterns from `.planning/codebase/`: dead `react-scroll` / `react-script-tag` deps, jQuery scroll-spy IIFE in `public/index.html`, hand-maintained `image_map` in `Projects.jsx`, missing Bootstrap CSS, `<StrictMode>` placement
- [ ] WCAG 2.1 AA accessibility: semantic landmarks, ARIA on nav toggles and icon-only buttons, keyboard navigation, color-contrast pass, focus management
- [ ] Tooling baseline: ESLint, Prettier, `tsconfig` strict, single Vitest smoke test asserting `astro build` succeeds and each section renders
- [ ] **GitHub Actions** deploy workflow using `withastro/action` (replaces local `npm run deploy` / `gh-pages` package)
- [ ] Site serves at `https://Rashmil-1999.github.io/` (user-site repo, root path)

### Out of Scope

<!-- M1 explicit boundaries. M2 items live in REQUIREMENTS.md "v2 Requirements", not here. -->

- Full visual redesign — scope is "light visual polish," not a new look
- New sections beyond the current 8 (blog, case studies, demos) — not part of refresh
- Server-rendered routes, API endpoints, or any backend — Astro is configured for static output only
- Dark mode, internationalization, analytics — not requested
- Custom domain — site moves to default GitHub URL; the old `rashmilpanchani.me` domain is no longer valid and `public/CNAME` is deleted
- A PWA / service worker — current one is unregistered; not reintroduced
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
- **Tech stack**: Astro 5, React 19 (islands only), Tailwind v4, TypeScript 5 (strict), Node 22 LTS — current stable as of 2026-05; "use the latest features where they help, not for the sake of it"
- **Repo type**: User-site repo → site serves at root path `/`, not a subpath
- **Content**: All resume content must round-trip from the current `src/resumeData.json` shape into the new Content Layer collections — no data loss
- **PDF**: `public/Rashmil_Panchani.pdf` download link must keep working
- **Accessibility**: WCAG 2.1 AA is a hard requirement (per `.claude/CLAUDE.md`), not a stretch goal
- **No CDN UI libs**: Bootstrap, jQuery, Font Awesome, Devicon, Iconify are CDN-loaded today and must be replaced with bundled equivalents (or dropped)
- **Compatibility with M2**: Content shape and storage must be amenable to an editing surface (admin UI / headless CMS / git-based editor) in M2 — informs the Content Layer choice

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro 5 over Vite / Next.js / staying on CRA | Static-first portfolio, best Lighthouse story, Content Layer fits M2's "editable content" goal natively; CRA is deprecated | — Pending |
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

---
*Last updated: 2026-05-26 after initialization*
