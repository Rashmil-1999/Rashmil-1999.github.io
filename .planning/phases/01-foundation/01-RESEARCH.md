# Phase 1: Foundation — Research

**Researched:** 2026-05-26
**Domain:** Astro 6 + React 19 + Tailwind v4 + TypeScript strict + ESLint 9 + Vitest 4 scaffold (greenfield wipe of CRA)
**Confidence:** HIGH (verified versions live against npm registry on 2026-05-26; prior research artifacts `.planning/research/STACK.md` and `.planning/research/PITFALLS.md` cross-referenced)

## Summary

This phase scaffolds the Astro 6 stack that the rest of M1 sits on. Every tooling decision in CONTEXT.md is locked. The work the planner must order is: (1) **pre-wipe snapshot + branch rename**, (2) **greenfield wipe of CRA**, (3) **scaffold + integrations** (Astro, React, Tailwind via Vite plugin), (4) **tsconfig + lint + format + hook tooling**, (5) **stub components + hydration fixture**, (6) **Vitest smoke test that spawns `astro build`**, (7) **CI workflow**. Acceptance is the five SC items in ROADMAP.md.

The single highest-risk verification is **Pitfall 29** — Tailwind v4's auto source detection covers `.astro` files in practice with `@tailwindcss/vite`, but the prior research rated this MEDIUM confidence. CONTEXT.md D-12 mitigates by smoke-testing for a Tailwind utility marker class in `dist/_astro/*.css`. The second-highest is **eslint-plugin-jsx-a11y peer compatibility** — its peer range is `^3 || … || ^9`, so we cannot upgrade to ESLint 10 yet. Pin ESLint to `^9.38.0`.

**Primary recommendation:** Pin the verified stack table below, run integrations through `npx astro add react tailwind icon` (which writes the config correctly), wire ESLint 9 flat config + Prettier + husky + lint-staged using the patterns in this document, and verify Pitfall 29 mitigation explicitly via the smoke test asserting a Tailwind marker class is emitted in `dist/_astro/*.css`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Migration Strategy**
- **D-01:** Greenfield wipe — Astro scaffold takes over the repo root in Phase 1; CRA is not run again.
- **D-02:** Aggressive wipe scope — `src/` and `public/` are emptied except `public/Rashmil_Panchani.pdf`. Favicons, `CNAME`, `manifest.json`, `robots.txt`, `index.html`, `resumeData.json`, `assets/*`, all `components/*.jsx`, `App.css`, `serviceWorker.js`, `setupTests.js` all deleted.
- **D-03:** Pre-wipe data preservation via snapshot — before the wipe, copy `src/resumeData.json` and `src/assets/*` (and `public/favicon*`, `logo*.png`) to `.planning/snapshots/m1-source/`. Phase 2 (Content Layer) and Phase 3 (Sections) read from there. Snapshot deleted in Phase 5 after CONTENT-06 verifies round-trip parity.
- **D-04:** Sequencing — (1) commit `.claude/` (currently untracked, must be preserved through M1) and create the snapshot, (2) rename branch `master`→`main` locally and push, (3) wipe over the dirty CRA tree directly (no separate commit for the WIP CRA drift; deletions + Astro scaffold roll up into one commit).
- **D-05:** `.claude/` is load-bearing (GSD planning + agents + hooks) and survives the wipe + ships with M1.
- **D-06:** Custom domain `rashmilpanchani.me` is permanently dropped — `public/CNAME` deleted, not re-authored.

