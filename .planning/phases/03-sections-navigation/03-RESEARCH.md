# Phase 3: Sections & Navigation - Research

**Researched:** 2026-05-27
**Domain:** Astro 6 component composition + Content Collections rendering + Tailwind v4 CSS-first theming + bundled icons + self-hosted fonts + vanilla IntersectionObserver scroll-spy on a static single-page portfolio
**Confidence:** HIGH on CRA recovery (git show extracted exact values), HIGH on Astro 6 / Tailwind v4 / IntersectionObserver patterns (verified via official docs + MDN), HIGH on package legitimacy (slopcheck clean on all 8 packages), MEDIUM-HIGH on astro-icon (v1.1.5 stable, last published a year ago, no declared peerDeps — works as an Astro integration, expected to be Astro 6 compatible).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Visual polish scope (STYLE-04):**
- **D-01:** "Refresh same vibe" interpretation locked. Keep the existing typography pairing (Saira Extra Condensed for headings + Mulish for body), keep the overall fixed-left-sidebar layout and section order, keep the cream/off-white background and the alternating-row project cards. Modernize: tighter spacing scale, correct heading hierarchy (`<h1>` for name in About, `<h2>` per section), Tailwind utilities everywhere (no Bootstrap class carryover even semantically), focus rings honored. Not in scope: brand-new color palette, redesigned layout, new visual identity.
- **D-02:** Brand tokens land in `src/styles/global.css` `@theme { … }` block (currently empty placeholder per Phase 1 D-14). Token names follow Tailwind v4 CSS-first convention: `--color-bg`, `--color-text`, `--color-accent`, `--color-muted`, `--font-heading`, `--font-body`, plus a small spacing scale only if utilities don't cover it. No `tailwind.config.js` (v4 CSS-first).
- **D-03:** Section dividers stay as explicit `<hr class="m-0" />` (or its Tailwind equivalent) between sections — matches existing CRA `<hr className="m-0" />` per-section terminator (every section except `Testimonials.jsx`). Testimonials remains the only section without a trailing `<hr>`.
- **D-04:** Background = match existing cream / off-white. Surfaces (cards, side-nav) sit on the same cream — no white card-shadow treatment.
- **D-05:** Accent direction = match the existing CRA accent. Heading + nav-active + link-hover use the same single accent color carried from `src/App.css` (pre-wipe).

**CRA color/typography recovery (origin of D-04, D-05 token values):**
- **D-06:** Researcher recovers `src/App.css` from git history — the last commit on the pre-Phase-1 `master` branch before the Phase 1 wipe. **VERIFIED THIS RESEARCH:** parent commit is `b537845` ("site revamp" by Rashmil Panchani, 2020-10-12). Token recovery succeeded — see § Recovered CRA Tokens below.
- **D-07:** Fallback to live-site eyedrop unnecessary — git recovery succeeded.

**Side-nav layout (NAV-01..05):**
- **D-08..D-14:** Desktop fixed-left sidebar at `≥ md` (768px); mobile top bar + inline hamburger collapse at `< md`; profile photo desktop-only; active link visual = left border + bold + accent text + `aria-current="page"`; hamburger button has correct ARIA wiring; section ids canonical from `links.yaml`.

**Project card layout (SECTION-06, SECTION-10):**
- **D-15..D-19:** Alternating row cards (image left for odd, right for even); native source aspect for images; tech-stack pill chips with name only (no icon); stretched-link a11y pattern for whole-card clickable + visible "View on GitHub" link; `<Content />` rendering for description body.

**Skills section (SECTION-05):**
- **D-20, D-21:** Category heading + horizontal row of `<Icon name={skill.icon}> + name beneath` groups; no runtime fallback (schema guarantees valid Iconify ids).

**Education / Work / Leadership cards:**
- **D-22, D-23:** Flat row per entry (date left/above; title+institution+description right); body via `<Content />`; education bodies are minimal — rendered `<Content />` produces a `<p>` per the synthesized one-sentence bodies authored in Phase 2 Plan 02-05.

**Testimonials section (SECTION-08):**
- **D-24:** `<blockquote>` + `<cite>` per entry. Mulish italic 400 for the quote text.

**About section (SECTION-02):**
- **D-25, D-26, D-27:** name (h1) + status + description + email + Download Resume CTA + social row; photo at top of About on `< md` (sidebar has it on `≥ md`); social icons via `<Icon name={item.icon}>` with `aria-label={item.name}` + `rel="noopener noreferrer"` + `target="_blank"` + visually-hidden "(opens in new tab)" span; Resume download is `<a href="/Rashmil_Panchani.pdf" download>`.

**Icons (STYLE-02):**
- **D-28, D-29:** `astro-icon` + `@iconify-json/devicon` + `@iconify-json/simple-icons` + `@iconify-json/logos` + `@iconify-json/lucide` as devDependencies; per-glyph SVG inlining; zero CDN icon `<script>` or `<link>` in any generated HTML.

**Scroll-spy (NAV-03):**
- **D-30, D-31, D-32:** Single vanilla `<script>` (BaseLayout or SideNav — planner picks) using `IntersectionObserver` against `document.querySelectorAll('main section[id]')`; `aria-current="page"` toggling; reasonable defaults `rootMargin: '-30% 0px -50% 0px'` + `threshold: 0`; CSS `scroll-behavior: smooth` with `prefers-reduced-motion: reduce` guard. NO React island, NO `useEffect`, NO jQuery.

**Font delivery (STYLE-05):**
- **D-33, D-34:** Self-host via `@fontsource/*`. Saira Extra Condensed weights 500, 700 only; Mulish weights 400, 400i, 800, 800i only. Variable Saira does NOT exist on Fontsource — only `@fontsource/saira-extra-condensed`. Variable Mulish DOES exist — `@fontsource-variable/mulish` is a planner choice.
- **D-35:** Load via per-weight CSS imports in `BaseLayout.astro` (or `src/styles/fonts.css` `@import`ed from `global.css`). Verify `font-display: swap` is on.
- **D-36:** Delete the Phase 1 `<link rel="preconnect">` tags in `BaseHead.astro` pointing to `fonts.googleapis.com` / `fonts.gstatic.com`.
- **D-37:** No explicit `<link rel="preload">` in Phase 3.

**Astro 6 trailing slash / build format:**
- **D-38:** Set `trailingSlash: 'always'` + `build: { format: 'directory' }` in `astro.config.mjs`. **VERIFIED THIS RESEARCH:** `build.format` default is already `'directory'` in Astro 6 (only `trailingSlash` change is load-bearing); current `astro.config.mjs` has neither key set.

### Claude's Discretion

