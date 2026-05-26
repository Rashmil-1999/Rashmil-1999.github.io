# Stack Research

**Domain:** Static personal portfolio (single-page resume site, GitHub Pages, user-site repo)
**Researched:** 2026-05-26
**Confidence:** HIGH

## TL;DR — Pinned Stack

```
astro@6.3.8                       # framework
@astrojs/react@5.0.5              # React island integration (React 19 ready)
react@19.2.6 + react-dom@19.2.6   # interactive islands only
@types/react@19 + @types/react-dom@19
tailwindcss@4.1.7                 # styling (v4, CSS-first config)
@tailwindcss/vite@4.1.7           # NEW Vite plugin route (NOT @astrojs/tailwind)
typescript@5.9.x (via Astro)      # strict mode
@astrojs/check@0.9.9              # TS type-checking CLI for .astro
astro-icon@1.1.5                  # bundled icons (replaces Font Awesome/Devicon/Iconify CDNs)
@iconify-json/simple-icons@15.x   # brand icons (GitHub, LinkedIn, ...)
@iconify-json/devicon@1.x         # tech-stack icons (Python, React, ...)
vitest@3.2.x                      # smoke test runner via getViteConfig()
eslint@9.38.x + typescript-eslint@8.46.x  # flat config
eslint-plugin-astro@1.4.x
eslint-plugin-jsx-a11y@6.10.x
prettier@3.6.x + prettier-plugin-astro@0.14.x
withastro/action@v6                # GitHub Pages deploy
```

> **Important deviation from PROJECT.md:** PROJECT.md says "Astro 5". As of today (2026-05-26), Astro 5 has been superseded — current stable is **Astro 6.3.8**. Per the user's stated intent ("latest of everything that plays well together"), the recommendation is Astro 6. Verified `@astrojs/react@5.0.5`, `astro-icon@1.1.5`, `@tailwindcss/vite@4.1.7`, and `withastro/action@v6` all support Astro 6 today. Confirm with the user before locking — otherwise treat all Astro-6-specific notes as also applying to Astro 5 latest (5.18.2).

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Astro** | `6.3.8` | Static-first web framework with islands architecture | Zero-JS-by-default static output is exactly the deploy story for GitHub Pages. Content Layer (built into Astro 5+, refined in 6) gives typed collections natively — no extra CMS, no API. Islands let us keep React available *only* where genuinely interactive. Current site has zero client-side interactivity, so most pages ship 0 KB of JS. |
| **React** | `19.2.6` | UI library for interactive islands only | User asked for latest. `@astrojs/react@5.0.5` declares `react: ^17 \|\| ^18 \|\| ^19` so 19 is officially supported. Used **only** for islands (e.g., mobile nav toggle if scope grows). Default to `.astro` components for everything else. |
| **react-dom** | `19.2.6` | DOM bindings for React | Must match `react` major. |
| **@astrojs/react** | `5.0.5` | Astro integration for React | Required to enable `.tsx` islands and `client:*` directives. Added via `npx astro add react`. |
| **TypeScript** | `5.9.x` (resolved by Astro) | Type-checked source, schema-typed Content Layer | Strict mode catches resume-data errors at build (the M1 concern in `.planning/codebase/CONCERNS.md` about "missing JSON keys silently breaking render"). Astro ships its own `tsconfig.json` presets — extend `"astro/tsconfigs/strict"` (or `"strictest"`). |
| **Tailwind CSS** | `4.1.7` | Utility-first styling | Replaces Bootstrap 4 CDN + 186 KB `App.css`. CSS-first `@theme` directive means no `tailwind.config.js` for a small site. JIT engine + automatic content detection (no `content: []` array in v4) is sized for this scope. |
| **@tailwindcss/vite** | `4.1.7` | Vite plugin for Tailwind v4 | **This is the correct integration path for Tailwind v4 with Astro 5+** — see "Tailwind v4 setup difference" below. |
| **astro-icon** | `1.1.5` | Bundled icon component | Inlines SVGs from Iconify JSON sets at build time. Single dependency replaces all three icon CDNs (Font Awesome, Devicon, Iconify). |
| **@iconify-json/simple-icons** | latest (`15.x`) | Brand icon set (GitHub, LinkedIn, GitLab, etc.) | Today's site uses Font Awesome 5 brand icons for social links — Simple Icons is the modern equivalent (BSD-licensed, official brand SVGs). |
| **@iconify-json/devicon** | latest (`1.x`) | Tech-stack icon set (Python, React, Docker, etc.) | Mirrors the existing `devicon-*` class usage in `Skills.jsx`, with the same SVG source as the CDN, but bundled. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@astrojs/check** | `0.9.9` | CLI type-checker for `.astro` files | Run `astro check` in CI / as a build gate. Reports TS + template errors. |
| **@astrojs/sitemap** | `3.7.3` | Generate `/sitemap.xml` | Optional but cheap. Skip if not wanted for M1. |
| **sharp** | `0.34.5` | Image optimization (Astro `<Image>` and `<Picture>`) | Already a transitive Astro dep. Needed if you migrate the 4.8 MB `emotion.png` / 1 MB `profilepic.jpg` to Astro's `<Image>` component for automatic resize/AVIF/WebP. Strongly recommended given current page-weight problems documented in `CONCERNS.md`. |
| **vitest** | `3.2.x` | Test runner | Use `getViteConfig()` from `astro/config` to share Astro's Vite pipeline. One smoke test asserting render output is enough for M1 scope. |
| **@testing-library/react** | `16.3.2` | Render React islands in tests | Only if testing a React island. Supports React 19 since v16.1. Skip if the M1 smoke test only verifies an `.astro` page renders. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **eslint@9.38.x** | Flat-config linter | Required by Astro/TS plugins in 2026; legacy `.eslintrc.*` is no longer supported. Config file: `eslint.config.js`. |
| **typescript-eslint@8.46.x** | TS rules for ESLint flat config | Use the `tseslint.config(...)` helper from `typescript-eslint`. |
| **eslint-plugin-astro@1.4.x** | Lint `.astro` files | Provides recommended preset and an a11y preset. |
| **eslint-plugin-jsx-a11y@6.10.x** | Accessibility lint rules for JSX | Pairs with the `.claude/CLAUDE.md` WCAG 2.1 AA requirement. Apply to `**/*.{jsx,tsx}` only. |
| **eslint-plugin-react@7.37.x** | React-specific rules | Set `settings.react.version: 'detect'`. |
| **eslint-plugin-react-hooks@7.1.x** | Hook rules (rules-of-hooks, exhaustive-deps) | Add even for "no client state" sites — cheap insurance. |
| **prettier@3.6.x** | Code formatter | |
| **prettier-plugin-astro@0.14.x** | Astro file formatter | Add to `prettier.config.js` `plugins`. |
| **eslint-config-prettier@10.1.x** | Turn off ESLint rules that conflict with Prettier | Append to flat config last. |
| **globals@17.6.x** | Browser/Node globals for ESLint | `globals.browser`, `globals.node`. |