**Initial Scaffold Scope**
- **D-07:** FOUND-06 ships as written in Phase 1 — `src/pages/index.astro` composes 8 empty `<section id="…">` placeholder components (SideNav + About + Education + Work + Skills + Projects + Leadership + Testimonials). Smoke test asserts each id is present in `dist/index.html`. Phase 3 fills the stubs with real content; Phase 1 does NOT.
- **D-08:** Section files are separate stub `.astro` files at `src/components/{SideNav,About,Education,Work,Skills,Projects,Leadership,Testimonials}.astro`. Each renders an empty `<section id="…"></section>` (or minimal landmark). Phase 3 boundary is clean — Phase 3 fills these stubs in place.
- **D-09:** FOUND-04 React 19 hydration verification — fixture lives at `tests/__fixtures__/HydrationCheck.tsx`, mounted via `src/pages/__hydration-test.astro` so it appears in the same `astro build`. Smoke test asserts `dist/__hydration-test/index.html` exists and `dist/_astro/` contains a React JS chunk. Fixture is "throwaway" per FOUND-04 wording — it lives in tests/ and the route ships with the site.
- **D-10:** tsconfig extends `astro/tsconfigs/strictest` (adds `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes` on top of `strict: true`). FOUND-02's `strict: true` is satisfied; Phase 2's content code must be written to satisfy these tighter flags from day one.
- **D-11:** src/ layout is conventional Astro: see CONTEXT.md for full list (9 components, BaseLayout, global.css, content.config.ts placeholder, src/assets empty, tests/smoke.test.ts, tests/__fixtures__/HydrationCheck.tsx).
- **D-12:** Tailwind utility verification — one arbitrary unique utility (proposed: `text-[#abc123]`) applied in one stub. Smoke test greps `dist/_astro/*.css` for the rendered output. Validates `@tailwindcss/vite` + `.astro` source detection (Pitfall 29 mitigation).
- **D-13:** `src/layouts/BaseLayout.astro` is minimal + imports a stubbed `src/components/BaseHead.astro`. BaseHead emits only: `<meta charset>`, `<meta viewport>`, `<title>`, `<link rel="icon" href="/favicon.svg">`, and the two `<link rel="preconnect">` tags for `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin on the second). NO OG, NO Twitter, NO canonical, NO description, NO font stylesheet — Phase 4 SEO-01 fills BaseHead; Phase 3 STYLE-05 adds the font stylesheet.
- **D-14:** `src/styles/global.css` contents in Phase 1: `@import "tailwindcss";` and an empty `@theme { /* TODO Phase 3 — brand tokens */ }` block. No base reset, no brand colors, no font tokens.

**ESLint / Prettier Baseline**
- **D-15:** ESLint 9 flat config (`eslint.config.js`) composes: `@eslint/js` recommended + `typescript-eslint` recommended-type-checked + `eslint-plugin-astro` recommended + `eslint-plugin-jsx-a11y` recommended (scoped to `**/*.tsx` files only) + `eslint-config-prettier` last to disable stylistic conflicts.
- **D-16:** Prettier is separate (not integrated via `eslint-plugin-prettier`). Scripts: `npm run lint` (eslint), `npm run format` (prettier --write), `npm run format:check` (prettier --check). FOUND-05 "lint passes" gate is `npm run lint && npm run format:check`.
- **D-17:** Prettier config (`.prettierrc.json`): `printWidth: 100`, `tabWidth: 4`, `useTabs: false`, `semi: true`, `singleQuote: true`, `trailingComma: "all"`, `bracketSameLine: false`, `arrowParens: "always"`. Plugins: `prettier-plugin-astro`, `prettier-plugin-tailwindcss` (last).
- **D-18:** Ignore lists. ESLint `ignores`: `dist/`, `node_modules/`, `.astro/`, `coverage/`, `.planning/`, `.claude/`. Prettier `.prettierignore`: same set. Protects markdown planning artifacts and GSD workflow files from accidental reformat.
- **D-19:** Enforcement layers — (a) CI gate: `npm run lint && npm run format:check && npx astro check && npm test`. (b) Pre-commit via husky + lint-staged runs ESLint --fix + Prettier --write on staged files. (c) No `.vscode/extensions.json` requirement in Phase 1.
- **D-20:** Commit-message convention is Conventional Commits, documented in `CONTRIBUTING.md` (or appended to `.claude/CLAUDE.md`), NOT enforced via commitlint.

**Smoke Test Mechanics**
- **D-21:** Vitest config spawns `astro build` once in `globalSetup`. If it exits non-zero, globalSetup throws → entire suite fails. Satisfies ROADMAP Phase 1 SC #3 implicitly — no separate inversion test needed.
- **D-22:** The hydration fixture page is part of the same `astro build` — one build, multiple assertions.
- **D-23:** Smoke test assertions (minimum viable):
  1. `dist/index.html` exists.
  2. `dist/index.html` contains all 8 section ids (`about`, `education`, `work`, `skills`, `projects`, `leadership`, `testimonials`, `sidenav`).
  3. `dist/__hydration-test/index.html` exists.
  4. `dist/_astro/` contains at least one `.js` chunk (proves React hydration shipped for the fixture island).
  5. `dist/_astro/*.css` contains the Tailwind test-marker utility.
- **D-24:** Tests live at `tests/smoke.test.ts` (NOT under `src/`). `vitest.config.ts` at repo root.
- **D-25:** `.github/workflows/ci.yml` added in Phase 1, triggers on PR + push to `main`. Steps: `npm ci`, `npm run lint`, `npm run format:check`, `npx astro check`, `npm test`. SEPARATE from the Phase 5 `deploy.yml`; both workflows coexist after Phase 5 ships.

### Claude's Discretion

- Exact Vitest version (3.x or 4.x) and whether to use `execa` vs `child_process` for the subprocess spawn — planner picks.
- Whether to use `prettier-plugin-organize-imports` in addition to `prettier-plugin-tailwindcss` — planner picks based on import-sort behavior.
- Exact husky + lint-staged setup commands and config syntax — planner picks current best-practice.
- Naming of the Tailwind test-marker utility (`text-[#abc123]` is illustrative).
- Whether `package.json` `engines.node` is pinned (Node 22 LTS is locked in PROJECT.md constraints).

### Deferred Ideas (OUT OF SCOPE)

**Phase 2 (Content Layer)** — Read source from `.planning/snapshots/m1-source/resumeData.json`. Fill `src/content.config.ts` with Zod schemas for all 8 collections.

**Phase 3 (Sections & Navigation / Style)** — STYLE-04 fill `@theme` with brand tokens. STYLE-05 fonts decision. Section stubs filled with real markup. Project images moved into `src/content/projects/`.

**Phase 4 (SEO, A11Y & Meta Polish)** — SEO-01 BaseHead OG/Twitter/canonical. SEO-06 sitemap. SEO-07 OG image. Favicons + manifest. A11Y-04 active nav state.

**Phase 5 (Cleanup & Deploy)** — DEPLOY sequencing: switch GitHub Pages source from branch-deploy → Actions MUST precede delete `gh-pages` branch (both follow first successful Actions deploy). Flip GitHub default branch to `main`. Delete `.planning/snapshots/m1-source/`. Consider deleting hydration fixture.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Astro 6 (current stable) configured for static output to `dist/` | Verified `astro@6.3.8` is current stable (npm registry, 2026-05-26). `output: 'static'` in `astro.config.mjs` (Standard Stack table). |
| FOUND-02 | TypeScript 5 with `strict: true`; `astro check` passes with zero errors | tsconfig extends `astro/tsconfigs/strictest` per D-10 (verified flag set via GitHub; adds 9 stricter flags on top of `strict`). `@astrojs/check@0.9.9` provides the CLI. |
| FOUND-03 | Tailwind v4 via `@tailwindcss/vite` (NOT `@astrojs/tailwind`); single `src/styles/global.css` with `@theme` | Verified `tailwindcss@4.3.0` + `@tailwindcss/vite@4.3.0`. Setup pattern in Pattern 2. Pitfall 29 mitigation via D-12 marker. |
| FOUND-04 | `@astrojs/react` installed; React 19 island hydrates from `client:*` | Verified `@astrojs/react@5.0.5` peer range includes `^19.0.0`. Hydration fixture pattern in Pattern 4. |
| FOUND-05 | ESLint 9 (flat config) + Prettier configured for `.astro`, `.ts`, `.tsx`, `.md`; `npm run lint` passes | ESLint 9.38.x is the correct major (10 blocked by jsx-a11y peer). Flat config in Pattern 5. Prettier config in Pattern 6. |
| FOUND-06 | Vitest 3 configured; smoke test spawns `astro build` and asserts 8 section markers | Per D-21..D-25. Vitest 4 is available but 3.x is also viable; planner picks. globalSetup pattern in Pattern 7. |
| FOUND-07 | Single npm lockfile; `yarn.lock` removed | `git rm yarn.lock` step. `npm ls react react-dom @astrojs/react` clean check. |
| FOUND-08 | `astro.config.mjs` sets `site: 'https://Rashmil-1999.github.io'`, `output: 'static'`, no `base` | Pattern 1 (Astro config). Pitfall 10 documents the `base` footgun. |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Static page rendering (8 section stubs) | Build (Astro SSG) | — | Zero interactivity in Phase 1; pure compile-time HTML. |
| React 19 hydration verification fixture | Browser (Client island) | Build (SSR shell) | Test that `client:load` works end-to-end through `astro build`; the React JS chunk is verified in `dist/_astro/`. |
| Style compilation (Tailwind v4) | Build (Vite plugin) | — | `@tailwindcss/vite` runs during Vite's build phase; emits CSS into `dist/_astro/`. No runtime JS. |
| Type checking | Build (CLI) | Editor (IDE) | `astro check` (uses `@astrojs/check`) runs in CI; same engine surfaces hovers in VS Code. |
| Lint / format | Build (CLI) + Git hook | Editor | ESLint + Prettier run via `npm run lint` / `format:check` and as pre-commit via husky+lint-staged. |
| Smoke test | Build (Vitest globalSetup spawns `astro build`) | — | Test framework is Node-side; spawns the build as a subprocess and asserts on `dist/` artifacts. |
| CI gate | CI runner (GitHub Actions) | — | `.github/workflows/ci.yml` runs the four gates: lint, format:check, astro check, vitest. Independent of deploy.yml (Phase 5). |
| Branch + repo state | Git / GitHub | — | `master` → `main` rename. `.claude/` survives wipe (D-05). `public/CNAME` deleted (D-06). Snapshot to `.planning/snapshots/m1-source/`. |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **astro** | `6.3.8` | Static site generator with islands architecture | [VERIFIED: npm registry, published 2026-05-26]. Current stable; PROJECT.md constraints lock Astro 6. Engines `node: >=22.12.0`. |
| **@astrojs/react** | `5.0.5` | React island integration (React 19 ready) | [VERIFIED: npm registry]. peer range `^17 \|\| ^18 \|\| ^19` confirmed via `npm view`. |
| **react** | `19.2.6` | React runtime for islands | [CITED: prior research `.planning/research/STACK.md` verified 2026-05-26]. Must match `react-dom` major. |
| **react-dom** | `19.2.6` | DOM bindings | [CITED: prior research]. Pin both at same major. |
| **@types/react** | `^19` | React 19 types | [VERIFIED: peer range of @astrojs/react@5.0.5]. |
| **@types/react-dom** | `^19` | React-DOM types | [VERIFIED: peer range of @astrojs/react@5.0.5]. |
| **typescript** | `^5.9` | Type system (resolved by Astro) | [VERIFIED: @astrojs/check@0.9.9 peer is `^5.0.0 \|\| ^6.0.0`]. tsconfig extends `astro/tsconfigs/strictest`. |
| **@astrojs/check** | `0.9.9` | `astro check` CLI implementation | [VERIFIED: npm registry]. Required for FOUND-02. |
| **tailwindcss** | `4.3.0` | Utility-first CSS engine | [VERIFIED: npm registry, 2026-05-26]. v4 CSS-first config. |
| **@tailwindcss/vite** | `4.3.0` | Tailwind v4 Vite integration | [VERIFIED: npm registry]. Replaces deprecated `@astrojs/tailwind` (v3-only, last published 2024-09). |

### Supporting (Phase 1)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **vitest** | `^3.2` or `^4.3` | Test runner | Phase 1 ships one smoke test. Vitest 4 is current (4.3.0); 3.x is still maintained. `getViteConfig()` from `astro/config` shares Astro's Vite pipeline. **Recommendation:** Vitest 4.3.x — current major, identical config surface for our use. |
| **eslint** | `^9.38.0` | Linter | [VERIFIED]. **MUST be ESLint 9, not 10** — `eslint-plugin-jsx-a11y@6.10.2` peer range tops out at `^9` (verified via `npm view`). ESLint 10 was released 2026-02 but jsx-a11y hasn't bumped its peer. |
| **@eslint/js** | `^9.38.0` | ESLint JS recommended preset | [VERIFIED: 9.38.0]. Used in flat config. |
| **typescript-eslint** | `^8.60.0` | TS rules + parser for flat config | [VERIFIED: npm registry]. peer range `eslint ^8.57.0 \|\| ^9.0.0 \|\| ^10.0.0` — supports 9 and 10. Use `tseslint.config(...)` helper. |
| **eslint-plugin-astro** | `^1.7.0` | Lint `.astro` files | [VERIFIED: npm registry]. peer `eslint >=8.57.0`. Ships flat-config preset `astro.configs.recommended`. |
| **eslint-plugin-jsx-a11y** | `^6.10.2` | A11y lint rules for JSX (scoped to `**/*.tsx`) | [VERIFIED: npm registry]. **peer `^3 \|\| … \|\| ^9` — caps ESLint at 9.** Use `jsxA11y.flatConfigs.recommended`. |
| **eslint-config-prettier** | `^10.1.8` | Disable stylistic ESLint rules conflicting with Prettier | [VERIFIED: npm registry]. peer `eslint >=7.0.0`. MUST be last in flat config array. |
| **globals** | `^17.6.0` | Browser/Node global definitions | [VERIFIED: npm registry]. Used in `languageOptions.globals`. |
| **prettier** | `^3.8.3` | Code formatter | [VERIFIED: npm registry]. v3+ required for prettier-plugin-tailwindcss v0.6+. |
| **prettier-plugin-astro** | `^0.14.1` | Astro file formatter | [VERIFIED: npm registry]. |
| **prettier-plugin-tailwindcss** | `^0.8.0` | Class auto-sort | [VERIFIED: npm registry]. MUST be last plugin in `plugins` array. Supports Tailwind v4 via `tailwindStylesheet` option. |
| **husky** | `^9.1.7` | Git hooks | [VERIFIED: npm registry]. v9 init pattern: `npx husky init` creates `.husky/pre-commit` + adds `prepare` script. engines node >=18. |
| **lint-staged** | `^17.0.5` | Run linters on staged files | [VERIFIED: npm registry]. engines `node >=22.22.1` (Node 23.9.0 in dev env — OK). |
| **eslint-plugin-react-hooks** | `^7.1.1` | Hook lint rules | [VERIFIED]. Optional but cheap insurance; useful when hydration fixture or future islands use hooks. |

### Phase 1 Does NOT Install (deferred to later phases)

| Library | Phase | Reason |
|---------|-------|--------|
| `astro-icon`, `@iconify-json/*` | Phase 3 (STYLE-02) | No icons used in Phase 1 stubs. |
| `@astrojs/sitemap` | Phase 4 (SEO-06) | Sitemap not in Phase 1 scope. |
| `sharp` | Transitive | Astro 6 pulls it in; explicit install unnecessary in Phase 1 (no images optimized yet). |
| `@testing-library/*`, `jsdom` | Phase 2+ | Smoke test only spawns `astro build`; no DOM testing in Phase 1. |
| `prettier-plugin-organize-imports` | Optional / Phase 2+ | Discretion item D-15..20; can be added later. |
| `commitlint` | Never (M1) | D-20: Conventional Commits documented not enforced. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Astro 6.3.8 | Astro 5.18.2 | PROJECT.md historically said "Astro 5"; Astro 6 was added during pre-Phase-1 research. Same integrations work on both. STATE.md decisions table locks Astro 6. |
| `@tailwindcss/vite` | `@astrojs/tailwind` | `@astrojs/tailwind` is Tailwind **v3 only**; last published 2024-09. Not viable for v4. |
| Vitest 4.3.x | Vitest 3.2.x | Both work via `getViteConfig()`. Vitest 4 is the current major and recommended. |
| ESLint 9.38.x | ESLint 10.x | **BLOCKED**: `eslint-plugin-jsx-a11y@6.10.2` peer caps at `^9`. ESLint 10 was released Feb 2026 but plugin ecosystem hasn't fully caught up. |
| `child_process.spawnSync` | `execa` | `spawnSync` is built-in (no dep); `execa` has nicer ergonomics. Both work. **Recommend `child_process.spawnSync` from `node:child_process`** — zero extra deps, sufficient for one subprocess. |
| husky v9 + lint-staged | `simple-git-hooks` + `nano-staged` | Smaller install footprint but less common. Stick with husky+lint-staged — it's the industry-standard pair and CONTEXT.md D-19 names them. |
| `prettier-plugin-organize-imports` | Skip | Use only if import disorder becomes visible noise in PRs. Default to skipping for Phase 1; planner can add later. |

### Installation Command (planner orders these)

```bash
# After greenfield wipe + Astro scaffold via `npm create astro@latest`:

# Astro integrations (each modifies astro.config.mjs)
npx astro add react
npx astro add tailwind   # adds @tailwindcss/vite (NOT @astrojs/tailwind)

# Test runner
npm install -D vitest

# Lint stack (ESLint 9, NOT 10)
npm install -D \
  eslint@^9.38 \
  @eslint/js@^9.38 \
  typescript-eslint@^8.60 \
  eslint-plugin-astro@^1.7 \
  eslint-plugin-jsx-a11y@^6.10 \
  eslint-config-prettier@^10.1 \
  globals@^17 \
  eslint-plugin-react-hooks@^7.1

# Formatter
npm install -D \
  prettier@^3.8 \
  prettier-plugin-astro@^0.14 \
  prettier-plugin-tailwindcss@^0.8

# Git hooks
npm install -D husky@^9 lint-staged@^17
npx husky init   # creates .husky/pre-commit, adds prepare script
```

**Version verification:** All packages above verified live against npm registry via `npm view <pkg> version peerDependencies engines` on 2026-05-26.

## Package Legitimacy Audit

> slopcheck was run against the full Phase 1 install set on 2026-05-26 via `slopcheck install astro @astrojs/react @astrojs/check react react-dom @types/react @types/react-dom tailwindcss @tailwindcss/vite vitest eslint @eslint/js typescript-eslint eslint-plugin-astro eslint-plugin-jsx-a11y eslint-config-prettier globals prettier prettier-plugin-astro prettier-plugin-tailwindcss husky lint-staged typescript`. slopcheck blocks SLOP packages from installing — the install succeeded, meaning every listed package passed the registry/age/downloads checks. No package was flagged `[SLOP]` or `[SUS]`. Postinstall hooks were independently checked via `npm view <pkg> scripts.postinstall` for the most critical packages (astro, @tailwindcss/vite, husky, vitest) — all empty.

| Package | Registry | Age (approx) | slopcheck | Disposition |
|---------|----------|-------------|-----------|-------------|
| astro | npm | 5+ years | OK | Approved |
| @astrojs/react | npm | 4+ years | OK | Approved |
| @astrojs/check | npm | 2+ years | OK | Approved |
| react | npm | 12+ years | OK | Approved |
| react-dom | npm | 12+ years | OK | Approved |
| @types/react | npm | 9+ years | OK | Approved |
| @types/react-dom | npm | 9+ years | OK | Approved |
| tailwindcss | npm | 8+ years | OK | Approved |
| @tailwindcss/vite | npm | 1+ year (v4-era) | OK | Approved |
| vitest | npm | 4+ years | OK | Approved |
| eslint | npm | 12+ years | OK | Approved |
| @eslint/js | npm | 2+ years | OK | Approved |
| typescript-eslint | npm | 1+ year (umbrella pkg) | OK | Approved |
| eslint-plugin-astro | npm | 3+ years | OK | Approved |
| eslint-plugin-jsx-a11y | npm | 9+ years | OK | Approved |
| eslint-config-prettier | npm | 9+ years | OK | Approved |
| globals | npm | 11+ years | OK | Approved |
| prettier | npm | 8+ years | OK | Approved |
| prettier-plugin-astro | npm | 3+ years | OK | Approved |
| prettier-plugin-tailwindcss | npm | 4+ years | OK | Approved |
| husky | npm | 11+ years | OK | Approved |
| lint-staged | npm | 10+ years | OK | Approved |
| typescript | npm | 13+ years | OK | Approved |
| eslint-plugin-react-hooks | npm | 6+ years | OK | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```
                       ┌──────────────────────────┐
                       │  Pre-Wipe Snapshot       │
                       │  .planning/snapshots/    │
                       │    m1-source/            │
                       │  (resumeData.json,       │
                       │   src/assets/*,          │
                       │   public/favicon*)       │
                       └────────────┬─────────────┘
                                    │ (Phase 2/3 read)
                                    │
   git branch master → main         │
        │                           │
        ▼                           │
   ┌─────────────────┐              │
   │  Greenfield     │              │
   │  Wipe           │   ◄──────────┘ (Phase 1 work happens AFTER snapshot)
   │  (src/ public/  │
   │   except PDF)   │
   └────────┬────────┘
            │
            ▼
   ┌────────────────────────────────────────────────────┐
   │                Astro 6 Scaffold                    │
   │                                                    │
   │   astro.config.mjs ── integrations: [react()]      │
   │                    ── vite: { plugins:             │
   │                                  [tailwindcss()] } │
   │                    ── site: 'https://Rashmil-1999  │
   │                              .github.io'           │
   │                    ── output: 'static'             │
   │                    ── (no base)                    │
   │                                                    │
   │   src/                                             │
   │     pages/                                         │
   │       index.astro          ← 8 section stubs       │
   │       __hydration-test.astro  ← React fixture page │
   │     layouts/                                       │
   │       BaseLayout.astro     ← minimal head + slot   │
   │     components/                                    │
   │       BaseHead.astro       ← stubbed               │
   │       SideNav.astro                                │
   │       About.astro                                  │
   │       Education.astro       (8 empty section       │
   │       Work.astro            stubs — Phase 3        │
   │       Skills.astro          fills these)           │
   │       Projects.astro                               │
   │       Leadership.astro                             │
   │       Testimonials.astro                           │
   │     styles/                                        │
   │       global.css           ← @import "tailwindcss" │
   │                              + empty @theme{}      │
   │     content.config.ts      ← empty placeholder     │
   │     assets/                ← empty dir             │
   │                                                    │
   │   public/                                          │
   │     Rashmil_Panchani.pdf   ← only survivor         │
   │                                                    │
   │   tests/                                           │
   │     smoke.test.ts          ← reads dist/           │
   │     __fixtures__/                                  │
   │       HydrationCheck.tsx   ← React island fixture  │
   │                                                    │
   │   vitest.config.ts         ← globalSetup spawns    │
   │                              `astro build`         │
   │                                                    │
   │   eslint.config.js         ← ESLint 9 flat         │
   │   .prettierrc.json                                 │
   │   .prettierignore                                  │
   │   tsconfig.json            ← extends strictest     │
   │                                                    │
   │   package.json             ← scripts: dev, build,  │
   │                              preview, lint,        │
   │                              format, format:check, │
   │                              test                  │
   │   package-lock.json        ← ONLY lockfile         │
   │   (yarn.lock DELETED)                              │
   │                                                    │
   │   .github/workflows/                               │
   │     ci.yml                 ← lint + format:check + │
   │                              astro check + test    │
   │                                                    │
   │   .husky/                                          │
   │     pre-commit             ← npx lint-staged       │
   │                                                    │
   │   .claude/                 ← UNTOUCHED             │
   └────────────────────┬───────────────────────────────┘
                        │
                        │ `npm run build` produces:
                        ▼
   ┌─────────────────────────────────────────────────┐
   │ dist/                                           │
   │   index.html              ← 8 section ids       │
   │   __hydration-test/                             │
   │     index.html            ← hydration page      │
   │   _astro/                                       │
   │     *.css                 ← Tailwind output     │
   │                             (contains marker)   │
   │     *.js                  ← React hydration     │
   │                             chunk               │
   │   Rashmil_Panchani.pdf    ← passthrough         │
   └─────────────────────────────────────────────────┘
                        │
                        │ `npm test` (Vitest globalSetup spawns
                        ▼               `astro build`, then 5 assertions)
   ┌─────────────────────────────────────────────────┐
   │ tests/smoke.test.ts runs:                       │
   │   1. dist/index.html exists                     │
   │   2. 8 section ids found                        │
   │   3. dist/__hydration-test/index.html exists    │
   │   4. dist/_astro/*.js contains React chunk      │
   │   5. dist/_astro/*.css contains marker          │
   └─────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
.
├── .claude/                     # Preserved through wipe (D-05)
├── .planning/                   # Preserved (planning artifacts)
│   ├── snapshots/m1-source/     # Created during Phase 1 (D-03)
│   └── ...
├── .github/
│   └── workflows/
│       └── ci.yml               # D-25: 4-step gate
├── .husky/
│   └── pre-commit               # `npx lint-staged`
├── src/
│   ├── assets/                  # Empty (ready for Phase 3)
│   ├── components/
│   │   ├── BaseHead.astro
│   │   ├── SideNav.astro
│   │   ├── About.astro
│   │   ├── Education.astro
│   │   ├── Work.astro
│   │   ├── Skills.astro
│   │   ├── Projects.astro
│   │   ├── Leadership.astro
│   │   └── Testimonials.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── __hydration-test.astro
│   ├── styles/
│   │   └── global.css
│   └── content.config.ts        # Empty placeholder
├── tests/
│   ├── smoke.test.ts
│   └── __fixtures__/
│       └── HydrationCheck.tsx
├── public/
│   └── Rashmil_Panchani.pdf
├── astro.config.mjs
├── eslint.config.js
├── .prettierrc.json
├── .prettierignore
├── tsconfig.json
├── vitest.config.ts
├── package.json
└── package-lock.json            # ONLY lockfile (yarn.lock deleted)
```

### Pattern 1: `astro.config.mjs`

**What:** Root Astro configuration. Wires React + Tailwind v4 + sets the canonical site URL.
**When to use:** Once per project at scaffold time.
**Example:**

```js
// astro.config.mjs
// Source: docs.astro.build/en/reference/configuration-reference/
//         tailwindcss.com/docs/installation/framework-guides/astro
//         (and CONTEXT.md D-13)

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    site: 'https://Rashmil-1999.github.io',
    // No `base` set — this is a user-site repo, served at /.
    // Setting `base` here is the #1 Astro-on-GH-Pages footgun (Pitfall 10).
    output: 'static',
    integrations: [react()],
    vite: {
        plugins: [tailwindcss()],
    },
});
```

### Pattern 2: `src/styles/global.css` + `src/layouts/BaseLayout.astro`

**What:** Tailwind v4 CSS entry + how it's loaded into every page.
**When to use:** Once. Imported by BaseLayout so every page picks it up.
**Example:**

```css
/* src/styles/global.css */
/* Source: tailwindcss.com/docs/installation/framework-guides/astro
            and CONTEXT.md D-14 */

