# Phase 2: Content Layer - Pattern Map

**Mapped:** 2026-05-26
**Files analyzed:** ~30 (1 config + 3 YAML + 20 markdown entries + 22 image copies + 2 test files + 1 asset relocation)
**Analogs found:** 4 strong, 1 weak (most files are net-new content). Net-new content files reference Pattern 1..5 in RESEARCH.md, not in-repo analogs.

## Greenfield-with-Migration Note

Phase 2 is structurally similar to Phase 1 (greenfield), but the *content* is a migration of `.planning/snapshots/m1-source/resumeData.json` into typed Content Collections. The only existing-in-repo files modified are:

1. `src/content.config.ts` — empty placeholder from Phase 1 D-11; Phase 2 fills it.
2. `src/assets/.gitkeep` — superseded by the new `src/assets/profile.jpg` (D-11).

All other Phase 2 files are net-new. There is **no in-repo Astro analog** for:
- `defineCollection` with `glob()` / `file()` loaders (Phase 1 left `content.config.ts` empty).
- YAML singletons under `src/content/`.
- Markdown-with-frontmatter list-collection entries.
- A Vitest test that spawns `astro check` against a temporary fixture.

For those files, the analog is the **RESEARCH.md recipe** (Pattern 1..5 and Recipe R1..R10), not an in-repo file. This is the honest answer; forcing comparisons against unrelated code would mislead the planner. Where a real in-repo analog exists, it is captured verbatim with line refs below.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/content.config.ts` | config | build-time | `src/content.config.ts` (empty placeholder, edited in place) | self — mutated in place |
| `src/content/about.yaml` | content (singleton) | build-time | — | No analog — new file (see RESEARCH.md Pattern 3 + R3) |
| `src/content/skills.yaml` | content (singleton) | build-time | — | No analog — new file (see RESEARCH.md Pattern 3 + R3) |
| `src/content/links.yaml` | content (singleton, array form) | build-time | — | No analog — new file (see RESEARCH.md Pattern 4 + R3) |
| `src/content/projects/<slug>/index.md` × 13 | content (markdown entry) | build-time | `.planning/snapshots/m1-source/resumeData.json` → `projects[]` | data-source only (not a code analog) |
| `src/content/work/<slug>/index.md` × 2 | content (markdown entry) | build-time | `.planning/snapshots/m1-source/resumeData.json` → `resumeData.work[]` | data-source only |
| `src/content/education/<slug>/index.md` × 3 | content (markdown entry) | build-time | `.planning/snapshots/m1-source/resumeData.json` → `resumeData.education[]` | data-source only |
| `src/content/leadership/<slug>/index.md` × 1 | content (markdown entry) | build-time | `.planning/snapshots/m1-source/resumeData.json` → `leaderships[]` | data-source only |
| `src/content/testimonials/<slug>/index.md` × 1 | content (markdown entry) | build-time | `.planning/snapshots/m1-source/resumeData.json` → `testimonials[]` | data-source only |
| Project image copies (× 18 into entry dirs) | asset | build-time | `.planning/snapshots/m1-source/assets/*` | data-source (binary copy only) |
| `src/content/_orphans/*.png|webp` × 4 | asset (stranded) | build-time | `.planning/snapshots/m1-source/assets/*` | data-source (binary copy only) |
| `src/assets/profile.jpg` | asset | build-time | `.planning/snapshots/m1-source/assets/profilepic.jpg` | rename only |
| `tests/content-validation.test.ts` | test | build-time | `tests/smoke.test.ts` | strong pattern-match (Vitest + spawnSync) |
| `tests/__fixtures__/malformed-project.md` | test fixture | build-time | `tests/__fixtures__/HydrationCheck.tsx` | weak (same directory, different format) |

**Counts:** 1 modified config + 3 YAML singletons + 20 markdown entry files + 22 image copies + 1 profile.jpg relocation + 2 test files = ~49 atomic outputs. The planner can group these into ~9 tasks per Recipe R10 (1 config, 5 list-collection batches, 1 singleton batch, 1 image-copy batch, 1 test batch).

## Pattern Assignments

### `src/content.config.ts` (config, build-time)

**Analog:** `src/content.config.ts` (current — Phase 1 D-11 placeholder, 4 lines)
**Read:** `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/content.config.ts:1-5`

**Current placeholder (to be entirely replaced):**

```ts
// src/content.config.ts
// CONTEXT.md D-11: empty placeholder created in Phase 1.
// Phase 2 (Content Layer) fills this with Zod schemas via `defineCollection`.
// Intentionally exports nothing so Phase 2 can edit-in-place.
```

**Target pattern — copy from RESEARCH.md "Full src/content.config.ts" (lines 600-751):**

Imports block (lines 606-607):
```ts
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
```

Critical pattern: never `import { z } from 'zod'` — must come from `astro:content` so Zod 4 is bundled (RESEARCH.md "Anti-Patterns to Avoid" line 455). Phase 1 has no in-repo example of this import; it is a Phase 2 convention.

Schema-function form for image-bearing collection (Pattern 1, RESEARCH.md lines 303-321) — `projects` only:
```ts
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1),
      tech_stack: z.array(z.string().trim().min(1)).default([]),
      url: z.url().optional(),
      cover: image(),
      alternates: z.array(image()).optional(),
      order: z.number().int().default(0),
      draft: z.boolean().default(false),
    }),
});
```

Static schema form for image-free list collections (Pattern 2, RESEARCH.md lines 329-340) — `work`, `education`, `leadership`, `testimonials`:
```ts
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    company: z.string().trim().min(1),
    title: z.string().trim().min(1),
    duration: z.string().trim().min(1),
    url: z.url().optional(),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
  }),
});
```

`file()` loader for object-map singletons (Pattern 3, RESEARCH.md lines 349-371) — `about`, `skills`:
```ts
const about = defineCollection({
  loader: file('src/content/about.yaml'),
  schema: z.object({
    /* ONE entry's shape — NOT the wrapping object map. Pitfall P3. */
    first_name: z.string().trim().min(1),
    /* ... */
    social: z.array(z.object({ name: ..., url: z.url(), icon: ... })).min(1),
  }),
});
```

`file()` loader for array singleton (Pattern 4, RESEARCH.md lines 400-408) — `links`:
```ts
const links = defineCollection({
  loader: file('src/content/links.yaml'),
  schema: z.object({
    /* ONE nav entry — the loader iterates the array. */
    id: z.string().regex(/^[a-z][a-z0-9-]*$/, {
      error: 'id must be lowercase kebab-case, starting with a letter',
    }),
    label: z.string().trim().min(1),
    order: z.number().int().default(0),
  }),
});
```

Export block (RESEARCH.md lines 741-750):
```ts
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

