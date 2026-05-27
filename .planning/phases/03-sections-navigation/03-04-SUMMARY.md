---
phase: 03-sections-navigation
plan: 04
subsystem: components
tags:
    [
        education,
        work,
        leadership,
        list-collection,
        getCollection,
        astro-content,
        flat-row-layout,
        markdown-body,
        Content-component,
        draft-predicate,
        text-muted,
    ]

requires:
    - phase: 03-sections-navigation
      plan: 01
      provides: 'Astro 6 Content Layer wiring + astro:content render() helper available'
    - phase: 03-sections-navigation
      plan: 02
      provides: 'global.css with .text-muted, .subheading, .resume-section, .resume-section-content rules consumed by all three components'
provides:
    - 'src/components/Education.astro filled with draft-predicate-filtered + order-sorted list-collection read + 3 flat-row entries (name h3 + degree subheading + optional score paragraph + <Content /> body in left column; graduated date span in right column with .text-muted) + conditional last-row mb-5 + trailing hr (D-03)'
    - 'src/components/Work.astro filled with same skeleton; reads work collection; 2 flat-row entries (title h3 + company subheading + <Content /> body; duration in right column); no score field; id="work" + heading "Work" per Phase 1 D-23 + Phase 2 D-24 canonical lock; trailing hr (D-03)'
    - 'src/components/Leadership.astro filled with same skeleton; reads leadership collection; 1 flat-row entry (title h3 + org subheading + <Content /> body; duration in right column); trailing hr (D-03)'
affects:
    [03-06-cdn-strict-gate]

tech-stack:
    added: []
    patterns:
        - 'List-collection flat-row pattern (RESEARCH.md Pattern 1): getCollection(name, draft-predicate) → sort by data.order ASC → Promise.all over render(entry) to pre-compute <Content /> components → map each entry to a flex flex-col md:flex-row md:justify-between row with conditional last-row mb-5 → terminate section with <hr class="m-0 border-black/10" />'
        - 'Shared Phase 2 D-05 draft predicate: ({ data }) => import.meta.env.PROD ? !data.draft : true — drafts visible in dev, hidden in production; reused verbatim across all 3 components'
        - 'Optional-field rendering with && short-circuit: {entry.data.score && <p>{entry.data.score}</p>} for Education-only score (Work + Leadership schemas omit it); strict tsconfig-safe under noUncheckedIndexedAccess'

key-files:
    created: []
    modified:
        - src/components/Education.astro
        - src/components/Work.astro
        - src/components/Leadership.astro

key-decisions:
    - 'Adopted PATTERNS.md Education / Work / Leadership Astro port templates verbatim — three components share a near-identical 45-line skeleton with field-name swaps as the only structural difference (Education: name/degree/graduated/score; Work: title/company/duration; Leadership: title/org/duration). Zero structural deviation from the planned templates.'
    - 'Tightened the Work.astro comment header to drop the literal word "experience" — the plan body said the comment was tolerated only inside /* ... */ blocks, but the Task 2 inline verify gate `! grep -qiE \\bexperience\\b` was unconditional. Resolved the internal inconsistency by removing the word entirely from line-style `// ...` comments. The Phase 2 D-24 canonical label lock is still preserved in the comment via a non-quoted reference ("canonical id=\"work\" and heading \"Work\"").'
    - 'Conditional last-row class (`id === rendered.length - 1 ? ...without mb-5 : ...with mb-5`) reused verbatim from CRA b537845:src/components/Education.jsx lines 13-30. Leadership has only 1 entry, so the no-mb-5 path triggers immediately — verified produces correct markup with zero `mb-5` on the lone row.'
    - 'Consumed Plan 03-02 helpers (.text-muted, .subheading, .resume-section, .resume-section-content) by class name only — verified `.text-muted { color: var(--color-muted); }` is present in src/styles/global.css at line 168-170 before consuming. Added zero new CSS rules in this plan.'
    - 'Task 4 verification was performed but produced no source diff (build-and-grep verification only) — no commit per the Plan 03-03 precedent; per-task atomic-commit guarantee remains intact across the 3 source-modifying tasks (Tasks 1-3).'

