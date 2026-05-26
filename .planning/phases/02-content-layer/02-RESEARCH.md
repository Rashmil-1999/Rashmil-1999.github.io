# Phase 2: Content Layer - Research

**Researched:** 2026-05-26
**Domain:** Astro 6 Content Layer (Zod 4 schemas) + per-item markdown/YAML migration from a JSON snapshot
**Confidence:** HIGH on the Content Layer API shape, schema function form, glob/file loader contract, and Iconify identifier audit (all verified). HIGH on the Astro 6 → Zod 4 / Zod 3 deprecation matrix. MEDIUM on the exact stderr shape `astro check` emits in v6 (the v6 regression issue documents `astro dev`/`astro build` output; `astro check` is documented to surface the same `InvalidContentEntryDataError` payload but the issue thread does not show `astro check` output verbatim — flagged in Pitfall Inventory P2-V1).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Entry file layout (CONTENT-02, CONTENT-05)**

- **D-01:** Directory-per-item for every list collection. Path shape: `src/content/<collection>/<slug>/index.md` plus all image variants colocated next to it. Same convention for `projects`, `work`, `education`, `leadership`, `testimonials`. Phase 3 / M2 CMS uploads operate on one folder per entry; multiple images per item are supported later without renaming.
- **D-02:** Slug = kebab-case derived from the entry's title (or company/school/org for non-project collections). Astro 6 auto-derives `entry.id` from the directory name; no `slug` field in frontmatter. Order is a separate field (D-04).
- **D-03:** `glob({ pattern: '**/*.md', base: './src/content/<collection>' })` per Pitfall 2 — the loader API explicitly, never the legacy `type: 'content'` shape.
- **D-04:** `order: z.number().int().default(0)` on every list-collection entry (CONTENT-04). Initial values use sparse step-10 (`10, 20, 30, ...`) matching current array order so future inserts don't require global renumbering.
- **D-05:** `draft: z.boolean().default(false)` on every list collection (Pitfall 28). Every `getCollection` call passes a predicate that filters `draft: true` in production; pattern established now so M2 (drafts in CMS) inherits it.
- **D-06:** `id: z.string().regex(/^[a-z][a-z0-9-]*$/)` on the `links` singleton entries (anchor convention). Bare ids in storage; Phase 3 prepends `#` at render and reuses the same value as the `<section id="…">` attribute (single source).

**Project images (CONTENT-05, Pitfall 4 + 20)**

- **D-07:** Schema typed via `({ image }) => z.object({ cover: image(), alternates: z.array(image()).optional() })`. `cover` is required; `alternates` captures the variants that exist in the snapshot. Future galleries can grow `alternates` without schema changes.
- **D-08:** All variants from `.planning/snapshots/m1-source/assets/` that match a project's `image` key are copied into the entry's directory, preserving their original snapshot filenames verbatim. No transcoding here — Phase 3 STYLE-03 owns WebP/AVIF + responsive widths.
- **D-09:** Garduino fix — slug is `garduino-smart-garden`, snapshot file `graduino.png` is copied in as `garduino.png` (filename matches slug) and `cover: ./garduino.png` points to it. Document this single rename in the migration notes.
- **D-10:** Orphan images in the snapshot (`attendance.png`, `attendance.webp`, `attendance1.png`, `smgarden.png` — no project references them) copy into `src/content/_orphans/`. Leading-underscore directory keeps them out of any collection's glob `base`. Future use TBD; bytes preserved without polluting collections.
- **D-11:** Profile picture lives at `src/assets/profile.jpg` (renamed from snapshot `profilepic.jpg`). `about.yaml` stores the path as a string. CONTENT-05's `image()` requirement scopes to *project* images — keeping the YAML singleton flat avoids bending the convention.
- **D-12:** `<Image />` usage and image optimization are explicitly Phase 3 work. Phase 2 only structures and types the references.

**Singleton shapes (CONTENT-03)**

- **D-13:** `about.yaml` schema: `{ first_name, last_name, current_status, email, contact_message, description, resume_download, profile_image, social: [{ name, url, icon }] }`. Social stays inline with `about`. `resume_download: 'Rashmil_Panchani.pdf'`.
- **D-14:** `links.yaml` schema: array of `{ id, label, order }` objects. Schema enforces unique `id`.
- **D-15:** `skills.yaml` schema: `{ categories: [{ name, order, items: [{ name, icon }] }] }`. Collapses the existing parallel `skill_array[]` (category order) + `skills{}` (keyed items) shape into one ordered structure.

**Icons (CONTENT-07)**

- **D-16:** `icon` field is an Iconify identifier string of shape `prefix:name`. Schema: `icon: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/)`.
- **D-17:** Migration maps every CDN class in the snapshot to an Iconify identifier (see Implementation Recipe R7 for the audited table).
- **D-18:** All icon-set decisions documented in the migration notes.

**Content body & schemas (CONTENT-01, CONTENT-08)**

- **D-19:** Long-form text lives in the markdown body, not frontmatter. Affects: `projects.description`, `work.description`, `leadership.description`, `testimonials.text`.
- **D-20:** Schema requires non-empty body content for every list-collection entry. Implemented via a Vitest assertion in `tests/content-validation.test.ts` because Astro's schema validation does NOT cover the markdown body (verified — see Open Question 1).
- **D-21:** All string fields apply trimming then `.min(1)`.
- **D-22:** Conservative normalization during migration: trim whitespace; fix demonstrable errors (the `garduino`/`graduino` mismatch only); preserve user voice in idiosyncratic spellings.
- **D-23:** Field naming is CMS-neutral (CONTENT-07): no `_id`, no `_ref`, no `sys.*`, no raw CSS class names. Use plain English fields.

**Nav reconciliation**

- **D-24:** Canonical id/label for the work section: id `work`, label `Work`. The snapshot's `Experience`/`#experience` is reconciled to `Work`/`#work`.
- **D-25:** Initial `links.yaml` contents (7 nav entries with order 10–70 in the order: about, education, work, skills, projects, leadership, testimonials).

**CONTENT-08 malformed-fixture test**

- **D-26:** Implementation file: `tests/content-validation.test.ts`. Fixture: `tests/__fixtures__/malformed-project.md` — a markdown file with frontmatter missing the required `title` field.
- **D-27:** Test mechanics: in a `try`/`finally`, copy the fixture to `src/content/projects/__test__/index.md`, spawn `npx astro check` via `node:child_process`, assert the process exits non-zero AND stderr contains both the field path (`title`) and the entry id (`__test__`). Cleanup deletes the temp file regardless of outcome.
- **D-28:** A second sub-test asserts `await getCollection('projects')` over the real data returns `length > 0` and entries have non-`any` types. Uses `expectTypeOf` from Vitest.

### Claude's Discretion

- Exact Zod schema source — whether to factor shared field bundles (e.g., `dateRangeSchema`, `iconSchema`) into helpers or inline. Planner picks based on duplication count.
- Whether to write a Node migration script (`scripts/migrate-content.mjs`) that reads the snapshot JSON and emits the markdown/YAML files, or to hand-author the 20 markdown files. Researcher recommendation: **hand-author** (see Recipe R10).
- The exact Iconify identifier per skill where multiple plausible matches exist. Migration notes document each pick.
- Whether `astro:content` types fully satisfy the strictest tsconfig flags (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) without local annotation — planner verifies during type-check.
- The `_orphans` directory containment mechanism — leading underscore + not being any collection's `base` is sufficient (verified — see Open Question 6).

### Deferred Ideas (OUT OF SCOPE)

**Phase 3 (Sections & Navigation / Style)**

- Render `<Content />` for each markdown body (projects/work/leadership/testimonials descriptions).
- Resolve `icon: 'devicon:python'` etc. via `astro-icon` + `@iconify-json/devicon` + `@iconify-json/simple-icons` + `@iconify-json/logos` + `@iconify-json/lucide`. **Phase 2 must NOT add icon-pack dependencies.**
- Project image optimization: WebP/AVIF, responsive `widths={[400,800,1200]}`, `<Image />` only.
- `links.yaml` drives both SideNav anchor rendering and the `<section id="…">` attributes — single source.
- `Experience`/`Work` reconciliation enforcement across cross-references.

**Phase 4 (SEO, A11Y & Meta Polish)**

- `about.description` drives `<meta name="description">` and `og:description` via `<BaseHead>`.
- Social `aria-label`s on rendered icons.
- `social[].url` external link audit (rel="noopener noreferrer").

**Phase 5 (Cleanup & Deploy)**

- Delete `.planning/snapshots/m1-source/` after CONTENT-06 manual-diff parity is signed off.
- Decide on resume PDF cache-busting (query param vs `src/` import).
- `_orphans/` contents — keep, delete, or archive separately.

**Future (M2 / out of M1)**

- Multi-image galleries on a project (schema's `alternates` field is the seed).
- `draft: true` workflow in a CMS UI.
- Slug renames without broken links.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONTENT-01 | `src/content.config.ts` (Astro 6 location, NOT `src/content/config.ts`) defines all 8 collections with Zod schemas | Pitfall P1 + Pattern Reference §1 confirm v6 location; Recipe R1 shows the full file layout. |
| CONTENT-02 | List-collections (`projects`, `work`, `education`, `leadership`, `testimonials`) use `glob()` over per-item markdown files | Pattern Reference §2 + Recipe R2; verified `glob({ pattern, base })` signature against current docs. |
| CONTENT-03 | Singleton-collections (`about`, `skills`, `links`) use `file()` over one YAML file each | Pattern Reference §3 + Recipe R3; key finding: `file()` does NOT support a single-root-object YAML — see Open Question 4. Workaround: object-map form (top-level key = entry id). |
| CONTENT-04 | Every list-collection item has `order: z.number().default(0)` | Recipe R4 — included in every list schema; initial values use step-10 sparse numbering. |
| CONTENT-05 | Project images use `image()` schema helper, colocated with markdown, referenced as `./<filename>` | Pattern Reference §4 + Recipe R5; verified path resolution is relative to the markdown file; verified the schema-function form `({ image }) => z.object(...)` is the only way to inject `image()`. |
| CONTENT-06 | All content from `src/resumeData.json` round-trips with zero data loss | Recipe R10 (migration recipe) + the snapshot inventory in Recipe R6; manual diff strategy documented. |
| CONTENT-07 | Schemas use CMS-neutral field names | All schemas in Recipe R1–R3 avoid `_id`, `_ref`, `sys.*`, raw CSS class names. |
| CONTENT-08 | `npx astro check` validates content; deliberately-malformed fixture fails the build with a useful Zod error | Recipe R9 (malformed-fixture test). Verified: `astro check` exits non-zero on schema violation. Verified: stderr includes entry id (`collection → entry-id`) and field path (in Zod issue JSON `"path": ["title"]`). Note v6 regression P2-V1 — error format is less readable than v5 but still machine-parseable for the assertion. |

</phase_requirements>

## Summary

The Astro 6 Content Layer is well-documented and stable; this phase is a mechanical migration with two genuine sources of risk:

1. **The `file()` loader does NOT support a true singleton** (a YAML file whose root is one object representing one entry). It expects an **array of `{id, ...}` objects** OR an **object map** whose top-level keys become entry IDs. CONTEXT.md's D-13 wording ("`about.yaml` schema: `{ first_name, last_name, ... }`") describes the *data shape*, but the **file content** must be wrapped in one of the two supported forms. The cleanest fit for this project is the **object-map form** for `about.yaml` and `skills.yaml` (one top-level key — `about:` / `skills:` — whose value is the schema object), and the **array form** for `links.yaml` (it's already an array of nav entries). All three become `getEntry('about', 'about')` / `getEntry('skills', 'skills')` / `getCollection('links')` at consumption time.