**Critical conventions enforced in this file:**
- File path is `src/content.config.ts` — **NOT** `src/content/config.ts` (Pitfall P1, RESEARCH.md line 491).
- Use `loader:` keys exclusively. No `type: 'content'` / `type: 'data'` — removed in Astro 6 (Pitfall P2, RESEARCH.md line 499).
- Use Zod 4 idioms: `z.email()`, `z.url()`, `.regex(..., { error: '...' })`, NOT `z.string().email()` or `.regex(..., { message: '...' })` (Pitfall P2-V1, RESEARCH.md line 544).
- Schemas describe **ONE entry**, never the wrapping array or map (Pitfall P3, RESEARCH.md line 506).
- Schema-function form is the **only** way to inject `image()` — no `import { image }` exists (Pitfall P4 + Pattern 1, RESEARCH.md line 514).
- `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` (tsconfig.json:2 → `astro/tsconfigs/strictest`) are active. `.optional()` produces `T | undefined`; Phase 2's job is to write schemas that type-check cleanly under these flags (Pitfall P2-V5, RESEARCH.md line 586).

---

### `src/content/about.yaml` (content, singleton object-map form)

**Analog:** None in repo. Data source: `.planning/snapshots/m1-source/resumeData.json:2-22` (`about` block).

**Source data shape to migrate:**
```json
"about": {
    "first_name": "Rashmil ",       // trailing space — TRIM per D-21
    "last_name": "Panchani",
    "current_status": "Undergraduate BE Computer Engineering @Dwarkadas J. Sanghvi College of Engineering",
    "email": "rashmilp833@gmail.com",
    "contact_message": "Have a project for me? ...",
    "description": "I am an athlete at heart, ...",
    "resume_download": "Rashmil_Panchani.pdf",
    "social": [
      { "name": "LinkedIn", "url": "https://...", "className": "devicon-linkedin-plain colored" },
      { "name": "Github",   "url": "http://...",   "className": "devicon-github-plain colored" }
    ]
}
```

**Target file shape — copy from RESEARCH.md "about.yaml file content" (lines 377-394):**
```yaml
# src/content/about.yaml — object-map form
about:                              # top-level key = entry id (Pitfall P2-V2)
  first_name: Rashmil               # trimmed per D-21
  last_name: Panchani
  current_status: "Undergraduate BE Computer Engineering @Dwarkadas J. Sanghvi College of Engineering"
  email: rashmilp833@gmail.com
  contact_message: "Have a project for me? ..."
  description: "I am an athlete at heart, ..."
  resume_download: Rashmil_Panchani.pdf
  profile_image: ~/assets/profile.jpg     # D-11; string path, NOT image()
  social:
    - name: LinkedIn
      url: https://www.linkedin.com/in/rashmil-panchani-67587a14b/
      icon: simple-icons:linkedin         # D-17 mapping: devicon-linkedin → simple-icons:linkedin
    - name: Github
      url: https://github.com/Rashmil-1999  # normalize http → https
      icon: simple-icons:github
```

