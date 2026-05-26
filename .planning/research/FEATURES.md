# Feature Research

**Domain:** Developer personal portfolio (static, single-page, GitHub Pages hosted)
**Researched:** 2026-05-26
**Confidence:** HIGH for content/SEO table stakes (multiple corroborating sources + Astro docs); MEDIUM for "what differentiators are worth it" (subjective, source guidance varies).

## Reading Guide

This is a **modernization** milestone, not a feature expansion. The most important column in every table below is **"Existing site has it?"** — for M1's "light polish" budget, the default action is *port what exists*, *add the small set of missing table stakes*, and *defer everything else*. Active-requirement candidates for M1 are explicitly flagged in the "M1 recommendation" column.

The existing 8-section layout (SideNav, About, Education, Work, Skills, Projects, Leadership, Testimonials) is treated as fixed scope per `.planning/PROJECT.md`. None of the "new section" feature ideas in this file are M1 candidates.

## Feature Landscape

### Table Stakes — Content Features

What a recruiter / fellow developer expects to find on any developer portfolio in 2026. Absence is a negative signal.

| Feature | Why Expected | Existing site has it? | Complexity | M1 recommendation |
|---|---|---|---|---|
| Name + role/status above the fold | Identity in <2 seconds | YES (`About.jsx`) | LOW | Port as-is. Validated requirement. |
| Short bio / "about" blurb | Humanizes the page; recruiters skim it first | YES (`About.jsx` reads `about.contact_message`) | LOW | Port as-is. Validated requirement. |
| Profile photo | Recognition; matches LinkedIn | YES (`Navbar.jsx` reads `profilepic.jpg`) | LOW | Port as-is. Validated requirement. |
| Contact: email + social links | "How do I reach this person?" | YES (`About.jsx` renders `about.social`) | LOW | Port as-is. Validated requirement. |
| Resume PDF download | Recruiters paste it into ATS systems | YES (`public/Rashmil_Panchani.pdf` + `About.jsx`) | LOW | Port as-is — must keep working per PROJECT.md constraints. Validated requirement. |
| Work experience (reverse chrono) | Standard resume structure | YES (`Work.jsx`) | LOW | Port as-is. Validated requirement. |
| Education | Standard resume structure | YES (`Education.jsx`) | LOW | Port as-is. Validated requirement. |
| Projects with descriptions, links, tech stack | Primary "proof of work" recruiters scan for | YES (`Projects.jsx`) | LOW | Port as-is, but the hand-maintained `image_map` anti-pattern goes away via Content Layer (already in PROJECT.md Active). |
| Skills list | Recruiter keyword-matching + ATS hit | YES (`Skills.jsx`) | LOW | Port as-is. Validated requirement. |
| Anchor navigation between sections | Single-page sites must offer in-page nav | YES (`Navbar.jsx`) | LOW | Already in PROJECT.md Active (native scroll-spy, no jQuery). |
| Mobile responsive layout | >50% of recruiter views are mobile | YES (Bootstrap 4 grid) | LOW | Already in PROJECT.md Active (Tailwind v4 port). |
| Functional `<title>` tag | Browser tab + search result heading | YES (generic `"Rashmil Panchani"`) | LOW | Port — sufficient as-is, can refine to `"Name — Role"`. |
| Favicon | Browser tab recognition | YES (`favicon.png`, `favicon.ico`) | LOW | Port as-is. Validated requirement. |
| `robots.txt` | Crawlers expect to find it (404 is mildly bad) | YES | LOW | Port as-is. Validated requirement. |

### Table Stakes — Meta Features (SEO / Discoverability / Standards)

These are non-visual but very visible in *how the link previews when shared* and *whether the site reaches recruiters via search*. Strong consensus from 2026 sources that these are table-stakes for a static developer portfolio, not differentiators.

