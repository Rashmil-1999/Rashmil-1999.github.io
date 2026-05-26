# Architecture Research

**Domain:** Astro 5 + React 19 + Tailwind v4 personal portfolio (static, GitHub Pages user-site, M2-ready Content Layer)
**Researched:** 2026-05-26
**Confidence:** HIGH (Astro Content Layer, GH Pages user-site, image pipeline, Tailwind `@theme`, `withastro/action`); MEDIUM (Decap CMS shape for M2 — verified docs cover folder+file collections but not every adapter edge case)

This is a hybrid-component (.astro static + selective React 19 islands), static-output portfolio with typed Content Layer collections that double as a CMS-ready source of truth. M1 ships a one-page composition; the schema split anticipates an M2 editing surface without preempting it.

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                Build Time (Astro 5, Node 22 LTS)                 │
│                                                                  │
│   src/content/                       src/content.config.ts       │
│   ┌────────────────────┐             ┌──────────────────────┐    │
│   │ projects/*.md      │──glob()────▶│ defineCollection({   │    │
│   │ work/*.md          │             │   loader, schema     │    │
│   │ education/*.md     │             │ })                   │    │
│   │ leadership/*.md    │             └──────────┬───────────┘    │
│   │ testimonials/*.md  │                        │                │
│   │ about.yml          │──file()────────────────┤                │
│   │ skills.yml         │                        │                │
│   │ links.yml          │                        │                │
│   └────────────────────┘                        ▼                │
│                                       getCollection() / getEntry │
│                                                 │                │
│                                                 ▼                │
│   src/pages/index.astro ─── imports sections, fans data out      │
│       │                                                          │
│       ├── layouts/BaseLayout.astro  (html shell, <slot />)       │
│       │                                                          │
│       └── components/                                            │
│           ├── sections/*.astro      (About, Work, Projects, ...) │
│           ├── ui/*.astro            (Card, Chip, Icon, SrOnly)   │
│           └── islands/*.tsx         (only if interactive)        │
│                                                                  │
│   src/styles/global.css   ── @import "tailwindcss"; @theme {...} │
│   astro.config.mjs        ── site, output:'static', @tailwind/vite│
└────────────────────────────────┬─────────────────────────────────┘
                                 │ astro build
                                 ▼
                  ┌──────────────────────────┐
                  │ dist/   (static HTML/CSS │
                  │  + hashed/optimized      │
                  │  images + bundled JS for │
                  │  any islands only)       │
                  └─────────────┬────────────┘
                                │ withastro/action@v6
                                ▼
                  ┌──────────────────────────┐
                  │ GitHub Pages             │
                  │ https://Rashmil-1999.    │
                  │   github.io/             │
                  └──────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `BaseLayout.astro` | HTML shell, `<head>` (meta, fonts, global CSS import), skip-to-content link, body landmarks (`<header>`, `<main>`, `<footer>`), `<slot />` | `.astro` layout, no JS |
| `src/pages/index.astro` | Composition root: `getCollection()` for each collection, fan data into section components in fixed order | `.astro` page, frontmatter does the data fetching |
| `sections/*.astro` | One per resume area (About, Education, Work, Skills, Projects, Leadership, Testimonials). Receive their data slice via props, render semantic `<section id="…">` | `.astro`, presentational, no client JS |
| `ui/*.astro` | Reusable atoms shared across sections (Card, Chip, IconLink, SrOnly, ExternalLink) | `.astro`, prop-driven |
| `islands/*.tsx` | React 19 components hydrated client-side **only when interactive behavior is required**. None on day 1. Reserved slot. | `.tsx`, hydrated with `client:visible` or `client:idle` |
| `SideNav.astro` | Fixed sidebar with profile image and section anchors; smooth-scroll via CSS, active-link highlighting via a small `<script>` using `IntersectionObserver` | `.astro` with inline `<script>` (no React, no jQuery) |
| `Content Layer` | Build-time typed data layer; `getCollection('work')`, `getEntry('about', 'index')` | `src/content.config.ts` with `glob()` / `file()` loaders + Zod schemas |
| GH Actions workflow | Build with `withastro/action@v6`, deploy with `actions/deploy-pages@v4` | `.github/workflows/deploy.yml` |

---

## Recommended Project Structure

```
Rashmil-1999.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml              # withastro/action@v6 → actions/deploy-pages@v4
├── public/                         # Served as-is, no processing
│   ├── Rashmil_Panchani.pdf        # Resume download (preserved from existing site)
│   ├── favicon.svg
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── pages/
│   │   └── index.astro             # Single composition root; getCollection() calls live here
│   ├── layouts/
│   │   └── BaseLayout.astro        # <html>, <head>, <body>, landmarks, skip link, global CSS import
│   ├── components/
│   │   ├── sections/               # One file per resume section
│   │   │   ├── About.astro
│   │   │   ├── Education.astro
│   │   │   ├── Work.astro
│   │   │   ├── Skills.astro
│   │   │   ├── Projects.astro
│   │   │   ├── Leadership.astro
│   │   │   └── Testimonials.astro
│   │   ├── ui/                     # Cross-section atoms (presentational)
│   │   │   ├── Card.astro
│   │   │   ├── Chip.astro          # tech-stack pills, skill tags
│   │   │   ├── IconLink.astro      # social icons (replaces Font Awesome CDN)
│   │   │   ├── ExternalLink.astro  # adds rel="noopener noreferrer" by default
│   │   │   └── SrOnly.astro        # visually-hidden helper for a11y
│   │   ├── nav/
│   │   │   └── SideNav.astro       # nav + inline IntersectionObserver scroll-spy
│   │   └── islands/                # EMPTY in M1. Reserved for future React 19 islands.
│   │       └── .gitkeep
│   ├── content/                    # Astro Content Layer source of truth
│   │   ├── projects/               # one .md per project; image colocated
│   │   │   ├── archive.md
│   │   │   ├── archive.png
│   │   │   ├── chatbot.md
│   │   │   └── chatbot.png
│   │   ├── work/                   # one .md per job
│   │   │   └── company-x.md
│   │   ├── education/              # one .md per school
│   │   │   └── uiuc.md
│   │   ├── leadership/             # one .md per role
│   │   │   └── ieee-chair.md
│   │   ├── testimonials/           # one .md per quote
│   │   │   └── jane-doe.md
│   │   ├── about.yml               # single object (file loader)
│   │   ├── skills.yml              # single object (file loader); categorized skills
│   │   └── links.yml               # nav sections + anchor map
│   ├── styles/
│   │   └── global.css              # @import "tailwindcss"; @theme {...} tokens
│   └── assets/
│       └── profilepic.jpg          # Used by SideNav.astro via Image component
├── astro.config.mjs                # site, output:'static', @tailwindcss/vite, react integration
├── tsconfig.json                   # extends astro/tsconfigs/strict
├── content.config.ts → src/content.config.ts  # collection definitions
├── package.json                    # npm only; remove yarn.lock during M1
└── README.md
```

### Structure Rationale

- **`src/pages/index.astro` is the only route.** The portfolio is genuinely one page. Per-section page routes would buy nothing (the same scroll-spy nav still needs all sections in one DOM), would break native anchor scroll, and would 4x the build/maintenance surface for zero user-facing benefit.
- **`src/content/` is the canonical data location.** Astro's Content Layer expects collections there by convention; Decap CMS, Sanity adapters, and most CMS guides assume that path. Putting content anywhere else fights every M2 option.
- **Per-item markdown for "list" collections (`projects`, `work`, `education`, `leadership`, `testimonials`).** Each is editable in isolation, image colocation works cleanly, git diffs are surgical, and a CMS can `create: true` into the folder.
- **Per-collection YAML data file for "singleton" collections (`about`, `skills`, `links`).** Each is logically one object, not a list. Splitting `about.email` into its own markdown file is overkill. YAML files map to Decap's `files:` collection type and to a CMS settings panel.
- **`components/sections/` vs `components/ui/` vs `components/islands/` is a hard boundary.** Sections are page-shaped (own an `id`, own a heading), ui atoms are reusable and headingless, islands are the only place client JS lives. A reviewer can predict a component's behavior from its folder.
- **`components/islands/` is empty on day 1, intentionally.** Current site has zero interactive behavior. Creating the folder signals the convention and prevents a future React component from being dropped into `sections/` and accidentally hydrated everywhere.
- **`src/styles/global.css` (single file).** Tailwind v4's CSS-first config means tokens live next to the `@import "tailwindcss"`. No `tailwind.config.js`. Imported once from `BaseLayout.astro`.
- **`src/assets/` for non-collection images only (profile photo).** Project images live next to their markdown in `src/content/projects/` and are referenced via the schema's `image()` helper. This kills the `image_map` anti-pattern by construction — there is no string lookup to forget.

---

## Architectural Patterns

### Pattern 1: Content Layer collections with mixed loaders (`glob()` + `file()`)

**What:** Define every resume domain as a typed collection in `src/content.config.ts`. Use `glob()` for per-item directories and `file()` for singleton YAML data.
**When to use:** Always, for any content that's authored as data (resume sections, blog posts, case studies). The schema becomes the contract for both the renderer and any future CMS.
**Trade-offs:** One-time config cost; pays back at build (errors at build, not at render), at editing time (CMS knows the shape), and at refactor time (rename a field, TypeScript flags every site).

**Example (`src/content.config.ts`):**
```typescript
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Per-item markdown collections (lists)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image().optional(),       // collection-local image, optimized at build
    imageAlt: z.string(),
    url: z.string().url().optional(),
    techStack: z.array(z.string()).default([]),
    order: z.number().default(0),    // sort key; no reliance on filename
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().default(null), // null = current
    location: z.string().optional(),
    order: z.number().default(0),
  }),
});

// (education, leadership, testimonials follow the same glob() pattern)

// Singleton YAML collections (one object per file)
const about = defineCollection({
  loader: file('src/content/about.yml'),
  schema: z.object({
    id: z.literal('index'),          // file() requires an explicit id
    firstName: z.string(),
    lastName: z.string(),
    status: z.string(),
    email: z.string().email(),
    contactMessage: z.string(),
    resumeDownload: z.string(),      // path under public/
    social: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
      icon: z.string(),              // local icon name, NOT a Font Awesome class string
    })),
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills.yml'),
  schema: z.object({
    id: z.literal('index'),
    categories: z.array(z.object({
      name: z.string(),
      items: z.array(z.object({
        name: z.string(),
        icon: z.string(),            // local icon name (replaces devicon/iconify CDN classes)
      })),
    })),
  }),
});

const links = defineCollection({
  loader: file('src/content/links.yml'),
  schema: z.object({
    id: z.literal('index'),
    sections: z.array(z.object({
      id: z.string(),                // anchor target, e.g., "about"
      label: z.string(),             // display name in nav
    })),
  }),
});

export const collections = { projects, work, education, leadership, testimonials, about, skills, links };
```

### Pattern 2: Page-level data fetching, prop-down rendering

**What:** `src/pages/index.astro` is the only place that calls `getCollection()` / `getEntry()`. It sorts the data, then passes each slice as a typed prop to the section component.
**When to use:** Always, in this project. Section components stay pure and unit-testable. Composition order and sort logic live in one file.
**Trade-offs:** All sections re-render together (irrelevant — static build). One file knows about every collection (intentional — the composition root *should*).

**Example (`src/pages/index.astro`):**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SideNav from '../components/nav/SideNav.astro';
import About from '../components/sections/About.astro';
import Education from '../components/sections/Education.astro';
import Work from '../components/sections/Work.astro';
import Skills from '../components/sections/Skills.astro';
import Projects from '../components/sections/Projects.astro';
import Leadership from '../components/sections/Leadership.astro';
import Testimonials from '../components/sections/Testimonials.astro';
import { getCollection, getEntry } from 'astro:content';

const about        = await getEntry('about', 'index');
const skills       = await getEntry('skills', 'index');
const links        = await getEntry('links', 'index');

const sortByOrder  = (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0);
const projects     = (await getCollection('projects')).sort(sortByOrder);
const work         = (await getCollection('work'))
                       .sort((a, b) => (b.data.startDate.getTime()) - (a.data.startDate.getTime()));
const education    = (await getCollection('education')).sort(sortByOrder);
const leadership   = (await getCollection('leadership')).sort(sortByOrder);
const testimonials = (await getCollection('testimonials')).sort(sortByOrder);
---
<BaseLayout title={`${about.data.firstName} ${about.data.lastName}`}>
  <SideNav about={about.data} links={links.data} />
  <main id="main">
    <About        data={about.data} />
    <Education    items={education} />
    <Work         items={work} />
    <Skills       data={skills.data} />
    <Projects     items={projects} />
    <Leadership   items={leadership} />
    <Testimonials items={testimonials} />
  </main>
</BaseLayout>
```

### Pattern 3: `image()` schema + collection-local images (kills the `image_map` anti-pattern)

**What:** Project images live in `src/content/projects/<slug>.png` next to their markdown. The schema declares `image: image().optional()`. Astro resolves the path relative to the markdown file at build, validates the asset exists, and emits `ImageMetadata` (`{ src, width, height, format }`) to the renderer.
**When to use:** Any image authored alongside content. The `image()` helper is the only correct way to bind a markdown frontmatter image into Astro's optimization pipeline.
**Trade-offs:** Authors must reference the image by relative path in frontmatter (e.g., `image: ./archive.png`). That's the same discipline as writing a relative `![alt](./archive.png)` — and it eliminates the two-sources-of-truth bug the current `image_map` causes.

**Example (`src/content/projects/archive.md`):**
```markdown
---
title: Archive
image: ./archive.png
imageAlt: Screenshot of the Archive project landing page
url: https://github.com/Rashmil-1999/archive
techStack: [React, Node.js, MongoDB]
order: 1
---
A short description of the project rendered as markdown body.
```

**Example (`src/components/sections/Projects.astro`):**
```astro
---
import { Image } from 'astro:assets';
import Card from '../ui/Card.astro';
import Chip from '../ui/Chip.astro';
const { items } = Astro.props;
---
<section id="projects" class="resume-section" aria-labelledby="projects-heading">
  <h2 id="projects-heading">Projects</h2>
  {items.map(({ data, body }) => (
    <Card>
      {data.image && (
        <Image src={data.image} alt={data.imageAlt} width={400} loading="lazy" />
      )}
      <h3>{data.title}</h3>
      <p set:html={body} />
      <ul class="tech-stack" aria-label="Tech stack">
        {data.techStack.map((t) => <li><Chip>{t}</Chip></li>)}
      </ul>
      {data.url && <a href={data.url} rel="noopener noreferrer" target="_blank">View project</a>}
    </Card>
  ))}
</section>
```

### Pattern 4: Native scroll-spy via `IntersectionObserver` (no jQuery, no `react-scroll`)

**What:** Smooth scrolling is CSS (`html { scroll-behavior: smooth; }`). Active-link highlighting is one small `<script>` block in `SideNav.astro` that wires `IntersectionObserver` to set `aria-current="true"` on the matching nav anchor.
**When to use:** Always, for anchor-based one-page sites. Bundled JS for this is ~30 lines; the dependency-free version outperforms `react-scroll` and is more accessible than the jQuery `scrollspy` plugin.
**Trade-offs:** None meaningful at this scope. The observer must be configured with a `rootMargin` that accounts for the fixed nav height; the script runs only after section elements exist (use `<script>` at end of `SideNav.astro` body or `is:inline`).

**Example (inline in `SideNav.astro`):**
```astro
<script>
  const links = document.querySelectorAll('[data-nav-link]');
  const sections = document.querySelectorAll('main > section[id]');
  const byId = new Map([...links].map((a) => [a.getAttribute('href')?.slice(1), a]));

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(e.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
</script>
```
CSS pairs `[aria-current="true"]` with a visible style (bold + left border, not color alone — see CLAUDE.md §5).

### Pattern 5: Tailwind v4 CSS-first tokens in a single global stylesheet

**What:** `src/styles/global.css` holds `@import "tailwindcss";` and an `@theme { … }` block defining colors, font families, and any spacing/radius overrides. No `tailwind.config.js`. Imported once from `BaseLayout.astro`.
**When to use:** Always, in Tailwind v4 + Astro projects. The CSS-first config is the v4 default and removes the JS config build dependency for projects this size.
**Trade-offs:** Engineers used to v3 `tailwind.config.js` need a one-line orientation. `@theme` overrides cascade by namespace (`--color-*`, `--font-*`, `--text-*`, `--spacing-*`, `--radius-*`, `--breakpoint-*`, `--shadow-*`).

**Example (`src/styles/global.css`):**
```css
@import "tailwindcss";

@theme {
  /* Brand */
  --color-brand-50:  #f1f5fb;
  --color-brand-500: #1d4ed8;
  --color-brand-700: #1e3a8a;

  /* Surface / text */
  --color-surface:   #ffffff;
  --color-ink:       #0f172a;
  --color-muted:     #475569;

  /* Type */
  --font-display:    "Saira Extra Condensed", system-ui, sans-serif;
  --font-body:       "Muli", system-ui, sans-serif;
}