**Critical conventions:**
- Object-map form (NOT a flat object) — `file()` loader does NOT support a single-root-object YAML (Pitfall P2-V2, RESEARCH.md line 551). Use top-level key `about:` whose value is the entry data.
- Consumption is `getEntry('about', 'about')` (RESEARCH.md line 396).
- `className` field DROPPED — replaced by `icon` (Iconify `prefix:name` per D-16, mapping per Recipe R7).
- `profile_image` is a **string path**, NOT `image()` — D-11 + RESEARCH.md line 359 (`profile_image: z.string().min(1)`).
- Trim trailing space from `first_name` per D-21 + Recipe R6.

---

### `src/content/skills.yaml` (content, singleton object-map form)

**Analog:** None in repo. Data source: `.planning/snapshots/m1-source/resumeData.json:76-225` (`skill_array[]` + `skills{}` — parallel arrays collapsed per D-15).

**Target file shape — copy from RESEARCH.md "Example singleton YAML" (lines 775-825):**
```yaml
skills:
  categories:
    - name: "Programming Languages & Operating Systems"
      order: 10
      items:
        - { name: C, icon: devicon:c }
        - { name: C++, icon: devicon:cplusplus }
        # ... 7 more per Recipe R7 ...
    - name: "Database Technologies"
      order: 20
      items:
        - { name: MySQL, icon: devicon:mysql }
        - { name: "Postgre SQL", icon: devicon:postgresql }   # user voice preserved per D-22
        # ...
```

**Critical conventions:**
- Same object-map form as `about.yaml` — top-level key `skills:`.
- Consumption is `getEntry('skills', 'skills')`.
- Iconify identifier mapping per Recipe R7 (D-17 + audited corrections in lines 919-953 of RESEARCH.md). **Key corrections from D-17's first pass:**
  - `devicon:django` does NOT exist → use `simple-icons:django` (R7 + line 802).
  - `-original` / `-plain-wordmark` suffixes are dropped on Iconify → `devicon:react` not `devicon:react-original`, `devicon:apple` not `devicon:apple-original`, `devicon:windows8` not `devicon:windows8-original`, `devicon:amazonwebservices` not `devicon:amazonwebservices-original`, `devicon:nodejs` not `devicon:nodejs-plain-wordmark`.
- Preserve user voice in spellings (D-22): `Postgre SQL` (not `PostgreSQL`), category names verbatim.
- 6 categories in order: Programming Languages & Operating Systems (10) → Database Technologies (20) → Web Development (30) → Dev Ops (40) → Tools and Frameworks (50) → Version Control (60).

---

### `src/content/links.yaml` (content, singleton array form)

**Analog:** None in repo. Data source: `.planning/snapshots/m1-source/resumeData.json:23-40` (`sections[]` + `links[]` parallel arrays collapsed per D-14).

**Target file shape — copy from RESEARCH.md "links.yaml file content" (lines 413-436):**
```yaml
# src/content/links.yaml — array form
- id: about
  label: About
  order: 10
- id: education
  label: Education
  order: 20
- id: work                           # D-24: reconciled from snapshot "Experience"/"#experience"
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

**Critical conventions:**
- Array form (NOT object-map). Each entry's `id` field becomes the Astro entry id.
- Consumption is `getCollection('links')` (NOT `getEntry`).
- Schema describes ONE entry (Pitfall P3). NEVER `z.array(...)`.
- `id` is the bare anchor (no `#` prefix) — Phase 3 prepends `#` at render and uses the same value as `<section id="...">` (D-06, D-25, single source).
- `Experience` → `Work` reconciliation is intentional (D-24): Phase 1 D-23 already chose `work` as the canonical id; the snapshot's `Experience` label and `#experience` anchor are reconciled to match. Phase 1 stub `Work.astro` already uses `id="work"` (verified at `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/components/Work.astro:8`).
- Ids must satisfy `/^[a-z][a-z0-9-]*$/` (D-06) — all 7 entries above pass.

---

### `src/content/projects/<slug>/index.md` × 13 (content, markdown entry)

**Analog:** None in repo. Data source: `.planning/snapshots/m1-source/resumeData.json:227-326` (`projects[]`, 13 entries).

**Target file shape — copy from RESEARCH.md "Example list-collection markdown entry" (lines 755-770):**
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