| Feature | Why Expected | Existing site has it? | Complexity | M1 recommendation |
|---|---|---|---|---|
| Descriptive `<meta name="description">` per page | Search snippets, AI-search overviews | PARTIAL (generic `"Personal Website"`) | LOW | **ADD to M1** — replace with name/role description. Negligible cost. |
| OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) | Rich link previews on Slack, LinkedIn, iMessage, WhatsApp | NO | LOW | **ADD to M1** — single `<BaseHead>` Astro component; one OG image (can reuse profile photo or generate a static PNG). |
| Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:image`) | Rich previews on X / Threads | NO | LOW | **ADD to M1** — same `<BaseHead>` component handles it. |
| Canonical URL (`<link rel="canonical">`) | Prevents duplicate-content penalties when crawled via `*.github.io` and any future custom domain | NO | LOW | **ADD to M1** — one line per page, derived from `Astro.site` + `Astro.url.pathname`. |
| `sitemap.xml` | Required by Search Console; signals "this site is maintained" | NO | LOW | **ADD to M1** — `@astrojs/sitemap` is an official integration, drop-in. |
| Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`) | Required for SR users + recruiter ATS scrapers | PARTIAL (uses `<section>`, missing `<main>`, `<header>` proper) | LOW | **ADD to M1** — already inside PROJECT.md Active "WCAG 2.1 AA: semantic landmarks". |
| WCAG 2.1 AA compliance (focus, contrast, ARIA, keyboard, alt text) | Hard requirement per `.claude/CLAUDE.md`; basic professional bar | PARTIAL (some `aria-*` on navbar; project images lack reliable `alt`; contrast unverified) | MEDIUM | Already in PROJECT.md Active. |
| Lighthouse / Web Vitals scores ≥ 90 | Recruiters with technical bent will literally run Lighthouse on you | LIKELY NO (CDN-loaded jQuery+Bootstrap+FontAwesome+Iconify+Devicon adds 5+ blocking external requests; CRA bundle is not optimized) | LOW once on Astro static | **Implicit in M1** — moving to Astro static output + bundled assets + no CDN libs gives this nearly for free. Worth running Lighthouse as part of M1 verification. |
| Manifest + theme-color | iOS / Android "add to home screen" looks polished | PARTIAL (`manifest.json` is the CRA default template, never customized) | LOW | **ADD to M1** — author a real `manifest.webmanifest` (name, short_name, icons, theme_color). Five-minute task; current default is mildly embarrassing. |
| Print stylesheet for resume page | People literally print portfolios | NO | LOW | **DEFER** — resume PDF already covers this use case. Don't add. |
| HTTPS | Browsers shame non-HTTPS sites | YES (GitHub Pages default) | N/A | N/A — hosting-level. |

