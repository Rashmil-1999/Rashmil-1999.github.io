# Phase 2: Content Layer - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-26
**Phase:** 2-content-layer
**Areas discussed:** Entry file layout, Skill icons, Nav links shape, Long-form descriptions

---

## Area Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Entry file layout | Directory-per-item vs flat. Affects M2 CMS upload story and how multi-image-per-item evolves. | ✓ |
| Skill icons | How to model icons in schema. Old data uses CDN class strings. | ✓ |
| Nav links shape | Existing `sections[]` + `links[]` parallel arrays anti-pattern (Pitfall 19). | ✓ |
| Long-form descriptions | Markdown body vs frontmatter for projects/work/leadership/testimonials prose. | ✓ |

**User's choice:** All four areas selected.

---

## Entry file layout

### Q1 — Disk layout

| Option | Description | Selected |
|--------|-------------|----------|
| Directory-per-item (Recommended) | `src/content/projects/face-detection/index.md` + `cover.png` next to it. Image co-location matches `image()` helper expectations; M2 CMS uploads one folder per project; multi-image later without renaming. Pitfall 4 + 20 explicitly recommend this. | ✓ |
| Flat layout | `src/content/projects/face-detection.md` + `face-detection.png` in the same parent dir. Astro's `image()` still resolves `./face-detection.png` from the markdown file. M2 CMS has to track sibling files instead of one folder. | |

**User's choice:** Directory-per-item.

### Q2 — Slug source

| Option | Description | Selected |
|--------|-------------|----------|
| Kebab-case from title, Astro auto-derives `entry.id` (Recommended) | Filename = `face-detection`. Astro 6 exposes `entry.id` from the filename. No `slug:` field needed. Stable across reorders since `order` is separate. | ✓ |
| Explicit `slug` field in frontmatter | Schema requires `slug: z.string()`. Filename can drift. CMS-friendly for renames-without-broken-links but adds a foot-gun. | |
| Numbered filename prefix (`01-face-detection.md`) | Filename ordering drives display order. Conflicts with the locked CONTENT-04 `order` requirement. | |

**User's choice:** Kebab-case auto-derived.

### Q3 — Image variants

| Option | Description | Selected |
|--------|-------------|----------|
| Pick smallest-acceptable per project, rename to `cover.<ext>` (Recommended) | Phase 2 selects one file per project, renames to `cover.<ext>`. Phase 3 owns transcoding. | |
| Copy all variants, schema picks one | Each entry gets all variants in its dir, schema points to a specific file by name. More flexibility; more bytes. | ✓ |
| You decide | Claude picks per project using a "smallest non-degraded" rule. | |

**User's choice:** Copy all variants, schema picks one.

### Q4 — Profile photo placement

| Option | Description | Selected |
|--------|-------------|----------|
| `src/assets/profile.jpg` + string path in `about.yaml` (Recommended) | Profile stays in `src/assets/`; Phase 3 imports it directly in About.astro. CONTENT-05's `image()` requirement scopes to *project* images. | ✓ |
| Co-locate at `src/content/about/profile.jpg` + `image()` helper | Promotes `about` from a flat YAML to a dir-with-YAML. Internally consistent with project images but bends the singleton convention. | |

**User's choice:** `src/assets/profile.jpg` + string path.

---

## Entry file layout — drill-down

### Q5 — Garduino/graduino mismatch

| Option | Description | Selected |
|--------|-------------|----------|
| Slug `garduino-smart-garden`, rename file `garduino.png` (Recommended) | Slug follows the title; copy `graduino.png` → `garduino.png`. Migration notes flag this as fixed. | ✓ |
| Slug `garduino-smart-garden`, keep file `graduino.png` | Preserves typo for archaeological fidelity. Visible footgun later. | |
| Slug `garduino`, keep file `graduino.png` | Short slug; preserves snapshot filename. Less descriptive entry id. | |

**User's choice:** Slug `garduino-smart-garden`, rename file `garduino.png`.

### Q6 — Cover field schema with multiple variants

| Option | Description | Selected |
|--------|-------------|----------|
| Single `cover: image()` field; other variants are unreferenced files (Recommended) | Schema mandates one cover. Other variants sit in the dir as backups. | |
| `cover: image()` + optional `alternates: image().array()` | Schema captures all variants. Future-proof for a gallery. | ✓ |
| You decide | Claude picks based on simplest schema that satisfies CONTENT-05. | |

**User's choice:** `cover` + optional `alternates: image().array()`.

### Q7 — Orphan images