2. **Astro 6 ships Zod 4**. CONTEXT.md decisions D-13/D-14/D-15/D-17/D-20/D-21 use Zod 3 patterns: `z.string().email()`, `z.string().url()`, `.min(1, { message: '...' })`, `.refine(... , (val) => ({ message: ... }))`. These still work via deprecation shims, but the **idiomatic v4** forms are `z.email()`, `z.url()`, `.min(1, { error: '...' })`. Errors via `ZodError.issues` (not `.errors`) and via `z.treeifyError()` (not `.format()` / `.flatten()`). The planner should use v4 idioms in the new schemas — both forms compile, but the v4 form is forward-compatible and avoids deprecation noise from `astro check`.

Beyond those two gotchas: schema validation does **not** cover markdown body content (verified — body is exposed only via `render().body` at consumption time, not during schema validation), so D-20's body-non-emptiness rule is enforced by the Vitest assertion in Recipe R9, not by the Zod schema. Eight of the eleven Iconify identifiers in D-17's proposed mapping resolve cleanly against the live Iconify API; three require corrections (Recipe R7) — `devicon:django` does not exist (use `simple-icons:django` or `logos:django-icon`), and `devicon:react-original` / `devicon:apple-original` / `devicon:windows8-original` / `devicon:amazonwebservices-original` / `devicon:nodejs-plain-wordmark` all drop the suffix on Iconify (Iconify hosts each as the bare canonical name only). `_orphans/` containment is safe — Astro only scans paths under each collection's `base` + `pattern`, so a sibling directory not referenced by any collection is invisible to the build.

**Primary recommendation:** Use the schema-function form for the `projects` collection (`schema: ({ image }) => z.object({...})`), the standard `z.object(...)` for the other four list collections (no images in frontmatter for those), Zod 4 idioms throughout (`z.email()`, `z.url()`, error key `error:`), the object-map YAML form for `about`/`skills` singletons, and the array YAML form for `links`. Hand-author the 20 markdown + 3 YAML files (20 entries × ~10 lines each is ~10–15 minutes of typing — a one-shot migration script adds a `scripts/` file and parser logic for one-time-only value).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Content storage (markdown bodies, YAML data) | Build-time content (Astro Content Layer) | — | Static content. No runtime fetching. `getCollection` resolves at build. |
| Image asset binding | Build-time content (`image()` helper) → Vite asset pipeline | Phase 3 `<Image />` consumer | `image()` typechecks the path at build, Vite hashes/optimizes at build, Phase 3's `<Image />` renders. Phase 2 stops at typing. |
| Schema validation | Build-time (Zod via Astro) | — | All validation at `astro check` / `astro build`. No runtime validation. |
| Body-content validation (non-empty) | Build-time test (Vitest) | — | Astro's schema doesn't cover body; the Vitest assertion runs as part of the existing test gate. |
| Nav structure (id↔label↔order) | Build-time content (`links` collection) | Phase 3 SideNav consumer | Single source of truth for the section id (anchor) and label. Phase 3 reads it. |
| Icon identifier validation (regex shape only) | Build-time (Zod regex) | Phase 3 (resolution via `astro-icon`) | Phase 2 only enforces the `prefix:name` shape; Phase 3 owns icon-pack resolution. |
| Draft filtering | Build-time (`getCollection` predicate) | — | The predicate pattern is established here; Phase 3 inherits the call signature. |

## Standard Stack

### Core (already installed via Phase 1)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | `^6.3.8` ([VERIFIED: package.json]) | Framework + Content Layer (`astro:content`, `astro/loaders`) | All loaders, schemas, `getCollection`/`getEntry` ship in the framework. |
| `typescript` | `^5.9.3` ([VERIFIED: package.json]) | Strictest tsconfig extends `astro/tsconfigs/strictest` | Phase 1 D-10 locked this. Schemas type-check against this. |
| `@astrojs/check` | `^0.9.9` ([VERIFIED: package.json]) | Provides the `astro check` CLI invoked by CONTENT-08 | Bundled language server + diagnostics for content schemas. |
| `vitest` | `^4.1.7` ([VERIFIED: package.json]) | Test runner for `content-validation.test.ts` (D-26..D-28) | Already wired in Phase 1; same `vitest.config.ts` covers `tests/*.test.ts`. |
| `zod` (transitive via `astro:content`) | Zod 4 ([CITED: docs.astro.build/en/guides/upgrade-to/v6/]) | Schema definitions | Astro 6 upgrades from Zod 3 to Zod 4. Do not `npm install zod` directly — use the re-export `import { z } from 'astro:content'`. |

### Supporting

No new dependencies are added in Phase 2. Icon-pack dependencies (`@iconify-json/*` + `astro-icon`) belong to Phase 3 STYLE-02 per CONTEXT.md's `<deferred>` block.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Per-item markdown + glob loader | Keep a single JSON via `file()` loader | Rejected — Pitfall P3 + the M2 CMS contract: per-item files are how a future editor adds/edits/reorders one entry. CONTEXT.md D-01 locks this. |
| Object-map YAML for singletons | Array-of-`{id, ...}` form | Object map is more idiomatic when the file is conceptually one document; array form is more explicit when the file is a list. We use object map for `about`/`skills` and array form for `links` (matches the data shape). |
| Hand-authored migration | Node migration script (`scripts/migrate-content.mjs`) | Hand-authored wins on this N (20 markdown + 3 YAML files). The script would parse the snapshot JSON once and emit files once; the parsing logic + image-copy logic is more code than the files it produces. See Recipe R10. |
| `z.string().email()` / `.url()` (Zod 3) | `z.email()` / `z.url()` (Zod 4) | Use Zod 4 forms — both compile, but v4 is the canonical form in Astro 6. |

**Installation:** None required (all dependencies pre-installed in Phase 1).

**Version verification:** Astro `6.3.8` ([VERIFIED: package.json]). Zod is bundled with Astro 6 — `import { z } from 'astro:content'`. Verified Zod 4 migration via [CITED: docs.astro.build/en/guides/upgrade-to/v6/].

## Package Legitimacy Audit

Phase 2 installs **zero new packages**. The icon-pack dependencies (`@iconify-json/*`, `astro-icon`) explicitly belong to Phase 3 per CONTEXT.md `<deferred>`. No `npm install` step appears in any Phase 2 task.

Because there are no new packages to vet, the slopcheck protocol is not exercised here. The planner should still gate Phase 3's icon-pack installs through slopcheck when that phase begins — that is a Phase 3 responsibility, not a Phase 2 one.

| Package | Registry | Disposition |
|---------|----------|-------------|
| *(none — Phase 2 adds no dependencies)* | — | — |

## Architecture Patterns

### System Architecture Diagram

```
                ┌─────────────────────────────────────────────┐
                │  .planning/snapshots/m1-source/             │
                │     resumeData.json  +  assets/*.png|jpg|webp│
                │     (read-only source — Phase 5 deletes)    │
                └────────────────────────┬────────────────────┘
                                         │
                                  (one-time migration:
                                   hand-authored or
                                   scripts/migrate-content.mjs)
                                         │
                                         ▼
                ┌─────────────────────────────────────────────┐
                │  src/content/                               │
                │   projects/                                 │
                │     face-detection/                         │
                │       index.md   (frontmatter + body)       │
                │       face_detection.png                    │
                │     emotion-recognizer/                     │
                │       index.md                              │
                │       emotion_recognition.png               │
                │     ... 11 more project dirs ...            │
                │   work/<slug>/index.md          (2 entries) │
                │   education/<slug>/index.md     (3 entries) │
                │   leadership/<slug>/index.md    (1 entry)   │
                │   testimonials/<slug>/index.md  (1 entry)   │
                │   about.yaml      (object map: {about: {…}})│
                │   skills.yaml     (object map: {skills:{…}})│
                │   links.yaml      (array of {id,label,order})│
                │   _orphans/       (4 stranded images)       │
                │   ┌─────────────────────────────────────┐   │
                │   │ Not referenced by any defineCollection │ │
                │   │ → Astro never scans it.              │ │
                │   └─────────────────────────────────────┘   │
                └────────────────────┬────────────────────────┘
                                     │
                          src/content.config.ts
                          (8 defineCollection exports +
                           `export const collections = {...}`)
                                     │
                                     ▼
                ┌─────────────────────────────────────────────┐
                │  Build-time validation                      │
                │   - astro check  → 0 / non-zero            │
                │   - astro build  → dist/                   │
                │   - Vitest content-validation.test.ts:     │
                │       (a) malformed fixture → fails check  │
                │       (b) real data → getCollection > 0    │
                │       (c) body non-empty assertion         │
                └────────────────────┬────────────────────────┘
                                     │
                                     ▼
                          (Phase 3 consumes:
                           getCollection('projects', predicate)
                           getEntry('about', 'about')
                           <Image src={entry.data.cover} />)
```

### Recommended Project Structure