patterns-established:
    - 'Three-component near-identical skeleton: when multiple sections share a flat-row data shape with only field-name differences, copy the skeleton verbatim per component and only swap field names — keeps each component independently auditable and avoids premature abstraction (CLAUDE.md Rule 2 simplicity guard). Future Phase 4/5 work that touches one component will not silently affect the others.'
    - 'Acceptance-criterion semantic-vs-syntactic split: when an inline verify-block grep uses `grep -c` against minified single-line HTML, the count is always 0 or 1 regardless of actual occurrence count. The semantic criterion ("≥5 occurrences of class=\"text-muted\"") was honored via `grep -o ... | wc -l` returning 7; the syntactic `grep -c ... -ge 5` gate is a plan-authoring bug carried forward as a deviation note. Future verify-block authors should standardize on `grep -o | wc -l` for occurrence counting on minified output (the Plan 03-03 author already used this idiom for `aria-hidden="true"` — there is precedent).'

requirements-completed:
    [SECTION-03, SECTION-04, SECTION-07, SECTION-09]

duration: ~4m
completed: 2026-05-27
---

# Phase 3 Plan 04: Education + Work + Leadership Section Components Summary

**Three Phase 1 list-collection stub components filled with real flat-row markup reading from Phase 2 Content Collections: Education (3 entries with optional score), Work (2 entries with markdown body), Leadership (1 entry). All three share an identical 45-line skeleton with only field-name swaps; all three terminate with the standard trailing horizontal-rule element.**

## Performance

- **Duration:** ~4 minutes
- **Tasks:** 4 (3 component fills + 1 build/smoke verification)
- **Files modified:** 3 (`src/components/Education.astro`, `src/components/Work.astro`, `src/components/Leadership.astro`)
- **Lines added:** ~135 net (3 stubs replaced with full implementations: 49/47/47 lines)

## Accomplishments

- **Education.astro (49 lines)** — List `getCollection('education', ({ data }) => import.meta.env.PROD ? !data.draft : true)` read with Phase 2 D-05 draft predicate; `entries.sort((a, b) => a.data.order - b.data.order)`; `Promise.all` over `render(entry).Content` for per-entry rendered markdown bodies; `<h2>Education</h2>`; per-entry flex flat-row with `flex flex-col md:flex-row md:justify-between` (date column right on ≥ md, above on < md per D-22); left column carries `<h3 class="mb-0">{entry.data.name}</h3>`, `<div class="subheading mb-3">{entry.data.degree}</div>`, conditional `{entry.data.score && <p>{entry.data.score}</p>}`, and `<Content />`; right column carries `<span class="text-muted">{entry.data.graduated}</span>`; conditional last-row class drops `mb-5` on the final entry per CRA pattern (`id === rendered.length - 1` ternary); trailing `<hr class="m-0 border-black/10" />` per D-03.
- **Work.astro (47 lines)** — Same skeleton as Education with field-name swaps: `getCollection('work', ...)`, `<h2>Work</h2>`, `<section id="work">`, `{entry.data.title}` (h3), `{entry.data.company}` (subheading), `{entry.data.duration}` (right column); no score field (Work schema omits it). Phase 1 D-23 + Phase 2 D-24 canonical id/label lock honored — file contains zero occurrences of the word "experience" (case-insensitive) at either source-level or in dist/index.html.
- **Leadership.astro (47 lines)** — Same skeleton as Work with field-name swap: `getCollection('leadership', ...)`, `<h2>Leadership</h2>`, `<section id="leadership">`, `{entry.data.org}` (subheading) instead of `company`; `title`/`duration` field names unchanged. Single entry → no-mb-5 ternary path triggers on first iteration (verified — produces correct markup with zero `mb-5` on the lone row).
- **Build verification** — `rm -rf dist .astro && npm run build` exits 0 in ~1.7s; no Iconify-resolution errors (no astro-icon usage in these three components); standard Astro/Vite pipeline produces minified single-line dist/index.html.
- **dist/index.html assertions** — `id="education"` (1 hit), `id="work"` (1 hit), `id="leadership"` (1 hit) each present exactly once per page (single-section-per-page Astro page rendering). `id="experience"` absent (0 hits — Phase 1 D-23 + Phase 2 D-24 canonical lock verified at the rendered-HTML layer). `class="text-muted"` substring appears 7 times in dist/index.html (3 Education + 2 Work + 1 Leadership = 6 expected + 1 from an existing About attribution span; ≥5 semantic floor satisfied). Per-section h3 entry counts: Education → 3, Work → 2, Leadership → 1 (verified via Python regex over each `<section>` block — matches expected entry counts derived from src/content/education/, src/content/work/, src/content/leadership/ directory contents).
- **CDN sweep** — `grep -rE "fontawesome|iconify\.design|devicon\.com|cdnjs\.cloudflare|stackpath|jsdelivr" dist/` exits 1 (zero matches — STYLE-02 / D-29 honored; no regression from Plan 03-03 baseline).
- **No React runtime on sections** — `grep -E "client:(load|visible|idle)" src/components/Education.astro src/components/Work.astro src/components/Leadership.astro` exits 1 (zero hits — SECTION-09 honored).
- **Smoke suite** — `npx vitest run tests/smoke.test.ts` → **5/5 passing** in 2.74s (dist/index.html exists, all 8 section ids present, dist/hydration-test/index.html exists, React JS chunk emitted, `#abc123` marker present in dist/\_astro/\*.css).

