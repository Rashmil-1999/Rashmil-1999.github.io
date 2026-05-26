---
phase: 01-foundation
reviewed: 2026-05-26T00:00:00Z
depth: standard
files_reviewed: 28
files_reviewed_list:
  - .github/workflows/ci.yml
  - .husky/pre-commit
  - .prettierignore
  - .prettierrc.json
  - astro.config.mjs
  - eslint.config.js
  - public/favicon.svg
  - src/assets/.gitkeep
  - src/components/About.astro
  - src/components/BaseHead.astro
  - src/components/Education.astro
  - src/components/Leadership.astro
  - src/components/Projects.astro
  - src/components/SideNav.astro
  - src/components/Skills.astro
  - src/components/Testimonials.astro
  - src/components/Work.astro
  - src/content.config.ts
  - src/layouts/BaseLayout.astro
  - src/pages/hydration-test.astro
  - src/pages/index.astro
  - src/styles/global.css
  - tests/__fixtures__/HydrationCheck.tsx
  - tests/global-setup.ts
  - tests/smoke.test.ts
  - tsconfig.json
  - vitest.config.ts
findings:
  critical: 2
  warning: 5
  info: 4
  total: 11
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-05-26
**Depth:** standard
**Files Reviewed:** 28
**Status:** issues_found

## Summary

Phase 1 foundation is in good shape on the big-rock decisions: Tailwind v4 is wired the modern way (CSS-first `@import 'tailwindcss'` + `@tailwindcss/vite` plugin), ESLint 9 flat config composition order is correct (prettier last, jsx-a11y scoped to JSX/TSX, `disableTypeChecked` shielding JS configs), `tsconfig` extends `astro/tsconfigs/strictest`, `globalSetup` wires `astro build` so a broken build kills the test suite, and there are no XSS vectors, secrets, or unsafe patterns in source.

Two BLOCKER-class issues need attention before Phase 5 (and one would silently break the pre-commit guard right now):

1. **`.husky/pre-commit` is not executable** (`-rw-r--r--`). On POSIX systems git silently skips non-executable hooks, so `lint-staged` is currently a no-op on every commit — the entire local quality gate is bypassed without warning. This is the canonical Husky v9 "did you `chmod +x`?" footgun.
2. **`public/CNAME` was deleted in the greenfield wipe and never restored.** Combined with `astro.config.mjs:13` `site: 'https://Rashmil-1999.github.io'` (instead of `https://rashmilpanchani.me`), the next deploy will (a) remove the custom-domain binding on GitHub Pages and (b) Phase 4 SEO-01's canonical/OG URLs will resolve against the wrong origin. The PDF was preserved but CNAME was not — same `public/` directory, same protection requirement, same load-bearing constraint per CLAUDE.md "Custom domain: `rashmilpanchani.me`".

The remaining findings are quality issues (CI cache key correctness, test scope completeness, drift between `id` strings in stubs and `id` strings the future SideNav will need, minor `.prettierignore` gaps).

Out of scope per phase context (NOT flagged): empty section stubs, empty `content.config.ts`, 5 known-deferred npm-audit warnings, `tseslint.config` deprecation hint.

## Structural Findings (fallow)

No `<structural_findings>` substrate was provided by the orchestrator for this review.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: `.husky/pre-commit` hook is not executable — lint-staged silently never runs — BLOCKER

**File:** `.husky/pre-commit` (file permissions)
**Issue:**
`stat` reports `-rw-r--r--` on the hook (no `+x`). On POSIX systems (the dev's macOS host, every CI runner, every Linux contributor's machine), git **silently skips hooks that are not executable** — it does not error, it does not warn, the commit just goes through. Husky v9 explicitly requires the hook script to be executable (this is the single most common Husky v9 setup bug, called out in their migration notes). Result: `npx lint-staged` is not running on commits today. ESLint auto-fix and Prettier auto-format are not gating anything locally; the only enforcement is the CI `npm run lint && npm run format:check` jobs, which catches violations one push later instead of pre-commit. This silently invalidates the entire "local fast feedback" half of Plan 04's quality gate.

