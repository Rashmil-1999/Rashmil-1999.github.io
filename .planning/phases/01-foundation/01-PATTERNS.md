# Phase 1: Foundation - Pattern Map

**Mapped:** 2026-05-26
**Files analyzed:** 22 new/modified
**Analogs found:** 3 / 22 (greenfield phase — most files have no in-repo analog by design)

## Greenfield Note

Per CONTEXT.md D-01..D-04, Phase 1 is a one-shot greenfield wipe. The CRA tree
(`src/components/*.jsx`, `src/App.css`, `src/serviceWorker.js`, `src/setupTests.js`,
`src/resumeData.json`, `src/assets/*`, `src/App.test.js`, `src/index.js`,
`public/index.html`, `public/CNAME`, `public/favicon*`, `public/logo*`,
`public/manifest.json`, `public/robots.txt`) is deleted before the Astro scaffold
is written. The wipe-survivors are:

- `.planning/**` (markdown only — no code analog value)
- `.claude/**` (GSD config — markdown + minimal shell)
- `public/Rashmil_Panchani.pdf` (asset; not an analog)
- `package.json`, `package-lock.json`, `yarn.lock`, `README.md`, `.gitignore`, `CLAUDE.md` (root files, mutated not deleted)
- `node_modules/` (already contains the Astro dep set per current `package.json` — partial pre-scaffolding has happened)

This means **the vast majority of Phase 1 files are brand-new with no relevant in-repo analog**.
For those, the entry below states "No analog — new file" and points the planner at
the corresponding RESEARCH.md Pattern (Pattern 1..10). This is the honest answer;
forcing comparisons against unrelated CRA code would mislead the planner.

A small number of files DO have weak analogs worth capturing:

1. `package.json` — already partially mutated; existing CRA scripts/eslintConfig must be removed.
2. The 8 `.astro` section stubs — section ids in the existing `*.jsx` files inform the new ids (with one divergence flagged below).
3. `src/pages/index.astro` — the "compose 8 sections in order" pattern parallels the existing `src/index.js` App component.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `astro.config.mjs` | config | build-time | — | No analog — new file |
| `tsconfig.json` | config | build-time | — | No analog — new file |
| `eslint.config.js` | config | build-time | `package.json:42-44` (CRA `eslintConfig`) | tangential (replaces it) |
| `.prettierrc.json` | config | build-time | — | No analog — new file |
| `.prettierignore` | config | build-time | — | No analog — new file |
| `vitest.config.ts` | config | build-time | — | No analog — new file |
| `package.json` | config | build-time | `package.json` (current) | self — mutated in place |
| `.github/workflows/ci.yml` | config | event-driven (CI) | — | No analog — new file |
| `.husky/pre-commit` | config | event-driven (git hook) | — | No analog — new file |
| `src/styles/global.css` | style entry | build-time | `src/App.css` (deleted by wipe) | none — different paradigm |
| `src/layouts/BaseLayout.astro` | layout | request-response (SSG render) | `public/index.html` (deleted) | none — different paradigm |
| `src/components/BaseHead.astro` | component | request-response (SSG render) | `public/index.html` `<head>` (deleted) | none — different paradigm |
| `src/pages/index.astro` | page (entry) | request-response (SSG render) | `src/index.js` (deleted) — App composition | composition-pattern-match |
| `src/pages/__hydration-test.astro` | page (fixture) | request-response (SSG render) | — | No analog — new file |
| `src/components/SideNav.astro` | component (stub) | request-response (SSG render) | `src/components/Navbar.jsx` (deleted) | id-only (see divergence note) |
| `src/components/About.astro` | component (stub) | request-response (SSG render) | `src/components/About.jsx` (deleted) | id-only |
| `src/components/Education.astro` | component (stub) | request-response (SSG render) | `src/components/Education.jsx` (deleted) | id-only |
| `src/components/Work.astro` | component (stub) | request-response (SSG render) | `src/components/Work.jsx` (deleted) | id-only (see divergence note) |
| `src/components/Skills.astro` | component (stub) | request-response (SSG render) | `src/components/Skills.jsx` (deleted) | id-only |
| `src/components/Projects.astro` | component (stub) | request-response (SSG render) | `src/components/Projects.jsx` (deleted) | id-only |
| `src/components/Leadership.astro` | component (stub) | request-response (SSG render) | `src/components/Leadership.jsx` (deleted) | id-only |
| `src/components/Testimonials.astro` | component (stub) | request-response (SSG render) | `src/components/Testimonials.jsx` (deleted) | id-only |
| `src/content.config.ts` | config (placeholder) | build-time | — | No analog — empty placeholder per D-11 |
| `tests/smoke.test.ts` | test | build-time | `src/App.test.js` (already deleted per `git status`) | none — different framework |
| `tests/global-setup.ts` | test util | build-time | `src/setupTests.js` (deleted by wipe) | none — different purpose |
| `tests/__fixtures__/HydrationCheck.tsx` | test fixture | request-response (client hydration) | — | No analog — new file |

