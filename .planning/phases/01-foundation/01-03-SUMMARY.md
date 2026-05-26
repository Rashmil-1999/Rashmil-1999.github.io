---
phase: 01-foundation
plan: 03
subsystem: ui
tags: [astro, react, tailwind, layout, hydration, components, stubs]

# Dependency graph
requires:
  - phase: 01-foundation/02
    provides: astro.config.mjs wired with @astrojs/react + Tailwind v4 (via @tailwindcss/vite); tsconfig strictest; React 19 deps installed; src/styles/global.css scaffolded with `@import "tailwindcss";` (not yet imported); `compilerOptions.jsx` dropped from tsconfig (Plan 02 deviation #3)
provides:
  - src/layouts/BaseLayout.astro (HTML shell + slot + side-effect-imports ../styles/global.css)
  - src/components/BaseHead.astro (minimal head — charset, viewport, title, favicon, 2 preconnects; no OG/Twitter/canonical/description)
  - 8 section stubs at src/components/{SideNav,About,Education,Work,Skills,Projects,Leadership,Testimonials}.astro — each renders an empty <section id="…"> with the D-23 lowercase id
  - About.astro carries the Tailwind marker utility `text-[#abc123]` (Pitfall 29 canary)
  - src/pages/index.astro composes the 8 stubs inside BaseLayout in roadmap order
  - tests/__fixtures__/HydrationCheck.tsx (React 19 functional component using useState)
  - src/pages/hydration-test.astro mounts HydrationCheck with `client:load` (built URL `/hydration-test/`; renamed from plan's `/__hydration-test/` — see Deviation #1)
  - src/content.config.ts (empty placeholder for Phase 2 Zod schemas)
  - src/assets/.gitkeep (materializes the empty src/assets/ directory)
  - src/styles/global.css extended with empty `@theme { /* TODO Phase 3 STYLE-04 */ }` block
affects: [01-04-tooling, 01-05-cleanup-ci, 02-content, 03-sections, 03-nav, 03-style, 04-seo, 04-a11y, 05-cleanup-deploy]

# Tech tracking
tech-stack:
  added: []  # No new npm deps in this plan — purely authoring against Plan 02's installed stack
  patterns:
    - "Astro layout-component-page tree: pages compose components inside a layout that owns the HTML shell + style entry import (RESEARCH.md Pattern 2 + 3)"
    - "Tailwind v4 marker canary: one component carries an arbitrary-value utility (`text-[#abc123]`) so a single grep across `dist/_astro/*.css` proves Vite-plugin source detection works against `.astro` files (Pitfall 29)"
    - "Cross-tree TS import allowed by tsconfig include `**/*`: `src/pages/hydration-test.astro` imports from `tests/__fixtures__/HydrationCheck.tsx` without copying the fixture into `src/` (Pitfall E mitigation)"
    - "Hydration fixture uses `client:load` deliberately (Pattern 4 + Pitfall 5): production islands default to no directive; the verification fixture uses `client:load` so the React chunk is deterministic in `dist/_astro/`"
    - "Empty `<section>` stub pattern (D-08): each section is `<section id=\"…\"></section>` with a file-header source-attribution comment naming the relevant CONTEXT.md decision IDs; Phase 3 fills them in place without renaming files"

key-files:
  created:
    - .planning/phases/01-foundation/01-03-SUMMARY.md
    - src/layouts/BaseLayout.astro
    - src/components/BaseHead.astro
    - src/components/SideNav.astro
    - src/components/About.astro
    - src/components/Education.astro
    - src/components/Work.astro
    - src/components/Skills.astro
    - src/components/Projects.astro
    - src/components/Leadership.astro
    - src/components/Testimonials.astro
    - src/pages/hydration-test.astro
    - src/content.config.ts
    - src/assets/.gitkeep
    - tests/__fixtures__/HydrationCheck.tsx
  modified:
    - src/pages/index.astro (replaced Astro Welcome scaffold with the BaseLayout + 8-stub composition)
    - src/styles/global.css (added file-header source-attribution comment + empty @theme block; Plan 02 had just `@import "tailwindcss";` on a single line)
  deleted: []

key-decisions:
  - "Renamed hydration fixture page from src/pages/__hydration-test.astro -> src/pages/hydration-test.astro (Rule 1 deviation). Astro 6 excludes any src/pages/ file whose name starts with an underscore from route generation; the plan's listed source path is structurally infeasible. The built URL is now /hydration-test/. CONTEXT.md D-09 / D-23 references to '__hydration-test' need downstream updates in Plan 05's smoke test."
  - "Did NOT re-add `compilerOptions.jsx` to tsconfig.json. Plan 02 forward note flagged this as a contingency. `npx astro check` on 16 files (3 .tsx-ish + 13 .astro) exits 0 errors / 0 warnings / 0 hints under strictest without the JSX block — `@astrojs/react`'s type emit covers it for Astro 6 + React 19. Forward note retained in case a future .tsx file needs it."
  - "Pitfall 29 did NOT fire. `dist/_astro/BaseLayout.COtH9X1n.css` contains the literal `.text-[#abc123]{color:#abc123}` rule after a clean build — no `@source` escalation was needed. Tailwind v4 + @tailwindcss/vite picks up `.astro` files in default scan."
  - "Adopted the LOCKED D-23 lowercase id set (`sidenav`, `work`) over the deleted-JSX ids (`sideNav`, `experience`). Comment headers in SideNav.astro and Work.astro explicitly call out the divergence so Phase 2 doesn't accidentally re-derive nav links from the snapshot's stale `#experience` value."
  - "Did NOT include react-import / React.JSX namespace import in HydrationCheck.tsx. React 19 + the new JSX transform (handled by @astrojs/react's automatic runtime) means `useState` is the only import needed."
  - "Kept the empty src/content.config.ts as a zero-export placeholder per D-11. `astro check` emits a non-fatal info-level diagnostic (`collections: expected record, received undefined`) but still exits 0 errors. Phase 2 fills the file with `defineCollection` calls and the diagnostic disappears."

patterns-established:
  - "Astro layouts own the style-entry side-effect import: BaseLayout.astro is the single place that `import '../styles/global.css'` lives. Future pages compose via BaseLayout — none need to re-import global.css."
  - "Hydration verification via a single throwaway fixture: one React island under client:load, asserted in the smoke test against dist/_astro/*.js, is enough to satisfy FOUND-04 end-to-end without scattering client:* directives through real components."
  - "Stub-then-fill component lifecycle: Phase 1 ships empty <section id> stubs at the eventual final paths (src/components/*.astro); Phase 3 fills the bodies without renaming files or moving them — preserves the import surface in src/pages/index.astro across phases."

requirements-completed: [FOUND-06]
# Note: FOUND-03 and FOUND-04 were already marked complete by Plan 02 (which installed
# the deps + scaffolded global.css + wired @astrojs/react). This plan materializes the
# *structural* half of both — Tailwind actually wired into a page-rendered <head> via
# BaseLayout (FOUND-03); React 19 island actually hydrating in a real page (FOUND-04).
# Plan 05's smoke test is the final FOUND-04 / FOUND-06 gate.

# Metrics
duration: ~6min
completed: 2026-05-26
---

# Phase 1 Plan 03: Layouts, Section Stubs, Hydration Fixture, Tailwind Entry Summary

**Authored the full Astro file set for Phase 1 — minimal BaseLayout + BaseHead, 8 empty section stubs with D-23 lowercase ids (About carrying the `text-[#abc123]` Tailwind canary), React 19 hydration fixture at `/hydration-test/`, Tailwind v4 entry CSS wired into the layout — landed as a single 16-file `feat(01)` commit on main.**

## Performance

- **Duration:** ~6 min (executor session)
- **Started:** 2026-05-26T21:41:50Z
- **Completed:** 2026-05-26T21:48:11Z
- **Tasks:** 4 (all `type=auto`, no checkpoints — plan was `autonomous: true`)
- **Files modified:** 16 (14 created + 2 modified, in a single rollup commit per Task 4)

## Accomplishments

- **BaseLayout + BaseHead authored to Pattern 2 verbatim.** `src/layouts/BaseLayout.astro` declares `Props.title: string`, side-effect imports `../styles/global.css`, renders `<BaseHead title={title}/>` inside `<head>` and `<slot/>` inside `<body>`. `src/components/BaseHead.astro` emits exactly the D-13 minimum: `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<title>{title}</title>`, `<link rel="icon" href="/favicon.svg">`, and two `<link rel="preconnect">` tags for `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin on the second). No OG, no Twitter, no canonical, no description, no font stylesheet — those land in Phase 4 SEO-01 / Phase 3 STYLE-05.
- **8 section stubs created with D-23 lowercase ids.** Files at `src/components/{SideNav,About,Education,Work,Skills,Projects,Leadership,Testimonials}.astro`. Each renders an empty `<section id="…"></section>` with a header comment naming `CONTEXT.md D-08` (and D-12 for About, D-23 divergence note for SideNav and Work). About.astro is the only stub carrying the Tailwind marker class `text-[#abc123]`. Phase 3 fills these bodies in place without renaming the files.
- **Hydration fixture shipped end-to-end.** `tests/__fixtures__/HydrationCheck.tsx` is a 12-line React 19 component (`useState`, a `<button type="button">` with `onClick` and `data-testid="hydration-check"`). `src/pages/hydration-test.astro` mounts it via `client:load` after cross-tree-importing it through tsconfig's `**/*` include glob. Build produces `dist/hydration-test/index.html` and the React chunk lands at `dist/_astro/HydrationCheck.CK_ySQr9.js`.
- **Tailwind v4 source detection verified against `.astro` files (Pitfall 29 mitigated).** A clean `npm run build` produces `dist/_astro/BaseLayout.COtH9X1n.css` containing the literal CSS rule `.text-[#abc123]{color:#abc123}`. No `@source "../**/*.{astro,html,ts,tsx}";` escalation was needed — the default Vite-plugin scan picks up `.astro` files in Astro 6.
- **Plan 02 forward note about `compilerOptions.jsx` was a non-issue.** `npx astro check` exits 0 errors / 0 warnings / 0 hints across 16 files (the .astro tree + HydrationCheck.tsx + content.config.ts) under tsconfig strictest WITHOUT re-adding the `jsx: "react-jsx"` / `jsxImportSource: "react"` block that Plan 02 dropped. `@astrojs/react` handles JSX type emit via its automatic-runtime mode for React 19. No tsconfig edit needed in this plan.
- **`src/content.config.ts` and `src/assets/.gitkeep` materialize the Phase 2 / Phase 3 edit surfaces.** content.config.ts is an empty file with only a CONTEXT.md D-11 reference comment — Phase 2 fills it with `defineCollection` calls without recreating the file. `src/assets/.gitkeep` makes the empty `src/assets/` directory survive in git for Phase 3 to drop project images into.

## Task Commits

All four plan-tasks rolled into a single Conventional Commits commit per Task 4's explicit instruction (Tasks 1–3 deferred their commits to the rollup):

1. **Task 1: Author layout, BaseHead, global.css, content.config.ts, src/assets/.gitkeep** — staged, not committed (per plan Task 1 action: "Do NOT commit yet — Task 4 commits the whole plan rollup")
2. **Task 2: Author 8 section stubs with D-23 ids (About carries the Tailwind marker)** — staged, not committed
3. **Task 3: Author index.astro composition + hydration fixture** — staged, not committed
4. **Task 4: Commit the section + layout + fixture file set** — `2de5caa` (`feat(01): scaffold layouts, 8 section stubs, hydration fixture, Tailwind entry`)

**Pushed to origin/main:** yes (`2de5caa` is on both local `main` and `origin/main`; non-force push, fast-forward from `8fca1fe`).

## Files Created/Modified

### Created (14)

- `src/layouts/BaseLayout.astro` — HTML shell + Pattern 2 layout. Imports BaseHead, side-effect-imports `../styles/global.css`. Props `{ title: string }`. Renders BaseHead inside `<head>` and `<slot/>` inside `<body>`.
- `src/components/BaseHead.astro` — Minimal `<head>` per D-13. Charset, viewport, dynamic `<title>`, favicon link, 2 preconnect links. No SEO/social tags.
- `src/components/SideNav.astro` — Empty `<section id="sidenav">` stub. Header comment flags D-23 divergence from the deleted Navbar.jsx's `id="sideNav"`.
- `src/components/About.astro` — Empty `<section id="about" class="text-[#abc123]">` stub. The ONLY stub carrying the Tailwind marker (D-12).
- `src/components/Education.astro` — Empty `<section id="education">` stub.
- `src/components/Work.astro` — Empty `<section id="work">` stub. Header comment flags D-23 divergence from the deleted Work.jsx's `id="experience"` and notes that `resumeData.json links[]` still references `#experience` (Phase 2 re-derives from Content Collections).
- `src/components/Skills.astro` — Empty `<section id="skills">` stub.
- `src/components/Projects.astro` — Empty `<section id="projects">` stub.
- `src/components/Leadership.astro` — Empty `<section id="leadership">` stub.
- `src/components/Testimonials.astro` — Empty `<section id="testimonials">` stub.
- `src/pages/hydration-test.astro` — Hydration fixture mount page. **Renamed from plan's `__hydration-test.astro`** (see Deviation #1). Cross-tree-imports `HydrationCheck` from `../../tests/__fixtures__/HydrationCheck.tsx`; renders `<HydrationCheck client:load />` inside `<BaseLayout title="Hydration test">`.
- `src/content.config.ts` — Empty placeholder per D-11. Only a 4-line comment naming CONTEXT.md D-11 and pointing Phase 2 at where Zod schemas go. Intentionally no exports.
- `src/assets/.gitkeep` — Zero-byte file materializing the empty `src/assets/` directory.
- `tests/__fixtures__/HydrationCheck.tsx` — React 19 functional component, ~12 lines. `useState(0)`, button with `type="button"`, `onClick`, `data-testid="hydration-check"`. Default export.

### Modified (2)

- `src/pages/index.astro` — Replaced the Astro Welcome scaffold entirely. Now imports `BaseLayout` + the 8 section stubs, renders `<SideNav />` then a `<main>` wrapping the 7 content sections (About → Education → Work → Skills → Projects → Leadership → Testimonials) inside `<BaseLayout title="Rashmil Panchani">`.
- `src/styles/global.css` — Added the file-header source-attribution comment (per Shared Patterns rule) and the empty `@theme { /* TODO Phase 3 STYLE-04 — brand tokens */ }` block. Plan 02 had only the bare `@import "tailwindcss";` line.

## Decisions Made

- **Rename `__hydration-test.astro` → `hydration-test.astro` (Rule 1 deviation).** See Deviations #1.
- **Keep the empty `content.config.ts` despite the non-fatal `astro check` diagnostic.** D-11 is explicit that this is a Phase 2 edit surface and should exist as an empty placeholder. `astro check` returns exit 0 with 0 errors / 0 warnings / 0 hints — the "collections: expected record" line is an info-level diagnostic, not a failure.
- **Did NOT re-add `compilerOptions.jsx` to tsconfig.** Plan 02's forward note flagged the possibility; the test (16 files clean under strictest) confirmed it isn't needed. Astro 6 + `@astrojs/react`'s automatic-runtime mode handles JSX type emit. Keeping tsconfig at Pattern 8 verbatim.
- **Used `client:load` on the hydration fixture (Pattern 4 + Pitfall 5).** Production islands default to no directive; the fixture deliberately uses `client:load` so the React chunk lands unconditionally in `dist/_astro/`. The smoke test in Plan 05 can grep for it without race conditions.
- **Did NOT include `import React from 'react'`.** React 19 + `@astrojs/react`'s automatic JSX runtime mean `useState` is the only React import needed. Avoids dead-import lint pressure in Plan 04.
- **All file-header comments name the CONTEXT.md decision IDs they implement** (D-07 through D-14 + D-23). Keeps the trace from file → decision visible to future readers.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Renamed hydration fixture source path from `src/pages/__hydration-test.astro` → `src/pages/hydration-test.astro`**

- **Found during:** Task 3 verification, first `npm run build` invocation.
- **Issue:** Plan listed the source path as `src/pages/__hydration-test.astro` with a corresponding `dist/__hydration-test/index.html` must-have. Astro 6 (documented at https://docs.astro.build/en/guides/routing/#excluding-pages) excludes any file under `src/pages/` whose name starts with an underscore from route generation — the build silently emits 0 routes for that source. Confirmed empirically: created a sentinel `src/pages/__test-double.astro` to test whether the rule applies to single OR double underscores; build report was `1 page(s) built` (only `/index.html`, no `/__test-double/`). The plan's "must_haves.truths" requirement that `dist/__hydration-test/index.html` exists is therefore structurally infeasible at the listed source path.
- **Fix:** Renamed the source file to `src/pages/hydration-test.astro` (no leading underscores). Built URL becomes `/hydration-test/`. All other plan intent preserved: hydration fixture page is built into `dist/`, mounts `HydrationCheck` via `client:load`, produces a React chunk in `dist/_astro/`.
- **Files modified:** Created `src/pages/hydration-test.astro` (instead of the planned `__hydration-test.astro`); the `__hydration-test.astro` file existed transiently during Task 3 author-step but never made it to a commit (deleted with `\rm -f` before staging).
- **Verification:** `npm run build` on a clean dist/ reports `2 page(s) built` with `├─ /hydration-test/index.html (+22ms)` and `├─ /index.html (+3ms)` in the static-routes log. `dist/hydration-test/index.html` exists. `dist/_astro/HydrationCheck.CK_ySQr9.js` exists (the React island chunk). All other Task 3 verify clauses pass with the adapted path substitution.
- **Committed in:** 2de5caa (Task 4 rollup commit). The commit message body explicitly calls out the rename and points future readers at this SUMMARY's Deviation #1.
- **Forward note (CRITICAL for Plan 05):** Plan 05's smoke test (per CONTEXT.md D-23 #3: "`dist/__hydration-test/index.html` exists") must assert `dist/hydration-test/index.html` instead. Plan 05's planning task should incorporate this when authoring `tests/smoke.test.ts`. The semantic intent ("hydration verification page exists in dist/") is unchanged — only the URL string differs. CONTEXT.md decision text would also benefit from a one-line edit, but is being left intact here to avoid touching planning-artifact history (this SUMMARY records the deviation explicitly per the Rule 1 protocol).

---

**Total deviations:** 1 auto-fixed (1 × Rule 1 — bug: planning artifact specified a structurally infeasible source path).
**Impact on plan:** Single URL-string change between expected and actual. All other plan intent satisfied verbatim. No scope creep (no extra files, no extra deps). No architectural change (Rule 4 not triggered). No CLAUDE.md directives violated. Plan 05's smoke test wording needs a one-character-prefix update; flagged in Forward Note.

## Issues Encountered

- **Underscore-prefix routing exclusion (Issue → Deviation #1).** The plan-author appears not to have realized Astro's leading-`_` exclude rule applies to files under `src/pages/` — it's the same rule used to put `_components/` and `_partials/` inside `pages/` without them becoming routes. Caught at first build (Task 3 verify), fixed via filename change, documented. No additional follow-up needed beyond Plan 05's smoke-test wording.
- **`grep -c 'preconnect'` collision with comment text in BaseHead.astro.** Initial draft of `src/components/BaseHead.astro` contained the word "preconnects" inside the header comment, which made the plan's literal verify command (`grep -c 'preconnect' | grep -q '^2$'`) return 4 instead of 2. Re-worded the comment to drop the substring; the actual head emits exactly 2 `<link rel="preconnect">` tags. No functional change.
- **`grep -q 'canonical'` collision with comment text in BaseHead.astro.** Same class of issue: the initial comment said "Phase 4 SEO-01 fills the rest (OG, Twitter, canonical, description)" — the literal word "canonical" tripped the plan's negative-grep verify. Re-worded the comment to "Phase 4 SEO-01 expands this with the social/meta tags." Acceptance criterion preserved: the actual `<head>` contains NO `canonical`, NO `og:`, NO `twitter:`, NO `name="description"`.
- **Plan verify regex `'Result.*0 errors'` is single-line but `astro check` puts `Result (N files):` and `- 0 errors` on separate lines.** Adapted the verify chain to `grep -q '0 errors'` for this SUMMARY's self-check; the acceptance criterion ("`npx astro check` exits 0") is fully met. Documenting in case Plan 05's smoke test reuses the regex.

## Self-Check

**Files exist (created):**
- `src/layouts/BaseLayout.astro` ✓
- `src/components/BaseHead.astro` ✓
- `src/components/SideNav.astro` ✓
- `src/components/About.astro` ✓
- `src/components/Education.astro` ✓
- `src/components/Work.astro` ✓
- `src/components/Skills.astro` ✓
- `src/components/Projects.astro` ✓
- `src/components/Leadership.astro` ✓
- `src/components/Testimonials.astro` ✓
- `src/pages/hydration-test.astro` ✓
- `src/content.config.ts` ✓
- `src/assets/.gitkeep` ✓
- `tests/__fixtures__/HydrationCheck.tsx` ✓
- `.planning/phases/01-foundation/01-03-SUMMARY.md` ✓ (this file)

**Files absent (per Deviation #1):**
- `src/pages/__hydration-test.astro` ✓ (never committed; deleted before staging)

**Commit exists:**
- `2de5caa` on local `main` ✓
- `2de5caa` on `origin/main` ✓
- Commit contains exactly 16 files via `git diff HEAD~1 HEAD --name-only` ✓
- Commit subject matches `feat(01)` Conventional Commits scope ✓

**Verifications pass (clean rebuild after commit):**
- `npm run build` exits 0; reports `2 page(s) built in 819ms` ✓
- `dist/index.html` contains all 8 lowercase ids (sidenav, about, education, work, skills, projects, leadership, testimonials) ✓
- `dist/hydration-test/index.html` exists (URL deviation noted) ✓
- `dist/_astro/` contains 3 .js chunks (`client.DTojXMD-.js`, `HydrationCheck.CK_ySQr9.js`, `index.CO9X3OiW.js`) ✓
- `dist/_astro/BaseLayout.COtH9X1n.css` contains the literal `.text-[#abc123]{color:#abc123}` rule ✓ (Pitfall 29 NOT fired; no `@source` escalation needed)
- `npx astro check` exits 0 with 0 errors / 0 warnings / 0 hints across 16 files ✓

**Output of `find dist -maxdepth 2 -type f` after final clean build:**

```
dist/_astro/BaseLayout.COtH9X1n.css
dist/_astro/client.DTojXMD-.js
dist/_astro/HydrationCheck.CK_ySQr9.js
dist/_astro/index.CO9X3OiW.js
dist/favicon.svg
dist/hydration-test/index.html
dist/index.html
dist/Rashmil_Panchani.pdf
```

## Self-Check: PASSED

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Plan 04 (ESLint 9 flat config + Prettier + husky + lint-staged):** READY. Operates against a green `astro check`, a green build, and 14 newly authored `.astro` / `.tsx` files for the lint stack to be exercised against. The `compilerOptions.jsx` block is still absent from tsconfig — Plan 04 should verify it stays absent (Plan 02 forward note resolved).
- **Plan 05 (Vitest + smoke test + CI workflow):** READY. The smoke test asserts against the 5-point checklist in CONTEXT.md D-23 — all 5 are already true on `main`. **Important wording change**: Plan 05's smoke test must assert `dist/hydration-test/index.html` (NOT `dist/__hydration-test/index.html`) per Deviation #1.
- **Phase 2 (Content Layer):** READY for its first plan to land. `src/content.config.ts` exists as an empty file — Phase 2 fills it with `defineCollection` calls in place. `src/assets/.gitkeep` materializes the assets directory. The snapshot at `.planning/snapshots/m1-source/` is untouched.
- **Phase 3 (Sections & Navigation):** READY for its first plan. The 8 section stubs exist at the eventual final paths; Phase 3 fills the bodies without renaming. SideNav.astro and Work.astro carry comment headers flagging the D-23 id divergence from the snapshot — Phase 3 (or Phase 2 if it re-derives nav links from Content Collections) must use the new ids, not the snapshot's stale `#experience`.

**Forward notes for Plan 04:**
- The 5 moderate-severity npm-audit vulnerabilities from Plan 02 are still un-triaged. Plan 04's tooling work is the natural home for either an `npm audit fix` attempt or a deferred-items entry.
- `engines.node` is still not pinned in `package.json`.

**Forward notes for Plan 05:**
- Hydration page URL is `/hydration-test/` (NOT `/__hydration-test/`). See Deviation #1.
- Pitfall 29 is mitigated by the default Vite-plugin scan — Plan 05's smoke test grep `dist/_astro/*.css` for `#abc123` will pass without any extra config.
- `astro check` "Result" line and "0 errors" line are on SEPARATE lines — the Pattern-shaped regex `'Result.*0 errors'` won't match. Use `'0 errors'` or split across lines.

---
*Phase: 01-foundation*
*Completed: 2026-05-26*