/* Non-utility globals (typography baseline, reduced-motion respect) */
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body { font-family: var(--font-body); color: var(--color-ink); background: var(--color-surface); }
.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

### Pattern 6: GitHub Pages user-site config (no `base`)

**What:** `astro.config.mjs` sets `site: 'https://Rashmil-1999.github.io'`, `output: 'static'`, and wires `@tailwindcss/vite`. **Do not** set `base` — the user-site repo serves at `/`, and a stray `base` will break every asset URL.
**When to use:** Always, for `<username>.github.io` repositories. `base` is only correct for project repos served at `/<repo>/`.
**Trade-offs:** None. Getting `base` wrong is the single most common GH-Pages-with-Astro footgun; the user-site URL pattern lets us avoid it entirely.

**Example (`astro.config.mjs`):**
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://Rashmil-1999.github.io',
  // base: NOT set — user-site repos serve at root.
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [react()],          // present so islands/*.tsx works when added
  vite: { plugins: [tailwindcss()] },
  image: {
    // Local-only optimization; no remote patterns needed.
  },
});
```

**Example (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v6
        # Auto-detects npm from package-lock.json. Runs `astro build`.

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

---

## Data Flow

### Build-Time Render Flow

```
src/content/**            src/content.config.ts        src/pages/index.astro
    │  (markdown +              │  (Zod schemas              │
    │   YAML +                  │   + glob/file              │  await getCollection(...)
    │   colocated               │   loaders)                 │  await getEntry(...)
    │   images)                 ▼                            ▼
    └────────────────▶  Content Layer  ─────────────▶  Typed entries → props
                              │                                  │
                              │ image() schema resolves           ▼
                              │ relative paths to             sections/*.astro
                              │ ImageMetadata                     │
                              ▼                                  ▼
                       astro:assets pipeline           BaseLayout.astro → HTML
                       optimizes/hashes images                    │
                                                                  ▼
                                                          dist/ (static)
```

### Runtime Flow (in the browser)

```
GH Pages serves dist/index.html
        │
        ▼
HTML parses → global.css applies → fonts load
        │
        ▼
SideNav.astro inline <script> runs
        │
        ├── querySelector('main > section[id]')   ← already in DOM
        └── new IntersectionObserver(...)          ← sets aria-current on scroll
        │
        ▼
User clicks anchor → native anchor jump + CSS smooth-scroll
```

No client-side data fetching, no hydration on day 1.

### State Management

None. There is no client state in M1. If a future island (e.g., a contact form, a project filter) requires state, it lives inside that single `.tsx` component as React local state (`useState`). No global store. Cross-island state is a smell at this scope.

### Key Data Flows

1. **Resume content → page:** `src/content/**` → `getCollection()` / `getEntry()` in `index.astro` → typed props → section components → HTML at build.
2. **Project image → `<Image />`:** `src/content/projects/<slug>.png` referenced by `./<slug>.png` in frontmatter → `image()` schema validates and imports → `ImageMetadata` passed as `src` to `<Image>` → optimized variants emitted to `dist/_astro/`.
3. **PDF download:** `public/Rashmil_Panchani.pdf` → copied verbatim to `dist/` → `about.yml` `resumeDownload: /Rashmil_Panchani.pdf` → rendered as `<a href={about.resumeDownload} download>`.
4. **Nav → section:** `links.yml` defines section IDs/labels → `SideNav.astro` renders `<a href="#about">` etc. → native anchor scroll → `IntersectionObserver` updates `aria-current`.

---

## M2-Compatibility: Schema choices that don't box future-you in

The Content Layer split is the M2 contract. M2 (editing surface) is in scope for *design*, not for *implementation*, in M1.

### Compatibility with a Git-based editor (Decap CMS — recommended M2 default)

- **Folder collections** (`projects`, `work`, `education`, `leadership`, `testimonials`) map 1:1 to Decap's `folder:` collection type. Set `folder: "src/content/projects"`, `create: true`, and Decap can add/edit/delete entries. The frontmatter fields map directly to Decap field widgets (`string`, `markdown`, `image`, `datetime`, `list`).
- **Singleton YAML files** (`about`, `skills`, `links`) map to Decap's `files:` collection type. Each gets its own settings panel in the CMS. This is exactly what Decap's `files` collection is designed for ("unique files with a custom set of fields, like a settings file"). They cannot host multiple independently-editable items, which is why the *list* collections are markdown folders, not YAML arrays.
- **`order: number` field on every list item** lets the CMS expose drag-to-reorder UX without forcing reliance on filename or array index. Without this, Decap reorders are awkward.
- **Image fields use the `image` widget**; Decap writes a relative path that the `image()` schema validates at build. The colocated `src/content/projects/<slug>.png` layout works because Decap can write into the same folder as the markdown.
- **Admin route:** `src/pages/admin/index.astro` (or `public/admin/index.html`) + `public/admin/config.yml`. M2 wires it; M1 doesn't.

### Compatibility with a headless CMS adapter (Sanity / Contentful)

- Content Layer accepts custom loaders. The same schema shape becomes a `sanityLoader()` or `contentfulLoader()` that maps remote documents to the same Zod schema. **Section components don't change** because they only see the schema-typed entry, not the source.
- Keep schema field names framework-neutral (`title`, `image`, `imageAlt`, `url`, `techStack`, `order`) — avoid CMS-specific names like `_id`, `_ref`, `sys.id`. The current schema does this.
- The `id` field on singletons (`z.literal('index')`) is a Content Layer requirement for `file()` loaders and trivially mirrors a CMS singleton document with a fixed slug.

### Compatibility with a custom admin UI

- Because schemas are Zod, a custom admin can `import { collections } from '../content.config.ts'` and derive a form generator from `collections.projects.schema` with zero duplication. This is the cleanest M2 option for a single editor (the site owner) who wants a non-Decap UI.
- Per-item markdown files are git-diff friendly: a custom admin commits one file per save, producing clean review history.

### Things M1 must NOT do to preserve M2 freedom

- Do not collapse list collections back into a single JSON (`resumeData.json` style). That undoes the per-item edit story for every CMS option.
- Do not encode display HTML in frontmatter (e.g., `description: "<p>...</p>"`). Use markdown body for prose, structured fields for everything else.
- Do not put icons in the data as CSS class strings (`"fab fa-github"`). Use a local enum (`icon: "github"`) and resolve to a bundled SVG component in `ui/IconLink.astro`. CDN-class-string icons break every CMS preview and reintroduce the dropped CDN dependency.
- Do not let the renderer assume a sort order; rely on the `order` field. CMS reorders become trivial.

---

## Build Order (this is the roadmap signal)

Strict dependency order. Each step has an explicit "verify" gate, per CLAUDE.md §4.

```
1. Foundation
   - Scaffold Astro 5 project, add @astrojs/react, @tailwindcss/vite, strict tsconfig.
   - Write astro.config.mjs (site, output:'static', no base).
   - Write src/styles/global.css with @import "tailwindcss"; minimal @theme.
   - Write BaseLayout.astro with landmarks + skip link.
   - Write src/pages/index.astro that renders "Hello".
   → verify: `npm run build` produces dist/index.html; `npm run preview` serves "Hello" at /.

2. Content schemas (data first, before any section component)
   - Write src/content.config.ts with all 8 collections (5 glob + 3 file).
   - Migrate src/resumeData.json into src/content/** files. Keep field names round-trippable.
   - Place project images alongside their markdown.
   → verify: `npm run build` succeeds; Zod errors surface bad data; `astro check` passes.

3. Section components (presentational, no JS)
   - Build sections/*.astro one at a time, in the order: About → Education → Work → Skills →
     Projects → Leadership → Testimonials. Wire each from index.astro as you go.
   - Use ui/*.astro atoms (Card, Chip, IconLink, ExternalLink, SrOnly) as needed.
   - Replace Font Awesome / Devicon / Iconify with bundled SVG icons resolved in IconLink.
   → verify: dist/index.html renders all 8 sections with content from collections; visual diff
     against current site is "same information, light polish."

4. Navigation + scroll-spy (the only client JS in M1)
   - Build SideNav.astro reading links.yml.
   - Add inline IntersectionObserver script for aria-current.
   - Add CSS scroll-behavior:smooth + reduced-motion guard.
   → verify: anchors jump, smooth-scroll works, active link updates, keyboard tab order is sane,
     Lighthouse a11y >= 95.

5. Polish + a11y pass
   - Color-contrast audit (CLAUDE.md §5).
   - aria-label on icon-only links, aria-labelledby on each section heading.
   - Verify focus styles visible on every interactive element.
   - Image alt text non-empty (schema requires imageAlt).
   - Resume PDF link works.
   → verify: axe-core / Lighthouse a11y pass; keyboard-only walkthrough complete.

6. Tooling + CI/CD
   - Add Vitest + one smoke test asserting `astro build` succeeds and dist/index.html contains
     each section id.
   - Add ESLint + Prettier baseline.
   - Write .github/workflows/deploy.yml (withastro/action@v6 + actions/deploy-pages@v4).
   - Enable Pages: Build and deployment → Source: "GitHub Actions" in repo settings.
   → verify: PR opens → workflow runs → site deploys to https://Rashmil-1999.github.io/.

7. Cleanup
   - Delete CRA artifacts (src/App.css, src/index.js, src/components/*.jsx, public/index.html,
     public/manifest.json, public/CNAME, src/serviceWorker.js, src/setupTests.js,
     src/resumeData.json, src/assets/* moved into src/content/projects/).
   - Delete yarn.lock; npm is canonical.
   - Update README.
   → verify: `git status` is intentional; nothing dead remains; smoke test still passes.
```

---

## Scaling Considerations

| Scale | Architecture adjustments |
|-------|--------------------------|
| 1 visitor / day (today) | Nothing. Static HTML + CDN caching by Pages is the design. |
| 10k visitors / day | Nothing. Static files; CDN absorbs load. |
| 100+ projects in the collection | Add a `featured: boolean` flag and split the page (a `/projects/` index route) only if the one-page UX degrades. Until then, sort + collapse the list. |
| Multiple authors / editing pressure | This is M2's problem. Decap CMS (git-based) handles 1-3 authors with no infra; switch loaders to a headless CMS if editing volume warrants it. |

### Scaling priorities

1. **First "bottleneck": editing workflow, not runtime.** The site never scales by traffic — it scales by *who can update content without touching code*. The schema split addresses this; M2 builds the surface.
2. **Second "bottleneck": image weight.** Astro's `astro:assets` already does AVIF/WebP, but a future hi-res project gallery would benefit from `<Picture>` with art-directed sources. Swap `<Image>` for `<Picture>` per-component when needed.

---

## Anti-Patterns

### Anti-Pattern 1: Hand-maintained `image_map` lookup (carried over from current site)

**What people do:** Add a JS object that maps frontmatter image strings to imported assets, requiring two synchronized sources of truth.
**Why it's wrong:** A missing entry produces a silent broken image with no build error. The map is invisible to any future CMS.
**Do this instead:** Use `image()` in the schema with collection-local images. Astro validates the path at build, optimizes the asset, and the renderer just passes `data.image` to `<Image>`. There is no map to forget.

### Anti-Pattern 2: jQuery scroll-spy / `react-scroll` for a one-page nav

**What people do:** Pull in jQuery + Bootstrap's `scrollspy` plugin (current site), or ship `react-scroll` for anchor jumps.
**Why it's wrong:** Either fights React/Astro for DOM ownership and ships kilobytes for behavior the platform already provides. `react-scroll` in particular requires hydrating the nav, which negates the static-output win for the only nav on the page.
**Do this instead:** CSS `scroll-behavior: smooth` + a ~30-line `IntersectionObserver` `<script>` in `SideNav.astro`. Zero dependencies, fully accessible (`aria-current`), and respects `prefers-reduced-motion`.

### Anti-Pattern 3: CDN-loaded UI libraries (Bootstrap, Font Awesome, Devicon, Iconify, jQuery)

**What people do:** `<link>`/`<script>` tags to third-party CDNs in the HTML shell.
**Why it's wrong:** First paint depends on third-party uptime, versions drift silently, no offline build, and no CMS preview can render icons it doesn't know about. Also defeats Astro's optimization pipeline.
**Do this instead:** Bundle everything. Replace icon fonts with a small set of inlined SVGs (or a single bundled icon library like `lucide` / `@iconify/json` resolved at build time). The `social[].icon` and `skill.icon` fields become enum strings, resolved to local SVGs by `ui/IconLink.astro`.

### Anti-Pattern 4: Setting `base` on a user-site repo

**What people do:** Set `base: '/Rashmil-1999.github.io'` (or `/`) by analogy with project-repo deployments.
**Why it's wrong:** A user-site repo (`<user>.github.io`) serves at the domain root. Setting `base` rewrites every asset URL to a non-existent subpath. Every image and CSS file 404s in production but works locally — the worst kind of bug.
**Do this instead:** Omit `base` entirely. Set only `site: 'https://Rashmil-1999.github.io'`. The Astro docs explicitly call this out: "skip [base] if your repository name matches the special `<username>.github.io` pattern."

### Anti-Pattern 5: Hydrating an Astro page "just in case"

**What people do:** Add `client:load` to every component "in case it ever needs state."
**Why it's wrong:** Defeats the entire reason for choosing Astro. Ships React runtime for static markup.
**Do this instead:** Render in `.astro`. Convert to `.tsx` *only when* a component needs `useState`/`useEffect`/event handlers that can't be expressed in a one-shot inline `<script>`. Use the lightest hydration directive that works (`client:visible` > `client:idle` > `client:load`).

### Anti-Pattern 6: Per-section page routes (`/about`, `/work`, etc.)

**What people do:** Create one Astro page per section because "more routes feel scalable."
**Why it's wrong:** Breaks the one-page scroll model the design depends on, requires duplicating the nav on every route, and the URL story (`/about` as a distinct page) implies content depth the site doesn't have.
**Do this instead:** One `src/pages/index.astro`. If a future section grows enough to warrant its own route (a project case study, a blog post), give *that one item* a route — keep the index page as the composition root.

---

## Integration Points

### External services

| Service | Integration pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages | `withastro/action@v6` → `actions/deploy-pages@v4`, triggered on push to `main` | User-site repo: site at `/`, no `base` in Astro config. Enable Pages → Source: GitHub Actions in repo settings. |
| Google Fonts (Saira Extra Condensed, Muli) | `<link rel="preconnect">` + `<link rel="stylesheet">` in `BaseLayout.astro` `<head>`, OR self-host via `@fontsource/...` packages | Self-hosting via `@fontsource/saira-extra-condensed` + `@fontsource/mulish` is preferable for offline builds and Lighthouse, but `<link>` to Google Fonts is acceptable and matches current behavior. |
| Decap CMS (M2) | Static admin page + `config.yml`; commits to repo via GitHub OAuth | M1 designs the schema to support this; M2 wires the admin route. No M1 code required. |

### Internal boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `src/content/**` ↔ `src/content.config.ts` | File system, resolved by loaders at build | Loader choice (`glob` vs `file`) is the contract — do not mix items across the boundary. |
| `src/content.config.ts` ↔ `src/pages/index.astro` | `getCollection()` / `getEntry()` returning typed entries | Pages call collections; collections never call pages. |
| `src/pages/index.astro` ↔ `src/components/sections/*.astro` | Props (typed) | Sections never call `getCollection()`. Composition root owns data fetching. |
| `src/components/sections/*.astro` ↔ `src/components/ui/*.astro` | Props (untyped is fine — ui atoms are presentational) | Atoms must not reach into Content Layer. |
| `src/components/islands/*.tsx` ↔ everything else | Props at hydration boundary | React 19 islands receive serializable props only; do not pass collection entries with non-serializable fields (e.g., raw `ImageMetadata` is fine, but Functions are not). |

---

## Sources

- [Astro Content Collections (Astro 5 docs)](https://docs.astro.build/en/guides/content-collections/) — HIGH; loader API (`glob`, `file`), `defineCollection`, schema patterns
- [Astro Images guide](https://docs.astro.build/en/guides/images/) — HIGH; `<Image>`, `<Picture>`, `getImage()`, `image()` schema helper, `ImageMetadata`, `src/` vs `public/` semantics
- [Astro GitHub Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/) — HIGH; user-site vs project-site `base` rules, recommended `withastro/action` workflow
- [Astro project structure](https://docs.astro.build/en/basics/project-structure/) — HIGH; canonical `src/` layout, "only `src/pages/` is reserved"
- [withastro/action on GitHub](https://github.com/withastro/action) — HIGH; v6 workflow shape, permissions, package-manager auto-detection
- [Tailwind CSS v4 — Astro installation guide](https://tailwindcss.com/docs/installation/framework-guides/astro) — HIGH; `@tailwindcss/vite` plugin, `src/styles/global.css` convention
- [Tailwind CSS v4 — Theme variables (`@theme`)](https://tailwindcss.com/docs/theme) — HIGH; CSS-first config, namespace → utility mapping
- [Decap CMS & Astro (Astro docs)](https://docs.astro.build/en/guides/cms/decap-cms/) — HIGH; `folder:` collection points at `src/content/<name>`, frontmatter shape mirrors Astro schema
- [Decap CMS — File collections](https://decapcms.org/docs/collection-file/) — HIGH; `files:` type is for singletons (about/skills/links pattern)
- Existing repo planning context: `.planning/PROJECT.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`, `.planning/codebase/INTEGRATIONS.md` — HIGH; constraints and anti-patterns to avoid
- `.claude/CLAUDE.md` §5 — HIGH; WCAG 2.1 AA hard requirement informing every interactive pattern above

---
*Architecture research for: Astro 5 + React 19 + Tailwind v4 portfolio*
*Researched: 2026-05-26*
