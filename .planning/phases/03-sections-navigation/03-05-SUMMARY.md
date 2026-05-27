---
phase: 03-sections-navigation
plan: 05
subsystem: components
tags:
    [
        projects,
        astro-image,
        astro-content,
        alternating-row,
        stretched-link,
        external-link-safety,
        widths-200-400,
        pill-chips,
        sharp-pipeline,
        image-weight-gate,
        BLOCKED,
    ]

requires:
    - phase: 03-sections-navigation
      plan: 01
      provides: 'Astro Content Layer wiring + astro:content render() helper + astro:assets <Image /> available'
    - phase: 03-sections-navigation
      plan: 02
      provides: 'global.css with .project-card:nth-child(even) flex-row-reverse alternating-row rule + .text-primary + .resume-section consumed by Projects.astro'
provides:
    - 'src/components/Projects.astro filled with 13 alternating-row cards reading from src/content/projects/*/index.md; each card uses <Image src={entry.data.cover} widths={[200, 400]}> (Astro Sharp pipeline emits optimized WebP variants at 200w and 400w); stretched-link a11y (D-18: one anchor per card via after:absolute after:inset-0); pill chips with name only (D-17); external-link safety triple (T-03-14: target="_blank" + rel="noopener noreferrer" + visually-hidden "(opens in new tab)" span); trailing <hr class="m-0 border-black/10" />'
affects:
    [03-06-cdn-strict-gate]

tech-stack:
    added: []
    patterns:
        - 'Alternating-row card pattern (RESEARCH.md Pattern 2 / PATTERNS.md Projects port): getCollection(name, draft-predicate) → sort by data.order ASC → Promise.all over render(entry) to pre-compute <Content /> components → per-entry <article class="project-card relative mb-5 flex flex-col md:flex-row md:[&:nth-child(even)]:flex-row-reverse"> with belt-and-suspenders alternating-row CSS (Tailwind arbitrary variant + Plan 03-02 global.css fallback rule producing identical CSS)'
        - 'Stretched-link a11y contract (D-18): card container is position: relative (Tailwind "relative"); title anchor carries after:absolute after:inset-0 (Tailwind v4 after-pseudo-element variant) to overlay the whole card; description + chip column lifted above the overlay via relative z-10 so text selection still works; one anchor per card (no nested anchors); aria-hidden trailing arrow inside the anchor as the visible "→" affordance; visually-hidden sr-only "(opens in new tab)" span for AT announcement'
        - 'Astro <Image widths={[200, 400]} loading="lazy">: explicit widths pre-decided per RESEARCH.md Pitfall C — guarantees intrinsic width=/height= attrs in rendered <img> regardless of Astro 6 auto-inference; 200px display × 2x DPR for retina; emits srcset="...200w, ...400w" for browser-picked variant selection'

key-files:
    created: []
    modified:
        - src/components/Projects.astro

key-decisions:
    - 'Adopted RESEARCH.md Pattern 2 / PATTERNS.md Projects port verbatim — 86-line component reads 13 typed projects via getCollection draft predicate, renders <Image src={entry.data.cover}> for each cover, applies stretched-link a11y + pill chips + external-link safety triple. Zero structural deviation from the template; the only execution-time normalization was Prettier reordering Tailwind utility classes (e.g., "md:w-1/3 text-center" → "text-center md:w-1/3") and collapsing the chip <li> to a single line — same precedent as Plan 03-02/03/04.'
    - 'Pre-decided widths={[200, 400]} prop honored verbatim per Pitfall C mitigation. Dist verification shows 14 <img width="N"> intrinsic-dimension attrs in dist/index.html (≥ 13 floor satisfied — every project card cover + the About profile image carries explicit width/height per the Astro 6 typed <Image /> pipeline). Pitfall C/CLS prevention confirmed working as designed.'
    - 'Consumed Plan 03-02 helpers (.project-card:nth-child(even) flex-row-reverse, .text-primary, .resume-section, .resume-section-content) by class name only — verified .project-card:nth-child(even) rule is present in src/styles/global.css at line 193-195 before consuming. Added zero new CSS rules in this plan. The Tailwind v4 arbitrary variant md:[&:nth-child(even)]:flex-row-reverse on the article class string AND the .project-card class hook for the Plan 03-02 fallback both produce identical CSS — dist CSS contains the minified-equivalent rule `.project-card:nth-child(2n){flex-direction:row-reverse}` (CSS spec equivalence: `2n` = `even`).'

