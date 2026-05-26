# Pitfalls Research

**Domain:** Astro 5 + React 19 (islands) + Tailwind v4 + TypeScript strict portfolio on GitHub Pages (user-site repo)
**Researched:** 2026-05-26
**Confidence:** MEDIUM-HIGH for Astro 5 / React 19 / GH Pages (well-documented). MEDIUM for Tailwind v4 (newer release, shifting plugin ecosystem). LOW-MEDIUM for the Tailwind-v4 + GH-Pages-user-site combination specifically (limited shared-experience signal — flagged inline).

**Phase legend** (used by roadmap):
- **foundation** = scaffold Astro/TS/Tailwind/lint/CI skeleton
- **content** = Content Layer collections + schemas
- **sections** = porting the 8 resume sections
- **polish** = visual polish, a11y pass, performance
- **deploy** = GitHub Actions + Pages config

**Severity legend:** build-breaking | runtime-breaking | silent-degradation | aesthetic

---

## Critical Pitfalls

### Pitfall 1: Content Layer config file at wrong path or name

**What goes wrong:**
Astro 5 only auto-loads `src/content.config.ts` (or `.mjs`/`.js`). Putting it at `src/content/config.ts` (the Astro 4 location) or inside a collection directory makes Astro silently use a stale config or none at all. Symptom: schema edits don't show up, `getCollection()` returns untyped data or zero entries, types in `.astro/types.d.ts` never regenerate.

**Why it happens:**
Carry-over muscle memory from Astro 4 (`src/content/config.ts`), and migration guides differ on whether the v5 location is hard-required. The dev server keeps serving from `.astro/` cache even after the move.

**How to avoid:**
- Place config at exactly `src/content.config.ts`.
- After moving or first-creating it, delete `.astro/` and restart `astro dev` so types regenerate.
- Add a smoke assertion in the Vitest scaffold: `await getCollection('projects')` returns `length > 0`.

**Warning signs:**
Types come through as `any` or `never`; entries you wrote to `src/content/<collection>/foo.md` don't appear; `.astro/content.d.ts` doesn't list your collections.

**Phase to address:** content

**Severity:** build-breaking (types) / silent-degradation (missing entries)

---

### Pitfall 2: Using the deprecated `type: 'content'` / `type: 'data'` style instead of loaders

**What goes wrong:**
Defining collections with the Astro 4 `type: 'content'` or `type: 'data'` shape works under Astro 5 only via legacy fallback and locks you out of the loader API (glob loader, `file()` loader, custom loaders). The M2 editing-surface goal benefits from the loader API (deterministic entry IDs, image references, live collections). Slugs vs IDs also change: Astro 5 entries expose `id`, not `slug`.

**Why it happens:**
Most stale tutorials still show the v4 style.

**How to avoid:**
Use the loader API explicitly in `src/content.config.ts`:
```ts
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image().optional(),
    tech: z.array(z.string()).default([]),
    link: z.string().url().optional(),
  }),
});

const about = defineCollection({
  loader: file('src/content/about.yaml'),
  schema: z.object({ /* ... */ }),
});

export const collections = { projects, about };
```
Dynamic route files: `src/pages/projects/[...id].astro` (not `[...slug].astro`).

**Warning signs:**
Schema function isn't passed `{ image }`; `entry.slug` references; route files named `[slug]`.

**Phase to address:** content

**Severity:** build-breaking (when migrating to v6 later) / silent-degradation (loses loader features now)

---

### Pitfall 3: `file()` loader schema shape mismatch on existing JSON

**What goes wrong:**
The existing `src/resumeData.json` has top-level keys like `about`, `links`, `resumeData`, `projects`, `testimonials`, `leaderships`. If you point a `file()` loader at a JSON whose top level is an **array**, the schema must describe one **item** (`z.object(...)`), not the array (`z.array(...)`). If you point it at an object, each top-level key becomes one entry. People hand-write `z.array(...)` and get cryptic "expected object" errors.

**Why it happens:**
Intuition says "the file is an array, so my schema should be an array."