In this project my aim was to build a python script that is able to detect faces. ...
```

**Per-entry slug + image table — copy verbatim from Recipe R5 (RESEARCH.md lines 871-885):**

| Slug | Snapshot files copied | `cover` frontmatter | Order |
|------|----------------------|---------------------|-------|
| `face-detection` | `face_detection.png` | `./face_detection.png` | 10 |
| `emotion-recognizer` | `emotion_recognition.png` (small 23 KB, NOT 4.8 MB `emotion.png` — CONCERNS carry-forward) | `./emotion_recognition.png` | 20 |
| `american-sign-language-detection` | `asl.png` | `./asl.png` | 30 |
| `age-of-warring-empire-tower-bot` | `aowe.jpg` | `./aowe.jpg` | 40 |
| `smart-india-hackathon` | `SIH.png` | `./SIH.png` | 50 |
| `e-yantra-competition` | `eyantra.jpg`, `eyantra.png` | `./eyantra.jpg` (cover); `./eyantra.png` (alternates[0]) | 60 |
| `garduino-smart-garden` | `graduino.png` → **renamed to** `garduino.png` (D-09) | `./garduino.png` | 70 |
| `stack-overflow-chatbot` | `chatbot.png` | `./chatbot.png` | 80 |
| `twitter-named-entity-recognition` | `ner.png` | `./ner.png` | 90 |
| `library-attendance-manager` | `library.png` | `./library.png` | 100 |
| `dj-archive` | `archive.jpeg`, `archive.jpg`, `archive.png` | `./archive.jpeg` (cover); `./archive.jpg`, `./archive.png` (alternates) | 110 |
| `college-event-manager-app` | `event.png` | `./event.png` | 120 |
| `resume-website` | `resume.png` | `./resume.png` | 130 |

**Critical conventions:**
- Frontmatter holds **only metadata** (title, tech_stack, url, cover, alternates, order, draft). Long-form `description` lives in the markdown body (D-19).
- Image paths in frontmatter use `./` (relative to the markdown file) — **never** a leading `/` (that's a `public/` path, bypasses Vite hashing). Pitfall P4 + RESEARCH.md line 461.
- **NO `slug:` field in frontmatter** — Astro 6 auto-derives `entry.id` from the directory name (D-02 + RESEARCH.md line 462).
- **NO `image_map` reintroduction** — image is colocated with the entry, referenced as `./<filename>` (D-07 + Pitfall P20).
- `draft:` field omitted from initial entries (defaults to `false` per schema D-05).
- Garduino rename is the **only** snapshot-filename change (D-09). All other filenames preserved verbatim.
- Source data normalizations:
  - `tech_stack` values: snapshot uses `"Numpy"`, `"Tensorflow"` (lowercase variants); target uses canonical `"NumPy"`, `"TensorFlow"` (D-21 trim + lossless casing fix is acceptable; D-22 preserves only *idiosyncratic* user voice like `"Postgre SQL"`). Planner judgment.
  - Body text trimmed; no other edits (D-22).

---

### `src/content/work/<slug>/index.md` × 2 (content, markdown entry)

**Analog:** None in repo. Data source: `.planning/snapshots/m1-source/resumeData.json:62-74` (`resumeData.work[]`, 2 entries).

**Target shape (no image — Pattern 2):**
```markdown
---
company: "Phionike Solutions: Design-Tech Studio"
title: Research and Development Intern
duration: "May 2019 - July 2019"
order: 10
---

My work at Phionike at first involved laying down the foundation ...
```

**Per-entry slug table:**

| Slug | Source company | Order |
|------|---------------|-------|
| `phionike-solutions` | `Phionike Solutions: Design-Tech Studio` | 10 |
| `pear-technologies` | `peAR Technologies.` (preserve casing per D-22) | 20 |

**Critical conventions:**
- No `image()` field → static schema form (Pattern 2, no schema-function callback).
- Slug is kebab-case derived from company name (D-02).
- `duration` is free-text date range (preserves `"May 2019 - July 2019"` verbatim).
- Body holds the `description` from JSON (D-19); frontmatter only holds company/title/duration/order/draft.
- Preserve `peAR Technologies.` casing (D-22).

---

### `src/content/education/<slug>/index.md` × 3 (content, markdown entry)

**Analog:** None in repo. Data source: `.planning/snapshots/m1-source/resumeData.json:42-61` (`resumeData.education[]`, 3 entries).

**Target shape:**
```markdown
---
name: DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING
degree: Bachelors in Computer Engineering
graduated: "August 2017 - May 2021"
score: "CGPA: 9.963 / 10"
order: 10
---

(body may be empty — but see D-20 / CONTENT-08 test which enforces non-empty bodies on every list collection entry — planner judgment whether to populate from JSON `name` again or hold a one-line summary)
```

**Per-entry slug table:**

| Slug | School name | Order |
|------|-------------|-------|
| `dj-sanghvi-college-of-engineering` | DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING | 10 |
| `st-rocks-college-of-science-and-commerce` | ST. Rocks College Of Science and Commerce | 20 |
| `st-francis-school` | ST. Francis School | 30 |

**Critical conventions:**
- `score` is `.optional()` in the schema (RESEARCH.md line 651) — all 3 entries happen to have it, but the schema allows omission for future entries.
- Preserve uppercase casing per D-22.
- **Body non-emptiness is required by D-20 / Recipe R9 third sub-test** — every list-collection entry's body must be non-empty. Education entries in the snapshot have no body text. Planner judgment: either (a) write a one-line body summary per entry from the school name/degree, or (b) leave bodies empty AND drop the body-non-empty assertion from CONTENT-08 for the education/work collections (would weaken the gate). **Recommend (a).**

---

### `src/content/leadership/<slug>/index.md` × 1 (content, markdown entry)

**Analog:** None in repo. Data source: `.planning/snapshots/m1-source/resumeData.json:334-341` (`leaderships[]`, 1 entry).

**Target shape:**
```markdown
---
org: DJ Unicode
title: Full Stack Mentor & Events Head
duration: "August 2018 - Present"
order: 10
---