**Confidence note:** All meta-feature recommendations above are HIGH confidence — Astro docs explicitly document `@astrojs/sitemap`, `<BaseHead>` patterns, and recommend OpenGraph as standard portfolio practice. ([Astro SEO guide](https://joost.blog/astro-seo-complete-guide/), [Astro Sitemaps](https://www.datocms.com/blog/astro-seo-and-datocms))

### Differentiators (Strong Portfolios Have, But Not Expected)

Things that *signal* extra polish. Each one has real implementation cost — most should be **deferred from M1** because the milestone budget is "light polish," not "add features."

| Feature | Value Proposition | Existing site has it? | Complexity | M1 recommendation |
|---|---|---|---|---|
| Dark mode (`prefers-color-scheme` + manual toggle) | 91% of users report preferring dark mode where available; signals attention to UX | NO | MEDIUM (needs CSS-var color system, toggle UI, `localStorage` persistence, FOUC-free script in `<head>`) | **DEFER** — PROJECT.md explicitly lists "Dark mode" under Out of Scope. Honor that. (Even auto-only `@media (prefers-color-scheme: dark)` requires a designed dark palette, which is "redesign," not "polish.") |
| View Transitions API (Astro `<ClientRouter />`) | Smooth cross-page swaps; "feels app-like" | N/A (single-page site, no cross-page nav) | LOW to enable, but provides **near-zero visible value** on a single-page site | **DEFER** — Astro's own docs note ClientRouter "earns its place" for multi-page portfolios. For a one-page anchor-nav site, the visible benefit is nil and it adds JS weight. CSS `view-transition-name` micro-animations within one page are even more niche. |
| Custom OpenGraph image generator (Satori / `og-image` per page) | Per-section / per-project social previews | NO | MEDIUM | **DEFER** — single static OG image (part of "table stakes" row above) is sufficient for one-page site. |
| JSON-LD Person schema | Helps Google Knowledge Panel + AI-search recognition; recruiter LinkedIn-style "card" in search | NO | LOW (one `<script type="application/ld+json">` block) | **OPTIONAL for M1** — small enough cost it could ride along with the OpenGraph work, but not strictly table-stakes. Recommend including in M1 since it's ~15 lines and substantively improves entity recognition. ([Person schema guide](https://siftfeed.com/guides/person-org-schema-markup-a-practical-guide)) |
| RSS feed | Standard for blogs | N/A (no blog) | LOW | **DEFER** — explicitly N/A; PROJECT.md Out of Scope excludes "new sections (blog…)" |
| Subtle scroll-reveal animations (Intersection Observer + CSS) | Adds liveliness without distraction | NO | MEDIUM | **DEFER** — qualifies as visual redesign, not polish. |
| Project case-study sub-pages | Deeper proof of work for hiring managers | NO | HIGH | **DEFER** — PROJECT.md Out of Scope lists "case studies". |
| Testimonials with photos / company logos | More credible than text-only quotes | PARTIAL (text-only via `Testimonials.jsx`) | MEDIUM (needs sourcing photos + permissions) | **DEFER** — content sourcing exceeds "polish" budget. |
| Live GitHub stats widget | "Active developer" signal | NO | MEDIUM (third-party API, runtime fetch, caching) | **DEFER** — runtime fetches contradict static-only constraint; if added later, use build-time fetch. |
| Contact form with backend | Lower friction than mailto: | NO (uses mailto:/social links) | HIGH (requires backend or third-party service like Formspree/Web3Forms) | **DEFER** — explicitly contradicts "no backend" constraint. mailto:/social are sufficient. |
| Analytics (Plausible, Umami, GA4) | Know who visits | NO | LOW | **DEFER** — PROJECT.md Out of Scope explicitly excludes analytics. |
| 404 page (branded) | Polish signal when links go stale | NO (GitHub Pages default) | LOW | **OPTIONAL for M1** — Astro generates `404.astro` trivially. Cheap, professional. Recommend including. |
| Internationalization (i18n) | Multi-language portfolio | NO | HIGH | **DEFER** — Out of Scope per PROJECT.md. |
| PWA / installable | "Add to home screen" works | PARTIAL (manifest exists but service worker is `unregister()`'d) | MEDIUM | **DEFER** — PROJECT.md Out of Scope explicitly excludes PWA / service worker. |
| Reduced-motion support (`prefers-reduced-motion`) | Accessibility for vestibular disorders | N/A today (no animations to reduce) | LOW | **CONDITIONAL** — only required if M1 introduces any motion. Since "light polish" should not introduce new animations, this is moot. If a smooth-scroll behavior is added in M1, gate it with `@media (prefers-reduced-motion: no-preference)`. |

### Anti-Features (Commonly Added, Actively Harmful)

Things that surface-appeal but cost more than they give. Documenting these explicitly so they don't sneak into M1 as "obvious good ideas."

| Feature | Why Requested | Why Problematic | Alternative |
|---|---|---|---|
| Splash / intro screen with logo animation | "Looks impressive" | Adds 1-3s before content; recruiters bounce; tanks LCP and Lighthouse; universally cited as the #1 portfolio anti-pattern | Skip entirely. Render content immediately. |
| Heavy hero-section animations (typewriter, particles, GSAP scenes) | Showcase "frontend skill" | Distracts from content; janks on mid-range phones; reads as "more interested in showing off than in being read" | Static hero + tasteful CSS hover states only. |
| Auto-playing music or video background | Atmosphere | Universally hated; accessibility violation (auto-play); doubles page weight | Don't. |
| Custom cursor / cursor-following effects | Novelty | Breaks native cursor affordances (text-select, link-hover); accessibility hazard | Native cursor. |
| Horizontal scroll layouts for everything | "Differentiates from typical sites" | Breaks scroll-wheel expectations; awful on touch; hostile to screen readers | Vertical scroll. |
| One-page with infinite scroll loading more sections | "Modern" | Defeats anchor nav; breaks back button; recruiters can't ctrl-F | Static 8-section layout (already the design). |
| `<canvas>` / WebGL 3D scenes in hero | "Wow factor" | 200-500KB JS; battery drain; LCP killer; CLS issues | Static SVG illustration if any visual flourish is needed. |
| Embedded chatbot ("Ask my portfolio AI about me") | Novelty in 2025-2026 | Hallucinates; recruiters don't trust it; adds API costs; mostly novelty | Make the actual content scannable. |
| Mega-detailed project case studies with parallax / scrolly-telling | "Looks like a designer portfolio" | High maintenance; content goes stale; most recruiters skim past | Short project card + GitHub link + live demo link. |
| Custom-font heroics (5+ web fonts) | Typographic flex | FOUT; LCP regression; CLS | 1-2 fonts max, with `font-display: swap`. |
| Newsletter signup on a personal portfolio | "Engagement" | No content to deliver; nobody subscribes; clutter | Don't. RSS or X/LinkedIn follow is enough if there's a blog later. |
| Cookie consent banner on a static site with no cookies | "GDPR" | If you have no cookies and no analytics, you don't need one. Banner is itself annoying. | Only add if/when analytics is added (which M1 doesn't). |
| Splash of UI library widgets (carousels, accordions, modals) just to show them | Demonstrate skill | Each is an interaction trap and accessibility hazard if not done carefully | Use only when content genuinely benefits. |
| Real-time visitor counter / "1,247 people viewed this" | Vanity | Reads as 2005-era; requires backend; privacy concerns | Don't. |

**Confidence on anti-features:** HIGH — the splash-screen / heavy-animation / auto-play anti-pattern set is consistent across every credible 2024-2026 source on developer portfolios. ([Sarah Doody on UX portfolio mistakes](https://sarahdoody.medium.com/8-ux-mistakes-to-avoid-on-your-ux-portfolio-website-4d6dd437cf21), [Wix on animation moderation](https://www.wix.com/blog/animation-portfolios))

## Feature Dependencies

```
@astrojs/sitemap (sitemap.xml)
    └──requires──> Astro `site` set in astro.config.mjs

OpenGraph meta tags (per-page)
    └──requires──> a shared <BaseHead> Astro component
                       └──requires──> Astro `site` set in astro.config.mjs
                       └──requires──> one OG image asset in /public

JSON-LD Person schema
    └──requires──> stable canonical URL (i.e., `site` configured)
    └──enhances──> OpenGraph (same data, different consumer)

Canonical URL
    └──requires──> Astro `site` set in astro.config.mjs

Custom 404 page
    └──standalone──> just src/pages/404.astro

Real manifest.webmanifest + theme-color
    └──standalone──> author file in /public, link from <head>

Semantic landmarks (<main>, <nav>, <header>)
    └──blocks──> WCAG 2.1 AA conformance
    └──enhances──> "Skip to main content" link (if added)

Native scroll-spy (PROJECT.md Active)
    └──conflicts──> jQuery scroll-spy IIFE in public/index.html (anti-pattern, deletion in scope)

Dark mode  ──conflicts──> "light polish only" M1 budget; deferred to M2+

View Transitions  ──N/A──> single-page anchor-nav site
```

### Dependency Notes

- **`astro.config.mjs` `site` is a prerequisite for almost every SEO table-stake** (sitemap, canonical, OG `og:url`, JSON-LD `@id`). Per PROJECT.md the site URL is `https://Rashmil-1999.github.io/`. This should be the first piece set during M1's Astro scaffold.
- **`<BaseHead>` component is the natural carrier for OG + Twitter Cards + canonical + description + JSON-LD.** Designing it once is cheaper than retrofitting. Recommend it be part of the initial Astro scaffold phase, not bolted on later.
- **Dark mode is gated by visual redesign**, which is Out of Scope. Re-evaluate in M2.
- **View Transitions API has no value on a single-page anchor-nav site**, regardless of whether Astro 5 supports it well. Don't enable `<ClientRouter />`. ([Joost on dropping ClientRouter](https://joost.blog/replacing-astro-clientrouter/) for context on when it does and doesn't pay off.)

## MVP Definition (Mapped to M1 Scope)

M1 is *not* an MVP — it's a re-platforming of an existing portfolio. The "MVP" framing below maps to:

- **Validated already** = currently shipping, must round-trip without regression
- **Active (M1)** = port + add this small set of missing table-stakes
- **Deferred (M2+ or never)** = explicitly out of scope for this milestone

### Already Shipping — Port Without Regression (Validated requirements)

- [x] 8 resume sections (About, Education, Work, Skills, Projects, Leadership, Testimonials) — Validated in PROJECT.md
- [x] Anchor-based in-page navigation
- [x] Profile photo
- [x] Social links + email
- [x] Resume PDF download
- [x] Project cards with images, links, tech-stack chips
- [x] Mobile responsive layout
- [x] Favicon + `robots.txt`
- [x] Basic `<title>` and `<meta name="author">`
- [x] GitHub Pages static hosting

### Add in M1 (light polish, all LOW complexity) — recommended Active requirement candidates

These are the small, defensible adds. Each one is a five-to-thirty-minute job on Astro and produces a visible-or-functional quality lift.

- [ ] **OpenGraph + Twitter Card meta tags** in a shared `<BaseHead>` — needed for sharable link previews, no good reason to skip in 2026.
- [ ] **Canonical URL meta tag** — one line, prevents duplicate-content ambiguity.
- [ ] **`<meta name="description">` that says something real** — replace generic "Personal Website".
- [ ] **`@astrojs/sitemap` integration** — drop-in, signals maintained site to crawlers.
- [ ] **Real `manifest.webmanifest`** (name, short_name, icons, theme_color) — five-minute task; current CRA-default manifest is leakage.
- [ ] **JSON-LD Person schema** — small, high signal-to-cost ratio; helps entity recognition. Optional but recommended.
- [ ] **Custom 404 page (`src/pages/404.astro`)** — small polish lift; Astro generates trivially. Optional but recommended.

Plus everything already listed under PROJECT.md "Active" (Astro 5 + TS, Tailwind v4, Content Layer, semantic landmarks, ARIA, scroll-spy, ESLint/Prettier, GitHub Actions deploy).

### Defer to M2+ (NOT M1)

- [ ] Dark mode — explicitly Out of Scope in PROJECT.md
- [ ] View Transitions / `<ClientRouter />` — near-zero value on single-page site
- [ ] Custom domain — explicitly Out of Scope
- [ ] Analytics — explicitly Out of Scope
- [ ] PWA / service worker — explicitly Out of Scope
- [ ] Per-page OG image generation (Satori) — single static OG image suffices
- [ ] Scroll-reveal animations — qualifies as redesign, not polish
- [ ] Project case-study sub-pages — Out of Scope ("no new sections")
- [ ] Live GitHub stats — runtime fetch contradicts static-only
- [ ] Blog / RSS — no blog in scope
- [ ] Contact form with backend — no backend in scope

### Never (Anti-Features)

Everything in the Anti-Features table above. Document them so they don't sneak in as "obvious extras."

## Feature Prioritization Matrix (M1 Adds Only)

Only "Add in M1" items are scored here — everything else is either Validated (carry over) or Out of Scope (don't score).

| Feature | User Value | Implementation Cost | Priority |
|---|---|---|---|
| OpenGraph + Twitter Card tags | HIGH (every share preview) | LOW | **P1** |
| Real `<meta name="description">` | MEDIUM (search snippets) | LOW (one string) | **P1** |
| Canonical URL | LOW-MEDIUM (SEO hygiene) | LOW (one line) | **P1** |
| `@astrojs/sitemap` | MEDIUM (Search Console + crawler signal) | LOW (drop-in integration) | **P1** |
| Real `manifest.webmanifest` | LOW (mostly mobile install polish) | LOW | **P2** |
| JSON-LD Person schema | MEDIUM (entity recognition, AI-search) | LOW (~15 lines) | **P2** |
| Custom branded 404 page | LOW (rarely seen) | LOW | **P2** |

P1 = strong "do it in M1." P2 = "do if convenient; cut without guilt if M1 gets long."

## Competitor / Reference Analysis

Spot-check of common modern Astro portfolio templates and exemplar developer sites in 2026 for "what's in the box":

| Feature | Astro `dante-astro-theme` | Astro `astrogaia` | Strong indie devs in 2026 | Our Approach (M1) |
|---|---|---|---|---|
| OpenGraph + Twitter Cards | YES | YES | YES (near-universal) | YES — add in M1 |
| Sitemap | YES | YES | YES | YES — add in M1 |
| Canonical URLs | YES | YES | YES | YES — add in M1 |
| Dark / light toggle | YES | YES | YES (very common, ~80%) | NO — Out of Scope per PROJECT.md |
| View Transitions | YES | YES | Mixed (multi-page yes, single-page no) | NO — single-page site |
| RSS feed | YES (blog-bearing) | YES (blog-bearing) | YES iff blog exists | N/A — no blog |
| 404 page | YES | YES | YES | YES (P2) — recommend add |
| Manifest + theme-color | YES | YES | YES | YES — add in M1 |
| JSON-LD Person schema | Mixed | Mixed | ~50% | YES (P2) — recommend add |
| Lighthouse 90+ scores | YES | YES | YES | Implicit win from Astro static |

**Takeaway:** of the things competitors offer that the existing CRA site lacks, the only one explicitly excluded by M1 scope is **dark mode**. Every other gap (OG, sitemap, canonical, real manifest, JSON-LD) is in the "trivially cheap, recommend including" bucket.

## Sources

- [Top 8 Developer Portfolio Websites to Inspire You in 2026 — Gola](https://www.gola.supply/blog/developer-portfolio-websites)
- [Building a Modern Developer Portfolio: A Technical Deep Dive — Medium](https://medium.com/@zulfikarditya/building-a-modern-developer-portfolio-a-technical-deep-dive-a95d068b99fd)
- [25 web developer portfolio examples — Hostinger](https://www.hostinger.com/tutorials/web-developer-portfolio)
- [28 Things to Put on Your Web Developer Portfolio — Learn To Code With Me](https://learntocodewith.me/posts/portfolio-tips/)
- [Web Developer Portfolio: How to Build a Powerful One — arc.dev](https://arc.dev/talent-blog/web-developer-portfolio/)
- [Astro SEO: the definitive guide — Joost.blog](https://joost.blog/astro-seo-complete-guide/)
- [Astro, Sitemaps, SEO, and Best Practices — DatoCMS Blog](https://www.datocms.com/blog/astro-seo-and-datocms)
- [astro-seo by jonasmerlin — GitHub](https://github.com/jonasmerlin/astro-seo)
- [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/)
- [Astro ClientRouter API reference](https://docs.astro.build/en/reference/modules/astro-transitions/)
- [Dropping Astro's ClientRouter for web standards — Joost.blog](https://joost.blog/replacing-astro-clientrouter/)
- [Dante Astro theme — GitHub](https://github.com/JustGoodUI/dante-astro-theme)
- [13 Best Open-source Portfolio Templates for Designers and Developers — Medevel](https://medevel.com/13-portfolio-templates-astro/)
- [Dark Mode Done Right: Best Practices for 2026 — Medium](https://medium.com/@social_7132/dark-mode-done-right-best-practices-for-2026-c223a4b92417)
- [prefers-color-scheme CSS media feature — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme)
- [Person Org Schema Markup: A Practical Guide — SiftFeed](https://siftfeed.com/guides/person-org-schema-markup-a-practical-guide)
- [Person Schema JSON-LD examples — jsonld.com](https://jsonld.com/person/)
- [8 UX Mistakes To Avoid On Your UX Portfolio Website — Sarah Doody](https://sarahdoody.medium.com/8-ux-mistakes-to-avoid-on-your-ux-portfolio-website-4d6dd437cf21)
- [14 Animation Portfolios for Your Inspiration — Wix (animation moderation guidance)](https://www.wix.com/blog/animation-portfolios)
- [PROJECT.md — `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/PROJECT.md`](file:///Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/PROJECT.md)
- [Existing site head audit — `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/public/index.html`](file:///Users/rashmilpanchani/Documents/Rashmil-1999.github.io/public/index.html)
- [Codebase ARCHITECTURE.md — `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/codebase/ARCHITECTURE.md`](file:///Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/codebase/ARCHITECTURE.md)
- [Codebase STRUCTURE.md — `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/codebase/STRUCTURE.md`](file:///Users/rashmilpanchani/Documents/Rashmil-1999.github.io/.planning/codebase/STRUCTURE.md)

---
*Feature research for: developer personal portfolio (single-page, static, GitHub Pages)*
*Researched: 2026-05-26*