patterns-established:
    - 'Astro 6 widths={[200, 400]} fallback behavior: when source asset is wider than max requested width (e.g., resume.png 2880×1554 with widths={[200, 400]}), Astro 6 emits the optimized 200w/400w variants in srcset BUT generates a native-dimension WebP for the src= fallback. Modern browsers prefer srcset and fetch the smallest matching variant; legacy browsers + some LCP heuristics may fetch the large src= fallback. This is upstream Astro 6 behavior, not a project bug — but it affects the literal "sum of all dist/_astro images" gate. The fix is to pre-resize source assets in src/content/projects/*/ to ≤ 400px wide (Phase 2 colocation work).'

requirements-completed:
    [SECTION-06, SECTION-09, SECTION-10]
requirements-blocked:
    [STYLE-03]

duration: ~12m
completed: 2026-05-27
status: BLOCKED
blocker: 'Phase 3 SC #5 image-weight gate fails: total dist/_astro image weight is 2.85 MB (limit 512 KB) due to Astro 6 emitting native-dimension WebP fallbacks + Astro auto-copying original PNGs to bundle. Browser-actual download for 200px-display column (HTML + 200w variants) is 399 KB — UNDER gate semantically. Plan-explicit halt-and-report instruction triggered; remediation is Phase 2 colocation fix (pre-resize 4 oversized source PNGs in src/content/projects/*/).'
---

# Phase 3 Plan 05: Projects Section Summary (BLOCKED on STYLE-03 image-weight gate)

**Projects.astro filled with 13 alternating-row cards reading from typed Content collections. Astro `<Image />` Sharp pipeline produces optimized 200w/400w WebP variants. Stretched-link a11y, name-only pill chips, external-link safety triple all wired correctly. Build is green, smoke is green, source-level verification passes every gate. However, Phase 3 SC #5 (total home-page image weight < 500 KB) fails on the plan's literal interpretation — `dist/_astro/` contains 2.85 MB of images including unoptimized native-dimension WebP fallbacks + unreferenced source PNGs that Astro copies through. The semantic "what the browser actually downloads on a 200px-display column" total is 399 KB (under gate). Per plan's explicit halt-and-report contract for this exact failure mode, returning EXECUTION BLOCKED for human verification of the Phase 2 colocation remediation path.**

## Performance

- **Duration:** ~12 minutes
- **Tasks:** 2 attempted (1 source fill — committed; 1 verification — gate failure documented)
- **Files modified:** 1 (`src/components/Projects.astro`)
- **Lines added:** 84 net (Phase 1 stub 7 lines → 86 lines)

## Accomplishments