I am passionate about the need for knowledge transfer ...
```

**Slug:** `dj-unicode`.

**Critical conventions:**
- Mirrors `work/` schema shape (`org` replaces `company`, otherwise identical).
- Body holds the long `description` from JSON (D-19).

---

### `src/content/testimonials/<slug>/index.md` × 1 (content, markdown entry)

**Analog:** None in repo. Data source: `.planning/snapshots/m1-source/resumeData.json:328-333` (`testimonials[]`, 1 entry).

**Target shape:**
```markdown
---
user: Roopam Mishra
role: Founder
org: "Phionike Solutions: Design-Tech Studio"
order: 10
---

His sincere contribution and innovative thinking helped us come up with some great solutions for our project. ...
```

**Slug:** `roopam-mishra`.

**Critical conventions:**
- Snapshot stores `user: "Roopam Mishra, Founder of Phionike Solutions: Design-Tech Studio."` as one combined string. Split into `user` / `role` / `org` per RESEARCH.md schema (lines 673-679). Both `role` and `org` are `.optional()`.
- The `text` field in JSON becomes the markdown body (D-19).

---

### Project image copies × 18 (asset, build-time)

**Analog:** None in repo. Source: `.planning/snapshots/m1-source/assets/*` (22 files; 18 copy into project entry dirs, 4 to `_orphans/`).

**No "code excerpt" — these are binary copies.** The full list is Recipe R5 (RESEARCH.md lines 871-885). The Phase 1 `src/assets/` is empty save for `.gitkeep` (verified) so there are no in-repo assets to mirror against.

**Critical conventions:**
- Each image copies into its project's entry directory (D-01 + D-08).
- Preserve original snapshot filenames verbatim, with the **one exception** of `graduino.png` → `garduino.png` (D-09).
- Bigger choices made during migration:
  - `emotion-recognizer` uses `emotion_recognition.png` (23 KB), NOT `emotion.png` (4.8 MB). CONCERNS.md carry-forward (RESEARCH.md line 874).
  - `dj-archive` keeps ALL THREE variants (`archive.jpeg`, `archive.jpg`, `archive.png`) per D-07. `cover: ./archive.jpeg`, the other two go to `alternates[]`.
  - `e-yantra-competition` keeps both `eyantra.jpg` (cover) and `eyantra.png` (alternates).

---

### `src/content/_orphans/*.png|webp` × 4 (asset, holding directory)

**Analog:** None in repo.

**Files copied (verbatim from snapshot):**
- `attendance.png` (109 KB)
- `attendance.webp` (12 KB)
- `attendance1.png` (746 KB)
- `smgarden.png` (42 KB)

**Critical conventions:**
- Leading-underscore directory is NOT referenced by any `defineCollection` → Astro never scans it (D-10 + Open Question 6, RESEARCH.md line 1122).
- No `.gitkeep` needed — directory becomes non-empty once the 4 images are copied in (RESEARCH.md line 1124).
- Phase 5 decides whether to keep/delete/archive these.

---

### `src/assets/profile.jpg` (asset, build-time)

**Analog:** `.planning/snapshots/m1-source/assets/profilepic.jpg` (binary, 1 MB).

**Action:** Copy the snapshot file to `src/assets/profile.jpg`. Rename `profilepic.jpg` → `profile.jpg` (D-11).

**Critical conventions:**
- Lives under `src/assets/` (NOT inside a content collection), so it stays out of every `defineCollection`'s `base`. D-11 reasoning.
- Referenced from `about.yaml` as `profile_image: ~/assets/profile.jpg` (Astro path alias) — `image()` requirement scopes to *project* images per CONTENT-05.
- The Phase 1 stub at `src/assets/.gitkeep` (0 bytes) is no longer needed but is harmless. Planner can delete or leave (D-19 of Phase 1 left `.gitkeep` for empty dirs — surgical-change principle says leave it unless removing is necessary).

---

### `tests/content-validation.test.ts` (test, build-time)

**Analog:** `tests/smoke.test.ts` — Phase 1's Vitest scaffold. STRONG pattern match.
**Read:** `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/tests/smoke.test.ts:1-55`

**Imports pattern to copy (lines 7-9):**
```ts
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
```

The new test extends this with `node:child_process` (for `spawnSync`) and additional `fs` operations:
```ts
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, expectTypeOf, it } from 'vitest';
```

**`spawnSync` pattern — copy from existing `tests/global-setup.ts:9-17`:**
```ts
// tests/global-setup.ts (existing)
const result = spawnSync('npx', ['astro', 'build'], {
    stdio: 'inherit',
    env: process.env,
});
if (result.status !== 0) {
    throw new Error(`astro build exited with status ${result.status} — smoke test aborted.`);
}
```

The new test uses the same `spawnSync('npx', ['astro', ...])` shape but with `astro check` and `encoding: 'utf8'` so stderr/stdout can be asserted on:
```ts
const result = spawnSync('npx', ['astro', 'check'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
});
expect(result.status).not.toBe(0);
```

**`describe`/`it` block pattern — copy from `tests/smoke.test.ts:24-55`:**
```ts
describe('Phase 1 smoke', () => {
    it('emits dist/index.html', () => {
        expect(existsSync(join(DIST, 'index.html'))).toBe(true);
    });
    // ... multiple `it()` calls per describe
});
```

New test mirrors this with two `describe` blocks per Recipe R9 (RESEARCH.md lines 988-1030):
```ts
describe('CONTENT-08: schema validation', () => {
    it('astro check fails on a malformed project entry ...', () => { ... }, 60_000);
});
describe('CONTENT-08 positive path (SC #1)', () => {
    it('await getCollection("projects") returns >0 typed entries', async () => { ... });
    it('every list-collection entry has a non-empty markdown body (D-20)', async () => { ... });
});
```

**Path-resolution pattern to copy from `tests/smoke.test.ts:11`:**
```ts
const DIST = join(process.cwd(), 'dist');
```

New test uses the same `process.cwd()` root:
```ts
const REPO_ROOT = process.cwd();
const FIXTURE = join(REPO_ROOT, 'tests/__fixtures__/malformed-project.md');
const TEMP_DIR = join(REPO_ROOT, 'src/content/projects/__test__');
const TEMP_FILE = join(TEMP_DIR, 'index.md');
```

**Critical conventions:**
- Test file lives at `tests/content-validation.test.ts` — same directory as `smoke.test.ts`. Picked up by `vitest.config.ts:16` (`include: ['tests/**/*.test.ts']`).
- The existing `vitest.config.ts:11` uses `getViteConfig` from `astro/config` so the test process sees Astro's plugin chain — this is what makes `await import('astro:content')` resolvable in the positive-path tests (Open Question 2, RESEARCH.md line 1187 — planner should verify with a 5-line probe test in the planning phase).
- `try`/`finally` cleanup (Recipe R9 lines 990-1006): create temp dir → copy fixture → spawn check → assert → ALWAYS `rmSync(TEMP_DIR, { recursive: true, force: true })`.
- Assertion targets the v6 stderr format (Pitfall P2-V4, RESEARCH.md line 567): substring `__test__` for the entry id and regex `/"path"\s*:\s*\[\s*"title"\s*\]/` for the field path. **Do NOT** use Astro v5's cleaner `expect(stderr).toContain('title is required')` form — would FAIL on v6.
- Timeout: `60_000` ms on the `astro check` test — the spawn is slow (recipe note RESEARCH.md line 1007).
- Body-non-emptiness check (third sub-test) iterates all 5 list collections and asserts `entry.body?.trim().length > 0` (Recipe R9 lines 1020-1029). Requires that `entry.body` is exposed by the glob loader — assumed YES per Astro 6 docs (Assumption A2 in RESEARCH.md line 1173). If the API requires `render().body`, the assertion changes by one line.