## Installation

Use **`npx astro add ...`** wherever possible — it patches `astro.config.mjs`, installs the integration, and updates `tsconfig.json` in one shot. Run `npm install` for everything else.

```bash
# 1. Bootstrap with the official starter (TypeScript strict)
npm create astro@latest -- --template minimal --typescript strict --install --git

# 2. React 19 + Tailwind v4 integrations (Astro adds + configures them)
cd <project>
npx astro add react tailwind     # installs @astrojs/react + tailwindcss + @tailwindcss/vite

# 3. Icons (single bundled replacement for FA / Devicon / Iconify CDNs)
npx astro add icon               # installs astro-icon and patches astro.config.mjs
npm install -D @iconify-json/simple-icons @iconify-json/devicon

# 4. Vitest smoke test
npm install -D vitest@^3

# 5. Optional — only if a smoke test actually renders a React island
npm install -D @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^29

# 6. Lint + format (flat config)
npm install -D \
  eslint@^9 \
  typescript-eslint@^8 \
  eslint-plugin-astro@^1 \
  eslint-plugin-jsx-a11y@^6 \
  eslint-plugin-react@^7 \
  eslint-plugin-react-hooks@^7 \
  eslint-config-prettier@^10 \
  globals@^17 \
  prettier@^3 \
  prettier-plugin-astro@^0.14

# 7. Type-check CLI (added by Astro starter; if missing, add explicitly)
npm install -D @astrojs/check@^0.9 typescript@^5
```

## Critical Setup Differences from "Old Conventions"

These four call-outs are the single biggest source of stale-tutorial confusion in 2026. Get them right at scaffolding time.

### 1. Tailwind v4 with Astro — NOT `@astrojs/tailwind`

