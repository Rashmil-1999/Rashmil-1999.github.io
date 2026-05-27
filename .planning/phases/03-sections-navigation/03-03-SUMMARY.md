---
phase: 03-sections-navigation
plan: 03
subsystem: components
tags:
    [
        about,
        skills,
        testimonials,
        astro-content,
        astro-icon,
        getEntry,
        getCollection,
        singleton-collection,
        list-collection,
        blockquote,
        tailwind-marker,
        social-icon,
        btn-primary,
    ]

requires:
    - phase: 03-sections-navigation
      plan: 01
      provides: 'astro-icon integration + devicon/simple-icons/logos/lucide Iconify packs on disk so <Icon name="prefix:name" /> resolves at build'
    - phase: 03-sections-navigation
      plan: 02
      provides: 'global.css with .social-icon, .btn-primary, .text-primary, .profile-pic, .subheading, .lead, .text-muted, .resume-section, .resume-section-content rules consumed by these three components'
provides:
    - 'src/components/About.astro filled with name + accent span + status + contact-message + mailto email + description + social row (LinkedIn + Github with aria-label / target=_blank / rel=noopener noreferrer / sr-only new-tab announcement) + Download Resume CTA (download attribute + /Rashmil_Panchani.pdf) + mobile-only profile photo (md:hidden) + Tailwind marker text-[#abc123] preservation span + trailing hr (D-03)'
    - 'src/components/Skills.astro filled with sorted category groups (6 categories by order 10/20/30/40/50/60) + per-item bundled-SVG icons via astro-icon Icon component + role="list" on ul + decorative aria-hidden on icons + accessible name span beneath + trailing hr (D-03)'
    - 'src/components/Testimonials.astro filled with draft-predicate-filtered + order-sorted list-collection read + per-entry blockquote + <Content /> markdown body inside italic .lead wrapper + footer.blockquote-footer with <cite> + optional .text-muted role/org attribution + NO trailing horizontal-rule element (D-03 — Testimonials is the last section)'
affects:
    [03-04-list-sections, 03-05-projects-and-images, 03-06-cdn-strict-gate]

tech-stack:
    added: []
    patterns:
        - 'Singleton getEntry pattern (Astro 6 Content Layer file() loader): getEntry(collection, id) where id matches the top-level YAML key (about / skills); throw-guard against missing entry; .data destructure for view consumption'
        - 'List-collection draft predicate (Phase 2 D-05): getCollection(name, ({ data }) => import.meta.env.PROD ? !data.draft : true) — drafts visible in dev, hidden in production'
        - 'astro-icon bundled-SVG consumption: <Icon name="iconify-prefix:name" aria-hidden="true" class="size-6" /> for decorative icons; D-21 no runtime fallback, build fails loudly on unknown ids'
        - 'Markdown body rendering for list collections: (await render(entry)).Content yields a <Content /> component that emits sanitized HTML inside the parent template'
        - 'Tailwind marker preservation pattern (Pitfall 29 / smoke #5): keep text-[#abc123] on a sr-only span so Tailwind v4 source detection still emits the utility into dist/_astro/*.css without polluting visual output'

key-files:
    created: []
    modified:
        - src/components/About.astro
        - src/components/Skills.astro
        - src/components/Testimonials.astro