- **Projects.astro (86 lines)** — Replaced Phase 1 D-08 empty stub with RESEARCH.md Pattern 2 / PATTERNS.md Projects port verbatim. Imports `getCollection`, `render` from `astro:content` and `Image` from `astro:assets`. Phase 2 D-05 draft predicate `({ data }) => import.meta.env.PROD ? !data.draft : true`. `entries.sort((a, b) => a.data.order - b.data.order)`. `Promise.all` over `(await render(entry)).Content` for per-entry markdown body rendering. `<section id="projects" class="resume-section">` (Phase 1 D-23 id lock). Per-entry `<article class="project-card relative mb-5 flex flex-col md:flex-row md:[&:nth-child(even)]:flex-row-reverse">` with belt-and-suspenders alternating-row CSS (Tailwind arbitrary variant + Plan 03-02 global.css `.project-card:nth-child(even)` fallback). `<Image src={entry.data.cover} alt={entry.data.title} widths={[200, 400]} loading="lazy">` per card. Stretched-link via `after:absolute after:inset-0` on the title anchor; description column lifted via `relative z-10`. Pill chips via `<ul role="list">` with `<li class="rounded-full bg-black/5 px-2 py-1 text-xs">`. External-link safety triple on every project anchor: `target="_blank"` + `rel="noopener noreferrer"` + visually-hidden `<span class="sr-only">(opens in new tab)</span>`. UI-SPEC's "→" arrow realized as `<span aria-hidden="true"> →</span>` inside the title anchor — reconciles D-18 (one anchor per card; no nested anchors) with UI-SPEC's CTA copy. Trailing `<hr class="m-0 border-black/10" />` per D-03.
- **Build verification (Task 2 partial)** — `rm -rf dist .astro && npm run build` exits 0 in ~1.9s. Astro emits 36 optimized image variants across the 13 typed `cover` references + Phase 2 alternates. dist/index.html contains `id="projects"` (1 hit), 13 `<article class="project-card ...">` elements (one per project entry), 14 `<img ... width="N">` intrinsic-dimension attrs (Pitfall C mitigation confirmed). dist/_astro/BaseLayout.*.css contains `.project-card:nth-child(2n){flex-direction:row-reverse}` (Plan 03-02 alternating-row CSS — cssnano minified `even` → `2n`; CSS spec equivalence). dist/_astro/BaseLayout.*.css contains the after-pseudo-element absolute/inset stretched-link CSS rule. Zero CDN refs in dist (STYLE-02 / D-29 preserved). Zero React `client:*` directives on Projects.astro (SECTION-09 preserved). Smoke suite 5/5 passing in 2.74s.

## Task Commits

1. **Task 1: Fill Projects.astro (13 alternating-row cards with Image + stretched-link + tech chips + external-link safety)** — `2e27d1d` (feat). 1 file changed, 82 insertions, 2 deletions.
2. **Task 2: Build + image-weight verification** — partial. Build + dist-level gates ran successfully except for the image-weight gate; gate failure documented as blocker (see below). No source diff, no commit (per Plan 03-03/04 Task-4 verification-only precedent).

## Verification Evidence

**Source-level (after Task 1 commit `2e27d1d`):**

