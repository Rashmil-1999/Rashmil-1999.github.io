---
phase: 02-content-layer
plan: 03
subsystem: content-layer
tags: [astro-content, assets, image-colocation]
requires:
    - phase: 02-content-layer
      provides: "Plan 02-01 defined the projects schema with image()-based cover field"
    - phase: 02-content-layer
      provides: "Plan 02-02 created singleton YAMLs (about/skills/links) and relocated profile.jpg"
provides:
    - 13 project entry directories under src/content/projects/<slug>/
    - 16 image files colocated with future markdown entries (Plan 02-04)
    - garduino.png exists at src/content/projects/garduino-smart-garden/ (D-09 rename applied; graduino.png NOT present)
    - 4 orphan images preserved at src/content/_orphans/ (D-10)
    - 4.8 MB emotion.png deliberately NOT copied (CONCERNS.md carry-forward)
affects:
    - 02-04-PLAN (markdown authoring — every cover ./<filename> resolves)
    - 02-05/06/07 (downstream Wave 3 plans)
    - phase 03 (Projects.astro component will import from src/content/projects/<slug>/)
    - phase 05 (snapshot cleanup decision will choose keep/delete/archive for _orphans/)
tech-stack:
    added: []
    patterns:
        - Image colocation with content entries (kills image_map anti-pattern; Pitfall 20 / CONCERNS carry-forward)
        - Leading-underscore directory for invisible-to-glob assets (_orphans/ outside every collection base)
key-files:
    created:
        - src/content/projects/face-detection/face_detection.png
        - src/content/projects/emotion-recognizer/emotion_recognition.png
        - src/content/projects/american-sign-language-detection/asl.png
        - src/content/projects/age-of-warring-empire-tower-bot/aowe.jpg
        - src/content/projects/smart-india-hackathon/SIH.png
        - src/content/projects/e-yantra-competition/eyantra.jpg
        - src/content/projects/e-yantra-competition/eyantra.png
        - src/content/projects/garduino-smart-garden/garduino.png
        - src/content/projects/stack-overflow-chatbot/chatbot.png
        - src/content/projects/twitter-named-entity-recognition/ner.png
        - src/content/projects/library-attendance-manager/library.png
        - src/content/projects/dj-archive/archive.jpeg
        - src/content/projects/dj-archive/archive.jpg
        - src/content/projects/dj-archive/archive.png
        - src/content/projects/college-event-manager-app/event.png
        - src/content/projects/resume-website/resume.png
        - src/content/_orphans/attendance.png
        - src/content/_orphans/attendance.webp
        - src/content/_orphans/attendance1.png
        - src/content/_orphans/smgarden.png
    modified: []
key-decisions:
    - "D-09 rename applied verbatim: snapshot graduino.png copied to garduino-smart-garden/garduino.png (the ONLY filename change in the entire snapshot->content migration)"
    - "D-08 verbatim preservation for all other filenames (case included — SIH.png stays uppercase; face_detection.png keeps underscore)"
    - "D-07 multi-variant kept intact: e-yantra-competition has both eyantra.jpg + eyantra.png; dj-archive has all three of archive.jpeg/.jpg/.png. Plan 02-04 will assign cover vs alternates[] in frontmatter"
    - "CONCERNS carry-forward honored: 4.8 MB emotion.png NOT copied; the 23 KB emotion_recognition.png is the cover candidate"
    - "D-10 containment via leading-underscore directory: src/content.config.ts has no base referencing _orphans, so the directory is invisible to every collection's glob"
    - "No .gitkeep files added; both _orphans/ and every project directory are non-empty after this plan (PATTERNS.md L470)"
patterns-established:
    - "Image colocation: each content entry's binaries live in the same directory as the (future) markdown file, so cover: ./<filename> resolves via Astro's image() schema helper (Pitfall 4)"
    - "Out-of-band asset preservation: orphan binaries from snapshots go to a leading-underscore sibling directory rather than being deleted"
requirements-completed:
    - CONTENT-05
duration: 1m 26s
completed: 2026-05-27T00:25:53Z
---

# Phase 2 Plan 03: Project Image Colocation Summary