The `@astrojs/tailwind` integration **was last published 2024-09 (v6.0.2) and is Tailwind v3 only**. It pulls in `autoprefixer` + `postcss-load-config` and assumes a `tailwind.config.js`. **Do not install it.**

For Tailwind v4, use the official Vite plugin route (which Astro `astro add tailwind` now scaffolds since Astro 5.2):

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://rashmil-1999.github.io",
  // No `base` needed — this is a <username>.github.io user-site repo, serves at /.
  output: "static",
  integrations: [react(), icon({ include: { "simple-icons": ["*"], devicon: ["*"] } })],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* CSS-first config — no tailwind.config.js needed.
     Tokens here become both CSS variables AND utility classes
     (e.g., bg-brand, font-display, text-display-2xl). */
  --color-brand: oklch(0.62 0.18 240);
  --font-display: "Saira Extra Condensed", system-ui, sans-serif;
  --font-body: "Muli", system-ui, sans-serif;
}
```

```astro
---
// src/layouts/Base.astro
import "../styles/global.css";
---
```

### 2. Astro Content Layer (current) vs legacy Content Collections (deprecated API surface)

Astro 5 introduced the **Content Layer API**: collections defined in `src/content.config.ts` with **`loader` functions** (e.g., `glob()`, `file()`) instead of the implicit filesystem-based collections of Astro 3/4. The legacy "put markdown in `src/content/<collection>/`" pattern still *works* in Astro 5/6 for backwards compatibility but is no longer the recommended path — the Content Layer is what M2's editing surface should target.

For this project's mixed markdown-frontmatter + YAML shape:

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image().optional(),     // typed Astro image asset
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    tech: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: z.string(),             // "2023-06" — keep simple for now
    end: z.string().nullable(),    // null = current
    location: z.string().optional(),
  }),
});

// YAML single-file collections (about / skills / links)
const about = defineCollection({
  loader: file("./src/content/about.yaml"),  // returns one entry per top-level key
  schema: z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    tagline: z.string(),
    /* ... */
  }),
});

export const collections = { projects, work, about /* + education, leadership, testimonials, skills, links */ };
```

Two notes:
- File is `src/content.config.ts` (Astro 5+), not the older `src/content/config.ts`. Both still resolve, but `src/content.config.ts` is the documented current location.
- `glob()` and `file()` are imported from `astro/loaders` — they are the two loaders you'll use; you don't need a community loader for a portfolio.

### 3. React 19 islands — keep them rare and lazy

`@astrojs/react@5.0.5` officially supports React 19. The existing components in `src/components/*.jsx` are **100% presentational** (verified in `.planning/codebase/ARCHITECTURE.md`) — port every one of them to `.astro` and reach for React **only** when you add real interactivity.

If/when you do add an island (the most likely candidate is a mobile-nav toggle to replace the broken jQuery collapse):

| Directive | Use For |
|-----------|---------|
| `client:visible` | Below-the-fold interactive widgets (none in this site today) |
| `client:idle` | Optional / non-critical interactivity (analytics widget, etc.) |
| `client:media="(max-width: 768px)"` | **Mobile nav toggle** — hydrates only on mobile viewports, ships 0 JS to desktop. Recommended for this site. |
| `client:load` | Avoid unless truly needed at first paint |
| `client:only="react"` | Skip SSR; needed for components that touch `window` at render |

### 4. Icon strategy — one library, build-time inlining, no CDN

Replace the three CDN icon systems (`Font Awesome 5`, `Devicon @master`, `Iconify 1.0.7`) with **`astro-icon` + Iconify JSON sets**. `astro-icon` resolves names like `simple-icons:github` against the installed `@iconify-json/*` packages and inlines the SVG at build time — zero runtime JS, no CDN dependency, version-pinned.

```astro
---
import { Icon } from "astro-icon/components";
---
<a href="https://github.com/rashmil-1999" aria-label="GitHub">
  <Icon name="simple-icons:github" class="h-6 w-6" />
</a>

<!-- Skills section -->
<Icon name="devicon:python" class="h-8 w-8" />
<Icon name="devicon:react" class="h-8 w-8" />
```

Two cleanup wins this gets you "for free":
- Icon-only anchors get a real `aria-label` (current site has no `aria-label` on social icons — see `CONCERNS.md` "no accessibility validation").
- The hand-maintained `image_map` in `Projects.jsx` does not apply to icons — but you should treat project thumbnails the same way: put them under `src/assets/projects/` and import via Astro's `<Image>` (via `sharp`) so the broken-image footgun and the 4.8 MB `emotion.png` problem both disappear.