@import "tailwindcss";

@theme {
    /* TODO Phase 3 (STYLE-04) — brand tokens (colors, fonts, spacing) */
}
```

```astro
---
// src/layouts/BaseLayout.astro
// Source: docs.astro.build/en/basics/layouts/
// CONTEXT.md D-13: minimal head, no OG/Twitter/canonical in Phase 1.

import BaseHead from '../components/BaseHead.astro';
import '../styles/global.css';

interface Props {
    title: string;
}

const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
    <head>
        <BaseHead title={title} />
    </head>
    <body>
        <slot />
    </body>
</html>
```

```astro
---
// src/components/BaseHead.astro
// CONTEXT.md D-13: charset, viewport, title, favicon link, two preconnects.
// Phase 4 SEO-01 fills the rest (OG, Twitter, canonical, description).

interface Props {
    title: string;
}

const { title } = Astro.props;
---
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<link rel="icon" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### Pattern 3: 8 Empty Section Stubs + Tailwind Marker

**What:** Each section is an `.astro` file rendering an empty `<section id="...">`. Exactly one of them carries the Tailwind utility marker (e.g., `text-[#abc123]`) so the smoke test can verify Pitfall 29 mitigation.
**When to use:** Per CONTEXT.md D-07, D-08, D-12. Phase 3 fills these in place.
**Example (one of eight — applied to About.astro to carry the marker):**

