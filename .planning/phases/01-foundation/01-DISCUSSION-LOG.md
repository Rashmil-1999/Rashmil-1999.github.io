# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-26
**Phase:** 1-Foundation
**Areas discussed:** Migration strategy, Initial scaffold scope, ESLint baseline, Smoke test mechanics

---

## Migration Strategy

### Q1 — How should the Astro scaffold land?

| Option | Description | Selected |
|--------|-------------|----------|
| Greenfield wipe | Delete src/ + public/index.html + public/manifest.json + react deps in Phase 1; Astro scaffold takes over root immediately. Existing site stops working until M1 ships. | ✓ |
| Side-by-side | Astro scaffold in /astro/ subdirectory through Phases 1–4; moved to root in Phase 5. CRA remains buildable through M1. | |
| In-place overlay | Astro at root from day one; CRA source coexists but unbuildable; deletions incremental per phase. | |

**User's choice:** Greenfield wipe

### Q2 — Boundary of the wipe?

| Option | Description | Selected |
|--------|-------------|----------|
| Aggressive wipe | Delete everything in src/ and public/ except public/Rashmil_Panchani.pdf. | ✓ |
| Keep images temporarily | Preserve src/assets/*.png + public/favicons; everything else wiped. | |
| Keep images + JSON | Preserve src/resumeData.json + src/assets/; only CRA build artifacts deleted. | |

**User's choice:** Aggressive wipe

### Q3 — How does Phase 2 recover the source data?

| Option | Description | Selected |
|--------|-------------|----------|
| Read from git history | Phase 2 uses `git show HEAD~1:src/resumeData.json`; no temporary files. | |
| Tag pre-wipe commit | Create `pre-astro-wipe` tag; Phase 2 reads via tag. | |
| Snapshot to .planning/ | Copy src/resumeData.json + assets/ to .planning/snapshots/m1-source/ before wipe. Deleted in Phase 5. | ✓ |

**User's choice:** Snapshot to .planning/

### Q4 — How to sequence the uncommitted CRA drift?

| Option | Description | Selected |
|--------|-------------|----------|
| Wipe over dirty tree | Run the wipe directly; deletions roll up into one commit. | ✓ |
| Commit drift first | Commit the WIP CRA state first, then wipe. Two commits. | |
| Discard drift first | `git restore` modified files, then wipe from a clean tree. | |

**User's choice:** Wipe over dirty tree
**Notes:** User added a critical constraint here — `.claude/` folder is load-bearing (GSD planning + agents + hooks) and must be preserved through M1. Only `.planning/snapshots/` is ephemeral. So before the wipe: commit `.claude/` (currently untracked) and create the snapshot. Reflected back and accepted.

### Q5 — Which public/ files survive the wipe?

| Option | Description | Selected |
|--------|-------------|----------|
| Wipe all, re-author later | Only Rashmil_Panchani.pdf survives. Astro default favicon ships Phase 1–3. Phase 4 authors real favicons + webmanifest. CNAME stays gone. | ✓ |
| Keep favicons + robots.txt | Favicons + robots.txt survive; CNAME + manifest.json + index.html wiped. | |
| Keep nothing but the PDF | Strictest — even favicons re-authored. | |

**User's choice:** Wipe all, re-author later

### Q6 — Branch + snapshot housekeeping?

| Option | Description | Selected |
|--------|-------------|----------|
| master + .planning/snapshots/ | Stay on master; snapshot to .planning/snapshots/m1-source/. Branch rename deferred to Phase 5. | |
| Rename master→main in Phase 1 | Rename branch as first commit of Phase 1; push. One less thing for Phase 5. | ✓ |
| Stay master, document for Phase 5 | Explicit — Phase 5 owns the rename. | |

**User's choice:** Rename master→main in Phase 1

### Mid-area free-text input

After Q6, user added: "gh-pages is the default branch so that is the site that is built which you will need to make sure is in sync with the master branch."

Reflected back: gh-pages = live-site branch (CRA build), master/main = work branch through M1, branch dance happens in Phase 5. Captured as deferred ideas (DEPLOY-03 must precede DEPLOY-05; flip default branch in Phase 5 cutover bundle).

---

## Initial Scaffold Scope

### Q1 — Hello-world vs 8 section placeholders?

| Option | Description | Selected |
|--------|-------------|----------|
| 8 section placeholders | index.astro renders 8 empty `<section id="…">` blocks; FOUND-06 ships as written. | ✓ |
| Hello-world + relax FOUND-06 | Bare Hello-world; FOUND-06's "8 sections" assertion moves to Phase 3. | |
| Hybrid | 8 empty placeholders in index.astro; Phase 3 swaps them for real components. | |

**User's choice:** 8 section placeholders

### Q2 — Where do the placeholders live structurally?

| Option | Description | Selected |
|--------|-------------|----------|
| Inline in index.astro | All 8 `<section>` blocks inside src/pages/index.astro; Phase 3 extracts. | |
| Separate stub .astro files | src/components/{8 names}.astro stubs + index.astro composes; Phase 3 fills stubs. | ✓ |
| Single Sections.astro stub | One Sections.astro file with all 8 placeholders inside. | |

**User's choice:** Separate stub .astro files

### Q3 — Where does the FOUND-04 React 19 hydration fixture live?

| Option | Description | Selected |
|--------|-------------|----------|
| Hidden island, delete in Phase 5 | Lives in src/components/_HydrationCheck.tsx, mounted in index.astro. Deleted in Phase 5. | |
| Test-only, never rendered | Lives in tests/__fixtures__/HydrationCheck.tsx; Vitest builds it via a fixture page. Never enters src/. | ✓ |
| Smoke test only — no fixture | Manual one-time verification, no committed code. | |

**User's choice:** Test-only, never rendered
**Notes:** Realized during CONTEXT.md write — to make Vitest's `astro build` produce an asset, the fixture .tsx must be mounted in a route (`.astro` file) that lives in `src/pages/`. Refined: tsx fixture at `tests/__fixtures__/HydrationCheck.tsx`, route mount at `src/pages/__hydration-test.astro` (so it's in the same build). Underscore prefix signals "internal."

### Q4 — tsconfig strictness beyond strict: true?

| Option | Description | Selected |
|--------|-------------|----------|
| astrojs/strictest preset | Extend `astro/tsconfigs/strictest` (adds noUncheckedIndexedAccess + noImplicitOverride + exactOptionalPropertyTypes). | ✓ |
| astrojs/strict only | Extend `astro/tsconfigs/strict` (matches FOUND-02 verbatim). | |
| Hand-rolled | Author tsconfig.json with specific flags only. | |

**User's choice:** astrojs/strictest preset

### Q5 — src/ directory layout convention?

| Option | Description | Selected |
|--------|-------------|----------|
| Conventional Astro | src/pages, src/components, src/layouts, src/styles, src/content.config.ts, tests/. | |
| Conventional + src/assets/ | All of above PLUS src/assets/ created empty in Phase 1. | ✓ |
| Flatter | Skip src/layouts/; head wiring inline in index.astro until Phase 4. | |

**User's choice:** Conventional + src/assets/

### Q6 — How explicit is the Tailwind utility verification?

| Option | Description | Selected |
|--------|-------------|----------|
| Use in stubs | Each section stub gets one trivial Tailwind class. Smoke test asserts. | |
| Dedicated test marker | One arbitrary unique utility (e.g., `text-[#abc123]`); smoke test greps for it in dist/_astro/. | ✓ |
| Implicit in build | No explicit assertion; rely on Phase 3 STYLE-* to catch breakage. | |

**User's choice:** Dedicated test marker

### Q7 — What does src/layouts/BaseLayout.astro contain?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal shell | Bare html/head/body in BaseLayout itself; Phase 4 extracts BaseHead. | |
| Minimal + stubbed BaseHead | BaseLayout imports src/components/BaseHead.astro (stub); Phase 4 fills BaseHead. | ✓ |
| Empty layout, head in page | Thin pass-through layout; head lives in index.astro until Phase 4. | |

**User's choice:** Minimal + stubbed BaseHead

### Q8 — Google Fonts wiring?

| Option | Description | Selected |
|--------|-------------|----------|
| Defer to Phase 3 | No font links in Phase 1; STYLE-05 owns the full decision. | |
| Preconnect now, stylesheet in Phase 3 | Phase 1 BaseHead emits `<link rel=preconnect>` for fonts.{googleapis,gstatic}.com only. | ✓ |
| Decide font strategy now | Pick Google Fonts vs @fontsource self-host immediately. | |

**User's choice:** Preconnect now, stylesheet in Phase 3

### Q9 — src/styles/global.css initial contents?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal | `@import "tailwindcss";` + empty `@theme { /* TODO Phase 3 */ }` block. | ✓ |
| Minimal + base reset | Add a small `@layer base { body { @apply font-sans antialiased; } }` block. | |
| Define theme tokens now | Fill @theme with placeholder brand colors + font tokens. | |

**User's choice:** Minimal

---

## ESLint Baseline

### Q1 — ESLint plugin/preset baseline?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal | js/recommended + ts-eslint/recommended + astro/recommended + eslint-config-prettier. No jsx-a11y in Phase 1. | |
| Standard | Minimal + ts-eslint/recommended-type-checked + jsx-a11y on .tsx files only. | ✓ |
| Strict | Standard + ts-eslint/strict-type-checked + import + sort-imports. | |

**User's choice:** Standard

### Q2 — Prettier integration approach?

| Option | Description | Selected |
|--------|-------------|----------|
| Separate, eslint-config-prettier | Prettier runs independently; ESLint config disables stylistic conflicts via eslint-config-prettier. | ✓ |
| Integrated, eslint-plugin-prettier | ESLint runs Prettier as a rule and reports format diffs as lint errors. | |
| Skip Prettier in Phase 1 | Defer Prettier to Phase 4 polish. | |

**User's choice:** Separate, eslint-config-prettier

### Q3 — Lint enforcement?

| Option | Description | Selected |
|--------|-------------|----------|
| CI gate only | `npm run lint` script gates Phase 1 SC #2; no pre-commit hook. | |
| CI gate + pre-commit hook | Same as above + husky + lint-staged running ESLint + Prettier on staged files. | ✓ |
| CI gate + lint-on-save guidance | CI gate + .vscode/extensions.json for editor lint-on-save. | |

**User's choice:** CI gate + pre-commit hook

### Q4 — Ignore lists?

| Option | Description | Selected |
|--------|-------------|----------|
| Sensible defaults | Ignore dist/, node_modules/, .astro/, coverage/. | |
| Defaults + .planning/ + .claude/ | Above PLUS .planning/ and .claude/ to protect GSD scaffolding. | ✓ |
| Lint-everything | No custom ignore beyond dist/ + node_modules/. | |

**User's choice:** Defaults + .planning/ + .claude/

### Q5 — Prettier knobs?

| Option | Description | Selected |
|--------|-------------|----------|
| All defaults | No .prettierrc beyond plugins. printWidth 80, semi true, singleQuote false, etc. | |
| Wider line + single quotes | printWidth 100, singleQuote true. | |
| Tell me popular defaults | Defer to community-default research before deciding. | |

**User's choice:** (free-text) "tabwidth should be 4 rest according to the community"

**Resolution:** Reflected back as printWidth 100, tabWidth 4, useTabs false, semi true, singleQuote true, trailingComma 'all', bracketSameLine false, arrowParens 'always', plugins prettier-plugin-astro + prettier-plugin-tailwindcss. User confirmed "Yes, lock it in."

### Q6 — Commit-message convention?

| Option | Description | Selected |
|--------|-------------|----------|
| Conventional Commits, no enforcement | Document in CLAUDE.md / CONTRIBUTING.md; matches existing style; no commitlint. | ✓ |
| Conventional Commits + commitlint | Install commitlint + commit-msg husky hook. | |
| No convention | Don't document or enforce. | |

**User's choice:** Conventional Commits, no enforcement

---

## Smoke Test Mechanics

### Q1 — How does Vitest produce the dist/ to assert against?

| Option | Description | Selected |
|--------|-------------|----------|
| Spawn astro build in-test | globalSetup spawns `astro build` once. Slow but hermetic. `npm test` is the only command. | ✓ |
| Pre-build, test reads dist | `npm test` chains `npm run build && vitest run`. Faster watch mode; less hermetic. | |
| Programmatic build API | Use Astro's programmatic build API inside globalSetup. | |

**User's choice:** Spawn astro build in-test

### Q2 — How does the React 19 hydration fixture get into a build?

| Option | Description | Selected |
|--------|-------------|----------|
| Same build | Fixture page mounted at src/pages/__hydration-test.astro; included in the main astro build. | ✓ |
| Separate isolated build | Vitest globalSetup spawns a second astro build in a temp dir with only the fixture page. | |
| Gate fixture route with env flag | Same as Option 1 but only renders when PHASE1_SMOKE=1 is set. | |

**User's choice:** Same build

### Q3 — What does the smoke test assert?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimum viable | dist/index.html exists + contains 8 section ids + hydration-test/index.html exists + dist/_astro JS chunk + Tailwind test marker in CSS. | ✓ |
| Minimum + 'break it' inversion | Above + dedicated test that confirms suite fails when build is broken. | |
| Minimum + content snapshot | Above + HTML output snapshot. | |

**User's choice:** Minimum viable
**Notes:** Phase 1 SC #3 ("breaking the build causes test to fail") is satisfied implicitly — globalSetup spawns astro build, so any build failure throws and the whole suite fails.

### Q4 — Test file location + CI runner?

| Option | Description | Selected |
|--------|-------------|----------|
| tests/smoke.test.ts + .github/workflows/ci.yml | Smoke test at tests/; CI workflow runs lint + check + test on PR + push. Separate from Phase 5 deploy.yml. | ✓ |
| tests/smoke.test.ts only | No CI workflow in Phase 1; Phase 5 deploy.yml runs the gates. | |
| src/__tests__/smoke.test.ts only | Test under src/; no CI workflow. | |

**User's choice:** tests/smoke.test.ts + .github/workflows/ci.yml

---

## Claude's Discretion

Areas where the user explicitly deferred to planner judgment (per D-* notes in CONTEXT.md):
- Exact Vitest version (3.x) and subprocess library (`execa` vs `child_process`).
- Whether to add `prettier-plugin-organize-imports`.
- Specific husky + lint-staged setup commands and config syntax.
- The literal name of the Tailwind test-marker utility (`text-[#abc123]` is illustrative).
- Whether `package.json` `engines.node` gets a pin (Node 22 LTS is locked at the policy level).

## Deferred Ideas

See CONTEXT.md `<deferred>` section. Summary:
- Phase 2 reads from `.planning/snapshots/m1-source/`.
- Phase 3 fills section stubs in place; STYLE-04 fills `@theme`; STYLE-05 decides Google Fonts stylesheet vs `@fontsource`.
- Phase 4 fills BaseHead with OG/Twitter/canonical, adds sitemap, real favicons, real webmanifest, OG image asset.
- Phase 5: critical DEPLOY-03 (switch Pages source to Actions) MUST precede DEPLOY-05 (delete gh-pages branch). Also: flip default branch gh-pages → main, delete `.planning/snapshots/m1-source/` after CONTENT-06 verification, optionally remove the hydration test fixture + route.
