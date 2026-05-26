# Phase 2: Content Layer - Context

**Gathered:** 2026-05-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate every value from `.planning/snapshots/m1-source/resumeData.json` into Astro 6 Content Layer collections defined at `src/content.config.ts`. List collections (`projects`, `work`, `education`, `leadership`, `testimonials`) use the `glob()` loader over per-item markdown files; singleton collections (`about`, `skills`, `links`) use the `file()` loader over a single YAML each. Project images are bound through the `image()` schema helper and colocated with their entry's markdown. Schemas are CMS-neutral and validate at build time. Zero data loss verified by manual diff of the new collections against the snapshot.

Out of scope for Phase 2: rendering / templating (Phase 3 SECTION-*), icon resolution via astro-icon (Phase 3 STYLE-02), image optimization / responsive widths (Phase 3 STYLE-03), brand-token `@theme` values (Phase 3 STYLE-04), font stylesheet wiring (Phase 3 STYLE-05), `<BaseHead>` SEO meta (Phase 4 SEO-01), snapshot deletion (Phase 5 after CONTENT-06 verifies parity).

</domain>

<decisions>
## Implementation Decisions

### Entry file layout (CONTENT-02, CONTENT-05)

- **D-01:** Directory-per-item for every list collection. Path shape: `src/content/<collection>/<slug>/index.md` plus all image variants colocated next to it. Same convention for `projects`, `work`, `education`, `leadership`, `testimonials`. Phase 3 / M2 CMS uploads operate on one folder per entry; multiple images per item are supported later without renaming.
- **D-02:** Slug = kebab-case derived from the entry's title (or company/school/org for non-project collections). Astro 6 auto-derives `entry.id` from the directory name; no `slug` field in frontmatter. Order is a separate field (D-04).
- **D-03:** `glob({ pattern: '**/*.md', base: './src/content/<collection>' })` per Pitfall 2 — the loader API explicitly, never the legacy `type: 'content'` shape.
- **D-04:** `order: z.number().int().default(0)` on every list-collection entry (CONTENT-04). Initial values use sparse step-10 (`10, 20, 30, ...`) matching current array order so future inserts don't require global renumbering.
- **D-05:** `draft: z.boolean().default(false)` on every list collection (Pitfall 28). Every `getCollection` call passes a predicate that filters `draft: true` in production; pattern established now so M2 (drafts in CMS) inherits it.
- **D-06:** `id: z.string().regex(/^[a-z][a-z0-9-]*$/)` on the `links` singleton entries (anchor convention). Bare ids in storage; Phase 3 prepends `#` at render and reuses the same value as the `<section id="…">` attribute (single source).

### Project images (CONTENT-05, Pitfall 4 + 20)

- **D-07:** Schema typed via `({ image }) => z.object({ cover: image(), alternates: z.array(image()).optional() })`. `cover` is required; `alternates` captures the variants that exist in the snapshot (e.g., `archive.jpg` / `archive.jpeg` / `archive.png` all copy in; `cover` points to one). Future galleries can grow `alternates` without schema changes.
- **D-08:** All variants from `.planning/snapshots/m1-source/assets/` that match a project's `image` key are copied into the entry's directory, preserving their original snapshot filenames verbatim. No transcoding here — Phase 3 STYLE-03 owns WebP/AVIF + responsive widths.
- **D-09:** Garduino fix — slug is `garduino-smart-garden`, snapshot file `graduino.png` is copied in as `garduino.png` (filename matches slug) and `cover: ./garduino.png` points to it. Document this single rename in the migration notes.
- **D-10:** Orphan images in the snapshot (`attendance.png`, `attendance.webp`, `attendance1.png`, `smgarden.png` — no project references them) copy into `src/content/_orphans/`. Leading-underscore directory keeps them out of any collection's glob `base`. Future use TBD; bytes preserved without polluting collections.
- **D-11:** Profile picture lives at `src/assets/profile.jpg` (renamed from snapshot `profilepic.jpg`). `about.yaml` stores the path as a string (`profile_image: '/src/assets/profile.jpg'` or `~/assets/profile.jpg` per Astro convention). CONTENT-05's `image()` requirement scopes to *project* images — keeping the YAML singleton flat avoids bending the convention.
- **D-12:** `<Image />` usage and image optimization are explicitly Phase 3 work. Phase 2 only structures and types the references.

### Singleton shapes (CONTENT-03)

