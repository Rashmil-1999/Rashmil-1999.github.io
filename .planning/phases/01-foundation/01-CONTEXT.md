# Phase 1: Foundation - Context

**Gathered:** 2026-05-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Stand up a buildable Astro 6 + TypeScript-strict + Tailwind v4 + ESLint + Prettier + Vitest skeleton at the repo root, replacing the existing CRA project via a one-shot greenfield wipe. The branch is renamed `master`→`main` as the first commit. A snapshot of pre-wipe source data is captured to `.planning/snapshots/m1-source/` for Phase 2 to consume. The result is `dist/` produced from a clean clone via `npm run build`, with `astro check`, `npm run lint`, and `npm test` all exiting 0 — and the Vitest smoke test asserting markers from each of the 8 sections, the Tailwind utility presence, and a React 19 hydration chunk from a test-only fixture. No real content is ported in Phase 1 — sections are empty stubs filled in Phase 3.

Out of scope for Phase 1: real section content (Phase 3), brand-token `@theme` values (Phase 3 STYLE-04), font stylesheet wiring (Phase 3 STYLE-05), Zod content schemas (Phase 2), real BaseHead OG/Twitter/canonical (Phase 4 SEO-01), GitHub Actions deploy workflow + Pages-source switch + gh-pages branch deletion (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Migration Strategy
- **D-01:** Greenfield wipe — Astro scaffold takes over the repo root in Phase 1; CRA is not run again.
- **D-02:** Aggressive wipe scope — `src/` and `public/` are emptied except `public/Rashmil_Panchani.pdf`. Favicons, `CNAME`, `manifest.json`, `robots.txt`, `index.html`, `resumeData.json`, `assets/*`, all `components/*.jsx`, `App.css`, `serviceWorker.js`, `setupTests.js` all deleted.
- **D-03:** Pre-wipe data preservation via snapshot — before the wipe, copy `src/resumeData.json` and `src/assets/*` (and `public/favicon*`, `logo*.png`) to `.planning/snapshots/m1-source/`. Phase 2 (Content Layer) and Phase 3 (Sections) read from there. Snapshot deleted in Phase 5 after CONTENT-06 verifies round-trip parity.
- **D-04:** Sequencing — (1) commit `.claude/` (currently untracked, must be preserved through M1) and create the snapshot, (2) rename branch `master`→`main` locally and push, (3) wipe over the dirty CRA tree directly (no separate commit for the WIP CRA drift; deletions + Astro scaffold roll up into one commit).
- **D-05:** `.claude/` is load-bearing (GSD planning + agents + hooks) and survives the wipe + ships with M1.
- **D-06:** Custom domain `rashmilpanchani.me` is permanently dropped — `public/CNAME` deleted, not re-authored.

### Initial Scaffold Scope
- **D-07:** FOUND-06 ships as written in Phase 1 — `src/pages/index.astro` composes 8 empty `<section id="…">` placeholder components (SideNav + About + Education + Work + Skills + Projects + Leadership + Testimonials). Smoke test asserts each id is present in `dist/index.html`. Phase 3 fills the stubs with real content; Phase 1 does NOT.
- **D-08:** Section files are separate stub `.astro` files at `src/components/{SideNav,About,Education,Work,Skills,Projects,Leadership,Testimonials}.astro`. Each renders an empty `<section id="…"></section>` (or minimal landmark). Phase 3 boundary is clean — Phase 3 fills these stubs in place.
- **D-09:** FOUND-04 React 19 hydration verification — fixture lives at `tests/__fixtures__/HydrationCheck.tsx`, mounted via `src/pages/__hydration-test.astro` so it appears in the same `astro build`. Smoke test asserts `dist/__hydration-test/index.html` exists and `dist/_astro/` contains a React JS chunk. Fixture is "throwaway" per FOUND-04 wording — it lives in tests/ and the route ships with the site. (Acceptable; not part of any visible nav.)
- **D-10:** tsconfig extends `astro/tsconfigs/strictest` (adds `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes` on top of `strict: true`). FOUND-02's `strict: true` is satisfied; Phase 2's content code must be written to satisfy these tighter flags from day one.
- **D-11:** src/ layout is conventional Astro:
  - `src/pages/index.astro` (the one page)
  - `src/pages/__hydration-test.astro` (hydration fixture mount)
  - `src/components/{SideNav,About,Education,Work,Skills,Projects,Leadership,Testimonials,BaseHead}.astro` (9 components)
  - `src/layouts/BaseLayout.astro` (html shell + imports BaseHead + slot)
  - `src/styles/global.css` (Tailwind v4 entry)
  - `src/content.config.ts` (empty placeholder created in Phase 1; populated in Phase 2 — keeps Phase 2 file-creation surface small)
  - `src/assets/` (empty directory created in Phase 1, ready for Phase 3 images)
  - `tests/smoke.test.ts`
  - `tests/__fixtures__/HydrationCheck.tsx`
- **D-12:** Tailwind utility verification — one arbitrary unique utility (proposed: `text-[#abc123]`) is applied in one stub component. Smoke test greps `dist/_astro/*.css` for the rendered output. This validates both `@tailwindcss/vite` wiring and `.astro` source detection (Pitfall 29 from STATE.md).
- **D-13:** `src/layouts/BaseLayout.astro` is minimal + imports a stubbed `src/components/BaseHead.astro`. BaseHead in Phase 1 emits only `<meta charset>`, `<meta viewport>`, `<title>`, `<link rel="icon" href="/favicon.svg">`, and the two `<link rel="preconnect">` tags for `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin on the second). NO OG, NO Twitter, NO canonical, NO description, NO font stylesheet — Phase 4 SEO-01 fills BaseHead; Phase 3 STYLE-05 adds the font stylesheet.
- **D-14:** `src/styles/global.css` contents in Phase 1: `@import "tailwindcss";` and an empty `@theme { /* TODO Phase 3 — brand tokens */ }` block. No base reset, no brand colors, no font tokens.

### ESLint / Prettier Baseline
- **D-15:** ESLint 9 flat config (`eslint.config.js`) composes: `@eslint/js` recommended + `typescript-eslint` recommended-type-checked + `eslint-plugin-astro` recommended + `eslint-plugin-jsx-a11y` recommended (scoped to `**/*.tsx` files only) + `eslint-config-prettier` last to disable stylistic conflicts.
- **D-16:** Prettier is separate (not integrated via `eslint-plugin-prettier`). Scripts: `npm run lint` (eslint), `npm run format` (prettier --write), `npm run format:check` (prettier --check). FOUND-05 "lint passes" gate is `npm run lint && npm run format:check`.
- **D-17:** Prettier config (`.prettierrc.json`): `printWidth: 100`, `tabWidth: 4`, `useTabs: false`, `semi: true`, `singleQuote: true`, `trailingComma: "all"`, `bracketSameLine: false`, `arrowParens: "always"`. Plugins: `prettier-plugin-astro` (for `.astro` files), `prettier-plugin-tailwindcss` (Tailwind class auto-sort — standard for v4 projects).
- **D-18:** Ignore lists. ESLint `ignores`: `dist/`, `node_modules/`, `.astro/`, `coverage/`, `.planning/`, `.claude/`. Prettier `.prettierignore`: same set. Protects the markdown planning artifacts in `.planning/` and the GSD workflow files in `.claude/` from accidental reformat.
- **D-19:** Enforcement layers — (a) CI gate: `npm run lint && npm run format:check && npx astro check && npm test` is the Phase 1 success-criteria gate. (b) Pre-commit hook via `husky` + `lint-staged` runs ESLint --fix + Prettier --write on staged files. (c) Editor-side: no `.vscode/extensions.json` requirement in Phase 1.
- **D-20:** Commit-message convention is Conventional Commits, documented in `CONTRIBUTING.md` (or appended to `.claude/CLAUDE.md`), NOT enforced via commitlint. Matches existing repo style (`docs:`, `chore:`, etc.).

### Smoke Test Mechanics
- **D-21:** Vitest config spawns `astro build` once in `globalSetup` (subprocess via Node `child_process` or `execa`). If `astro build` exits non-zero, globalSetup throws → entire suite fails. This satisfies ROADMAP Phase 1 SC #3 ("deliberately breaking the build causes the test to fail") implicitly — no separate inversion test needed.
- **D-22:** The hydration fixture page (`src/pages/__hydration-test.astro`) is part of the same `astro build` — no separate isolated build. One build, multiple assertions.
- **D-23:** Smoke test assertions (minimum viable):
  1. `dist/index.html` exists.
  2. `dist/index.html` contains all 8 section ids: `about`, `education`, `work`, `skills`, `projects`, `leadership`, `testimonials`, `sidenav` (or whichever id `SideNav.astro` uses).
  3. `dist/__hydration-test/index.html` exists.
  4. `dist/_astro/` contains at least one `.js` chunk (proves React hydration shipped for the fixture island).
  5. `dist/_astro/*.css` contains the Tailwind test-marker utility (`text-[#abc123]` or whatever D-12 settles on).
- **D-24:** Tests live at `tests/smoke.test.ts` (NOT under `src/`). `vitest.config.ts` at repo root.
- **D-25:** `.github/workflows/ci.yml` is added in Phase 1 and triggers on PR + push to `main`. Steps: `npm ci`, `npm run lint`, `npm run format:check`, `npx astro check`, `npm test`. This is SEPARATE from the Phase 5 `deploy.yml`; both workflows coexist after Phase 5 ships.

### Claude's Discretion
- The exact Vitest version (3.x) and whether to use `execa` vs `child_process` for the subprocess spawn — planner picks.
- Whether to use `prettier-plugin-organize-imports` in addition to `prettier-plugin-tailwindcss` — planner picks based on import-sort behavior.
- The exact husky + lint-staged setup commands and config syntax — planner picks current best-practice.
- Naming of the Tailwind test-marker utility (`text-[#abc123]` is illustrative).
- Whether `package.json` `engines.node` is pinned (Node 22 LTS is locked in PROJECT.md constraints; pinning via `engines` is a planner judgment).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project decisions & scope
- `.planning/PROJECT.md` — What this project is, locked decisions, M1 active requirements, out-of-scope list.
- `.planning/REQUIREMENTS.md` — All 64 v1 requirements. Phase 1 owns FOUND-01..08.
- `.planning/ROADMAP.md` § Phase 1 — Goal, depends-on, requirements, 5 success criteria.
- `.planning/STATE.md` — Pre-Phase-1 decisions, blockers/concerns including Pitfall 29 (Tailwind v4 `.astro` source detection in `dist/_astro/*.css`).

### Pre-existing codebase (the wipe deletes most of this, but downstream phases consume the snapshot)
- `.planning/codebase/STACK.md` — Current CRA stack to be replaced; CDN libs listed for awareness.
- `.planning/codebase/STRUCTURE.md` — Current directory layout (the "before" picture).
- `.planning/codebase/CONCERNS.md` — Anti-pattern backlog (jQuery scroll-spy IIFE, dead deps, `image_map`, dual lockfiles, `<StrictMode>` placement, CDN deps, large images, Bootstrap CSS missing). M1 phases close these out.
- `.planning/codebase/TESTING.md` — Current (CRA + Jest) test setup, baseline for what we're replacing.

### Behavioral guidelines
- `.claude/CLAUDE.md` — WCAG 2.1 AA hard requirement (relevant for Phase 4 mostly, but informs hydration-fixture markup), simplicity principles, surgical-changes principle, goal-driven execution.

### Snapshot artifacts (created during Phase 1 execution)
- `.planning/snapshots/m1-source/resumeData.json` — Pre-wipe source for Phase 2 content migration.
- `.planning/snapshots/m1-source/assets/` — Pre-wipe project images for Phase 3 image work.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/resumeData.json` — Snapshotted to `.planning/snapshots/m1-source/` before wipe. Phase 2's Zod schemas should mirror its keys (`first_name`, `last_name`, `current_status`, `contact_message`, `email`, `description`, `resume_download`, `social[]`, `sections[]`, `links[]`, `projects[]`, `leaderships[]`, `testimonials[]`, `education[]`, `work[]`, `skills{}`, `skill_array[]`) — see `.planning/codebase/STRUCTURE.md` for the full shape.
- `public/Rashmil_Panchani.pdf` — Only file in `public/` that survives the wipe. About.astro (Phase 3) links to it as `/Rashmil_Panchani.pdf`.

### Established Patterns
- The existing CRA code uses Bootstrap 4 classes throughout JSX (`d-flex`, `mb-5`, `col-md-4`, `text-center`). Phase 3 STYLE-* phases translate these to Tailwind utilities. Phase 1 doesn't need to engage with this — stubs are empty.
- Existing `image_map` in `src/components/Projects.jsx:23-37` is an anti-pattern (CONCERNS.md). Phase 1 doesn't reintroduce it; Phase 2/3 use Astro's `image()` schema helper instead.
- Section ids in current site (`#about`, `#education`, `#work`, `#skills`, `#projects`, `#leadership`, `#testimonials`) drive the SideNav anchor links. Phase 1 stubs use the same ids.

### Integration Points
- `astro.config.mjs` is the integration point for `@astrojs/react`, `@tailwindcss/vite`, and `site: 'https://Rashmil-1999.github.io'` / `output: 'static'` / no `base`. FOUND-08 is satisfied here.
- `tsconfig.json` is the integration point for `astro/tsconfigs/strictest` extend. FOUND-02 is satisfied here.
- `package.json` `scripts` is the integration point for `lint`, `format`, `format:check`, `test`, `build`, `dev`, `preview`. FOUND-05 / FOUND-06 / Phase-5 deploy script alignment all converge here.
- `.github/workflows/ci.yml` is the integration point for the CI gate (lint + check + test). Separate from Phase 5's `deploy.yml`.

</code_context>

<specifics>
## Specific Ideas

- **gh-pages branch is the live site.** Currently the GitHub default branch is `gh-pages` (serving the CRA build); we work on `master`. Phase 1 renames `master`→`main`. Phase 5 must (a) switch GitHub Pages source to "GitHub Actions", (b) flip the default branch to `main`, (c) only then delete the `gh-pages` branch. This sequencing is critical — out of order, the live site goes dark mid-cutover. Captured in deferred for Phase 5 to honor.
- **Hydration fixture is not "invisible."** `src/pages/__hydration-test.astro` will produce `dist/__hydration-test/index.html` on every build. It's not linked from anywhere and uses an underscore-prefixed slug to signal "internal," but anyone hitting that URL will see it. Acceptable per FOUND-04 (a "throwaway" verification). Phase 5 may choose to remove it.
- **Tailwind test marker** is the user-explicit pattern for proving `@tailwindcss/vite` source detection works against `.astro` files (Pitfall 29 from STATE.md).
- **tabWidth: 4** is a user-specific Prettier override; the rest of the Prettier config follows community defaults for Astro + TS + Tailwind v4 projects.

</specifics>

<deferred>
## Deferred Ideas

These came up during discussion and belong to other phases. Don't lose them.

### Phase 2 (Content Layer)
- Read source content from `.planning/snapshots/m1-source/resumeData.json` to populate the new collections; do NOT re-introduce `src/resumeData.json`.
- `src/content.config.ts` exists as an empty placeholder after Phase 1 — Phase 2 fills it with Zod schemas for all 8 collections.

### Phase 3 (Sections & Navigation / Style)
- STYLE-04: Fill `src/styles/global.css` `@theme` with brand tokens (colors, font-family for Saira Extra Condensed + Muli, spacing).
- STYLE-05: Decide between Google Fonts stylesheet vs `@fontsource/*` self-host. Phase 1 emits only preconnect; Phase 3 adds the stylesheet link OR replaces the preconnects with self-hosted font CSS.
- Section stubs from Phase 1 (`src/components/{...}.astro`) get filled with real markup in Phase 3 — file paths don't change.
- Move project images from `.planning/snapshots/m1-source/assets/` into `src/content/projects/<slug>/<slug>.png` per CONTENT-05 (this is Phase 2's CONTENT-05 work, but the source is the snapshot from Phase 1).

### Phase 4 (SEO, A11Y & Meta Polish)
- SEO-01: Extract / expand `src/components/BaseHead.astro` (stubbed in Phase 1) to emit `<meta name="description">`, OpenGraph, Twitter Card, `<link rel="canonical">` derived from `Astro.site` + current path.
- SEO-06: Install `@astrojs/sitemap`, emit `sitemap-index.xml`, point `robots.txt` to it.
- SEO-07: Author and commit the 1200×630 OG image asset (`public/og.png` — flagged in STATE.md as a Phase 4 pre-check).
- Re-author `public/favicon.{ico,png,svg}`, `public/manifest.webmanifest` (real, not CRA default), `public/robots.txt`.
- A11Y-04: Active side-nav state must convey via more than color (border, weight, plus `aria-current`).

### Phase 5 (Cleanup & Deploy)
- **DEPLOY sequencing constraint (CRITICAL):** DEPLOY-03 (switch GitHub Pages source from branch-deploy → Actions) MUST precede DEPLOY-05 (delete `gh-pages` branch). Otherwise the live site goes dark during the cutover. Both must follow DEPLOY-04 (first successful Actions deploy).
- Flip GitHub default branch from `gh-pages` to `main` as part of the Phase 5 cutover bundle.
- Delete `.planning/snapshots/m1-source/` after CONTENT-06 verifies round-trip parity.
- Consider deleting `src/pages/__hydration-test.astro` + `tests/__fixtures__/HydrationCheck.tsx` if the hydration check has served its purpose. (Optional — keeping them as regression cover is also reasonable.)
- DEPLOY-01..06 + CLEAN-01..08 — most of the CRA-removal CLEAN-* items are already executed in Phase 1's greenfield wipe; Phase 5 just verifies the absence and authors README + deploy workflow.

</deferred>

---

*Phase: 1-Foundation*
*Context gathered: 2026-05-26*
