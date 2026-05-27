# Phase 3: Sections & Navigation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-27
**Phase:** 3-sections-navigation
**Areas discussed:** Visual polish scope, Side-nav mobile pattern, Project card layout, Font delivery

---

## Gray Area Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Visual polish scope | STYLE-04 brand tokens (colors, headings, spacing). 'Light polish' is ambiguous — pixel-match current CRA site, refresh aesthetic, or modest restyle? Drives the @theme block. | ✓ |
| Side-nav mobile pattern | NAV-04 mobile toggle behavior — off-canvas drawer, sticky top bar with collapse, or compact hamburger. Current site uses Bootstrap collapse. Affects markup + a11y wiring. | ✓ |
| Project card layout | SECTION-06 — 13 projects. Current site uses alternating row cards (image L/R + text). Could be: keep alternating rows, 2-col responsive grid, or compact list with thumbnail. | ✓ |
| Font delivery | STYLE-05 — self-host via @fontsource/saira-extra-condensed + @fontsource/mulish, or keep Google Fonts CSS link with the existing preconnect tags. Affects perf + third-party deps. | ✓ |

**User's choice:** All four areas selected.

---

## Visual polish scope

### Q1: How close should the new site match the existing CRA visual?

| Option | Description | Selected |
|--------|-------------|----------|
| Pixel-match existing | Same colors, fonts, spacing, component proportions. Just remove jQuery and CDN libs. Lowest risk of 'this looks different.' | |
| Refresh same vibe (Recommended) | Keep typography (Saira + Muli) and overall layout, tighten spacing, modernize heading hierarchy, fix contrast/accent, let Tailwind utilities replace Bootstrap classes naturally. | ✓ |
| Modest restyle | Same content + layout, but pick fresh colors/fonts that feel current. Riskier 'this looks different' but cleanest result. | |

### Q2: What's the accent / heading color direction?

| Option | Description | Selected |
|--------|-------------|----------|
| Match existing accent (Recommended) | Carry whatever section-heading + link-hover color the current CRA site uses. Lowest surprise. | ✓ |
| Pick a single new accent color | You name a single brand color; wire it through @theme as --color-accent. | |
| Neutral grayscale + one accent on interactive only | Headings stay neutral; accent reserved only for nav-active, link-hover, focus rings. More minimal. | |

### Q3: Background and surface treatment?

| Option | Description | Selected |
|--------|-------------|----------|
| Match existing cream / off-white (Recommended) | Keep the warm off-white background the CRA site uses; cards/dividers as today. | ✓ |
| Pure white surface | Standard white background, neutral gray section dividers. Cleaner, more 'portfolio template' aesthetic. | |
| Subtle off-white + card shadow | Off-white page, white card surfaces with small shadow for projects. Adds depth. | |

### Q4: How should section dividers be treated?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep `<hr>` between sections (Recommended) | Matches existing CRA pattern. Visually familiar; explicit landmarks. | ✓ |
| Whitespace only | Drop the `<hr>`; use generous padding on each section. Cleaner but less obvious section boundaries. | |
| Subtle border-top on each section | Top border on each section's wrapper instead of a separate hr element. | |

### Q5: How should we resolve the exact CRA colors / typography values (since src/App.css was wiped)?

| Option | Description | Selected |
|--------|-------------|----------|
| Pull App.css from git history (Recommended) | Researcher checks out the pre-wipe commit, extracts CSS variable / color values for headings, links, background, hover. Reproducible. | ✓ |
| Use the live gh-pages site as reference | Eyedrop the exact colors / inspect computed styles from the deployed CRA site. | |
| I'll provide the hex values directly | You hand me the brand hex codes and I capture them in CONTEXT.md. | |
| You decide | Let the planner pick whichever is fastest. | |

**User's choice:** Refresh same vibe; match existing accent + cream surface; keep `<hr>` dividers; recover values from git history.
**Notes:** "App.css from git history" is now load-bearing — researcher must extract the pre-Phase-1 values. Fallback is live-site eyedropping.

---

## Side-nav mobile pattern

### Q1: Desktop side-nav layout?

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed left sidebar (Recommended) | Match existing CRA: profile photo at top, vertical list of section links below, fixed position on the left. | ✓ |
| Sticky top bar | Profile photo + horizontal nav links at the top, sticks on scroll. | |
| Floating right-side rail | Compact vertical dots/labels on the right, like docs-site TOC patterns. | |