**Copied 16 project images into 13 per-slug directories under `src/content/projects/` (with the sole `graduino.png` -> `garduino.png` rename) and preserved 4 orphan images in `src/content/_orphans/` — staging the asset side of CONTENT-05 so Plan 02-04 can author markdown with resolvable `cover: ./<filename>` frontmatter.**

## Performance

- **Duration:** 1m 26s
- **Started:** 2026-05-27T00:24:27Z
- **Completed:** 2026-05-27T00:25:53Z
- **Tasks:** 2
- **Files modified:** 20 created (0 modified)

## Accomplishments

- 13 project slug directories created under `src/content/projects/`.
- 16 image files copied verbatim from `.planning/snapshots/m1-source/assets/` into their per-slug directories.
- The single deliberate filename change applied: snapshot `graduino.png` (37 KB) -> `src/content/projects/garduino-smart-garden/garduino.png` (D-09).
- The 4.8 MB `emotion.png` deliberately excluded (CONCERNS.md carry-forward); the 23 KB `emotion_recognition.png` is present and will be the cover.
- 4 orphan images (`attendance.png`, `attendance.webp`, `attendance1.png`, `smgarden.png`) copied into `src/content/_orphans/`, invisible to every collection's `glob`.
- No markdown files created (Plan 02-04 owns markdown authoring).

## Verification Result

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| 13 project slug directories exist | 13 | 13 | OK |
| Image-file count under `src/content/projects/` | 16 | 16 | OK |
| `garduino-smart-garden/garduino.png` present | yes | yes | OK |
| `garduino-smart-garden/graduino.png` absent | yes | yes | OK |
| `emotion-recognizer/emotion.png` absent (4.8 MB rejection) | yes | yes | OK |
| `e-yantra-competition/` holds both `eyantra.jpg` and `eyantra.png` | yes | yes | OK |
| `dj-archive/` holds all 3 variants (`.jpeg`/`.jpg`/`.png`) | yes | yes | OK |
| `src/content/_orphans/` exists with 4 files | 4 | 4 | OK |
| `_orphans/` not referenced in `src/content.config.ts` | absent | absent | OK |
| No `.gitkeep` files | absent | absent | OK |
| Markdown files under `src/content/projects/` | 0 | 0 | OK (Plan 02-04) |

## Per-Slug Directory Map

| Slug | Cover candidate | Alternate variants |
|------|-----------------|--------------------|
| `face-detection` | `face_detection.png` (5.9 KB) | — |
| `emotion-recognizer` | `emotion_recognition.png` (23 KB) | — (4.8 MB `emotion.png` excluded) |
| `american-sign-language-detection` | `asl.png` (85 KB) | — |
| `age-of-warring-empire-tower-bot` | `aowe.jpg` (190 KB) | — |
| `smart-india-hackathon` | `SIH.png` (62 KB) | — |
| `e-yantra-competition` | `eyantra.jpg` (103 KB) | `eyantra.png` (3.8 KB) |
| `garduino-smart-garden` | `garduino.png` (37 KB) — renamed from `graduino.png` | — |
| `stack-overflow-chatbot` | `chatbot.png` (241 KB) | — |
| `twitter-named-entity-recognition` | `ner.png` (97 KB) | — |
| `library-attendance-manager` | `library.png` (6.1 KB) | — |
| `dj-archive` | `archive.jpeg` (110 KB) | `archive.jpg` (23 KB), `archive.png` (368 KB) |
| `college-event-manager-app` | `event.png` (32 KB) | — |
| `resume-website` | `resume.png` (622 KB) | — |

Sum: 13 slugs, 16 images. Cover/alternate assignment per Recipe R5 — Plan 02-04 will materialize this in frontmatter.

## Task Commits

1. **Task 1: Copy 18 project images into per-slug directories (with Garduino rename)** — `f4d6f1e` (chore)
2. **Task 2: Copy 4 orphan images into `src/content/_orphans/`** — `5b678d5` (chore)

_Note: The plan title and `<action>` text both say "18 images" in the narrative, but the canonical Recipe R5 mapping and the `files_modified` frontmatter list resolve to 16 project images (5 single-image projects + 1 dual-variant project + 1 triple-variant project + 6 more single-image projects = 16). The plan's `<objective>` also reconciles this to "22 source files − `emotion.png` (CONCERNS-excluded) − `profilepic.jpg` (handled by Plan 02-02) − 4 orphans = 16 project images". I copied exactly what the canonical table specifies; the "18" number in the action's first sentence is a stale draft figure superseded by the table within the same `<action>` block._

