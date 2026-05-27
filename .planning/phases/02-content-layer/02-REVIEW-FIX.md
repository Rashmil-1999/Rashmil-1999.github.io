---
phase: 02-content-layer
fixed_at: 2026-05-26T22:13:23Z
review_path: .planning/phases/02-content-layer/02-REVIEW.md
iteration: 1
findings_in_scope: 7
fixed: 7
skipped: 0
status: all_fixed
---

# Phase 2: Code Review Fix Report

**Fixed at:** 2026-05-26T22:13:23Z
**Source review:** `.planning/phases/02-content-layer/02-REVIEW.md`
**Iteration:** 1

**Summary:**

- Findings in scope (critical + warning): 7
- Fixed: 7
- Skipped: 0
- Info findings (IN-01..IN-04): deferred (out of `critical_warning` scope)

**Test results after fixes:** `npx vitest run` — **9/9 tests pass**, including the new D-14 unique-id test.

## Fixed Issues

### CR-01: `dj-archive/archive.jpg` is a PNG file disguised by a `.jpg` extension

**Files modified:** `src/content/projects/dj-archive/archive.jpg` (renamed to `archive2.png`), `src/content/projects/dj-archive/index.md`
**Commit:** `e967d5f`
**Applied fix:** Verified via `file(1)` that the binary is a 512x512 PNG; renamed `archive.jpg` -> `archive2.png` via `git mv` to match its true codec, then updated the `alternates:` list in the markdown frontmatter to reference `./archive2.png` instead of `./archive.jpg`. The valid `./archive.png` entry was left in place. Removes the Phase 3 STYLE-03 image-pipeline land mine where sharp would have either rejected the file or shipped a corrupted output.

### WR-01: `links` schema does not enforce unique `id` across entries (D-14 unmet)

**Files modified:** `tests/content-validation.test.ts`
**Commit:** `aa8eb16`
**Applied fix:** Took the REVIEW.md's recommended Option (a) — added a Vitest assertion that reads the data-store and asserts `new Set(ids).size === ids.length` for the `links` collection. Option (b) was incompatible with Astro 6's `file()` loader, which hands the schema one entry at a time and cannot accept an array-shaped Zod refinement. The test runs after `astro build` populates the data-store and passes against the current 7-entry list.

### WR-02: Crashed test run leaves a poison fixture that breaks every subsequent `astro build`

**Files modified:** `tests/global-setup.ts`, `tests/content-validation.test.ts`
**Commit:** `4535e34`
**Applied fix:** Belt-and-braces defensive cleanup. Added `rmSync(POISON_DIR, { recursive: true, force: true })` at the top of `global-setup.ts` so any stale `src/content/projects/__test__/` directory from a signal-killed prior run is wiped before `astro build` is invoked, and mirrored the same `rmSync(TEMP_DIR, ...)` at the top of the CONTENT-08 test body so an OS-signal interrupt that bypasses the `try`/`finally` is also recovered on next run. `astro build` and the test no longer fail in a phantom-bug shape.

### WR-03: `profile_image: ~/assets/profile.jpg` uses an unconfigured path alias

**Files modified:** `src/content/about.yaml`
**Commit:** `c388910`
**Applied fix:** Replaced `~/assets/profile.jpg` with `/src/assets/profile.jpg`. Astro 6 does not auto-configure `~` (a Nuxt/Vue convention), and no `~` alias exists in `tsconfig.json`, `astro.config.mjs`, or Vite anywhere in this project. The new value matches Astro's standard project-root-relative form so Phase 3 consumers can resolve it via `import.meta.glob('/src/assets/*')` or a hand-written switch without additional config. YAML re-parses cleanly to the literal string and the schema accepts it via `trimmedString()`.

### WR-04: Positive-path project count assertion is too weak to catch a real regression

**Files modified:** `tests/content-validation.test.ts`
**Commit:** `63f50d2`
**Applied fix:** Replaced `expect(projects!.size).toBeGreaterThan(0)` with `expect(projects!.size).toBe(13)` (named constant `EXPECTED_PROJECT_COUNT`). A regression where 12 of 13 entries silently dropped (`draft: true`, glob rename, Zod rejection) would now fail the smoke test instead of slipping past as ">0 entries".

### WR-05: Malformed-fixture test under-checks the Zod error output and is signal-blind

**Files modified:** `tests/content-validation.test.ts`, `tests/__fixtures__/malformed-project.md`
**Commit:** `505611c`
**Applied fix:** Two parts: (1) replaced `expect(result.status).not.toBe(0)` with `expect(result.status).toBeGreaterThan(0)` so `status === null` (signal-killed process: segfault, OOM, SIGKILL) fails instead of silently masking a crash as a green schema validation. (2) Rewrote the misleading header comment in the fixture file to correctly state that BOTH `title` and `cover` are intentionally omitted and that the test asserts on the `title: Required` error in particular because it is unambiguous. Note: did not add `cover: ./placeholder.png` plus a colocated binary as REVIEW.md suggested as an alternative — kept the fixture minimal and just corrected the comment, which is the lower-friction path and matches the prompt's specific guidance.

### WR-06: `REPO_ROOT` derived from `process.cwd()` is fragile to invocation context

**Files modified:** `tests/content-validation.test.ts`
**Commit:** `a0d9cdb`
**Applied fix:** Replaced `const REPO_ROOT = process.cwd()` with `const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')`. The test now pins all derived paths (`FIXTURE`, `TEMP_DIR`, `TEMP_FILE`, `DATA_STORE`) to the test file's own location, so invocation from an IDE runner, monorepo wrapper, or CI scratch dir no longer silently breaks path resolution.

## Skipped Issues

None — all 7 in-scope findings were fixed.

## Notes for Reviewer

- Info findings (IN-01, IN-02, IN-03, IN-04) were deliberately deferred per `fix_scope: critical_warning`. Worth noting: IN-01 (misleading comment in malformed-project.md) overlaps with WR-05 and was incidentally fixed as part of that commit, since the corrected comment now accurately describes both missing fields.
- All fixes verified with `npx tsc --noEmit -p tsconfig.json` (clean, no new errors) and the full `npx vitest run` suite (9/9 tests pass).
- The `astro build` ran successfully through global-setup with no `InvalidContentEntryDataError` from the renamed file or revised `about.yaml`.
- The new D-14 unique-id Vitest assertion provides build-time enforcement of CONTEXT.md D-14 without modifying the schema layer; this keeps the `file()` loader contract intact.

---

_Fixed: 2026-05-26T22:13:23Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