### Q2: Mobile nav pattern (<768px)?

| Option | Description | Selected |
|--------|-------------|----------|
| Top bar with hamburger → inline collapse (Recommended) | Matches existing CRA Bootstrap pattern: sticky top bar with brand + hamburger; tap toggles a collapsed vertical list directly below. | ✓ |
| Top bar with hamburger → off-canvas drawer | Tap opens a slide-in drawer with overlay/backdrop. Trap focus when open. More plumbing. | |
| Sticky top bar, no toggle (all links visible) | Fit all 7 nav labels in a single horizontal scroll row or condensed pills. | |

### Q3: Profile photo in the nav?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, in desktop sidebar only (Recommended) | Large rounded profile photo at top of left sidebar on desktop; mobile nav shows brand text only. | ✓ |
| Yes, on both desktop and mobile | Small avatar in mobile top bar too. | |
| No profile photo in nav, only in About | Drop photo from nav entirely. | |

### Q4: Active link visual indicator (A11Y-04 — must be more than color)?

| Option | Description | Selected |
|--------|-------------|----------|
| Left border + bold weight + accent color (Recommended) | 3-4px left border in accent, increased font weight, accent text color. Three signals satisfies WCAG 1.4.1. | ✓ |
| Filled background pill + accent text | Soft accent-tinted background fill plus accent text. Two signals; looks more like 'button selection.' | |
| Underline + accent color + bold | Underline plus weight bump plus accent color. Three signals. | |

### Q5: Mobile-nav breakpoint?

| Option | Description | Selected |
|--------|-------------|----------|
| Tailwind `md` (768px) (Recommended) | Below 768px shows top-bar+hamburger; ≥768px shows fixed left sidebar. Matches existing Bootstrap `md`. | ✓ |
| Tailwind `lg` (1024px) | Mobile pattern until 1024px. Tablets get the simpler mobile nav. | |
| Tailwind `sm` (640px) | Switch to sidebar earlier (640px). Cramped on narrow tablets. | |

**User's choice:** Fixed left sidebar (desktop), top-bar+hamburger inline collapse (mobile), photo on desktop only, 3-signal active state, `md` (768px) breakpoint.

---

## Project card layout

### Q1: Project card layout pattern?

| Option | Description | Selected |
|--------|-------------|----------|
| Alternating row cards (Recommended) | Image on left for odd-indexed, image on right for even-indexed; title + tech-stack chips + description fills the other side. | ✓ |
| Uniform row cards (image always left) | Simpler CSS; less visual rhythm; potentially monotonous after 13 entries. | |
| Responsive 2-col grid (stacked cards) | Image on top, text below; 2-col grid (md+) or single col (sm). | |
| Compact list with thumbnail | Small left thumbnail (~120px) + title/description/tech-stack stacked right. Densest. | |

### Q2: Image aspect ratio / size?

| Option | Description | Selected |
|--------|-------------|----------|
| Match aspect of source images (Recommended) | Use the native ratios. `<Image />` sets width/height from source. | ✓ |
| Force consistent 16:9 cards | Crop / object-cover all images to 16:9 for a uniform grid feel. | |
| Force consistent 4:3 cards | Closer to existing image aspect average, less aggressive crop. | |

### Q3: Tech-stack display per card?

| Option | Description | Selected |
|--------|-------------|----------|
| Pill chips with no icon (Recommended) | Each tech is a rounded pill with the name only. Matches existing CRA pattern. | ✓ |
| Icon + name chips | Each chip shows the technology's icon next to its name. Requires name→icon mapping not in schema. | |
| Plain comma-separated text | Just inline text below the description. Lowest visual weight. | |

### Q4: Card external link affordance?

| Option | Description | Selected |
|--------|-------------|----------|
| Whole card clickable + visible 'View on GitHub' link (Recommended) | Card hover state; clicking anywhere routes to project URL. Visible text link for keyboard/a11y users. `rel="noopener noreferrer"`. | ✓ |
| Visible 'View on GitHub' link only | Card not clickable; only explicit link routes out. | |
| Icon-only link in card corner | Small external-link icon. Needs aria-label. | |

