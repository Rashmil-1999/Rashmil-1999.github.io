---
phase: 02-content-layer
plan: 05
subsystem: content-layer
tags: [content-entries, markdown-frontmatter, work, education, leadership, testimonials]
requires:
    - 02-01 (src/content.config.ts schemas)
provides:
    - 7 markdown entries across 4 image-free list collections (2 work + 3 education + 1 leadership + 1 testimonial)
    - testimonial user/role/org split applied (Roopam Mishra snapshot string decomposed per RESEARCH.md L673-679)
    - synthesized one-sentence bodies on 3 education entries to satisfy D-20 body-non-emptiness gate
affects:
    - downstream Plan 02-06 (Vitest body-non-emptiness assertion now has compliant data on these 4 collections)
    - downstream Plan 02-07 (parity diff — flag the 3 synthesized education bodies as `not in snapshot`)
tech-stack:
    added: []
    patterns:
        - YAML frontmatter scalar quoting (colons/percent/hyphen in `score`, `duration`, `company`)
        - D-19 long-form content in body (description / testimonial text)
        - D-22 verbatim casing preservation (peAR Technologies., DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING, ST. Rocks, ST. Francis)
key-files:
    created:
        - src/content/work/phionike-solutions/index.md
        - src/content/work/pear-technologies/index.md
        - src/content/education/dj-sanghvi-college-of-engineering/index.md
        - src/content/education/st-rocks-college-of-science-and-commerce/index.md
        - src/content/education/st-francis-school/index.md
        - src/content/leadership/dj-unicode/index.md
        - src/content/testimonials/roopam-mishra/index.md
    modified: []