## Vitest Setup (one smoke test)

`vitest.config.ts` should reuse Astro's Vite resolution so imports of `astro:content`, asset URLs, etc., resolve in tests:

```ts
// vitest.config.ts
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "node",        // bump to "jsdom" only if testing a React island
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

For an Astro-page smoke test, use the **Container API** (Astro 4.9+, refined in 5/6):

```ts
// src/pages/index.test.ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import Index from "./index.astro";

test("home page renders all eight resume sections", async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Index);
  for (const id of ["about", "education", "work", "skills", "projects", "leadership", "testimonials"]) {
    expect(html).toContain(`id="${id}"`);
  }
});
```

This is the entire test scaffold M1 needs — one file, one assertion that the page composes correctly. The `astro build` step in CI provides the rest of the regression net.

## ESLint Flat Config (the 2026 shape)

```js
// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist/", ".astro/", "node_modules/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs["jsx-a11y-recommended"],
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",  // not needed for React 17+
    },
  },
  prettier,  // MUST be last
);
```

```js
// prettier.config.js
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
};
```

## GitHub Actions Deploy

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v6
        # Defaults: package-manager auto-detected from lockfile, Node 22.
        # No `path`, `node-version`, or `package-manager` overrides needed.

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Two repo-side prerequisites that are easy to forget:
1. In GitHub repo Settings → Pages, set **Source: GitHub Actions** (not "Deploy from a branch"). This replaces the old `gh-pages` branch flow entirely — delete the `gh-pages` package dependency and the `predeploy`/`deploy` npm scripts.
2. The default branch should be the deploy branch (current repo has `master` and a separate `gh-pages` branch). Push to `master`; GH Actions handles the rest.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro 6 | Astro 5.18.2 (last 5.x) | If you want to strictly honor "Astro 5" wording in PROJECT.md. Same code, same integrations. Pin to `astro@~5.18.2`. |
| `@tailwindcss/vite` | `@astrojs/tailwind@6.0.2` | Only if you must stay on Tailwind **v3** (e.g., a third-party component library that hasn't migrated). Not applicable here. |
| `astro-icon` | `unplugin-icons` | If you wanted icons inside React/Vue/Svelte components more than `.astro` files. Astro-side this site = `astro-icon` wins. |
| `astro-icon` | `@iconify/react` | Only inside React islands. Same data source (Iconify), but adds runtime JS. Don't ship it for a static-by-default site. |
| Vitest | Jest, Playwright, Mocha | Jest has no first-class Vite/Astro story in 2026. Playwright is excellent for e2e but overkill for a one-test smoke. Use Playwright in M2 if visual regression matters. |
| ESLint 9 flat config | ESLint 8 + `.eslintrc.js` | ESLint 8 is EOL. All plugins above require flat config. |
| GitHub Pages + `withastro/action` | Cloudflare Pages, Netlify, Vercel | Cloudflare/Netlify give edge functions and preview deploys. But constraints in PROJECT.md explicitly keep this on GitHub Pages — don't introduce a new platform during a modernization. |
| User-site repo, no `base` | Project-repo with `base: '/Rashmil-1999.github.io/'` | Not applicable. Repo *is* `<username>.github.io`, so Pages serves at the domain root — never set `base`. (Setting `base` here is the single most common "Astro on GitHub Pages 404s" footgun.) |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **`@astrojs/tailwind`** | Tailwind v3 only. Last published Sept 2024. Pulls in `autoprefixer` and `postcss-load-config` that v4 doesn't need. | `@tailwindcss/vite` + `@import "tailwindcss"` in a single CSS file. |
| **`tailwind.config.js`** | Not needed in v4. CSS-first `@theme` directive replaces it. | `@theme { ... }` block inside `global.css`. |
| **Legacy `src/content/config.ts`** | Older Content Collections location. Still works for back-compat but not the documented path. | `src/content.config.ts` with `loader:` properties on every collection (`glob()` / `file()` from `astro/loaders`). |
| **CDN-loaded Font Awesome / Devicon / Iconify** | First paint depends on three third-party CDNs; no SRI; `devicon@master` is unpinned; runtime JS for Iconify; a11y labels absent. All called out in `.planning/codebase/CONCERNS.md`. | `astro-icon` + `@iconify-json/simple-icons` + `@iconify-json/devicon`, inlined SVG at build. |
| **`gh-pages` npm package** | Local-machine deploy is a single point of failure (the wrong dev's lockfile gets shipped). Already paired with dual lockfiles in this repo. | `withastro/action@v6` + `actions/deploy-pages@v4` in `.github/workflows/deploy.yml`. Delete `gh-pages` from `package.json` and the `predeploy`/`deploy` scripts. |
| **Bootstrap 4 / 5 / `react-bootstrap`** | Brings back the same CDN + jQuery + global-CSS pattern this milestone is removing. | Tailwind v4 utilities. |
| **`react-scroll`, `react-script-tag`** | Both are dead code in the current repo (confirmed in `CONCERNS.md`). Native CSS `scroll-behavior: smooth` + `IntersectionObserver` for scroll-spy is one short Astro `<script>` block, zero deps. | Native browser APIs in a small `src/scripts/scroll-spy.ts`, loaded with `<script>` (no `is:inline`) so Astro bundles it. |
| **jQuery / Bootstrap JS** | EOL, mixes with React-owned DOM. | None — Astro `<script>` blocks for the tiny amount of native JS this site needs. |
| **Jest** | No first-class Astro/Vite story; React 19 support shipped late; Astro Container API examples are all Vitest. | Vitest 3 via `getViteConfig()`. |
| **Yarn Classic** | Repo currently has both `package-lock.json` and `yarn.lock`. The deploy action auto-detects from whichever lockfile exists. | npm 10 (Node 22 default). Delete `yarn.lock`. |
| **Service worker (`src/serviceWorker.js`)** | PROJECT.md explicitly excludes PWA from M1. The file is already unregistered. | Delete the file and the `unregister()` call. |
| **`src/App.css` (186 KB)** | Inlined Bootstrap 4 + theme; opaque to Tailwind. | Delete. Re-derive any layout-specific styles into `src/styles/global.css` (`@theme` for tokens, `@layer components` for the few hand-rolled rules). |
| **`public/CNAME`** | `rashmilpanchani.me` is no longer registered (PROJECT.md "Context"). Keeping it routes traffic to nowhere. | Delete the file. Astro on the user-site repo serves at `https://rashmil-1999.github.io/` automatically. |