## Task Commits

Each task that modified source was committed atomically. Task 4 was verification-only (no source diff, no commit) — same precedent as Plan 03-03 Task 4.

1. **Task 1: Fill Education.astro (3 entries; name/degree/graduated/optional score + Content body)** — `e597eb7` (feat)
2. **Task 2: Fill Work.astro (2 entries; title/company/duration + Content body)** — `d775de2` (feat)
3. **Task 3: Fill Leadership.astro (1 entry; title/org/duration + Content body)** — `5a8690c` (feat)
4. **Task 4: Build + smoke verification — confirm all three sections render, no React/CDN regressions** — no commit (verification-only; produced no source diff)

## Files Created/Modified

- `src/components/Education.astro` — 7 → 49 lines. Stub replaced with full PATTERNS.md Education port.
- `src/components/Work.astro` — 9 → 47 lines. Stub replaced with full PATTERNS.md Work port (field swaps from Education skeleton).
- `src/components/Leadership.astro` — 7 → 47 lines. Stub replaced with full PATTERNS.md Leadership port (field swap from Work skeleton).

## Verification Evidence

**Source-level (after Task 1-3 commits):**

- `wc -l src/components/Education.astro` → 49 (target ≥30 ✓).
- `wc -l src/components/Work.astro` → 47 (target ≥30 ✓).
- `wc -l src/components/Leadership.astro` → 47 (target ≥30 ✓).
- `grep -c "getCollection('education'" src/components/Education.astro` → 1 ✓.
- `grep -c "getCollection('work'" src/components/Work.astro` → 1 ✓.
- `grep -c "getCollection('leadership'" src/components/Leadership.astro` → 1 ✓.
- `grep -cE 'class="m-0 border-black/10"' src/components/Education.astro` → 1 ✓ (trailing rule present per D-03).
- `grep -cE 'class="m-0 border-black/10"' src/components/Work.astro` → 1 ✓.
- `grep -cE 'class="m-0 border-black/10"' src/components/Leadership.astro` → 1 ✓.
- `grep -rE "client:(load|visible|idle)" src/components/Education.astro src/components/Work.astro src/components/Leadership.astro` → exit 1 ✓ (zero hits).
- `grep -qiE '\bexperience\b' src/components/Work.astro` → exit 1 ✓ (zero hits — comment header tightened to drop the literal word entirely).
- Education contains `entry.data.name`, `entry.data.degree`, `entry.data.graduated`, `entry.data.score`, and `<Content />`.
- Work contains `entry.data.title`, `entry.data.company`, `entry.data.duration`, `<Content />`; does NOT reference `entry.data.score`.
- Leadership contains `entry.data.title`, `entry.data.org`, `entry.data.duration`, `<Content />`; does NOT reference `entry.data.company`.
- All three files apply `class="text-muted"` to the right-column date span.
- All three files apply the conditional `id === rendered.length - 1` ternary for the last-row mb-5 swap.
- `grep -qE '\.text-muted\s*\{' src/styles/global.css` → present at line 168-170 (Plan 03-02 cross-plan precondition verified before consumption).

**Build-level (after `rm -rf dist .astro && npm run build`):**