```astro
---
// src/components/About.astro
// CONTEXT.md D-08: empty <section> stub. Phase 3 fills with real content.
// CONTEXT.md D-12: this component carries the Tailwind marker utility.
---
<section id="about" class="text-[#abc123]"></section>
```

```astro
---
// src/components/Education.astro
---
<section id="education"></section>
```

(Repeat for: Work, Skills, Projects, Leadership, Testimonials, SideNav. Only one needs the marker class.)

```astro
---
// src/pages/index.astro
// CONTEXT.md D-07: composes 8 stubs in current site order.

import BaseLayout from '../layouts/BaseLayout.astro';
import SideNav from '../components/SideNav.astro';
import About from '../components/About.astro';
import Education from '../components/Education.astro';
import Work from '../components/Work.astro';
import Skills from '../components/Skills.astro';
import Projects from '../components/Projects.astro';
import Leadership from '../components/Leadership.astro';
import Testimonials from '../components/Testimonials.astro';
---
<BaseLayout title="Rashmil Panchani">
    <SideNav />
    <main>
        <About />
        <Education />
        <Work />
        <Skills />
        <Projects />
        <Leadership />
        <Testimonials />
    </main>
</BaseLayout>
```

### Pattern 4: React 19 Hydration Fixture

**What:** A React island fixture and the Astro page that mounts it, proving React 19 hydration works end-to-end.
**When to use:** Per CONTEXT.md D-09. Smoke test asserts the React chunk lands in `dist/_astro/`.
**Example:**

```tsx
// tests/__fixtures__/HydrationCheck.tsx
// Source: react.dev/reference/react/useState
// A trivial React 19 island. Any state update proves hydration.

import { useState } from 'react';

export default function HydrationCheck() {
    const [n, setN] = useState(0);
    return (
        <button type="button" onClick={() => setN(n + 1)} data-testid="hydration-check">
            Hydration count: {n}
        </button>
    );
}
```

```astro
---
// src/pages/__hydration-test.astro
// CONTEXT.md D-09: hydration fixture page shipped in same build.
// Phase 5 may remove this (deferred).

import BaseLayout from '../layouts/BaseLayout.astro';
import HydrationCheck from '../../tests/__fixtures__/HydrationCheck.tsx';
---
<BaseLayout title="Hydration test">
    <HydrationCheck client:load />
</BaseLayout>
```

**Why `client:load`:** This is the throwaway *verification* island. We want unambiguous proof the React JS chunk ships and hydrates immediately. `client:visible` would technically work but adds IntersectionObserver indirection to the test. In production code (Phase 3+), Pitfall 5 says default to no directive; here we deliberately use `client:load` so the test is deterministic.

### Pattern 5: ESLint 9 Flat Config

**What:** `eslint.config.js` composing the four required presets in the order locked by CONTEXT.md D-15.
**When to use:** Once at repo root.
**Example:**

```js
// eslint.config.js
// Source: eslint.org/docs/latest/use/configure/configuration-files
//         typescript-eslint.io/getting-started
//         github.com/ota-meshi/eslint-plugin-astro
//         github.com/jsx-eslint/eslint-plugin-jsx-a11y (flatConfigs.recommended)
// CONTEXT.md D-15, D-18.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
    {
        ignores: [
            'dist/',
            'node_modules/',
            '.astro/',
            'coverage/',
            '.planning/',
            '.claude/',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        // Type-checked rules need a parserOptions.project setting.
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: { ...globals.browser, ...globals.node },
        },
    },
    ...astro.configs.recommended,
    {
        // a11y rules only apply to JSX/TSX, NOT .astro files (CONTEXT.md D-15).
        files: ['**/*.{jsx,tsx}'],
        plugins: { 'jsx-a11y': jsxA11y, 'react-hooks': reactHooks },
        rules: {
            ...jsxA11y.flatConfigs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
        },
    },
    prettier, // MUST be last — turns off stylistic conflicts with Prettier.
);
```

**Notes:**
- `recommendedTypeChecked` requires `parserOptions.project: true`. This works fine for `.ts`/`.tsx`; for `.astro` files `eslint-plugin-astro` ships its own parser that handles the frontmatter type-checking.
- `astro.configs.recommended` is an array (spread it).
- `jsx-a11y` is scoped via `files: ['**/*.{jsx,tsx}']` per D-15.
- `prettier` MUST be the last entry.