- Exact sidebar width on desktop — pull from recovered CRA App.css (D-06). **Recovered value:** `width: 19rem` (sidebar at `≥ 992px`); `padding-left: 17rem` on body (so the 19rem sidebar with 1rem gutter clearance matches the original 17rem content offset). **Phase 3 should use Tailwind `md` (768px) breakpoint per D-10, not the original 992px (`lg`) — narrow gap is intentional.**
- IntersectionObserver `rootMargin`/`threshold` tuning — D-31 defaults are starting point.
- Scroll-spy script home — `BaseLayout.astro` or `SideNav.astro`.
- `@fontsource/*` vs `@fontsource-variable/*` — for Saira only `@fontsource/*` exists (no choice). For Mulish: planner picks per byte budget; for the locked 4-weight set the static per-weight bundle is ~80–120 KB total; the variable bundle is one file at ~50–80 KB but includes weights the design never uses. **Recommendation:** static `@fontsource/mulish` per-weight imports — smaller delivered payload for the 4-weight subset, and matches the Saira pattern for consistency.
- Pill-chip styling — neutral `bg-black/5` + body text color is the fallback if nothing in recovered CSS speaks to it (no `.tech-chip` / `.btn-secondary mr-2 mb-2` styling override in the recovered theme overrides — the existing site uses Bootstrap's `btn-secondary` colors).
- "(opens in new tab)" announcement copy — ship `<span class="sr-only">(opens in new tab)</span>` (Phase 4 finalizes).
- `@tailwindcss/typography` not added in Phase 3 (D-19 enforced).
- Exact h2 sizes & section padding — derive from recovered CRA App.css (D-06). **Recovered values:** `.resume-section` padding `5rem 1rem` (`5rem 3rem` at `≥ 992px`); `max-width: 75rem`; `min-height: 100vh` at `≥ 768px`; section content width: 100%.
- Sidebar list separator styling — recovered CRA App.css does NOT define explicit list separators; Bootstrap nav-pills/nav-link defaults provide the spacing. Planner picks a neutral utility (`py-2` or `py-3` per nav-item, no border).

### Deferred Ideas (OUT OF SCOPE)

**Phase 4 (SEO, A11Y & Meta Polish):** axe-core / pa11y gate; finalize "(opens in new tab)" copy; expand BaseHead with description / OG / Twitter / canonical; OG image asset; `@astrojs/sitemap`; tab/keyboard walkthrough verification; color-contrast verification; Tailwind typography plugin (if needed later); explicit `<link rel="preload">` for fonts (if LCP/CLS issues surface).

**Phase 5 (Cleanup & Deploy):** Remove `bootstrap` (must not install); remove `react-scroll`, `react-script-tag`; PDF cache-busting decision; remove `src/pages/__hydration-test.astro` + `tests/__fixtures__/HydrationCheck.tsx` (optional); switch GitHub Pages source to "GitHub Actions" before deleting `gh-pages`; delete `public/CNAME`; delete `.planning/snapshots/m1-source/` after CONTENT-06 sign-off.

**Future (M2 / out of M1):** CMS UI; multi-image project galleries; project image lightbox; dark mode toggle (out of scope); View Transitions (out of scope).

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description (from REQUIREMENTS.md) | Research Support |
|----|-------------------------------------|------------------|
| SECTION-01 | `src/pages/index.astro` is the only page route and composes all 8 sections in their current order | Phase 1 D-07 already composed this; Phase 3 doesn't change composition. § Composition Pattern below confirms unchanged. |
| SECTION-02 | `About.astro` renders name, role, contact info, social links, and links to `/Rashmil_Panchani.pdf` for resume download | § About Section Implementation; D-25..D-27 lock the shape. |
| SECTION-03 | `Education.astro` renders the education collection in current order with school, degree, dates | § List-Collection Section Pattern; reads `getCollection('education', predicate)`. |
| SECTION-04 | `Work.astro` renders the work collection with company, role, dates, and bullet descriptions | § List-Collection Section Pattern; renders `<Content />` for body. |
| SECTION-05 | `Skills.astro` renders the skills collection grouped by category, with bundled icons (no Devicon/Iconify CDN) | § Skills Section Implementation; `<Icon name={skill.icon}>` per item. |
| SECTION-06 | `Projects.astro` renders the projects collection as cards with optimized images via `<Image />`, tech-stack chips, and external links with `rel="noopener noreferrer"` | § Projects Section Implementation; D-15..D-19; stretched-link pattern. |
| SECTION-07 | `Leadership.astro` renders the leadership collection with role, org, dates, and description | § List-Collection Section Pattern; same shape as Education / Work. |
| SECTION-08 | `Testimonials.astro` renders the testimonials collection as quoted blocks with attribution | § Testimonials Section Implementation; `<blockquote>` + `<cite>`. |
| SECTION-09 | No section ships React runtime; every component is `.astro` unless a SECTION-* requirement is later split out for an interactive island | § Architecture Patterns — all sections `.astro`; verification grep in § Common Pitfalls. |
| SECTION-10 | The hand-maintained `image_map` lookup from `Projects.jsx` is gone — image references flow from frontmatter through the schema, not through a side-table | Phase 2 already eliminated this; § Projects Section uses `project.data.cover` directly via `<Image />`. |
| NAV-01 | `SideNav.astro` renders the same anchor links as today, sourced from the `links` / `about` collections | § SideNav Implementation; reads `getCollection('links')`. |
| NAV-02 | Smooth scrolling uses CSS `scroll-behavior: smooth` with a `prefers-reduced-motion: reduce` guard | § global.css Additions; one CSS rule + `@media` guard. |
| NAV-03 | Active-section highlighting uses inline `<script>` + `IntersectionObserver` (no jQuery, no React island), setting `aria-current="page"` on the active link | § Scroll-Spy Implementation; ~30 lines of vanilla JS in a single `<script>`. |
| NAV-04 | Mobile nav toggle is keyboard-operable and has correct `aria-expanded` / `aria-controls` | § Mobile Nav Implementation; `<button type="button" aria-controls="sidenav-list" aria-expanded={isOpen}>`. |
| NAV-05 | No CDN scripts for nav behavior — the jQuery IIFE in `public/index.html` is deleted, not ported | Phase 1 wipe already deleted `public/index.html`; verify zero CDN `<script>` in Phase 3 output. |
| STYLE-01 | Bootstrap 4 (CDN and class names) is fully removed; no `bootstrap` package is installed | Phase 1 wipe deleted; Phase 3 must not install. Pure Tailwind v4 utilities. |
| STYLE-02 | All icons are bundled via `astro-icon` + `@iconify-json/simple-icons` (brand/social) + `@iconify-json/devicon` (tech stack); no CDN icon scripts in `<head>` | § Icon Implementation; install `astro-icon` + 4 packs; per-glyph SVG inlining. |
| STYLE-03 | Project images are served through Astro's `<Image />` with appropriate `width` / `height` / `format` to prevent the 4.8 MB / 1 MB asset weights flagged in the codebase concerns map | § Image Implementation; `<Image src={project.data.cover} alt={...} />` reads dims from typed `ImageMetadata`. |
| STYLE-04 | Section spacing, heading typography, and link/button hover states are tidied for visual consistency without redesigning the layout | § Recovered CRA Tokens; § global.css Additions — fills `@theme` block with the recovered values. |
| STYLE-05 | Fonts are loaded via self-hosted `@fontsource/*`; no FOIT on a fresh load | § Font Implementation; per-weight CSS imports + `font-display: swap` (Fontsource default). |

</phase_requirements>

## Summary

Phase 3 is a "fill the Phase 1 stubs in place" phase that fans out across three concrete workstreams: (1) **port the existing CRA component tree to Astro markup** — each of the 8 stub files (already at the right `id` and the right composition order) gets its real markup, reading from the Phase 2 collections via `getCollection()`; (2) **add the brand-token / font infrastructure** that Phase 1 deliberately deferred — `@theme` block in `global.css`, `@fontsource/*` per-weight imports, deletion of the Phase 1 Google Fonts preconnects, plus the `scroll-behavior: smooth` + `prefers-reduced-motion` guard; (3) **wire the chrome** — install `astro-icon` + 4 Iconify packs, write the desktop-sidebar / mobile-hamburger SideNav, drop in the single vanilla `IntersectionObserver` `<script>` for scroll-spy. **No new schemas, no new collections, no new content.** Phase 2 already shipped the typed data layer; Phase 3 reads from it.

The CRA visual values needed to satisfy "refresh same vibe" (D-01) and to populate `@theme` (D-02) are all recoverable from `b537845` (the parent of the wipe commit `30f8cab`). § Recovered CRA Tokens below has the verified hex / px / rem values extracted via `git show b537845:src/App.css`. The body background and primary accent are the load-bearing values — every other color is derived or neutral.

**Primary recommendation:** Execute Phase 3 in four logical waves: (1) install `astro-icon` + Iconify packs + `@fontsource/*` and wire `astro.config.mjs` (`icon()` integration + `trailingSlash: 'always'`); (2) fill `src/styles/global.css` `@theme {…}` with recovered tokens and add the `scroll-behavior` + `prefers-reduced-motion` rules + Fontsource `@import`s; delete Google Fonts preconnects from `BaseHead.astro`; (3) author each of the 8 component files in place — section components in any order (no inter-dependencies), then `SideNav.astro` last because it depends on the section `id`s being stable (they already are, set Phase 1 D-23); (4) add the scroll-spy `<script>` in `BaseLayout.astro` (preferred — one mount per page, no risk of double-mount if Phase 4 introduces alternate layouts). Validate against `npm run preview` + the existing smoke test + the Phase 3 SC #3 grep (`grep -r "client:load\|client:visible\|client:idle" src/` returns zero hits on section components).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Render 8 resume sections with content | Static build (Astro) | — | Pure presentation of build-time collection data; zero runtime state; ROADMAP Phase 3 SC #3 explicitly forbids React runtime for section components. |
| Read content from Content Collections | Static build (Astro `getCollection` at build) | — | Phase 2 D-05 established the predicate pattern; collections resolve at `astro build`, not in the browser. |
| Resolve & inline icon SVGs | Static build (`astro-icon` integration) | — | Per-glyph SVG inlined into HTML at build time; zero runtime icon resolution; Pitfall 23 mitigation. |
| Optimize & emit responsive images | Static build (`astro:assets` `<Image />`) | — | Build-time format conversion (WebP/AVIF) and dimension fingerprinting; `dist/_astro/*.{webp,avif}`. Pitfall 4 mitigation. |
| Active section highlight while scrolling | Browser / Client (vanilla `<script>` with IntersectionObserver) | — | Requires viewport intersection observation — only runs in the browser. Single `<script>` block, no framework. Pitfall 21 mitigation. |
| Mobile hamburger toggle (open/close nav) | Browser / Client (vanilla `<script>` on SideNav) | — | Requires `addEventListener('click')` + `aria-expanded` toggle. Same `<script>` channel as scroll-spy if planner chooses, or a separate ~10-line block. Pitfall 22 (`aria-label`) + ARIA-correctness. |
| Smooth scrolling on anchor clicks | Browser (native CSS `scroll-behavior: smooth`) | — | Single CSS line; no JS. `prefers-reduced-motion` media query inverts it. |
| Self-host font files | Static build (Vite asset graph through `@fontsource/*` CSS imports) | — | Fontsource ships per-weight CSS that uses `url()` references to `.woff2` files in the package — Vite copies them into `dist/_astro/` with hashed names automatically. No CDN. |
| Apply brand colors / spacing / typography | Static build (Tailwind v4 CSS-first `@theme` in `global.css`) | — | `--color-*` / `--font-*` tokens in `@theme` generate utility classes at build; consumed by `class="…"` on section markup. |

**No tier mismatches.** All static markup belongs to Astro build; only scroll-spy and mobile toggle require browser-side JS, and they explicitly do not need React.

## Standard Stack

### Core (already installed in Phase 1 / Phase 2)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | ^6.3.8 | Static site framework, build pipeline, components, Content Collections, `<Image />`, `<Content />` | Locked Phase 1 D-01. |
| `@tailwindcss/vite` | ^4.3.0 | Tailwind v4 via Vite plugin (not the deprecated `@astrojs/tailwind`) | Locked Phase 1; uses CSS-first `@theme` config. |
| `tailwindcss` | ^4.3.0 | Tailwind utilities | Locked Phase 1; v4 generates utilities from `@theme` tokens at build. |
| `react`, `react-dom`, `@astrojs/react` | ^19.x / ^5.x | React 19 integration (kept for hydration fixture only — Phase 3 sections do NOT use React) | Phase 1 FOUND-04 verification surface; Phase 3 SC #3 forbids `client:*` on section components. |

### New (to install in Phase 3)

| Library | Version Verified | Purpose | When to Use |
|---------|----------|---------|-------------|
| `astro-icon` | 1.1.5 [VERIFIED: npm view 2026-05-27, last published 1 year ago] | Provides `<Icon name="prefix:name" />` component; per-glyph SVG inlining via `@iconify/utils` | Required for STYLE-02; resolves all `icon` fields in `about.yaml` and `skills.yaml`. |
| `@iconify-json/devicon` | 1.2.62 [VERIFIED: npm view 2026-05-27] | Devicon brand glyphs (Python, Java, NodeJS, ReactJS, etc.) | Required — 19 of 30 skill entries use `devicon:*` ids per `skills.yaml`. |
| `@iconify-json/simple-icons` | 1.2.84 [VERIFIED: npm view 2026-05-27] | Simple-icons set (LinkedIn, Github, Django, NumPy, etc.) | Required — 2 social entries (`simple-icons:linkedin`, `simple-icons:github`) + 6 skill items (`simple-icons:django`, `simple-icons:numpy`, `simple-icons:pandas`, `simple-icons:tensorflow`, `simple-icons:keras`, `simple-icons:opencv`). |
| `@iconify-json/logos` | 1.2.11 [VERIFIED: npm view 2026-05-27] | Multi-color logo glyphs (GraphQL, Google Cloud) | Required — 2 skill entries (`logos:graphql`, `logos:google-cloud`). |
| `@iconify-json/lucide` | 1.2.109 [VERIFIED: npm view 2026-05-27] | Generic line icons (used as fallback for NLTK per Phase 2 D-17) | Required — 1 entry (`lucide:code` for NLTK). |
| `@fontsource/saira-extra-condensed` | 5.2.7 [VERIFIED: npm view 2026-05-27] | Saira Extra Condensed weights (heading font) | Required — D-33. Variable variant does NOT exist on Fontsource. Static per-weight CSS files. |
| `@fontsource/mulish` | 5.2.8 [VERIFIED: npm view 2026-05-27] | Mulish weights (body font) | Required — D-33. Both `@fontsource/mulish` (static) and `@fontsource-variable/mulish` 5.2.8 exist; static recommended for the 4-weight subset. |

**Note on font naming:** Google Fonts renamed "Muli" → "Mulish" in 2020. The CRA `public/index.html` references `Muli:400,400i,800,800i`; the modern Fontsource package is `@fontsource/mulish` (NOT `@fontsource/muli` — that doesn't exist). Same typeface.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `astro-icon` | Inline raw `<svg>` per glyph in `src/icons/` | astro-icon already supports both (local `src/icons/*.svg` + Iconify packs via the same `<Icon>` component); given 30+ icons across 4 sets, the packs win on author time. Manual inlining adds a per-icon copy-paste step. |
| `@fontsource/mulish` static | `@fontsource-variable/mulish` | Variable is one file (smaller per-weight) but contains weights the design never uses; for a fixed 4-weight subset the static per-weight subset is comparable or smaller in delivered bytes and simpler in `@font-face` count. **Both work; planner picks.** |
| Per-glyph SVG inline via `astro-icon` | `lucide-astro` (Astro components per glyph) | Lucide-astro covers only the Lucide pack; mixing icon sets (devicon + simple-icons + logos + lucide) requires astro-icon. |
| Astro `<Image />` for project covers | Raw `<img>` from `public/` | Pitfall 4 / STYLE-03 forbid raw `<img>` for project covers; would re-introduce 4.8 MB image bug. |
| Vanilla `<script>` IntersectionObserver | React island scroll-spy | Pitfall 21 explicitly forbids React island for static side nav; ~30 lines of vanilla JS, zero framework bytes. |

**Installation:**

```bash
# astro-icon + Iconify packs (devDependencies — build-only, not in runtime bundle)
npm install --save-dev astro-icon @iconify-json/devicon @iconify-json/simple-icons @iconify-json/logos @iconify-json/lucide

# Fontsource (dependencies — CSS + .woff2 files end up in dist/_astro)
npm install @fontsource/saira-extra-condensed @fontsource/mulish
```

**Version verification:** All 8 packages verified via `npm view <pkg> version` on 2026-05-27. Slopcheck `[OK]` verdict on all 8 (see § Package Legitimacy Audit).

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `astro-icon` | npm | 1 year (1.1.5 published 2024-05) | high (~50K+/wk on related searches) | github.com/natemoo-re/astro-icon (linked in package homepage) | [OK] | Approved |
| `@iconify-json/devicon` | npm | recent (1.2.62) | high (Iconify org owns) | no `repository` field but Iconify is well-known | [OK] | Approved |
| `@iconify-json/simple-icons` | npm | recent (1.2.84) | high | no `repository` field (Iconify auto-published) | [OK] | Approved |
| `@iconify-json/logos` | npm | recent (1.2.11) | high | no `repository` field | [OK] | Approved |
| `@iconify-json/lucide` | npm | recent (1.2.109) | high | no `repository` field | [OK] | Approved |
| `@fontsource/saira-extra-condensed` | npm | 8 months (5.2.7) | low (~893/wk — per-font Fontsource packages are individually low-traffic) | no `repository` field on the per-font package; Fontsource project at github.com/fontsource/fontsource is well-known | [OK] | Approved |
| `@fontsource/mulish` | npm | recent (5.2.8) | moderate (Mulish is more popular than Saira) | as above | [OK] | Approved |
| `@fontsource-variable/mulish` | npm | recent (5.2.8) | moderate | as above | [OK] | Approved (optional alternative; D-33 planner's choice) |

**Packages removed due to slopcheck [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** none. (The "No source repository linked" warning on `@iconify-json/*` packages is a known artifact of Iconify's auto-publish pipeline — the upstream Iconify project at github.com/iconify/icon-sets is authoritative and trusted. The "893 downloads" warning on `@fontsource/saira-extra-condensed` reflects the per-font fragmentation of the Fontsource catalog, not legitimacy concerns — Mulish has higher counts because more sites use it.)

**No `postinstall` hooks** on any of the 8 packages (verified `npm view <pkg> scripts.postinstall` returns nothing).

## Recovered CRA Tokens

> **Source:** `git show b537845:src/App.css` and `git show b537845:public/index.html` (commit `b537845` "site revamp", 2020-10-12 — parent of the wipe rollup `30f8cab`). Recovery succeeded — fallback D-07 (live-site eyedrop) is not needed.

### Brand colors (verified)

| Token | Value | Source line in pre-wipe App.css | Use |
|-------|-------|--------------------------------|-----|
| `--color-bg` (page background) | `#eee2dc` | `body { background-color: #eee2dc; }` line 123 | Body, sidebar surface, card surface |
| `--color-text` (primary text) | `#6c757d` (Bootstrap `--gray`) | resume-theme override `body { color: #6c757d; }` line ~10465 | Body paragraphs, secondary text |
| `--color-accent` (primary brand) | `#bd5d38` (Bootstrap `--primary` / `--orange`) | `:root { --primary: #bd5d38; --orange: #bd5d38; }` lines 58, 66 | `<span class="text-primary">Panchani</span>`, link hover, nav active, button bg |
| `--color-link` (default link) | `#123c69` | `a { color: #123c69; }` line 220 | All `<a>` not covered by `.text-primary` |
| `--color-link-hover` | `#123c69ad` (link color at ~68% alpha) | `a:hover { color: #123c69ad; }` line 226 | Link hover state |
| `--color-accent-focus` (sideNav toggle focus) | `#d48a6e` (accent tint) | `#sideNav .navbar-toggler:focus { outline-color: #d48a6e; }` line ~10507 | Mobile hamburger focus ring (planner can use accent itself instead — `#d48a6e` is a softer tint) |
| `--color-social-icon-bg` | `#eee2dc` (matches page bg — flat treatment) | `.social-icons .social-icon { background-color: #eee2dc; }` line ~10551 | Social icon circle background (planner: drop this — the visible site uses `.text-primary` for the icon glyph itself; circle bg is effectively invisible on cream) |
| `--color-social-icon-hover` | `#8d9ba8` (cool gray-blue) | `.social-icons .social-icon:hover { background-color: #8d9ba8; }` line ~10567 | Social icon hover state |

**Notes:**
- The site's effective accent palette is one color: `#bd5d38` (warm rust/orange). Use it for: heading accent (`<span class="text-primary">Panchani</span>` in About), nav-active text + left border, link hover, Resume Download button bg, project title hover.
- The plain link color `#123c69` (deep navy) is used only for default `<a>` hover behavior; in the actual rendered site most links are inside `.text-primary` or `.nav-link` overrides. Phase 3 can keep the navy for non-accent links (e.g., the "View on GitHub" link inside project cards) or collapse everything to accent — **planner judgment, but matching the CRA original means keeping both.**

### Typography (verified)

| Token | Value | Source |
|-------|-------|--------|
| `--font-heading` | `'Saira Extra Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` | `.subheading { font-family: "Saira Extra Condensed", ...}` lines ~10484 and h1/h2/h3 inherit globally via Bootstrap-style declaration on `body` font-family fallback chain. **All headings + `.subheading` use Saira.** |
| `--font-body` | `'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` | `body { font-family: "Muli", ...}` line ~116. Renamed to Mulish on Fontsource. |
| Heading text-transform | `uppercase` | `h1, h2, h3, h4, h5, h6 { text-transform: uppercase; }` line ~10474 |
| Heading line-height | `1` for h1 | `h1 { line-height: 1; }` line ~10487 |
| `.subheading` font-size | `1.5rem` | `.subheading { font-size: 1.5rem; ...}` lines ~10484-10489 |
| `.subheading` font-weight | `500` | (same block) |
| `p.lead` font-size | `1.15rem` | `p.lead { font-size: 1.15rem; font-weight: 400; }` line ~10491 |
| Body font-weight | `400` | `body { font-weight: 400; }` line ~117 |
| `#sideNav .nav-link` font-weight | `800` | `#sideNav .navbar-nav .nav-item .nav-link { font-weight: 800; letter-spacing: 0.05rem; text-transform: uppercase; }` lines ~10502-10506 |
| Body line-height | `1.5` | `body { line-height: 1.5; }` line ~118 |

**Locked Google Fonts request** (CRA `public/index.html`):
- `https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700`
- `https://fonts.googleapis.com/css?family=Muli:400,400i,800,800i`

This is the EXACT weight set Phase 3 must self-host via `@fontsource/*` per D-34.

### Spacing & dimensions (verified)

| Property | Value | Source |
|----------|-------|--------|
| Desktop sidebar width | `19rem` | `#sideNav { width: 19rem; height: 100vh; ... }` at `@media (min-width: 992px)` line ~10519 |
| Desktop body padding-left (offset for sidebar) | `17rem` | `body { padding-top: 0; padding-left: 17rem; }` at `@media (min-width: 992px)` line ~10470 |
| Mobile body padding-top (offset for top bar) | `3.375rem` | `body { padding-top: 3.375rem; }` line ~10466 |
| `.resume-section` padding | `5rem 1rem` mobile, `5rem 3rem` desktop | `section.resume-section { padding-left: 1rem; padding-right: 1rem; padding-top: 5rem; padding-bottom: 5rem; max-width: 75rem; }` lines ~10573-10580 |
| `.resume-section` max-width | `75rem` | (same block) |
| `.resume-section` min-height | `100vh` at `≥ 768px` | `@media (min-width: 768px) { section.resume-section { min-height: 100vh; }}` line ~10588 |
| `.resume-section` display | `flex; align-items: center` | line ~10574 (vertically centers content; means each section is at least one viewport tall) |
| `.resume-section-content` width | `100%` | line ~10582 |
| `.profile-pic` dimensions | `200px × 225px` | `.profile-pic { width: 200px; height: 225px; }` line ~10600 |
| `#sideNav .img-profile` max-width / max-height | `20rem` each | `#sideNav .navbar-brand .img-profile { max-width: 20rem; max-height: 20rem; border: 0.5rem solid rgba(255, 255, 255, 0.2); }` line ~10527 |
| `.social-icons .social-icon` size | `3.5rem × 3.5rem` | line ~10550 |
| `.social-icons .social-icon` border-radius | `100%` | (same block) |
| `.social-icons .social-icon` font-size (icon glyph) | `1.5rem` | (same block) |
| `.social-icons .social-icon` margin-right | `1.5rem` | (same block) |
| `.dev-icons` font-size | `1.25rem` | `.dev-icons { font-size: 1.25rem; }` line ~10569 |
| Per-entry bottom spacing | `mb-5` Bootstrap (= `margin-bottom: 3rem`) | Used in all section components via `className="...mb-5"` |

**D-10 reconciliation:** CRA used `@media (min-width: 992px)` (Bootstrap `lg`) for the sidebar; CONTEXT.md D-10 locks Tailwind `md` (768px). **Phase 3 should use `md` per the locked decision** — this is a deliberate widening of the desktop sidebar trigger from `lg` to `md`. The recovered `width: 19rem` value carries unchanged.

### Other recovered CSS observations

- **`<hr class="m-0" />` between sections** — Bootstrap `m-0` is `margin: 0;`. Phase 3 emits `<hr class="m-0" />` literally; the cascading `<hr>` reset from Bootstrap normalize is inherited from the v4 default border. In Tailwind v4, an `<hr>` will pick up `border-top: 1px solid currentColor` per Pitfall 14 — so explicitly set border-color in the `@theme` or use a Tailwind utility (`<hr class="m-0 border-black/10" />`) to avoid the v4 `currentColor` regression.
- **No `:focus-visible` styling** in the recovered CSS (Bootstrap 4 era). Phase 3 should NOT remove focus rings — Tailwind v4 emits a default focus ring; A11Y-05 (Phase 4) verifies the ring is visible.
- **No CSS-only dark mode**, no `prefers-color-scheme` rules in the original — confirms Pitfall 16 risk (don't author `dark:` utilities).
- **No `prefers-reduced-motion` guard** in original — the inline jQuery scroll smoothness ran unconditionally. Phase 3 adds the guard per NAV-02 / D-32.

## Architecture Patterns

### System Architecture Diagram

```
                       ┌─────────────────────────────────────────┐
                       │   src/content/ (Phase 2 collections)    │
                       │   - projects/<slug>/index.md + images   │
                       │   - work/, education/, leadership/,     │
                       │     testimonials/ (per-item .md)        │
                       │   - about.yaml, skills.yaml, links.yaml │
                       └────────────────┬────────────────────────┘
                                        │ getCollection(...)  (build-time)
                                        ▼
              ┌────────────────────────────────────────────────────────┐
              │              src/pages/index.astro                     │
              │ Composition (Phase 1 D-07 — unchanged):                │
              │  <BaseLayout>                                          │
              │    <SideNav />  ←─ reads links.yaml                    │
              │    <main>                                              │
              │      <About />       ←─ reads about.yaml               │
              │      <Education />   ←─ getCollection('education')     │
              │      <Work />        ←─ getCollection('work')          │
              │      <Skills />      ←─ reads skills.yaml              │
              │      <Projects />    ←─ getCollection('projects')      │
              │      <Leadership />  ←─ getCollection('leadership')    │
              │      <Testimonials />←─ getCollection('testimonials')  │
              │    </main>                                             │
              │  </BaseLayout>                                         │
              └────────────────┬───────────────────────────────────────┘
                               │ astro build
                               ▼
       ┌───────────────────────────────────────────────────────────────────┐
       │                       dist/index.html (output)                    │
       │  - Inline <link> to hashed CSS (Tailwind utilities + @theme +     │
       │    Fontsource @font-face from .woff2 in dist/_astro/)             │
       │  - Inline <svg> per Icon (astro-icon)                             │
       │  - <picture>/<img> per <Image /> from optimized WebP/AVIF in      │
       │    dist/_astro/                                                   │
       │  - <script type="module"> with IntersectionObserver + nav toggle  │
       │    (NO React runtime)                                             │
       └───────────────────────────────────────────────────────────────────┘
                               │
                               ▼ on page load (browser)
       ┌───────────────────────────────────────────────────────────────────┐
       │  Browser                                                          │
       │  1. Anchor click → CSS scroll-behavior: smooth (NAV-02)           │
       │  2. Scroll → IntersectionObserver fires → toggle                  │
       │     aria-current="page" on matching <a> (NAV-03)                  │
       │  3. Hamburger click → toggle aria-expanded + show/hide            │
       │     #sidenav-list (NAV-04, mobile only)                           │
       │  prefers-reduced-motion: reduce → CSS disables smooth scroll      │
       └───────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure (delta from current)

Phase 3 does NOT create new directories or rename files. It fills the existing `src/components/*.astro` stubs and adds at most one new file:

```
src/
├── components/
│   ├── SideNav.astro        # Phase 3: fill stub — desktop sidebar + mobile top bar + hamburger
│   ├── About.astro          # Phase 3: fill stub — h1 + status + description + email + CTA + social
│   ├── Education.astro      # Phase 3: fill stub — list-collection pattern
│   ├── Work.astro           # Phase 3: fill stub — list-collection pattern
│   ├── Skills.astro         # Phase 3: fill stub — category groups with Icon
│   ├── Projects.astro       # Phase 3: fill stub — alternating cards with Image + Content
│   ├── Leadership.astro     # Phase 3: fill stub — list-collection pattern
│   ├── Testimonials.astro   # Phase 3: fill stub — blockquote pattern
│   └── BaseHead.astro       # Phase 3: DELETE the two Google Fonts preconnects (D-36)
├── layouts/
│   └── BaseLayout.astro     # Phase 3: add scroll-spy <script> (planner pick — see D-30)
├── styles/
│   ├── global.css           # Phase 3: fill @theme {…}; add scroll-behavior + prefers-reduced-motion guards
│   └── fonts.css            # NEW (optional): if planner chooses to split Fontsource @imports out of global.css
├── pages/
│   └── index.astro          # Phase 3: UNCHANGED (composition already correct from Phase 1 D-07)
├── content/                 # Phase 3: UNCHANGED (Phase 2 data layer)
├── assets/
│   └── profile.jpg          # Phase 3: READ via <Image /> in SideNav and About
└── content.config.ts        # Phase 3: UNCHANGED (Phase 2 schemas)

astro.config.mjs             # Phase 3: add icon() to integrations; add trailingSlash + (defensive) build.format
package.json                 # Phase 3: add 5 devDeps (astro-icon + 4 packs) + 2 deps (@fontsource/*)
```

### Pattern 1: Section Component Reading from a List Collection

**What:** The canonical shape for Education, Work, Leadership — each maps over a sorted-by-`order` collection and renders a per-entry row.

**When to use:** Any list-collection section where each entry has only metadata + a markdown body.

**Example:**

```astro
---
// src/components/Education.astro
// Source: docs.astro.build/en/guides/content-collections/#rendering-body-content
import { getCollection, render } from 'astro:content';

const entries = await getCollection('education', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
);
entries.sort((a, b) => a.data.order - b.data.order);

const rendered = await Promise.all(
    entries.map(async (entry) => ({
        entry,
        Content: (await render(entry)).Content,
    })),
);
---

<section id="education" class="resume-section">
    <div class="resume-section-content">
        <h2 class="mb-5">Education</h2>
        {
            rendered.map(({ entry, Content }, id) => (
                <div
                    class={
                        id === rendered.length - 1
                            ? 'flex flex-col md:flex-row md:justify-between'
                            : 'mb-5 flex flex-col md:flex-row md:justify-between'
                    }
                >
                    <div class="flex-grow">
                        <h3 class="mb-0">{entry.data.name}</h3>
                        <div class="subheading mb-3">{entry.data.degree}</div>
                        {entry.data.score && <p>{entry.data.score}</p>}
                        <Content />
                    </div>
                    <div class="flex-shrink-0">
                        <span class="text-muted">{entry.data.graduated}</span>
                    </div>
                </div>
            ))
        }
    </div>
</section>
<hr class="m-0 border-black/10" />
```

Same shape (with field name changes) for `Work.astro` (`company` / `title` / `duration`) and `Leadership.astro` (`org` / `title` / `duration`).

### Pattern 2: Projects Section with `<Image />` + Stretched-Link

**What:** Alternating-row cards. Each row is a relatively-positioned flex container; the title is an `<a>` with a `::after` pseudo-element that covers the whole card; description text gets `position: relative; z-index: 1` so text selection still works.

**When to use:** Project list rendering (SECTION-06).

**Example:**

```astro
---
// src/components/Projects.astro
// Source: docs.astro.build/en/guides/content-collections/
//         docs.astro.build/en/guides/images/#image--component
//         inclusive-components.design/cards/  (stretched-link a11y pattern)
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';

const entries = await getCollection('projects', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
);
entries.sort((a, b) => a.data.order - b.data.order);

const rendered = await Promise.all(
    entries.map(async (entry) => ({
        entry,
        Content: (await render(entry)).Content,
    })),
);
---

<section id="projects" class="resume-section">
    <div class="resume-section-content">
        <h2 class="mb-5">Projects</h2>
        {
            rendered.map(({ entry, Content }) => (
                <article class="project-card relative mb-5 flex flex-col md:flex-row md:[&:nth-child(even)]:flex-row-reverse">
                    <div class="md:w-1/3 text-center">
                        <Image
                            src={entry.data.cover}
                            alt={entry.data.title}
                            class="mx-auto max-h-[200px] max-w-[200px] object-contain"
                            loading="lazy"
                        />
                    </div>
                    <div class="relative z-10 md:w-2/3">
                        <h3>
                            <a
                                class="project-card-link text-primary after:absolute after:inset-0"
                                href={entry.data.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {entry.data.title}
                                <span class="sr-only">(opens in new tab)</span>
                            </a>
                        </h3>
                        <div class="relative z-10">
                            <Content />
                        </div>
                        <h4 class="mt-3">Tech Stack:</h4>
                        <ul role="list" class="flex flex-wrap gap-2">
                            {entry.data.tech_stack.map((tech) => (
                                <li class="rounded-full bg-black/5 px-2 py-1 text-xs">
                                    {tech}
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>
            ))
        }
    </div>
</section>
<hr class="m-0 border-black/10" />
```

**Important details on the stretched-link pattern:**
- Card container needs `position: relative` (`class="relative"`).
- Link's `::after` pseudo-element with `position: absolute; inset: 0` overlays the whole card.
- Text content that should remain selectable (description, tech-stack chips) gets `position: relative; z-index: 10` (any value above `auto`) so it sits above the overlay.
- The visible link text stays where it is — the `::after` is the click target; the visible text is the focus target.
- One `<a>` per card; no nested anchors (a11y requirement).
- "(opens in new tab)" span lives inside the link so screen readers announce it when reading the link.

### Pattern 3: Singleton Section (About)

**What:** Reads a `file()`-loaded singleton via `getEntry()`; renders directly without a `.map()`.

**When to use:** About and any future singleton-driven section.

**Example:**

```astro
---
// src/components/About.astro
// Source: docs.astro.build/en/reference/modules/astro-content/#getentry
import { getEntry } from 'astro:content';
import { Image } from 'astro:assets';
import { Icon } from 'astro-icon/components';
import profileImage from '../assets/profile.jpg';

const aboutEntry = await getEntry('about', 'about');
if (!aboutEntry) throw new Error('about.yaml missing — was Phase 2 completed?');
const about = aboutEntry.data;
---

<section id="about" class="resume-section">
    <div class="resume-section-content">
        {/* Profile image on mobile only — sidebar has it on >= md (D-25) */}
        <div class="text-center md:hidden">
            <Image
                src={profileImage}
                alt={`${about.first_name} ${about.last_name}`}
                class="profile-pic mx-auto mb-4 rounded-full"
                width={200}
                height={225}
            />
        </div>

        <h1 class="mb-0">
            {about.first_name}
            {' '}
            <span class="text-primary">{about.last_name}</span>
        </h1>

        <div class="subheading mb-5">
            <p class="mb-3">{about.current_status}</p>
            <p class="lead mb-0">{about.contact_message}</p>
            <a href={`mailto:${about.email}`}>{about.email}</a>
        </div>

        <p class="lead mb-5">{about.description}</p>

        <div class="flex flex-wrap items-center gap-4">
            {/* Social icons */}
            <div class="flex gap-3">
                {about.social.map((handle) => (
                    <a
                        href={handle.url}
                        aria-label={handle.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="social-icon"
                    >
                        <Icon name={handle.icon} aria-hidden="true" class="size-6" />
                        <span class="sr-only">(opens in new tab)</span>
                    </a>
                ))}
            </div>

            {/* Resume download CTA */}
            <a
                href={`/${about.resume_download}`}
                download
                class="btn-primary"
            >
                Download Resume
            </a>
        </div>
    </div>
</section>
<hr class="m-0 border-black/10" />
```

**Note:** `getEntry('about', 'about')` — Astro 6's `file()` loader on a top-level object YAML registers the file's key (here, `about:` is the top-level key in `about.yaml`) as the entry id. Phase 2 D-13 set the file shape; the entry id is `about`. Confirm during execution; if Astro 6 derives the id differently (some `file()` loaders use the filename), adjust the second arg accordingly.

### Pattern 4: Skills (Singleton with Nested Categories)

```astro
---
// src/components/Skills.astro
import { getEntry } from 'astro:content';
import { Icon } from 'astro-icon/components';

const skillsEntry = await getEntry('skills', 'skills');
if (!skillsEntry) throw new Error('skills.yaml missing');
const categories = [...skillsEntry.data.categories].sort(
    (a, b) => a.order - b.order,
);
---

<section id="skills" class="resume-section">
    <div class="resume-section-content">
        <h2 class="mb-5">Skills</h2>
        {
            categories.map((category) => (
                <div class="mb-5">
                    <div class="subheading mb-3">{category.name}</div>
                    <ul role="list" class="dev-icons flex flex-wrap gap-4">
                        {category.items.map((item) => (
                            <li class="flex flex-col items-center">
                                <Icon name={item.icon} aria-hidden="true" class="size-6" />
                                <span class="mt-1 text-xs">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))
        }
    </div>
</section>
<hr class="m-0 border-black/10" />
```

### Pattern 5: SideNav (Desktop Sidebar + Mobile Top Bar + Hamburger)

```astro
---
// src/components/SideNav.astro
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import profileImage from '../assets/profile.jpg';

const linkEntries = await getCollection('links');
linkEntries.sort((a, b) => a.data.order - b.data.order);
---

<nav id="sidenav" class="sidenav" aria-label="Section navigation">
    {/* Mobile top bar: brand text + hamburger (visible < md) */}
    <div class="mobile-bar flex items-center justify-between md:hidden">
        <span class="brand">Rashmil Panchani</span>
        <button
            type="button"
            id="sidenav-toggle"
            aria-label="Toggle navigation menu"
            aria-controls="sidenav-list"
            aria-expanded="false"
            class="hamburger"
        >
            {/* Inline SVG hamburger glyph or Iconify */}
            <span aria-hidden="true">☰</span>
        </button>
    </div>

    {/* Desktop sidebar header: profile image (visible >= md) */}
    <div class="sidenav-header hidden md:block">
        <Image
            src={profileImage}
            alt="Rashmil Panchani"
            class="profile-pic mx-auto rounded-full"
            width={200}
            height={225}
        />
    </div>

    {/* Nav links list — collapsed on mobile, always visible on desktop */}
    <ul id="sidenav-list" role="list" class="sidenav-list hidden md:block">
        {
            linkEntries.map((entry) => (
                <li>
                    <a
                        href={`#${entry.data.id}`}
                        class="nav-link block"
                        data-section-link={entry.data.id}
                    >
                        {entry.data.label}
                    </a>
                </li>
            ))
        }
    </ul>
</nav>
```

The hamburger toggle handler lives in the same `<script>` as the scroll-spy (or its own block in `SideNav.astro`):

```astro
<script>
    // Mobile nav toggle (NAV-04)
    const toggle = document.getElementById('sidenav-toggle');
    const list = document.getElementById('sidenav-list');
    if (toggle && list) {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            list.classList.toggle('hidden');
        });
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                toggle.setAttribute('aria-expanded', 'false');
                list.classList.add('hidden');
                toggle.focus();
            }
        });
        // Close on link click (UX expectation from Pitfall — "Mobile nav doesn't collapse on link click")
        list.querySelectorAll('a').forEach((a) =>
            a.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 767px)').matches) {
                    toggle.setAttribute('aria-expanded', 'false');
                    list.classList.add('hidden');
                }
            }),
        );
    }