key-decisions:
    - 'Used the Pattern 3 / Pattern 4 templates from RESEARCH.md verbatim for About and Skills; PATTERNS.md Testimonials Astro port verbatim for Testimonials. Zero structural deviation from the planned templates.'
    - "getEntry second-arg id resolved as 'about' for the about collection and 'skills' for the skills collection — file() loader derives the id from the YAML top-level key, which matches the collection name in both files (Pitfall B mitigated; no console.log probe needed)."
    - 'Tailwind marker text-[#abc123] placed inline within the About <h1> on a sr-only span carrying aria-hidden="true" — keeps the utility detectable by Tailwind v4 source detection and the smoke #5 assertion green while making zero visual or assistive-tech impact.'
    - 'Trailing hr class wording standardized to `class="m-0 border-black/10"` per D-03 + Pitfall A (Tailwind v4 default <hr> border is currentColor which would render way darker than recovered CRA rgba(0,0,0,.1)). Applied to About and Skills; deliberately omitted from Testimonials.'
    - 'Testimonials final-section omission: emitted a JSX comment immediately after </section> explicitly documenting the deliberate omission of the trailing horizontal-rule element with D-03 citation. The comment text intentionally uses the phrase "horizontal-rule element" to avoid the literal `<hr` characters so the negation grep `! grep -qE \\bhr\\b[^a-z]` keeps passing.'
    - 'Consumed Plan 03-02 helpers (.social-icon, .btn-primary, .text-primary, .profile-pic, .subheading, .lead, .text-muted, .resume-section, .resume-section-content) by class name only — verified .social-icon and .btn-primary are present in src/styles/global.css before consuming. Added zero new CSS rules in this plan.'
    - 'Mobile-only profile photo wrapped in <div class="text-center md:hidden"> per D-25 + D-11 — Astro <Image> with width=200 height=225 matching .profile-pic; sidebar (Plan 03-06) will render the desktop profile photo separately at >= md.'
    - 'Skills section emits a <h2 class="mb-5">Skills</h2> heading (recovered CRA had no explicit <h2>) so the WCAG 2.1 heading hierarchy lines up — Phase 4 a11y audit will check the full document outline.'

patterns-established:
    - 'Singleton + list collection co-existence in the same wave: About + Skills use file() loader + getEntry (singleton), Testimonials uses glob() loader + getCollection (list). Both patterns work alongside one another with zero shared-state risk because the collection names are distinct (about / skills / testimonials).'
    - 'No client:* directives anywhere in section components — verified by both source-level grep and behavior gate against dist/. Sections are statically rendered, sidebar (Plan 03-06) is the only place that hosts the IntersectionObserver browser script.'
    - 'Tailwind marker is now load-bearing: future plans removing it would silently break smoke #5. Keeping it on a sr-only span inside About is the durable hosting choice (About is the most-stable section identity-wise).'

requirements-completed:
    [SECTION-02, SECTION-05, SECTION-08, SECTION-09]

duration: ~6m
completed: 2026-05-27
---

# Phase 3 Plan 03: About + Skills + Testimonials Section Components Summary

**Three Phase 1 stub components filled with real markup reading from Phase 2 content collections: About (singleton getEntry + name/status/contact/social/CTA + mobile-only photo), Skills (singleton getEntry + 6 sorted category groups + bundled astro-icon SVGs), Testimonials (list getCollection + draft-predicate + markdown body via Content + no trailing rule per D-03).**

## Performance

- **Duration:** ~6 minutes
- **Tasks:** 4 (3 component fills + 1 build/smoke verification)
- **Files modified:** 3 (`src/components/About.astro`, `src/components/Skills.astro`, `src/components/Testimonials.astro`)
- **Lines added:** ~150 net (3 stubs replaced with full implementations)

## Accomplishments