## Stack Patterns by Variant

**If the user accepts Astro 6 (recommended):**
- Pin `astro@~6.3.8`, follow this document as-is.
- Get `astro check` + Content Layer + Container API improvements from 5→6 for free.

**If the user insists on "Astro 5" literally:**
- Pin `astro@~5.18.2` (last 5.x). Everything else in this document is unchanged — `@astrojs/react@5.0.5`, `@tailwindcss/vite@4.1.7`, `astro-icon@1.1.5`, `withastro/action@v6` all support Astro 5 and 6.

**If a future milestone adds CMS-style editing (M2):**
- Stay on the Content Layer API. Two viable additions: (a) Decap CMS / Sveltia CMS pointed at the same `src/content/` markdown files (git-based; zero backend), or (b) a custom Astro server route + GitHub App. Either way, the per-file markdown-frontmatter shape recommended above is the input both expect.

**If image weight regresses again (current site has a 4.8 MB image, see `CONCERNS.md`):**
- Move all assets into `src/assets/` (not `public/`), reference them as `image: ./foo.png` in collection frontmatter, and render with Astro's `<Image>` / `<Picture>` components. `sharp` is already on disk via Astro.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `astro@6.x` | `vite@6` or `vite@7` | Astro 6 ships its own Vite; do not install Vite directly. |
| `@astrojs/react@5.0.5` | `react@^17 \|\| ^18 \|\| ^19`, `react-dom` same | Verified via `npm view @astrojs/react peerDependencies` on 2026-05-26. |
| `@tailwindcss/vite@4.1.7` | `vite@^5.2 \|\| ^6 \|\| ^7 \|\| ^8` | Wide range; will work with whatever Vite Astro 6 ships. |
| `tailwindcss@4.x` + `@tailwindcss/vite@4.x` | Must share the same major+minor | If you bump one, bump the other. |
| `astro-icon@1.1.5` | `astro@>=4` | Works under Astro 5 and 6. |
| `@iconify-json/*` | `astro-icon@1.x` | Each set is its own package; install only the ones you use. |
| `vitest@3.x` | `vite@^5 \|\| ^6 \|\| ^7` | Use `getViteConfig()` so versions track Astro's bundled Vite. |
| `eslint@9.x` | `typescript-eslint@^8`, `eslint-plugin-astro@^1`, `eslint-plugin-jsx-a11y@^6`, `eslint-plugin-react@^7`, `eslint-plugin-react-hooks@^7` | All listed plugins ship flat-config presets. ESLint 8 → 9 was a hard cut; mixing 8-only configs with 9 will throw. |
| `@testing-library/react@16.3.2` | `react@^19` | React 19 support landed in 16.1, refined through 16.3.2 (Jan 2026). |
| `withastro/action@v6` | Node 22 default | Auto-detects `npm`/`pnpm`/`yarn`/`bun` from the lockfile. Don't pass `node-version` unless overriding. |

