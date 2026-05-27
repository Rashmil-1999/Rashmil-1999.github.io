---
phase: 03-sections-navigation
plan: 02
subsystem: styles
tags:
    [
        tailwind-v4,
        '@theme',
        fontsource,
        saira-extra-condensed,
        mulish,
        smooth-scroll,
        prefers-reduced-motion,
        sidebar-layout,
        nav-link,
        social-icon,
        alternating-row,
    ]

requires:
    - phase: 03-sections-navigation
      plan: 01
      provides: '@fontsource/saira-extra-condensed and @fontsource/mulish packages on disk so per-weight @import statements resolve at build; astro-icon integration wired so Wave 3 sections can <Icon>; trailingSlash=always; BaseHead.astro freed of Google Fonts preconnects (D-36)'
provides:
    - 'src/styles/global.css populated with @theme tokens (5 brand colors + --color-muted alias + 2 font tokens), 6 Fontsource per-weight @imports, body/heading base rules, smooth-scroll + prefers-reduced-motion guard (NAV-02), .subheading, .lead, .resume-section + .resume-section-content, sidebar layout media queries at 768px (D-10), .nav-link + .nav-link[aria-current=page] 3-signal active state (D-12), .profile-pic, .text-primary accent span, .btn-primary (D-27 accent reconciliation), .text-muted, .social-icon + :hover (D-26), and .project-card:nth-child(even) flex-row-reverse alternating-row fallback (D-15 / A5)'
    - 'Fontsource .woff2 files emitted into dist/_astro/ (26 distinct subset/weight combinations — far exceeds the >=6 plan threshold)'
    - 'Tailwind v4 marker #abc123 still present in dist/_astro/BaseLayout.*.css after clean build (no Pitfall 29 regression)'
affects:
    [
        03-03-sidenav-and-about,
        03-04-list-sections,
        03-05-projects-and-images,
        03-06-cdn-strict-gate,
        04-seo-and-meta,
    ]

tech-stack:
    added: []
    patterns:
        - 'Tailwind v4 CSS-first @theme block (D-02): brand tokens declared once in global.css; no tailwind.config.js'
        - 'Fontsource self-hosted per-weight @import pattern (D-33/D-34): 2 Saira weights + 4 Mulish weights; static (NOT variable) per Plan 03-01 carry-forward'
        - 'D-12 3-signal active state via `aria-current="page"` attribute selector — set later by Plan 03-06 IntersectionObserver, styled now with accent text + 4px accent left border + 800 weight'
        - 'D-10 desktop sidebar breakpoint widened from CRA 992px to Tailwind md (768px) with recovered 19rem width preserved'
        - 'D-27 .btn-primary accent reconciliation: UI-SPEC accent (#bd5d38) wins over recovered CRA navy (#123c69); choice documented as inline source comment'
        - 'D-15 alternating-row CSS fallback: pre-adds plain CSS rule so Plan 03-05 does NOT branch on the Tailwind v4 arbitrary-variant emit (Assumption A5 hardening)'

key-files:
    created: []
    modified:
        - src/styles/global.css

key-decisions:
    - 'Adopted RESEARCH.md Pattern 8 (lines 786-948) verbatim for the @theme + base + smooth-scroll block, then extended with the recovered .resume-section / sidebar / nav-link / profile-pic / .text-primary / .btn-primary rules — values sourced directly from `git show b537845:src/App.css` (D-06 recovery)'
    - 'D-27 reconciliation: .btn-primary uses --color-accent (#bd5d38), NOT recovered CRA navy (#123c69). PATTERNS.md "CRA-RECOVERY DELTA" flags the discrepancy; UI-SPEC + D-27 prescribe accent. Choice annotated with an inline source comment so the deviation is auditable.'
    - 'Added 3 recovered helpers BEYOND the strict @theme scope so Wave 3 plans never branch on a missing class: `.text-muted` (Education/Work/Leadership date span), `.social-icon` + `:hover` (D-26 About anchors), `.project-card:nth-child(even) flex-direction: row-reverse` inside @media (min-width: 768px) (D-15 / A5 belt-and-suspenders). Each annotated with the consuming plan + source rationale.'
    - 'Did NOT add `--color-primary` to @theme — preserved CRA visible class name `.text-primary` via a manual rule keyed off `--color-accent` (Research Open Question 4 resolution).'
    - 'Did NOT add `--spacing-*` tokens — Tailwind v4 default 4-based scale covers every recovered rem value (D-02 explicit allowance).'
    - 'Did NOT override <hr> border color globally — Wave 3 markup uses `<hr class="m-0 border-black/10" />` per Pitfall A; broader `--default-border-color` blast radius rejected (Research Open Question 3).'