- **About.astro (77 lines)** — Singleton `getEntry('about', 'about')` read with throw guard; `<h1>` with first_name + `.text-primary` accent span on last_name; subheading block (current_status + contact_message + mailto email link); lead description paragraph; social row with LinkedIn + Github anchors (each with `aria-label={handle.name}`, `target="_blank"`, `rel="noopener noreferrer"`, `class="social-icon"`, a child `<Icon>` with `aria-hidden="true"`, and a sr-only "(opens in new tab)" announcement per D-26); Download Resume CTA with `download` attribute pointing to `/Rashmil_Panchani.pdf`; mobile-only profile photo (`md:hidden`) via Astro `<Image>` with width=200 height=225; trailing `<hr class="m-0 border-black/10" />`. Tailwind marker `text-[#abc123]` preserved on a sr-only `<span aria-hidden="true">` inside the `<h1>` so smoke #5 still passes (Phase 1 D-12 + Pitfall 29 mitigation).
- **Skills.astro (37 lines)** — Singleton `getEntry('skills', 'skills')` read with throw guard; `[...categories].sort((a, b) => a.order - b.order)` sort using the spread because the Zod-validated array is readonly under `noUncheckedIndexedAccess`; `<h2>Skills</h2>` section heading; per-category `<div class="subheading mb-3">{name}</div>` plus `<ul role="list" class="dev-icons flex flex-wrap gap-4">` whose `<li class="flex flex-col items-center">` items stack the bundled-SVG `<Icon name={item.icon} aria-hidden="true" class="size-6" />` above a `<span class="mt-1 text-xs">{name}</span>` (D-20); trailing `<hr class="m-0 border-black/10" />`. No runtime fallback for unknown Iconify ids — astro-icon fails the build loudly per D-21.
- **Testimonials.astro (49 lines)** — List `getCollection('testimonials', ({ data }) => import.meta.env.PROD ? !data.draft : true)` read with Phase 2 D-05 draft predicate; `entries.sort((a, b) => a.data.order - b.data.order)`; `Promise.all` over `render(entry).Content` for per-entry rendered markdown bodies; `<h2>Testimonials</h2>`; per-entry `<blockquote class="blockquote">` with a `<div class="lead mb-0 italic"><Content /></div>` body wrapper (D-24 Mulish 400i) and a `<footer class="blockquote-footer">` containing `<cite>{entry.data.user}</cite>` plus conditional `{entry.data.role && entry.data.org && (<span class="text-muted"> — {role}, {org}</span>)}` attribution; **NO trailing horizontal-rule element** (D-03 — only section without one); dropped the CRA hardcoded `title="Source Title"` on `<cite>` (CRA bug per PATTERNS.md). Inline JSX comment after `</section>` documents the deliberate omission with D-03 citation, worded to avoid the literal `<hr` substring so the negation grep stays green.
- **Build verification** — `rm -rf dist .astro && npm run build` exits 0 (no `Icon "...:..." not found` errors → every Iconify id in `about.yaml` and `skills.yaml` resolves against installed packs: simple-icons:linkedin/github, devicon:c/cplusplus/java/python/go/javascript/windows8/linux/apple/mysql/postgresql/mongodb/redis/html5/css3/nodejs/react/bootstrap/heroku/amazonwebservices/git, logos:graphql/google-cloud, simple-icons:django/numpy/pandas/tensorflow/keras/opencv, lucide:code).
- **dist/index.html assertions** — `id="about"`, `id="skills"`, `id="testimonials"` each present (1 hit). `class="blockquote"` present (1 hit). `Download Resume` literal text present (1 hit). `Rashmil_Panchani.pdf` reference present (1 hit). `aria-hidden="true"` appears 33 times in dist/index.html — well over the ≥30 threshold, confirming bundled astro-icon emitted SVGs for all Skills items + both social icons (Pitfall E sanity check passes).
- **CDN sweep** — `grep -rE "fontawesome|iconify\.design|devicon\.com|cdnjs\.cloudflare|stackpath|jsdelivr" dist/` exits 1 (zero matches — STYLE-02 / D-29 honored).
- **No React runtime on sections** — `grep -E "client:(load|visible|idle)" src/components/About.astro src/components/Skills.astro src/components/Testimonials.astro` exits 1 (zero hits — SECTION-09 honored).
- **Smoke suite** — `npx vitest run tests/smoke.test.ts` → 5/5 passing (dist/index.html exists ✓, all 8 section ids present ✓, dist/hydration-test/index.html exists ✓, React JS chunk emitted ✓, `#abc123` marker present in `dist/_astro/BaseLayout.DV1NkKH4.css` ✓).

## Task Commits

Each task that modified source was committed atomically; Task 4 was verification-only (no source diff, no commit).