## Sources

- `npm view <package> version / time / peerDependencies` — primary source for every pinned version above; queried on 2026-05-26. **HIGH** confidence.
- Astro docs — Styling (Tailwind v4 setup): https://docs.astro.build/en/guides/styling/ — **HIGH** confidence; verified `npx astro add tailwind` installs `@tailwindcss/vite`, not `@astrojs/tailwind`.
- Astro docs — Content Collections / Content Layer: https://docs.astro.build/en/guides/content-collections/ — **HIGH** confidence; verified `glob()` and `file()` loaders, `src/content.config.ts` location, build-time vs. live collections distinction.
- Astro docs — Deploy to GitHub Pages: https://docs.astro.build/en/guides/deploy/github/ — **HIGH** confidence; verified `withastro/action@v6`, required permissions, Node 22 default, lockfile-based PM detection.
- Astro docs — React integration: https://docs.astro.build/en/guides/integrations-guide/react/ — **HIGH** confidence; verified install command and tsconfig requirements. React 19 peer support also verified directly via `npm view @astrojs/react peerDependencies`.
- Astro docs — Client directives reference: https://docs.astro.build/en/reference/directives-reference/ — **HIGH** confidence; verified `client:media` semantics for the mobile-nav recommendation.
- Tailwind v4 — Astro install guide: https://tailwindcss.com/docs/installation/framework-guides/astro — **HIGH** confidence; verified exact two-package install (`tailwindcss` + `@tailwindcss/vite`) and `@import "tailwindcss"` pattern.
- Tailwind v4 — Theme: https://tailwindcss.com/docs/theme — **HIGH** confidence; verified `@theme` directive semantics, `--color-*` / `--font-*` namespaces, that variables both define tokens and emit utility classes.
- `astro-icon` GitHub repo (Nate Moore): https://github.com/natemoo-re/astro-icon — **HIGH** confidence; verified v1.1.5 (Dec 2024), Iconify JSON set usage pattern, `include` config option for tree-shaking specific icons.
- `@testing-library/react` releases: https://github.com/testing-library/react-testing-library/releases — **HIGH** confidence; verified v16.3.2 (Jan 2026), React 19 support in 16.1+.
- GitHub API for `withastro/action` latest release: `https://api.github.com/repos/withastro/action/releases/latest` — **HIGH** confidence; latest tag at query time is v6.1.1 (Apr 2026), `v6` floating tag is the documented pin.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Pinned versions | HIGH | Every version verified live against npm registry on 2026-05-26. |
| Tailwind v4 integration path | HIGH | Two independent sources (Astro styling docs + Tailwind framework guide) and the dist-tag/last-published date on `@astrojs/tailwind` all agree: `@tailwindcss/vite` is the path; `@astrojs/tailwind` is v3-only. |
| Content Layer vs legacy | HIGH | Astro 5 release notes and current Content Collections docs both reference `loader:` + `astro/loaders` as the current API. |
| React 19 + `@astrojs/react@5.0.5` | HIGH | Peer-dep range `^17 || ^18 || ^19` confirmed directly via npm. |
| Astro 5 vs 6 recommendation | MEDIUM | The "Astro 5" wording in PROJECT.md may be intentional. Recommendation defaults to Astro 6 with a clear opt-out to 5.18.2 — needs user confirmation. |
| Icon strategy | HIGH | `astro-icon` + Iconify is the canonical Astro pattern; replaces all three current CDN systems with one bundled, accessible alternative. |
| Vitest + Container API | HIGH | Astro docs explicitly call out `getViteConfig()` and the Container API as the supported test path. |
| GitHub Actions workflow | HIGH | Workflow shape directly from official Astro deploy guide; permissions, concurrency, and the two-job split are the documented recipe. |

---

*Stack research for: static personal portfolio on Astro + React + Tailwind v4 + GitHub Pages*
*Researched: 2026-05-26*