---

### `tests/__fixtures__/malformed-project.md` (test fixture)

**Analog:** `tests/__fixtures__/HydrationCheck.tsx` — same directory, different format. WEAK match (location-only).
**Read:** `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/tests/__fixtures__/HydrationCheck.tsx:1-15`

The HydrationCheck fixture pattern (location, naming, header-comment convention):
```tsx
// tests/__fixtures__/HydrationCheck.tsx
// Source: react.dev/reference/react/useState
// CONTEXT.md D-09 + FOUND-04: React 19 verification island. Any state update proves hydration.
// type="button" is mandatory (jsx-a11y rule, Plan 04 lint config will enforce).
```

**Target file content — copy from RESEARCH.md "Fixture content" (lines 1035-1043):**
```markdown
---
# Deliberately missing the required `title` field.
cover: ./nonexistent.png
order: 999
---

This entry intentionally lacks a title so CONTENT-08 can verify schema enforcement.
```

**Critical conventions:**
- Lives at `tests/__fixtures__/malformed-project.md` (alongside `HydrationCheck.tsx`).
- Markdown comment in the frontmatter (`# Deliberately missing ...`) makes the test's *intent* readable when the file is opened.
- Recipe R9's note (line 1045) acknowledges that the missing `cover: ./nonexistent.png` will *also* fail validation; that's fine — the assertion is "stderr contains `__test__` AND a path of `title`," which succeeds even with multiple errors. **Planner judgment** per RESEARCH.md Open Question 3 (line 1192): drop the `cover` field entirely so only `title` errors surface — makes test failure modes easier to debug. Recommended.
- File body must be non-empty (otherwise the body-non-emptiness assertion in the second `describe` block would also fail on the temporary file). The fixture above has body text, so this is satisfied — but is moot in practice because the malformed-fixture test only runs `astro check`, not `getCollection`.