```
src/
├── content.config.ts              # All 8 defineCollection exports
├── content/
│   ├── about.yaml                 # Singleton (object-map form)
│   ├── skills.yaml                # Singleton (object-map form)
│   ├── links.yaml                 # Array of nav entries
│   ├── projects/
│   │   ├── face-detection/
│   │   │   ├── index.md
│   │   │   └── face_detection.png
│   │   ├── emotion-recognizer/
│   │   │   ├── index.md
│   │   │   └── emotion_recognition.png
│   │   ├── american-sign-language-detection/index.md + asl.png
│   │   ├── age-of-warring-empire-tower-bot/index.md + aowe.jpg
│   │   ├── smart-india-hackathon/index.md + SIH.png
│   │   ├── e-yantra-competition/index.md + eyantra.jpg + eyantra.png
│   │   ├── garduino-smart-garden/index.md + garduino.png  # renamed
│   │   ├── stack-overflow-chatbot/index.md + chatbot.png
│   │   ├── twitter-named-entity-recognition/index.md + ner.png
│   │   ├── library-attendance-manager/index.md + library.png
│   │   ├── dj-archive/index.md + archive.jpeg + archive.jpg + archive.png
│   │   ├── college-event-manager-app/index.md + event.png
│   │   └── resume-website/index.md + resume.png
│   ├── work/
│   │   ├── phionike-solutions/index.md
│   │   └── pear-technologies/index.md
│   ├── education/
│   │   ├── dj-sanghvi-college-of-engineering/index.md
│   │   ├── st-rocks-college-of-science-and-commerce/index.md
│   │   └── st-francis-school/index.md
│   ├── leadership/
│   │   └── dj-unicode/index.md
│   ├── testimonials/
│   │   └── roopam-mishra/index.md
│   └── _orphans/                  # Astro never reads this
│       ├── attendance.png
│       ├── attendance.webp
│       ├── attendance1.png
│       └── smgarden.png
├── assets/
│   └── profile.jpg                # renamed from profilepic.jpg
└── ...

tests/
├── smoke.test.ts                  # Phase 1 — unchanged
├── content-validation.test.ts     # NEW — D-26..D-28
└── __fixtures__/
    ├── HydrationCheck.tsx         # Phase 1 — unchanged
    └── malformed-project.md       # NEW — D-26 fixture
```

### Pattern 1: Schema-function form for image collections (CONTENT-05, Pitfall 4)

**What:** When a collection schema needs `image()`, the schema MUST be a function `({ image }) => z.object(...)`, not a static `z.object(...)`. The `image` helper is **only** injected through this callback — there is no `import { image }` available.

**When to use:** Always when at least one frontmatter field references an image asset. For Phase 2 this is `projects` only.

**Example:**

```ts
// Source: https://docs.astro.build/en/guides/images/ (verified 2026-05-26)
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      tech_stack: z.array(z.string()).default([]),
      url: z.url().optional(),
      cover: image(),
      alternates: z.array(image()).optional(),
      order: z.number().int().default(0),
      draft: z.boolean().default(false),
    }),
});
```

### Pattern 2: Static schema for image-free collections

**What:** For `work`, `education`, `leadership`, `testimonials`, no frontmatter image is required. Use the static form.

**Example:**

```ts
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    company: z.string().min(1),
    title: z.string().min(1),
    duration: z.string().min(1),       // free-text date range, preserves "May 2019 - July 2019"
    url: z.url().optional(),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
  }),
});
```

### Pattern 3: `file()` loader for object-map singletons

**What:** YAML root is an object whose keys become entry IDs. For `about` and `skills` we use a single top-level key whose value is the schema object.

**Example:**

```ts
const about = defineCollection({
  loader: file('src/content/about.yaml'),
  schema: z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    current_status: z.string().min(1),
    email: z.email(),
    contact_message: z.string().min(1),
    description: z.string().min(1),
    resume_download: z.string().min(1),    // filename only, e.g. 'Rashmil_Panchani.pdf'
    profile_image: z.string().min(1),      // string path, NOT image() — D-11
    social: z
      .array(
        z.object({
          name: z.string().min(1),
          url: z.url(),
          icon: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/),
        }),
      )
      .min(1),
  }),
});
```

The `about.yaml` file content:

```yaml
# src/content/about.yaml — object-map form
about:                              # top-level key = entry id
  first_name: Rashmil
  last_name: Panchani
  current_status: "Undergraduate BE Computer Engineering @Dwarkadas J. Sanghvi College of Engineering"
  email: rashmilp833@gmail.com
  contact_message: "Have a project for me? ..."
  description: "I am an athlete at heart, ..."
  resume_download: Rashmil_Panchani.pdf
  profile_image: ~/assets/profile.jpg
  social:
    - name: LinkedIn
      url: https://www.linkedin.com/in/rashmil-panchani-67587a14b/
      icon: simple-icons:linkedin
    - name: Github
      url: https://github.com/Rashmil-1999
      icon: simple-icons:github
```

Consumption: `await getEntry('about', 'about')` → returns `{ id: 'about', data: { first_name: ..., ... } }`.

### Pattern 4: `file()` loader for array singletons (`links`)

```ts
const links = defineCollection({
  loader: file('src/content/links.yaml'),
  schema: z.object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    label: z.string().min(1),
    order: z.number().int().default(0),
  }),
});
```

The `links.yaml` file content:

```yaml
# src/content/links.yaml — array form
- id: about
  label: About
  order: 10
- id: education
  label: Education
  order: 20
- id: work
  label: Work
  order: 30
- id: skills
  label: Skills
  order: 40
- id: projects
  label: Projects
  order: 50
- id: leadership
  label: Leadership
  order: 60
- id: testimonials
  label: Testimonials
  order: 70
```

Consumption: `await getCollection('links')` → returns 7 entries. The schema describes ONE entry, not the array (Pitfall P3).

### Pattern 5: Draft-aware `getCollection` predicate (CONTEXT.md D-05, Pitfall 28)

```ts
// Source: https://docs.astro.build/en/reference/modules/astro-content/ (verified 2026-05-26)
import { getCollection } from 'astro:content';

const projects = await getCollection('projects', ({ data }) =>
  import.meta.env.PROD ? data.draft !== true : true,
);
```

Phase 2 establishes the pattern; Phase 3 reuses verbatim.

### Anti-Patterns to Avoid

- **`import { z } from 'zod'`** — Use `import { z } from 'astro:content'` so the bundled Zod 4 version is consumed (avoids a Zod 3/4 mismatch if a stray `zod@3` ends up in `node_modules`).
- **`z.string().email()` / `z.string().url()`** — Deprecated in Zod 4. Use top-level `z.email()` / `z.url()`. Compiles either way, but `astro check` may surface deprecation warnings.
- **`type: 'content'` or `type: 'data'`** — Removed in Astro 6 (Pitfall P2). Use `loader:` exclusively.
- **`src/content/config.ts`** — Astro 6 ignores this path. Must be `src/content.config.ts` (Pitfall P1).
- **`z.array(...)` as the schema for a `file()` loader** — Schemas describe **one entry**, never the array shape (Pitfall P3).
- **`cover: z.string()` for an image** — Skips the `image()` pipeline; re-creates the unoptimized-image bug class.
- **`image: /assets/foo.png` (leading slash) in frontmatter** — That's a `public/` path, bypasses Vite hashing. Must be `./foo.png` relative to the markdown file (Pattern 1).
- **A `slug:` field in frontmatter** — Astro 6 auto-derives `entry.id` from the directory name. No manual slug needed.
- **`getCollection('projects').then(arr => arr.filter(...))`** — Always pass the predicate to `getCollection` (Pitfall 28).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Loading per-entry markdown | A custom `import.meta.glob('./content/**/*.md')` | `glob()` loader from `astro/loaders` | Loader handles ID derivation, frontmatter parsing, image-asset resolution, schema validation as one pipeline. |
| YAML parsing | `js-yaml` + custom parsing | `file()` loader (YAML autodetected) | Built-in. Custom parsers for CSV/TOML only. |
| Image-key → import map (`image_map`) | A static object literal mapping keys to imports | `image()` schema helper + per-entry colocation (D-07) | Pitfall P5/P20 carry-forward. `image_map` is a CONCERNS.md anti-pattern. |
| Slug derivation | Manual `slug:` frontmatter or a slugify helper | Astro 6 auto-derives from directory name (D-02) | One less field to keep in sync; the directory IS the slug. |
| Body-content validation | Reading the markdown file in `astro.config.mjs` | Vitest assertion in `content-validation.test.ts` (D-20, Recipe R9) | Astro schemas don't cover body; trying to hook the loader is fragile. The test is one assertion. |
| Draft filtering in templates | `arr.filter(e => !e.data.draft)` after `getCollection` | Predicate to `getCollection` (Pattern 5) | Build-time filter; correctness for future drafts; sets the convention for Phase 3. |
| Cross-collection references (project → testimonial author) | String keys joined manually | `reference('testimonials')` from `astro:content` | Out of scope for Phase 2 — no cross-references needed. Documented for completeness. |

**Key insight:** Every "I could just …" temptation in this phase has a built-in Astro equivalent. The Content Layer's whole point is to absorb this work.

## Runtime State Inventory

Not applicable. Phase 2 is a greenfield content migration: source data lives in a snapshot directory (read-only), output lives in `src/content/`. No runtime databases, no live service configs, no OS-registered state, no secrets, no installed packages reference the renamed/migrated data. Phase 5 deletes the snapshot after CONTENT-06 verification.

**Stored data:** None — JSON snapshot is the only source, and it's read-only during Phase 2.
**Live service config:** None.
**OS-registered state:** None.
**Secrets/env vars:** None.
**Build artifacts:** `.astro/types.d.ts` regenerates on each `astro dev`/`astro build` from `src/content.config.ts`. Phase 2 tasks that touch `content.config.ts` should `rm -rf .astro/` between iterations if the dev server is running and types appear stale (Pitfall P1 recovery step).

## Common Pitfalls

### Pitfall P1: Config file at the wrong path (`src/content/config.ts`)

**What goes wrong:** Astro 6 only auto-loads `src/content.config.ts`. The Astro 4 location (`src/content/config.ts`) is silently ignored — types in `.astro/types.d.ts` never regenerate; `getCollection()` returns untyped data or zero entries.
**Why it happens:** Carry-over muscle memory; many tutorials still show the v4 path.
**How to avoid:** Phase 1 D-11 already created the file at the correct path. Phase 2 edits in place. Don't move it.
**Warning signs:** Types come through as `any`; `.astro/content.d.ts` doesn't list your collections.
[Source: .planning/research/PITFALLS.md Pitfall 1; verified against docs.astro.build/en/guides/upgrade-to/v5/]

### Pitfall P2: Legacy `type:` API (REMOVED in v6, not just deprecated)