### Pattern 6: Prettier Config

**What:** `.prettierrc.json` matching CONTEXT.md D-17.
**When to use:** Once at repo root.
**Example:**

```json
{
    "printWidth": 100,
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "all",
    "bracketSameLine": false,
    "arrowParens": "always",
    "plugins": [
        "prettier-plugin-astro",
        "prettier-plugin-tailwindcss"
    ],
    "overrides": [
        {
            "files": "*.astro",
            "options": { "parser": "astro" }
        }
    ]
}
```

**Critical:** `prettier-plugin-tailwindcss` MUST be the LAST plugin (verified via tailwindlabs docs). For Tailwind v4, optionally add `"tailwindStylesheet": "./src/styles/global.css"` to the top-level config so the plugin can resolve `@theme` definitions.

```
# .prettierignore
dist/
node_modules/
.astro/
coverage/
.planning/
.claude/
package-lock.json
```

### Pattern 7: Vitest globalSetup that spawns `astro build`

**What:** `vitest.config.ts` reuses Astro's Vite resolution and runs `astro build` exactly once before any test files execute.
**When to use:** Once. CONTEXT.md D-21..D-24.
**Example:**

```ts
// vitest.config.ts
// Source: vitest.dev/config/globalsetup
// CONTEXT.md D-21, D-24.

import { getViteConfig } from 'astro/config';

export default getViteConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        globalSetup: ['./tests/global-setup.ts'],
    },
});
```

```ts
// tests/global-setup.ts
// Spawns `astro build` ONCE before any test file runs.
// If build fails (non-zero exit), THIS THROWS → entire test suite fails.
// Satisfies SC #3 implicitly: a broken build kills the test suite.

import { spawnSync } from 'node:child_process';

export default function setup() {
    const result = spawnSync('npx', ['astro', 'build'], {
        stdio: 'inherit',
        env: process.env,
    });
    if (result.status !== 0) {
        throw new Error(
            `astro build exited with status ${result.status} — smoke test aborted.`,
        );
    }
    // No teardown — `dist/` is left in place for inspection.
}
```

```ts
// tests/smoke.test.ts
// CONTEXT.md D-23: five assertions against dist/.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIST = join(process.cwd(), 'dist');

const sectionIds = [
    'sidenav',
    'about',
    'education',
    'work',
    'skills',
    'projects',
    'leadership',
    'testimonials',
];

describe('Phase 1 smoke', () => {
    it('emits dist/index.html', () => {
        expect(existsSync(join(DIST, 'index.html'))).toBe(true);
    });

    it('dist/index.html contains all 8 section ids', () => {
        const html = readFileSync(join(DIST, 'index.html'), 'utf8');
        for (const id of sectionIds) {
            expect(html).toContain(`id="${id}"`);
        }
    });

    it('emits dist/__hydration-test/index.html', () => {
        expect(existsSync(join(DIST, '__hydration-test', 'index.html'))).toBe(true);
    });

    it('emits a React JS chunk in dist/_astro/', () => {
        const astroDir = join(DIST, '_astro');
        const files = readdirSync(astroDir);
        const jsChunks = files.filter((f) => f.endsWith('.js'));
        expect(jsChunks.length).toBeGreaterThan(0);
    });

    it('emits the Tailwind marker utility in dist/_astro/*.css', () => {
        // CONTEXT.md D-12: Pitfall 29 mitigation.
        const astroDir = join(DIST, '_astro');
        const cssFiles = readdirSync(astroDir).filter((f) => f.endsWith('.css'));
        const cssBlob = cssFiles
            .map((f) => readFileSync(join(astroDir, f), 'utf8'))
            .join('\n');
        // The marker class `text-[#abc123]` compiles to `color: #abc123` in v4.
        expect(cssBlob).toMatch(/#abc123/i);
    });
});
```

### Pattern 8: `tsconfig.json` extending strictest

**What:** Tightest TypeScript preset Astro ships.
**When to use:** Once. CONTEXT.md D-10.
**Example:**

```json
{
    "extends": "astro/tsconfigs/strictest",
    "include": [".astro/types.d.ts", "**/*"],
    "exclude": ["dist", "node_modules"]
}
```

**What `astro/tsconfigs/strictest` adds on top of `strict: true`** (verified via GitHub source on 2026-05-26):
- `noFallthroughCasesInSwitch`
- `noImplicitOverride`
- `noImplicitReturns`
- `noUnusedLocals`
- `noUnusedParameters`
- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- `allowUnreachableCode: false`
- `allowUnusedLabels: false`

**Implication for Phase 1:** Empty section stubs and the hydration fixture must compile clean under all 9 flags. `noUnusedLocals`/`noUnusedParameters` mean every `import` and prop must be used. CONTEXT.md D-10 already calls this out as a forward constraint for Phase 2 content code.

### Pattern 9: husky v9 + lint-staged

**What:** Pre-commit hook that runs ESLint --fix + Prettier --write on staged files.
**When to use:** Once. CONTEXT.md D-19.
**Setup:**

```bash
# After installing husky + lint-staged:
npx husky init    # Creates .husky/pre-commit (contains `npm test` by default)
                  # AND adds `"prepare": "husky"` to package.json scripts.
```

```sh
# .husky/pre-commit
# Replace the default `npm test` with lint-staged.
npx lint-staged
```

```json
// package.json (additive)
{
    "scripts": {
        "prepare": "husky",
        "dev": "astro dev",
        "build": "astro build",
        "preview": "astro preview",
        "lint": "eslint .",
        "format": "prettier --write .",
        "format:check": "prettier --check .",
        "test": "vitest run"
    },
    "lint-staged": {
        "*.{ts,tsx,astro,js,jsx}": [
            "eslint --fix",
            "prettier --write"
        ],
        "*.{md,json,yml,yaml,css}": [
            "prettier --write"
        ]
    }
}
```

**Notes:**
- husky v9's `init` no longer requires the `_/husky.sh` shebang line — the modern hook is just a plain shell script.
- `lint-staged` requires Node ≥22.22.1 (engines field). Dev env (Node 23.9.0) is fine; CI runner must use Node 22.13+ — easy via `actions/setup-node@v4` with `node-version: '22'`.

### Pattern 10: GitHub Actions `ci.yml`

**What:** The four-step gate, separate from Phase 5's deploy workflow.
**When to use:** Once. CONTEXT.md D-25.
**Example:**

```yaml
# .github/workflows/ci.yml
# Source: docs.github.com/en/actions/quickstart
#         github.com/actions/setup-node
# CONTEXT.md D-25.

name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
      - run: npx astro check
      - run: npm test