patterns-established:
    - 'Plan-as-CSS-orphan-closer: this wave 2 plan pre-adds three helper rules (.text-muted, .social-icon, alternating-row) that Wave 3 section components reference, so Wave 3 never edits global.css conditionally. Reduces inter-plan re-edit risk.'
    - 'D-NN-citing inline comments: every non-trivially-recovered rule carries an inline source comment naming the D-NN it implements (D-12 nav active, D-15 alternating row, D-26 social-icon, D-27 btn-primary reconciliation). Future plan readers can trace any rule to the locked decision in one grep.'
    - 'Mandated documentation comments inflate the line count beyond the plan target — that is expected when the plan explicitly requires inline source comments for auditable choices. Target line ranges should be treated as guidance, not hard gates.'

requirements-completed: [STYLE-01, STYLE-04, NAV-02]

duration: 3m 49s
completed: 2026-05-27
---

# Phase 3 Plan 02: Tailwind v4 brand tokens + Fontsource self-hosting + sidebar/section CSS

**`src/styles/global.css` filled (9 → 196 lines) with @theme brand tokens, 6 Fontsource per-weight imports, recovered .resume-section / sidebar / .nav-link / .btn-primary / .text-muted / .social-icon / alternating-row classes — Wave 3 section components can now reference these by name with no conditional fallbacks.**

## Performance

- **Duration:** ~3m 49s
- **Started:** 2026-05-27T04:31:49Z
- **Completed:** 2026-05-27T04:35:38Z
- **Tasks:** 3 (2 committed + 1 verification-only)
- **Files modified:** 1 (`src/styles/global.css`)

## Accomplishments