**Plan metadata commit:** (will be made after this SUMMARY.md + STATE.md + ROADMAP.md updates) — `docs(02-03): complete project-image colocation plan`.

## Files Created/Modified

20 new files, 0 modified. See `key-files.created` in frontmatter for the complete list.

Two directory creations of note:
- `src/content/projects/` — new tree with 13 slug subdirectories (5 of the 5 list collections defined in Plan 02-01 are now backed by at least one directory; the other 4 list collections — `work`, `education`, `leadership`, `testimonials` — will get their directories from later plans in Wave 3).
- `src/content/_orphans/` — new sibling of the collection directories; deliberately invisible to `src/content.config.ts`.

## Decisions Made

None novel — every decision was pre-specified in CONTEXT.md (`D-07`, `D-08`, `D-09`, `D-10`) and Recipe R5 of RESEARCH.md. The plan body resolved every ambiguity, so no Claude's-Discretion calls were needed.

## Deviations from Plan

None functional. One narrative observation, no code or commit impact:

### Annotations (no Rule fires)

**Plan body's narrative numbers reconcile against the canonical table within the same plan.**

- The `<objective>` says "18 image files" and the `<action>` numbered list runs 1-16. The end of the same `<action>` block already reconciles this ("13 projects, 16 image files copied"), as does the final `<verification>` block (`IMG_COUNT = 16`), `<success_criteria>` ("16 image files colocated"), `files_modified` frontmatter (16 project paths + 4 orphan paths = 20), and `<output>` ("expect 16 images"). Recipe R5 in RESEARCH.md is the authoritative source and lists 16 entries. I implemented to the table, which is what every machine-checkable gate in the plan asserts. Surfaced here as a plan-authoring note for future cleanup of the prose figure; no Rule fires because the spec is internally consistent at every gate.

No Rule 1 / 2 / 3 / 4 events. No CLAUDE.md directives applied (this plan touches only binary files; no HTML/JS/UI surface).

## Issues Encountered

None. The 22 expected snapshot files were all present at full size (verified by `ls -la` before any copy), all destination directories were created cleanly with `mkdir -p`, and every `cp` returned exit 0. The post-commit deletion check on both commits showed `No deletions in commit`.

The lint-staged hook printed `lint-staged could not find any staged files matching configured tasks` on both commits, which is expected behavior for a commit composed entirely of binary image files (no lint task matches `*.png`/`*.jpg`/`*.jpeg`/`*.webp`).

## User Setup Required

None — no external service configuration required.

## Known Stubs

None. This plan only stages binary assets; the markdown entries that will reference them via `cover: ./<filename>` are Plan 02-04's explicit deliverable, not stubs left by this plan. The Recipe-R5 cover/alternate assignment is captured in the per-slug map above for Plan 02-04 to consume.

## Threat Flags

None. Image files at static-site build time are not a trust-boundary surface; Astro's `image()` schema helper will validate every reference at `astro sync` time when Plan 02-04 authors the frontmatter.

## Next Phase Readiness

- Plan 02-04 unblocked: every `cover: ./<filename>` it will write resolves to a colocated file under the same project directory.
- Plan 02-05 (work), 02-06 (education + leadership), 02-07 (testimonials) are unaffected by this plan — their collections do not consume any of these images.
- Phase 5 cleanup decision (keep / delete / archive `_orphans/`) inherits a directory of exactly 4 files, preserving the snapshot's stranded-asset inventory verbatim.

## Self-Check: PASSED

- All 16 project images and 4 orphan images exist at the paths declared in `key-files.created`: verified by `find src/content/projects -type f \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' -o -name '*.webp' \) | wc -l = 16` and `find src/content/_orphans -type f | wc -l = 4`.
- Commit `f4d6f1e` (Task 1) reachable from HEAD: confirmed via `git log --oneline -3`.
- Commit `5b678d5` (Task 2) is the current HEAD before this docs commit.
- `garduino.png` present, `graduino.png` absent, `emotion.png` absent — all three asserted via `test -f` / `test ! -f`.

---
*Phase: 02-content-layer*
*Completed: 2026-05-27*