**How to avoid:**
- Restructure `resumeData.json` per-collection during the data migration, OR split into per-item markdown/YAML files (preferred — matches M2's editing-surface goal).
- For YAML "single-record" collections (`about`, `skills`, `links`), use `file('src/content/about.yaml')` with `z.object(...)` and consume via `getEntry('about', '<key>')` or `getCollection('about')` depending on the file shape. Verify the shape *in the Astro docs* before writing the schema, not from training data.

**Warning signs:**
Zod errors like `expected object, received array` at build; `getCollection` returning one entry that is itself an array.

**Phase to address:** content

**Severity:** build-breaking

---

### Pitfall 4: Image references in frontmatter not validated / not optimized

**What goes wrong:**
Putting `image: ./hero.png` in a project's frontmatter as a plain string means: (a) Zod doesn't validate the path exists, (b) Astro doesn't pipe the image through its optimizer, (c) `<Image src={entry.data.image} />` ships the original full-size binary. This re-creates the existing site's "5 MB PNG" performance bug under a new stack.

**Why it happens:**
The default `z.string()` is the obvious schema; the `image()` helper is documented but easy to miss.

**How to avoid:**
- Use `schema: ({ image }) => z.object({ cover: image() })` in `src/content.config.ts`.
- Frontmatter image paths are **relative to the markdown file**, not the project root. Co-locate the image with the markdown entry: `src/content/projects/emotion-recognizer/index.md` + `cover.webp` next to it.
- Render with Astro's `<Image src={entry.data.cover} alt="..." widths={[400, 800]} />`, never raw `<img>`.

**Warning signs:**
Frontmatter typed as `string` for an image field; image paths starting with `/` (those are public/ paths that bypass optimization); raw `<img>` tags in section components.

**Phase to address:** content (schema) + sections (rendering)

**Severity:** silent-degradation (perf) — directly mirrors existing CONCERNS.md "5 MB emotion.png" anti-pattern

---

### Pitfall 5: Defaulting React islands to `client:load`

**What goes wrong:**
Marking every interactive component `client:load` hydrates them immediately on page load, which defeats Astro's whole point. For a portfolio whose current components are *all* stateless presentation, even one wrongly-applied `client:load` ships React + ReactDOM + the component bundle on every page view.

**Why it happens:**
`client:load` "just works" — no flicker, no waiting. Other directives feel like premature optimization.

**How to avoid:**
- **Default to zero directives.** If a component has no `useState`/`useEffect`/`onClick`, render it as `.astro`, not React.
- For genuinely-interactive pieces: prefer `client:visible` (below the fold) or `client:idle` (above the fold but not critical).
- Reserve `client:load` for truly critical above-the-fold interactivity (e.g., a navbar toggle that must work in the first 100 ms). This portfolio probably has none — the mobile nav toggle is fine as `client:idle`.
- Add a build-time guard: `grep -r "client:load" src/ | wc -l` in CI; fail if non-zero unless allowlisted.

**Warning signs:**
React imports appear in pages that don't need interactivity; the `dist/_astro/` directory contains React chunks for sections that are static (Education, Work, Testimonials).

**Phase to address:** sections + polish

**Severity:** silent-degradation (perf)

---

### Pitfall 6: Shipping React for static markup (CRA → Astro transliteration)

**What goes wrong:**
Porting `About.jsx`, `Education.jsx`, `Work.jsx`, `Skills.jsx`, `Projects.jsx`, `Leadership.jsx`, `Testimonials.jsx` 1:1 into React components inside `src/pages/index.astro` with `client:load`. Result: a "modernized" site that ships *more* JS than the CRA original because each island now has its own wrapper.

**Why it happens:**
"Same component tree ports unchanged" is true syntactically but wrong architecturally for Astro. The existing components have zero state (per ARCHITECTURE.md "No client state").

**How to avoid:**
- Default port target is `.astro`, not `.tsx`. Astro components support the same JSX-like syntax; props are typed via `Props` interface.
- Reserve `.tsx` for components where M2 will add interactivity (likely the future admin/editing surface).
- Sequence the port: write the `.astro` version first, only convert to React if you discover state.

**Warning signs:**
Every section is a `.tsx` file with `client:*` directive; bundle analyzer shows React in the main chunk for the homepage.

**Phase to address:** sections

**Severity:** silent-degradation (perf) — carry-forward risk from CRA mindset

---

### Pitfall 7: React 19 + `@astrojs/react` version drift causing "Invalid hook call"

**What goes wrong:**
React 19 changed the internal hook dispatcher; an outdated `@astrojs/react` (or a mismatched `react` / `react-dom` pair from a stale lockfile) throws `Invalid hook call` at hydration, even though hook rules aren't being violated. With *both* `package-lock.json` and `yarn.lock` committed today (per CONCERNS.md), the migration is at extra risk of installing skewed versions.

**Why it happens:**
Dependency version misalignment between the React runtime and the framework adapter. Common after `npm install react@19` without bumping `@astrojs/react`.

**How to avoid:**
- Delete `yarn.lock` and standardize on npm before installing Astro (single-lockfile constraint from PROJECT.md).
- Install React 19 and the React integration **together**: `npx astro add react`, then verify `package.json` has matching `react@^19`, `react-dom@^19`, and a `@astrojs/react` that explicitly supports React 19 in its CHANGELOG.
- Pin React/React-DOM to the same minor: `"react": "19.x", "react-dom": "19.x"`.
- Add a CI sanity check: `npm ls react react-dom @astrojs/react` should not show any "invalid" or "extraneous" lines.

**Warning signs:**
"Invalid hook call" at the *first* hydration, not consistent across all components; `npm ls` shows multiple `react` versions in the tree.

**Phase to address:** foundation

**Severity:** runtime-breaking

---

### Pitfall 8: View Transitions break script re-execution after navigation

**What goes wrong:**
Adding `<ClientRouter />` (View Transitions) makes navigation an SPA-like swap rather than a full page load. Module scripts that ran once on initial load don't run again on subsequent navigations — top-level `const` redeclarations throw `Identifier 'x' has already been declared`. Inline scroll-spy / smooth-scroll JS, if hand-written, will silently stop working after the first navigation.

**Why it happens:**
Astro's default `<script>` is bundled-once. View Transitions intentionally skips re-execution to preserve SPA semantics.

**How to avoid:**
- For M1 the site is **single-page anchor navigation** — View Transitions provides essentially no benefit and can be omitted entirely. Recommend: do not add `<ClientRouter />` in M1.
- If added anyway: wrap initialization in `document.addEventListener('astro:page-load', init)` so it runs on every navigation. Guard global state with `if (!window.__myInit)` patterns.
- Never use top-level `const`/`let` in `<script>` blocks that might re-execute.

**Warning signs:**
"Identifier has already been declared" in console after the second navigation; behaviors work on first load and silently stop afterward.

**Phase to address:** foundation (decide whether to use it) / polish (if introduced)

**Severity:** runtime-breaking

**Confidence:** HIGH (well-documented Astro issue tracker thread, multiple known issues #7773, #9359, #9798)

---

### Pitfall 9: GitHub Pages trailing-slash redirect tax (also kills relative asset paths)

**What goes wrong:**
GitHub Pages **always** 301-redirects `/foo` → `/foo/` for directory-style URLs. Astro's default `trailingSlash: 'ignore'` happily generates internal links without trailing slashes. Every internal click then pays a 301 round-trip (~60% page-load penalty in tests). Worse, if the redirected page has relative asset paths, the browser resolves them against the wrong base after the redirect, breaking images.

**Why it happens:**
Astro and GitHub Pages disagree on trailing-slash policy by default, and the symptom is invisible in dev.

**How to avoid:**
Set in `astro.config.mjs`:
```js
export default defineConfig({
  site: 'https://Rashmil-1999.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
```
Generate internal links via `<a href={Astro.url.pathname}>` or `<a href="/about/">` (with trailing slash). For a single-page anchor site, this risk is small but `#anchor` links should be `/#anchor`, not `/index.html#anchor`.

**Warning signs:**
Network tab shows 301s on internal navigation; Lighthouse scores oddly low on a single static page; images visible in dev but 404 in production.

**Phase to address:** deploy (config) + sections (link conventions)

**Severity:** silent-degradation (perf) — small impact for this single-page site, but free to fix

**Confidence:** HIGH

---

### Pitfall 10: Setting `base` on a user-site repo

**What goes wrong:**
On a `<username>.github.io` repo, the site serves at root (`/`). Setting `base: '/Rashmil-1999.github.io/'` (common copy-paste from project-repo guides) makes every asset path resolve to `https://Rashmil-1999.github.io/Rashmil-1999.github.io/...` and breaks everything.

**Why it happens:**
Most Astro-on-GitHub-Pages guides assume a project repo. The repo name and the user-site URL collide visually.

**How to avoid:**
For a user-site repo (this one), **omit `base` entirely** (or set `base: '/'`). Set only `site: 'https://Rashmil-1999.github.io'`. PROJECT.md already locks this in — make the roadmap surface it as an explicit acceptance criterion in the deploy phase.

**Warning signs:**
404s on every CSS/JS/image at production URL but works locally; assets URL doubles the repo name.

**Phase to address:** deploy

**Severity:** build-breaking (deployment unusable)

**Confidence:** HIGH

---

### Pitfall 11: Wrong / split Pages source (branch vs Actions)

**What goes wrong:**
The "Pages source" setting in repo settings is **Deploy from branch** today (because `gh-pages` package pushes to a branch). Switching to GitHub Actions deployment requires *also* changing the source to "GitHub Actions" in Settings → Pages. Forgetting this means the Actions workflow runs green but the live site never updates (still serving from `gh-pages` branch).

**Why it happens:**
The source setting lives in repo Settings, not in any file in the repo. Easy to miss in a code-only migration.

**How to avoid:**
- In Settings → Pages, set "Build and deployment → Source" to "GitHub Actions" **before** removing the `gh-pages` package and `npm run deploy` script.
- Document this step in the deploy phase's checklist.
- After the first Actions deploy succeeds, delete the `gh-pages` branch to avoid confusion.

**Warning signs:**
Workflow shows green; live site shows old content; `gh-pages` branch still exists with old `build/` output.

**Phase to address:** deploy

**Severity:** silent-degradation (deploy is a no-op)

---

### Pitfall 12: Missing `permissions` block on the deploy workflow

**What goes wrong:**
`actions/deploy-pages` requires `pages: write` and `id-token: write` permissions. Without them the workflow fails with a cryptic OIDC token error or 403 on the deploy step.

**Why it happens:**
Default `GITHUB_TOKEN` permissions are read-only on many repos; the workflow doesn't inherit Pages-write by default.

**How to avoid:**
The workflow must include:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false
```
Use the official combo: `withastro/action` for build → `actions/deploy-pages@v4` for deploy. Target the `github-pages` environment.

**Warning signs:**
"Resource not accessible by integration" or "Error: Failed to create deployment" in the Actions log.

**Phase to address:** deploy

**Severity:** build-breaking (deploy step)

**Confidence:** HIGH

---

### Pitfall 13: Tailwind v4 `--color-*` naming requirement

**What goes wrong:**
Defining custom theme variables in `@theme` without the `--color-` prefix (e.g., `--primary-500: #...`) means Tailwind doesn't recognize them as colors and doesn't generate `bg-primary-500` / `text-primary-500` utilities. Variants like `dark:` don't pick them up.

**Why it happens:**
v3's `theme.extend.colors` accepted arbitrary keys; v4's CSS-first config uses naming conventions (`--color-*`, `--font-*`, `--spacing-*`) as the "namespace."

**How to avoid:**
```css
@import "tailwindcss";

@theme {
  --color-brand-500: #2563eb;
  --font-display: "Saira Extra Condensed", sans-serif;
}
```
Reference the [Tailwind v4 theme variable namespaces docs](https://tailwindcss.com/docs/theme) when adding any custom property.

**Warning signs:**
Custom color utilities don't generate; `bg-brand-500` produces no CSS; IDE Tailwind plugin shows the class as "unknown."

**Phase to address:** foundation

**Severity:** silent-degradation (custom theme silently doesn't work)

---

### Pitfall 14: Tailwind v4 default border color changed (currentColor)

**What goes wrong:**
In v3, `border` defaulted to `gray-200`. In v4, it defaults to `currentColor`. Existing v3-style snippets that use `<div class="border">` now render with the *text* color as the border — usually black, sometimes invisible against a dark text element, frequently a visual regression compared to the v3 default.

**Why it happens:**
A deliberate v4 breaking change that quietly inverts a visual expectation.

**How to avoid:**
- Audit every `border` / `border-*` utility (without a color suffix) during the visual port. Add an explicit color: `border border-gray-200`.
- Or restore the v3 default by setting `--default-border-color: --color-gray-200;` in `@theme`.

**Warning signs:**
Borders appear in unexpected colors; some borders look invisible; the site looks "off" but you can't pinpoint it.

**Phase to address:** polish

**Severity:** aesthetic

**Confidence:** HIGH

---

### Pitfall 15: Tailwind default gray scale fails WCAG AA

**What goes wrong:**
The site's CLAUDE.md mandates WCAG 2.1 AA (4.5:1 for normal text). Common Tailwind defaults that *fail* AA on white:
- `text-gray-400` (≈ 2.85:1) — fails
- `text-gray-500` (≈ 4.13:1) — fails
- `text-gray-600` (≈ 5.74:1) — passes
- `text-gray-700` and darker — pass comfortably

Designers and templates lean on `text-gray-400`/`text-gray-500` for "secondary text" and "captions." Using them out of habit produces a site that looks like the existing one (visually similar) but fails contrast audits the project explicitly committed to passing.

**Why it happens:**
The numeric step doesn't communicate contrast; "500 is the middle, so it's neutral" is wrong.

**How to avoid:**
- Establish a project rule: body and secondary text must be `gray-700` or darker on `white`/`gray-50`/`gray-100` backgrounds.
- Add an automated check: run `pa11y` or `axe-core` against `dist/index.html` in CI for the deploy phase.
- Spot-check with a contrast tool (e.g., the [Tailwind Contrast Checker](https://tailwindcolor.tools/tailwind-contrast-checker)) when picking utility classes.

**Warning signs:**
Lighthouse a11y < 100 with "contrast" violations; axe DevTools flags multiple text nodes.

**Phase to address:** polish (a11y pass) + deploy (CI gate)

**Severity:** silent-degradation (a11y requirement)

**Confidence:** HIGH

---

### Pitfall 16: Tailwind v4 dark mode setup differs from v3 (no `darkMode: 'class'`)

**What goes wrong:**
PROJECT.md marks dark mode out of scope for M1, but the default `prefers-color-scheme` query is still active in v4. If anyone authors `dark:` utilities (even by copying snippets from the web), they'll flip on macOS users with dark system theme without intent.

**Why it happens:**
v4 makes dark variant active by default via `@media (prefers-color-scheme: dark)`. There's no longer a `tailwind.config.js` to inspect for the policy.

**How to avoid:**
- Don't author any `dark:` utilities in M1.
- If you accidentally inherit one from a copy-paste, the visible behavior surfaces only when you toggle OS theme — test once with macOS Dark mode enabled before declaring polish complete.
- If M2 needs class-based dark mode, the v4 incantation is `@custom-variant dark (&:where(.dark, .dark *));` in CSS, **not** a JS config key.

**Warning signs:**
Site looks fine for you, looks broken for a reviewer using dark system mode.

**Phase to address:** polish

**Severity:** aesthetic / silent-degradation

---

### Pitfall 17: TypeScript strict mode hides Astro implicit-any in `.astro` files

**What goes wrong:**
TS strict catches the obvious cases, but `Astro.props` defaults to `Record<string, any>` unless you declare a `Props` interface. Section components ported from JSX often arrive with no type for their props, so `Astro.props.something` is implicitly `any` — TypeScript silently accepts it under strict because the source is `any`, not undefined.

**Why it happens:**
Astro's `Props` interface is declarative (an interface in the script section, not a function parameter). Easy to miss when copying from React `({ foo, bar }: Props) =>` patterns.

**How to avoid:**
Every `.astro` component starts with:
```astro
---
interface Props {
  title: string;
  count?: number;
}
const { title, count = 0 } = Astro.props;
---
```
For dynamic-route props, use the helpers explicitly:
```astro
---
import type { GetStaticPaths, InferGetStaticPropsType } from 'astro';
export const getStaticPaths = (async () => { /* ... */ }) satisfies GetStaticPaths;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;
const { entry } = Astro.props;
---
```
Enable `astro check` in CI alongside `tsc --noEmit`.

**Warning signs:**
IDE hover shows `any` on `Astro.props`; refactors silently rename props because nothing checks the call site.

**Phase to address:** foundation (tsconfig + CI) + sections (apply consistently)

**Severity:** silent-degradation (type safety)

---

### Pitfall 18: `<StrictMode>` re-introduction in React islands

**What goes wrong:**
Wrapping React islands in `<StrictMode>` inside the island component re-creates the existing `<StrictMode>` placement anti-pattern (ARCHITECTURE.md). In an Astro island context, `<StrictMode>` belongs only inside the React tree that an island renders, and only if you actually want double-invocation in dev. Most islands don't need it, and the v18 placement bug from the original site is easy to carry forward by reflex.

**Why it happens:**
Muscle memory from CRA's `src/index.js`.

**How to avoid:**
- Don't wrap islands in `<StrictMode>`. Astro doesn't add one by default for a reason.
- If you need it for a specific component, place it at the top of that component's JSX, not around the entire app.

**Warning signs:**
`<StrictMode>` in any new `.tsx` island file; double-invocation logs in dev that surprise you.

**Phase to address:** sections

**Severity:** silent-degradation (correctness during dev double-render)

---

### Pitfall 19: Parallel `sections` / `links` arrays carried into Content Layer

**What goes wrong:**
The existing fragility (CONCERNS.md "Parallel `sections` / `links` arrays") — two arrays that must stay aligned by index — gets carried forward if `links` becomes a YAML collection separate from the section it references. Reordering a section then misaligns its nav label.

**Why it happens:**
1:1 port of the JSON structure into YAML/markdown without re-thinking it.

**How to avoid:**
Combine into a single shape during migration:
```yaml
# src/content/nav.yaml
- id: about
  label: About
  order: 1
- id: education
  label: Education
  order: 2
```
Schema enforces unique `id` and non-overlapping `order`. The section renderer reads the same `id` it links to.

**Warning signs:**
Two collections you have to update together; `links[i]` referenced by numeric index in templates.

**Phase to address:** content

**Severity:** silent-degradation (correctness regression risk during edits) — explicit carry-forward from CONCERNS.md

---

### Pitfall 20: `image_map` lookup pattern carried into Astro Projects section

**What goes wrong:**
The existing `Projects.jsx` ships a hand-maintained `image_map: { [key]: import('../assets/x.png') }`. Re-implementing this in Astro (e.g., a static object mapping JSON keys to `import.meta.glob` results) re-creates the two-sources-of-truth fragility — a typo in frontmatter still renders nothing.

**Why it happens:**
Direct port of the existing pattern; treating images as separate from project data.

**How to avoid:**
Put the image **with** the project entry (per-entry directory), schema-validate it with `image()` (Pitfall 4). Astro handles bundling and optimization; no map needed.
```
src/content/projects/
  emotion-recognizer/
    index.md   # frontmatter: cover: ./cover.webp
    cover.webp
```

**Warning signs:**
Any JS object literal mapping keys to image imports; any `import.meta.glob` for images keyed by filename.

**Phase to address:** content + sections — explicit carry-forward from CONCERNS.md

**Severity:** silent-degradation (missing images render blank), maintenance pain

---

### Pitfall 21: jQuery scrollspy pattern → hand-rolled scroll listener in an island

**What goes wrong:**
Replacing the existing jQuery scrollspy with a React `useEffect`-based scroll listener that fires on every `scroll` event re-creates the perf bug class (no `IntersectionObserver`, no `requestAnimationFrame` throttle) and ships React for a sidebar that doesn't need it.

**Why it happens:**
"Just port the jQuery to React" is the obvious move; `IntersectionObserver` requires deliberate API knowledge.

**How to avoid:**
- Write scrollspy as a single Astro `<script>` (not a React island) using `IntersectionObserver` against `<section id>` elements. ~30 lines, zero framework cost, runs once on page load (no View Transitions in M1 → no re-init concern, per Pitfall 8).
- Bonus: native `scroll-behavior: smooth` on `html` is one CSS line and replaces jQuery easing entirely.
- The `active` state needs both color **and** a non-color indicator (left border, weight) — color alone fails WCAG 1.4.1 (CLAUDE.md "Active/selected state").

**Warning signs:**
A React island just for the side nav; `scroll` event listeners without `IntersectionObserver`.

**Phase to address:** sections + polish — explicit carry-forward fix from CONCERNS.md

**Severity:** silent-degradation (perf + a11y)

---

### Pitfall 22: Icon-only nav toggle / social links without `aria-label`

**What goes wrong:**
The existing site already lacks `aria-label` on icon-only social links (CONCERNS.md "No accessibility validation"). Porting the same JSX shape into Astro re-introduces the failure. Tailwind doesn't fix a11y.

**Why it happens:**
Visual completeness ≠ accessible completeness; icon fonts hide the missing label from sighted devs.

**How to avoid:**
- Every `<a>` / `<button>` whose visible child is an icon: `aria-label="GitHub"`, `aria-label="Toggle navigation menu"`, etc.
- Decorative icon elements: `aria-hidden="true"`.
- Add an axe-core CI step that fails on these violations (rules: `button-name`, `link-name`, `aria-allowed-attr`).

**Warning signs:**
`<a href="..."><i class="..."></i></a>` with no surrounding text; axe DevTools "button must have discernible text."

**Phase to address:** sections + polish (CI gate) — explicit carry-forward fix from CONCERNS.md

**Severity:** silent-degradation (a11y) — hard requirement per CLAUDE.md

---

### Pitfall 23: Bloated icon set shipped from a single library import

**What goes wrong:**
The existing site loads all of Font Awesome 5 + Devicon + Iconify CSS (CONCERNS.md "Iconify + Devicon both loaded"). Replacing them with `npm install @fortawesome/fontawesome-free` and importing the bundled CSS ships the same hundreds of KB. Same with `lucide-react` if used naively.

**Why it happens:**
"Bundling instead of CDN" feels like an automatic improvement; people forget tree-shaking only works with named imports.

**How to avoid:**
- Prefer per-icon SVG imports: e.g., `lucide-astro` or `astro-icon` with explicit symbol names. With `astro-icon`'s Iconify on-demand mode, only used glyphs ship.
- Inline critical glyphs as raw `<svg>` files in `src/icons/` (12 icons × <1 KB ea. = trivial weight, fully tree-shakable).
- Verify with bundle analyzer: `dist/_astro/*.css` should not exceed ~20 KB total for icons.

**Warning signs:**
CSS bundle > 50 KB; any import of `fontawesome.css` (the whole stylesheet); `dist/` contains an `iconify` chunk.

**Phase to address:** sections + polish — explicit carry-forward fix from CONCERNS.md

**Severity:** silent-degradation (perf)

---

### Pitfall 24: Forgetting to delete `public/CNAME` from the existing site

**What goes wrong:**
PROJECT.md states the custom domain is being dropped. If `public/CNAME` survives into the new Astro `public/` directory, GitHub Pages serves the site at the (now-unregistered) domain → site is unreachable.

**Why it happens:**
`public/` files are passed through verbatim; easy to copy the whole directory.

**How to avoid:**
- Explicit step in the foundation or deploy phase: do not copy `public/CNAME` (and confirm Settings → Pages has no custom domain configured).
- Carry only `Rashmil_Panchani.pdf`, `favicon.ico`, `robots.txt` (re-evaluated), and a new `manifest.json` (the existing one is the CRA default per CONCERNS.md).

**Warning signs:**
Site URL in Settings → Pages still shows `rashmilpanchani.me`; deploy succeeds but visiting `Rashmil-1999.github.io` redirects to a dead domain.

**Phase to address:** foundation (asset migration) + deploy (settings check)

**Severity:** runtime-breaking (site unreachable)

---

### Pitfall 25: Cache-busting / asset hashing assumed but `public/` files aren't hashed

**What goes wrong:**
Astro hashes filenames for files imported from `src/` (e.g., `dist/_astro/profilepic.abc123.webp`), but copies `public/` files verbatim. The `Rashmil_Panchani.pdf` reference (an existing requirement) lives in `public/` so its URL stays `/Rashmil_Panchani.pdf` forever. If you update the PDF, GitHub Pages' aggressive Cloudflare-fronted caching may serve the old version to returning visitors for hours.

**Why it happens:**
The asset is reasonably in `public/` (it's a binary deliverable, not a build input). The cache stickiness is invisible during development.

**How to avoid:**
- For the PDF: include a version suffix in the link (`/Rashmil_Panchani.pdf?v=2026-05`) — query strings break the cache for clients while keeping the file at the same path.
- Or import the PDF from `src/` so it gets hashed: `import resumeUrl from '../assets/Rashmil_Panchani.pdf?url'` (Vite handles this).
- Document the chosen strategy in the deploy phase so the next PDF update doesn't surprise.

**Warning signs:**
Updated PDF doesn't appear for users; users report old résumé content.

**Phase to address:** content (PDF location decision) + deploy (cache strategy)

**Severity:** silent-degradation (stale content for returning visitors)

**Confidence:** MEDIUM (GitHub Pages cache TTL behavior is documented but not strictly enforced and changes)

---

### Pitfall 26: Custom 404 page not built / wrong status code

**What goes wrong:**
GitHub Pages serves `404.html` from the site root for unknown URLs. If you don't create `src/pages/404.astro`, visitors get GitHub's generic 404. There are also documented Astro issues where 404.astro intermittently doesn't appear in `dist/` and where SSR 404 pages return a 200 status — neither applies to static output, but worth pinning the static-only assertion.

**Why it happens:**
Easy to forget; for a single-page anchor site, "people only ever hit `/`" feels true.

**How to avoid:**
- Create `src/pages/404.astro` with the same layout as the home page and a "Page not found, return home" message.
- Verify it appears in `dist/404.html` after `astro build`.
- Confirm `output: 'static'` (the default) — don't accidentally enable SSR for an unrelated reason.

**Warning signs:**
Generic GitHub 404 in production; `dist/404.html` missing after build.

**Phase to address:** deploy

**Severity:** aesthetic / silent-degradation

---

### Pitfall 27: Branch protection rules blocking the deploy workflow

**What goes wrong:**
If branch protection on `master`/`gh-pages` requires status checks that the new workflow doesn't produce (or requires PR review on a direct push from Actions), deploys silently fail to be authorized.

**Why it happens:**
Repo settings are out of band from code; easy to forget existing protection rules during the deploy switchover.

**How to avoid:**
- Audit Settings → Branches before the deploy phase; remove or update rules to allow the Actions deploy.
- For user-site repos using the modern GitHub Pages flow, deploys come from artifacts (no commit to a branch), so branch protection on `master` is the only concern (don't require linear history if Actions pushes commits — but the modern flow doesn't push, so this is usually moot).

**Warning signs:**
Workflow's "Deploy" step shows a permission error not covered by Pitfall 12; existing branch protection rules visible in Settings.

**Phase to address:** deploy

**Severity:** build-breaking (deploy step)

**Confidence:** MEDIUM (highly repo-specific; verify against the actual repo settings before the deploy phase)

---

### Pitfall 28: `getCollection` filtering at runtime when it should be at build

**What goes wrong:**
Fetching the whole collection and `.filter()`-ing in the template instead of passing the filter to `getCollection`. For this small site the perf cost is negligible, but the *correctness* cost is real: a draft entry that's accidentally rendered into the static HTML can leak. The current static site has no notion of drafts, but a M2 editing surface will, and the pattern set in M1 propagates.

**Why it happens:**
`.filter()` is more familiar than the loader-callback API.

**How to avoid:**
Always pass the predicate to `getCollection`:
```ts
const projects = await getCollection('projects', ({ data }) =>
  import.meta.env.PROD ? data.draft !== true : true
);
```
For M1 with no drafts, the same pattern still applies (the predicate is just `true`), so M2 inherits the structure.

**Warning signs:**
Templates that `await getCollection('x')` then `.filter(...)`; draft entries appearing in production HTML.

**Phase to address:** content (set the convention)

**Severity:** silent-degradation (content correctness once drafts exist)

---

### Pitfall 29: Tailwind v4 `@source` not configured for `.astro` files

**What goes wrong:**
Tailwind v4's automatic source detection covers most file types, but in some setups (especially without the Vite plugin path), it misses `.astro` extensions or files inside untracked directories, producing a CSS bundle with no utilities for content it doesn't see. The site builds, the HTML has the right classes, but the CSS is empty for them — invisible styling regression that's hard to diagnose because dev (with Vite) and prod can disagree.

**Why it happens:**
v4 changed the content scanner; the old `content: [...]` config is gone.

**How to avoid:**
- Use `@astrojs/tailwind` (the official integration) or the official `@tailwindcss/vite` plugin so source detection is wired automatically.
- If utilities are missing, explicitly add `@source "../**/*.{astro,html,ts,tsx}";` at the top of your global CSS.
- Verify by inspecting one generated CSS file in `dist/_astro/` for a class you know is used (e.g., `flex` or `bg-white`).

**Warning signs:**
Classes present in HTML have no matching CSS; dev looks correct but prod doesn't.

**Phase to address:** foundation

**Severity:** silent-degradation (visual regression)

**Confidence:** MEDIUM (the Tailwind v4 + Astro 5 integration pairing is relatively recent; expect rough edges)

---

### Pitfall 30: Vitest "smoke test" that doesn't actually run the build

**What goes wrong:**
PROJECT.md commits to "single Vitest smoke test asserting `astro build` succeeds and each section renders." A common shortcut is to import a component and assert it renders — that doesn't catch Content Layer schema errors, broken image imports, or deploy-config bugs because those happen at *build* time, not render time.

**Why it happens:**
"Test" reflexively means "render-test."

**How to avoid:**
Spawn `astro build` as a subprocess from the test and assert exit code 0 + expected `dist/` outputs:
```ts
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

test('astro build succeeds and emits the expected pages', () => {
  execSync('astro build', { stdio: 'inherit' });
  expect(existsSync('dist/index.html')).toBe(true);
  expect(existsSync('dist/404.html')).toBe(true);
});
```
Then assert section markers exist in `dist/index.html` (`<section id="about">`, etc.) via a string scan.

**Warning signs:**
Test passes locally; CI on a clean clone fails the actual `astro build` due to a missing file or schema mismatch.

**Phase to address:** foundation (test scaffold)

**Severity:** silent-degradation (false sense of safety)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Port every component as React with `client:load` | Familiar mental model, zero rewrites | Ships React for static markup, defeats Astro's value, perf regression vs. CRA in JS bytes | Never on this project — explicitly out of step with PROJECT.md "hybrid component model" |
| Skip the `image()` helper and use `z.string()` for image fields | Schema is shorter | No build-time validation, no optimization, recreates 5 MB-PNG bug | Never — image weight is the existing site's #1 perf issue |
| Keep `resumeData.json` as one giant JSON via `file()` loader | Minimal data migration | M2 editing surface has to parse/rewrite one big file atomically; merge conflicts on every edit | Acceptable only if M2 is cancelled — otherwise per-item files |
| Set `client:load` "just to be safe" | Eliminates hydration-timing bugs from worry list | Defeats islands architecture; ships React per island that doesn't need it | Above-the-fold critical interactivity only — and this site has none |
| Use `<img>` tags from `public/` instead of `<Image />` from `src/assets` | Simpler markup, no optimization config | Unoptimized images, no responsive `srcset`, repeats existing perf bugs | When the image is genuinely served as-is (favicon, OG image needs fixed dimensions) |
| Inline scrollspy/smooth-scroll as a React island | Use the framework you just installed | Ships React for a sidebar; reproduces jQuery-on-React fragility class | Never — IntersectionObserver in a vanilla `<script>` is 30 lines |
| Keep `darkMode: 'class'` muscle memory by adding `dark:` utilities defensively | Future-proofs for theming | Activates `prefers-color-scheme` unintentionally; visual breakage on dark-mode reviewers | Never in M1 — dark mode is out of scope |
| Add View Transitions because it's the shiny Astro feature | "Modern" feel | Script re-execution bugs; pointless on a single-page anchor site | Never in M1 |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `@astrojs/react` + React 19 | Installing React 19 without bumping the integration; mixed `react`/`react-dom` minor versions | `npx astro add react`, single lockfile, pin matching React/React-DOM minors |
| Tailwind v4 + Astro | Using v3-style `tailwind.config.js`; using v3 `@tailwind base/components/utilities` directives | Use `@import "tailwindcss"` + `@theme {}` block in `src/styles/global.css`; install `@tailwindcss/vite` or the Astro integration |
| Content Layer + JSON migration | One-shot `file()` loader on the existing JSON; schema as `z.array(...)` for the top-level array | Per-collection split into markdown/YAML with `glob` loader; `z.object(...)` per entry |
| Content Layer + images | Frontmatter `image: /assets/foo.png` (public path) | Co-locate image with markdown; frontmatter `image: ./foo.webp`; schema uses `image()` |
| `withastro/action` + Pages source setting | Workflow runs green, source still set to "Deploy from branch" | Set Settings → Pages → Source = "GitHub Actions" before the first workflow run; delete the `gh-pages` branch after |
| GitHub Pages + Astro `site`/`base` | Setting `base: '/Rashmil-1999.github.io/'` on a user-site repo | Omit `base` entirely; only set `site: 'https://Rashmil-1999.github.io'` |
| GitHub Pages + trailing slashes | Default `trailingSlash: 'ignore'` triggers 301s on every internal link | Set `trailingSlash: 'always'` and `build.format: 'directory'` |
| Vitest + Astro | Render-tests that don't exercise build-time pipelines | Smoke test that runs `astro build` as a subprocess + scans `dist/` |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| `client:load` on static components | First-Load JS > 50 KB on a page with no interactivity | Default to `.astro`; reserve `client:load` for verified-critical interactivity | At any scale — visible in Lighthouse from page 1 |
| Unoptimized images via `public/` or raw `<img>` | LCP > 2.5 s; CONCERNS.md-style "5 MB PNG" | `src/assets/` + `<Image />` + `image()` schema helper | Single page above ~500 KB total image weight |
| Whole icon library imported (Font Awesome / Devicon CSS) | CSS bundle > 100 KB | `astro-icon` per-glyph, or inline SVGs from `src/icons/` | Any visit on mobile (CSS blocks render) |
| Trailing-slash 301 redirects | 60% Lighthouse perf hit on internal navigation | `trailingSlash: 'always'` + always emit `/foo/` links | Per-click; small for a single-page site, real for multi-page |
| View Transitions on a site that doesn't need it | Script re-execution bugs; +runtime cost; brittle scripts | Don't add `<ClientRouter />` in M1 | First navigation after enabling |
| Bundled Tailwind without source detection | CSS bundle missing utilities → invisible style breakage | Verify `@source` paths; use the official Vite plugin | Production build (dev with Vite usually masks it) |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Re-introducing CDN libraries with no SRI | Supply-chain injection (same as existing site's CDN-loaded jQuery/Bootstrap/FA) | Bundle via npm; no `<script src="https://cdn...">` in templates |
| `<a target="_blank">` without `rel="noopener noreferrer"` | Tab-nabbing on external links (existing About.jsx social links per CONCERNS.md) | Add `rel="noopener noreferrer"` to every `target="_blank"` link; eslint rule `react/jsx-no-target-blank` (or equivalent for `.astro`) |
| Email address as plain `mailto:` text | Easy scraping target (existing pattern per CONCERNS.md, accepted as low risk) | Optional: JS-obfuscate the mailto, or use a forwarding alias |
| Resume PDF indexed by default | Personal info in search results | Confirm `robots.txt` policy intentional; if not, `Disallow: /Rashmil_Panchani.pdf` |
| Action workflow with overly broad `permissions` | Compromised dep can push to repo | Workflow scopes only `contents: read`, `pages: write`, `id-token: write` |
| Skipping Dependabot / npm audit in CI | Vulnerable deps drift in unnoticed (the existing site's 59-vuln story) | Enable Dependabot + `npm audit --omit=dev` as a non-failing CI report |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Anchor jump with no smooth-scroll fallback | Jarring on click; breaks "feels modern" expectation | `scroll-behavior: smooth` on `html`; native, one line of CSS |
| Mobile nav doesn't collapse on link click | Menu stays open after section selection (existing bug per CONCERNS.md) | Component state in the nav island; close on link click |
| Section active state by color only | Fails WCAG 1.4.1; invisible to color-blind users | Combine bold + left border + `aria-current="true"` (CLAUDE.md rule) |
| Trailing space in name renders double-spaced (`Rashmil  Panchani`) | Visible typo | Trim during migration; schema rejects trailing whitespace via `.transform(s => s.trim())` |
| PDF download link without indicating PDF + size | User clicks blind; mobile data surprise | `<a href="/Rashmil_Panchani.pdf">Download résumé (PDF, ~90 KB)</a>` |
| Loss of focus after mobile menu toggle | Keyboard users lose place | Move focus to first menu item on open; restore on close (CLAUDE.md focus management) |
| Default Tailwind grays for body text | Failing contrast (Pitfall 15) | `text-gray-700`+; CI a11y check |
| Hover-only reveal of interactive elements | Keyboard / touch users can't see them | Always pair `:hover` with `:focus` (CLAUDE.md rule) |

---

## "Looks Done But Isn't" Checklist

- [ ] **Astro build:** Run `astro build` on a clean clone (`rm -rf node_modules dist .astro && npm ci && npm run build`). Many "works on my machine" bugs hide in stale caches.
- [ ] **Deploy source:** Settings → Pages → Source is set to "GitHub Actions," not "Deploy from branch."
- [ ] **CNAME:** No `public/CNAME` in repo; no custom domain set in Pages settings.
- [ ] **gh-pages branch:** Deleted after first successful Actions deploy.
- [ ] **`base` config:** Not set (or set to `/`), since this is a user-site repo.
- [ ] **Trailing slashes:** All internal links end with `/`; `trailingSlash: 'always'` in config.
- [ ] **404 page:** `dist/404.html` exists; visiting `Rashmil-1999.github.io/nonexistent` shows the custom page.
- [ ] **PDF download:** `/Rashmil_Panchani.pdf` returns 200 from production URL.
- [ ] **Image optimization:** Spot-check one project card — Network tab shows a WebP/AVIF served at the rendered size, not the original. Total image weight < 500 KB.
- [ ] **No `client:load` audit:** `grep -r "client:load" src/` returns 0 lines unless explicitly justified in a comment.
- [ ] **JS bundle on home page:** `dist/_astro/*.js` total < 30 KB (excluding islands that have a documented reason). Compare to existing site's CRA bundle to ensure regression isn't possible.
- [ ] **Single lockfile:** Only `package-lock.json`; `yarn.lock` deleted.
- [ ] **`npm ls react`:** No duplicate or invalid React versions.
- [ ] **a11y CI:** axe-core or pa11y run against `dist/` in CI; gate the deploy on zero violations.
- [ ] **Contrast spot-check:** Open the site in browser DevTools → Lighthouse → Accessibility = 100. Manual check of any `text-gray-*` against its background with a contrast tool.
- [ ] **Keyboard nav:** Tab through the whole page using only the keyboard. Every interactive element is reachable and visibly focused.
- [ ] **Screen reader pass:** Quick VoiceOver/NVDA pass — every social icon link announces its target name.
- [ ] **Dark mode sanity:** Toggle macOS to Dark mode; the site should not silently flip colors (no `dark:` utilities authored in M1).
- [ ] **Mobile menu close:** Tap a section link in mobile view; nav collapses.
- [ ] **Section IDs match anchors:** Every `<a href="#x">` has a corresponding `<section id="x">`.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong `base` config (Pitfall 10) | LOW | Remove `base` from `astro.config.mjs`; rebuild; redeploy |
| Wrong content config path (Pitfall 1) | LOW | Move file to `src/content.config.ts`; `rm -rf .astro`; restart dev; rebuild |
| Over-hydrated React islands (Pitfall 5/6) | MEDIUM | Convert `.tsx` islands back to `.astro`; remove `client:*` directives; bundle-test |
| Tailwind v3 → v4 migration mid-flight failures | MEDIUM | Use the official `@tailwindcss/upgrade` codemod; manually verify `--color-*` namespacing and border default override |
| Wrong Pages source (Pitfall 11) | LOW | Toggle Settings → Pages → Source; re-trigger workflow |
| Image schema not using `image()` (Pitfall 4) | LOW-MEDIUM | Update schema to `image()`; co-locate images with markdown; update render to use `<Image />` |
| Re-introduced CDN libraries | LOW | Replace `<script src="https://cdn...">` with bundled import; remove from `<head>` |
| Trailing-slash 301 tax (Pitfall 9) | LOW | Add `trailingSlash: 'always'`; rebuild; rewrite any hand-coded internal links |
| Deploy workflow missing permissions (Pitfall 12) | LOW | Add `permissions:` block to workflow YAML; re-run |
| Stale `gh-pages` branch serving old content | LOW | Delete branch; confirm Pages source is "GitHub Actions"; trigger redeploy |
| Schema `z.array` mismatch (Pitfall 3) | LOW | Restructure JSON to per-item files or fix schema to `z.object` per entry |
| Custom 404 missing | LOW | Add `src/pages/404.astro`; rebuild |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. Content config wrong path | content | `getCollection` returns entries; `.astro/content.d.ts` lists collections |
| 2. Deprecated `type: 'content'`/`'data'` style | content | `src/content.config.ts` uses `loader:` keys; route files use `[...id]` not `[...slug]` |
| 3. `file()` loader schema shape | content | `astro build` exits 0 on real data |
| 4. Image references in frontmatter | content + sections | Network tab shows optimized formats; no raw `<img>` in section components |
| 5. Defaulting to `client:load` | sections + polish | `grep client:load src/` returns only justified instances |
| 6. Shipping React for static markup | sections | Bundle analyzer: no React chunk for pages without islands |
| 7. React 19 / `@astrojs/react` drift | foundation | `npm ls react react-dom @astrojs/react` clean |
| 8. View Transitions script re-execution | foundation | No `<ClientRouter />` added in M1 (or all scripts use `astro:page-load`) |
| 9. Trailing-slash 301 tax | deploy + sections | `trailingSlash: 'always'` set; internal links end in `/` |
| 10. `base` on a user-site repo | deploy | `base` unset; production assets resolve at root |
| 11. Wrong Pages source setting | deploy | Settings → Pages → Source = "GitHub Actions"; first deploy live |
| 12. Workflow missing permissions | deploy | Workflow YAML has `pages: write` + `id-token: write` |
| 13. Tailwind `--color-*` naming | foundation | Custom utilities (`bg-brand-500`) render expected color |
| 14. v4 border default = currentColor | polish | Visual diff vs. existing site; no surprise-colored borders |
| 15. Default gray scale fails WCAG | polish + deploy | Lighthouse a11y = 100; axe-core CI gate |
| 16. v4 dark mode active by default | polish | OS dark-mode review; no `dark:` utilities authored |
| 17. TypeScript implicit-any on `Astro.props` | foundation + sections | Every `.astro` declares `interface Props`; `astro check` in CI |
| 18. `<StrictMode>` re-introduction | sections | No `<StrictMode>` in any island |
| 19. Parallel `sections`/`links` arrays | content | Single `nav.yaml` collection; renderer reads one source |
| 20. `image_map` lookup pattern | content + sections | No image-map JS objects; images co-located with markdown |
| 21. jQuery scrollspy → React island | sections + polish | Side nav is `.astro` + vanilla `<script>` with IntersectionObserver |
| 22. Icon-only links without `aria-label` | sections + polish | axe-core "link-name" / "button-name" violations = 0 |
| 23. Bloated icon set | sections + polish | CSS bundle < 50 KB; no whole-icon-library imports |
| 24. `public/CNAME` carried over | foundation + deploy | No `public/CNAME` in repo; no custom domain in Pages settings |
| 25. PDF cache busting | content + deploy | PDF reference includes version param OR is imported via `src/` for hashing |
| 26. Custom 404 not built | deploy | `dist/404.html` exists; 404 path serves custom page |
| 27. Branch protection blocking deploy | deploy | Trial Actions run succeeds end-to-end |
| 28. `getCollection` runtime filtering | content | All `getCollection` calls pass the predicate as the second arg |
| 29. Tailwind `@source` misconfigured | foundation | Spot-checked utility appears in `dist/_astro/*.css` |
| 30. Vitest smoke test doesn't run build | foundation | Test spawns `astro build`; CI on clean clone passes |

---

## Confidence Notes

- **HIGH confidence** on Astro 5 Content Layer pitfalls (1–4, 28), GitHub Pages user-site config (10, 11, 12, 24, 27), View Transitions script behavior (8), trailing-slash redirect tax (9), and React 19 + adapter version sensitivity (7). Documented in official Astro docs, Astro issue tracker, and GitHub Pages official docs.
- **MEDIUM confidence** on Tailwind v4 + Astro 5 integration mechanics (13, 14, 16, 29). The pairing is recent, the v4 codemod story is still maturing, and several "this changed" claims rely on migration guides written by the community rather than Tailwind core team.
- **LOW-MEDIUM confidence** on the Tailwind-v4-plus-GitHub-Pages-user-site-repo combination specifically. No authoritative "best practice" source for this exact triple — most v4 migration content is for Next.js/Vite/Vue apps. Recommend treating the foundation and polish phases as "verify against the actually-built output," not "trust the migration guide."
- **HIGH confidence** on the existing-site anti-patterns being preventable (pitfalls 18, 19, 20, 21, 22, 23, 24) — they're literally enumerated in `.planning/codebase/CONCERNS.md` and `ARCHITECTURE.md` for this repo, so the prevention is mechanical (don't repeat them).
- **MEDIUM confidence** on GitHub Pages cache behavior (25). TTLs documented but vary; the version-param mitigation is well-established but not formally guaranteed.

---

## Sources

- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/)
- [Astro Content Collections API reference](https://docs.astro.build/en/reference/modules/astro-content/)
- [Astro Images guide](https://docs.astro.build/en/guides/images/)
- [Astro Image and Assets API reference](https://docs.astro.build/en/reference/modules/astro-assets/)
- [Astro Islands architecture](https://docs.astro.build/en/concepts/islands/)
- [Astro View Transitions guide](https://docs.astro.build/en/guides/view-transitions/)
- [Astro View Transitions Router API reference](https://docs.astro.build/en/reference/modules/astro-transitions/)
- [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/)
- [Astro Pages basics (404 pages)](https://docs.astro.build/en/basics/astro-pages/)
- [Astro configuration reference](https://docs.astro.build/en/reference/configuration-reference/)
- [Deploy your Astro site to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Astro Troubleshooting](https://docs.astro.build/en/guides/troubleshooting/)
- [`@astrojs/react` integration docs](https://docs.astro.build/en/guides/integrations-guide/react/)
- [`@astrojs/react` CHANGELOG (React 19 support)](https://github.com/withastro/astro/blob/main/packages/integrations/react/CHANGELOG.md)
- [`withastro/action` (official Astro GitHub Action)](https://github.com/withastro/action)
- [`actions/deploy-pages` README](https://github.com/actions/deploy-pages)
- [GitHub Docs: Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Docs: Deploying with GitHub Actions](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments)
- [Tailwind CSS Upgrade Guide (v3 → v4)](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS Dark Mode docs](https://tailwindcss.com/docs/dark-mode)
- [Tailwind CSS Theme variables docs](https://tailwindcss.com/docs/theme)
- [Tailwind v4 third-party plugin discussion (daisyUI etc.)](https://github.com/tailwindlabs/tailwindcss/discussions/15828)
- [Tailwind v4 third-party plugins discussion](https://github.com/tailwindlabs/tailwindcss/discussions/15715)
- [Avoiding the Trailing Slash Tax on GitHub Pages and Astro — Off by One](https://justoffbyone.com/posts/trailing-slash-tax/)
- [Astro 4.9 release notes (React 19 support)](https://astro.build/blog/astro-490/)
- [React v19 release post](https://react.dev/blog/2024/12/05/react-19)
- [Astro debugging: Missing Schema Fields — Oscar Gallego Ruiz](https://www.oscargallegoruiz.com/en/blog/astro-content-config-location/)
- [Migrating content collections from Astro 4 to 5 — Chen Hui Jing](https://chenhuijing.com/blog/migrating-content-collections-from-astro-4-to-5/)
- [How to Fix React Hydration Error in Astro — Akos Komuves](https://akoskm.com/how-to-fix-react-hydration-error-in-astro/)
- [Astro/React Invalid Hook Call Error Diagnosis — TechnetExperts](https://www.technetexperts.com/astro-react-invalid-hook-fix/)
- [Astro inline scripts in layout with view transitions not re-executing — withastro/astro#9798](https://github.com/withastro/astro/issues/9798)
- [Astro View Transition causes client-side JS not to fire on navigation — withastro/astro#7773](https://github.com/withastro/astro/issues/7773)
- [On-load scripts & view-transitions in Astro — Raphael Ferrand](https://raphaelferrand.com/posts/scripts-view-transitions-astrojs/)
- [Astro custom 404 page issues — withastro/astro#2661, #8054](https://github.com/withastro/astro/issues/2661)
- [Tailwind Contrast Checker — WCAG 2.1 Color Accessibility Tool](https://tailwindcolor.tools/tailwind-contrast-checker)
- [Tailwind CSS v4 Migration Guide (2026) — Pockit Blog](https://pockit.tools/blog/tailwind-css-v4-migration-guide/)
- [`.planning/PROJECT.md` (locked decisions and constraints — this repo)](file:///Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/PROJECT.md)
- [`.planning/codebase/CONCERNS.md` (existing-site anti-patterns — this repo)](file:///Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/codebase/CONCERNS.md)
- [`.planning/codebase/ARCHITECTURE.md` (existing-site architecture — this repo)](file:///Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/codebase/ARCHITECTURE.md)
- [`.planning/codebase/STACK.md` (existing-site stack — this repo)](file:///Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/codebase/STACK.md)

---
*Pitfalls research for: Astro 5 + React 19 + Tailwind v4 portfolio migration on GitHub Pages user-site repo*
*Researched: 2026-05-26*