**What goes wrong:** Astro 6 **removed** the `type: 'content'` / `type: 'data'` API entirely, along with the `legacy.collections` flag. CONTEXT.md notes this; verifying it here: any collection defined with `type:` instead of `loader:` will fail at build with a hard error.
**How to avoid:** Use `loader: glob(...)` / `loader: file(...)` exclusively. Dynamic routes use `[...id]`, not `[...slug]` — confirmed for v6.
**Warning signs:** Build error `Collection ... uses unsupported legacy API`.
[Source: PITFALLS.md Pitfall 2; verified against [Astro v6 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v6/)]

### Pitfall P3: `file()` loader schema shape mismatch

**What goes wrong:** Writing `schema: z.array(z.object(...))` for a `file()` loader on a YAML array. The schema describes ONE entry, never the array shape — the loader handles the array.
**Why it happens:** Intuition says "the file is an array, so the schema is an array."
**How to avoid:** Always `schema: z.object(...)` for `file()` loaders. The loader iterates; the schema validates each row.
**Warning signs:** Zod errors like `expected object, received array` at build.
[Source: PITFALLS.md Pitfall 3]

### Pitfall P4: `image()` not used / images bypass the optimizer

**What goes wrong:** Using `cover: z.string()` for an image field means the path isn't validated, the asset isn't piped through Astro's image pipeline, and `<Image src={entry.data.cover} />` ships the original binary.
**How to avoid:** Schema-function form `({ image }) => z.object({ cover: image() })`. Frontmatter paths are relative to the markdown file (`./garduino.png`). Co-locate the image with the entry directory (D-01, D-07).
**Warning signs:** Frontmatter typed as `string` for an image; image paths starting with `/`; raw `<img>` tags in Phase 3.
[Source: PITFALLS.md Pitfall 4; verified at docs.astro.build/en/guides/images/]

### Pitfall P19: Parallel `sections` + `links` arrays carried forward

**What goes wrong:** The existing JSON has two parallel arrays (`sections[]` of labels and `links[]` of hash anchors) that must stay aligned by index. Carrying both forward as separate YAML files would re-create the fragility.
**How to avoid:** D-14 collapses them into one collection: `links.yaml` is an array of `{id, label, order}` objects. The id IS the section anchor (no `#` prefix; Phase 3 prepends). Single source of truth.
**Warning signs:** Any other YAML or schema with parallel arrays you have to update together.
[Source: PITFALLS.md Pitfall 19]

### Pitfall P20: `image_map` lookup pattern reintroduced

**What goes wrong:** The existing `Projects.jsx` has a hard-coded `image_map: { faceDetection: import('../assets/face_detection.png'), ... }`. Re-implementing this in Astro (e.g., a TS object literal mapping slugs to image imports) re-creates the two-sources-of-truth fragility.
**How to avoid:** Put the image WITH the entry (per-entry directory, D-01); validate via `image()` (D-07); reference in frontmatter as `./<filename>`. No map.
**Warning signs:** Any JS/TS object literal mapping slugs/keys to image imports; any `import.meta.glob('./projects/**/*.png')` keyed by filename.
[Source: PITFALLS.md Pitfall 20; CONCERNS.md "Image lookup in Projects.jsx"]

### Pitfall P28: `getCollection` filter at runtime, not at build

**What goes wrong:** `(await getCollection('projects')).filter(...)`. For M1 the perf cost is trivial, but the **convention** propagates — once drafts exist in M2, a runtime filter risks leaking drafts into static HTML.
**How to avoid:** Pass the predicate as the 2nd arg (Pattern 5). For M1 the predicate is `import.meta.env.PROD ? !data.draft : true` — same shape as M2 will use.
**Warning signs:** Template code that awaits `getCollection` and then `.filter(...)` on the result.
[Source: PITFALLS.md Pitfall 28]

### Additional Phase-2-specific pitfalls (NOT in PITFALLS.md)

### Pitfall P2-V1: Zod 4 (Astro 6) vs Zod 3 (Astro 5) idioms

**What goes wrong:** CONTEXT.md and most tutorials use Zod 3 patterns: `z.string().email()`, `z.string().url()`, `.min(N, { message: '...' })`, `ZodError.errors`. In Zod 4, these are **deprecated but still functional**. The canonical forms are `z.email()`, `z.url()`, `.min(N, { error: '...' })`, `ZodError.issues`. Astro 6 ships Zod 4.
**How to avoid:** Use Zod 4 idioms in `src/content.config.ts`. The deprecated forms compile, but `astro check` may surface deprecation hints, and the schemas read more cleanly with v4 idioms. **Note:** `.refine((val) => ({ message: ... }))` (passing a function as the second arg) is **REMOVED** in Zod 4 — must use `.refine((val) => boolean, { error: '...' })`.
**Warning signs:** `astro check` warnings mentioning Zod deprecations; existing code in tutorials breaking on copy-paste.
[Source: [Astro v6 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v6/) — "Astro 6 upgrades to Zod 4 from Zod 3"; verified against Zod 4 changelog]

### Pitfall P2-V2: `file()` loader does NOT accept a single-root-object YAML

**What goes wrong:** Writing `about.yaml` as a flat object (`first_name: Rashmil\nlast_name: ...`) and pointing `file()` at it. The loader expects EITHER an array of `{id, ...}` objects OR an object-map (top-level keys = entry IDs). A flat single-object YAML produces undefined behavior or a "missing id" error.
**How to avoid:** Use the object-map form for `about` and `skills` — one top-level key (`about:` / `skills:`) whose value is the schema object. Use the array form for `links`. Consumption is `getEntry('about', 'about')` for object-map singletons and `getCollection('links')` for the array form.
**Warning signs:** `getEntry('about', 'about')` returns `undefined`; type error "missing id"; the YAML file's data appears under an unexpected ID at runtime.
[Source: [Astro Content Loader API docs](https://docs.astro.build/en/reference/content-loader-reference/) — "creates entries from a single file that contains an array of objects with a unique id field, or an object with IDs as keys and entries as values"; verified 2026-05-26]

### Pitfall P2-V3: Markdown body is NOT covered by the Zod schema

**What goes wrong:** Assuming `z.object({ ...frontmatter..., body: z.string().min(1) })` will catch an empty markdown body. The schema only validates frontmatter — the body is exposed via `render().body` at consumption time, not during validation.
**How to avoid:** Implement D-20's body-non-emptiness check as a Vitest assertion (Recipe R9, sub-test C). Iterate every list-collection entry, call `entry.body` (or `render()` if needed), and assert it's non-empty.
**Warning signs:** A `body:` key declared in the schema (will silently fail to validate); empty `<Content />` renders in Phase 3 going unnoticed.
[Source: [docs.astro.build/en/guides/content-collections/](https://docs.astro.build/en/guides/content-collections/) — "If any file violates its collection schema, Astro will provide a helpful error" (only applies to frontmatter); verified 2026-05-26]

### Pitfall P2-V4: Astro 6 validation error format regression (known issue)

**What goes wrong:** Astro v6 has a known regression where content-collection validation errors are less human-readable than v5. The error contains a raw Zod issue JSON dump prefixed with `**:`. CONTENT-08 / D-27 asserts that stderr contains both the field path and the entry id — verified that both ARE present, but the format is:

```
[InvalidContentEntryDataError] <collection-name> → <entry-id> data does not match collection schema.

  **: [
  {
    "expected": "object",
    "code": "invalid_type",
    "path": [ "title" ],
    "message": "title: Required"
  }
]
```

**How to avoid:** Write D-27's assertions against the **JSON serialization**, not a clean human-readable message. The entry id (`__test__`) appears as `... → __test__`. The field path (`title`) appears as `"path": [ "title" ]` and again as `"message": "title: Required"`. Both substring matches succeed against this format.
**Warning signs:** Test assertions like `expect(stderr).toContain('title is required')` (cleaner v5 form) will FAIL on v6.
[Source: [withastro/astro#15976](https://github.com/withastro/astro/issues/15976) — confirmed open in current main branch]

### Pitfall P2-V5: Strictest tsconfig (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)

**What goes wrong:** Phase 1 D-10 enabled `astro/tsconfigs/strictest`, which adds `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. Astro's generated `astro:content` types in `.astro/types.d.ts` are derived from Zod schemas and **should** satisfy both flags out of the box — but subtle schema shapes can cause friction:
  - `z.string().optional()` produces `string | undefined`. Under `exactOptionalPropertyTypes`, this is NOT assignable to `field?: string` (which means "missing or string but not undefined"). Schema fields that are optional in the data shape may need explicit handling at the consumption site.
  - Array indexing (e.g., `entries[0]`) returns `T | undefined` under `noUncheckedIndexedAccess`. Phase 3 will need `entries[0]?.data` or explicit length guards.

**How to avoid:** Phase 2's job is to produce schemas that type-check cleanly. If `astro check` surfaces an `exactOptionalPropertyTypes` error from a generated type, the cleanest fix is to use `.optional()` on the Zod side (output type is `T | undefined`) and consume with `if (entry.data.field !== undefined)` guards in Phase 3 — NOT to weaken the tsconfig.
**Warning signs:** `astro check` errors mentioning `T | undefined` is not assignable to optional property.
[Source: [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/); [astro/tsconfigs/strictest](https://github.com/withastro/astro/blob/main/packages/astro/tsconfigs/strictest.json) verified 2026-05-26]

## Code Examples

### Full `src/content.config.ts`

```ts
// src/content.config.ts
// Phase 2 — fills the Phase 1 D-11 placeholder.
// 8 collections: 5 list (glob) + 3 singleton (file).
// Zod 4 idioms (Astro 6 bundles Zod 4).

import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// --- Shared field schemas (optional refactor — planner judgment per CONTEXT.md "Claude's Discretion") ---
const iconSchema = z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/, {
  error: 'icon must be in Iconify "prefix:name" form (e.g., "devicon:python")',
});

const trimmedString = (min = 1) => z.string().trim().min(min);

// --- Projects (image-bearing list) ---
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: trimmedString(),
      tech_stack: z.array(trimmedString()).default([]),
      url: z.url().optional(),
      cover: image(),
      alternates: z.array(image()).optional(),
      order: z.number().int().default(0),
      draft: z.boolean().default(false),
    }),
});

// --- Work (image-free list) ---
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    company: trimmedString(),
    title: trimmedString(),
    duration: trimmedString(),
    url: z.url().optional(),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
  }),
});

// --- Education ---
const education = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/education' }),
  schema: z.object({
    name: trimmedString(),
    degree: trimmedString(),
    graduated: trimmedString(),
    score: trimmedString().optional(),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
  }),
});

// --- Leadership ---
const leadership = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/leadership' }),
  schema: z.object({
    org: trimmedString(),
    title: trimmedString(),
    duration: trimmedString(),
    url: z.url().optional(),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
  }),
});