## Pattern Assignments

### `package.json` (config, build-time)

**Analog:** `package.json` (the current file — it is mutated in place, not deleted)
**Read:** `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/package.json:1-57`

**State that must be deleted from the existing file:**

Existing CRA scripts block (lines 34-41) — replace entirely:
```json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
}
```

Existing CRA `eslintConfig` (lines 42-44) — delete entirely (flat config in `eslint.config.js` takes over per D-15):
```json
"eslintConfig": {
    "extends": "react-app"
}
```

Existing CRA `browserslist` (lines 45-56) — delete entirely (Astro/Vite handles target browsers via Vite's default; not needed for SSG).

Existing CRA-era runtime deps (lines 24-28) — delete: `react-script-tag`, `react-scripts`, `react-scroll`. (`react`, `react-dom` are kept but bumped to `^19.2.6` per RESEARCH.md Standard Stack.)

Existing `gh-pages` dep (line 17) — delete (Phase 5 uses GitHub Actions deploy, not the `gh-pages` package; D-deferred to Phase 5).

Existing `homepage` field (line 33) — keep (`https://Rashmil-1999.github.io`); will also appear as `site` in `astro.config.mjs`.

Existing `typescript@^6.0.3` (line 30) — verify against RESEARCH.md (Standard Stack says `^5.9`; `@astrojs/check@0.9.9` peer is `^5.0.0 || ^6.0.0` so 6 is allowed, but the safer pin is `^5.9`).

**State that must be added** (per RESEARCH.md Pattern 9, lines 839-862):

```json
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
    "*.{ts,tsx,astro,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json,yml,yaml,css}": ["prettier --write"]
}
```

Optional per discretion (D-25, CONTEXT.md Claude's Discretion):
```json
"engines": {
    "node": ">=22.12.0"
}
```

**Why this matters:** the current `package.json` is in a partially-Astro, partially-CRA state — both ecosystems are installed simultaneously. Phase 1 cleanup must reconcile both lockfiles (`yarn.lock` deletion per FOUND-07) AND scrub all CRA artifacts from `package.json` in the same commit that introduces the Astro scaffold.

---

### `src/pages/index.astro` (page, SSG render)

**Analog:** `src/index.js` (deleted by wipe, but read for composition pattern)
**Read:** `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/index.js:1-75`

**Pattern to preserve — section composition order** (lines 22-65):

The existing App component composes sections in this order: SideNav → About → Education → Work → Skills → Projects → Leadership → Testimonials. CONTEXT.md D-07 says Phase 1 keeps the same order. RESEARCH.md Pattern 3 (lines 519-545) shows the Astro equivalent:

```astro
---
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

**Pattern NOT to preserve:**
- The deleted `src/index.js` wraps everything in `<StrictMode>` (line 34) — this is an anti-pattern (CONCERNS.md; Pitfall 18 in RESEARCH.md). Astro islands do not need `StrictMode`.
- The deleted `src/index.js` calls `serviceWorker.unregister()` (line 75) — no SW in Phase 1; do not re-introduce.
- The deleted `src/index.js` passes resume data as props (`<About about={about} />`, etc.) — Phase 1 stubs receive NO props (D-08). Phase 3 wires up Content Collections.

---

### 8 Section Stubs: `src/components/{SideNav,About,Education,Work,Skills,Projects,Leadership,Testimonials}.astro`

**Role:** component (stub)
**Data flow:** request-response (SSG render)
**Analog quality:** id-only — the only thing carried forward from the JSX components is the `id="..."` attribute on the `<section>` element. Everything else (Bootstrap classes, JSX content, prop destructuring) is dropped by D-08.

**Source ids extracted from current JSX** (verified by grep across `src/components/*.jsx`):

| Component | Existing JSX `id="..."` | RESEARCH.md / CONTEXT.md D-23 expects | Divergence? |
|-----------|------------------------|---------------------------------------|-------------|
| Navbar.jsx → SideNav.astro | `id="sideNav"` (camelCase, Navbar.jsx:11) | `sidenav` (lowercase, D-23) | YES — case mismatch |
| About.jsx → About.astro | `id="about"` | `about` | match |
| Education.jsx → Education.astro | `id="education"` | `education` | match |
| Work.jsx → Work.astro | `id="experience"` (Work.jsx:7) | `work` (D-23) | YES — value mismatch |
| Skills.jsx → Skills.astro | `id="skills"` | `skills` | match |
| Projects.jsx → Projects.astro | `id="projects"` | `projects` | match |
| Leadership.jsx → Leadership.astro | `id="leadership"` | `leadership` | match |
| Testimonials.jsx → Testimonials.astro | `id="testimonials"` | `testimonials` | match |

**Side-effect of the divergence:** `resumeData.json` `links` array hard-codes `"#experience"` (verified at line 23 of `src/resumeData.json`). Phase 2's content layer reads from the snapshot of this file. If Phase 1 uses `id="work"` (per D-23) but Phase 2 inherits `"#experience"` from the snapshot, the SideNav anchors will be broken until Phase 2 or Phase 3 fixes it.

**Planner recommendation:** Use the D-23 set (`work`, `sidenav`) since CONTEXT.md decisions are locked. Flag the `resumeData.json links[]` mismatch in the Phase 1 PLAN.md as a known-future-issue handed off to Phase 2 (which will be re-deriving the nav links anyway from typed Content Collections, not from the legacy snapshot `links[]` array). Do NOT silently rename `experience`→`work` in the snapshot — the snapshot is a pre-wipe artifact and must be preserved verbatim per D-03.

**Stub markup pattern** (RESEARCH.md Pattern 3, lines 500-516):

```astro
---
// src/components/About.astro
// CONTEXT.md D-08: empty stub. Phase 3 fills with real content.
// CONTEXT.md D-12: this component carries the Tailwind marker utility.
---
<section id="about" class="text-[#abc123]"></section>
```

The other 7 stubs follow the same shape, omitting the `class="text-[#abc123]"` marker (only one carries it per D-12).

**Reference asset from the deleted analog** (About.jsx:52 — informs Phase 3, not Phase 1):
```jsx
<a href={resume_download} className="btn btn-primary mt-5 text-center" download>
```
`resume_download` resolves to `"Rashmil_Panchani.pdf"` from resumeData.json. Phase 3 (NOT Phase 1) will re-author this against the wipe-survivor at `public/Rashmil_Panchani.pdf`.

---

### `eslint.config.js` (config, build-time)

**Analog (tangential):** `package.json:42-44` (the existing CRA `eslintConfig: { extends: "react-app" }` block, deleted in this phase).

**Pattern source:** RESEARCH.md Pattern 5 (lines 590-642) — complete flat config example. No in-repo analog provides any reusable code; the new file fully replaces the embedded CRA config. Planner reads Pattern 5 directly.

---

### `astro.config.mjs`, `tsconfig.json`, `.prettierrc.json`, `.prettierignore`, `vitest.config.ts`, `tests/global-setup.ts`, `tests/smoke.test.ts`, `tests/__fixtures__/HydrationCheck.tsx`, `src/layouts/BaseLayout.astro`, `src/components/BaseHead.astro`, `src/styles/global.css`, `src/pages/__hydration-test.astro`, `src/content.config.ts`, `.github/workflows/ci.yml`, `.husky/pre-commit`

**Analog:** None.

**Reason:** These files have no functional or structural equivalent in the existing CRA codebase. The greenfield wipe deletes everything CRA-related; the new files implement an entirely different build paradigm (Astro SSG vs. CRA webpack SPA), a different test runner (Vitest spawning `astro build` vs. Jest unit tests), a different lint stack (ESLint 9 flat config vs. CRA's embedded react-app preset), a formatter that wasn't previously configured at all (Prettier), and CI infrastructure that did not exist (`.github/workflows/`).

**Pattern source — direct from RESEARCH.md** (planner copies these verbatim, no codebase translation step):

| File | RESEARCH.md Section | Lines |
|------|---------------------|-------|
| `astro.config.mjs` | Pattern 1 | 402-428 |
| `src/styles/global.css` | Pattern 2 (first block) | 436-446 |
| `src/layouts/BaseLayout.astro` | Pattern 2 (second block) | 448-472 |
| `src/components/BaseHead.astro` | Pattern 2 (third block) | 474-492 |
| `src/pages/__hydration-test.astro` | Pattern 4 (second block) | 570-582 |
| `tests/__fixtures__/HydrationCheck.tsx` | Pattern 4 (first block) | 553-568 |
| `eslint.config.js` | Pattern 5 | 592-642 |
| `.prettierrc.json` | Pattern 6 (first block) | 657-678 |
| `.prettierignore` | Pattern 6 (second block) | 683-691 |
| `vitest.config.ts` | Pattern 7 (first block) | 700-713 |
| `tests/global-setup.ts` | Pattern 7 (second block) | 715-735 |
| `tests/smoke.test.ts` | Pattern 7 (third block) | 737-792 |
| `tsconfig.json` | Pattern 8 | 800-806 |
| `.husky/pre-commit` | Pattern 9 (third block) | 833-837 |
| `.github/workflows/ci.yml` | Pattern 10 | 874-902 |
| `src/content.config.ts` | (Empty placeholder per D-11) — no content; just create file | — |

## Shared Patterns

In a normal phase this section captures cross-cutting concerns (auth middleware, error handling, response formatters) that apply to many new files. **Phase 1 has none of those.** The closest equivalents are:

### File-header source-attribution comment style
**Pattern source:** RESEARCH.md Patterns 1, 2, 5, 7, 8 — every new `.astro`/`.mjs`/`.ts`/`.js`/`.css` file begins with a short comment that names the canonical source URL and the relevant CONTEXT.md decision IDs.

**Examples from RESEARCH.md:**

`astro.config.mjs` (Pattern 1, lines 409-412):
```js
// astro.config.mjs
// Source: docs.astro.build/en/reference/configuration-reference/
//         tailwindcss.com/docs/installation/framework-guides/astro
//         (and CONTEXT.md D-13)
```

`src/styles/global.css` (Pattern 2, lines 437-439):
```css
/* src/styles/global.css */
/* Source: tailwindcss.com/docs/installation/framework-guides/astro
            and CONTEXT.md D-14 */
```

**Apply to:** Every new file created in Phase 1. Keeps the "why this exists / where this came from" link traceable.

### Ignore-list discipline
**Pattern source:** CONTEXT.md D-18.
**Apply to:** `eslint.config.js` `ignores` block (Pattern 5 line 609-617) AND `.prettierignore` (Pattern 6 line 683-691). Both lists MUST contain:

```
dist/
node_modules/
.astro/
coverage/
.planning/
.claude/
```

Plus `package-lock.json` in `.prettierignore` only. This protects the planning artifacts in `.planning/` and the GSD workflow files in `.claude/` from accidental reformat — critical because both directories are markdown-heavy and our tooling has no business touching them.

### Conventional Commits commit-message style
**Pattern source:** CONTEXT.md D-20.
**Apply to:** All git commit messages in Phase 1 execution (and beyond).
**Evidence from existing history:**
```
0ac91e7 docs(state): record phase 1 context session
6abbc4a docs(01): capture phase context
9e368d5 docs: create roadmap (5 phases, 64 requirements mapped)
43c1bf2 docs: define v1 requirements
a5ca9e1 docs: update project context after research...
```

NOT enforced via commitlint — convention is documented, not gated. The Phase 1 planner does not need to add a commitlint config.

### Indentation (Prettier `tabWidth: 4`)
**Pattern source:** CONTEXT.md D-17, RESEARCH.md Pattern 6.
**Apply to:** All new code files in Phase 1. This is a user-specific override (community default for Astro/TS is 2). Planner should write every new file with 4-space indentation from the start so Prettier doesn't immediately rewrite them on first run.

## No Analog Found

Files with no close match in the codebase — planner reads RESEARCH.md patterns directly. Listed for completeness against the orchestrator's prompt:

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `astro.config.mjs` | config | build-time | New build system; no equivalent in CRA. |
| `tsconfig.json` | config | build-time | Project had no TypeScript previously (`tsconfig.json` absent per CLAUDE.md "Configuration" section). |
| `.prettierrc.json`, `.prettierignore` | config | build-time | Prettier was not used in CRA project (no `.prettierrc*` files present — confirmed CLAUDE.md). |
| `vitest.config.ts` | config | build-time | New test runner. Existing `src/setupTests.js` only had `@testing-library/jest-dom/extend-expect` — unrelated. |
| `tests/global-setup.ts` | test util | build-time | Subprocess-spawning a build is novel to this codebase. |
| `tests/smoke.test.ts` | test | build-time | `src/App.test.js` already deleted (per `git status`); was a CRA smoke test, fundamentally different. |
| `tests/__fixtures__/HydrationCheck.tsx` | test fixture | client hydration | React 19 verification fixture — no precedent. |
| `src/layouts/BaseLayout.astro` | layout | SSG render | Astro layouts have no CRA equivalent (CRA's `public/index.html` is a build-time template, not a render-time layout). |
| `src/components/BaseHead.astro` | component | SSG render | `<head>` was inline in `public/index.html`; not modular. |
| `src/pages/__hydration-test.astro` | page | SSG render | Fixture concept doesn't exist in CRA. |
| `src/styles/global.css` | style entry | build-time | `src/App.css` (deleted) was Bootstrap-extending classic CSS, not Tailwind v4 `@theme`. Different paradigm. |
| `src/content.config.ts` | config | build-time | Empty placeholder per D-11 — Phase 2 fills it. |
| `.github/workflows/ci.yml` | config | event-driven (CI) | No CI existed previously. |
| `.husky/pre-commit` | config | event-driven (git hook) | No pre-commit hooks existed. |

## Metadata

**Analog search scope:** `src/`, `src/components/`, `public/`, `package.json`, `.claude/`, `.planning/`.
**Files scanned:** 9 component `.jsx`, `src/index.js`, `src/resumeData.json` (sample), `package.json`, plus directory listings of `.claude/`, `.planning/`, `public/`.
**Pattern extraction date:** 2026-05-26
**Greenfield exception applied:** Yes — most files honestly marked "No analog — new file" rather than fabricating stretched comparisons. Per orchestrator guidance: "Honest output is better than forced output."