- `npm run build` → exit 0 in ~1.7s (no errors).
- `dist/index.html` contains `id="education"` (1 hit), `id="work"` (1 hit), `id="leadership"` (1 hit).
- `dist/index.html` does NOT contain `id="experience"` (canonical id lock verified at the rendered-HTML layer).
- `grep -o 'class="text-muted"' dist/index.html | wc -l` → 7 (≥5 semantic floor — 3 Education + 2 Work + 1 Leadership = 6 expected from this plan + 1 from a pre-existing About attribution span).
- Per-section h3 counts (Python regex over `<section id="...">...</section>` blocks): Education → 3, Work → 2, Leadership → 1.
- `grep -rE "fontawesome|iconify\.design|devicon\.com|cdnjs\.cloudflare|stackpath|jsdelivr" dist/` → exit 1 (zero CDN refs — STYLE-02 / D-29).
- `npx vitest run tests/smoke.test.ts` → **5/5 tests pass** in 2.74s.

## Decisions Made

- **Adopted PATTERNS.md Education / Work / Leadership ports verbatim.** All three templates derive from the same RESEARCH.md Pattern 1 + CRA b537845:src/components/Education.jsx analogue with explicit field-name swap documentation in PATTERNS.md lines 351-384. No structural deviation needed during execution — each template was pre-verified against the schema in src/content.config.ts (education: name/degree/graduated/score?; work: title/company/duration; leadership: title/org/duration).
- **Three near-identical components, no premature abstraction.** CLAUDE.md Rule 2 (Simplicity First) and Rule 3 (Surgical Changes) both argue against factoring the shared skeleton into a `<ListSection>` helper at this stage — three concrete components are auditable independently, the field-name differences are non-trivial (different schemas, different optional fields), and abstraction would obscure the per-section invariants the Phase 4 a11y audit will need to verify. Defer abstraction unless a fourth list-section appears in Phase 4/5.
- **Work.astro comment header tightened to avoid the literal word "experience".** The plan body said comment-header `experience` references were tolerated inside `/* ... */` blocks, but the Task 2 inline verify gate `! grep -qiE '\bexperience\b'` was unconditional. To pass both gates without ambiguity, the comment was rewritten to reference the canonical id/label directly (`CONTEXT.md D-23 + Phase 2 D-24: canonical id="work" and heading "Work".`) without naming the diverged term. The Phase 2 D-24 canonical lock is still documented for auditors who need it.
- **Cross-plan precondition verified before consumption.** Before consuming `.text-muted` from `global.css`, ran `grep -qE '\.text-muted\s*\{' src/styles/global.css` — present at line 168-170 (Plan 03-02 Task 2 delivered the rule with comment "consumed by Education/Work/Leadership right-column date `<span>`"). No fallback CSS added in this plan.
- **Task 4 verification-only, no commit.** Plan 03-03 SUMMARY explicitly established this precedent ("Task 4: ... — no commit (verification-only; produced no source diff)"). Re-applied here: Task 4 ran the build, the dist-level grep gates, and the smoke suite but produced zero source-tree mutations, so per-task commit guarantee is satisfied across the 3 source-modifying tasks (Tasks 1-3) without a no-op trailing commit.

## Deviations from Plan

### Plan-authoring bugs (Rule 1)

**1. [Rule 1 — Plan Verify Bug] Task 4 inline verify `[ "$(grep -c 'class=\"text-muted\"' dist/index.html)" -ge 5 ]` is wrong on minified single-line HTML.**

- **Found during:** Task 4 build verification.
- **Issue:** `grep -c` counts matching LINES, not occurrences. Astro emits dist/index.html as a single minified line, so `grep -c` returns 0 or 1 regardless of how many `class="text-muted"` substrings the rendered HTML actually contains. With the correct rendering (7 spans across Education + Work + Leadership + a pre-existing About span), the gate as-written returns 1 and fails `-ge 5`.
- **Fix:** Used the semantic counting idiom `grep -o 'class="text-muted"' dist/index.html | wc -l` → 7 ≥ 5 ✓. This is the same idiom the Plan 03-03 author already used for the `aria-hidden="true"` count (Plan 03-03 SUMMARY line 144: `grep -o 'aria-hidden="true"' dist/index.html | wc -l` → 33), so precedent exists in this phase.
- **Files modified:** None — the rendered HTML is correct; only the plan's verify script was buggy.
- **Commit:** N/A (no source change).
- **Forward note:** Phase 3 plan-authoring template should standardize on `grep -o ... | wc -l` for occurrence counting on minified output. Carrying this as a documented deviation, not a code fix.

### Pre-existing carry-forwards (not introduced by this plan)