Compounding factor: there is no test or CI assertion that the hook is executable, so this will not be caught by any existing check.

**Fix:**
```bash
chmod +x .husky/pre-commit
git update-index --chmod=+x .husky/pre-commit
git commit -m "fix(01): make husky pre-commit hook executable"
```

To prevent regression, consider adding a guard in the `prepare` script or a CI step:
```json
// package.json
"scripts": {
  "prepare": "husky && chmod +x .husky/pre-commit"
}
```
or a one-line CI sanity check in `.github/workflows/ci.yml` before `npm run lint`:
```yaml
- name: Verify pre-commit hook is executable
  run: test -x .husky/pre-commit
```

### CR-02: `public/CNAME` missing and `astro.config.mjs` `site:` URL points at the apex GH-Pages URL, not the custom domain — BLOCKER

**File:** `astro.config.mjs:13` (and missing `public/CNAME`)
**Issue:**
Two coupled defects:

1. **`public/CNAME` is absent.** It existed pre-wipe (contained `rashmilpanchani.me`, per CLAUDE.md "Custom domain: `rashmilpanchani.me` via `public/CNAME`") and was deleted in the greenfield wipe commit `30f8cab` along with the other CRA files. Astro copies `public/` verbatim into `dist/`, so the next deploy will publish a `dist/` with no `CNAME`. GitHub Pages treats a deploy without a CNAME file as "unset the custom domain" — the binding to `rashmilpanchani.me` will be silently removed at deploy time and the site will only resolve at `rashmil-1999.github.io`. The `public/Rashmil_Panchani.pdf` was explicitly preserved by the wipe; `CNAME` was not, and there is no plan task in Phase 5 that re-creates it (Phase 5's job is the deploy workflow, not content restoration).

2. **`astro.config.mjs:13` declares `site: 'https://Rashmil-1999.github.io'`.** Astro's `site` field is the canonical origin used by `Astro.site`, the sitemap integration, and any `<link rel="canonical">` / `<meta property="og:url">` Phase 4 emits. The canonical origin for this project is `https://rashmilpanchani.me`, not the GH-Pages URL. Once Phase 4 SEO-01 wires up canonical/OG/Twitter tags off `Astro.site`, every page will advertise the wrong origin — Google will index `rashmil-1999.github.io` as canonical, and social embed previews will link to the GH-Pages URL.

This is a regression introduced by Phase 1 that does not surface until Phase 4/5 ships, by which point the damage (lost custom domain, wrong canonical) is one deploy away.

**Fix:**
Restore the CNAME file in `public/`:
```
rashmilpanchani.me
```
(single line, trailing newline; matches GH-Pages format.)

And correct the canonical site URL:
```js
// astro.config.mjs
export default defineConfig({
    site: 'https://rashmilpanchani.me',
    // ...
});
```

If you want to defer the `site:` change to Phase 4 (where SEO actually consumes it), at minimum restore `public/CNAME` now so the deploy does not blow away the custom domain.

## Warnings

### WR-01: CI cache key uses `cache: 'npm'` with no `cache-dependency-path` and no `package-lock.json` hash key — cache will hit even when lockfile changes — WARNING

**File:** `.github/workflows/ci.yml:21-24`
**Issue:**
`actions/setup-node@v4` with `cache: 'npm'` defaults to keying on the `package-lock.json` it auto-discovers at the repo root, which is fine. But the workflow does not pin `cache-dependency-path` explicitly and does not declare a job-level cache version, so any future migration to a monorepo / workspace layout or a `package-lock.json` location change will silently fall back to no cache without a build break. Low-impact today (single lockfile at root), but worth pinning explicitly for clarity:

```yaml
- uses: actions/setup-node@v4
  with:
      node-version: '22'
      cache: 'npm'
      cache-dependency-path: package-lock.json
```

Adjacent concern: `node-version: '22'` is loose (will float to latest 22.x on each runner image refresh). The `engines.node` pin in `package.json` is `>=22.13.0` — pinning the CI to the same floor (`'22.13'` or `'22.x'`) avoids "works on my Node 22.13, breaks on runner's Node 22.0" drift if GitHub ever ships a runner with an older 22.

**Fix:**
Make the cache key explicit and tighten the Node version floor:
```yaml
- uses: actions/setup-node@v4
  with:
      node-version: '22.13'
      cache: 'npm'
      cache-dependency-path: package-lock.json
```

### WR-02: `tests/global-setup.ts` uses bare `npx astro build` without `--no-install` — risk of silent dependency install in CI on cache miss — WARNING

**File:** `tests/global-setup.ts:10`
**Issue:**
`spawnSync('npx', ['astro', 'build'], ...)` invokes `npx` without `--no-install`. If `astro` is not yet resolvable in `node_modules/.bin/` (which can happen on a cache-cold CI run, or after a partial `npm install` failure), `npx` will silently fetch and install the latest published `astro` from the registry, ignoring the project's pinned version in `package.json`. The test then runs against the wrong toolchain version, producing confusing failures or — worse — silently passing against a build that does not match the locked deps.

`npx --no-install astro build` would fail fast and loudly when the binary is missing, which is the correct failure mode for a deterministic test setup. Better still, use the locally-resolved binary directly:

```ts
spawnSync('node', ['./node_modules/astro/astro.js', 'build'], ...)
```

or invoke through the npm script, which goes through node_modules:
```ts
spawnSync('npm', ['run', 'build'], { stdio: 'inherit', env: process.env, shell: process.platform === 'win32' });
```

Secondary issue on the same file (lines 10-13): `spawnSync` on Windows does not resolve `npx` (a `.cmd` shim) without `shell: true`. The project doesn't currently claim Windows support, but adding `shell: process.platform === 'win32'` is a one-line cross-platform safety net.

**Fix:**
```ts
const result = spawnSync('npx', ['--no-install', 'astro', 'build'], {
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
});
```

### WR-03: `smoke.test.ts` does not assert `<html lang="en">` or `<meta charset>` — WCAG-relevant invariants the BaseLayout owns are untested — WARNING

**File:** `tests/smoke.test.ts:24-55`
**Issue:**
The smoke suite asserts section ids, the hydration page route, and the Tailwind marker, but it does not assert two load-bearing invariants the `BaseLayout` is responsible for:
1. `<html lang="en">` — a WCAG 2.1 AA hard requirement per `.claude/CLAUDE.md`. If `BaseLayout.astro:17` ever loses the `lang` attribute in a Phase 3 refactor, no test catches it.
2. `<meta charset="utf-8">` — also a WCAG-adjacent / encoding invariant the head must always emit.

These are exactly the kind of cross-cutting invariants that a Phase 1 smoke test exists to anchor before Phase 3 starts mutating layouts. Adding two `expect(html).toContain(...)` lines costs nothing and locks in the contract.

Also missing: a negative assertion that `dist/index.html` does **not** contain any of the old CDN script references (`stackpath.bootstrapcdn.com`, `code.iconify.design`, `jquery`, `fontawesome`). Per phase context "No CDN UI libraries", this is the constraint Phase 1 is supposed to lock in — but it's enforced only by absence of `public/index.html`, not by an active test. A regression in Phase 3 (someone copy-pasting the old `<head>`) would slip through.

**Fix:**
Add to `tests/smoke.test.ts`:
```ts
it('dist/index.html declares lang=en and utf-8 charset', () => {
    const html = readFileSync(join(DIST, 'index.html'), 'utf8');
    expect(html).toMatch(/<html[^>]*\slang=["']en["']/i);
    expect(html).toMatch(/<meta[^>]*\scharset=["']utf-8["']/i);
});

it('dist/index.html does not reference the dropped CDN UI libs', () => {
    const html = readFileSync(join(DIST, 'index.html'), 'utf8');
    for (const banned of [
        'bootstrapcdn.com',
        'code.iconify.design',
        'jsdelivr.net/gh/devicons',
        'use.fontawesome.com',
        'jquery',
    ]) {
        expect(html.toLowerCase()).not.toContain(banned);
    }
});
```

### WR-04: `id` collisions / drift between stubs and the future SideNav anchor targets — WARNING

**File:** `src/components/Work.astro:4-5`, `src/components/SideNav.astro:4`
**Issue:**
The stubs comment that they have intentionally diverged from the deleted CRA component ids:
- `Work.astro` uses `id="work"` (was `experience`)
- `SideNav.astro` uses `id="sidenav"` (was `sideNav`)

The Work comment acknowledges "the resumeData.json snapshot still has `#experience` in links[]; Phase 2 re-derives nav links from Content Collections." That is fine if Phase 2 actually does the re-derivation, but right now the stub IDs are written in only one place (the section files) — there is no shared constant, no test that the eventual SideNav `href`s match the section `id`s, and no documented mapping table. When Phase 3 builds SideNav and Phase 2 builds the link list, a mismatch (e.g., link href `#experience` pointing at `#work`) produces a silently broken anchor-scroll — no error, just a click that does nothing.

Also: the deliberate divergence is documented in CONTEXT.md D-23 (referenced in the comment), but D-23 is a phase artifact that will be archived. The constraint needs to live in code, not in a planning doc that future maintainers won't read.

**Fix:**
Centralize the section id list as a single typed export and have both the stubs and the future SideNav import it. Two-line change for now:

```ts
// src/components/sections.ts
export const SECTION_IDS = [
    'sidenav',
    'about',
    'education',
    'work',
    'skills',
    'projects',
    'leadership',
    'testimonials',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];
```

Then have `smoke.test.ts` import this same constant so the assertion list cannot drift from the implementation, and have Phase 3's SideNav consume it for `href={#${id}}`. Right now the same string list is duplicated in 8 stubs and again in `tests/smoke.test.ts:13-22`.

### WR-05: `.prettierignore` does not exclude `dist/` build output from `format:check` even though `.gitignore` does — `format:check` will fail on a freshly-built tree — WARNING

**File:** `.prettierignore:1`
**Issue:**
`.prettierignore` does list `dist/` (line 1), so this part is correct. But it does NOT list:
- `public/Rashmil_Panchani.pdf` (a binary that prettier will not parse, but will surface as a noisy "not supported" log line on every `format:check`)
- `*.lock` / `yarn.lock` / `package-lock.json` is listed, good
- The `.github/` workflows directory is included by default and prettier will format YAML there — but YAML formatting in workflows can subtly break indentation-sensitive multiline `run:` blocks. Worth ignoring, or at minimum testing.

Actually re-reading: `.prettierignore` correctly excludes `dist/`, `node_modules/`, `.astro/`, `coverage/`, `.planning/`, `.claude/`, `package-lock.json`, `CLAUDE.md`, `.vscode/`. The omissions above are minor.

The more material concern: **`public/Rashmil_Panchani.pdf`** is a binary file and `npm run format:check` will iterate it on every CI run. Prettier handles binaries gracefully (just skips and warns), but the warning is noise. Add `public/*.pdf` to `.prettierignore`.

Also: the file has no trailing newline issue, but the CLAUDE.md block comment (lines 9-12) claims "Treat as machine-managed (same logic as `.planning/`)" — fine, but if `CLAUDE.md` is excluded from formatting it should probably also be excluded from `eslint` (eslint.config.js doesn't list it in `ignores`). Currently eslint will not touch it because it's `.md`, but if `eslint-plugin-markdown` is ever added, this gap reappears.

**Fix:**
```
# .prettierignore — add
public/*.pdf
```

## Info

### IN-01: `BaseHead.astro` preconnects to Google Fonts but Phase 1 ships no font stylesheet — preconnect to an origin you don't load wastes a connection — INFO

**File:** `src/components/BaseHead.astro:18-19`
**Issue:**
The head emits `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`, but Phase 1 does not load any Google Fonts stylesheet (the comment on line 4 says "Phase 3 STYLE-05 adds the font stylesheet link"). Preconnecting to an origin you never use opens a TCP/TLS handshake the browser then idles and tears down — minor performance debt and a (very small) privacy hint to Google on every page load that you're going to fetch from them even when you're not.

Either move the preconnect hints into Phase 3 (where the stylesheet actually appears), or accept the cost as a deliberate warm-up for Phase 3. The current state is "I'm preconnecting because Phase 3 will need it" which is acceptable but should be a code comment, not implicit.

**Fix:**
Either:
1. Remove the two `<link rel="preconnect">` lines until Phase 3 STYLE-05 adds the font stylesheet (preferred — surgical, matches the principle "no speculative code"), or
2. Add an inline comment noting the preconnect is intentionally early so it's not pruned in a future "dead code" sweep:
   ```astro
   <!-- Preconnect early; Phase 3 STYLE-05 will load the Google Fonts stylesheet. -->
   ```

### IN-02: `hydration-test` route ships in production builds — INFO

**File:** `src/pages/hydration-test.astro:1-22`
**Issue:**
The hydration test page is a route at `/hydration-test/` that will exist in every production deploy unless explicitly excluded. The header comment acknowledges "Phase 5 may delete this fixture (deferred)" — fine — but it leaks the React island into the production bundle (a ~50kb React + ReactDOM payload) on every deploy until then. Real users have no use for `/hydration-test/`, and search crawlers may index it.

For Phase 1 this is a deliberate trade-off (the smoke test relies on the page existing in `dist/`), but it should be:
1. `<meta name="robots" content="noindex">` on the page so it does not get indexed if accidentally linked
2. Tracked as a Phase 5 to-do (deletion blocker), not just a comment

**Fix:**
```astro
<BaseLayout title="Hydration test">
    <meta slot="head" name="robots" content="noindex,nofollow" />
    <HydrationCheck client:load />
</BaseLayout>
```
(adapt slot syntax to whatever BaseLayout supports; alternatively add a `<meta>` directly in the BaseHead for this page via a prop).

### IN-03: `astro.config.mjs` has no `trailingSlash` setting — relying on Astro 6 defaults — INFO

**File:** `astro.config.mjs:7-21`
**Issue:**
The config relies on Astro 6's default `trailingSlash: 'ignore'` and `build.format: 'directory'`. This is fine in isolation, but the smoke test at `tests/smoke.test.ts:36-38` asserts `dist/hydration-test/index.html` — that path only exists because `build.format` is `'directory'` (Astro's default). If a future config change flips to `build.format: 'file'`, the path becomes `dist/hydration-test.html` and the smoke test breaks with no warning. Pinning the format explicitly removes the silent dependency on a default:

```js
build: {
    format: 'directory', // smoke test depends on this
},
```

Low priority — Astro is unlikely to change the default mid-major, and a phase-1 review note in the comment is enough.

**Fix:**
Add an explicit `build.format: 'directory'` to `astro.config.mjs` for clarity, or add a comment on `tests/smoke.test.ts:36` noting the dependency.

### IN-04: `eslint.config.js` `globals.browser` + `globals.node` merged unconditionally — `node` globals (`process`, `__dirname`) will be accepted in browser-only React islands — INFO

**File:** `eslint.config.js:33`
**Issue:**
The flat config merges both `globals.browser` and `globals.node` for all files:
```js
globals: { ...globals.browser, ...globals.node },
```

This is convenient for the config files (which run on Node) and for SSG build code, but it means a developer writing `tests/__fixtures__/HydrationCheck.tsx` or a future client-only React island can reference `process.env.X`, `__dirname`, or `Buffer` and ESLint will not flag it as undefined. Those references will then crash at runtime in the browser. For an Astro project where the React islands run in the browser only, the `globals.node` set should be scoped to `.config.js`, `.config.mjs`, and `tests/` only:

```js
{
    files: ['**/*.{ts,tsx,jsx}', '**/*.astro'],
    languageOptions: { globals: { ...globals.browser } },
},
{
    files: ['**/*.config.{js,mjs,cjs,ts}', 'tests/**/*'],
    languageOptions: { globals: { ...globals.node } },
},
```

Low impact today (no React island uses Node APIs), but it's a guardrail Phase 3+ will benefit from.

**Fix:**
Split the `globals` declaration into two file-scoped blocks as shown above.

---

_Reviewed: 2026-05-26_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
