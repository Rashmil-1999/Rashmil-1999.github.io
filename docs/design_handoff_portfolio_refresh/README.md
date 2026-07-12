# Handoff: Portfolio Design Refresh (rashmilpanchani.me)

## Overview
This is a design refresh of the existing single‑page portfolio (`Rashmil-1999.github.io`, Astro 6 + React islands + Tailwind v4). **The layout, sections, content, and interactions are unchanged.** What changes is the *visual theme* (fonts + color system) plus four small fixes captured as review comments.

The target is the real Astro repo. Everything below maps to specific files in `src/`.

## About the Design Files
The file in this bundle — `Portfolio.dc.html` — is a **design reference created in HTML**, not production code to copy. It is a single self‑contained prototype that recreates the current site pixel‑for‑pixel and then applies the new theme, with a live "tweaks" layer used to explore options. **Do not ship the HTML.** Implement the changes in the existing Astro/Tailwind codebase using its established patterns (Content Collections, `.astro` components, `global.css` `@theme` tokens, astro‑icon).

The prototype drives its theme by writing CSS custom properties at runtime from JS (needed only because it's a single tweakable file). In the real repo you do **not** need that machinery — set the values statically in `src/styles/global.css` `@theme` (and the `body[data-theme='dark']` block) exactly as tabulated under **Design Tokens**.

## Fidelity
**High‑fidelity.** Colors, fonts, and spacing below are final. Recreate exactly.

---

## Part 1 — The chosen theme (the "new tweaks")

The refresh settles on this direction:

| Aspect | Old | New |
|---|---|---|
| Accent | Iris purple `#7a73ff` | **Illini Orange `#FF5F05`** |
| Text on light surfaces | `#212529` / `#000` | **Industrial Blue `#13294B`** (UIUC pairing) |
| Section fill | Solid accent on every alt section | **"Soft"** — pale accent‑tinted sections, dark headings, white cards with a hairline accent border |
| Dark mode | Flat grays (`#494949`/`#5b5b5b`/`#7f7f7f`) | **"Rich"** — tinted charcoal |
| Heading font | Franklin Gothic Medium | **Space Grotesk** (700 for name/headings) |
| Rotating title / accent font | Raleway 300 | **JetBrains Mono** (400) |
| Body font | system‑ui stack | **IBM Plex Sans** (400/600) |

### Fonts
Add to `BaseHead.astro` (or import via `@fontsource`, matching the repo's current Raleway approach):
```
Space Grotesk: 500, 700
JetBrains Mono: 400, 500
IBM Plex Sans: 400, 600
```
Then in `global.css`:
```css
@theme {
  --font-display: 'Space Grotesk', sans-serif;   /* hero name + section titles + card headings */
  --font-titles:  'JetBrains Mono', monospace;   /* rotating hero title + Resume link */
  /* body */
}
body { font-family: 'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
```
The rotating title loses Raleway's 300 weight — use **400** for JetBrains Mono (300 is not loaded). Remove the Raleway `@fontsource` imports and the `Franklin Gothic Medium` stack once migrated.

### Design Tokens
Replace the semantic tokens in `global.css`. The site keeps the same token *names* it already uses (`--color-hero`, `--color-alt`, `--color-surface`, `--color-card`, `--color-node`, etc.); only the values change. The refresh also introduces a few helper tokens the "soft" treatment needs (`--rail-color`, `--title-alt-color`, `--card-border`, and a distinct `--hero-text`).

**Brand constants**
```
--color-brand:      #ff5f05
--color-brand-deep: #d94f04
--color-footer:     #1f1f1f   (light) / #0e0e12 (rich dark)
```

**Light theme (Illini Orange + "soft" sections)**
```
--color-hero:               #ff5f05   /* hero background stays full accent */
--color-surface:            #ffffff   /* about + skills sections */
--color-alt:                #ffefe6   /* education/projects/experience: pale orange tint (was solid accent) */
--color-card:               #ffffff
--color-card-text:          #13294b   /* Industrial Blue body text */
--color-heading-on-surface: #13294b   /* "About me" / "Skills" headings */
--hero-text:                #13294b   /* hero name, laptop icon, Resume link, rotating title */
--title-alt-color:          #111111   /* section titles ON the tinted alt sections (dark now, was white) */
--color-node:               #ff5f05   /* timeline icon nodes */
--color-node-ring:          #ffefe6   /* 4px ring around nodes = the alt tint */
--color-badge-soft-bg:      #ffe2d2   /* experience "soft" tech chips */
--color-badge-soft-text:    #212529
--rail-color:               rgba(255,95,5,0.35)   /* vertical timeline rail */
--card-border:              1px solid rgba(255,95,5,0.16)  /* hairline on cards in soft mode */
```

**Dark theme (`body[data-theme='dark']`, "rich" charcoal)**
```
--color-hero:               #16161c
--color-alt:                #20202a
--color-surface:            #121217
--color-card:               #26262f
--color-card-text:          #f2f2f5
--color-heading-on-surface: #ffffff
--hero-text:                #ffffff
--title-alt-color:          #ffffff
--color-node:               #ff5f05   /* accent pops against charcoal */
--color-node-ring:          #20202a
--color-badge-soft-bg:      #3a3a46
--color-badge-soft-text:    #f2f2f5
--color-footer:             #0e0e12
--rail-color:               rgba(255,255,255,0.18)
--card-border:              1px solid rgba(255,255,255,0.06)
/* rotating title in dark = a light orange: */
--title-styles-color:       #ffaf82
```

Notes for the CSS component classes in `global.css`:
- `.section-title` should read `color: var(--title-alt-color)` instead of hard‑coded `#fff` (it is now dark on the pale sections). `.section-title-dark` continues to use `--color-heading-on-surface`.
- `.timeline::before` background → `var(--rail-color)`.
- `.timeline-card`, `.project-card`, `.terminal-card` gain `border: var(--card-border)`.
- `.timeline-node` `box-shadow: 0 0 0 4px var(--color-node-ring)`.
- Hero name/title/laptop icon/Resume link all resolve to `var(--hero-text)`.

### How the accent generalizes (for reference / if you keep it themeable)
If the accent is ever changed again, the derived values follow: `deep = mix(accent, black, 16%)`, soft section tint `= mix(accent, white, 90%)`, soft chip bg `= mix(accent, white, 82%)`, rail `= rgba(accent, .35)`, card border `= rgba(accent, .16)`. The Illini Orange values above are these formulas evaluated; the Industrial‑Blue text is a deliberate UIUC pairing tied to the orange accent specifically (other accents kept dark‑neutral text).

---

## Part 2 — Review‑comment fixes

All four are small and independent of the theme.

1. **Project card description — justify text.**
   File: `src/components/ProjectsGallery.tsx`, the card body paragraph (currently `className="mb-3 text-left text-sm"`). Change `text-left` → `text-justify`.

2. **"Click for more information" — color = Illini Orange.**
   File: `src/components/ProjectsGallery.tsx`, the card CTA `<button>`. Set its text color to the accent (`text-(--color-brand)` in Tailwind v4, or `color: var(--color-brand)`), instead of inheriting the blue body color.

3. **Experience timeline nodes — one consistent work logo.**
   File: `src/components/Work.astro`. The node currently renders per‑entry tech icons (`entry.data.icon ?? 'lucide:briefcase'`). Make **every** experience node the same icon — `lucide:briefcase` — for visual consistency down the rail. (The per‑entry `icon` field in the work markdown can stay in the data; it just isn't used for the node anymore.) The end‑cap node keeps `lucide:hourglass`.

4. **Modal carousel prev/next buttons — alignment.**
   File: `src/components/ProjectsGallery.tsx`, the `‹` / `›` nav buttons. The raw chevron glyphs render off‑center because their side bearings differ. Replace the text glyphs with proper icons — `lucide:chevron-left` / `lucide:chevron-right` (astro‑icon / inline SVG) — inside the existing round button, flex‑centered. This is what the prototype now does.

---

## Screens / Views (unchanged layout — reference)
Single scrolling page, in order: **Hero → About → Education → Projects → Skills → Experience → Footer**, plus the fixed GitHub‑corner ribbon (top‑left) and the theme switch in the hero.

- **Hero** (`Header.astro`): centered laptop icon (`lucide:laptop`), name (`--font-display` 700, `--hero-text`), typewriter rotating title (`HeroWidgets.tsx`, `--font-titles`), 90×40 theme switch, Resume download link.
- **About** (`About.astro`): white surface; polaroid photo (250px) with `logos:python/react/pytorch/tensorflow`; terminal‑style card (traffic‑light dots) with the intro copy — keep this playful card.
- **Education / Experience** (`Education.astro` / `Work.astro`): centered vertical timeline; cards alternate right/left from `lg`; nodes are round accent circles with a 4px ring; Experience cards carry solid main‑tech badges + soft tech chips.
- **Projects** (`Projects.astro` + `ProjectsGallery.tsx`): stacked cards (image left, text right at `md`); each opens a `<dialog>` carousel with traffic‑light tab, accent‑bordered frame, prev/next, image counter, "View on GitHub", description, and tech icons.
- **Skills** (`Skills.astro`): categories of colored Devicon icons with labels and dividers.
- **Footer** (`Footer.astro`): dark band, social icons, contact email, copyright.

## Interactions & Behavior (unchanged)
- Theme toggle writes `body[data-theme]` + persists to `localStorage` (already implemented in `HeroWidgets.tsx` / `BaseLayout.astro`).
- Typewriter respects `prefers-reduced-motion`.
- Project modal: native `<dialog>.showModal()`; Esc/✕ closes; carousel wraps with modulo.
- All section backgrounds/timelines/cards transition color via the tokens above.

## Assets
No new assets. Existing profile photo, project images, and the résumé PDF are reused. Icons come from the already‑installed Iconify sets (`@iconify-json/lucide`, `logos`, `devicon`, `simple-icons`) — the new `lucide:chevron-left/right` and `lucide:briefcase` are in the `lucide` set already used.

## Screenshots (`screenshots/`)
Rendered from the prototype in the final theme:
- `hero-light.png` — hero: orange bg, Space Grotesk name, JetBrains Mono rotating title, blue text
- `about-light.png` — polaroid + terminal card (justified body copy)
- `education-light.png` — timeline: pale-orange section, white cards, orange hairline border + node ring
- `projects-light.png` — project card (justified description, orange "CLICK FOR MORE INFORMATION")
- `skills-light.png` — Devicon grid
- `experience-light.png` — timeline with the consistent `lucide:briefcase` nodes, orange main badges + peach soft chips
- `about-dark.png`, `projects-dark.png` — the "rich" charcoal dark mode

## Files in this bundle
- `Portfolio.dc.html` — the HTML design reference (with `support.js` + `assets/` alongside so it opens standalone). Reference only.
- `assets/` — copies of the profile + project images used by the prototype.
- `screenshots/` — the images listed above.

---

## Suggested prompt for Claude Code
Paste this in Claude Code with this folder available in the repo (e.g. at repo root):

> Read `design_handoff_portfolio_refresh/README.md` in full. It is a visual refresh of this Astro site — **layout and content stay the same**; only the theme (colors + fonts) changes, plus four small comment fixes. Do this in the existing stack, in order:
>
> 1. **Fonts** — in `src/components/BaseHead.astro`, load Space Grotesk (500/700), JetBrains Mono (400/500), IBM Plex Sans (400/600) the same way Raleway is loaded today; remove the Raleway imports. Update the `@theme` font vars and `body` font in `src/styles/global.css` per the README (`--font-display` = Space Grotesk, `--font-titles` = JetBrains Mono, body = IBM Plex Sans). The rotating title uses weight 400.
> 2. **Color tokens** — in `src/styles/global.css`, replace the semantic token values in `@theme` (light) and the `body[data-theme='dark']` block with the exact hex values in the README's **Design Tokens** tables (Illini Orange accent, Industrial Blue text, "soft" tinted sections, "rich" charcoal dark). Add the new helper tokens (`--rail-color`, `--title-alt-color`, `--card-border`, `--hero-text`) and wire the component classes noted in the README (`.section-title`, `.timeline::before`, `.timeline-node`, `.timeline-card`, `.project-card`, `.terminal-card`, hero elements).
> 3. **Comment fixes** — (a) `ProjectsGallery.tsx`: card description `text-left` → `text-justify`; (b) `ProjectsGallery.tsx`: the "Click for more information" button text color = accent (`var(--color-brand)`); (c) `ProjectsGallery.tsx`: replace the `‹`/`›` carousel glyphs with `lucide:chevron-left`/`lucide:chevron-right` icons, flex-centered in the round button; (d) `Work.astro`: make every experience timeline node `lucide:briefcase` (keep the `lucide:hourglass` end cap).
>
> Do not port the prototype's runtime CSS-variable JS — set the tokens statically in `global.css`. After each step, run the dev server and confirm light + dark both render; keep WCAG AA contrast. Show me a diff before committing.

Verify against the `screenshots/` images and the live prototype (`Portfolio.dc.html`).

## Files to change in the target repo
- `src/styles/global.css` — tokens (light + dark), component‑class token wiring, remove old fonts.
- `src/components/BaseHead.astro` — load Space Grotesk / JetBrains Mono / IBM Plex Sans; drop Raleway.
- `src/components/ProjectsGallery.tsx` — comment fixes 1, 2, 4.
- `src/components/Work.astro` — comment fix 3.