```

**Notes:**
- No `permissions:` block needed — CI is read-only. Phase 5's `deploy.yml` adds `pages: write` + `id-token: write` (Pitfall 12).
- `npm ci` enforces the single-lockfile constraint (will fail if `yarn.lock` accidentally returns).

### Anti-Patterns to Avoid

- **`@astrojs/tailwind` integration:** v3-only, last published 2024-09. Use `@tailwindcss/vite` (Pitfall 29; STATE.md decision).
- **`tailwind.config.js`:** Not needed in v4 — CSS-first `@theme {}` block replaces it (Pitfall 13).
- **Setting `base` in `astro.config.mjs`:** User-site repo serves at root `/` — setting `base: '/Rashmil-1999.github.io/'` doubles the URL (Pitfall 10).
- **`<StrictMode>` wrapping in the hydration fixture:** Carries forward the CRA `<StrictMode>` placement anti-pattern. Astro islands don't need it (Pitfall 18).
- **`client:load` defaulted everywhere:** Reserve for genuinely-critical interactivity. Phase 1 uses it intentionally on the hydration fixture ONLY (Pitfall 5).
- **Render-time tests instead of build-time:** Importing a component and asserting it renders doesn't catch schema/config bugs — the test MUST spawn `astro build` (Pitfall 30).
- **`eslint-plugin-prettier`:** D-16 explicitly excludes this. Prettier runs separately via `npm run format:check`.
- **Adding `<ClientRouter />` (View Transitions):** Out of scope per PROJECT.md; single-page anchor-nav site gains nothing (Pitfall 8).
- **Re-introducing `public/CNAME`:** Custom domain expired (D-06; Pitfall 24).
- **Hand-rolled `tailwind.content` paths via `@source`:** The Vite plugin auto-detects sources. If utilities go missing for `.astro` files, only THEN reach for `@source "../**/*.{astro,html,ts,tsx}";` in `global.css` (Pitfall 29 escalation path).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Astro + React 19 integration setup | Custom Vite plugin config | `npx astro add react` | Modifies `astro.config.mjs` + `tsconfig.json` + installs correct peer versions in one shot. |
| Tailwind v4 + Astro integration | Manual PostCSS pipeline | `npx astro add tailwind` (installs `@tailwindcss/vite`) | Astro 5.2+ correctly scaffolds v4 via the Vite plugin route. |
| Subprocess spawn for `astro build` | Custom async wrapper / shell-out | `node:child_process` `spawnSync` | One subprocess, one exit code, no need for `execa`. Built-in. |
| Pre-commit hook script | Hand-written git hook | `npx husky init` + `lint-staged` config in package.json | husky v9's `init` does the right thing — the modern hook is a one-liner. |
| ESLint rule conflict resolution with Prettier | Manual rule overrides | `eslint-config-prettier` (last entry in flat config) | Disables every stylistic ESLint rule Prettier owns. Maintained by the Prettier team. |
| Class-sort logic | Custom Prettier override | `prettier-plugin-tailwindcss` (last plugin) | Authoritative Tailwind class ordering; v0.8.0 supports v4. |
| TypeScript strictest preset | Manually enabling 9 compiler flags | `extends: "astro/tsconfigs/strictest"` | Astro maintains the preset; track them, not us. |
| Tailwind content scanner config | Hand-written `@source` globs | Default automatic detection in `@tailwindcss/vite` | Vite plugin scans Astro-aware files automatically. Add `@source` ONLY if Pitfall 29 manifests. |
| GitHub Actions Node + npm cache | Custom cache logic | `actions/setup-node@v4` with `cache: 'npm'` | Battle-tested; auto-keys on `package-lock.json`. |
| React 19 hydration verification | Custom DOM probing | One-button `useState` component + `client:load` | Trivial markup; React's presence in `dist/_astro/*.js` is the proof. |

**Key insight:** Phase 1 is almost entirely tool-driven scaffolding. The biggest risk is *misusing* tools (Pitfall 29, ESLint version mismatch, `base` footgun), not writing custom logic.

## Runtime State Inventory

> Phase 1 is a greenfield wipe with branch rename. Runtime state matters because we're not just deleting files — there's a snapshot to preserve, a branch identity to switch, and a service worker registration in browsers that may have visited the old site.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| **Stored data** | `src/resumeData.json` (resume content, ~290 lines) — single source of truth for the existing site. Must be preserved per D-03. | **Data migration (snapshot):** copy to `.planning/snapshots/m1-source/resumeData.json` BEFORE the wipe. Phase 2 reads from there. |
| **Stored data** | `src/assets/*` — project images (`emotion.png` 4.8 MB, `profilepic.jpg` 1 MB, `attendance1.png` 732 KB, `resume.png` 608 KB, and ~25 others). Some are duplicates; Phase 3 STYLE-03 will pick the right ones. | **Data migration (snapshot):** copy `src/assets/*` to `.planning/snapshots/m1-source/assets/`. |
| **Stored data** | `public/favicon.ico`, `public/logo192.png`, `public/logo512.png` (CRA boilerplate). | **Data migration (snapshot):** copy to `.planning/snapshots/m1-source/` for Phase 4 favicon re-author work. |
| **Stored data** | `public/Rashmil_Panchani.pdf` (~91 KB résumé). | **No migration:** survives the wipe in place per D-02. About.astro (Phase 3) links to it as `/Rashmil_Panchani.pdf`. |
| **Live service config** | None — site is statically deployed; no live external services hold "dev-os"-style references to this codebase. | None — verified by inventory: no Datadog, no n8n, no third-party CMS in current stack. |
| **OS-registered state** | **Service Worker (browser-side):** existing site's `src/serviceWorker.js` is *unregistered* on every load (`src/index.js:75`). However, any past visit registered a worker that now actively unregisters itself. The new Astro site ships no SW — visitors who hit the old site once still have the unregister code path queued. | **No action:** the existing CRA already calls `serviceWorker.unregister()` on every load, so any past visitor's browser has already cleared its SW on their next visit. New site ships no SW, so nothing new registers. Verified by reading `src/index.js`. |
| **OS-registered state** | **GitHub Pages source setting** (in repo Settings → Pages): currently "Deploy from a branch" → `gh-pages`. The Phase 1 CI workflow does NOT touch this (Phase 5's deploy workflow does). | **No Phase 1 action:** Phase 5 (DEPLOY-03) switches the source. Phase 1 keeps the existing `gh-pages`-served site live and untouched. |
| **OS-registered state** | **GitHub default branch:** currently `gh-pages` (per gitStatus header: "Main branch (you will usually use this for PRs): gh-pages"). Phase 1 renames local `master`→`main` and pushes `main`. | **Manual action (deferred to Phase 5):** flip default branch in GitHub Settings to `main` as part of the Phase 5 cutover bundle (CONTEXT.md `<specifics>` and `<deferred>`). Phase 1 does NOT switch the default branch — that would orphan the live site mid-cutover. |
| **OS-registered state** | **Custom domain (`rashmilpanchani.me`):** GitHub Settings → Pages may still list it. Domain is expired but the setting can linger. | **Manual action (Phase 5):** verify and clear in Settings → Pages. Phase 1 deletes `public/CNAME` (D-06); GitHub will auto-clear the domain setting on next deploy of a CNAME-less site (Phase 5). |
| **Secrets and env vars** | None — verified: no `.env`, no `process.env.*` references in current code beyond CRA-injected vars in the now-deleted service worker. | None — confirmed by codebase grep in `.planning/codebase/CONCERNS.md` and STACK.md. |
| **Build artifacts / installed packages** | **`node_modules/`** — currently contains React 18 + react-scripts + 444 transitive deps (just verified). Stale after the wipe of `package.json`. | **No git action** (node_modules is gitignored). The wipe-then-`npm install` flow naturally rebuilds it. Plan should include `rm -rf node_modules` between wipe and reinstall to avoid `react-scripts` leftover side-effects. |
| **Build artifacts / installed packages** | **`build/`** — CRA output dir (if any prior `npm run build` was run). | **Delete during wipe:** `git status` shows it's not tracked. Plan should include `rm -rf build/`. |
| **Build artifacts / installed packages** | **`.astro/`** — Astro's generated types dir. Doesn't exist yet but will after first `npm run dev`/`build`. Already in `D-18` ignore lists. | None — created on first build. |
| **Build artifacts / installed packages** | **Git tags / refs:** the `master` branch has commits. After rename to `main`, the remote `origin/master` becomes orphan. | **Action:** `git branch -m master main` (local) + `git push -u origin main` + `git push origin --delete master` after the rename push. GitHub default branch flip happens in Phase 5; meanwhile `gh-pages` remains the default and the live site source. |

**The canonical question:** *After every file in the repo is updated, what runtime systems still have the old string cached, stored, or registered?*

**Answer for Phase 1:** Only the GitHub Pages source setting and the GitHub default-branch identity — both deliberately deferred to Phase 5 to keep the live site up during cutover. Everything else is in-repo and cleaned by the wipe + reinstall.

## Common Pitfalls

### Pitfall A: ESLint 10 installed accidentally, jsx-a11y peer fails

**What goes wrong:** `npm install -D eslint` (no version pin) installs ESLint 10.x; `eslint-plugin-jsx-a11y@6.10.2` peer is `^3..^9` so npm warns and the plugin's rules silently no-op or `npm ci` fails on CI.

**Why it happens:** Plugin ecosystem lags ESLint majors. Plugin authors haven't bumped peers to `^10` yet (verified via `npm view eslint-plugin-jsx-a11y peerDependencies`).

**How to avoid:**
- Pin `eslint@^9.38.0` (not `^9`, not floating) in `package.json`.
- Add `npm ls eslint` to CI sanity check; fail if version is 10.x.

**Warning signs:** `npm install` warns "peer eslint@^9 but found eslint@10"; jsx-a11y rules don't trigger on a deliberately broken JSX example.

### Pitfall B: Tailwind v4 source detection misses `.astro` files

**What goes wrong:** Pitfall 29 from prior research. Tailwind v4's auto detection covers most file extensions, but the Astro-v4 integration is relatively new (Astro 5.2+) and there are reports of utilities not appearing in `dist/_astro/*.css`.

**Why it happens:** v4's source scanner replaced v3's explicit `content: [...]` array. With `@tailwindcss/vite`, Vite supplies the file list — but the resolution depends on how Astro's compiler reports `.astro` files.

**How to avoid:**
- D-12 mitigation: smoke test asserts the marker utility appears in `dist/_astro/*.css`.
- If it fails: add `@source "../**/*.{astro,html,ts,tsx}";` at the top of `src/styles/global.css`.

**Warning signs:** Classes present in HTML have no matching CSS; dev (HMR Vite) looks correct but prod (`astro build` + open `dist/`) doesn't.

### Pitfall C: `recommendedTypeChecked` without `parserOptions.project`

**What goes wrong:** `typescript-eslint`'s type-checked rules require type information; without `parserOptions.project`, every rule errors with "You have used a rule which requires parserServices to be generated."

**Why it happens:** Easy to miss when copy-pasting flat config from older `tseslint.configs.recommended` (non-type-checked) examples.

**How to avoid:** Pattern 5 includes `parserOptions: { project: true, tsconfigRootDir: import.meta.dirname }` in the `languageOptions` block immediately after `recommendedTypeChecked`.

**Warning signs:** `npm run lint` floods with "parserServices" errors; takes >30s because TS is being invoked per file.

### Pitfall D: lockfile drift during scaffold

**What goes wrong:** `npm create astro@latest` writes one `package.json`, then `npx astro add react`/`tailwind` rewrites it. If `yarn.lock` is still present, `npx astro add` may detect Yarn and use it, producing a `yarn.lock` update alongside `package-lock.json` — violates FOUND-07.

**Why it happens:** `npx astro add` auto-detects the package manager from existing lockfiles.