| Option | Description | Selected |
|--------|-------------|----------|
| Leave in snapshot; do not copy (Recommended) | Migration data-driven — only copy referenced images. Orphans stay in `.planning/snapshots/...` until Phase 5. | |
| Copy orphans into `src/content/_orphans/` | Preserves them in the new tree. Needs containment so they don't become collection entries. | ✓ |
| Delete from snapshot entirely | Trim snapshot now. Destructive editing of the immutable pre-wipe record. | |

**User's choice:** Copy orphans into `src/content/_orphans/`.

### Q8 — Filenames in entry dirs

| Option | Description | Selected |
|--------|-------------|----------|
| Keep original snapshot filenames verbatim (Recommended) | Traceable 1:1 to snapshot. Frontmatter `cover` references one of them. | ✓ |
| Normalize: rename chosen to `cover.<ext>`, drop others | Bytes-minimal. Conflicts with "copy all variants" pick. | |
| Hybrid: rename chosen to `cover.<ext>`, keep others under original names | `cover.<ext>` canonical; backups keep snapshot names. | |

**User's choice:** Keep original snapshot filenames verbatim.

---

## Skill icons

### Q1 — Icon field shape

| Option | Description | Selected |
|--------|-------------|----------|
| Iconify identifier string (`devicon:python`, `simple-icons:linkedin`) (Recommended) | Schema validates `prefix:name`. Phase 3 feeds directly to `<Icon name={skill.icon} />`. Existing JSON has some entries already in this shape. | ✓ |
| Skill name only; Phase 3 maps name→icon | Schema just stores `name`. Phase 3 component owns a `NAME_TO_ICON` map. Anti-pattern echo of `image_map` (Pitfall 20). | |
| Split: `name` + `iconLibrary` enum + `iconKey` | Validates library is one we bundle, but verbose; Iconify's `prefix:name` already encodes the library. | |

**User's choice:** Iconify identifier string.

### Q2 — Missing brand icons

| Option | Description | Selected |
|--------|-------------|----------|
| Use real brand icons where they exist on simple-icons (Recommended) | simple-icons has numpy/pandas/tensorflow/keras/opencv. NLTK → generic `lucide:code` placeholder. | ✓ |
| Generic placeholder for all | Uniform fallback. Loses brand-icon distinction the existing site had. | |
| Make `icon` optional in schema | Skip the icon. Phase 3 falls back to text-only. Reduces visual fidelity. | |

**User's choice:** Use real brand icons where they exist on simple-icons.

### Q3 — `skills.yaml` shape

| Option | Description | Selected |
|--------|-------------|----------|
| `categories: [{ name, order, items: [{ name, icon }] }]` (Recommended) | Single nested object, ordered. Replaces parallel `skill_array[]` + `skills{}`. CMS-friendly. | ✓ |
| `items: [{ name, icon, category }]` flat | Phase 3 has to group at render time. Category order needs a separate field or alphabetical. | |
| One YAML per category | Contradicts CONTENT-03 (skills is a singleton). | |

**User's choice:** Nested `categories` with ordered items.

### Q4 — Social icons in about

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — `social: [{ name, url, icon: 'simple-icons:linkedin' }]` (Recommended) | Map existing devicon classes to simple-icons (cleaner brand glyphs). | ✓ |
| Same shape but keep devicon mapping | Use `devicon:linkedin` / `devicon:github` to preserve colored devicon look. Heavier visual change for Phase 3. | |
| You decide | Claude picks based on which set produces the cleanest social glyphs. | |

**User's choice:** simple-icons for social.

---

## Nav links shape

### Q1 — Nav structure

| Option | Description | Selected |
|--------|-------------|----------|
| Single `links.yaml` with `[{id, label, order}]` (Recommended) | One source of truth. Schema enforces unique ids. REQUIREMENTS-CONTENT-03 already names this singleton `links`. | ✓ |
| Rename singleton to `nav.yaml`, same shape | Clearer name but drifts from locked requirement text. | |

**User's choice:** `links.yaml`.

### Q2 — Anchor id format

| Option | Description | Selected |
|--------|-------------|----------|
| Bare id (`about`, `work`), Phase 3 prepends `#` (Recommended) | Schema validates `^[a-z][a-z0-9-]*$`. Same value as `<section id>` and `href="#…"`. Single source. | ✓ |
| Full anchor string (`#about`, `#work`) | Matches existing JSON 1:1. Phase 3 has to strip `#`. Mismatched ids = silently-broken nav. | |

**User's choice:** Bare id.

### Q3 — Work vs Experience canonical