**User's choice:** Alternating rows, match source aspect, pill chips no icon, whole card clickable + visible "View on GitHub" link.
**Notes:** Whole-card clickability uses the CSS "stretched link" pattern (`::after` pseudo on the title's anchor), avoiding nested anchors.

---

## Font delivery

### Q1: Font delivery approach?

| Option | Description | Selected |
|--------|-------------|----------|
| Self-host via @fontsource/* (Recommended) | Install `@fontsource/saira-extra-condensed` + `@fontsource/mulish` as devDependencies. No third-party domain. | ✓ |
| Google Fonts `<link rel='stylesheet'>` | Keep Phase 1 preconnects, add stylesheet link with `display=swap`. Smaller install, relies on Google CDN. | |
| Astro 6 experimental Fonts API | Use Astro 6's `experimental.fonts` config with Fontsource provider. Newest pattern, less maturity. | |

### Q2: Which 'Muli' weight set to ship?

| Option | Description | Selected |
|--------|-------------|----------|
| Match existing (400, 400i, 800, 800i) (Recommended) | Same four weights the current site loads. Italic 400/800 are used in existing CSS. | ✓ |
| Trim to 400, 700 (no italics) | Drop italics + 800; substitute with 700 bold. Saves ~30-40 KB. | |
| Variable font (single file, all weights) | Use `@fontsource-variable/mulish`. ~80-120 KB total. | |

### Q3: Saira Extra Condensed weights?

| Option | Description | Selected |
|--------|-------------|----------|
| Match existing (500, 700) (Recommended) | Same two weights the current site loads. | ✓ |
| Add 600 (bold subhead) too | Adds a midweight for any subheadings. | |
| Variable font | Future-flexible. | |

### Q4: FOIT / FOUT strategy?

| Option | Description | Selected |
|--------|-------------|----------|
| font-display: swap on all (Recommended) | @fontsource defaults to `swap` — fallback renders immediately, web font swaps in. Best CLS+LCP balance. | ✓ |
| font-display: optional | Only use web font if it loads within ~100ms; else fallback for the session. | |
| Preload critical weights | Explicit `<link rel='preload'>` for Muli 400 + Saira 700. Smaller LCP at cost of upfront bytes. | |

**User's choice:** Self-host @fontsource/* with the locked existing weights (Mulish 400/400i/800/800i, Saira 500/700) and `font-display: swap`.
**Notes:** "Muli" was renamed to "Mulish" in 2020 — Fontsource ships `@fontsource/mulish`. Same family.

---

## Wrap-up

### Q: We've discussed the 4 areas. Which gray areas remain unclear?

| Option | Description | Selected |
|--------|-------------|----------|
| I'm ready for context | Write CONTEXT.md now. Remaining choices (skills layout, education/work density, markdown body, scroll-spy tuning) are Claude's discretion. | ✓ |
| Explore Skills + Education/Work layout | Discuss skills as icons/grid/pills; education+work as cards or flat rows; testimonial layout. | |
| Explore About + CTAs | About section structure, Download Resume button, contact email CTA, social icons. | |
| Explore markdown body rendering | `<Content />` output — plain `<p>` vs Tailwind typography plugin. | |

**User's choice:** Ready for context — Claude's discretion for the rest.

---

## Claude's Discretion

- Exact sidebar width on desktop — pulled from recovered CRA App.css.
- IntersectionObserver `rootMargin` / `threshold` tuning — D-31 defaults, tune in preview.
- Scroll-spy script location — `BaseLayout.astro` or `SideNav.astro` (single home).
- `@fontsource/*` vs `@fontsource-variable/*` — planner picks the smaller download.
- Pill-chip styling — neutral if recovered CRA pattern is unclear.
- "(opens in new tab)" announcement copy — reasonable default; Phase 4 finalizes.
- Skipping `@tailwindcss/typography` — only add if a section needs rich markdown.
- Exact section heading sizes and spacing scale — from recovered CRA App.css.
- Sidebar list separator styling — match recovered CRA pattern.

## Deferred Ideas

Captured in CONTEXT.md `<deferred>` block. Summary:
- Phase 4 owns axe-core / pa11y gate, expanded BaseHead, sitemap + OG image, color-contrast verification, Tailwind typography decision, font preload review.
- Phase 5 owns dead-dep removal (`react-scroll`, `react-script-tag`, `bootstrap` if present), CNAME absence check, snapshot deletion, hydration fixture removal (optional), GitHub Pages source switch + `gh-pages` branch deletion.
- M2 / future: CMS editing UI, multi-image galleries, lightbox; dark mode + View Transitions explicitly out of scope.