**How to avoid:** **Delete `yarn.lock` BEFORE the scaffold step**, not after. Plan ordering must reflect this:
1. Snapshot data
2. Branch rename
3. `git rm yarn.lock` (or `rm yarn.lock` before scaffold)
4. Wipe `src/`/`public/`
5. `npm create astro@latest`
6. `npx astro add react tailwind`

**Warning signs:** `yarn.lock` reappears after `astro add`; `npm ci` errors with "lockfile mismatch."

### Pitfall E: Hydration fixture path import breaks tsconfig boundaries

**What goes wrong:** `src/pages/__hydration-test.astro` imports `../../tests/__fixtures__/HydrationCheck.tsx`. Astro normally treats `src/` as the source root; importing from outside requires the import path to resolve and the file to be transformed by Astro's pipeline.

**Why it happens:** `tests/` is conventionally outside `src/`. Astro DOES allow imports from outside `src/`, but the file must still satisfy the project's TS module resolution.

**How to avoid:**
- Keep `tests/` at the repo root (not nested inside `src/`).
- The fixture is `.tsx`, so Astro's React integration will handle it via Vite.
- If TS complains about imports outside `rootDir`, set `tsconfig.json` `include` to `**/*` (Pattern 8) rather than `src/**/*`.

**Warning signs:** `astro build` error "Cannot find module '../../tests/__fixtures__/HydrationCheck.tsx'"; `astro check` reports a path resolution issue.

### Pitfall F: prettier-plugin-tailwindcss not last

**What goes wrong:** If `prettier-plugin-astro` is listed AFTER `prettier-plugin-tailwindcss`, class-sorting silently no-ops on `.astro` files because the Astro parser takes over before the tailwindcss plugin can hook in.

**Why it happens:** Plugin order in Prettier matters; tailwindcss docs say "tailwindcss MUST be last."

**How to avoid:** Pattern 6 lists plugins as `["prettier-plugin-astro", "prettier-plugin-tailwindcss"]` — tailwindcss IS last.

**Warning signs:** Classes in `.astro` files aren't auto-sorted after `prettier --write`.

### Pitfall G: husky pre-commit runs in non-Node-22 envs

**What goes wrong:** `lint-staged@17.0.5` engines field is `node >=22.22.1`. If a developer's machine runs Node 22.10 or older, `npm install` warns and `npx lint-staged` may break at runtime.

**Why it happens:** Recent lint-staged versions bumped Node engine.

**How to avoid:**
- Document Node 22 LTS requirement in README (Phase 5 CLEAN-08 owns README; mention in CI workflow comments now).
- Optionally pin `lint-staged@^16` if Node version flexibility matters more than the latest features. **Recommendation:** keep `^17` — matches PROJECT.md "Node 22 LTS" constraint.

**Warning signs:** Pre-commit hook fails with "engine not satisfied" on a teammate's machine.

### Pitfall H: Branch rename misses `gh-pages` source dependency

**What goes wrong:** Renaming `master`→`main` locally and pushing `main` doesn't change GitHub's default branch or the Pages source. The live site (served from `gh-pages` branch) keeps working. But CI on `main` won't trigger if any workflow file says `branches: [master]`.

**Why it happens:** Default branch and Pages source are repo-Settings, not git-config.

**How to avoid:**
- Phase 1 `ci.yml` MUST trigger on `main` (Pattern 10) — not `master`.
- Phase 5 owns the default-branch flip and Pages-source switch in correct order.

**Warning signs:** Push to `main` produces no CI run; first PR against `main` fails because workflow only listens to `master`.

## Code Examples

(Already embedded inline in Patterns 1–10 above with explicit source attributions. No additional examples needed.)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin | Tailwind v4 release (2024-12) + Astro 5.2 (2025-02) | `@astrojs/tailwind` is v3-only; use the Vite plugin. |
| `tailwind.config.js` | CSS-first `@theme {}` in `global.css` | Tailwind v4 release | No JS config; tokens are CSS variables that also emit utilities. |
| `src/content/config.ts` | `src/content.config.ts` | Astro 5 release (2024-12) | Phase 2 concern; current path is at repo root. |
| `type: 'content'` / `type: 'data'` collection style | Loader API (`glob()`, `file()` from `astro/loaders`) | Astro 5 release | Phase 2 concern. |
| ESLint `.eslintrc.js` | `eslint.config.js` flat config | ESLint 9 (2024-04); fully required in ESLint 10 (2026-02) | Phase 1 uses ESLint 9 flat config. |
| ESLint 9 | ESLint 10 | 2026-02 (current) | **Phase 1 BLOCKED at ESLint 9** by `eslint-plugin-jsx-a11y@6.10.2` peer cap. |
| `react-scripts` (CRA) | Astro 6 (or Vite/Next) | CRA deprecated 2023-Q1 | This phase's whole purpose. |
| `local gh-pages` deploy | `withastro/action` + `actions/deploy-pages@v4` | GitHub Actions Pages flow 2022+ | Phase 5 concern; Phase 1 adds CI not deploy. |
| React 18 `createRoot` | React 19 `createRoot` (same API) | React 19 release (2024-12) | Drop-in compatible; Astro 5.1+ supports it. |
| husky v8 (`_/husky.sh` shebang) | husky v9 (plain shell script) | husky v9 release (2024-03) | Pattern 9 uses v9 syntax. |
| `@tailwindcss/upgrade` codemod era | No codemod needed (greenfield) | N/A | We're not upgrading; we're scaffolding fresh. |

**Deprecated/outdated (do NOT use):**
- `@astrojs/tailwind` — Tailwind v3 only, last published 2024-09.
- ESLint `.eslintrc.*` config files — no longer recognized by ESLint 10; deprecated since v9.
- React 18 — Astro 6 + integration supports React 19; no reason to install older.
- `gh-pages` npm package — Phase 5 removes it; Phase 1 leaves it alone (gets deleted in the wipe via `package.json` replacement).
- CRA `react-scripts` — wiped.
- Yarn Classic + `yarn.lock` — FOUND-07 single-lockfile constraint.

## Assumptions Log

> Claims tagged `[ASSUMED]` in this research that need user/planner confirmation before locking.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `react@19.2.6` is the current stable React 19 patch | Standard Stack | Low — peer range `^19` means any 19.x works; planner uses latest `^19.x` at install time. Cited from prior research; not re-verified live in this session. |
| A2 | Vitest 4.3.x's `getViteConfig()` interop with Astro 6 is stable | Supporting libraries | Low — Vitest 3.x is the documented-stable path in prior research. If Vitest 4 has any interop surprise with Astro's Vite version, planner can fall back to Vitest 3.2.x without changing the rest of the stack. |
| A3 | `client:load` on the hydration fixture reliably emits a React chunk to `dist/_astro/` | Pattern 4 | Low — standard Astro behavior; verified by Astro docs but not re-tested in this session. If the chunk lands in a different path, smoke test assertion #4 may need to glob more permissively. |
| A4 | `node:child_process.spawnSync` is sufficient for the globalSetup; Vitest 4's `globalSetup` accepts a default-export function that throws on failure | Pattern 7 | Low — confirmed via Vitest docs; planner can swap to `execa` if subprocess buffering becomes an issue. |
| A5 | Astro's import resolution accepts `tests/__fixtures__/HydrationCheck.tsx` imported from `src/pages/__hydration-test.astro` without extra config | Pattern 4, Pitfall E | Medium — pitfall noted explicitly. Verified pattern works in similar Astro setups (prior community examples), but project-specific path resolution can vary. If `astro build` fails the import, fixture moves into `src/__hydration-test/HydrationCheck.tsx` and CONTEXT.md D-09 is reinterpreted. |
| A6 | `eslint-plugin-astro@1.7.0` and `eslint-plugin-jsx-a11y@6.10.2` flat-config exports are stable as `astro.configs.recommended` and `jsxA11y.flatConfigs.recommended` respectively | Pattern 5 | Low — verified via plugin READMEs. |
| A7 | Phase 1 does NOT need `astro-icon` / `@iconify-json/*` because no real icons are rendered in stubs | Standard Stack ("does not install") | Low — confirmed by D-08 (empty stubs). Phase 3 installs them. |
| A8 | The dev-environment Node version (v23.9.0) is fine for husky/lint-staged; CI uses Node 22 LTS | Pattern 10, Pitfall G | Low — engines fields verified; CI workflow pins Node 22 explicitly. |
| A9 | `prettier-plugin-tailwindcss@0.8.0` works on Tailwind v4 with the optional `tailwindStylesheet` config | Pattern 6 | Low — tailwindlabs docs confirm v4 support; `tailwindStylesheet` is optional. If class-sorting silently no-ops on v4, planner adds the option. |
| A10 | `withastro/action@v6` is NOT used in Phase 1 (only Phase 5) — but its v6.1.1 (Apr 2026) is the current floating tag | Phase 5 deferred | None for Phase 1. |
| A11 | The hydration fixture page (`__hydration-test`) ships in production for now and will be deleted in Phase 5 if undesired | CONTEXT.md `<specifics>`, deferred | Low — already noted as a discretionary cleanup item. |
| A12 | The marker class `text-[#abc123]` compiles to a CSS rule containing the literal hex `#abc123` (so the smoke test regex `/#abc123/i` will match) | Pattern 7 | Low — arbitrary-value Tailwind utilities emit the literal value in the rule. If v4 normalizes the hex differently, the smoke test regex may need to be `/text-\\[#abc123\\]|color:\\s*#abc123/i`. |