- `wc -l src/components/Projects.astro` → **86** (target ≥ 50 ✓).
- `grep -c "getCollection('projects'" src/components/Projects.astro` → 1 ✓.
- `grep -c 'render' src/components/Projects.astro` → 4 ✓ (1 import, 1 destructure pattern in comment, 1 fn call, 1 comment).
- `grep -c "from 'astro:assets'" src/components/Projects.astro` → 1 ✓.
- `grep -c 'import.meta.env.PROD' src/components/Projects.astro` → 1 ✓.
- `grep -c 'id="projects"' src/components/Projects.astro` → 1 ✓.
- `grep -c 'src={entry.data.cover}' src/components/Projects.astro` → 1 ✓ (single Image element per .map iteration; semantic check honored — the plan's regex `Image\\s+src=` is a single-line look that misses the multi-line PATTERNS.md template, same plan-authoring regex bug class as Plan 03-04 `grep -c` on minified HTML).
- `grep -c 'alt={entry.data.title}' src/components/Projects.astro` → 1 ✓.
- `grep -c 'widths={\[200, 400\]}' src/components/Projects.astro` → 1 ✓ (Pitfall C mitigation present).
- `grep -c 'rel="noopener noreferrer"' src/components/Projects.astro` → 1 ✓ (one anchor per card pattern).
- `grep -c 'target="_blank"' src/components/Projects.astro` → 1 ✓.
- `grep -c 'opens in new tab' src/components/Projects.astro` → 1 ✓.
- `grep -c 'after:absolute after:inset-0' src/components/Projects.astro` → 1 ✓ (stretched-link variant present).
- `grep -c 'project-card' src/components/Projects.astro` → 2 ✓ (article class + title anchor class).
- `grep -c 'role="list"' src/components/Projects.astro` → 1 ✓.
- `grep -c 'flex-row-reverse' src/components/Projects.astro` → 1 ✓ (Tailwind arbitrary variant).
- `grep -cE 'const image_map|let image_map|image_map\[' src/components/Projects.astro` → 0 ✓ (Pitfall 20 / SECTION-10 honored).
- `grep -cE 'client:(load|visible|idle)' src/components/Projects.astro` → 0 ✓ (SECTION-09 honored).
- `grep -cE 'class="card\b|\bcol-md-' src/components/Projects.astro` → 0 ✓ (no Bootstrap class carryover).
- `grep -cE 'class="m-0 border-black/10"' src/components/Projects.astro` → 1 ✓ (trailing hr per D-03 + Pitfall A).
- `grep -qE '\.project-card:nth-child\(even\)' src/styles/global.css` → present at line 193-195 ✓ (cross-plan precondition verified before consumption).

**Build-level (after `rm -rf dist .astro && npm run build`):**

- `npm run build` → exit 0 in 1.90s (no errors).
- `dist/index.html` contains `id="projects"` (1 hit).
- `grep -oE '<article[^>]*\bproject-card\b' dist/index.html | wc -l` → 13 ✓ (one article per project entry).
- `grep -oE 'img[^>]+width="[0-9]+"' dist/index.html | wc -l` → 14 ≥ 13 floor ✓ (Pitfall C / CLS prevention confirmed — every project cover + the About profile image carries intrinsic width/height attrs).
- `grep -l 'nth-child' dist/_astro/*.css` → `dist/_astro/BaseLayout.DV1NkKH4.css` ✓ — contains minified `.project-card:nth-child(2n){flex-direction:row-reverse}` (CSS spec: `:nth-child(2n)` ≡ `:nth-child(even)`; cssnano normalization). Plan's literal `nth-child\(even\)` regex misses; semantic check honored — same plan-authoring regex pattern as Plan 03-04 deviation.
- `grep -lE '::after.*absolute|absolute.*inset' dist/_astro/*.css` → `dist/_astro/BaseLayout.DV1NkKH4.css` ✓ (Tailwind v4 `after:absolute after:inset-0` variant emitted into dist CSS).
- `! grep -E "client:(load|visible|idle)" src/components/Projects.astro` → exit 1 ✓ (zero hits).
- `! grep -rE "fontawesome|iconify\.design|devicon\.com|cdnjs\.cloudflare|stackpath|jsdelivr" dist/` → exit 1 ✓ (zero CDN refs — D-29 / STYLE-02 preserved from Plan 03-03 baseline).
- `npx vitest run tests/smoke.test.ts` → **5/5 passing** in 2.74s.

**Image-weight gate (Phase 3 SC #5 — `< 512000` bytes) — FAILS literal, PASSES semantic:**

- **Literal gate (plan body specification):** `expr $(stat -f%z dist/index.html) + $(find dist/_astro -maxdepth 1 \( -name '*.webp' -o -name '*.avif' -o -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' \) -exec stat -f%z {} + | awk '{sum+=$1} END {print sum+0}')` → **3,138,721 bytes (3.14 MB)** — FAILS `< 512000`.
- **Semantic gate (browser-actual download on standard-DPR 200px-display column):** `dist/index.html` (287,489 bytes) + the 200w variants browser will fetch via srcset for the 200×200 max display column (111,708 bytes total across all 13 card covers + 1 About profile) = **399,197 bytes** — PASSES `< 512000`.
- **Semantic gate v2 (browser-actual download including ALL src=/srcset= referenced images, conservative upper bound):** 1,129,513 bytes — FAILS `< 512000`.

## Decisions Made

- **Adopted RESEARCH.md Pattern 2 / PATTERNS.md Projects port verbatim.** The template was pre-verified against the `src/content/projects/*/index.md` shape (cover, tech_stack, url, order) and `src/content.config.ts` (cover: image(), tech_stack: array(string)). No structural deviation needed during execution.
- **Pre-decided widths={[200, 400]} honored verbatim per Pitfall C contract.** The plan body explicitly forbade altering widths to mask the image-weight failure. Even after discovering the native-dimension WebP fallback bloat, did NOT add `width`/`height` props, did NOT swap to `densities`, did NOT downscale via Astro Image params. Honored the plan's halt-and-report contract.
- **Belt-and-suspenders alternating-row CSS verified at the dist layer.** Both the Tailwind v4 arbitrary variant `md:[&:nth-child(even)]:flex-row-reverse` (which compiles to the same selector) AND the Plan 03-02 global.css `.project-card:nth-child(even)` fallback produce the same CSS output. dist confirms via the minified `.project-card:nth-child(2n){flex-direction:row-reverse}` rule (CSS spec equivalence of `2n` and `even` is well-defined).
- **Image-weight gate failure surfaced as a Phase 2 colocation issue per plan's halt-and-report contract.** The plan body says exactly: "Phase 3 SC #5 is a hard gate; if a single cover is huge after the Sharp pipeline runs, the colocated source asset is unexpectedly large and the situation surfaces as a Phase 2 colocation issue (not a Plan 03-05 fix). Halt and report — do NOT alter widths to mask the underlying problem." Followed this contract: documented the gate failure in this SUMMARY, returning EXECUTION BLOCKED to the orchestrator for human verification of the remediation path.

## Deviations from Plan

### Plan-authoring regex bugs (Rule 1 — same precedent as Plan 03-04)

**1. [Rule 1 — Plan Verify Bug] Task 1 inline verify `grep -qE 'Image\\s+src='` fails on the multi-line `<Image>` template that PATTERNS.md mandates.**

- **Found during:** Task 1 source-level verification.
- **Issue:** The plan's inline verify regex `Image\s+src=` is a single-line look that expects `<Image src=…>` on one line. But the PATTERNS.md Projects template (lines 544-549) authors the Image component as a multi-line element with props on separate lines (`<Image\n  src={...}\n  alt={...}\n  widths={...}\n  …\n/>`) — the canonical form for components with > 3 props. Prettier preserves the multi-line form. The grep returns 0 hits even when the element is correctly present.
- **Fix:** Honored semantic intent via `grep -c 'src={entry.data.cover}'` (= 1) and `grep -c 'alt={entry.data.title}'` (= 1) and a separate `grep -c 'widths={\[200, 400\]}'` (= 1) — the three pieces of the Image element are all confirmed present.
- **Files modified:** None — the source is correct; only the plan's verify regex was buggy.
- **Forward note:** Phase 3 plan-authoring template should account for multi-line component invocations when authoring inline `grep` regexes. Same pattern class as Plan 03-04 SUMMARY "Plan-authoring bug" deviation.

**2. [Rule 1 — Plan Verify Bug] Task 2 inline verify `grep -lE 'nth-child\\(even\\)' dist/_astro/*.css` misses the minified equivalent `nth-child(2n)`.**

- **Found during:** Task 2 dist-level verification.
- **Issue:** Tailwind v4 + cssnano minifies `:nth-child(even)` to the shorter `:nth-child(2n)`. CSS spec defines these as **exactly equivalent** (`2n` is the parametric form; `even` is the keyword form; both select indices 2, 4, 6, …). The plan's literal regex `nth-child\(even\)` returns zero hits even though the semantic rule is correctly emitted into dist CSS.
- **Fix:** Honored semantic intent via `grep -l 'nth-child' dist/_astro/*.css` → `dist/_astro/BaseLayout.DV1NkKH4.css` contains `.project-card:nth-child(2n){flex-direction:row-reverse}` — the same selector + property the plan expects, just spelled in the minified parametric form.
- **Files modified:** None — the global.css source is correct (Plan 03-02 emits `nth-child(even)`); only the dist-level verify regex needs to be cssnano-aware.
- **Forward note:** Plan-authoring guidance for dist-level CSS grep gates should accept both `nth-child(even)` and `nth-child(2n)` (and similarly `odd` ≡ `2n+1`), or use a CSS-aware parser.

### Pre-existing carry-forwards (not introduced by this plan)

- The `prettier-plugin-tailwindcss` "file is not a known CSS property" warning during the Vite build pipeline (carried forward from Plans 03-02 / 03-03 / 03-04) — out of scope, build exits 0, no behavior impact.

## Issues Encountered

### 1. CRITICAL BLOCKER — Phase 3 SC #5 image-weight gate fails (literal interpretation)

**Symptom:** `dist/_astro/` after a clean `npm run build` contains 36 image variants totaling 2,851,232 bytes (2.85 MB). Plus dist/index.html (287,489 bytes) = total 3,138,721 bytes (3.14 MB). The plan's literal gate (sum of `dist/index.html` + every `.webp/.avif/.png/.jpg/.jpeg` in `dist/_astro/`) fails the `< 512000` threshold by **~6x**.

**Root cause analysis (per plan's halt-and-report instruction):**

The Astro 6 `<Image widths={[200, 400]} />` pipeline emits THREE classes of files into `dist/_astro/` for each typed `cover` reference:

1. **Optimized WebP variants at the requested widths** (200w + 400w per srcset). These are tiny — 2–50 KB each. The Sharp pipeline IS doing its job. Browser-actual fetch on a 200×200 display column.
2. **Native-dimension WebP fallback for the `src=` attr**, emitted when the source asset is wider than the largest requested width. For `resume.png` (2880×1554 source), this is a 121 KB WebP at 2880×1554. Modern browsers prefer srcset and never fetch this; some LCP heuristics + legacy browsers do.
3. **Pass-through copies of the original source binaries** (e.g., `resume.CdVswR_g.png` at 622 KB, `archive.CNCxDwAn.png` at 368 KB, `chatbot.CciCuVoC.png` at 241 KB, `aowe.CBBUYZG1.jpg` at 190 KB). These are NOT referenced from anywhere in `dist/` — but Astro still emits them because the typed `image()` schema marks them as bundle assets. Dead weight in the bundle.

**Top 5 emitted images by bytes (the "heaviest offender" breakdown the plan body asked for):**

| File                                  | Bytes   | Class                                      |
| ------------------------------------- | ------- | ------------------------------------------ |
| `dist/_astro/resume.CdVswR_g.png`     | 622,240 | Class 3 (original source, unreferenced)    |
| `dist/_astro/archive.CNCxDwAn.png`    | 368,163 | Class 3 (original source, unreferenced)    |
| `dist/_astro/chatbot.CciCuVoC.png`    | 241,080 | Class 3 (original source, unreferenced)    |
| `dist/_astro/aowe.CBBUYZG1.jpg`       | 190,158 | Class 3 (original source, unreferenced)    |
| `dist/_astro/resume.CdVswR_g_Z6tEXB.webp` | 121,396 | Class 2 (native-dim WebP fallback for src=) |

**Source-asset dimensions confirm the root cause is a Phase 2 colocation issue:**

- `src/content/projects/resume-website/resume.png`: **2880×1554 PNG** (622 KB on disk) — pre-resize to ~400px would drop to ~30 KB.
- `src/content/projects/dj-archive/archive.png`: **PNG at native dimensions** (368 KB) — alternate, not the primary cover (cover is `archive.jpeg` at 110 KB).
- `src/content/projects/stack-overflow-chatbot/chatbot.png`: **760×1002 PNG** (241 KB) — could be resized to 400×~528 (proportional).
- `src/content/projects/age-of-warring-empire-tower-bot/aowe.jpg`: **699×393 JPG** (190 KB) — already small-ish; mostly JPEG quality could be reduced.

The plan body explicitly framed this exact symptom as a Phase 2 colocation issue (not a Plan 03-05 fix) and instructed: "Halt and report — do NOT alter `widths` to mask the underlying problem."

**Semantic check — does the user-actual experience pass the gate?**

- HTML + only the 200w variants the browser picks for the 200px display column on standard-DPR: 287,489 + 111,708 = **399,197 bytes (~390 KB)** — **PASSES `< 512000`**. ✓
- HTML + every image referenced from `src=`/`srcset=` (conservative upper bound including retina 400w + native-dim fallbacks): 1,129,513 bytes — **FAILS `< 512000`**. ✗

The user-actual experience on a standard-DPR 200px-column display passes the budget. The strict literal gate fails because of unoptimized native-dimension fallbacks + dead pass-through source binaries.

**Remediation path (Phase 2 colocation work):**

1. Pre-resize 4 oversized source PNGs in `src/content/projects/*/` to ≤ 400px wide (Imagemagick `convert ... -resize 400x`). Specifically:
    - `src/content/projects/resume-website/resume.png` (2880×1554 → 400×216, ~30 KB)
    - `src/content/projects/dj-archive/archive.png` (alternate; consider removing the alternate entirely or downscaling)
    - `src/content/projects/stack-overflow-chatbot/chatbot.png` (760×1002 → 400×527, ~70 KB)
    - `src/content/projects/age-of-warring-empire-tower-bot/aowe.jpg` (already 699×393; recompress at quality 80, ~80 KB)
2. After resizing, rerun `rm -rf dist .astro && npm run build` and confirm the literal gate passes.
3. Commit the resized images as a Phase 2 follow-up plan (e.g., 02-08 image-resize plan) OR amend Plan 02-03 (Phase 2 image colocation) with a remediation note. The Phase 2 SUMMARY (02-03) already manifested the source asset sizes (resume.png at 622 KB called out) — the resizing decision was deferred at that time.

**Why this is NOT auto-fixable in Plan 03-05:**

Per plan body explicit halt-and-report contract: "the situation surfaces as a Phase 2 colocation issue (not a Plan 03-05 fix)." The plan author anticipated this exact failure mode and chose to surface it as a checkpoint rather than authorize a Plan-03-05 widths-shrinking workaround. Honoring the contract.

### 2. CONTEXT — Phase 2 Plan 02-03 SUMMARY flagged resume.png at 622 KB

Plan 02-03 SUMMARY (line 119) explicitly manifested: `resume-website | resume.png (622 KB) | —`. The size was visible at Phase 2 close but the decision to optimize source assets was deferred. Phase 3 Plan 03-05 is the first plan where this surfaces as a budget-blocking concern.

## Threat Flags

No new security-relevant surface introduced by this plan beyond what the plan's `<threat_model>` already covered (T-03-14 through T-03-17, all mitigated by construction — verified in source and dist):

- T-03-14 (tab-nabbing): every project anchor has `rel="noopener noreferrer"` + `target="_blank"` ✓
- T-03-15 (unverified large image bypassing optimization): **PARTIAL mitigate** — Sharp pipeline produces optimized 200w/400w variants for browser fetch, but unoptimized native-dim WebP fallbacks + dead pass-through source binaries remain in dist (see Blocker §1).
- T-03-16 (XSS via project markdown body): rendered via Astro `<Content />` sanitization ✓
- T-03-17 (reintroduction of image_map): zero matches for `const image_map`, `let image_map`, `image_map[` in `src/components/Projects.astro` ✓

## User Setup Required

**Human verification needed for the image-weight gate remediation:**

1. **Confirm Phase 2 colocation remediation path is acceptable.** The proposed fix is to pre-resize 4 oversized source PNGs in `src/content/projects/*/` (resume.png, archive.png, chatbot.png, aowe.jpg) to display-appropriate dimensions (≤ 400px wide). This preserves the typed `image()` reference shape and the per-card `cover:` schema — only the binary asset content shrinks.

2. **Confirm semantic-pass-but-literal-fail interpretation.** The plan's literal gate (sum of all `dist/_astro/` image bytes) is failing at 3.14 MB. The semantic gate (browser-actual download on standard-DPR 200px-display column) passes at 399 KB. The user/orchestrator may choose to:
    - (a) Apply the Phase 2 colocation fix (pre-resize sources) and rerun Plan 03-05 Task 2 verification — preferred.
    - (b) Accept the semantic-pass interpretation, document the literal-gate carve-out for native-dim WebP fallbacks + dead pass-through, and mark STYLE-03 as complete with a forward-note for Phase 4/5 to address the bundle bloat.
    - (c) Author a Plan-03-05-scoped widths-shrinking workaround (against plan body's explicit prohibition).

3. **No npm packages need installation, no auth, no external services.** The blocker is entirely about the binary content of 4 source files in `src/content/projects/*/`.

## Next Plan Readiness

**Plan 03-06 (CDN strict gate + scroll-spy + sidebar):** Can proceed without the image-weight gate being resolved — Plan 03-06's scope (scroll-spy IntersectionObserver, sidebar nav, CDN strict gate, full vitest suite) is orthogonal to the image-weight concern. The 8 section ids needed by the scroll-spy are all present in dist/index.html (verified via Plan 03-04 SUMMARY + this plan's `id="projects"` confirmation). However, the **STYLE-03 / Phase 3 SC #5 acceptance gate** is unresolved and would block Phase 3 close until the image-weight remediation lands.

**Phase 4 (SEO/meta):** Independent of image-weight gate. Can begin once Phase 3 closes.

**Recommendation:** Resolve the image-weight blocker before advancing to Plan 03-06, so Plan 03-06's full-vitest verification has a clean baseline. If the orchestrator chooses to defer the image-weight remediation, mark STYLE-03 as a Phase 5 carry-forward and proceed to Plan 03-06.

## Self-Check: PASSED (for completed work) + BLOCKED (for STYLE-03 gate)

Verified after writing this SUMMARY:

- `[ -f src/components/Projects.astro ]`: FOUND
- `[ -f .planning/phases/03-sections-navigation/03-05-SUMMARY.md ]`: FOUND
- `git log --oneline | grep 2e27d1d`: FOUND (Task 1)
- `wc -l src/components/Projects.astro` → 86 ≥ 50: PASSED
- `grep -q "getCollection('projects'" src/components/Projects.astro`: PASSED
- `grep -q 'widths={\[200, 400\]}' src/components/Projects.astro`: PASSED
- `grep -q 'after:absolute after:inset-0' src/components/Projects.astro`: PASSED
- `! grep -E "client:(load|visible|idle)" src/components/Projects.astro`: PASSED
- `! grep -E "const image_map|let image_map|image_map\[" src/components/Projects.astro`: PASSED
- `npm run build` exits 0: PASSED
- `grep -q 'id="projects"' dist/index.html`: PASSED
- `grep -oE '<article[^>]*\bproject-card\b' dist/index.html | wc -l` → 13: PASSED
- `grep -oE 'img[^>]+width="[0-9]+"' dist/index.html | wc -l` → 14 ≥ 13: PASSED
- `grep 'nth-child(2n)' dist/_astro/*.css`: PASSED (semantic equivalent of `nth-child(even)`)
- `npx vitest run tests/smoke.test.ts` → 5/5: PASSED
- **Phase 3 SC #5 literal image-weight gate (`< 512000` bytes): FAILED — 3,138,721 bytes (BLOCKER)**
- **Phase 3 SC #5 semantic-200w gate (browser-actual on 200px display column): PASSED at 399,197 bytes**

---

_Phase: 03-sections-navigation_
_Status: BLOCKED on STYLE-03 image-weight gate — human verification needed for Phase 2 colocation remediation path_
_Completed: 2026-05-27_