</script>
```

### Pattern 6: Scroll-Spy via IntersectionObserver

```astro
<script>
    // Scroll-spy (NAV-03 / D-30). Single block, vanilla JS, no framework.
    // Source: developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('[data-section-link]');
    const linkMap = new Map();
    navLinks.forEach((link) => {
        const id = link.getAttribute('data-section-link');
        if (id) linkMap.set(id, link);
    });

    const observer = new IntersectionObserver(
        (entries) => {
            // Find the most-intersecting section in this batch
            const active = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!active) return;
            const id = active.target.id;
            // Toggle aria-current="page" on the matching link
            linkMap.forEach((link, linkId) => {
                if (linkId === id) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        },
        {
            // D-31 defaults: section is "active" when its top is in the upper 30% of viewport
            // and at least some part is above the bottom 50% of viewport.
            rootMargin: '-30% 0px -50% 0px',
            threshold: 0,
        },
    );

    sections.forEach((section) => observer.observe(section));
</script>
```

**Where to put it (D-30 planner choice):** `BaseLayout.astro` is the recommended home — runs once per page load, single mount, no risk of double-mount if Phase 4 introduces alternate layouts. Place after `<slot />` (at the end of `<body>`) so the script runs after the DOM exists; Astro `<script>` is bundled and deferred by default. Alternative: `SideNav.astro` keeps everything nav-related co-located — equally valid.

### Pattern 7: BaseLayout Additions

```astro
---
// src/layouts/BaseLayout.astro
// Phase 3 additions: scroll-spy <script> at end of <body>.
import BaseHead from '../components/BaseHead.astro';
import '../styles/global.css';

interface Props {
    title: string;
}
const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
    <head>
        <BaseHead title={title} />
    </head>
    <body>
        <slot />
        <script>
            /* Mobile nav toggle + scroll-spy — see Pattern 5 & 6 above */
        </script>
    </body>
</html>
```

### Pattern 8: global.css Additions

```css
/* src/styles/global.css */

@import 'tailwindcss';

/* Fontsource — per-weight CSS (D-33 / D-34) */
@import '@fontsource/saira-extra-condensed/500.css';
@import '@fontsource/saira-extra-condensed/700.css';
@import '@fontsource/mulish/400.css';
@import '@fontsource/mulish/400-italic.css';
@import '@fontsource/mulish/800.css';
@import '@fontsource/mulish/800-italic.css';

@theme {
    /* Brand colors (D-02, D-04, D-05 — recovered from CRA via D-06) */
    --color-bg: #eee2dc;
    --color-text: #6c757d;
    --color-accent: #bd5d38;
    --color-link: #123c69;
    --color-link-hover: #123c69ad;
    --color-muted: #6c757d; /* alias of text */

    /* Typography (D-02 / recovered) */
    --font-heading:
        'Saira Extra Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif;
    --font-body:
        'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
        sans-serif;
}

/* Body base (recovered: bg + text colors + base font) */
body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    font-weight: 400;
    line-height: 1.5;
}