1. **Task 1: Fill About.astro (singleton read + name + accent span + status + email + description + social icons + Download Resume CTA + mobile-only profile photo)** — `5e6e28b` (feat)
2. **Task 2: Fill Skills.astro (singleton read + category groups + horizontal icon+name rows with bundled astro-icon)** — `af45417` (feat)
3. **Task 3: Fill Testimonials.astro (list-collection read + blockquote + cite + role/org attribution; NO trailing rule per D-03)** — `5142fde` (feat)
4. **Task 4: Build + smoke verification — confirm all three sections render, marker preserved, no React runtime, no CDN refs** — no commit (verification-only; produced no source diff)

## Files Created/Modified

- `src/components/About.astro` — 7 → 77 lines. Stub replaced with full Pattern 3 port.
- `src/components/Skills.astro` — 6 → 37 lines. Stub replaced with full Pattern 4 port.
- `src/components/Testimonials.astro` — 6 → 49 lines. Stub replaced with full PATTERNS.md Testimonials port.

## Verification Evidence

**Source-level (after Task 1-3 commits):**

- `wc -l src/components/About.astro` → 77 (target ≥40 ✓).
- `wc -l src/components/Skills.astro` → 37 (target ≥25 ✓).
- `wc -l src/components/Testimonials.astro` → 49 (target ≥20 ✓).
- `grep -c "getEntry('about'" src/components/About.astro` → 2 (top-of-file comment header + actual call; required ≥1).
- `grep -c "getEntry('skills'" src/components/Skills.astro` → 2 (same shape; required ≥1).
- `grep -c "getCollection('testimonials'" src/components/Testimonials.astro` → 1 (single call site; matches plan exactly).
- `grep -cE '\bhr\b[^a-z]' src/components/Testimonials.astro` → 0 ✓ (D-03 — no trailing rule, no literal `<hr` anywhere including comment text).
- `grep -cE 'class="m-0 border-black/10"' src/components/About.astro` → 1 ✓ (trailing rule present per D-03).
- `grep -cE 'class="m-0 border-black/10"' src/components/Skills.astro` → 1 ✓ (trailing rule present per D-03).
- `grep -rE "client:(load|visible|idle)" src/components/About.astro src/components/Skills.astro src/components/Testimonials.astro` → exit 1 ✓ (zero hits).
- About contains `text-[#abc123]` on a `sr-only` `aria-hidden="true"` span inside `<h1>` — Tailwind marker preservation confirmed.
- About contains `from 'astro:content'`, `from 'astro:assets'`, `from 'astro-icon/components'`, `import profileImage from '../assets/profile.jpg'`.
- About contains `await getEntry('about', 'about')` with throw guard `if (!aboutEntry) throw new Error(...)`.
- About contains `aria-label={handle.name}`, `target="_blank"`, `rel="noopener noreferrer"`, `class="social-icon"`, `(opens in new tab)` for the social row.
- About contains the literal `Download Resume` text inside an anchor carrying `download` + `class="btn-primary"`.
- Skills contains `<h2 class="mb-5">Skills</h2>` (A11Y-02 heading hierarchy).
- Skills contains `role="list"` on the per-category `<ul>` (A11Y-01 Tailwind reset compensation).
- Skills contains `[...skillsEntry.data.categories].sort((a, b) => a.order - b.order)` (Phase 2 D-25 default order respected).
- Testimonials contains `getCollection('testimonials', ({ data }) => import.meta.env.PROD ? !data.draft : true)` (Phase 2 D-05 draft predicate).
- Testimonials contains `<Content />` rendering inside `class="lead mb-0 italic"` wrapper (D-24 Mulish 400i italic body).
- Testimonials contains `<cite>{entry.data.user}</cite>` and does NOT contain `title="Source Title"` (CRA bug dropped per PATTERNS).
- Testimonials contains conditional `entry.data.role && entry.data.org && <span class="text-muted">...` attribution.
- `grep -qE '\.social-icon\s*\{' src/styles/global.css` → present (Plan 03-02 cross-plan precondition verified before consumption).
- `grep -qE '\.btn-primary\s*\{' src/styles/global.css` → present (Plan 03-02 cross-plan precondition verified before consumption).

**Build-level (after `rm -rf dist .astro && npm run build`):**