decisions:
    - Synthesized one-sentence education bodies are restatements of frontmatter (Bachelor's, CGPA, board, dates) — no invented content (PATTERNS.md L390 explicitly authorizes this for D-20 satisfaction).
    - Honored Prettier single-quote normalization on YAML frontmatter scalars (same precedent as Plan 02-02 D-21). Author's double-quotes around `"Phionike Solutions: Design-Tech Studio"`, `"peAR Technologies."`, `"CGPA: 9.963 / 10"`, etc. were rewritten as single-quotes by the pre-commit Prettier hook — YAML semantics unchanged (single-quoted strings still escape the colons/special chars).
    - Wave-3 execution-ordering note (NOT a deviation by this plan): Plan 02-04 (project markdown authoring) has NOT been executed prior to this plan — 0 of 13 project entries exist. Plan 02-05's `depends_on: [02-01]` is satisfied; the `astro check` validation in Task 3 still exits 0. The "all 20 list-collection entries validate" success-criterion text in Plan 02-05's `<output>` (and Task 3's `acceptance_criteria`) refers to the *post-Plan-02-04* state. The empty `src/content/projects/` directory produces a WARN, not an ERROR, in `astro check`. Surfaced here so the orchestrator can dispatch Plan 02-04 before Wave 4 (Plan 02-06) starts asserting on `getCollection('projects')`.
metrics:
    duration: ~3m
    completed: 2026-05-27T00:31:00Z
    tasks: 3
    files: 7
requirements:
    - CONTENT-02 (partial — non-projects collections only; full satisfaction requires Plan 02-04 project entries)
---

# Phase 2 Plan 05: List-Collection Content Entries Summary

Authored 7 markdown entries across 4 image-free list collections — 2 work + 3 education + 1 leadership + 1 testimonial. Together with Plan 02-02's singletons and (forthcoming) Plan 02-04's project entries, every non-image-bearing snapshot entry from `resumeData.json` is now reachable through `getCollection()`.

## What Shipped

### Entry roster — slug, order, frontmatter fields

#### Work — `src/content/work/<slug>/index.md`

| Slug                  | order | Frontmatter fields used                         |
| --------------------- | ----- | ----------------------------------------------- |
| `phionike-solutions`  | 10    | `company`, `title`, `duration`, `order`         |
| `pear-technologies`   | 20    | `company`, `title`, `duration`, `order`         |

- Body of each: snapshot `description` field (D-19), trimmed (D-21).
- `peAR Technologies.` casing + trailing period preserved verbatim per D-22.

#### Education — `src/content/education/<slug>/index.md`

| Slug                                            | order | Frontmatter fields used                                       |
| ----------------------------------------------- | ----- | ------------------------------------------------------------- |
| `dj-sanghvi-college-of-engineering`             | 10    | `name`, `degree`, `graduated`, `score`, `order`               |
| `st-rocks-college-of-science-and-commerce`      | 20    | `name`, `degree`, `graduated`, `score`, `order`               |
| `st-francis-school`                             | 30    | `name`, `degree`, `graduated`, `score`, `order`               |

- All three school-name casings preserved per D-22 (uppercase `DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING`, `ST. Rocks College Of Science and Commerce`, `ST. Francis School`).
- `score: 'Finals: 89.4% , JEE mains :22000 rank, JEE Advanced :7500 rank.'` preserves the irregular snapshot spacing per D-22.

#### Leadership — `src/content/leadership/<slug>/index.md`

| Slug          | order | Frontmatter fields used                  |
| ------------- | ----- | ---------------------------------------- |
| `dj-unicode`  | 10    | `org`, `title`, `duration`, `order`      |

- Body: full snapshot `description` (≈830 chars about knowledge transfer, DJ Unicode mentorship, DJ Archive project lead, workshops, 45→70 developer growth).

#### Testimonials — `src/content/testimonials/<slug>/index.md`

| Slug             | order | Frontmatter fields used                  |
| ---------------- | ----- | ---------------------------------------- |
| `roopam-mishra`  | 10    | `user`, `role`, `org`, `order`           |

- Body: full snapshot `text` (the testimonial quote, ≈250 chars).

### Education body one-liners (synthesized — `not in snapshot`)

Per PATTERNS.md L390, the snapshot education entries have no body text. D-20 (Plan 02-06 body-non-emptiness assertion) requires a non-empty body on every list-collection entry. The 3 education bodies authored here are restatements of frontmatter only — no new claims. Flag for Plan 02-07 parity diff:

| Slug                                            | Synthesized body                                                                       |
| ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| `dj-sanghvi-college-of-engineering`             | `Bachelor's in Computer Engineering with a CGPA of 9.963 / 10.`                        |
| `st-rocks-college-of-science-and-commerce`      | `Higher Secondary Certificate, Maharashtra Board, completed July 2015 - June 2017.`    |
| `st-francis-school`                             | `ICSE Board schooling, graduated May 2015.`                                            |

### Testimonial user/role/org split — verbatim

Snapshot (single field, `resumeData.json:331`):

```
user: "Roopam Mishra, Founder of Phionike Solutions: Design-Tech Studio."
```

Decomposed into three schema fields per RESEARCH.md L673-679 + PATTERNS.md L437:

| Field | Value                                              |
| ----- | -------------------------------------------------- |
| user  | `Roopam Mishra`                                    |
| role  | `Founder`                                          |
| org   | `Phionike Solutions: Design-Tech Studio` (the trailing period from the snapshot's combined string was dropped — it belonged to the sentence-terminator of the joined form, not to the org name itself; this aligns with how the `org` field is referenced elsewhere in the snapshot, e.g., `work[0].company: "Phionike Solutions: Design-Tech Studio"` has no trailing period) |

The snapshot's separate `text` field (testimonial body) was moved into the markdown body per D-19; no `text:` frontmatter field exists on the entry.

## Verification Result

### Per-task verify gates

| Task | Gate                                                                                    | Status |
| ---- | --------------------------------------------------------------------------------------- | ------ |
| 1    | All 5 files exist (work × 2, education × 3)                                             | OK     |
| 1    | `peAR Technologies` appears verbatim in pear-technologies entry (D-22)                   | OK     |
| 1    | `DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING` appears verbatim in DJ Sanghvi entry (D-22) | OK   |
| 1    | Step-10 orders: work 10/20; education 10/20/30                                          | OK     |
| 1    | No `slug:` field in `src/content/work/` or `src/content/education/`                     | OK     |
| 1    | No `description:` field in `src/content/work/` or `src/content/education/`              | OK     |
| 1    | All 5 bodies non-empty (D-20 / Plan 02-06 prerequisite)                                 | OK (516 / 315 / 51 / 71 / 36 body chars after whitespace strip) |
| 2    | Both files exist (leadership, testimonial)                                              | OK     |
| 2    | Leadership `org: DJ Unicode`, title contains `Full Stack Mentor` + `Events Head`, `order: 10` | OK |
| 2    | Testimonial `user: Roopam Mishra`, `role: Founder`, `org: Phionike Solutions: Design-Tech Studio`, `order: 10` (split applied) | OK |
| 2    | No `text:` / `description:` / `slug:` fields                                            | OK     |
| 2    | Both bodies non-empty                                                                   | OK (831 / 250 body chars) |
| 3    | `npx astro check` exit code                                                             | 0      |
| 3    | 0× `InvalidContentEntryDataError` in output                                             | OK     |
| 3    | 0× `error TS` in output                                                                 | OK     |
| —    | Aggregate: `find ... -name index.md | wc -l` → 2 / 3 / 1 / 1 for work/edu/lead/test     | OK     |

### `astro check` output (truncated)

```
20:30:56 [content] Syncing content
20:30:56 [WARN] [glob-loader] No files found matching "**/*.md" in directory "src/content/projects"
20:30:56 [content] Synced content
20:30:56 [types] Generated 274ms
20:30:56 [check] Getting diagnostics for Astro files in /Users/rashmilpanchani/Documents/Rashmil-1999.github.io...
…
(37× `ts(6385): 'z' is deprecated.` cosmetic hints on src/content.config.ts — identical to Plan 02-01 baseline)
(1× `ts(6387): tseslint.config signature deprecated` on eslint.config.js — pre-existing from Phase 1 Plan 01-04)
…
Result (20 files):
- 0 errors
- 0 warnings
- 38 hints
```

The 20-file count includes: 9 `.astro` page/layout files + 1 React island + `src/content.config.ts` + 9 other `.ts` config/test files. The 38 hints break down exactly as Plan 02-01 documented: 37 × `ts(6385)` on `'z' deprecated` in `src/content.config.ts` (Astro 6's Zod 4 re-export's JSDoc — cosmetic only, does not fail under strictest) + 1 × `ts(6387)` on `eslint.config.js` (Phase 1 carry-over).

The `[WARN] [glob-loader] No files found matching "**/*.md" in directory "src/content/projects"` is a content-sync runtime log (not a diagnostic), and the summary line records it as 0 warnings — exit code is 0. The WARN appears because Plan 02-04's project markdown entries have not been authored yet (see "Inter-Plan Wave-3 Note" below).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Tooling artifact] Pre-commit Prettier rewrote double-quoted YAML scalars to single-quotes**

- **Found during:** Tasks 1 + 2 commits.
- **Issue:** The plan's `<action>` block specified double-quoting for YAML scalars containing colons / percent / leading hyphen — e.g., `company: "Phionike Solutions: Design-Tech Studio"`, `score: "CGPA: 9.963 / 10"`, `title: "Full Stack Mentor & Events Head"`. The repo's pre-commit Prettier hook (configured in Phase 1) normalized these to single-quotes (`'…'`) on commit. Same behavior observed in Plan 02-02 (singleton YAMLs).
- **Fix:** Honored the Prettier normalization. Single-quoted YAML scalars are semantically equivalent for the cases in this plan (no embedded apostrophes, no escape sequences needed). All `grep -q '^company:'`, `grep -q '^role:'`, etc. acceptance gates still pass because the field-name prefixes are unchanged.
- **Files modified:** All 7 entry files written in this plan (post-commit final state has single-quoted scalars where authored content used double-quotes).
- **Commits:** Folded into `8093bcb` and `e90531c`.

### Auto-added Critical Functionality

None — every CONTEXT.md decision (D-02, D-04, D-19, D-20, D-21, D-22) was covered by the plan's `<action>` blocks.

### Architectural Decisions

None — no Rule 4 events.

## Inter-Plan Wave-3 Note (not a deviation by this plan, surfaced for orchestrator)

**Plan 02-04 has not yet been executed.** This plan is Wave 3, sibling to Plan 02-04 in the dependency graph (both depend only on Plan 02-01). `.planning/phases/02-content-layer/` shows `02-04-PLAN.md` exists but `02-04-SUMMARY.md` is absent; `src/content/projects/*/index.md` count is 0; `src/content/projects/<slug>/` directories contain only the JPG/PNG images from Plan 02-03.

Consequences:
- `astro check` exits 0 (no errors), but emits a `[WARN] [glob-loader] No files found matching "**/*.md" in directory "src/content/projects"` content-sync log. Diagnostics summary reports 0 warnings; the WARN does NOT fail the check.
- The Wave 5 success criterion text "all 20 list-collection entries validate" (Plan 02-05 `<output>` + Task 3 `acceptance_criteria`) refers to the post-Plan-02-04 state. Currently 7/20 list entries exist (the 7 authored by this plan).
- Plan 02-06 (Wave 4) authors a Vitest assertion against `getCollection('projects').length > 0` (per RESEARCH.md Recipe R9). That assertion will fail if Plan 02-04 has not run by then. The orchestrator should dispatch Plan 02-04 before Plan 02-06.

This is a state-of-the-world report; nothing for this plan to fix.

## Authentication Gates

None — this plan touched no external services.

## Known Stubs

None. All 7 entries authored by this plan are fully populated with snapshot content (or, for the 3 education bodies, restatements of frontmatter explicitly authorized by PATTERNS.md L390). No placeholder text, no `TODO`/`FIXME` markers, no empty fields.

The 13 missing project entries are NOT stubs introduced by this plan — they are work owned by Plan 02-04 (see Inter-Plan note above).

## Threat Flags

None — these are author-supplied static content entries built into the site at compile time. No runtime trust surface, no user input flow, no new network endpoints, no auth path.

## Plan-Authoring Annotations (per `<context_from_prior_waves>` invitation)

No `<automated>`-vs-spec-body count mismatches found in Plan 02-05. The `<automated>` blocks in Tasks 1, 2, and 3 are internally consistent with the spec body (5 work+education files in Task 1, 2 leadership+testimonial files in Task 2, exit-0 + no `InvalidContentEntryDataError` + no `error TS` in Task 3) — no surfacing needed.

The `<verification>` (plan-level aggregate) block's `npx astro check` line presumes a 20-list-entry tree per its `<success_criteria>` text — but, as documented above, the actual exit code (0) holds regardless of whether Plan 02-04 has run, because the missing-projects condition is a WARN (not an error). The plan-level aggregate gate passes.

## Self-Check: PASSED

- All 7 created files exist at their specified paths:
  - `src/content/work/phionike-solutions/index.md` FOUND
  - `src/content/work/pear-technologies/index.md` FOUND
  - `src/content/education/dj-sanghvi-college-of-engineering/index.md` FOUND
  - `src/content/education/st-rocks-college-of-science-and-commerce/index.md` FOUND
  - `src/content/education/st-francis-school/index.md` FOUND
  - `src/content/leadership/dj-unicode/index.md` FOUND
  - `src/content/testimonials/roopam-mishra/index.md` FOUND
- Both commits reachable from HEAD:
  - `8093bcb feat(02-05): add work and education content entries` FOUND
  - `e90531c feat(02-05): add leadership and testimonial content entries` FOUND
- `npx astro check` exits 0 with 0 errors / 0 warnings / 38 hints.
