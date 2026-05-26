---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [astro, typescript, vite, npm, git-branch-rename, greenfield-wipe]

# Dependency graph
requires: []
provides:
  - Astro 6.3.8 minimal+strict scaffold at repo root
  - main branch on local + origin (origin/master deleted; origin/gh-pages untouched)
  - Pre-wipe snapshot at .planning/snapshots/m1-source/ (resumeData.json + assets/ + favicon.ico + logo192.png + logo512.png) for Phase 2/3 consumption
  - .claude/ (GSD planning + agents + hooks + workflows) preserved in git
  - public/Rashmil_Panchani.pdf preserved as sole public/ survivor
affects: [02-tooling, 03-content, 03-sections, 04-seo-a11y, 05-cleanup-deploy]

# Tech tracking
tech-stack:
  added: [astro@^6.3.8, typescript (via astro/tsconfigs/strict)]
  patterns:
    - "Single rollup commit for greenfield wipe (D-04) — wipe + scaffold + snapshot + .claude/ preservation all in one SHA"
    - "Pre-wipe data preservation via snapshot directory (D-03) — Phase 2/3 read from .planning/snapshots/m1-source/ instead of resurrected src/"
    - "Conventional Commits scoped by phase number — chore(01): ..."

key-files:
  created:
    - astro.config.mjs
    - tsconfig.json
    - src/pages/index.astro
    - public/favicon.svg
    - .planning/snapshots/m1-source/resumeData.json
    - .planning/snapshots/m1-source/assets/ (22 files)
    - .planning/snapshots/m1-source/favicon.ico
    - .planning/snapshots/m1-source/logo192.png
    - .planning/snapshots/m1-source/logo512.png
    - .claude/ (entire GSD tree — 346 files, first time committed)
  modified:
    - package.json (CRA-shape → Astro-shape; scrubbed eslintConfig, browserslist, CRA scripts, react-* and gh-pages deps; retained private + homepage)
    - package-lock.json (CRA tree → Astro tree, 255 packages, 0 vulnerabilities)
    - .gitignore (appended .astro/, .env.production, .idea/ entries)
    - .planning/STATE.md (execution-started annotation)
    - .planning/config.json (added use_worktrees: false)

key-decisions:
  - "Defaulted package.json name to 'rashmil-portfolio' (was placeholder 'new-resume' from CRA). Private package, no registry conflict."
  - "Appended Astro entries to existing .gitignore rather than wholesale-replacing — preserves the user's pre-existing language-specific blocks (Python, Java, Go, C)."
  - "Did NOT add engines.node, lint-staged, husky, or prepare script — Plans 02 and 04 own those per CONTEXT.md Task 4 Step B."
  - "Kept README.md as-is (CRA original) — Plan 05 owns the rewrite per Phase 5 CLEAN-* + README-* work."

patterns-established:
  - "Snapshot pattern for irreversible data migrations — copy verbatim to .planning/snapshots/<milestone>-<purpose>/ before deletion; consume from there in downstream phases."
  - "Single rollup commit for big-bang transitions — when a whole subtree is being replaced, one commit captures the full provenance instead of fragmenting deletions and additions across multiple commits."

requirements-completed: []

# Metrics
duration: ~75min (across two executor sessions, separated by an auth re-login)
completed: 2026-05-26
---

# Phase 1 Plan 01: Greenfield Wipe + Astro 6 Scaffold Summary

**Replaced CRA SPA with Astro 6.3.8 scaffold via greenfield wipe; renamed master→main on local + origin; snapshotted pre-wipe resume data and assets for Phase 2/3 consumption — all in one rollup commit (30f8cab).**

## Performance

- **Duration:** ~75 min total (Task 1 + Task 2 verify + Task 3 partial + auth re-login + Task 3 completion + Task 4)
- **Started:** 2026-05-26T20:47:39Z (Phase 01 execution started per STATE.md)
- **Completed:** 2026-05-26T~17:30 local (approx — final commit was `30f8cab`)
- **Tasks:** 4 (1 checkpoint + 3 auto)
- **Files modified:** ~420 (346 .claude/ files newly committed, 26 snapshot files, ~10 wipe deletions, ~7 scaffold additions, 4 root-file mutations)

## Accomplishments

- **Greenfield wipe** of the CRA tree honored CONTEXT.md D-02: only `public/Rashmil_Panchani.pdf` survived in `public/`; `src/` was fully cleared (then refilled by the Astro scaffold).
- **Branch rename** `master` → `main` propagated to origin; `origin/master` deleted; `origin/gh-pages` (the live-site branch) deliberately untouched per CONTEXT.md D-spec and RESEARCH.md Pitfall H — Phase 5 owns the GitHub default-branch flip.
- **Pre-wipe snapshot** of resume data (≈8.4 MB, 26 files) captured to `.planning/snapshots/m1-source/` and committed alongside the wipe — Phase 2's content layer and Phase 3's image migration both depend on this snapshot.
- **`.claude/` directory** (the GSD workflow tree — agents, commands, hooks, references, templates, workflows — 346 files) committed for the first time, surviving the wipe via the rollup commit (D-05).
- **Single lockfile invariant** (FOUND-07 progress): `yarn.lock` deleted before the Astro install ran, so `package-lock.json` is the sole lockfile.
- **Astro build proven green**: `npm run build` exited 0 and produced `dist/index.html` (Astro "Welcome" placeholder), satisfying the Plan Task 4 Step C acceptance check.