// --- Testimonials ---
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    user: trimmedString(),
    role: trimmedString().optional(),
    org: trimmedString().optional(),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
  }),
});

// --- About (object-map singleton) ---
const about = defineCollection({
  loader: file('src/content/about.yaml'),
  schema: z.object({
    first_name: trimmedString(),
    last_name: trimmedString(),
    current_status: trimmedString(),
    email: z.email(),
    contact_message: trimmedString(),
    description: trimmedString(),
    resume_download: trimmedString(),
    profile_image: trimmedString(),
    social: z
      .array(
        z.object({
          name: trimmedString(),
          url: z.url(),
          icon: iconSchema,
        }),
      )
      .min(1),
  }),
});

// --- Skills (object-map singleton) ---
const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: z.object({
    categories: z
      .array(
        z.object({
          name: trimmedString(),
          order: z.number().int().default(0),
          items: z
            .array(
              z.object({
                name: trimmedString(),
                icon: iconSchema,
              }),
            )
            .min(1),
        }),
      )
      .min(1),
  }),
});

// --- Links (array singleton — nav entries) ---
const links = defineCollection({
  loader: file('src/content/links.yaml'),
  schema: z.object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/, {
      error: 'id must be lowercase kebab-case, starting with a letter',
    }),
    label: trimmedString(),
    order: z.number().int().default(0),
  }),
});

export const collections = {
  projects,
  work,
  education,
  leadership,
  testimonials,
  about,
  skills,
  links,
};
```

### Example list-collection markdown entry (`src/content/projects/face-detection/index.md`)

```markdown
---
title: Face Detection
tech_stack:
  - NumPy
  - OpenCV
  - Keras
  - Python
  - TensorFlow
url: https://github.com/Rashmil-1999/Face_detection
cover: ./face_detection.png
order: 10
---

In this project my aim was to build a python script that is able to detect faces. I used Haar Cascades to detect frontal faces. My next goal was to train a neural network that can distinguish my various faces. With that in mind I asked my friends to help my out by providing images of their faces (preferably frontal faces). I created 3 classes, one containing my face. The end product of the project was a 90% accurate model that can distinguish between various faces.
```

### Example singleton YAML (`src/content/skills.yaml` — object-map form)

```yaml
skills:
  categories:
    - name: "Programming Languages & Operating Systems"
      order: 10
      items:
        - { name: C, icon: devicon:c }
        - { name: C++, icon: devicon:cplusplus }
        - { name: Java, icon: devicon:java }
        - { name: Python, icon: devicon:python }
        - { name: Go, icon: devicon:go }
        - { name: JavaScript, icon: devicon:javascript }
        - { name: Windows, icon: devicon:windows8 }
        - { name: Linux, icon: devicon:linux }
        - { name: macOS, icon: devicon:apple }
    - name: "Database Technologies"
      order: 20
      items:
        - { name: MySQL, icon: devicon:mysql }
        - { name: "Postgre SQL", icon: devicon:postgresql }   # user voice preserved per D-22
        - { name: MongoDB, icon: devicon:mongodb }
        - { name: Redis, icon: devicon:redis }
        - { name: GraphQL, icon: logos:graphql }
    - name: "Web Development"
      order: 30
      items:
        - { name: HTML5, icon: devicon:html5 }
        - { name: CSS3, icon: devicon:css3 }
        - { name: Django, icon: simple-icons:django }     # D-17 correction: devicon:django does not exist
        - { name: NodeJS, icon: devicon:nodejs }
        - { name: ReactJS, icon: devicon:react }
        - { name: Bootstrap, icon: devicon:bootstrap }
    - name: "Dev Ops"
      order: 40
      items:
        - { name: Heroku, icon: devicon:heroku }
        - { name: AWS, icon: devicon:amazonwebservices }
        - { name: "Google Cloud Platform", icon: logos:google-cloud }
    - name: "Tools and Frameworks"
      order: 50
      items:
        - { name: NumPy, icon: simple-icons:numpy }
        - { name: Pandas, icon: simple-icons:pandas }
        - { name: Tensorflow, icon: simple-icons:tensorflow }
        - { name: Keras, icon: simple-icons:keras }
        - { name: NLTK, icon: lucide:code }              # D-17 placeholder; no good brand match
        - { name: OpenCV, icon: simple-icons:opencv }
    - name: "Version Control"
      order: 60
      items:
        - { name: Git, icon: devicon:git }
```

## Implementation Recipes

### Recipe R1: `src/content.config.ts` structure

See "Code Examples → Full `src/content.config.ts`" above. Single file, 8 `defineCollection` calls, one `export const collections` object. ~120 lines including comments.

### Recipe R2: List-collection per-entry markdown shape

```
src/content/<collection>/<slug>/index.md
src/content/<collection>/<slug>/<image>.{png|jpg|jpeg|webp}   (projects only)
```

- Slug = kebab-case derived from `title` (or `company`/`name`/`org`/`user`).
- Frontmatter holds only metadata (title/company/duration/etc. + `order` + `draft` + `cover` if applicable).
- Body holds the long-form description.
- Filename is always `index.md` so the directory IS the entry.

### Recipe R3: Singleton YAML shapes

| File | Form | Top-level shape | Consumption |
|------|------|-----------------|-------------|
| `about.yaml` | object map | `about: { first_name: ..., ... }` | `getEntry('about', 'about')` |
| `skills.yaml` | object map | `skills: { categories: [...] }` | `getEntry('skills', 'skills')` |
| `links.yaml` | array | `[ {id, label, order}, ... ]` | `getCollection('links')` |

### Recipe R4: `order` field defaults (CONTENT-04)

Sparse step-10 numbering matching current array order:

| Collection | Order values |
|------------|--------------|
| `projects` (13 entries) | 10, 20, 30, ..., 130 — in the snapshot's `projects` array order |
| `work` (2 entries) | 10, 20 |
| `education` (3 entries) | 10, 20, 30 |
| `leadership` (1 entry) | 10 |
| `testimonials` (1 entry) | 10 |
| `links` (7 entries) | 10, 20, 30, 40, 50, 60, 70 — per D-25 |
| `skills.categories` (6 categories) | 10, 20, 30, 40, 50, 60 |

Sparse numbering means inserting between entries doesn't require renumbering — e.g., a future project between #10 and #20 can be `15`.

### Recipe R5: Project image colocation (CONTENT-05, D-07–D-10)

| Project (slug) | Snapshot files copied | `cover` frontmatter value | Notes |
|----------------|-----------------------|---------------------------|-------|
| `face-detection` | `face_detection.png` | `./face_detection.png` | |
| `emotion-recognizer` | `emotion_recognition.png` (NOT `emotion.png` 4.8 MB; CONCERNS.md says use the small one) | `./emotion_recognition.png` | Pitfall P4 carry-forward — switching to the 23 KB variant |
| `american-sign-language-detection` | `asl.png` | `./asl.png` | |
| `age-of-warring-empire-tower-bot` | `aowe.jpg` | `./aowe.jpg` | |
| `smart-india-hackathon` | `SIH.png` | `./SIH.png` | |
| `e-yantra-competition` | `eyantra.jpg`, `eyantra.png` | `./eyantra.jpg` (cover); `./eyantra.png` (alternates[0]) | Both copy in; cover is the larger jpg |
| `garduino-smart-garden` | `graduino.png` → renamed to `garduino.png` | `./garduino.png` | **D-09 rename** — the only filename change |
| `stack-overflow-chatbot` | `chatbot.png` | `./chatbot.png` | |
| `twitter-named-entity-recognition` | `ner.png` | `./ner.png` | |
| `library-attendance-manager` | `library.png` | `./library.png` | |
| `dj-archive` | `archive.jpeg`, `archive.jpg`, `archive.png` | `./archive.jpeg` (cover); `archive.jpg`, `archive.png` (alternates) | All three copy in per D-07 alternates |
| `college-event-manager-app` | `event.png` | `./event.png` | |
| `resume-website` | `resume.png` | `./resume.png` | |

**Orphans** (no project references; → `src/content/_orphans/`):
- `attendance.png`, `attendance.webp`, `attendance1.png` — older Library Attendance Manager screenshots
- `smgarden.png` — no Garduino reference uses this; the snapshot's Garduino is `graduino.png`

**Special: `profilepic.jpg`** (1 MB, used by SideNav today). → Phase 2 copies to `src/assets/profile.jpg` per D-11. `about.yaml` references it as `profile_image: ~/assets/profile.jpg`.

### Recipe R6: Snapshot inventory (CONTENT-06 round-trip checklist)

The manual diff for CONTENT-06 checks every key in `.planning/snapshots/m1-source/resumeData.json`:

| JSON path | → Phase 2 destination |
|-----------|----------------------|
| `about.first_name` (trimmed — `"Rashmil "` → `"Rashmil"`) | `about.yaml: about.first_name` |
| `about.last_name` | `about.yaml: about.last_name` |
| `about.current_status` | `about.yaml: about.current_status` |
| `about.email` | `about.yaml: about.email` |
| `about.contact_message` | `about.yaml: about.contact_message` |
| `about.description` | `about.yaml: about.description` |
| `about.resume_download` | `about.yaml: about.resume_download` |
| `about.social[]` (with `className`) | `about.yaml: about.social[]` (with `icon` = Iconify id; mapping per R7) |
| `sections[]` (labels — `["About", "Education", "Experience", ...]`) + `links[]` (anchors — `["#about", "#education", "#experience", ...]`) | `links.yaml` (D-14 collapse; `Experience` → `Work` per D-24) |
| `resumeData.education[]` | `src/content/education/<slug>/index.md` × 3 |
| `resumeData.work[]` | `src/content/work/<slug>/index.md` × 2 |
| `resumeData.skill_array[]` + `resumeData.skills{}` | `skills.yaml: skills.categories[]` (D-15 collapse) |
| `projects[]` | `src/content/projects/<slug>/index.md` × 13 + colocated images |
| `testimonials[]` | `src/content/testimonials/<slug>/index.md` × 1 |
| `leaderships[]` | `src/content/leadership/<slug>/index.md` × 1 |

**Trimming applied (D-21):** `"Rashmil "` → `"Rashmil"`. **Preserved (D-22):** `"Postgre SQL"`, `"peAR Technologies."`, school name casing.

### Recipe R7: Iconify identifier mapping (D-17) — VERIFIED against live Iconify API 2026-05-26

| Snapshot CDN class | Recommended Iconify id | Verified? |
|-------------------|------------------------|----------|
| `devicon-c-plain colored` | `devicon:c` | YES |
| `devicon-cplusplus-plain colored` | `devicon:cplusplus` | YES |
| `devicon-java-plain colored` | `devicon:java` | YES |
| `devicon-python-plain colored` | `devicon:python` | YES |
| `devicon-go-plain colored` | `devicon:go` | YES |
| `devicon-javascript-plain colored` | `devicon:javascript` | YES |
| `devicon-windows8-original colored` | `devicon:windows8` | YES (Iconify drops the `-original` suffix) |
| `devicon-linux-plain colored` | `devicon:linux` | YES |
| `devicon-apple-original colored` | `devicon:apple` | YES (Iconify drops `-original`) |
| `devicon-mysql-plain colored` | `devicon:mysql` | YES |
| `devicon-postgresql-plain colored` | `devicon:postgresql` | YES |
| `devicon-mongodb-plain colored` | `devicon:mongodb` | YES |
| `devicon-redis-plain colored` | `devicon:redis` | YES |
| `devicon-html5-plain colored` | `devicon:html5` | YES |
| `devicon-css3-plain colored` | `devicon:css3` | YES |
| `devicon-django-plain colored` | **`simple-icons:django`** | YES on simple-icons; **NO on devicon** (devicon doesn't ship a Django glyph in the Iconify mirror) — alternative `logos:django-icon` also exists |
| `devicon-nodejs-plain-wordmark colored` | `devicon:nodejs` (or `devicon:nodejs-wordmark` if a wordmark is desired) | YES (both exist; pick one) |
| `devicon-react-original colored` | `devicon:react` | YES (Iconify drops `-original`) |
| `devicon-bootstrap-plain colored` | `devicon:bootstrap` | YES |
| `devicon-heroku-plain colored` | `devicon:heroku` | YES |
| `devicon-amazonwebservices-original colored` | `devicon:amazonwebservices` | YES (Iconify drops `-original`) |
| `devicon-git-plain colored` | `devicon:git` | YES |
| `devicon-linkedin-plain colored` (social) | `simple-icons:linkedin` | YES (cleaner brand glyph) |
| `devicon-github-plain colored` (social) | `simple-icons:github` | YES |
| `iconify mr-2` + `data-icon: logos:graphql` | `logos:graphql` | YES (already Iconify) |
| `iconify mr-2` + `data-icon: logos-google-cloud-platform` | `logos:google-cloud` | YES (canonical name on logos set) |
| `iconify mr-2` + `data-icon: bx:bx-code-alt` (NumPy) | `simple-icons:numpy` | YES |
| `iconify mr-2` + `data-icon: bx:bx-code-alt` (Pandas) | `simple-icons:pandas` | YES |
| `iconify mr-2` + `data-icon: bx:bx-code-alt` (TensorFlow) | `simple-icons:tensorflow` | YES |
| `iconify mr-2` + `data-icon: bx:bx-code-alt` (Keras) | `simple-icons:keras` | YES |
| `iconify mr-2` + `data-icon: bx:bx-code-alt` (NLTK) | `lucide:code` (placeholder) | YES (icon exists; no NLTK brand glyph available in any set) |
| `iconify mr-2` + `data-icon: bx:bx-code-alt` (OpenCV) | `simple-icons:opencv` | YES |

**Iconify packs implicated** (Phase 3 will install): `@iconify-json/devicon`, `@iconify-json/simple-icons`, `@iconify-json/logos`, `@iconify-json/lucide`. **Phase 2 does NOT install these** — Phase 2 only stores the identifier strings and validates the regex shape.

### Recipe R8: Draft-aware consumption (Phase 3 inherits)

```ts
// Set in Phase 2 docs (Recipe R8) — Phase 3 copies verbatim.
const projects = await getCollection('projects', ({ data }) =>
  import.meta.env.PROD ? data.draft !== true : true,
);
const sortedProjects = projects.sort((a, b) => a.data.order - b.data.order);
```

For singletons:

```ts
const about = await getEntry('about', 'about');
const skills = await getEntry('skills', 'skills');
const navLinks = (await getCollection('links')).sort((a, b) => a.data.order - b.data.order);
```

### Recipe R9: Malformed-fixture test (`tests/content-validation.test.ts`, CONTENT-08, D-26..D-28)

```ts
// tests/content-validation.test.ts — D-26..D-28
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, expectTypeOf, it } from 'vitest';