- **D-13:** `about.yaml` schema: `{ first_name, last_name, current_status, email, contact_message, description, resume_download, profile_image, social: [{ name, url, icon }] }`. Social stays inline with `about` — it belongs to the person, not the nav. `resume_download: 'Rashmil_Panchani.pdf'` (the file in `public/` — only file that survived the Phase 1 wipe).
- **D-14:** `links.yaml` schema: array of `{ id, label, order }` objects (CMS-neutral; replaces parallel `sections[]` + `links[]` arrays from the existing JSON — Pitfall 19). Schema enforces unique `id` values across entries.
- **D-15:** `skills.yaml` schema: `{ categories: [{ name, order, items: [{ name, icon }] }] }`. Collapses the existing parallel `skill_array[]` (category order) + `skills{}` (keyed items) shape into one ordered structure.

### Icons (CONTENT-07)

- **D-16:** `icon` field is an Iconify identifier string of shape `prefix:name`. Schema: `icon: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/)`. Validates the `prefix:name` shape at build; catches typos like `devicon-python` (the existing CDN class form) vs the correct `devicon:python`.
- **D-17:** Migration maps every CDN class in the snapshot to an Iconify identifier:
  - Devicon brand glyphs (C, C++, Java, Python, Go, JavaScript, Windows, Linux, macOS, MySQL, PostgreSQL, MongoDB, Redis, HTML5, CSS3, Django, NodeJS, ReactJS, Bootstrap, Heroku, AWS, Git) → `devicon:<name>` for tech stack; social (LinkedIn, GitHub) → `simple-icons:<name>` for cleaner brand glyphs.
  - Already-Iconify entries (`logos:graphql`, `logos-google-cloud-platform`) → normalized to canonical Iconify ids (`logos:graphql`, `logos:google-cloud`).
  - Skills with no good brand match (NLTK) → `lucide:code` generic placeholder. NumPy/Pandas/Tensorflow/Keras/OpenCV map to their simple-icons brand icons (those exist).
- **D-18:** All icon-set decisions documented in the migration notes; researcher / planner can audit before Phase 3 begins.

### Content body & schemas (CONTENT-01, CONTENT-08)