- Replaced the Phase-1 `@theme {}` placeholder with 5 recovered CRA brand color tokens (`--color-bg: #eee2dc`, `--color-text: #6c757d`, `--color-accent: #bd5d38`, `--color-link: #123c69`, `--color-link-hover: #123c69ad`) + the `--color-muted: #6c757d` semantic alias + 2 font tokens (`--font-heading`, `--font-body`).
- Wired 6 Fontsource per-weight `@import`s (Saira 500/700 + Mulish 400/400i/800/800i) — locked weight set per D-34.
- Added `body`, `h1–h6`, and `h1` base rules; added `html { scroll-behavior: smooth }` with a `prefers-reduced-motion: reduce` guard (NAV-02 / D-32).
- Added the recovered semantic classes Wave 3 needs: `.subheading` (1.5rem), `.lead` (1.15rem), `.resume-section` (75rem max-width, mobile 5rem 1rem / desktop 5rem 3rem, 100vh min-height ≥768px), `.resume-section-content` (width 100%), `.nav-link` + `.nav-link[aria-current='page']` (3-signal active per D-12), `.profile-pic` (200×225), `.text-primary` (accent), `.btn-primary` (D-27-reconciled accent), `.text-muted`, `.social-icon` + `:hover` (D-26), `.project-card:nth-child(even) flex-direction: row-reverse` inside `@media (min-width: 768px)` (D-15 / A5).
- Sidebar layout: fixed 19rem at ≥768px with body `padding-left: 19rem`; sticky top with body `padding-top: 3.375rem` at <768px (D-10 widening from CRA 992px).
- Clean rebuild emitted **26 Fontsource .woff2 files** into `dist/_astro/` (latin / latin-ext / vietnamese / cyrillic / cyrillic-ext subsets × 6 weights). Plan threshold was ≥6.
- Tailwind v4 marker `#abc123` still present in `dist/_astro/BaseLayout.DV1NkKH4.css` (no Pitfall 29 regression).
- Zero Google Fonts URLs anywhere in `dist/`; strict CDN sweep over `fontawesome|iconify\.design|devicon\.com|cdnjs|stackpath|jsdelivr|fonts\.googleapis|fonts\.gstatic` returns zero matches (stronger than Plan 03-01's scoped gate; Plan 03-06 Task 3 still owns the formal final gate after Wave 3 content lands).
- Phase 1 smoke suite (`tests/smoke.test.ts`) — 5/5 tests pass.

## Task Commits

Each task that modified source was committed atomically. Task 3 was verification-only — no source diff, no commit.

1. **Task 1: Fill global.css with Fontsource imports + @theme tokens + base body/heading + smooth-scroll guard** — `15868d9` (feat)
2. **Task 2: Add recovered .resume-section + .subheading + .lead + sidebar layout + .nav-link + .profile-pic + .text-primary + .btn-primary + .text-muted + .social-icon + alternating-row CSS** — `f07531b` (feat)
3. **Task 3: Build verification — confirm Fontsource .woff2 files land in dist, marker remains, no Google Fonts request** — no commit (verification-only; produced no source diff)

## Files Created/Modified

- `src/styles/global.css` — 9 → 196 lines. Replaced empty `@theme {}` placeholder with full Pattern 8 block + extended with recovered semantic helpers. No other files touched.

## Verification Evidence

**Source-level (after Task 2 commit):**

- `wc -l src/styles/global.css` → 196 (plan range 95-130 — exceeded due to mandated D-NN-citing inline comments; see Deviations below).
- `grep -c "^@import '@fontsource" src/styles/global.css` → 6 ✅ (matches D-34 locked weight set).
- `grep -c "^\s*--color-" src/styles/global.css` → 6 (5 brand + 1 muted alias; matches @theme spec).
- `grep -c "prefers-reduced-motion: reduce" src/styles/global.css` → 1 ✅ (NAV-02).
- `grep -c "min-width: 768px" src/styles/global.css` → 3 ✅ (.resume-section min-height + sidebar layout + project-card alternating).
- `grep -q "D-27 reconciliation" src/styles/global.css` → present ✅ (auditable decision trail).

**Build-level (after `rm -rf dist .astro && npm run build`):**

- `npm run build` → exit 0; both `dist/index.html` and `dist/hydration-test/index.html` generated.
- `find dist/_astro -name 'saira-extra-condensed-*.woff2'` → **6 files** (latin/latin-ext/vietnamese × 500/700 — far exceeds plan threshold of ≥2).
- `find dist/_astro -name 'mulish-*.woff2'` → **20 files** (latin/latin-ext/vietnamese/cyrillic/cyrillic-ext × 400/400i/800/800i — far exceeds plan threshold of ≥4).
- `find dist -name '*.woff2' | wc -l` → **26 files total**.
- `grep -l '#abc123' dist/_astro/*.css` → `dist/_astro/BaseLayout.DV1NkKH4.css` ✅ (Phase 1 smoke assertion #5 still passes — no Pitfall 29 regression).
- `grep -rE "fonts\.googleapis\.com|fonts\.gstatic\.com" dist/` → exits 1 (zero matches) ✅ (D-36 still honored post-rebuild).
- `grep -rE "fontawesome|iconify\.design|devicon\.com|cdnjs|stackpath|jsdelivr|fonts\.googleapis|fonts\.gstatic" dist/` → exits 1 (zero matches — strict sweep clean; formal final gate remains Plan 03-06 Task 3 after Wave 3 content lands).
- `npx vitest run tests/smoke.test.ts` → exit 0; **5/5 tests pass** (emits dist/index.html ✓; all 8 section ids present ✓; emits hydration-test/index.html ✓; emits a React JS chunk ✓; emits Tailwind marker ✓).

## Decisions Made

- **Adopted RESEARCH.md Pattern 8 (lines 786-948) verbatim** for the @theme + base + smooth-scroll block. Values match `git show b537845:src/App.css` (D-06 recovery — pre-Phase-1 wipe parent commit).
- **.btn-primary uses accent, NOT recovered CRA navy** (D-27 reconciliation). PATTERNS.md "CRA-RECOVERY DELTA" flags `git show b537845:src/App.css` line 2688-2691 as `background-color: #123c69` (navy). UI-SPEC + D-27 prescribe accent per "refresh same vibe" modernization. Choice annotated with `/* D-27 reconciliation: UI-SPEC accent (#bd5d38), NOT recovered CRA navy (#123c69) */` inline comment.
- **Pre-added `.text-muted` rule (not relying on Tailwind v4 auto-generating it from `--color-muted`)** so Plan 03-04 (Education/Work/Leadership) does NOT branch on whether the auto-gen happened. The CSS file unambiguously contains `.text-muted { color: var(--color-muted); }`.
- **Pre-added `.social-icon` 3.5rem rounded-circle rule** (D-26) so Plan 03-03 (About) does NOT have a conditional fallback. RESEARCH.md "Recovered CRA Tokens" line ~10550 sourced the 3.5rem dimension; the visible glyph color treatment is delegated to `<Icon>` inside the anchor.
- **Pre-added the `.project-card:nth-child(even) { flex-direction: row-reverse; }` CSS rule inside `@media (min-width: 768px)`** as a belt-and-suspenders fallback for Plan 03-05's Tailwind v4 arbitrary variant `md:[&:nth-child(even)]:flex-row-reverse` (Assumption A5). Both paths resolve to the same selector + property; when both apply the result is identical.
- **Did NOT add `--color-primary`** — preserved CRA visible class name `.text-primary` via a manual rule keyed off `--color-accent` (Research Open Question 4 resolution).
- **Did NOT add `--spacing-*` tokens** — Tailwind v4 default 4-based scale covers every recovered rem value (D-02 explicit allowance).
- **Did NOT override `<hr>` border globally** — Wave 3 markup will use `<hr class="m-0 border-black/10" />` (Pitfall A); the wider `--default-border-color` blast radius was rejected per Research Open Question 3.

## Deviations from Plan

### Acknowledged scope expansion (already approved in the plan body)

**1. [Rule 2 — Auto-add missing critical functionality] `.text-muted`, `.social-icon` + `:hover`, and `.project-card:nth-child(even)` alternating-row CSS added beyond a strict @theme + base scope.**

- **Found during:** Task 2 (the plan body explicitly mandates these three rules be added here; they appear in the Task 2 action list as items 11, 12, 13).
- **Why this is documented as a deviation despite being plan-mandated:** PATTERNS.md / UI-SPEC.md / RESEARCH.md's Pattern 8 CSS block (lines 786-948) stops short of these three rules; the plan's Task 2 action body explicitly extends Pattern 8 with them to close Wave 3 orphan-class risks (Plan 03-03 About social anchors, Plan 03-04 list-section date spans, Plan 03-05 alternating row). Documenting as a deviation against Pattern 8 (the upstream research source) for full auditability.
- **Files modified:** `src/styles/global.css` (one block per rule with inline source comment).
- **Commit:** `f07531b`.

### Line-count overrun

**2. [Rule 3 — Auto-fix blocking issue: documentation completeness] `src/styles/global.css` final length is 196 lines (plan target range: 95-130).**

- **Found during:** Task 2 verification.
- **Why:** Task 2 action mandates several inline D-NN-citing source comments (D-27 reconciliation, D-26 source attribution, D-15 belt-and-suspenders, D-10 breakpoint widening, D-12 3-signal active). These multi-line comments inflate the line count beyond the original target. The plan's `min_lines: 90` floor is satisfied; the upper-bound "95-130" is a guidance range, not a hard verification gate (no automated check enforces it).
- **Fix considered:** Strip the inline comments to bring line count under 130. **Rejected:** the plan's acceptance criteria explicitly require these comments ("Source: file contains inline comment near `.btn-primary` documenting the D-27 reconciliation"; "Inline comment: `/* D-26: ... */`"; "Inline comment: `/* D-15 alternating row direction: ... */`"). Removing them would fail the acceptance check.
- **Files modified:** none (no fix applied — documenting the size as expected given mandated comments).

### Pre-existing build warnings (out of scope)

**3. [Out-of-scope deferred] Tailwind CSS build warnings about `file:N` / `file:line` / `file:lines` not being known CSS properties.**

- **Found during:** Task 3 `npm run build` output.
- **Why this is not a Plan 03-02 fix:** These warnings are pre-existing (Plan 03-01 SUMMARY explicitly flagged them as carried-forward from Phase 1's Tailwind v4 bundle pipeline emitting variant selectors from `prettier-plugin-tailwindcss` or earlier prep work). Build still exits 0. Per execution scope-boundary rule, pre-existing warnings unrelated to the current task's changes are out of scope.
- **Action:** None (do not re-fix).

## Issues Encountered

None. All 3 tasks executed without authentication gates, blockers, or architectural surprises.

The npm `EBADENGINE` warning for `vitest@4.1.7` requiring Node `^20.0.0 || ^22.0.0 || >=24.0.0` while local Node is `v23.9.0` is pre-existing (carried from Phase 1 Plan 01-05); not caused by this plan.

## User Setup Required

None — fully autonomous plan, no external service configuration.

## Next Phase Readiness

- **Plan 03-03 (Wave 3 — SideNav + About):** Can reference `.profile-pic`, `.subheading`, `.lead`, `.text-primary`, `.btn-primary`, `.social-icon`, `.nav-link`, sidebar layout media queries by class name with zero conditional fallbacks. `<h1>{first}<span class="text-primary">{last}</span>` resolves the accent span; `<a class="social-icon">` resolves the rounded-circle treatment; `<a class="btn-primary" download>` resolves the accent CTA.
- **Plan 03-04 (Wave 3 — list sections Education/Work/Leadership):** Can reference `.text-muted` for the right-column date span; `.subheading` for the degree/title/role text; `.resume-section` + `.resume-section-content` as the section wrapper pair.
- **Plan 03-05 (Wave 3 — Projects):** Can use both the Tailwind v4 arbitrary variant `md:[&:nth-child(even)]:flex-row-reverse` AND rely on the `@media (min-width: 768px) { .project-card:nth-child(even) { flex-direction: row-reverse; } }` fallback. If the variant fails to emit (LOW-risk per A5), the CSS rule still provides correct behavior with no Plan 03-05 re-edit.
- **Plan 03-06 (CDN strict gate + scroll-spy):** The IntersectionObserver script can set `aria-current="page"` on `<a class="nav-link">` and the 3-signal active state (accent text + accent left border + 800 weight) is already wired via `.nav-link[aria-current='page']`.

No blockers for Wave 3. Brand tokens are centralized; sidebar layout is wired; all consuming helper classes exist; clean build emits all Fontsource weights as expected; marker preserved; zero CDN font references.

## Self-Check: PASSED

Verified after writing this SUMMARY:

- `[ -f src/styles/global.css ]`: FOUND
- `git log --oneline | grep 15868d9`: FOUND (Task 1)
- `git log --oneline | grep f07531b`: FOUND (Task 2)
- `grep -q "@import 'tailwindcss';" src/styles/global.css`: PASSED
- `grep -c "^@import '@fontsource" src/styles/global.css == 6`: PASSED
- `grep -q -- "--color-bg: #eee2dc" src/styles/global.css`: PASSED
- `grep -q -- "--color-accent: #bd5d38" src/styles/global.css`: PASSED
- `grep -q "prefers-reduced-motion: reduce" src/styles/global.css`: PASSED
- `grep -qE "\.nav-link\[aria-current='page'\]" src/styles/global.css`: PASSED
- `grep -q "D-27 reconciliation" src/styles/global.css`: PASSED
- `find dist/_astro -name 'saira-extra-condensed-*.woff2' | wc -l >= 2`: 6 — PASSED
- `find dist/_astro -name 'mulish-*.woff2' | wc -l >= 4`: 20 — PASSED
- `grep -l '#abc123' dist/_astro/*.css`: `dist/_astro/BaseLayout.DV1NkKH4.css` — PASSED
- `! grep -rE 'fonts\.googleapis\.com|fonts\.gstatic\.com' dist/`: zero matches — PASSED
- `npx vitest run tests/smoke.test.ts`: 5/5 tests pass — PASSED

---

_Phase: 03-sections-navigation_
_Completed: 2026-05-27_