- `npm run build` → exit 0 (no `Icon "...:..." not found` errors → every Iconify id in `about.yaml` + `skills.yaml` resolved).
- `dist/index.html` contains `id="about"` (1 hit), `id="skills"` (1 hit), `id="testimonials"` (1 hit), `class="blockquote"` (1 hit), `Download Resume` (1 hit), `Rashmil_Panchani.pdf` (1 hit).
- `grep -o 'aria-hidden="true"' dist/index.html | wc -l` → 33 (Pitfall E sanity check: all astro-icon SVGs emitted; ≥30 threshold satisfied).
- `grep -rE "fontawesome|iconify\.design|devicon\.com|cdnjs\.cloudflare|stackpath|jsdelivr" dist/` → exit 1 (zero CDN refs — STYLE-02 / D-29).
- `grep -l '#abc123' dist/_astro/*.css` → `dist/_astro/BaseLayout.DV1NkKH4.css` ✓ (Tailwind marker survives in the compiled CSS — placed on the About sr-only span).
- `dist/_astro/profile.Dsyj0cdb_27Vi8F.webp` emitted (1013 kB → 5 kB optimized) — Astro `<Image>` pipeline working for the mobile profile photo.
- `npx vitest run tests/smoke.test.ts` → **5/5 tests pass** in 2.70s:
    - emits dist/index.html ✓
    - dist/index.html contains all 8 section ids ✓
    - emits dist/hydration-test/index.html ✓
    - emits a React JS chunk in dist/\_astro/ ✓
    - emits the Tailwind marker utility in dist/\_astro/\*.css ✓

## Decisions Made

- **Adopted RESEARCH.md Pattern 3 + Pattern 4 + PATTERNS.md Testimonials port verbatim.** All three templates were known-good and pre-verified against `git show b537845:src/components/*.jsx` analogues — no structural deviation needed during execution. The only material adaptations were the ones the plan explicitly mandated (sr-only Tailwind marker span on About, the no-trailing-rule comment on Testimonials, the readonly-array spread on Skills sort).
- **`getEntry` second-arg ids resolved as `'about'` and `'skills'`.** Both YAML files have their top-level keys named identically to their collection names (`about:` in `src/content/about.yaml` line 1, `skills:` in `src/content/skills.yaml` line 1), so the `file()` loader derives `id === collectionName`. No `console.log(await getCollection('about'))` probe was needed — the build succeeded on the first attempt with the documented form. **Pitfall B mitigated by construction.**
- **Tailwind marker hosted on About's `<h1>` sr-only span.** Placed it inside the `<h1>` element directly so the marker is logically associated with the page's primary heading (durable identity anchor). `aria-hidden="true"` + `sr-only` makes it invisible to both sighted users and screen readers; Tailwind v4 source detection still picks up the literal `text-[#abc123]` class string and emits `color:#abc123` into the bundled CSS (verified — `dist/_astro/BaseLayout.DV1NkKH4.css` carries the marker).
- **Testimonials no-trailing-rule comment wording.** The plan required documenting the deliberate omission of the trailing horizontal-rule element in an inline comment near the closing `</section>` while avoiding the literal `<hr` substring (so the negation grep `! grep -qE '\bhr\b[^a-z]'` stays green). Chosen phrasing: "Testimonials is the final section and intentionally omits the trailing horizontal-rule element that every other section emits. Matches CRA." Cites D-03 explicitly; uses "horizontal-rule element" instead of the tag name; verified the grep returns 0 matches against the saved file.
- **Cross-plan precondition verified before consumption.** Before consuming `.social-icon` and `.btn-primary` from `global.css`, ran the two regex checks `grep -qE '\.social-icon\s*\{' src/styles/global.css` and `grep -qE '\.btn-primary\s*\{' src/styles/global.css` — both passed (Plan 03-02 Task 2 delivered both rules). No fallback CSS added in this plan.

## Deviations from Plan

None. The plan executed exactly as written. All four tasks completed on first attempt; all source-level grep gates and behavior gates passed without revision. Prettier (pre-commit hook) normalized JSX whitespace on the three component files — semantically identical output, no acceptance-criterion gates affected.