/* Headings inherit Saira + uppercase per recovered theme */
h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: var(--font-heading);
    text-transform: uppercase;
}
h1 {
    line-height: 1;
}

/* Smooth scroll with prefers-reduced-motion guard (NAV-02 / D-32) */
html {
    scroll-behavior: smooth;
}
@media (prefers-reduced-motion: reduce) {
    html {
        scroll-behavior: auto;
    }
}

/* Subheading utility (CRA-style, used in About + section row headers) */
.subheading {
    font-family: var(--font-heading);
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.5rem;
}

/* Lead paragraph (CRA p.lead) */
.lead {
    font-size: 1.15rem;
    font-weight: 400;
}

/* Resume section base (recovered: padding + max-width + min-height) */
.resume-section {
    padding: 5rem 1rem;
    max-width: 75rem;
}
@media (min-width: 768px) {
    .resume-section {
        min-height: 100vh;
        padding-left: 3rem;
        padding-right: 3rem;
    }
}
.resume-section-content {
    width: 100%;
}

/* Sidebar layout (recovered, breakpoint changed from 992px → 768px per D-10) */
@media (min-width: 768px) {
    body {
        padding-left: 19rem; /* matches sidebar width */
    }
    .sidenav {
        position: fixed;
        top: 0;
        left: 0;
        width: 19rem;
        height: 100vh;
        background-color: var(--color-bg);
        display: flex;
        flex-direction: column;
    }
}
@media (max-width: 767px) {
    body {
        padding-top: 3.375rem;
    }
    .sidenav {
        position: sticky;
        top: 0;
        background-color: var(--color-bg);
        z-index: 50;
    }
}

