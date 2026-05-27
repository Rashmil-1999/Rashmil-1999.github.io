# Phase 3: Sections & Navigation - Context

**Gathered:** 2026-05-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Compose `src/pages/index.astro` so the 8 Phase 1 stub components (`SideNav`, `About`, `Education`, `Work`, `Skills`, `Projects`, `Leadership`, `Testimonials`) render real content from the Phase 2 Content Layer collections, with visual parity to the existing CRA site under the "refresh same vibe" polish bar. Side nav uses a fixed left sidebar (≥ md) and a top-bar + hamburger inline collapse (< md); scroll-spy is a single vanilla `<script>` using `IntersectionObserver`; smooth scrolling is CSS `scroll-behavior: smooth` with a `prefers-reduced-motion: reduce` guard. All icons are bundled via `astro-icon` + `@iconify-json/*` packs; no CDN UI libs (Bootstrap, jQuery, Font Awesome, Devicon, Iconify) and no `bootstrap` npm package. Project images render through Astro `<Image />`, taking the optimization pipeline live. No section ships a React island.

Out of scope for Phase 3: shared `<BaseHead>` SEO meta (OpenGraph / Twitter / canonical / description) — Phase 4 SEO-01..05; sitemap.xml / robots.txt rewrite — Phase 4 SEO-06; axe-core / pa11y CI gate — Phase 4 A11Y verification; deletion of `src/resumeData.json` snapshot — Phase 5 CLEAN-03; CRA package removal (`react-scripts`, `react-scroll`, `react-script-tag`, `gh-pages`, `bootstrap`) — Phase 5 CLEAN-01/02; `public/CNAME` deletion — Phase 5 CLEAN-04; GitHub Actions deploy workflow + Pages source switch + `gh-pages` branch deletion — Phase 5 DEPLOY-01..06.

</domain>

<decisions>
## Implementation Decisions

### Visual polish scope (STYLE-04)

- **D-01:** "Refresh same vibe" interpretation locked. Keep the existing typography pairing (Saira Extra Condensed for headings + Mulish for body), keep the overall fixed-left-sidebar layout and section order, keep the cream/off-white background and the alternating-row project cards. Modernize: tighter spacing scale, correct heading hierarchy (`<h1>` for name in About, `<h2>` per section), Tailwind utilities everywhere (no Bootstrap class carryover even semantically), focus rings honored. Not in scope: brand-new color palette, redesigned layout, new visual identity.
- **D-02:** Brand tokens land in `src/styles/global.css` `@theme { … }` block (currently empty placeholder per Phase 1 D-14). Token names follow Tailwind v4 CSS-first convention: `--color-bg`, `--color-text`, `--color-accent`, `--color-muted`, `--font-heading`, `--font-body`, plus a small spacing scale only if utilities don't cover it. No `tailwind.config.js` (v4 CSS-first).
- **D-03:** Section dividers stay as explicit `<hr class="m-0" />` (or its Tailwind equivalent) between sections — matches existing CRA `<hr className="m-0" />` per-section terminator (every section except `Testimonials.jsx`). Testimonials remains the only section without a trailing `<hr>`.
- **D-04:** Background = match existing cream / off-white. Surfaces (cards, side-nav) sit on the same cream — no white card-shadow treatment.
- **D-05:** Accent direction = match the existing CRA accent. Heading + nav-active + link-hover use the same single accent color carried from `src/App.css` (pre-wipe).

### CRA color/typography recovery (origin of D-04, D-05 token values)

- **D-06:** Researcher recovers `src/App.css` from git history — the last commit on the pre-Phase-1 `master` branch before the Phase 1 wipe (`30f8cab` is the rollup commit that landed the wipe; the parent commit on the renamed-from-master branch is the source). Extract: page background color, primary text color, heading color, accent / link / link-hover colors, font-size scale for h1/h2/h3, padding values for `.resume-section`, and any `.profile-pic`, `.social-icons`, `.dev-icons`, `.resume-section-content` rules. These values become the `@theme` tokens in D-02.
- **D-07:** If recovery fails or values look wrong vs the live `gh-pages` site, fall back to inspecting the live deployed CRA site (`https://rashmil-1999.github.io/` — or whichever URL serves the `gh-pages` branch today) and eyedrop the exact colors. Document the source of every token value in PLAN.md.