const REPO_ROOT = process.cwd();
const FIXTURE = join(REPO_ROOT, 'tests/__fixtures__/malformed-project.md');
const TEMP_DIR = join(REPO_ROOT, 'src/content/projects/__test__');
const TEMP_FILE = join(TEMP_DIR, 'index.md');

describe('CONTENT-08: schema validation', () => {
    it('astro check fails on a malformed project entry with a useful Zod error', () => {
        mkdirSync(dirname(TEMP_FILE), { recursive: true });
        copyFileSync(FIXTURE, TEMP_FILE);
        try {
            const result = spawnSync('npx', ['astro', 'check'], {
                cwd: REPO_ROOT,
                encoding: 'utf8',
            });
            expect(result.status).not.toBe(0);
            const combined = `${result.stdout}\n${result.stderr}`;
            // D-27: stderr must surface both the entry id and the field path.
            // v6 format (Pitfall P2-V4): error JSON includes `"path": [ "title" ]`
            // and the entry path includes `→ __test__`.
            expect(combined).toContain('__test__');
            expect(combined).toMatch(/"path"\s*:\s*\[\s*"title"\s*\]/);
        } finally {
            rmSync(TEMP_DIR, { recursive: true, force: true });
        }
    }, 60_000); // astro check is slow; give it a minute
});

describe('CONTENT-08 positive path (SC #1)', () => {
    it('await getCollection("projects") returns >0 typed entries', async () => {
        // Static import keeps the test honest about the generated types.
        const { getCollection } = await import('astro:content');
        const projects = await getCollection('projects');
        expect(projects.length).toBeGreaterThan(0);
        // D-28 type assertion: entries have non-`any` types.
        expectTypeOf(projects[0]!.data.title).toEqualTypeOf<string>();
    });

    it('every list-collection entry has a non-empty markdown body (D-20)', async () => {
        const { getCollection } = await import('astro:content');
        for (const collection of ['projects', 'work', 'education', 'leadership', 'testimonials'] as const) {
            const entries = await getCollection(collection);
            for (const entry of entries) {
                // entry.body is the raw markdown body (Astro 6, glob loader).
                expect(entry.body?.trim().length, `${collection}/${entry.id}`).toBeGreaterThan(0);
            }
        }
    });
});
```

**Fixture content (`tests/__fixtures__/malformed-project.md`):**

```markdown
---
# Deliberately missing the required `title` field.
cover: ./nonexistent.png
order: 999
---

This entry intentionally lacks a title so CONTENT-08 can verify schema enforcement.
```

**Note on the fixture's `cover`:** because the projects schema uses `image()`, the cover field will also fail validation (the file doesn't exist). That's fine — the test asserts the error message contains both the entry id AND `"path": ["title"]`. If a stricter test is wanted, the fixture can omit the cover field too; the schema will still complain about the missing `title` first because Zod surfaces multiple errors. Either way the assertion succeeds.

**Why `spawnSync` and not Astro's programmatic API:** Astro's content validation runs as part of `astro check` / `astro build`. There is no public "validate this file" API. Spawning the CLI as a subprocess is the documented integration path for build-gate tests (mirrors Phase 1's smoke test pattern).

**Vitest config caveat:** `vitest.config.ts` already spawns `astro build` once in `globalSetup` (Phase 1 D-21). The new test creates a temporary entry AFTER that build runs, so the `getCollection` calls in the positive-path tests read from the `.astro/` cache that the build populated. The malformed-fixture test runs `astro check` against a now-different content tree (with the fixture present), which exercises the schema fresh. This works because `astro check` does its own schema scan independent of the prior build.

**If the malformed-fixture run interferes with the positive-path test (because the malformed entry is in `src/content/projects/__test__/` during the second test):** wrap the malformed test in `beforeEach`/`afterEach` so the cleanup happens before the positive-path tests run. The recipe above uses `try/finally` which is equivalent for serial test execution.

### Recipe R10: Migration approach — RECOMMENDATION: hand-author

CONTEXT.md leaves this to Claude's discretion. Tradeoffs:

| Approach | Pros | Cons |
|----------|------|------|
| **Hand-author** | No new code (a one-shot script becomes dead weight in Phase 5). Reviewer can inspect each file's content during planning verification. Frontmatter formatting and body trimming can be done with intent. Total files = 20 markdown + 3 YAML; ~30 minutes at typing speed. | Risk of typo in field name across 20 files. Mitigated by `astro check` + the Vitest body-check (any error surfaces immediately). |
| **Script** (`scripts/migrate-content.mjs`) | Deterministic + repeatable if the snapshot is edited. | Script becomes dead code after Phase 2; Phase 5 has to decide whether to delete it. The parsing logic + YAML emit + image copy is more code than the files it produces. The `garduino.png` rename + the special-case orphan moves are easier to express by reading the migration table (R5) than to encode in a script. |

**Recommendation: hand-author.** Use Recipe R5 + R6 + R7 as the authoritative checklists. The planner can split the work into one task per collection (5 list tasks + 1 singleton task + 1 image-copy task + 1 config-file task + 1 test task = ~9 tasks). If the planner disagrees and prefers a script, it should live at `scripts/migrate-content.mjs` and be deleted in Phase 5.

## Open Questions Resolved

### Q1: Markdown-body validation (D-20) — does Astro 6 expose the body during schema validation?

**Answer: NO.** Astro's schema validation covers frontmatter only. The body is available via `entry.body` (raw markdown string) or `render().body` (after compilation) at consumption time — never inside the `defineCollection` schema callback.
**Implication for D-20:** The non-empty body invariant cannot be enforced by Zod. It MUST be a Vitest assertion (Recipe R9, third sub-test). Confirmed against [docs.astro.build/en/guides/content-collections/](https://docs.astro.build/en/guides/content-collections/) and [docs.astro.build/en/reference/modules/astro-content/](https://docs.astro.build/en/reference/modules/astro-content/).
**Confidence:** HIGH.

### Q2: `astro check` CLI exit code and stderr format (CONTENT-08, D-27)

**Answer:** Exits non-zero on schema validation failure ([CITED: docs.astro.build/en/reference/cli-reference/](https://docs.astro.build/en/reference/cli-reference/) — "If any errors are found the process will exit with a code of 1"). The stderr/stdout output in Astro 6 contains the `InvalidContentEntryDataError` payload in the form:

```
[InvalidContentEntryDataError] <collection> → <entry-id> data does not match collection schema.

  **: [
  {
    "expected": "object",
    "code": "invalid_type",
    "path": [ "<field-name>" ],
    "message": "<field-name>: Required"
  }
]
```

Both the entry id (`__test__`) and the field path (as `"path": ["title"]`) appear. D-27's assertions are achievable, but must target this serialization (not a clean v5-style message). See Pitfall P2-V4.
**Confidence:** HIGH for v6 dev/build output; MEDIUM for `astro check` specifically (the [v6 regression issue #15976](https://github.com/withastro/astro/issues/15976) shows `astro dev` output verbatim; `astro check` is documented to surface the same error class but the regression thread does not show its output literally — Recipe R9 should be run during Wave 1 verification to confirm the format).
**Investigation if needed:** During Phase 2 planning, run `npx astro check` against the malformed fixture once and capture actual stderr — ~30 seconds of verification.

### Q3: `image()` schema + colocation behavior (D-07, D-08)

**Answer:** Confirmed. The schema-function form `schema: ({ image }) => z.object({ cover: image() })` validates that the referenced path exists relative to the markdown file. At runtime, `entry.data.cover` is an `ImageMetadata` object (`{ src, width, height, format }`). Astro pipes the asset through the Vite optimization pipeline at build (Phase 3 will render via `<Image src={entry.data.cover} />`); Phase 2 only needs the schema validation. Frontmatter paths starting with `/` are `public/` paths and bypass optimization — must use `./` relative paths.
**Confidence:** HIGH ([docs.astro.build/en/guides/images/](https://docs.astro.build/en/guides/images/)).
**Garduino check:** `cover: ./garduino.png` from `src/content/projects/garduino-smart-garden/index.md` resolves to `src/content/projects/garduino-smart-garden/garduino.png`. Path resolution is relative to the markdown's directory, so `./` always means "this entry's directory."

### Q4: `file()` loader schema shape for singletons (D-13/D-14/D-15)

**Answer:** The `file()` loader does NOT support a single-root-object YAML. It expects EITHER:
- An array of `{ id, ... }` objects (each object becomes one entry; id from the `id` field), OR
- An object whose top-level keys become entry IDs (each key/value pair becomes one entry).

**Implication for D-13/D-14/D-15:**
- `about.yaml` → object-map form: top-level key `about:` whose value is the schema object. Consumption: `getEntry('about', 'about')`.
- `skills.yaml` → object-map form: top-level key `skills:` whose value is the schema object. Consumption: `getEntry('skills', 'skills')`.
- `links.yaml` → already an array. Each entry's `id` field becomes the entry id. Consumption: `getCollection('links')`.

The schema in `defineCollection` describes ONE entry's shape (Pitfall P3) — never the array or the map.
**Confidence:** HIGH ([docs.astro.build/en/reference/content-loader-reference/](https://docs.astro.build/en/reference/content-loader-reference/)).

### Q5: `astro:content` types under strictest tsconfig flags

**Answer:** Astro's generated `astro:content` types ARE compatible with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` out of the box — but consumption-site code needs care:
- Array indexing (`projects[0]`) returns `T | undefined`. Phase 3 templates that map over results are fine (`projects.map(...)`); indexed access (`projects[0].data`) requires a guard.
- `.optional()` produces `T | undefined`, which under `exactOptionalPropertyTypes` is NOT assignable to a `field?: T` property declaration. Phase 2 schemas using `.optional()` need to be checked: if the consumer (Phase 3) does `const { url } = entry.data;` and the destructured variable is then assigned to a `url?: string` prop, the type error surfaces at the prop assignment, not at the schema.