- **D-19:** Long-form text lives in the markdown body, not frontmatter. Affects: `projects.description`, `work.description`, `leadership.description`, `testimonials.text`. Frontmatter holds only metadata (title, company, role, dates, url, tech_stack, order, cover, draft). Phase 3 renders body via `<Content />`.
- **D-20:** Schema requires non-empty body content for every list-collection entry. Implemented via a custom check on the entry body (Astro exposes the rendered HTML / raw content during validation); if Astro's native validation doesn't gate on body, a Vitest assertion in `tests/content-validation.test.ts` covers the same invariant.
- **D-21:** All string fields apply `.transform(s => s.trim())` then `.min(1)`. Catches the existing `first_name: "Rashmil "` (trailing space) and any equivalent regression.
- **D-22:** Conservative normalization during migration: trim whitespace; fix demonstrable errors (the `garduino`/`graduino` mismatch only); preserve user voice in idiosyncratic spellings (`Postgre SQL`, `peAR Technologies.`, school name casing) — those are the user's authored content, not bugs.
- **D-23:** Field naming is CMS-neutral (CONTENT-07): no `_id`, no `_ref`, no `sys.*`, no raw CSS class names. Use plain English fields. Enum values are plain strings (e.g., if a future `kind` field is added, it's `'project' | 'demo'`, not class names).

### Nav reconciliation

- **D-24:** Canonical id/label for the work section: id `work`, label `Work`. The snapshot's `Experience` label and `#experience` anchor are reconciled to `Work`/`#work` — Phase 1 D-23 already pinned the lowercase id `work` in the smoke test, and Phase 1 stub `Work.astro` uses it. Migration aligns to that.
- **D-25:** Initial `links.yaml` contents (7 nav entries; SideNav itself is the chrome, not an entry):
  - `{id: about, label: About, order: 10}`
  - `{id: education, label: Education, order: 20}`
  - `{id: work, label: Work, order: 30}` (reconciled from `Experience`)
  - `{id: skills, label: Skills, order: 40}`
  - `{id: projects, label: Projects, order: 50}`
  - `{id: leadership, label: Leadership, order: 60}`
  - `{id: testimonials, label: Testimonials, order: 70}`

### CONTENT-08 malformed-fixture test

- **D-26:** Implementation file: `tests/content-validation.test.ts` (alongside existing `tests/smoke.test.ts`). Fixture: `tests/__fixtures__/malformed-project.md` — a markdown file with frontmatter missing the required `title` field.
- **D-27:** Test mechanics: in a `try`/`finally`, copy the fixture to `src/content/projects/__test__/index.md`, spawn `npx astro check` via `node:child_process`, assert the process exits non-zero AND stderr contains both the field path (`title`) and the entry id (`__test__`). Cleanup deletes the temp file regardless of outcome.
- **D-28:** A second sub-test asserts `await getCollection('projects')` over the real data returns `length > 0` and entries have non-`any` types (positive-path coverage for ROADMAP Phase 2 SC #1). Lives in the same test file; uses `expectTypeOf` from Vitest for the type assertion.

### Claude's Discretion

- Exact Zod schema source — whether to factor shared field bundles (e.g., `dateRangeSchema`, `iconSchema`) into helpers or inline. Planner picks based on duplication count.
- Whether to write a Node migration script (`scripts/migrate-content.mjs`) that reads the snapshot JSON and emits the markdown/YAML files, or to hand-author the 13 projects + 2 work + 3 education + 1 leadership + 1 testimonial. Hand-authoring is plausible given the small N; researcher / planner decides.
- The exact Iconify identifier per skill where multiple plausible matches exist (e.g., `devicon:python` vs `simple-icons:python`). Migration notes document each pick.
- Whether `astro:content` types fully satisfy the strictest tsconfig flags (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) without local annotation — planner verifies during type-check.
- The `_orphans` directory containment mechanism — leading underscore + not being any collection's `base` is usually enough; if Astro 6 still scans it for some reason, a `.gitkeep` + comment may be needed.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project decisions & scope
- `.planning/PROJECT.md` — Locked decisions, M1 active requirements, M2 compatibility note (Content Layer is the CMS contract).
- `.planning/REQUIREMENTS.md` § Content Layer — CONTENT-01..08 are this phase's full requirement set.
- `.planning/ROADMAP.md` § Phase 2 — Goal, dependency on Phase 1, requirements, 5 success criteria.
- `.planning/STATE.md` — Pre-Phase-2 decisions log; no Phase 2 blockers (Pitfall 29 is Phase 1 / Tailwind territory).

### Prior phase context (locked decisions to honor)
- `.planning/phases/01-foundation/01-CONTEXT.md` — D-03 snapshot strategy, D-10 strictest tsconfig (schemas must satisfy `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), D-11 empty `src/content.config.ts` placeholder, D-23 lowercase ids including `work`.

### Pitfalls research (consult before writing schemas)
- `.planning/research/PITFALLS.md` § Pitfall 1 — Content config file location (must be `src/content.config.ts`, NOT `src/content/config.ts`).
- `.planning/research/PITFALLS.md` § Pitfall 2 — Loader API explicitly; no legacy `type: 'content'`/`'data'`. Dynamic routes use `[...id]`, not `[...slug]`.
- `.planning/research/PITFALLS.md` § Pitfall 3 — `file()` loader schema shape: object per entry, not array.
- `.planning/research/PITFALLS.md` § Pitfall 4 — `image()` helper, frontmatter image paths relative to markdown.
- `.planning/research/PITFALLS.md` § Pitfall 19 — Single nav structure, no parallel arrays.
- `.planning/research/PITFALLS.md` § Pitfall 20 — No `image_map`; per-entry colocation.
- `.planning/research/PITFALLS.md` § Pitfall 28 — `getCollection` predicate from day one (draft pattern).

### Source data
- `.planning/snapshots/m1-source/resumeData.json` — every value migrated this phase comes from here.
- `.planning/snapshots/m1-source/assets/` — every image variant copied into entry dirs (or `_orphans/`) comes from here.

### Existing codebase analysis
- `.planning/codebase/STRUCTURE.md` — Existing JSON shape and field names; reference when mapping fields.
- `.planning/codebase/CONCERNS.md` — `image_map` anti-pattern, parallel sections/links arrays, large-image weight (informs Phase 3 but origin is here).

### Astro Content Layer official docs (consult during planning)
- https://docs.astro.build/en/guides/content-collections/ — Loaders, schemas, `getCollection`.
- https://docs.astro.build/en/reference/modules/astro-content/ — `getCollection`/`getEntry` API.
- https://docs.astro.build/en/guides/images/ — `image()` schema helper, frontmatter conventions.
- https://docs.astro.build/en/reference/modules/astro-assets/ — Asset module reference.

### Behavioral guidelines
- `.claude/CLAUDE.md` — Simplicity first, surgical changes, goal-driven execution. WCAG 2.1 AA hard requirement (Phase 4 owns enforcement; schemas don't gate on it).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/content.config.ts` — empty placeholder created by Phase 1 D-11. Phase 2 fills with all 8 `defineCollection` exports.
- `.planning/snapshots/m1-source/resumeData.json` — 13 projects, 2 work entries, 3 education entries, 1 leadership entry, 1 testimonial, 6 skill categories. Single source for the migration.
- `.planning/snapshots/m1-source/assets/` — 22 image files. Of these, project images map by `image` field; orphans (4 files) go to `_orphans/`.
- `public/Rashmil_Panchani.pdf` — survived the Phase 1 wipe. About.astro (Phase 3) links to `/Rashmil_Panchani.pdf`.
- `tests/smoke.test.ts` — Phase 1 Vitest scaffold. Add `tests/content-validation.test.ts` alongside it using the same patterns.
- Phase 1 stub `.astro` files in `src/components/` use ids `about, education, work, skills, projects, leadership, testimonials, sidenav` (D-23). Migration aligns nav ids to this.

### Established Patterns
- Astro `defineCollection` with explicit `loader:` keys (per Pitfall 2 — not legacy `type:`).
- Zod schemas typed via the schema-function form `({ image }) => z.object(...)` whenever an image field is present.
- Filenames in `src/content/<collection>/` use kebab-case; Astro derives `entry.id` from filename.

### Integration Points
- `src/content.config.ts` is the single integration surface for Phase 2 — every collection registered there.
- Schemas read by `astro check` (CONTENT-08 gate) and by `getCollection` / `getEntry` at build time.
- Phase 3 reads collections via `getCollection('projects', ({data}) => import.meta.env.PROD ? !data.draft : true)` — the predicate pattern is set here so Phase 3 inherits it (D-05).

</code_context>

<specifics>
## Specific Ideas

- **Garduino rename is the only filename change.** Every other snapshot file name is preserved verbatim into the entry dir.
- **Nav `Experience` → `Work` reconciliation is intentional.** Phase 1 already chose `work` as the canonical id (D-23 + Work.astro stub). Migration aligns, not the reverse.
- **`_orphans/` is a holding directory, not a collection.** Astro 6 only scans paths matched by a collection's `base` + glob pattern; `_orphans/` isn't referenced by any `defineCollection`. Leading underscore signals "internal" in case anyone reads the tree.
- **Resume PDF cache-busting is Phase 5's call.** STATE.md flags it as a Phase 5 pre-check (query-param vs `src/` import). Phase 2 keeps the existing `/Rashmil_Panchani.pdf` URL.
- **Profile pic path notation in YAML is planner's call.** `~/assets/profile.jpg`, `/src/assets/profile.jpg`, or a Vite-style alias — pick what the strictest tsconfig + Astro asset resolution accepts cleanly.

</specifics>

<deferred>
## Deferred Ideas

These came up during discussion and belong to other phases. Don't lose them.

### Phase 3 (Sections & Navigation / Style)
- Render `<Content />` for each markdown body (projects/work/leadership/testimonials descriptions).
- Resolve `icon: 'devicon:python'` etc. via `astro-icon` + `@iconify-json/devicon` + `@iconify-json/simple-icons` + `@iconify-json/logos` + `@iconify-json/lucide` (the exact packs to add as devDependencies).
- Project image optimization: WebP/AVIF, responsive `widths={[400,800,1200]}`, `<Image />` only — never raw `<img>` for project covers.
- `links.yaml` drives both SideNav anchor rendering and the `<section id="…">` attributes — single source.
- `Experience`/`Work` reconciliation may surface in any cross-reference doc; Phase 3 enforces `Work` everywhere.

### Phase 4 (SEO, A11Y & Meta Polish)
- `about.description` drives `<meta name="description">` and `og:description` via `<BaseHead>`.
- Social `aria-label`s on rendered icons (Pitfall 22) — schemas already have `name` for this.
- `social[].url` external link audit (rel="noopener noreferrer"), opens-in-new-tab announcement.

### Phase 5 (Cleanup & Deploy)
- Delete `.planning/snapshots/m1-source/` after CONTENT-06 manual-diff parity is signed off (Phase 1 D-03).
- Decide on resume PDF cache-busting (query param vs `src/` import).
- `_orphans/` contents — keep, delete, or archive separately.

### Future (M2 / out of M1)
- Multi-image galleries on a project (schema's `alternates` field is the seed).
- `draft: true` workflow in a CMS UI.
- Slug renames without broken links (would need explicit `slug:` field then; not in M1).

</deferred>

---

*Phase: 2-Content Layer*
*Context gathered: 2026-05-26*