### Side-nav layout (NAV-01..05)

- **D-08:** Desktop (≥ md, i.e. ≥ 768px Tailwind default) — fixed left sidebar. Profile photo at the top, vertical list of nav links beneath, `position: fixed; left: 0; top: 0; bottom: 0;` (or Tailwind equivalent). Width is a planner judgment — pick the value used in the recovered CRA App.css (D-06).
- **D-09:** Mobile (< md) — sticky top bar with brand text + hamburger button on the right; tapping the hamburger toggles an inline vertical list of nav links collapsing/expanding below the bar (Bootstrap-collapse pattern, not an off-canvas drawer). No overlay/backdrop. No focus trap (no drawer to trap).
- **D-10:** Breakpoint = Tailwind `md` (768px). Tablets in landscape get the sidebar; tablets in portrait + phones get the mobile pattern.
- **D-11:** Profile photo: visible only in the desktop sidebar. Mobile top bar shows brand text ("Rashmil Panchani") only — keeps the mobile bar slim. The profile photo source is `src/assets/profile.jpg` (per Phase 2 D-11), referenced via Astro's `<Image />` so it gets optimized.
- **D-12:** Active link visual = left border (3–4px, accent color) + bold weight + accent text color (3 signals — satisfies WCAG 1.4.1 / A11Y-04 "more than color alone"). `aria-current="page"` set on the active link by the IntersectionObserver script. Inactive links use the body text color + normal weight + no border.
- **D-13:** Mobile hamburger button: `<button type="button" aria-label="Toggle navigation menu" aria-controls="sidenav-list" aria-expanded={isOpen}>`. The script toggles `aria-expanded` and the visibility of `#sidenav-list`. Keyboard-operable (Enter / Space). Escape closes the list. Focus moves logically (button stays focused after toggle).
- **D-14:** Section `id` attributes are the canonical anchor source. `links.yaml` `id` values (`about`, `education`, `work`, `skills`, `projects`, `leadership`, `testimonials`) map 1:1 to the `<section id="…">` attributes in each section component (already pinned by Phase 1 D-23 + Phase 2 D-25). The side-nav `<a href="#about">` etc. is rendered from `links.yaml` order (10, 20, 30, …, 70). `SideNav.astro` itself uses `id="sidenav"` per Phase 1 D-08; it is not in `links.yaml` (it's chrome, not a destination).

### Project card layout (SECTION-06, SECTION-10)

- **D-15:** Layout = alternating row cards. Project image on the left for odd-indexed entries, image on the right for even-indexed (or use `:nth-child(even) { flex-direction: row-reverse; }`). On `< md`, all cards stack vertically — image above, text below — same direction for all. Matches existing CRA pattern.
- **D-16:** Image aspect ratio = native source aspect. `<Image />` reads width/height from the imported asset (via the `image()` schema helper on `cover`), no forced crop. Cards adapt their image area to the source ratio. This matches the existing site where project images have mixed ratios.
- **D-17:** Tech-stack display = pill chips with name only (no icon). Each `tech_stack` string from the project frontmatter renders as a rounded pill (`<li>` inside a `<ul>` with `role="list"` and Tailwind utilities — e.g., bg-muted, rounded-full, px-2, py-1, text-xs). Adding per-tech icons would require a name→Iconify-id mapping that doesn't exist in the schema; deferred to Skills section (where icons ARE in the schema).
- **D-18:** Card external-link affordance = whole card is clickable + visible "View on GitHub" link inside the card. Implementation: the project title is the primary anchor (`<h3><a href={project.data.url}>{project.data.title}</a></h3>`), and a CSS "stretched link" pattern (`a::after { position: absolute; inset: 0; }` on the card container made `position: relative`) extends the clickable area to the whole card without nesting anchors. The visible "View on GitHub →" link inside the card is the same anchor styled visibly — text selection on description text still works because `::after` is overlaid but the description text gets `position: relative; z-index: 1`. All `<a>` to project URLs get `rel="noopener noreferrer"` per SECTION-06 and `target="_blank"` with a visually-hidden "(opens in new tab)" announcement (Phase 4 finalizes the announcement copy; ship the basic pattern now).
- **D-19:** `<Content />` rendering for description body: render via Astro's `await render(project)` + `<Content />` inside the card text column. Body is currently plain text (one paragraph per entry) per Phase 2 D-19; Tailwind typography plugin is **not** added in Phase 3 — plain `<p>` inside the card column with normal body type is sufficient. If M2 introduces markdown formatting (links, bold, lists) we add `@tailwindcss/typography` then.

### Skills section (SECTION-05)

- **D-20:** Layout = category heading + horizontal flowing row of icon+name groups (each icon ~24px with its name beneath). Match the existing CRA pattern (categories laid out as `<h3>` + `<div class="dev-icons">` row). Wrap to multiple lines when the viewport is narrow. Each icon resolved via `<Icon name={skill.icon} />` from `astro-icon` — the Iconify identifier (`devicon:python`, `simple-icons:django`, `logos:graphql`, `lucide:code`) flows directly from `skills.yaml`. Decorative icons get `aria-hidden="true"`; the name beneath the icon is the accessible name.
- **D-21:** No fallback icon needed at render time. Phase 2 D-16's schema regex (`^[a-z0-9-]+:[a-z0-9-]+$`) and Phase 2 D-17's curated mapping (including `lucide:code` for NLTK) mean every entry already has a valid Iconify id. If a future entry references a missing pack, `astro-icon` errors loudly at build — that's the desired behavior.

### Education / Work / Leadership cards

- **D-22:** Layout = flat row per entry — date range on the left (or above on `< md`), title + institution + description column on the right. NOT card-styled with a shadow / border. Matches existing CRA pattern (each is a `<div className="d-flex flex-column flex-md-row justify-content-between mb-5">` with a left/right text split). Same shape for all three sections (Education, Work, Leadership).
- **D-23:** Body content (Work / Leadership / Education descriptions) renders via `<Content />` per D-19. Education entries currently have only metadata (name, degree, graduated, score) and no body text; their body markdown is left empty and `<Content />` renders nothing visible — same as existing CRA.

### Testimonials section (SECTION-08)

- **D-24:** Layout = blockquote per testimonial. `<blockquote>` with the `text` body, `<cite>` for the attribution (`user` field). One testimonial currently exists. No card / shadow treatment; uses Mulish italic 400 weight for the quote text (matches existing CRA `.testimonial-text` pattern; verified once App.css is recovered per D-06).

### About section (SECTION-02)

- **D-25:** Layout = name (h1) + current status + description paragraph + contact CTA (email link + "Download Resume" link to `/Rashmil_Panchani.pdf`) + social icons row. Photo is **not** repeated here (the desktop sidebar already shows it per D-11); on mobile, since the sidebar photo is hidden, the About section is also the photo's only appearance. Resolution: on `< md`, render the profile image at the top of the About section; on `≥ md`, hide it (sidebar has it). Implemented with Tailwind responsive utilities (`md:hidden`). Source is `src/assets/profile.jpg` via `<Image />`.
- **D-26:** Social icons row (LinkedIn, Github) renders from `about.social[]`. Each icon resolved via `<Icon name={item.icon} />` (simple-icons:linkedin, simple-icons:github per `about.yaml`). Every `<a>` has `aria-label={item.name}` (Pitfall 22) + `rel="noopener noreferrer"` + `target="_blank"` + a visually-hidden "(opens in new tab)" span.
- **D-27:** Resume download = `<a href="/Rashmil_Panchani.pdf" download>` styled as a button (accent background or accent border — exact style follows the recovered CRA pattern, D-06). Visible label "Download Resume" — no icon-only treatment.

### Icons (STYLE-02)

- **D-28:** `astro-icon` integration installed (`astro-icon` package + `@iconify-json/devicon` + `@iconify-json/simple-icons` + `@iconify-json/logos` + `@iconify-json/lucide` as devDependencies). Configure in `astro.config.mjs` with `iconDir: 'src/icons'` (default), so Iconify resolves icon ids from the installed packs at build time. Only used glyphs ship (per `astro-icon` per-glyph SVG inlining) — verifies Pitfall 23 mitigation.
- **D-29:** No CDN `<script>` or `<link>` for any icon library in any generated HTML (verified by `grep -rE "fontawesome|iconify|devicon|cdnjs" dist/` after build returning zero hits — this is also SC #4 for Phase 3). The existing pre-Phase-1 `public/index.html` is already gone (Phase 1 wipe). Phase 3 must not reintroduce any CDN script via BaseHead either.

### Scroll-spy (NAV-03)

- **D-30:** Implementation = single vanilla `<script>` in `BaseLayout.astro` (or `SideNav.astro` — planner picks the single right home so it runs once per page load). Uses `IntersectionObserver` against `document.querySelectorAll('main section[id]')`. When a section is the most-intersecting, set `aria-current="page"` on the matching `nav a[href="#<id>"]` and remove it from the others. NO React island, NO `useEffect`, NO jQuery (Pitfall 21).
- **D-31:** IntersectionObserver `rootMargin` and `threshold` are planner judgment. Reasonable defaults: `rootMargin: '-30% 0px -50% 0px'` (activate when the section's heading is in the top ~30% of the viewport) and a single `threshold: 0`. Tune during execution against the live preview.
- **D-32:** Smooth scroll — set `html { scroll-behavior: smooth }` and guard with `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto } }`. No JS-driven smooth scroll. Anchors in nav (`<a href="#projects">`) trigger native browser anchor navigation; the smooth behavior comes from the CSS, the spy comes from the observer.

### Font delivery (STYLE-05)

- **D-33:** Self-host via `@fontsource/*` (and `@fontsource-variable/*` if planner prefers). Install:
  - `@fontsource/saira-extra-condensed` (or `@fontsource-variable/saira-extra-condensed`) — weights 500, 700 only.
  - `@fontsource/mulish` (or `@fontsource-variable/mulish`) — weights 400, 400i, 800, 800i only.
  Note: "Muli" was renamed to "Mulish" by Google Fonts in 2020 — the Fontsource package is `@fontsource/mulish`. Same font family.
- **D-34:** Font weight set is locked: Mulish 400/400i/800/800i; Saira Extra Condensed 500/700. Match the existing CRA Google Fonts request (`Saira+Extra+Condensed:500,700` and `Muli:400,400i,800,800i`). Do not ship extra weights "for flexibility."
- **D-35:** Load strategy = import the per-weight CSS files from `@fontsource/*` in `BaseLayout.astro` (or in a `src/styles/fonts.css` that `global.css` `@import`s). Fontsource defaults to `font-display: swap` — confirm via inspection of the imported CSS; if not present, add the override in `global.css`.
- **D-36:** Delete the Phase 1 `<link rel="preconnect">` tags in `BaseHead.astro` pointing to `fonts.googleapis.com` and `fonts.gstatic.com` (D-13 Phase 1 stub) — they have no purpose once fonts are self-hosted. Verify no third-party font request appears in the built HTML or in network panel.
- **D-37:** No explicit `<link rel="preload">` for font weights in Phase 3 (Option C from font question rejected). Fontsource self-hosting + `font-display: swap` is enough. Revisit in Phase 4 if LCP / CLS metrics show font-related issues.

### Astro 6 trailing slash / build format

- **D-38:** Confirm `astro.config.mjs` is set to `trailingSlash: 'always'` and `build: { format: 'directory' }` per the PITFALLS.md "Integration Gotchas" row (GitHub Pages + trailing slashes) and Pitfall research recommendation. Phase 1 may not have set these — researcher verifies current `astro.config.mjs` and updates if missing. This protects every internal anchor and future page link from a 301 redirect hop.

### Claude's Discretion

- The exact sidebar width on desktop — pull from recovered CRA App.css (D-06).
- IntersectionObserver `rootMargin`/`threshold` tuning — D-31's defaults are a starting point; tune live in `npm run preview`.
- Whether the scroll-spy script lives in `BaseLayout.astro` or `SideNav.astro` — single-place injection only; planner picks.
- Whether to use `@fontsource/*` or `@fontsource-variable/*` packages — planner picks the smaller download given the locked weight set (variable wins if the savings exceed 4-file overhead, otherwise the per-weight is fine).
- Pill-chip styling (background tint, border) — pick from recovered CRA pattern; if unclear, neutral `bg-black/5` + body text color.
- The "(opens in new tab)" announcement copy — Phase 4 owns final accessibility verification; ship a reasonable string now (e.g., `<span class="sr-only">(opens in new tab)</span>`).
- Whether to add `@tailwindcss/typography` — not in Phase 3 scope (D-19). If a section description starts to need rich formatting, planner flags it as a deferred decision rather than adding the plugin silently.
- Exact section heading sizes (h2) and the spacing scale (section padding) — derive from recovered CRA App.css (D-06) so visual parity holds.
- Sidebar list separator styling between links (border-bottom, padding, indent) — match recovered CRA pattern.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project decisions & scope
- `.planning/PROJECT.md` — Active requirements list (SECTION-*, NAV-*, STYLE-* are Phase 3); locked decisions (Astro 6 hybrid component model, Tailwind v4 via `@tailwindcss/vite`, no CDN UI libs).
- `.planning/REQUIREMENTS.md` § Section Components, § Navigation, § Style — SECTION-01..10, NAV-01..05, STYLE-01..05 are this phase's full requirement set.
- `.planning/ROADMAP.md` § Phase 3 — Goal, depends-on Phase 2, requirements, 5 success criteria.
- `.planning/STATE.md` — Project state through end of Phase 2; Phase 3 carry-forwards (Phase 5 CNAME/site URL, npm-audit vulnerabilities).

### Prior phase context (locked decisions to honor)
- `.planning/phases/01-foundation/01-CONTEXT.md` — D-08 (section stubs exist), D-10 (strictest tsconfig), D-11 (src layout including `BaseHead.astro`, `BaseLayout.astro`, `global.css`), D-13 (BaseHead Phase-1 content — preconnects to delete in Phase 3 per D-36), D-14 (`@theme` block to fill in Phase 3 per D-02), D-23 (section ids).
- `.planning/phases/02-content-layer/02-CONTEXT.md` — D-01..03 (collection layout & loader API), D-05 (draft filtering pattern — `getCollection('x', ({data}) => import.meta.env.PROD ? !data.draft : true)`), D-07/08/12 (image schema + colocation — Phase 3 consumes these), D-13/14/15 (singleton shapes — `about.yaml`, `links.yaml`, `skills.yaml`), D-16/17/18 (Iconify ids — Phase 3 resolves), D-19 (markdown body for descriptions — Phase 3 renders via `<Content />`), D-24/25 (Work canonical id + `links.yaml` nav order). Deferred-for-Phase-3 items in `<deferred>` section.

### Pitfalls research (consult before writing UI / scripts)
- `.planning/research/PITFALLS.md` § Pitfall 4 — `image()` helper + frontmatter image paths.
- `.planning/research/PITFALLS.md` § Pitfall 20 — No `image_map`; per-entry colocation (already established Phase 2; Phase 3 must not reintroduce).
- `.planning/research/PITFALLS.md` § Pitfall 21 — Scroll-spy via `IntersectionObserver` in a vanilla `<script>`, NOT a React island. Active state must convey by more than color (informs D-12).
- `.planning/research/PITFALLS.md` § Pitfall 22 — `aria-label` on every icon-only link / nav toggle; decorative icons get `aria-hidden="true"`.
- `.planning/research/PITFALLS.md` § Pitfall 23 — `astro-icon` per-glyph SVG inlining; verify CSS bundle for icons stays small.
- `.planning/research/PITFALLS.md` § Pitfall 28 — `getCollection` predicate (draft filtering at build, not runtime).
- `.planning/research/PITFALLS.md` § Pitfall 29 — Tailwind v4 source detection (verified in Phase 1; informs spot-checks in Phase 3).
- `.planning/research/PITFALLS.md` § Integration Gotchas, GitHub Pages trailing-slash row — informs D-38.

### Pre-wipe codebase (source of CRA visual values)
- Git history: the commit immediately before the Phase 1 wipe (rollup commit `30f8cab` is the wipe; its parent is the source). Files of interest for D-06:
  - `src/App.css` — global stylesheet with colors / fonts / sidebar dimensions / section padding / `.profile-pic`, `.social-icons`, `.dev-icons`, `.resume-section-content`, `.testimonial-text` rules.
  - `src/index.css` — body / `<code>` base typography (smaller; less critical).
  - `public/index.html` — Google Fonts URL string (confirms exact weight set; already locked by D-34).
  - `src/components/Navbar.jsx` — sidebar markup the recovered CSS is paired with.

### Existing codebase analysis
- `.planning/codebase/STRUCTURE.md` — Pre-wipe `src/` and `public/` shape; informs D-06 recovery scope and validates the section/component naming map.
- `.planning/codebase/ARCHITECTURE.md` — Component responsibilities table; confirms the section→data mapping Phase 3 is reproducing.
- `.planning/codebase/CONVENTIONS.md` — Pre-wipe naming patterns and component shape — informational; Phase 3 follows Astro conventions, not CRA's.
- `.planning/codebase/CONCERNS.md` — Anti-patterns Phase 3 must NOT reintroduce: `image_map`, jQuery scroll-spy, Bootstrap CSS missing, large unoptimized images, CDN icon libraries.

### Source data (read at build by `<section>.astro` components)
- `src/content.config.ts` — Schemas for all 8 collections (Phase 2 D-19 / D-26).
- `src/content/about.yaml`, `src/content/skills.yaml`, `src/content/links.yaml` — Singleton sources.
- `src/content/projects/<slug>/index.md` × 13 — Project entries with frontmatter (cover, tech_stack, url, order) + markdown body (description).
- `src/content/work/`, `src/content/education/`, `src/content/leadership/`, `src/content/testimonials/` — list collection sources.
- `src/assets/profile.jpg` — Profile photo (Phase 2 D-11).
- `public/Rashmil_Panchani.pdf` — Resume download target.

### Astro 6 docs (consult during planning)
- https://docs.astro.build/en/guides/integrations-guide/ — `astro-icon` installation and config.
- https://docs.astro.build/en/guides/content-collections/#rendering-body-content — `render()` and `<Content />` for markdown bodies.
- https://docs.astro.build/en/guides/images/#image--component — `<Image />` API + `src/content` paths.
- https://docs.astro.build/en/reference/configuration-reference/#trailingslash — `trailingSlash` and `build.format` (informs D-38).
- https://fontsource.org/docs/getting-started/install — `@fontsource/*` import pattern.

### Behavioral guidelines
- `.claude/CLAUDE.md` — WCAG 2.1 AA hard requirement (every interactive element with accessible name; semantic landmarks; heading hierarchy; focus rings preserved). Active/selected state — more than color alone (drives D-12). Surgical changes — don't redesign while polishing.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/{About, Education, Work, Skills, Projects, Leadership, Testimonials, SideNav}.astro` — Phase 1 D-08 empty stubs. Phase 3 fills these in place; do NOT rename, do NOT change `id` attributes (Phase 1 D-23, Phase 2 D-25 — locked).
- `src/components/BaseHead.astro` — Phase 1 stub with `<meta charset>`, `<meta viewport>`, `<title>`, `<link rel="icon" href="/favicon.svg">`, and the two font preconnects. Phase 3 deletes the preconnects (D-36). OG / Twitter / canonical land in Phase 4 (SEO-01..05).
- `src/layouts/BaseLayout.astro` — Phase 1 minimal layout (imports BaseHead + `global.css`, renders `<slot />`). Phase 3 either injects the scroll-spy `<script>` here or in `SideNav.astro` (D-30 — planner picks).
- `src/styles/global.css` — Phase 1: `@import "tailwindcss";` + empty `@theme { }`. Phase 3 fills `@theme` with recovered brand tokens (D-02, D-06), adds the `prefers-reduced-motion` guard around `scroll-behavior: smooth` (D-32), and `@import`s the Fontsource CSS (D-35).
- `src/pages/index.astro` — Phase 1 D-07 composition order (SideNav + 7 sections inside `<main>`). Phase 3 does NOT change the composition; only the section components' contents change.
- `src/pages/__hydration-test.astro` + `tests/__fixtures__/HydrationCheck.tsx` — Phase 1 hydration fixture. Phase 3 does NOT use it. Phase 5 may remove it. Until then it lives next to `index.astro` and adds `dist/__hydration-test/index.html` to every build.
- `tests/smoke.test.ts` — Phase 1 smoke test. It already asserts the 8 section ids in `dist/index.html`. Phase 3 does NOT need to expand it (Phase 4 owns axe-core gating). Adding section-content assertions is acceptable if cheap.
- `tests/content-validation.test.ts` — Phase 2 D-26..28. Validates content schemas. Phase 3 does NOT modify it.

### Established Patterns
- Astro `getCollection('<name>', ({data}) => import.meta.env.PROD ? !data.draft : true)` — the universal draft-filtering predicate pattern (Phase 2 D-05). Every Phase 3 collection read goes through this shape, not bare `getCollection`.
- Astro 6 `entry.id` is derived from the directory name; the slug in `links.yaml` `id` is the section's `<section id>` value; the slug in `<a href="#...">` is the same value with a `#` prefix (Phase 2 D-06).
- Schema-function form `({ image }) => z.object(...)` was used in Phase 2 for project schemas (D-07). Phase 3 consumes the typed `cover` field as an `ImageMetadata` object → `<Image src={project.data.cover} alt={…} />`.
- Phase 1 D-23 confirmed lowercase ids and `work` (not `experience`); Phase 2 D-24 reconciled the canonical label `Work`. Phase 3 must not introduce a separate "Experience" label anywhere.

### Integration Points
- `src/styles/global.css` is the single Tailwind / @theme integration point. Phase 3 brand tokens (colors, fonts) land here. Phase 3 also `@import`s Fontsource CSS here.
- `src/components/BaseHead.astro` is the integration point for the font-related cleanup (delete preconnects).
- `src/layouts/BaseLayout.astro` or `src/components/SideNav.astro` is the integration point for the IntersectionObserver scroll-spy `<script>` — single home (D-30).
- `astro.config.mjs` is the integration point for `astro-icon` (`integrations: [react(), icon({ /* … */ })]`) and for `trailingSlash` / `build.format` (D-38).
- `package.json` is the integration point for `astro-icon`, `@iconify-json/devicon`, `@iconify-json/simple-icons`, `@iconify-json/logos`, `@iconify-json/lucide`, `@fontsource/saira-extra-condensed`, `@fontsource/mulish` new devDependencies.

</code_context>

<specifics>
## Specific Ideas

- **"Refresh same vibe" = same fonts + same off-cream + same alternating-row projects + same fixed-left sidebar.** Departures from this need explicit justification in PLAN.md. The bar is "would a visitor recognize this as the same site?" — answer should remain "yes."
- **CRA App.css recovery from git history is load-bearing.** D-06 names it as Phase 3's primary source for color / spacing / typography values. If the recovery returns empty (the wipe predates the commit chain we expect), fall back to live-site eyedropping (D-07) and document the swap in PLAN.md.
- **Mobile nav is a sticky top bar + inline collapse — not an off-canvas drawer.** This rules out drawer-specific concerns (focus trap, backdrop tap-to-close, body-scroll lock, Esc-to-close drawer-style). Inline collapse keeps the JS to ~10 lines.
- **The "Muli" → "Mulish" rename is a real gotcha.** Fontsource ships `@fontsource/mulish`, not `@fontsource/muli`. Same font family, just renamed by Google Fonts in 2020. Document this in PLAN.md and migration notes so anyone double-checking against the old `Muli:400,400i,800,800i` request doesn't go looking for a non-existent `@fontsource/muli` package.
- **Card stretched-link pattern (D-18) is the right a11y answer for "whole card clickable + visible link."** Don't nest anchors; don't add a JS click handler on the card. The `::after` pseudo-element trick is widely documented (e.g., Bootstrap's `.stretched-link` utility, Inclusive Components book).
- **Trailing slash `'always'` (D-38) is one config line that prevents a 60% perf hit on internal nav.** The site is single-page so the impact is small in practice, but every future page link benefits. Don't skip the config verification just because "we only have one page."

</specifics>

<deferred>
## Deferred Ideas

These came up during discussion and belong to other phases. Don't lose them.

### Phase 4 (SEO, A11Y & Meta Polish)
- Run axe-core / pa11y against the built `dist/index.html` to verify zero WCAG 2.1 AA violations. Phase 3 follows the rules in advance (aria-labels, semantic landmarks, focus rings, 3-signal active state); Phase 4 is the formal gate.
- Finalize the "(opens in new tab)" announcement string (D-18, D-26 ship a reasonable default).
- Expand `BaseHead.astro` from Phase 1 stub: add `<meta name="description">` from `about.yaml`, OpenGraph / Twitter / canonical (SEO-01..05).
- Author and commit the 1200×630 OG image asset (SEO-07).
- Install `@astrojs/sitemap` + emit `sitemap-index.xml` + update `public/robots.txt` to reference it (SEO-06).
- Add tabindex / keyboard walkthrough verification step (A11Y-05).
- Verify color-contrast pass against the chosen tokens (A11Y-03) — if any token fails 4.5:1, adjust in Phase 4.
- Consider Tailwind typography plugin if any section's body markdown grows beyond plain paragraphs.
- Consider explicit `<link rel="preload">` for critical font weights if LCP/CLS suffer (D-37 deferred check).

### Phase 5 (Cleanup & Deploy)
- Remove `bootstrap` if it somehow snuck in as a dep (CLEAN-* / STYLE-01 gates this — Phase 3 must not install).
- Remove `react-scroll`, `react-script-tag` from `package.json` (CLEAN-02). Phase 3's no-React-runtime rule means these are unused; Phase 5 deletes them from `package.json`.
- Decide on resume PDF cache-busting (query param vs `src/` import).
- Consider removing `src/pages/__hydration-test.astro` + `tests/__fixtures__/HydrationCheck.tsx` if hydration check has served its purpose. Optional.
- Switch GitHub Pages source to "GitHub Actions" before deleting `gh-pages` branch (DEPLOY sequencing constraint — Phase 1 STATE.md flag).
- Delete `public/CNAME` (CLEAN-04 — Phase 1 already did this in the wipe; Phase 5 verifies absence).
- Delete `.planning/snapshots/m1-source/` after CONTENT-06 parity sign-off (Phase 1 D-03).

### Future (M2 / out of M1)
- CMS UI for editing `about.yaml` / project frontmatter — Content Layer schema is already M2-compatible (Phase 2 D-23).
- Multi-image project galleries — `alternates` field already exists in schema (Phase 2 D-07).
- Project image lightbox / detail view.
- Dark mode toggle — explicitly out of scope per PROJECT.md.
- View Transitions — explicitly skipped per PROJECT.md / Pitfall 8.

</deferred>

---

*Phase: 3-Sections & Navigation*
*Context gathered: 2026-05-27*