/* Active nav link — 3 signals: left border + bold weight + accent color (D-12, A11Y-04) */
.nav-link {
    font-weight: 800;
    letter-spacing: 0.05rem;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    color: var(--color-text);
    border-left: 4px solid transparent;
}
.nav-link[aria-current='page'] {
    color: var(--color-accent);
    border-left-color: var(--color-accent);
    font-weight: 800; /* already 800; emphasis via color + border */
}

/* Profile pic */
.profile-pic {
    width: 200px;
    height: 225px;
    object-fit: cover;
}

/* text-primary utility (recovered — used for the accent span in <h1>) */
.text-primary {
    color: var(--color-accent);
}

/* Button (Resume Download) */
.btn-primary {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: var(--color-accent);
    color: white;
    text-decoration: none;
    border-radius: 0.25rem;
}
.btn-primary:hover {
    background-color: #a44e2f; /* ~10% darker than accent */
}
```

### Anti-Patterns to Avoid

- **`image_map` lookup table.** Already eliminated in Phase 2. Phase 3 reads `project.data.cover` directly as the typed `ImageMetadata` and passes it to `<Image src={…}>` — no string-keyed object lookups.
- **jQuery, jQuery Easing, jQuery scroll-spy.** Pitfall 21. Phase 3 ships no jQuery, no jQuery plugins, no `$(…)` selectors. The single `<script>` block uses vanilla `addEventListener` + `IntersectionObserver`.
- **Bootstrap CSS classes carried over semantically.** Pitfall 14. The recovered CRA App.css uses Bootstrap utilities like `mb-5`, `d-flex`, `flex-column flex-md-row`, `col-md-4`. Phase 3 rewrites every one to a Tailwind v4 equivalent (`mb-5` is the same in Bootstrap and Tailwind; `d-flex` → `flex`; `flex-md-row` → `md:flex-row`; `col-md-4` → `md:w-1/3`). **Do not import `bootstrap` as a package** (STYLE-01).
- **`<img>` for project covers.** STYLE-03 / Pitfall 4. Always `<Image src={entry.data.cover} alt={…} />`. The `<img>` tag is only acceptable for `public/` assets that bypass optimization (favicon, OG image) — not project covers.
- **CDN `<script>` / `<link>` for any icon library.** Pitfall 23 / D-29. Bundled via `astro-icon` only. Verify with `grep -rE "fontawesome|iconify|devicon|cdnjs" dist/` returning zero hits.
- **`client:load` / `client:visible` / `client:idle` on a section component.** SECTION-09 / D-30. ROADMAP Phase 3 SC #3 explicitly: `grep -r "client:load\|client:visible\|client:idle" src/` returns zero hits on section components. The Phase 1 hydration fixture (`src/pages/__hydration-test.astro` / `tests/__fixtures__/HydrationCheck.tsx`) is the only legitimate `client:load` site, and it lives outside `src/components/`.
- **Nested anchors in project cards.** D-18 stretched-link a11y pattern. One `<a>` per card; description text and tech-stack chips elevated above the overlay via `position: relative; z-index: 10`.
- **`<a target="_blank">` without `rel="noopener noreferrer"` + accessible new-tab announcement.** Pitfall security mistakes table. Every external link gets all three: `target="_blank"`, `rel="noopener noreferrer"`, and a visually-hidden "(opens in new tab)" span.
- **Removing focus rings.** CLAUDE.md hard requirement; A11Y-05. Don't author `outline: none` without a replacement.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization (resize / format conversion / `srcset`) | A custom build step or pre-optimizing PNG → WebP outside the pipeline | Astro `<Image />` from `astro:assets` reading `image()` schema fields | Pitfall 4. Build-time Sharp pipeline with cache, format negotiation, dimension stripping all included. |
| Icon SVG inlining | Copy raw SVGs from Iconify website into `src/icons/` and `<img src="…" />` them | `astro-icon` + `@iconify-json/*` packs + `<Icon name="prefix:name" />` | Pitfall 23. Per-glyph SVG inlining via svgo; only used glyphs ship; tree-shakable by design. |
| Self-hosted font CSS + @font-face | Write `@font-face` declarations referring to `.woff2` files committed to `public/` | `@fontsource/saira-extra-condensed` + `@fontsource/mulish` per-weight CSS imports | Fontsource ships `@font-face` declarations + `.woff2` files + `font-display: swap` defaults; Vite picks the .woff2 files up automatically. |
| Smooth scrolling on anchor click | `e.preventDefault()` + custom `requestAnimationFrame` easing loop | CSS `html { scroll-behavior: smooth }` + `prefers-reduced-motion` guard | One CSS line. Native. Zero JS. |
| Scroll-spy (which section is "active") | `scroll` event listener throttled with `requestAnimationFrame` | `IntersectionObserver` against `<section id>` elements | Pitfall 21. Native, async, no main-thread blocking; 30 lines of code. |
| Mobile nav drawer with focus trap and backdrop | Full off-canvas drawer with `inert`, focus restore, body scroll lock | Bootstrap-style inline collapse (D-09) — `aria-expanded` toggle + `.hidden` class + Escape-to-close + close-on-link-click | Inline collapse needs none of the drawer-specific concerns. ~15 lines. |
| Active nav state "more than color alone" | Custom JS class toggling on scroll | CSS rule `.nav-link[aria-current="page"] { border-left-color: var(--color-accent); color: var(--color-accent); }` driven by the `aria-current` set by the scroll-spy script | One CSS declaration. The IntersectionObserver toggles `aria-current`; CSS provides the 3-signal visual (color + border + already-bold weight). |
| Whole-card-clickable + visible-link inside card | JS click handler on card div + secondary link | CSS-only stretched-link pattern (`::after { position: absolute; inset: 0 }` on the inner anchor, container made `position: relative`) | D-18 / Bootstrap `.stretched-link` precedent / Inclusive Components. Keyboard-accessible, screen-reader-safe, no JS. |

**Key insight:** Every interactivity story in Phase 3 has a battle-tested, zero-JS or vanilla-JS solution that's simpler and more accessible than a custom React component. The discipline is in resisting the urge to wrap things in `useState`.

## Runtime State Inventory

**This phase is greenfield component authoring**, not a rename/refactor/migration. Skipping the full inventory.

**Verification:**
- Stored data: None — Phase 3 reads from Phase 2 collections only.
- Live service config: None — no external services touched in Phase 3.
- OS-registered state: None — no daemons, no Task Scheduler, no systemd.
- Secrets/env vars: None — no env vars consumed by Phase 3 code.
- Build artifacts: `dist/` is rebuilt fresh on each `astro build`. Old `dist/` from Phase 2 should be deleted before Phase 3 verification (`rm -rf dist .astro && npm run build`) to catch any stale-cache regressions per Pitfall 1.

## Common Pitfalls

### Pitfall A: Tailwind v4 `currentColor` default for `<hr>` borders (Pitfall 14 in PITFALLS.md)

**What goes wrong:** `<hr class="m-0" />` in v4 renders with `border-top: 1px solid currentColor`, which inherits from `body { color: #6c757d }` → a gray ~5x more visible than Bootstrap's `border-top: 1px solid rgba(0,0,0,.1)` default. Visual regression vs the existing site.

**Why it happens:** v4 deliberate breaking change.

**How to avoid:** Always set an explicit border color on `<hr>`: `<hr class="m-0 border-black/10" />` or set `--default-border-color: rgba(0,0,0,0.1)` in `@theme`.

**Warning signs:** `<hr>` looks darker than expected in the rendered page.

### Pitfall B: `getEntry()` second-arg id mismatch for singletons (Pitfall 1, 3 in PITFALLS.md)

**What goes wrong:** `getEntry('about', 'about')` might fail if Astro 6's `file()` loader derives the entry id differently from the top-level YAML key.

**Why it happens:** `file()` loader behavior depends on whether the YAML is `{ about: {...} }` (object) or `[{...}]` (array). For the current `about.yaml` (object with `about:` top-level key), the entry id should be `about`. For `links.yaml` (top-level array), each entry's id is the `id` field per the schema.

**How to avoid:** During execution, after schema build, run `console.log(await getCollection('about'))` once in dev to inspect actual entry ids. Adjust the `getEntry()` second arg if needed. Equivalent for `skills`.

**Warning signs:** `getEntry()` returns `undefined`; the `throw new Error()` guard fires; section renders nothing.

### Pitfall C: Astro `<Image />` not getting dimensions from `image()` field

**What goes wrong:** If `<Image src={entry.data.cover} alt="…" />` is missing explicit `width` / `height`, the resulting `<img>` may have no intrinsic size attributes → CLS regression.

**Why it happens:** Astro reads dimensions from the source `ImageMetadata` automatically — BUT only if the import path resolved through Vite (which it does for `image()`-typed fields). Verify by inspecting the rendered HTML in `dist/index.html` — `<img>` tags should have `width="…"` `height="…"` attributes auto-populated.

**How to avoid:** Don't pass dimensions explicitly for project covers (let Astro infer). For `profile.jpg` (read via static `import profileImage from '../assets/profile.jpg'` — same `ImageMetadata` shape), dimensions are also auto-inferred. If they're missing in output, add `widths={[200, 400]}` to `<Image>` to force Astro to emit dimensions.

**Warning signs:** Lighthouse CLS > 0.1; visible reflow on page load as images snap into place.

### Pitfall D: `astro-icon` build failure for non-existent icon ids

**What goes wrong:** Typo in `icon: devicon:pithon` → build fails with `Icon "devicon:pithon" not found`. (This is desired behavior — fail loudly at build, not silently in production.)

**Why it happens:** astro-icon resolves icon ids at build time against installed `@iconify-json/*` packs.

**How to avoid:** Phase 2 D-16 schema regex catches non-`prefix:name` shapes; Phase 3 relies on astro-icon's build-time resolver to catch ids that pass the regex but don't exist in the installed packs. All current `icon` values in `about.yaml` (2 entries) and `skills.yaml` (30 entries) are verified Iconify-canonical per Phase 2 Plan 02-02 — building should succeed. If a future entry uses an unknown id, the build fails. Don't add a silent fallback (D-21).

**Warning signs:** `astro build` exits with `Icon "…:…" not found` error.

### Pitfall E: Bundle bloat from importing the whole Iconify pack

**What goes wrong:** Misconfiguring `astro-icon` to load `mdi: ["*"]` ships every single MDI glyph (≈7,000 icons) → multi-MB bundle. Mirror risk for `devicon` / `simple-icons` / `logos` / `lucide`.

**Why it happens:** astro-icon's `include` option defaults to NO bundling unless you reference an icon explicitly; but if a planner mis-reads the docs and adds `include: { devicon: ['*'] }`, all of devicon ships.

**How to avoid:** Do NOT configure `include` in `astro.config.mjs` for Phase 3. Let astro-icon use the default behavior: each `<Icon name="…" />` reference inlines just that one glyph. Verify with `du -sh dist/_astro/` after build — total CSS/JS for icons should be <20 KB for the ~32 distinct icons used.

**Warning signs:** `dist/_astro/` exceeds expected size; bundle analyzer shows large icon-related chunks.

### Pitfall F: Fontsource imports not picked up by Vite (no `.woff2` in dist)

**What goes wrong:** Importing `@fontsource/mulish/400.css` in `global.css` should trigger Vite to copy `mulish-latin-400-normal.woff2` (and friends) into `dist/_astro/`. If the imports are wrong (e.g., `@fontsource/mulish` instead of `@fontsource/mulish/400.css`), nothing gets loaded.

**Why it happens:** Fontsource ships per-weight CSS files; importing the package root (`import '@fontsource/mulish'`) is NOT a valid pattern.

**How to avoid:** Use the exact per-weight paths: `@fontsource/mulish/400.css`, `@fontsource/mulish/400-italic.css`, `@fontsource/mulish/800.css`, `@fontsource/mulish/800-italic.css`, `@fontsource/saira-extra-condensed/500.css`, `@fontsource/saira-extra-condensed/700.css`. After build, verify `dist/_astro/*.woff2` exists for each weight.

**Warning signs:** FOUT on first load (system font flashes then jumps to Mulish); Network tab shows no `.woff2` requests.

### Pitfall G: `trailingSlash: 'always'` breaks `#anchor` links in dev

**What goes wrong:** `<a href="#about">` may resolve to `/#about/` on `trailingSlash: 'always'` — depends on Astro's URL normalization. Anchor jump still works in browser (hash fragments are post-path), but in-page anchor links may visually fight the config.

**Why it happens:** Astro applies trailing slash to the path portion; hash fragments are appended after.

**How to avoid:** Test anchor clicks after enabling `trailingSlash: 'always'`. If issues surface, switch to `<a href="/#about">` (absolute path + hash). Pitfall 9 documents this as a small-impact issue for single-page sites — most likely no fix needed.

**Warning signs:** Anchor clicks navigate to `/about/` instead of scrolling to `#about`.

### Pitfall H: `prefers-reduced-motion` not actually honored by IntersectionObserver

**What goes wrong:** The CSS `scroll-behavior: auto` guard handles smooth-scroll suppression. But IntersectionObserver itself doesn't have a "motion" — it just observes. So `prefers-reduced-motion` only needs to cover the CSS smooth-scroll. NAV-02 satisfied.

**Note:** A11Y-07 (Phase 4) verifies this with manual toggle of OS reduce-motion preference.

## Code Examples

> Code examples are inlined in § Architecture Patterns above (Patterns 1–8). All examples reference official Astro 6 / MDN / Fontsource sources.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery scroll-spy IIFE in `public/index.html` | Vanilla `IntersectionObserver` in single `<script>` | Astro 6 / modern browsers — `IntersectionObserver` stable since 2019 | -1 dep (jQuery), -1 dep (jquery-easing), ~30 lines of vanilla JS |
| Devicon + Iconify CSS via CDN `<link>` | `astro-icon` + `@iconify-json/*` per-glyph SVG inlining at build | Astro 1.0+ era | -0 runtime requests for icons; only used glyphs ship; SRI no longer a concern (no third-party domain) |
| Font Awesome `<script src="https://use.fontawesome.com/...">` | Bundled via Iconify packs (replaced entirely) | — | -1 CDN dep; no FA kit needed; Iconify simple-icons covers brand glyphs |
| Bootstrap 4 CSS (186 KB inlined in App.css) | Tailwind v4 utilities (CSS-first `@theme`) | Phase 1 already removed; Phase 3 finishes the visual port | -186 KB CSS; deterministic utility ordering; no unused selector cruft |
| `<StrictMode>` wrapping the whole App in `src/index.js` | No `<StrictMode>` — no React tree for static markup | Astro 6 islands architecture | No double-render in dev for static sections; React is reserved for genuinely interactive components (none in Phase 3) |
| Google Fonts `<link rel="stylesheet">` to fonts.googleapis.com | Self-hosted via `@fontsource/*` + `font-display: swap` | Fontsource 4.x+ shipped per-weight subset bundles | -2 CDN deps; no FOIT (font-display: swap built in); GDPR-cleaner (no Google Fonts request) |
| `Muli:400,400i,800,800i` from Google Fonts | `@fontsource/mulish` (renamed 2020) | Google Fonts rename | Same typeface, new name |
| `image_map` object literal in `Projects.jsx` | `project.data.cover` directly from Phase 2 typed `ImageMetadata` field | Phase 2 D-07 | One source of truth; build-time validation; image optimization free |
| Smooth scroll via `jQuery.easing` | `html { scroll-behavior: smooth }` + `prefers-reduced-motion` guard | CSS Level 1 module + modern browsers | -2 deps; native; respects accessibility prefs |
| Bootstrap collapse for mobile nav (`data-toggle="collapse"`) | `aria-expanded` toggle + `.hidden` class via vanilla `<script>` | — | -1 dep (Bootstrap JS); ~10 lines of code; correct ARIA wiring guaranteed |

**Deprecated/outdated:**
- `react-scroll` — installed in Phase 0 but never used in CRA; should not be reintroduced. Phase 5 deletes from `package.json`.
- `react-script-tag` — installed in Phase 0 but never used. Phase 5 deletes.
- `gh-pages` — local deploy from CRA era; Phase 5 replaces with GitHub Actions.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `getEntry('about', 'about')` is the correct invocation for a `file()`-loaded singleton with top-level `about:` key | Pattern 3 (About) | LOW — `console.log(await getCollection('about'))` in dev resolves the actual id; one-line fix to the second arg if mismatched. |
| A2 | `getEntry('skills', 'skills')` similarly | Pattern 4 (Skills) | LOW — same fix path as A1. |
| A3 | astro-icon 1.1.5 works with Astro 6 (no declared peerDep range) | Standard Stack | MEDIUM — astro-icon's last published version is 1 year old; if Astro 6 breaks its integration API in a minor, planner has to use the `next` tag (1.0.0-next.4) or pin Astro 6.x to a known-compatible version. Verify in Wave 1 with `npm run dev`. |
| A4 | Fontsource per-weight CSS imports are picked up by Vite's CSS asset graph (`.woff2` files land in `dist/_astro/`) | Pitfall F | LOW — well-established pattern with extensive prior art; verify by inspecting `dist/_astro/` after build. |
| A5 | The recommended Tailwind `[&:nth-child(even)]:flex-row-reverse` arbitrary-variant works for alternating project cards | Pattern 2 (Projects) | LOW — Tailwind v4 supports arbitrary variants; if it doesn't render correctly, fallback is to add a CSS rule `.project-card:nth-child(even) { flex-direction: row-reverse; }` in global.css. |
| A6 | `size-6` Tailwind utility is available in v4 for setting `width: 1.5rem; height: 1.5rem` on icons | Pattern 3, 4 | LOW — Tailwind v4 includes `size-*` utilities (size-1 through size-96 etc.); fallback is `w-6 h-6`. |
| A7 | The current `astro.config.mjs` is at the Phase 1 state with NO `trailingSlash` and NO `build.format` set | Recommendation | VERIFIED — read confirms only `site`, `output`, `integrations`, `vite` keys present. Phase 3 adds `trailingSlash: 'always'`; `build.format` defaults to `'directory'` so optional explicit set is "belt and suspenders." |
| A8 | The Phase 2 list collections sort correctly when sorted by `data.order` (vs needing `Number()` coercion) | Pattern 1 | VERIFIED — schemas declare `order: z.number().int()`; sort comparator `(a, b) => a.data.order - b.data.order` is correct. |
| A9 | `@iconify-json/*` packs published without a `repository` field are still legitimate (they are auto-published from github.com/iconify/icon-sets) | Package Legitimacy Audit | LOW — Iconify is a well-known, widely-trusted icon aggregator. The auto-publish artifact lacks the `repository` link but the parent project is canonical. |

## Open Questions

1. **Should the scroll-spy script live in `BaseLayout.astro` or `SideNav.astro`?** (D-30 planner's discretion)
   - What we know: Either works; both run once per page load.
   - What's unclear: Which keeps Phase 5 cleanup simplest if alternate layouts surface later.
   - Recommendation: **`BaseLayout.astro`** — gives every future page free scroll-spy if more pages are added; SideNav stays purely presentational.

2. **`@fontsource/mulish` (static 4 files) vs `@fontsource-variable/mulish` (one file)?** (D-33 planner's discretion)
   - What we know: Both packages exist and are clean; Saira has only the static variant. The 4-weight Mulish subset is well-bounded.
   - What's unclear: Exact bytes delivered for each; depends on woff2 subsetting fidelity.
   - Recommendation: **`@fontsource/mulish` static per-weight imports** — simpler `@import` story (per-weight files match per-weight Saira pattern); deliverable byte difference is sub-20 KB either way; consistency wins.

3. **Should `<hr>` border-color be set globally in `@theme` or per-`<hr>` utility?**
   - What we know: Tailwind v4 default is `currentColor` (Pitfall 14 / Pitfall A above). The recovered CRA used Bootstrap's `rgba(0,0,0,0.1)`.
   - What's unclear: Whether to set `--default-border-color: rgba(0,0,0,0.1)` globally (affects every `border-*` utility) or just `<hr class="m-0 border-black/10">`.
   - Recommendation: **Per-`<hr>` utility for now (`border-black/10`)** — global override has wider blast radius; Phase 3's visual surface is small.

4. **`text-primary` — Tailwind utility (`bg-primary`/`text-primary` driven by `--color-primary` token) or plain CSS class?**
   - What we know: The CRA `<h1>{first_name}<span class="text-primary">{last_name}</span></h1>` pattern uses Bootstrap's `text-primary`. Tailwind v4 with `--color-primary` token would auto-generate `text-primary`.
   - What's unclear: Whether to name the token `--color-primary` (auto-generates Tailwind utility) or `--color-accent` (no auto-utility; need manual `.text-primary` CSS class).
   - Recommendation: **Name the token `--color-accent` AND add a manual `.text-primary { color: var(--color-accent); }` CSS rule** — the literal class string `text-primary` is visible in the rendered HTML for CRA recognition; the token name `--color-accent` is more semantic. Or use `--color-primary` and let Tailwind generate utilities — also valid. Planner picks based on whether they want a separate `.text-accent` Tailwind utility usable elsewhere.

5. **Should the Phase 1 hydration fixture (`src/pages/__hydration-test.astro` + `tests/__fixtures__/HydrationCheck.tsx`) be kept during Phase 3?**
   - What we know: Phase 1 D-09 committed it; ROADMAP Phase 5 considers removing it. Phase 3 doesn't depend on it.
   - What's unclear: Whether the hydration smoke test in `tests/smoke.test.ts` will still pass once Phase 3 doesn't add any new React islands (the test asserts `dist/_astro/` contains at least one React JS chunk — supplied by the fixture).
   - Recommendation: **Keep the fixture for Phase 3**; Phase 5 owns the deletion. The test still passes because the fixture page produces the JS chunk.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node | All build steps | ✓ | engines pinned `>=22.13.0` | — |
| npm | Package install | ✓ | 10.9.2 (with Node 23.9.0 currently in dev) | — |
| Sharp (Astro `<Image />` default service) | STYLE-03 image optimization | ✓ (Astro installs it transitively) | bundled | Configurable to `service: { entrypoint: 'astro/assets/services/squoosh' }` if Sharp install fails on a platform |
| Internet (npm registry) | Initial package install | ✓ | — | If offline: build still works once deps are installed (no runtime registry calls) |

**No missing dependencies, no blocking absences.** The Phase 1 + Phase 2 build chain has already validated Sharp works (Phase 2 `image()` schemas resolve at build); Phase 3 just makes the existing pipeline emit images.

## Security Domain

> `security_enforcement` not explicitly set in `.planning/config.json`; treating as enabled.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Static site; no auth surface. |
| V3 Session Management | no | No sessions. |
| V4 Access Control | no | Public read-only content. |
| V5 Input Validation | partial | Phase 2 Zod schemas validate ALL content at build (CONTENT-08); Phase 3 doesn't introduce user input — it consumes Phase 2 typed data. |
| V6 Cryptography | no | No crypto in scope (no auth, no JWT, no secrets). |
| V14 Configuration | yes | astro.config.mjs `trailingSlash` + `build.format` correctness; no CDN scripts in `<head>`. |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Tab-nabbing on external links | T (Tampering) | `rel="noopener noreferrer"` on every `target="_blank"` link (D-18, D-26). All project URLs and social links covered. |
| CDN supply-chain injection (third-party `<script>`) | T | Zero CDN `<script>` / `<link>` in any generated HTML (D-29, NAV-05). Verified by `grep -rE "fontawesome\|iconify\|devicon\|cdnjs\|jsdelivr\|googleapis" dist/` returning zero hits. |
| Email scraper harvesting `mailto:` | I (Info Disclosure, low risk) | Accepted per CONCERNS.md (existing pattern). M2 may add obfuscation. |
| XSS via markdown body | T | Astro `<Content />` sanitizes markdown output via the standard remark/rehype pipeline; YAML loader does not execute code. Content authors are project owner only (CMS-neutral schema allows future editors, but they too will go through Zod validation at build per CONTENT-08). |
| `<img src={...}>` from public path bypassing optimization | T (Tampering via large unverified asset) | STYLE-03 requires `<Image />` from `astro:assets` for project covers — schema-validated path, build-time optimization. |

**No new attack surface introduced.** Phase 3 inherits the static-site, public-read posture of Phase 2.

## Sources

### Primary (HIGH confidence)

- `git show b537845:src/App.css` — Recovered pre-wipe CRA stylesheet, source of all `@theme` token values.
- `git show b537845:public/index.html` — Verified Google Fonts request: `Saira+Extra+Condensed:500,700` + `Muli:400,400i,800,800i`.
- `git show b537845:src/components/{Navbar,About,Education,Projects,Skills,Testimonials}.jsx` — CRA component markup; informs Astro port shape.
- npm registry — `npm view <package> version` on 2026-05-27 for all 8 Phase 3 packages; all verified.
- `slopcheck install <packages>` on 2026-05-27 — all 8 packages [OK].
- [Astro Content Collections — rendering body content](https://docs.astro.build/en/guides/content-collections/#rendering-body-content)
- [Astro Images guide — `<Image />` component](https://docs.astro.build/en/guides/images/#image--component)
- [Astro Configuration reference — `trailingSlash` and `build.format`](https://docs.astro.build/en/reference/configuration-reference/)
- [astro-icon getting started](https://www.astroicon.dev/getting-started/)
- [astro-icon Iconify customization](https://www.astroicon.dev/guides/customization/)
- [astro-icon GitHub README](https://github.com/natemoo-re/astro-icon)
- [Fontsource install docs](https://fontsource.org/docs/getting-started/install)
- [Fontsource Mulish font page](https://fontsource.org/fonts/mulish)
- [Fontsource Saira Extra Condensed font page](https://fontsource.org/fonts/saira-extra-condensed)
- [MDN — Intersection Observer API (scroll-spy pattern)](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

### Secondary (MEDIUM confidence)

- [Bootstrap 4 `.stretched-link` utility docs (inspiration for D-18 CSS-only pattern)](https://getbootstrap.com/docs/4.5/utilities/stretched-link/)
- [Inclusive Components — Cards (Heydon Pickering)](https://inclusive-components.design/cards/)

### Tertiary (Internal — load-bearing project documentation)

- `.planning/REQUIREMENTS.md` § Section / Navigation / Style — 20 active requirements.
- `.planning/STATE.md` — Phase 2 close-out + carry-forwards.
- `.planning/ROADMAP.md` § Phase 3 — Goal + 5 success criteria.
- `.planning/phases/01-foundation/01-CONTEXT.md` D-13, D-14, D-23 — section stubs, BaseHead shape, ids.
- `.planning/phases/02-content-layer/02-CONTEXT.md` D-05, D-07, D-13/14/15, D-16/17, D-19, D-25 — collections, schemas, draft predicate.
- `.planning/research/PITFALLS.md` — Pitfalls 1, 4, 8, 9, 10, 13, 14, 15, 16, 17, 18, 21, 22, 23, 28, 29.
- `.planning/codebase/{STRUCTURE,ARCHITECTURE,CONVENTIONS,CONCERNS}.md` — pre-wipe codebase analysis.
- `./CLAUDE.md` + `.claude/CLAUDE.md` — project instructions (WCAG 2.1 AA hard requirement, GSD workflow enforcement, surgical changes).

## Metadata

**Confidence breakdown:**
- Standard Stack: **HIGH** — all 8 packages npm-verified, slopcheck-clean, with documented usage patterns.
- Recovered CRA Tokens: **HIGH** — extracted directly via `git show b537845:src/App.css`; values are literal.
- Architecture Patterns: **HIGH** — all patterns cross-referenced to Astro 6 official docs + MDN.
- Pitfalls: **HIGH** — informed by PITFALLS.md (which itself was researched against Astro 5 → applies to 6 except where versions differ); supplemented by Phase 3-specific concerns (Pitfalls A–H).
- Tailwind v4 specifics: **MEDIUM-HIGH** — verified `--color-*` namespacing; some `size-*` / arbitrary-variant patterns flagged as LOW-risk assumptions (A5, A6) to verify in execution.

**Research date:** 2026-05-27
**Valid until:** 2026-06-27 (Astro 6 stack is stable; astro-icon's "last published 1 year ago" is the longest-lived assumption — if a major framework upgrade happens, re-verify).

## RESEARCH COMPLETE
