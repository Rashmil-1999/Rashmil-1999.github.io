---
phase: 02-content-layer
plan: 04
subsystem: content-layer
tags: [astro-content, markdown-frontmatter, projects-collection, zod-schema]
requires:
    - phase: 02-content-layer
      provides: 'Plan 02-01 defined the projects schema (schema-function form so image() is in scope; trimmedString + iconSchema helpers)'
    - phase: 02-content-layer
      provides: 'Plan 02-03 colocated 16 project images across 13 slug directories (incl. D-09 garduino rename, D-07 multi-variant for e-yantra + dj-archive)'
provides:
    - 13 markdown entries under src/content/projects/<slug>/index.md (one per project)
    - Frontmatter conforming to the projects schema (title, tech_stack, url?, cover, alternates?, order, draft defaulted)
    - Sparse step-10 order values 10, 20, ..., 130 matching snapshot array order (D-04)
    - Long-form descriptions in markdown body (D-19) — no description: in frontmatter
    - Garduino entry references ./garduino.png (D-09; no graduino string survives in src/content/projects/)
    - D-07 alternates wired for two multi-variant projects: e-yantra-competition (./eyantra.png), dj-archive (./archive.jpg, ./archive.png)
affects:
    - Plan 02-06 (positive-path test can assert getCollection('projects').length === 13)
    - Phase 03 (Projects.astro component will iterate this collection via getCollection)
    - Phase 04 (sitemap will discover /projects/* pages once they exist)
    - Phase 05 (snapshot cleanup can confirm parity between resumeData.json:227-326 and this collection)
tech-stack:
    added: []
    patterns:
        - 'Per-entry markdown with image() schema helper resolving cover via relative ./<filename> path (Pitfall 4 honored)'
        - 'Long-form text in markdown body, structured fields in YAML frontmatter (D-19 separation)'
        - 'Sparse step-10 order values for stable insertion-aware ordering without renumbering everything on insert (D-04)'
key-files:
    created:
        - src/content/projects/face-detection/index.md
        - src/content/projects/emotion-recognizer/index.md
        - src/content/projects/american-sign-language-detection/index.md
        - src/content/projects/age-of-warring-empire-tower-bot/index.md
        - src/content/projects/smart-india-hackathon/index.md
        - src/content/projects/e-yantra-competition/index.md
        - src/content/projects/garduino-smart-garden/index.md
        - src/content/projects/stack-overflow-chatbot/index.md
        - src/content/projects/twitter-named-entity-recognition/index.md
        - src/content/projects/library-attendance-manager/index.md
        - src/content/projects/dj-archive/index.md
        - src/content/projects/college-event-manager-app/index.md
        - src/content/projects/resume-website/index.md
    modified: []
key-decisions:
    - 'D-21 lossless casing normalization on tech_stack (researcher pre-approved per PATTERNS.md L325): snapshot Numpy/Tensorflow -> canonical NumPy/TensorFlow at every occurrence (5 entries each — face-detection, emotion-recognizer, american-sign-language-detection, smart-india-hackathon, stack-overflow-chatbot, twitter-named-entity-recognition).'
    - 'D-21 selective preservation: pandas and sklearn kept lowercase (the projects use their canonical lowercase package-import names — pandas IS the project name, not Pandas).'
    - 'D-22 user-voice preservation: title "Smart India Hackathon - Attention Span detection and detailed analysis of Dialogue." kept trailing period verbatim (matches snapshot).'
    - 'D-22 user-voice preservation: tech_stack item "SQLlite" (snapshot typo) kept verbatim — author misspelling is voice, not error to fix.'
    - 'YAML quoting policy (matches Prettier single-quote precedent from Plans 02-02 / 02-05): strings containing a colon or a hyphen-followed-by-space wrapped in single quotes ("Embedded - C", "Hardware: Barcode Scanner"); plain strings left unquoted.'
    - 'Block-sequence form (- item indented under tech_stack:) chosen over inline flow form — Prettier normalizes both, block form is more readable for 4-7-item arrays and matches Plan 02-02 YAML convention.'
patterns-established:
    - 'Markdown entry shape for image-bearing list collections: frontmatter (typed fields) + body (long-form text). Wave 3 list-collection plans (02-05) used the same shape minus the cover field.'
    - 'Alternates lookup: secondary image variants land in alternates: [] for the future Plan 02-06+ component to surface (e.g., gallery view). cover: is canonical primary.'
requirements-completed:
    - CONTENT-02
    - CONTENT-05
duration: 1m 55s
completed: 2026-05-27T00:37:31Z
---

# Phase 2 Plan 04: Project Content Entries Summary

**Authored 13 typed markdown entries (1 per project, snapshot lines 227-326) at `src/content/projects/<slug>/index.md` with image()-resolvable cover paths, step-10 order values, and snapshot descriptions migrated to body — completes the content side of CONTENT-02 and the cover-reference side of CONTENT-05.**

## Performance

- **Duration:** 1m 55s
- **Started:** 2026-05-27T00:35:36Z
- **Completed:** 2026-05-27T00:37:31Z
- **Tasks:** 1
- **Files created:** 13

## Accomplishments

- 13 project index.md entries authored in a single atomic task, every frontmatter validating against `src/content.config.ts` projects schema.
- `astro check` exits 0 (20 files: 0 errors, 0 warnings, 38 hints — identical baseline to Plan 02-01).
- All 13 snapshot project entries from `resumeData.json:227-326` round-trip into the new collection with no content loss (titles, tech_stack, urls, descriptions).
- D-07 multi-variant projects have alternates wired:
    - `e-yantra-competition/index.md` → cover `./eyantra.jpg`, alternates `[./eyantra.png]`
    - `dj-archive/index.md` → cover `./archive.jpeg`, alternates `[./archive.jpg, ./archive.png]`
- D-09 garduino rename flows into frontmatter: `garduino-smart-garden/index.md` references `./garduino.png` and zero `graduino` strings exist anywhere under `src/content/projects/`.
- All 13 step-10 order values present (10, 20, ..., 130) matching snapshot array order verbatim.

## Per-Entry Map (order × title × image references)

| order | slug                                  | title                                                                          | cover                       | alternates                          |
| ----: | ------------------------------------- | ------------------------------------------------------------------------------ | --------------------------- | ----------------------------------- |
|    10 | face-detection                        | Face Detection                                                                 | `./face_detection.png`      | —                                   |
|    20 | emotion-recognizer                    | Emotion Recognizer                                                             | `./emotion_recognition.png` | —                                   |
|    30 | american-sign-language-detection      | American Sign Language Detection                                               | `./asl.png`                 | —                                   |
|    40 | age-of-warring-empire-tower-bot       | Age Of Warring Empire tower bot                                                | `./aowe.jpg`                | —                                   |
|    50 | smart-india-hackathon                 | Smart India Hackathon - Attention Span detection and detailed analysis of Dialogue. | `./SIH.png`            | —                                   |
|    60 | e-yantra-competition                  | E - Yantra Competition (Theme - Nutty Squirrel)                                | `./eyantra.jpg`             | `./eyantra.png`                     |
|    70 | garduino-smart-garden                 | Garduino - Smart Garden                                                        | `./garduino.png` (D-09)     | —                                   |
|    80 | stack-overflow-chatbot                | Stack Overflow Chatbot                                                         | `./chatbot.png`             | —                                   |
|    90 | twitter-named-entity-recognition      | Twitter Named Entity Recognition                                               | `./ner.png`                 | —                                   |
|   100 | library-attendance-manager            | Library Attendance Manager                                                     | `./library.png`             | —                                   |
|   110 | dj-archive                            | DJ Archive                                                                     | `./archive.jpeg`            | `./archive.jpg`, `./archive.png`    |
|   120 | college-event-manager-app             | College - Event Manager App                                                    | `./event.png`               | —                                   |
|   130 | resume-website                        | Resume Website                                                                 | `./resume.png`              | —                                   |

## tech_stack Casing Decisions (D-21 / D-22)

| snapshot token         | result        | rule                                                                                          | entries affected                                                                                                            |
| ---------------------- | ------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `Numpy`                | `NumPy`       | D-21 lossless canonicalization (PATTERNS.md L325 explicit pre-approval)                       | face-detection, emotion-recognizer, american-sign-language-detection, smart-india-hackathon, stack-overflow-chatbot, twitter-named-entity-recognition |
| `numpy`                | `NumPy`       | same as above — case unified across all 6 references                                          | stack-overflow-chatbot, twitter-named-entity-recognition                                                                    |
| `Tensorflow`           | `TensorFlow`  | D-21 lossless canonicalization (project's own brand uses camelcase TF)                        | face-detection, emotion-recognizer, american-sign-language-detection, stack-overflow-chatbot, twitter-named-entity-recognition |
| `pandas`               | `pandas`      | D-21 — kept lowercase; lowercase IS the project's canonical name (matches `import pandas as pd` convention) | stack-overflow-chatbot                                                                                |
| `sklearn`              | `sklearn`     | D-21 — kept lowercase; lowercase IS the import name (scikit-learn is the long form, sklearn is the package) | stack-overflow-chatbot                                                                                |
| `SQLlite`              | `SQLlite`     | D-22 user-voice preservation (author misspelling kept verbatim)                               | library-attendance-manager                                                                                                  |
| `Embedded - C`         | `'Embedded - C'` (quoted) | YAML reserves hyphen-followed-by-space at start of value; single-quote required | e-yantra-competition                                                                                                        |
| `Hardware: Barcode Scanner` | `'Hardware: Barcode Scanner'` (quoted) | YAML reserves colon-followed-by-space; single-quote required          | library-attendance-manager                                                                                                  |

The casing rules above are deterministic, not subjective: where the project's official documentation/brand uses a specific case (NumPy, TensorFlow), the snapshot's lowercased form is brought into alignment; where the package's canonical name IS lowercase (pandas, sklearn), it stays that way.

## Verification Result

| Check                                                                              | Expected | Actual | Status |
| ---------------------------------------------------------------------------------- | -------- | ------ | ------ |
| `find src/content/projects -maxdepth 2 -name 'index.md' \| wc -l`                  | 13       | 13     | OK     |
| All 13 slug directories have an `index.md`                                         | yes      | yes    | OK     |
| `src/content/projects/garduino-smart-garden/index.md` references `./garduino.png`  | yes      | yes    | OK     |
| `grep -r 'graduino' src/content/projects/`                                         | absent   | absent | OK     |
| `grep -rE '^cover:\s+/' src/content/projects/`                                     | absent   | absent | OK     |
| `grep -rE '^slug:' src/content/projects/`                                          | absent   | absent | OK     |
| `grep -rE '^description:' src/content/projects/`                                   | absent   | absent | OK     |
| `dj-archive/index.md` lists both `./archive.jpg` and `./archive.png` in alternates | yes      | yes    | OK     |
| `e-yantra-competition/index.md` lists `./eyantra.png` in alternates                | yes      | yes    | OK     |
| All 13 step-10 order values (10, 20, ..., 130)                                     | present  | present | OK    |
| `npx astro check` exit code                                                        | 0        | 0      | OK     |
| `npx astro check` diagnostics summary                                              | 0 errors / 0 warnings | 0 errors / 0 warnings / 38 hints | OK |

**`npx astro check` final result:** `Result (20 files): 0 errors, 0 warnings, 38 hints` — exit 0. The 38 hints are the identical baseline already documented in Plan 02-01 SUMMARY (37 × `ts(6385): 'z' is deprecated` from Astro-bundled Zod 4 JSDoc + 1 × pre-existing `tseslint.config` deprecation from Phase 1 Plan 01-04). No new diagnostics introduced by this plan.

## Task Commits

1. **Task 1: Author 13 project index.md entries (frontmatter + body) with step-10 order values** — `280e4eb` (feat)

**Plan metadata commit:** (will follow this SUMMARY.md + STATE.md + ROADMAP.md update) — `docs(02-04): complete project markdown entries plan`.

## Files Created/Modified

13 new files; 0 modified. Every file is structured as:

```
---
title: <string>
tech_stack:
    - <string>
    ...
url: <https url>           # all 13 entries have a url; snapshot has no url-missing projects
cover: ./<filename>        # resolves to colocated image from Plan 02-03
alternates:                # OPTIONAL — only e-yantra-competition and dj-archive
    - ./<filename>
order: <step-10 int>
---

<body paragraph from snapshot description, trimmed>
```

## Decisions Made

| Decision                                                                                       | Rationale                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Block-sequence YAML form for `tech_stack` and `alternates` (`- item` on new lines)             | Plan 02-02 / 02-05 precedent + Prettier normalizes both forms anyway; block form scales better as future entries grow tech_stack lists. CONTEXT.md left format as Claude's Discretion.                                                                                                              |
| Single-quote scalar wrapping where YAML requires quoting (colon/leading-hyphen patterns)       | Matches Prettier YAML normalization precedent from Plans 02-02 / 02-05 (single-quote is the Prettier-mandated default). Authoring double-quoted scalars would be rewritten on pre-commit, polluting the diff.                                                                                       |
| tech_stack casing canonicalization for NumPy / TensorFlow                                      | PATTERNS.md L325 explicitly pre-approved by researcher: snapshot `Numpy`/`Tensorflow` are author typos for the project's official brand cases, distinct from author-voice items like `SQLlite` or `Postgre SQL` which are kept verbatim per D-22. Two-tier rule: brand case wins for proper nouns; author voice wins for misspellings.|
| `draft:` field omitted from every entry                                                        | Schema default is `false` (D-05). Omitting keeps frontmatter minimal; Plan 02-06+ rendering filters on `entry.data.draft` and reads the schema default for omitted entries.                                                                                                                          |

## Deviations from Plan

None functional. One mechanical normalization applied by the pre-commit Prettier hook:

### Prettier-Normalized Items (no Rule fires)

**1. Markdown escape on `*` inside body text — `src/content/projects/age-of-warring-empire-tower-bot/index.md`**

- **Found during:** Task 1 pre-commit run.
- **Issue:** Snapshot body contains `50*10 = 500` (multiplication asterisk between digits). Prettier's markdown formatter escapes the `*` to `\*` to prevent it from being parsed as the start of inline emphasis (`*10 ...*`).
- **Fix:** Prettier applied automatically; commit landed with `50\*10 = 500`. Rendered output is identical (`50*10 = 500`) — the backslash is consumed by the markdown parser.
- **Files modified:** `src/content/projects/age-of-warring-empire-tower-bot/index.md` (single body character).
- **Commit:** Folded into `280e4eb` (Task 1 commit; Prettier ran in lint-staged before the commit landed).
- **Precedent:** Same class of Prettier normalization documented in Plan 02-02 (single-quote scalars) and Plan 02-05 (single-quote frontmatter scalars). Honoring Prettier rather than fighting it is the established convention.

No Rule 1 / 2 / 3 / 4 events fired during this plan. No CLAUDE.md directives applied (this plan touches only markdown content, no HTML/JS/UI surface, no Python, no config.yaml).

## Issues Encountered

None. The plan body was fully specified per-entry in the per-entry mappings (13 numbered items in Task 1's `<action>` block), so authoring required only careful transcription from the snapshot. Verification gates all passed on the first run after the Prettier hook completed.

The plan's `<automated>` verify block included `grep -A1 'alternates' src/content/projects/dj-archive/index.md | grep -qE 'archive\.(jpg|png)'`, which only checks one line after the alternates: key. Since dj-archive lists two alternates on two separate lines, `grep -A1` only sees `./archive.jpg`. A wider `grep -A2` or `grep -E` over the file body confirms both entries are present (executed separately during verification). No code change needed — the verification intent (both alternates present) is satisfied; the grep flag is a plan-authoring tightening opportunity.

## User Setup Required

None — no external service configuration required.

## Known Stubs

None. Every cover reference in this plan resolves to a real binary file colocated by Plan 02-03; every alternates entry resolves to a real binary file; every body has snapshot-sourced content (no TODO/FIXME/placeholder text introduced).

The 4 orphan images in `src/content/_orphans/` from Plan 02-03 remain there by design (D-10 containment); none are referenced from these markdown entries because the snapshot's `image_map` had no entries pointing to them.

## Threat Flags

None. Markdown content entries are build-time-only inputs to Astro Content Layer; they are not exposed at runtime as user-input. The Zod schema (`src/content.config.ts` projects schema) validates every field at `astro sync` / `astro check` time and would emit a build-time error on shape violations.

## Next Phase Readiness

- **Plan 02-06 unblocked:** the positive-path test in Plan 02-06 (`getCollection('projects').length === 13` / `entry.data.cover.src` resolves) is now satisfiable on the file system; once Plan 02-06 authors that test, it should pass on first run.
- **Phase 3 unblocked:** `Projects.astro` (Phase 3) can call `await getCollection('projects')` and iterate the 13 typed entries; `entry.data.cover` will be an Astro `ImageMetadata` object suitable for `<Image src={entry.data.cover} alt={entry.data.title} />`.
- **Phase 5 cleanup:** parity diff between `.planning/snapshots/m1-source/resumeData.json:227-326` and `src/content/projects/*/index.md` should show 13:13 entry parity with the documented D-21/D-22 casing transforms as the only delta. Trailing period on Smart India Hackathon title is preserved.
- **Plan 02-04 Wave 3 anomaly resolved:** the STATE.md "Wave 3 execution-order anomaly" flag (Plan 02-04 not executed before Plan 02-05) is closed — `src/content/projects/` now has 13 `.md` files and astro check exits 0.

## Plan-Authoring Annotations (no Rule fires)

Surfacing for future plan-authoring polish — no execution impact:

1. The `<automated>` verify block's `grep -A1 'alternates' src/content/projects/dj-archive/index.md | grep -qE 'archive\.(jpg|png)'` only inspects one line below the `alternates:` key. Because the dj-archive entry lists two alternates on two lines, the gate only ever sees the first one. A wider grep flag (`-A3`) or a different test (e.g., `grep -E '\./archive\.(jpg|png)$' src/content/projects/dj-archive/index.md | wc -l = 2`) would assert the full multi-variant constraint. The current gate still passes, and the file content satisfies the human-readable acceptance-criteria text ("alternates: field referencing both archive.jpg and archive.png").
2. No other plan-authoring annotations.

## Self-Check: PASSED

- All 13 `index.md` files exist at the expected paths under `src/content/projects/<slug>/`: verified via per-slug `test -f`.
- Commit `280e4eb` reachable from HEAD: `git log --oneline -3` shows `280e4eb feat(02-04): add 13 project content entries with frontmatter + body` as HEAD.
- `npx astro check` exits 0 with 0 errors / 0 warnings (38 hints — identical baseline to Plan 02-01).
- Garduino entry contains `cover: ./garduino.png` and no `graduino` substring exists anywhere under `src/content/projects/` (verified by `grep -rq 'graduino'` returning non-zero).

---

*Phase: 02-content-layer*
*Completed: 2026-05-27*