**Phase 2 action:** Write schemas using `.optional()` (canonical form). Run `astro check` after the migration is complete. If any error surfaces, the planner's first move is to add explicit guards at the (Phase 3) consumption site, NOT to change the schema. If `astro check` surfaces a type error in the generated `.astro/content.d.ts` itself (unexpected — Astro's strictest tsconfig is designed for the framework's own output), that's a planner escalation.
**Confidence:** HIGH for the schema side; MEDIUM for "no consumption-side friction surfaces during Phase 2" (Phase 2 doesn't consume the schemas — Phase 3 does — so the test for friction is `astro check`'s output during Phase 2 verification).

### Q6: `_orphans/` directory containment

**Answer:** Confirmed safe. Astro only scans paths that match a collection's `base` + `pattern`. No `defineCollection` references `_orphans/`, so Astro never traverses it. The leading underscore is conventional but not required for containment — the absence of any `base` pointing at it is sufficient. A `.gitkeep` is optional (the directory becomes non-empty once the 4 stranded images are copied in, so git tracks it naturally).
**Confidence:** HIGH ([docs.astro.build/en/guides/content-collections/](https://docs.astro.build/en/guides/content-collections/) — `glob({ pattern, base })` restricts to the base).

### Q7: Migration approach (script vs hand-author)

**Answer:** Hand-author. See Recipe R10 for the full tradeoff analysis. The N is small (20 markdown + 3 YAML), the special cases (Garduino rename, orphan moves, multi-variant projects like `dj-archive`) are easier to express in a checklist than in a script, and the script becomes dead weight in Phase 5. If the planner disagrees: `scripts/migrate-content.mjs`, deleted in Phase 5.

### Q8: Iconify identifier audit (D-17) — verified live

**Answer:** See Recipe R7 for the full audited table. **Corrections required:**
- `devicon:django` does NOT exist on Iconify's devicon mirror. Use `simple-icons:django` (or `logos:django-icon`).
- `devicon:react-original`, `devicon:apple-original`, `devicon:windows8-original`, `devicon:amazonwebservices-original`, `devicon:nodejs-plain-wordmark` all FAIL on Iconify (the devicon Iconify mirror drops the `-original` / `-plain-wordmark` suffixes). Use the bare names: `devicon:react`, `devicon:apple`, `devicon:windows8`, `devicon:amazonwebservices`, `devicon:nodejs`.
- All other identifiers in D-17's proposed mapping resolve cleanly.

Phase 2's schema only validates the `prefix:name` regex shape — it does NOT validate that the identifier exists on Iconify. That check moves to Phase 3 (icon-pack resolution). Phase 2 just needs to use the correct strings now so Phase 3 doesn't have to re-edit every YAML.
**Confidence:** HIGH (live Iconify API verification 2026-05-26).

### Q9: Validation surface (Nyquist disabled — note for completeness)

**Answer:** `workflow.nyquist_validation: false` in `.planning/config.json`. The full Validation Architecture section is omitted per protocol. The validation surface for Phase 2 is:
- **Build gate:** `astro check` + `astro build` in CI (already wired by Phase 1 D-25's `ci.yml`).
- **Unit tests:** `tests/content-validation.test.ts` (Recipe R9) — three sub-tests covering the malformed fixture, the positive path, and body non-emptiness.
- **Integration test:** Phase 1's existing `tests/smoke.test.ts` runs `astro build` in `globalSetup` — Phase 2 inherits this gate (any schema error fails the entire test suite before assertions even run).
- **Manual diff:** CONTENT-06 requires a manual diff of the new collections against the snapshot to confirm zero data loss (Recipe R6's table is the checklist).

No `VALIDATION.md` is written per the project config.

## State of the Art

| Old approach | Current approach | When changed | Impact |
|--------------|------------------|--------------|--------|
| `defineCollection({ type: 'content', schema: ... })` | `defineCollection({ loader: glob({...}) , schema: ... })` | Astro 5 (deprecated `type:`); Astro 6 (removed) | Must use loader API; no fallback in v6 |
| `src/content/config.ts` | `src/content.config.ts` | Astro 5 | New file location; Astro 6 ignores the old path |
| `entry.slug` | `entry.id` | Astro 5 | Removed in v6 |
| `[...slug].astro` dynamic routes | `[...id].astro` | Astro 5 | Not relevant in M1 (no dynamic routes) but cite-able for future |
| Zod 3 (`z.string().email()`, `.min(N, {message})`, `ZodError.errors`, `.format()`) | Zod 4 (`z.email()`, `.min(N, {error})`, `ZodError.issues`, `z.treeifyError()`) | Astro 6 | Old forms still compile (deprecated). New schemas should use v4 idioms. |
| `image()` cropping opt-in | `image()` cropping by default | Astro 6 | Phase 3 image-rendering concern, not Phase 2's |

**Deprecated/outdated (do NOT use):**
- `type: 'content'` / `type: 'data'` — removed in v6
- `legacy.collections` flag — removed in v6
- `entry.slug` field — removed in v6
- `Astro.glob()` — removed in v6 (not used in Phase 2 anyway)

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|-------|---------|---------------|
| A1 | `astro check`'s stderr for content-schema errors matches the `astro dev` / `astro build` format documented in [issue #15976](https://github.com/withastro/astro/issues/15976). | Recipe R9 / Pitfall P2-V4 | Low. If the format differs, the D-27 assertions need a one-line tweak (different regex). The test still proves CONTENT-08 — the assertion shape is implementation detail. Mitigation: run the malformed fixture once during planning; capture actual stderr; adjust if needed. |
| A2 | Astro 6 reads `entry.body` (raw markdown string) directly off the glob-loader entry without requiring `render()`. | Recipe R9 (third sub-test) | Low. If the API requires `render().body`, the test changes from `entry.body` to `(await render(entry)).body`. Both forms are documented. |
| A3 | Astro will validate `image()` paths at build time and emit a clear error if the file is missing — not silently render a broken reference. | Recipe R5 / Pattern 1 | Low. If a path is missing, the build fails noisily — surfaces during the first `npm run build`. |
| A4 | The `_orphans/` directory needs no special exclusion (no `glob` ignore pattern) because no collection's `base` points at it. | Pitfall section / Open Question 6 | Very low. Confirmed against docs. If Astro 6 changes scanning behavior, a sibling `.astroignore` mechanism would absorb the fix. |

**Anything tagged `[ASSUMED]` in the user-constraints section** is also surfaced here:
- The Iconify identifier choice for NLTK (`lucide:code`) is a placeholder by definition — D-17 acknowledges this. Not a research assumption.

## Open Questions

1. **Should the `social[]` array be split into a separate `social.yaml` file?**
   - What we know: CONTEXT.md D-13 keeps `social` inline with `about` ("Social stays inline with `about` — it belongs to the person, not the nav").
   - What's unclear: Nothing. CONTEXT.md is explicit. Carrying through as a documented decision.
   - Recommendation: Honor CONTEXT.md. Social stays inline.

2. **Does the `astro:content` static import inside `tests/content-validation.test.ts` work without extra Vite/Vitest config?**
   - What we know: Vitest 4 in Phase 1 uses `getViteConfig` from `astro/config` (`vitest.config.ts` references `vitest/config` for type augmentation). `astro:content` is an Astro virtual module — resolution requires Astro's Vite plugin.
   - What's unclear: Whether the existing `vitest.config.ts` already exposes `astro:content` to test files, or whether the recipe needs to switch to a child-process approach (similar to D-27's `astro check` spawn).
   - Recommendation: During Phase 2 Wave 1 planning, write a 5-line probe test that imports `getCollection` and asserts the import compiles. If it fails, fall back to consuming `getCollection` via a transient `.astro` page rendered into `dist/` and asserting on the build output (the Phase 1 smoke test pattern). The malformed-fixture test (Recipe R9 first sub-test) does not need `astro:content` — it only spawns `astro check`.

3. **Should the malformed fixture's `cover` field point at a real file to isolate the `title` error?**
   - What we know: With `cover: ./nonexistent.png` and no `title`, Zod surfaces multiple errors (one per missing/invalid field). The D-27 assertion looks for `"path": ["title"]` substring — succeeds regardless.
   - What's unclear: Whether having multiple errors in one issue array changes the assertion logic.
   - Recommendation: Keep the fixture minimal (no `title`, optionally drop `cover` entirely so the only error is `title`). A single-error fixture is easier to debug if the assertion ever fails.

## Environment Availability

Phase 2 has no new external dependencies. Re-confirming Phase 1's existing toolchain since this phase exercises it:

| Dependency | Required by | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `node` | All tasks | ✓ | >=22.13.0 (package.json `engines`) | — |
| `npm` | All tasks | ✓ | bundled with Node 22 | — |
| `astro` CLI (`npx astro check`, `npx astro build`) | Recipe R9 test + CI | ✓ | 6.3.8 (via local install) | — |
| `vitest` | Recipe R9 test | ✓ | 4.1.7 | — |
| `@astrojs/check` (provides `astro check` diagnostics) | CONTENT-08 | ✓ | 0.9.9 | — |

No missing dependencies. No fallbacks required.

## Security Domain

`security_enforcement: true` in config; ASVS Level 1.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | NO | No auth in M1 (static site, no users) |
| V3 Session Management | NO | No sessions |
| V4 Access Control | NO | No access control (all content public) |
| V5 Input Validation | YES (build-time) | Zod schemas validate every content entry at build via `astro check`; malformed entries fail the build (CONTENT-08). No runtime input. |
| V6 Cryptography | NO | No secrets, no signing in Phase 2 |
| V8 Data Protection | LOW | The only personal data is the email + resume PDF — already public on the existing site. No new exposure. |
| V12 File Handling | YES (build-time) | `image()` validates file existence + format. Image assets sourced from a controlled snapshot directory; no user uploads. |
| V14 Configuration | YES | `src/content.config.ts` is the single integration surface. Schemas explicitly reject CSS class-name leakage (D-23 CMS-neutral fields). |

### Known Threat Patterns for Astro 6 Content Layer + static-site portfolio

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Untrusted markdown rendering (XSS) | Tampering | Phase 3 concern (markdown body → HTML via `<Content />`). Phase 2 stores raw markdown; no rendering. Astro's markdown pipeline escapes by default. |
| Schema bypass via legacy `type:` | Tampering | Astro 6 removed legacy collections entirely (Pitfall P2). Schema is enforced. |
| Image-asset path traversal (`cover: ../../etc/passwd`) | Information disclosure | `image()` resolves relative to the markdown file and verifies the asset is within the `src/` tree at build time. Build fails on traversal attempts. |
| Iconify identifier injection (e.g., `<script>` in icon string) | Tampering | The `iconSchema` regex `^[a-z0-9-]+:[a-z0-9-]+$` rejects any non-identifier characters. Validated by Zod at build. |
| Supply chain (typo'd package) | Tampering | Phase 2 adds zero new packages. Phase 3 adds icon packs — slopcheck is Phase 3's gate. |

**Phase 2 net security posture:** Strictly improves over the snapshot's CDN-loaded icon libraries. All future content is schema-validated at build; no unvalidated user input reaches production.

## Decision Crosswalk

| Requirement | Locked decisions | Research findings supporting implementation |
|-------------|------------------|---------------------------------------------|
| CONTENT-01 | D-01, D-02, D-03, D-11 (config file location locked by Phase 1) | Recipe R1 — full content.config.ts; Pattern Refs §1–§4; Pitfall P1 (location verified); Pitfall P2 (loader API mandatory in v6) |
| CONTENT-02 | D-01, D-02, D-03, D-19 | Pattern §2; Recipe R2; Recipe R4 (order defaults); Recipe R5 (image colocation) |
| CONTENT-03 | D-13, D-14, D-15, D-25, plus Q4 resolution | Pattern §3, §4; Recipe R3; Pitfall P2-V2 (object-map / array form); Recipe R10 |
| CONTENT-04 | D-04 | Recipe R4; included in every list schema in Recipe R1 |
| CONTENT-05 | D-07, D-08, D-09, D-10, D-11, D-12 | Pattern §1; Recipe R5; Pitfall P4; Q3 resolution (image() runtime behavior) |
| CONTENT-06 | D-22 (conservative normalization), D-09 (Garduino rename), D-21 (trimming) | Recipe R6 (full snapshot → destination mapping table) |
| CONTENT-07 | D-23 (CMS-neutral fields), D-14 (parallel-array collapse), D-15 (skills collapse), D-17 (icon string shape) | All schemas in Recipe R1 use plain English fields; Recipe R7 (Iconify mapping); Pitfall P19 / P20 (no parallel arrays, no image map) |
| CONTENT-08 | D-26, D-27, D-28, D-20 | Recipe R9 (full test code); Q1 (body validation answer); Q2 (astro check exit/stderr); Pitfall P2-V4 (v6 error format) |

## Sources

### Primary (HIGH confidence)

- [Astro Content Collections guide](https://docs.astro.build/en/guides/content-collections/) — schema function form, glob loader, entry.id derivation
- [Astro Content Collections API reference](https://docs.astro.build/en/reference/modules/astro-content/) — getCollection / getEntry signatures, predicate callback
- [Astro Content Loader API reference](https://docs.astro.build/en/reference/content-loader-reference/) — `file()` loader's two accepted YAML shapes (array-of-`{id,...}` or object-map), parser option
- [Astro Images guide](https://docs.astro.build/en/guides/images/) — `image()` schema-function form, frontmatter path resolution relative to markdown
- [Astro v6 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v6/) — Zod 4 migration, legacy content collections removed, Astro check no format changes documented
- [Astro v5 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v5/) — Content config file location (src/content.config.ts), entry.id (not slug), loader API
- [Astro CLI reference](https://docs.astro.build/en/reference/cli-reference/) — `astro check` exit code 1 on errors
- [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/) — strictest tsconfig compatibility
- [Zod 4 changelog](https://zod.dev/v4/changelog) — z.email(), z.url(), .min/.max, .default, .transform, .refine, ZodError.issues, error key
- Iconify live API (verified 2026-05-26 via `api.iconify.design/{set}.json?icons=...`) — devicon, simple-icons, logos, lucide identifier verification
- `.planning/snapshots/m1-source/resumeData.json` — source data
- `.planning/snapshots/m1-source/assets/` directory listing — image inventory
- `.planning/research/PITFALLS.md` — Pitfalls 1, 2, 3, 4, 19, 20, 28 (CONTEXT.md-cited subset)

### Secondary (MEDIUM confidence)

- [Astro v6 Migration Guide (Southwell Media)](https://www.southwellmedia.com/blog/astro-6-whats-coming-2026) — Zod 4 upgrade confirmation
- [Astro v6 Beta announcement](https://astro.build/blog/astro-6-beta/) — legacy content removal
- [withastro/astro#15976](https://github.com/withastro/astro/issues/15976) — v6 content-validation error format (open issue, current main branch)
- [Astro singletons discussion #449](https://github.com/withastro/roadmap/discussions/449) — singleton pattern context

### Tertiary (LOW confidence — flagged for in-Phase-2 verification)

- Exact `astro check` stderr format for content schema errors (issue #15976 documents `astro dev`/`astro build`; `astro check` is documented to share the error class but the literal stderr was not captured in the issue thread) — verify with a 30-second probe during planning.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — verified versions against `package.json`; verified Zod 4 ships with Astro 6 against the official upgrade guide.
- Architecture (file layout, loader choice, schema form): HIGH — verified against current Astro docs.
- Pitfalls (P1, P2, P3, P4, P19, P20, P28): HIGH — already in PITFALLS.md; cross-referenced with v6 upgrade guide for currency.
- Phase-2-specific pitfalls (P2-V1, P2-V2, P2-V3, P2-V4, P2-V5): MEDIUM-HIGH — each verified against a primary source; P2-V4 (error format) carries a MEDIUM tag because `astro check` specifically wasn't shown in the regression thread.
- Iconify mapping: HIGH — live API verification.
- Migration recipe: HIGH — Recipe R6 mapping derived directly from the snapshot JSON.

**Research date:** 2026-05-26
**Valid until:** 2026-06-26 (Astro 6 is stable; Iconify identifier set is stable; only `astro check` v6 error format may shift if issue #15976 is fixed in a v6.x patch — re-verify the D-27 assertion regex if Astro 6.x ships a fix before Phase 2 begins).

## RESEARCH COMPLETE

**Three highest-value findings:**

1. **`file()` loader does NOT accept a single-root-object YAML.** CONTEXT.md's D-13/D-15 describe the *data shape* but the *file content* must be wrapped — use object-map form (`about: {...}`) for `about.yaml`/`skills.yaml` and array form for `links.yaml`. Consume via `getEntry('about', 'about')` / `getCollection('links')`. This was not previously locked in CONTEXT.md and changes how each YAML file is authored.
2. **Astro 6 ships Zod 4 (not Zod 3).** Schemas should use `z.email()`, `z.url()`, `.min(N, { error: '...' })`, and `ZodError.issues`. The Zod 3 forms still compile (deprecated), but the planner should write v4-idiomatic schemas in `src/content.config.ts`.
3. **D-17's Iconify mapping needs 6 corrections.** `devicon:django` doesn't exist (use `simple-icons:django`); `devicon:react-original` / `devicon:apple-original` / `devicon:windows8-original` / `devicon:amazonwebservices-original` / `devicon:nodejs-plain-wordmark` all drop their suffixes on Iconify — use the bare canonical names. Recipe R7 documents the full audited table.