## Issues Encountered

None. No authentication gates, no architectural decisions, no blockers, no Iconify-id-not-found errors during build. The pre-existing `prettier-plugin-tailwindcss` "file is not a known CSS property" warnings from the Vite build pipeline are carried forward from Plan 03-02 SUMMARY (deviation 3 — out of scope, build exits 0).

## User Setup Required

None — fully autonomous plan, no external service configuration.

## Next Plan Readiness

- **Plan 03-04 (Wave 3 — Education / Work / Leadership list sections):** Can use the same `getCollection(name, ({ data }) => import.meta.env.PROD ? !data.draft : true)` pattern Testimonials.astro just established here. Can consume `.text-muted` for the right-column date span (verified present in global.css via Plan 03-02). Can use the same `<hr class="m-0 border-black/10" />` trailing-rule shape.
- **Plan 03-05 (Wave 3 — Projects with images):** Can use the same `getCollection` + `render()` + `<Content />` markdown body pattern (Testimonials demonstrated it for a non-image collection; Projects layers `image()` schema on top). Can use the `.project-card:nth-child(even)` alternating-row CSS already in `global.css` (Plan 03-02). Same trailing-rule shape.
- **Plan 03-06 (CDN strict gate + scroll-spy + sidebar):** The IntersectionObserver scroll-spy needs all 8 section ids present in `dist/index.html` — Plan 03-03 has now delivered `about`, `skills`, `testimonials` (3 of the 8); Plan 03-04 + Plan 03-05 will deliver the remaining 4 (`education`, `work`, `leadership`, `projects`). The CDN strict gate (`grep -rE "fontawesome|iconify\.design|devicon\.com|cdnjs|stackpath|jsdelivr"`) already passes at this point (verified — exit 1).
- **Phase 4 (SEO/meta):** All 8 section components will be wired by end of Phase 3 Wave 3; Phase 4's `<BaseHead>` work can read finalized resume content via the same Content Layer collections this plan demonstrated.

No blockers for Wave 3 continuation. About + Skills + Testimonials render real content from typed Content collections; build is green; smoke suite is green; zero CDN refs; zero React hydration on section components; Tailwind marker preserved.

## Self-Check: PASSED

Verified after writing this SUMMARY:

- `[ -f src/components/About.astro ]`: FOUND
- `[ -f src/components/Skills.astro ]`: FOUND
- `[ -f src/components/Testimonials.astro ]`: FOUND
- `git log --oneline | grep 5e6e28b`: FOUND (Task 1)
- `git log --oneline | grep af45417`: FOUND (Task 2)
- `git log --oneline | grep 5142fde`: FOUND (Task 3)
- `wc -l src/components/About.astro` → 77 ≥ 40: PASSED
- `wc -l src/components/Skills.astro` → 37 ≥ 25: PASSED
- `wc -l src/components/Testimonials.astro` → 49 ≥ 20: PASSED
- `grep -q "getEntry('about'" src/components/About.astro`: PASSED
- `grep -q "getEntry('skills'" src/components/Skills.astro`: PASSED
- `grep -q "getCollection('testimonials'" src/components/Testimonials.astro`: PASSED
- `! grep -qE '\bhr\b[^a-z]' src/components/Testimonials.astro`: PASSED (0 matches)
- `grep -qE 'class="m-0 border-black/10"' src/components/About.astro`: PASSED
- `grep -qE 'class="m-0 border-black/10"' src/components/Skills.astro`: PASSED
- `! grep -rE "client:(load|visible|idle)" src/components/About.astro src/components/Skills.astro src/components/Testimonials.astro`: PASSED
- `npm run build` exits 0: PASSED
- `npx vitest run tests/smoke.test.ts` → 5/5: PASSED
- `grep -l '#abc123' dist/_astro/*.css`: dist/\_astro/BaseLayout.DV1NkKH4.css — PASSED

---

_Phase: 03-sections-navigation_
_Completed: 2026-05-27_