- The `prettier-plugin-tailwindcss` "file is not a known CSS property" warning during the Vite build pipeline (carried forward from Plan 03-02 SUMMARY deviation 3 and Plan 03-03 SUMMARY "Issues Encountered") — out of scope, build exits 0, no behavior impact.

## Issues Encountered

None beyond the plan-authoring bug above. No authentication gates, no architectural decisions, no blockers, no schema-resolution errors during build. All three components built and rendered on first attempt with the schemas declared in src/content.config.ts.

## User Setup Required

None — fully autonomous plan, no external service configuration.

## Next Plan Readiness

- **Plan 03-05 (Wave 3 — Projects with images):** Can use the same `getCollection(name, ({ data }) => import.meta.env.PROD ? !data.draft : true)` pattern this plan established. Can use the same `Promise.all` over `render(entry).Content` for per-entry markdown body rendering. Can use the same `<hr class="m-0 border-black/10" />` trailing-rule shape. Layers `image()` schema + `.project-card:nth-child(even)` alternating-row CSS (already in global.css per Plan 03-02) on top of this skeleton.
- **Plan 03-06 (CDN strict gate + scroll-spy + sidebar):** The IntersectionObserver scroll-spy needs all 8 section ids present in dist/index.html. After this plan, 6 of the 8 are now wired: `about`, `skills`, `testimonials` (Plan 03-03), `education`, `work`, `leadership` (this plan). Plan 03-05 (Projects) and the existing `sidenav` stub deliver the remaining 2. The CDN strict gate already passes at this point.
- **Phase 4 (SEO/meta):** All 8 section components will be wired by end of Phase 3 Wave 3; Phase 4's `<BaseHead>` work can read finalized resume content via the same Content Layer collections this plan demonstrated. Phase 4 a11y audit can now verify the full document heading hierarchy (`<h1>` from About → `<h2>` per section → `<h3>` per list-section entry).

No blockers for Wave 3 continuation. Education + Work + Leadership render real content from typed Content collections; build is green; smoke suite is green; zero CDN refs; zero React hydration on section components; canonical id/label lock honored.

## Self-Check: PASSED

Verified after writing this SUMMARY:

- `[ -f src/components/Education.astro ]`: FOUND
- `[ -f src/components/Work.astro ]`: FOUND
- `[ -f src/components/Leadership.astro ]`: FOUND
- `git log --oneline | grep e597eb7`: FOUND (Task 1)
- `git log --oneline | grep d775de2`: FOUND (Task 2)
- `git log --oneline | grep 5a8690c`: FOUND (Task 3)
- `wc -l src/components/Education.astro` → 49 ≥ 30: PASSED
- `wc -l src/components/Work.astro` → 47 ≥ 30: PASSED
- `wc -l src/components/Leadership.astro` → 47 ≥ 30: PASSED
- `grep -q "getCollection('education'" src/components/Education.astro`: PASSED
- `grep -q "getCollection('work'" src/components/Work.astro`: PASSED
- `grep -q "getCollection('leadership'" src/components/Leadership.astro`: PASSED
- `grep -qE 'class="m-0 border-black/10"' src/components/Education.astro`: PASSED
- `grep -qE 'class="m-0 border-black/10"' src/components/Work.astro`: PASSED
- `grep -qE 'class="m-0 border-black/10"' src/components/Leadership.astro`: PASSED
- `! grep -rE "client:(load|visible|idle)" src/components/Education.astro src/components/Work.astro src/components/Leadership.astro`: PASSED
- `! grep -qiE '\bexperience\b' src/components/Work.astro`: PASSED (zero hits)
- `npm run build` exits 0: PASSED
- `grep -q 'id="education"' dist/index.html`: PASSED
- `grep -q 'id="work"' dist/index.html`: PASSED
- `grep -q 'id="leadership"' dist/index.html`: PASSED
- `! grep -q 'id="experience"' dist/index.html`: PASSED
- `grep -o 'class="text-muted"' dist/index.html | wc -l` → 7 ≥ 5: PASSED
- `grep -rE "fontawesome|iconify\.design|devicon\.com|cdnjs\.cloudflare|stackpath|jsdelivr" dist/` exits 1: PASSED
- `npx vitest run tests/smoke.test.ts` → 5/5: PASSED

---

_Phase: 03-sections-navigation_
_Completed: 2026-05-27_