## Task Commits

This plan deviated from the per-task-commit default per **CONTEXT.md D-04** (single rollup commit for wipe + scaffold + snapshot + `.claude/`):

1. **Task 1: Snapshot pre-wipe source + stage .claude/** — staged, not committed (per D-04)
2. **Task 2: Human-verify checkpoint** — operator approval, no commit
3. **Task 3: Branch rename + yarn.lock + CRA wipe** — staged deletions, not committed (per D-04)
4. **Task 4: Astro scaffold + rollup commit + push** — `30f8cab` (`chore(01): greenfield wipe to Astro 6 scaffold...`)

**Rollup commit:** `30f8cab` (single commit covers Tasks 1+3+4)
**Plan metadata commit:** (to follow this SUMMARY)

## Files Created/Modified

### Created
- `astro.config.mjs` — Astro 6 config skeleton, `defineConfig({})` (Plan 02 wires React + Tailwind + site URL)
- `tsconfig.json` — extends `astro/tsconfigs/strict` (Plan 02 tightens to `strictest` per CONTEXT.md D-10)
- `src/pages/index.astro` — Astro "Welcome" template page (Plan 03 replaces with the 8-section composition)
- `public/favicon.svg` — Astro default (kept; matches BaseHead `<link rel="icon" href="/favicon.svg">` per D-13)
- `package-lock.json` — fresh Astro lockfile, 255 packages
- `.planning/snapshots/m1-source/resumeData.json` — pre-wipe verbatim copy
- `.planning/snapshots/m1-source/assets/{22 files}` — pre-wipe project image set
- `.planning/snapshots/m1-source/{favicon.ico,logo192.png,logo512.png}` — pre-wipe favicon set
- `.claude/{346 files}` — GSD workflow tree, first commit

### Modified
- `package.json` — CRA shape → Astro shape: kept `private: true` + `homepage`, dropped `eslintConfig` + `browserslist` + CRA scripts + react-* deps, set `name: "rashmil-portfolio"`
- `.gitignore` — appended `.astro/`, `.env.production`, `.idea/` entries (preserved all existing language-specific blocks)
- `.planning/STATE.md` — execution-started annotation by the orchestrator
- `.planning/config.json` — added `use_worktrees: false`

### Deleted
- `src/{App.css, App.js, App.test.js, components/, index.css, index.js, logo.svg, resumeData.json, serviceWorker.js, setupTests.js, assets/}` — full CRA src tree
- `public/{CNAME, favicon.ico, favicon.png, index.html, logo192.png, logo512.png, manifest.json, robots.txt}` — full CRA public set (except `Rashmil_Panchani.pdf`)
- `yarn.lock` — dual-lockfile violation per FOUND-07

## Decisions Made

- **`package.json` name**: chose `"rashmil-portfolio"` (Option A from the entry-time plan). The CRA original `"new-resume"` was a year-old placeholder. Package is `"private": true`, so no registry implications.
- **`.gitignore` merge strategy**: appended an Astro block at the end of the existing file rather than replacing it. The original `.gitignore` covers Java, Node, Python, C, Go, Jekyll, MacOS — none of which are wrong to keep around even though only the Node + MacOS entries are load-bearing for the new stack. Surgical-Changes principle from `.claude/CLAUDE.md`.
- **`README.md` left as-is**: the CRA-era README is still at the repo root. PATTERNS.md "Greenfield Note" classifies `README.md` as "mutated not deleted" — but the mutation belongs to Plan 05 (Phase 5 CLEAN-* + README-*), not here. Phase 1 does not delete or rewrite it.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] create-astro@5.0.6 mis-parsed `--typescript strict` as a positional directory name**

- **Found during:** Task 4 (Astro scaffold invocation)
- **Issue:** `npm create astro@latest -- --template minimal --typescript strict --install --no-git --skip-houston .` was expected to scaffold into `.` (repo root). Instead, `create-astro@5.0.6` printed `◼ dir Using --typescript as project directory` and created the scaffold under `./--typescript/`, leaving the repo root untouched.
- **Fix:** Manually relocated scaffold contents (`src/`, `astro.config.mjs`, `tsconfig.json`, `public/favicon.svg`, `.vscode/`) from `./--typescript/` to the repo root. Recovered the Astro `package.json` template by re-running the scaffold against `/tmp/astro-recover/--typescript/` and copying it back. Wrote the final `package.json` manually with the scrubbed shape (no CRA residue, no engines.node, no lint-staged).
- **Files modified:** `package.json` (rewritten by hand), `package-lock.json` (replaced with recovered Astro lockfile), plus all the moved-from-`--typescript`/ files
- **Verification:** `npm run build` exits 0 and produces `dist/index.html`. `grep '"astro"' package.json` returns the dep + the script.
- **Committed in:** `30f8cab` (the rollup commit)

**2. [Rule 3 - Blocking] Tracked CRA leftovers outside the plan's explicit wipe list**

- **Found during:** Task 3 (CRA wipe execution)
- **Issue:** After deleting the plan's explicit file list, `git ls-files src public` still returned five tracked CRA files: `src/App.js`, `src/App.test.js`, `src/index.css`, `src/logo.svg`, `public/favicon.png`. These were not in Plan 01-01's `<files>` block but their presence would violate CONTEXT.md D-02's intent ("src/ and public/ are emptied except `public/Rashmil_Panchani.pdf`").
- **Fix:** `git rm` on all five files.
- **Files modified:** removed `src/App.js`, `src/App.test.js`, `src/index.css`, `src/logo.svg`, `public/favicon.png`
- **Verification:** `find src public -type f | sort` returns only `public/Rashmil_Panchani.pdf`.
- **Committed in:** `30f8cab` (the rollup commit)

### Authentication Gates (not deviations)

**Auth gate at Task 3 push step (FIRST EXECUTOR SESSION)**

- **Found during:** Task 3 Step A (`git push -u origin main`)
- **Issue:** HTTPS authentication failed — git keychain credentials had expired.
- **Fix:** Operator (user) ran `gh auth login` and confirmed re-auth via `gh auth status`. A continuation agent (THIS session) was spawned to resume from the failed push.
- **Outcome:** `git push -u origin main` succeeded immediately on resume; `origin/master` deleted; remainder of Task 3 + Task 4 completed in this session.

---

**Total deviations:** 2 auto-fixed (both Rule 3 — blocking) + 1 auth gate (not a deviation)
**Impact on plan:** All auto-fixes were necessary to honor CONTEXT.md decisions (D-02 wipe scope, Astro scaffold correctness). No scope creep. No architectural changes (Rule 4 not triggered).

## Issues Encountered

- The `create-astro` CLI's flag parsing is order-sensitive in v5.0.6 — see Deviation #1. Future plans that invoke `create-astro` should either omit `--typescript` (let it prompt) or use the unambiguous form `npm create astro@latest <dirname> -- --template minimal --install --no-git --skip-houston` and then move files. Captured here so Plan 02 doesn't repeat the same mistake if it ever re-invokes the scaffold.

## Self-Check

- **Snapshot files exist (5 of 5 spot-checked):** `.planning/snapshots/m1-source/resumeData.json` ✓, `.planning/snapshots/m1-source/assets/profilepic.jpg` ✓, `.planning/snapshots/m1-source/favicon.ico` ✓, `.planning/snapshots/m1-source/logo192.png` ✓, `.planning/snapshots/m1-source/logo512.png` ✓
- **Astro scaffold exists:** `astro.config.mjs` ✓, `tsconfig.json` ✓, `src/pages/index.astro` ✓, `package.json` ✓, `package-lock.json` ✓
- **Wipe survivor:** `public/Rashmil_Panchani.pdf` ✓
- **Wipe targets gone:** `yarn.lock` ✓, `src/components/` ✓, `public/CNAME` ✓
- **Branch state:** local `main` ✓, upstream `origin/main` ✓, `origin/master` deleted ✓, `origin/gh-pages` intact ✓
- **Rollup commit:** `30f8cab` exists on `main` and on `origin/main` ✓
- **Build:** `npm run build` exits 0, produces `dist/index.html` ✓

## Self-Check: PASSED

## User Setup Required

None — no external service configuration required. Phase 5 will handle the GitHub Pages source switch and default-branch flip.

## Next Phase Readiness

- **Plan 02 (configuration tightening + React + Tailwind + tooling):** READY. Has a working Astro 6.3.8 baseline to layer integrations onto.
- **Plan 03 (smoke test + sections + hydration fixture):** READY after Plan 02. Will consume the same snapshot for `id="..."` derivation and the `.planning/snapshots/m1-source/` assets for Phase 3 STYLE work.
- **Blockers/concerns:**
  - `engines.node` is not yet pinned in `package.json` (deferred to Plan 02 per CONTEXT.md Task 4 Step B). Repo currently runs on whatever Node the operator has installed; constraint document still says Node 22 LTS.
  - `README.md` is still the CRA-era version. Plan 05 owns the rewrite.
- **Snapshot consumption note for Phase 2:** the `resumeData.json` `links[]` array hard-codes `"#experience"` whereas the Phase 1 stubs (in Plan 03) will use `id="work"` per CONTEXT.md D-23. Phase 2 must re-derive nav links from typed Content Collections rather than the legacy `links[]` array — see PATTERNS.md "Side-effect of the divergence" note.

---
*Phase: 01-foundation*
*Completed: 2026-05-26*