---

## Shared Patterns

### Iconify Identifier Mapping (D-16, D-17 + Recipe R7)

**Source:** RESEARCH.md Recipe R7 (lines 917-953) — VERIFIED against live Iconify API 2026-05-26.
**Apply to:** `about.yaml` (`social[].icon`), `skills.yaml` (every `items[].icon`).
**Schema:** `icon: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/)` — validates the *shape* (`prefix:name`) only; existence on Iconify is Phase 3's concern.

**Key migration mappings (full table in Recipe R7):**

| Source (snapshot) | Target Iconify identifier | Notes |
|-------------------|---------------------------|-------|
| `devicon-c-plain colored` | `devicon:c` | drop `-plain colored` suffix |
| `devicon-cplusplus-plain colored` | `devicon:cplusplus` | |
| `devicon-django-plain colored` | **`simple-icons:django`** | devicon:django does NOT exist (corrected from D-17 first pass) |
| `devicon-react-original colored` | `devicon:react` | Iconify drops `-original` |
| `devicon-apple-original colored` | `devicon:apple` | Iconify drops `-original` |
| `devicon-windows8-original colored` | `devicon:windows8` | Iconify drops `-original` |
| `devicon-amazonwebservices-original colored` | `devicon:amazonwebservices` | Iconify drops `-original` |
| `devicon-nodejs-plain-wordmark colored` | `devicon:nodejs` | Iconify drops `-plain-wordmark` |
| `devicon-linkedin-plain colored` | `simple-icons:linkedin` | cleaner brand glyph (D-17) |
| `devicon-github-plain colored` | `simple-icons:github` | cleaner brand glyph (D-17) |
| `logos:graphql` | `logos:graphql` | already canonical |
| `logos-google-cloud-platform` | `logos:google-cloud` | normalized to canonical |
| NumPy/Pandas/TensorFlow/Keras/OpenCV | `simple-icons:<name>` | brand glyphs |
| NLTK | `lucide:code` | placeholder; no brand glyph exists |

### Trim-Then-Validate String Pattern (D-21)

**Source:** RESEARCH.md Pattern 2 example (line 614) — `const trimmedString = (min = 1) => z.string().trim().min(min);`
**Apply to:** Every string field in every schema (about, skills, links, projects, work, education, leadership, testimonials).

**Pattern:**
```ts
const trimmedString = (min = 1) => z.string().trim().min(min);
```

Then use in schemas:
```ts
title: trimmedString(),
duration: trimmedString(),
```

**Rationale:** Catches the snapshot's `first_name: "Rashmil "` (trailing space, RESEARCH.md line 915) and any equivalent regression. The `.trim()` modifier mutates the parsed value; `.min(1)` ensures non-empty after trimming. Per Claude's-Discretion note in CONTEXT.md, factoring `trimmedString` into a helper is planner judgment based on duplication count — RESEARCH.md uses it ~24 times so the helper pays for itself.

### `order` Default Pattern (D-04, CONTENT-04)

**Source:** RESEARCH.md Recipe R4 (lines 853-867).
**Apply to:** Every list-collection schema (projects, work, education, leadership, testimonials) AND `skills.categories[]` + `links` (via existing `order` field).

**Schema:** `order: z.number().int().default(0)`.

**Initial values:** sparse step-10 numbering matching current array order — `10, 20, 30, ...` so future inserts don't require renumbering.

### `draft` Default Pattern (D-05, Pitfall P28)

**Source:** RESEARCH.md Pattern 5 (lines 440-449).
**Apply to:** Every list-collection schema (projects, work, education, leadership, testimonials). NOT applicable to `about`/`skills`/`links` (singletons).

**Schema:** `draft: z.boolean().default(false)`.

**Consumption pattern (Phase 3 inherits — Phase 2 documents):**
```ts
const projects = await getCollection('projects', ({ data }) =>
  import.meta.env.PROD ? data.draft !== true : true,
);
```