**Locked decisions from CONTEXT.md are NOT in this table** — they are the planner's truth, not assumptions.

## Open Questions

1. **Vitest 3 vs 4 final pick** — Discretion item per CONTEXT.md. Both work via `getViteConfig()`. Recommendation: Vitest 4.3.x (current major). Planner picks at install time.

2. **`engines.node` field in `package.json`** — CONTEXT.md `<claudes_discretion>` says it's a judgment call. Recommendation: pin `"engines": { "node": ">=22.13.0" }` to match `actions/setup-node@v4` Node 22 in CI and `lint-staged@17`'s `>=22.22.1`. Cheap insurance.

3. **`prettier-plugin-organize-imports` inclusion** — Discretion item. Recommendation: skip for Phase 1. Add later if import noise becomes a PR-review issue.

4. **Exact Tailwind marker class** — D-12 says "proposed: `text-[#abc123]`". Recommendation: use `text-[#abc123]` exactly — arbitrary hex value is unmistakable in the output CSS, and tests pin one search pattern.

5. **Which stub component carries the marker** — D-12 says "applied in one stub component." Recommendation: put it on `About.astro` (Pattern 3) — first non-nav section, visible in source order, easy mental anchor.

6. **README updates** — D-19 explicitly defers README to Phase 5 (CLEAN-08). Phase 1 does NOT touch README. If the planner sees a need to add a one-liner about `npm run dev`, it should still defer.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All steps | ✓ | v23.9.0 (dev env); CI uses 22.x LTS via setup-node | None — Node is universally available. |
| npm | All installs | ✓ | 10.9.2 (dev env) | None. |
| git | Branch rename, commits | ✓ | 2.39.5 | None. |
| GitHub remote | Push `main`, run Actions | ✓ (per gitStatus header) | — | None. |
| Internet (npm registry) | All package installs | Assumed ✓ | — | None during scaffold; planner should checkpoint a working `npm install` early. |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None.

## Security Domain

### Applicable ASVS Categories (Level 1 per `.planning/config.json`)

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V1 Architecture | yes | Static-only output (`output: 'static'`); no SSR routes, no API; no surface area beyond compiled HTML/CSS/JS. |
| V2 Authentication | no | No login flow; site is public read-only. |
| V3 Session Management | no | No sessions. |
| V4 Access Control | no | All content public. |
| V5 Input Validation | no (Phase 1) | Phase 1 has no user inputs. Phase 2 Zod schemas (CONTENT-08) cover content validation. |
| V6 Cryptography | no | No secrets, no auth, no client crypto. |
| V7 Errors / Logging | no (Phase 1) | No application logs in a static site. |
| V8 Data Protection | no | No PII handling beyond the publicly-published résumé. |
| V9 Communication | yes | Site is HTTPS-only on GitHub Pages (enforced by GH). No mixed content from CDNs (Phase 3 STYLE-02 removes the CDN icon libs; Phase 1 ships no CDN refs in BaseHead beyond fonts preconnect, which are HTTPS). |
| V10 Malicious Code | yes | Package legitimacy audit completed via slopcheck (above). No CDN-loaded `<script>`/`<link>` in Phase 1's BaseHead (D-13 lists only preconnects and `<meta>` tags). |
| V11 Business Logic | no | None. |
| V12 Files | no | Phase 1 ships only the PDF (passthrough). |
| V13 API | no | No API. |
| V14 Config | yes | `astro.config.mjs` is the only runtime config and is read at build time. No secrets. No `.env` introduced. CI workflow has read-only permissions (Pattern 10). |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| **Slopsquatting / hallucinated dependencies** | Tampering | slopcheck run on all Phase 1 packages (Package Legitimacy Audit). |
| **Postinstall script abuse** | Tampering | Verified empty `scripts.postinstall` on astro, @tailwindcss/vite, husky, vitest. |
| **CDN script injection** | Tampering | D-13 BaseHead emits NO `<script src="https://...">`; only `<link rel="preconnect">` to fonts (no executable code). |
| **Vulnerable transitive deps** | Tampering | `npm audit` after install; document baseline in `npm ls`. Phase 1 cuts CRA's 59-vuln tail completely (verified via the existing `package.json` audit). |
| **Lockfile drift / dependency confusion** | Tampering | FOUND-07: single `package-lock.json`; `npm ci` in CI. |
| **Branch rename race (live site goes dark)** | Denial of Service | Phase 1 keeps `gh-pages` branch + default-branch identity untouched. Phase 5 owns the cutover. |
| **GitHub Actions over-permissioned workflow** | Elevation of Privilege | Phase 1 `ci.yml` uses default read-only `GITHUB_TOKEN` (no `permissions:` block needed). Phase 5's deploy.yml separately scopes `pages: write` + `id-token: write` (Pitfall 12). |
| **Stale service worker still active in returning visitors' browsers** | Tampering | Existing CRA `serviceWorker.unregister()` already handles. New Astro site ships no SW. |

**Security verdict for Phase 1:** Low intrinsic risk (static public site, no inputs, no secrets). The primary controls are (1) package legitimacy (slopcheck — done), (2) lockfile integrity (FOUND-07), (3) CI permissions (default read-only). No `security_block_on: high` triggers identified.

## Sources

### Primary (HIGH confidence)

- **Live npm registry queries** (2026-05-26) for: `astro`, `@astrojs/react`, `@astrojs/check`, `tailwindcss`, `@tailwindcss/vite`, `vitest`, `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-astro`, `eslint-plugin-jsx-a11y`, `eslint-config-prettier`, `globals`, `prettier`, `prettier-plugin-astro`, `prettier-plugin-tailwindcss`, `husky`, `lint-staged`, `typescript`, `@iconify-json/simple-icons`. All version, peerDependencies, engines fields verified via `npm view`.
- **slopcheck install** (2026-05-26) — installed all 23 Phase 1 packages; zero `[SLOP]` blocks, zero `[SUS]` warnings. Implicit approval for all.
- **`astro/tsconfigs/strictest.json`** via GitHub raw — verified 9 compiler flags on top of `strict`.
- **`.planning/research/STACK.md`** (prior session, 2026-05-26) — pinned versions with explicit npm-registry verification dates.
- **`.planning/research/PITFALLS.md`** (prior session, 2026-05-26) — 30 documented pitfalls, including Pitfall 29 (Tailwind v4 `.astro` source detection) and Pitfall 30 (Vitest smoke test must spawn build).
- [Astro 5.2 release notes — Tailwind v4 support](https://astro.build/blog/astro-520/)
- [Tailwind v4 Astro install guide](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [Astro deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [ESLint v10.0.0 release blog](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) — confirms ESLint 10 exists (Feb 2026) but Phase 1 stays on 9 due to plugin peers.
- [ESLint v10 migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [Vitest globalSetup config](https://vitest.dev/config/globalsetup)
- [typescript-eslint flat config](https://typescript-eslint.io/getting-started)
- [eslint-plugin-jsx-a11y flat config docs](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#usage)
- [husky v9 docs](https://typicode.github.io/husky/)
- [prettier-plugin-tailwindcss README — plugin order requirement](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

### Secondary (MEDIUM confidence)

- [Setup Astro 3.0 with Tailwind CSS Prettier Plugin (webreaper.dev)](https://webreaper.dev/posts/astro-prettier-tailwind-setup/) — community pattern for `.astro` formatter setup; cross-references with official docs.
- [Vitest Global Setup blog (ben3d.ca)](https://ben3d.ca/blog/vitest-global-setup) — confirms spawning child processes from globalSetup pattern.
- [Astro + Tailwind v4 Setup 2026 Quick Guide (Tailkits)](https://tailkits.com/blog/astro-tailwind-setup/) — confirms `@tailwindcss/vite` is the recommended path.

### Tertiary (LOW confidence — flagged in Assumptions Log)

- A5 (cross-tree import for hydration fixture) — community examples support but no first-party Astro doc explicitly demonstrates `tests/` → `src/pages/` imports. Smoke test will confirm at execution time.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every version verified live against npm registry.
- Architecture patterns: HIGH — patterns drawn directly from CONTEXT.md locked decisions and prior research.
- Pitfalls: HIGH — pitfalls cross-referenced with `.planning/research/PITFALLS.md` and verified via live tool queries (especially Pitfall A — ESLint 10/jsx-a11y peer).
- Security: HIGH — Phase 1's surface area is minimal; controls are well-understood.
- Hydration fixture import resolution (A5): MEDIUM — flagged explicitly; smoke test will catch any issue.

**Research date:** 2026-05-26
**Valid until:** 2026-06-25 (~30 days, stable stack) — sooner if eslint-plugin-jsx-a11y bumps its peer range to allow ESLint 10, which would invalidate the version pin choice.

---

*Phase 1 research complete. Planner can now create the PLAN.md(s) with the 8 FOUND requirements mapped to ordered tasks. The locked decisions in CONTEXT.md provide the task boundaries; this research provides the verified versions, patterns, and pitfall mitigations.*