| Option | Description | Selected |
|--------|-------------|----------|
| `work`/`Work` — align with Phase 1 / ROADMAP (Recommended) | Phase 1 smoke test asserts `id="work"`. `Work.astro` stub uses it. Migration reconciles snapshot's `Experience`. | ✓ |
| Keep `experience`/`#experience` | Preserves existing-site verbatim. Cascades to Phase 1 stub + smoke test changes. | |
| Compromise: id `work`, label `Experience` | Internal id matches Phase 1; visible label matches existing site. Easy to mis-remember. | |

**User's choice:** `work`/`Work`.

### Q4 — Resume PDF link

| Option | Description | Selected |
|--------|-------------|----------|
| `about.yaml` keeps `resume_download: 'Rashmil_Panchani.pdf'` (Recommended) | Matches existing JSON. Not a nav entry. Linked from About.astro in Phase 3. | ✓ |
| Add a `links.yaml` entry with `external: true` | Mixes nav concerns. | |
| Promote to a top-level `cta` singleton | Over-engineered for one PDF. | |

**User's choice:** `about.yaml` keeps `resume_download`.

---

## Long-form descriptions

### Q1 — Body vs frontmatter

| Option | Description | Selected |
|--------|-------------|----------|
| Markdown body; short metadata in frontmatter (Recommended) | Body for `description` / `text`. Editors get rich formatting; Phase 3 renders via `<Content />`. Matches Astro design. | ✓ |
| All in frontmatter as string fields | Easier exact-text validation. Multi-paragraph prose becomes ugly YAML. | |
| Mixed: short in frontmatter, only projects use body | Inconsistent across collections. | |

**User's choice:** Markdown body.

### Q2 — Empty body allowed?

| Option | Description | Selected |
|--------|-------------|----------|
| Require non-empty body content (Recommended) | Schema gates: at least one non-whitespace character. Catches accidentally-empty entries at build. | ✓ |
| Allow empty body | More permissive; risks blank cards on the rendered site. | |

**User's choice:** Require non-empty.

### Q3 — Migration normalization scope

| Option | Description | Selected |
|--------|-------------|----------|
| Conservative: trim whitespace, fix demonstrable errors only (Recommended) | Trim trailing/leading spaces; fix the `garduino`/`graduino` typo. Preserve user voice. | ✓ |
| Aggressive: normalize casing, fix spelling, expand abbreviations | Risks unwanted edits to user-authored content. | |
| Verbatim: copy byte-for-byte including trailing whitespace | Leaves visible bugs (trailing space in name). | |

**User's choice:** Conservative.

### Q4 — CONTENT-08 malformed-fixture test

| Option | Description | Selected |
|--------|-------------|----------|
| Vitest copies fixture into `src/content/projects/`, spawns `astro check`, asserts non-zero + error message (Recommended) | Automated. Fixture missing required `title`. Test verifies stderr includes field path. Cleanup in `finally`. | ✓ |
| Document-only: a fixture sits in tests/ with a manual instruction to verify | CONTENT-08 implies automated check; manual-only undersells the requirement. | |
| Inline test using zod-from-Astro: import schema, call `.parse()` with bad data | Misses Astro → Zod integration layer (image(), glob loader). | |

**User's choice:** Vitest copies fixture into projects, spawns `astro check`.

---

## Claude's Discretion

Areas explicitly left to Claude / planner:

- Exact Zod schema source — inline vs shared helpers (`dateRangeSchema`, `iconSchema`). Planner picks based on duplication count.
- Whether to write a Node migration script (`scripts/migrate-content.mjs`) vs hand-author the 13 + 2 + 3 + 1 + 1 entries. Researcher / planner decides.
- Per-skill Iconify pick where multiple plausible matches exist (`devicon:python` vs `simple-icons:python`). Migration notes document each.
- Whether `astro:content` types satisfy strictest tsconfig without local annotation. Planner verifies during type-check.
- `_orphans/` containment mechanism — leading underscore is usually enough; `.gitkeep` if needed.

## Deferred Ideas

Ideas mentioned during discussion that were noted for future phases:

- **Phase 3:** Render `<Content />` per markdown body; resolve Iconify ids via `astro-icon` + specific Iconify packs; project image optimization via `<Image />`; `links.yaml` drives both nav and `<section id>` attributes.
- **Phase 4:** `about.description` drives `<meta name="description">` / `og:description`; social `aria-label`s; external-link `rel="noopener noreferrer"`.
- **Phase 5:** Delete `.planning/snapshots/m1-source/` after CONTENT-06 parity; resume PDF cache-busting strategy; `_orphans/` final disposition.
- **Future (M2):** Multi-image galleries via `alternates`; `draft: true` workflow in a CMS UI; slug renames without broken links.