Phase 2 establishes the convention even though no entry has `draft: true` yet (Pitfall P28: setting the predicate now ensures M2 drafts don't leak into static HTML when they appear).

### Slug Derivation (D-02)

**Source:** RESEARCH.md Recipe R2 (lines 833-843) — Astro 6 auto-derives `entry.id` from the directory name.

**Apply to:** All list-collection entries.

**Convention:** `src/content/<collection>/<kebab-case-slug>/index.md`. **No `slug:` field in frontmatter.** Slug = kebab-case derived from the title (or company/school/org/user for non-projects). The directory IS the slug.

### Body Non-Emptiness Enforcement (D-20)

**Source:** RESEARCH.md Open Question 1 (line 1066) + Pitfall P2-V3 (line 558) — Astro schemas do NOT validate the markdown body.

**Apply to:** ALL list-collection entries (projects, work, education, leadership, testimonials).

**Enforcement:** Vitest assertion in `tests/content-validation.test.ts` (Recipe R9 third sub-test, RESEARCH.md lines 1020-1029):
```ts
for (const collection of ['projects', 'work', 'education', 'leadership', 'testimonials'] as const) {
    const entries = await getCollection(collection);
    for (const entry of entries) {
        expect(entry.body?.trim().length, `${collection}/${entry.id}`).toBeGreaterThan(0);
    }
}
```

**Planner consequence:** Every education entry's body must be populated with at least one sentence (snapshot has no body text for education). Same applies to any entry where the JSON had no `description` field.

## No Analog Found

These files have no in-repo analog (greenfield content). Planner should reference RESEARCH.md patterns instead:

| File | Role | RESEARCH.md Pattern to Reference |
|------|------|----------------------------------|
| `src/content/about.yaml` | content (singleton) | Pattern 3 (lines 343-371), Recipe R3, R6 |
| `src/content/skills.yaml` | content (singleton) | Pattern 3, Recipe R7, R6 |
| `src/content/links.yaml` | content (singleton, array form) | Pattern 4 (lines 398-436), Recipe R3 |
| `src/content/projects/<slug>/index.md` × 13 | content (markdown entry) | Pattern 1 (image-bearing schema) + Recipe R2 + R5 + R6 |
| `src/content/work/<slug>/index.md` × 2 | content (markdown entry) | Pattern 2 (static schema) + Recipe R2 + R6 |
| `src/content/education/<slug>/index.md` × 3 | content (markdown entry) | Pattern 2 + Recipe R2 + R6 |
| `src/content/leadership/<slug>/index.md` × 1 | content (markdown entry) | Pattern 2 + Recipe R2 + R6 |
| `src/content/testimonials/<slug>/index.md` × 1 | content (markdown entry) | Pattern 2 + Recipe R2 + R6 |
| Project image copies × 18 | asset | Recipe R5 (binary copy table) |
| `src/content/_orphans/*` × 4 | asset (stranded) | Recipe R5 orphan section + Open Question 6 |

## Metadata

**Analog search scope:**
- `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/` (Phase 1 scaffold; 4 layouts/components/pages have non-trivial bodies — `About.astro`, `Work.astro`, `SideNav.astro`, `index.astro`, `BaseHead.astro`, `BaseLayout.astro`. None resemble a `defineCollection` call.)
- `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/tests/` (Phase 1 Vitest scaffold; `smoke.test.ts` + `global-setup.ts` are the STRONG analogs for the new test file)
- `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/snapshots/m1-source/` (data source; not a code analog)
- `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/phases/01-foundation/01-PATTERNS.md` (structural template for this file)

**Files read:**
- `src/content.config.ts` (5 lines — placeholder)
- `tests/smoke.test.ts` (55 lines — pattern source for `content-validation.test.ts`)
- `tests/global-setup.ts` (18 lines — pattern source for `spawnSync` + `npx astro`)
- `tests/__fixtures__/HydrationCheck.tsx` (15 lines — weak location analog)
- `vitest.config.ts` (19 lines — confirms `tests/**/*.test.ts` pickup)
- `tsconfig.json` (5 lines — confirms `astro/tsconfigs/strictest`)
- `astro.config.mjs` (21 lines — confirms `output: 'static'`, no `base`)
- `package.json` (59 lines — confirms Astro `^6.3.8`, Vitest `^4.1.7`, `@astrojs/check` `^0.9.9`; zero new deps added in Phase 2)
- `src/components/About.astro` (7 lines — stub; confirms `id="about"`)
- `src/components/Work.astro` (8 lines — stub; confirms `id="work"` reconciliation D-24)
- `src/components/SideNav.astro` (7 lines — stub; confirms `id="sidenav"`)
- `src/pages/index.astro` (29 lines — confirms 8-section composition order matches `links.yaml` D-25)
- `.planning/snapshots/m1-source/resumeData.json` (342 lines — full data source)
- `.planning/phases/02-content-layer/02-CONTEXT.md` (196 lines — Phase 2 decisions)
- `.planning/phases/02-content-layer/02-RESEARCH.md` (~1200 lines — Patterns, Recipes, Open Questions, Pitfalls)
- `.planning/phases/01-foundation/01-PATTERNS.md` (lines 1-80, structural template)

**Pattern extraction date:** 2026-05-26

## PATTERN MAPPING COMPLETE
