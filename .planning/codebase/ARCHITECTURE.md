<!-- refreshed: 2026-05-26 -->
# Architecture

**Analysis Date:** 2026-05-26

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Static SPA)                     │
│   `public/index.html` — root template, third-party CDN JS    │
└────────────────────────────────┬────────────────────────────┘
                                 │ mounts to <div id="root">
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│            React Entry / Root Component (App)                │
│              `src/index.js` (createRoot + App)               │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   SideNav    │    About     │  Education   │     Work       │
│ `Navbar.jsx` │ `About.jsx`  │`Education.jsx`│  `Work.jsx`   │
├──────────────┼──────────────┼──────────────┼────────────────┤
│    Skills    │   Projects   │  Leadership  │  Testimonials  │
│`Skills.jsx`  │`Projects.jsx`│`Leadership.jsx`│`Testimonials.jsx`│
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       ▼              ▼              ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│           Static Content Source (props from JSON)            │
│                    `src/resumeData.json`                     │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│   Static Image Assets / PDF                                  │
│   `src/assets/*` and `public/Rashmil_Panchani.pdf`           │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `App` (inline) | Reads `resumeData.json`, slices it, passes props to each section | `src/index.js` |
| `SideNav` | Fixed-top sidebar nav with profile image and section anchor links | `src/components/Navbar.jsx` |
| `About` | Renders name, status, contact, social icons, resume download | `src/components/About.jsx` |
| `Education` | Renders education history list | `src/components/Education.jsx` |
| `Work` | Renders work experience list | `src/components/Work.jsx` |
| `Skills` | Renders categorized skills with Devicon/Iconify icons | `src/components/Skills.jsx` |
| `Projects` | Renders project cards with images, links, tech-stack chips | `src/components/Projects.jsx` |
| `Leadership` | Renders leadership/committee roles | `src/components/Leadership.jsx` |
| `Testimonials` | Renders quoted testimonials | `src/components/Testimonials.jsx` |
| `serviceWorker` | Optional PWA registration helpers (currently unregistered) | `src/serviceWorker.js` |

## Pattern Overview

**Overall:** Single-page static React resume site built on Create React App, deployed to GitHub Pages via `gh-pages`.

**Key Characteristics:**
- Single-page composition: one `App` component renders every section vertically in `src/index.js`; there is no router.
- Data-driven views: all displayed content originates from `src/resumeData.json` and is destructured at the root.
- Presentational components only: each component in `src/components/` is a stateless functional component that receives data via props and renders Bootstrap-styled JSX.
- Styling is global: `src/App.css` (~10.6k lines) and Bootstrap 4 (loaded via CDN in `public/index.html`) drive all visual styling; no CSS modules or styled-components.
- Static deployment: `react-scripts build` outputs to `build/`, which is published to GitHub Pages by the `deploy` script.

## Layers

**Entry / Composition Layer:**
- Purpose: Mounts React, owns the JSON data, fans out props to section components.
- Location: `src/index.js`
- Contains: `App` functional component, `createRoot` call, service worker `unregister()`.
- Depends on: `react`, `react-dom/client`, all components in `src/components/`, `src/resumeData.json`, `src/App.css`.
- Used by: Browser via `public/index.html` (`<div id="root">`).

**Presentation Layer:**
- Purpose: Pure presentational components, one per resume section.
- Location: `src/components/`
- Contains: Stateless functional `.jsx` components that consume props and emit Bootstrap-classed JSX.
- Depends on: `react`, `react-scroll` (only `Navbar.jsx`), image imports from `../assets/` (only `Navbar.jsx` and `Projects.jsx`).
- Used by: `App` in `src/index.js`.

**Static Data Layer:**
- Purpose: Source of truth for all resume content.
- Location: `src/resumeData.json`
- Contains: `about`, `sections`, `links`, `resumeData` (education, work, skills, skill_array), `projects`, `leaderships`, `testimonials`.
- Depends on: Nothing.
- Used by: `App` in `src/index.js`.

**Static Asset Layer:**
- Purpose: Images and downloadable artifacts.
- Location: `src/assets/` (imported, hashed at build) and `public/` (served as-is).
- Contains: Project/profile images (`src/assets/*.png|jpg|jpeg|webp`), favicons and PDF in `public/`.
- Used by: `Navbar.jsx` (profile image), `Projects.jsx` (project images), `About.jsx` (`resume_download` references `Rashmil_Panchani.pdf` in `public/`).

**Host Page Layer:**
- Purpose: HTML shell, CDN-loaded libraries (jQuery, Bootstrap JS, Font Awesome, Devicon, Iconify), legacy inline scroll-spy script.
- Location: `public/index.html`
- Used by: The browser; React mounts into `#root`.

## Data Flow

### Primary Render Path

1. Browser loads `public/index.html`, which pulls jQuery, Bootstrap, Font Awesome, Devicon, Iconify from CDNs.
2. CRA-bundled JS executes `src/index.js`, which imports `src/resumeData.json` (`src/index.js:19`).
3. `App` destructures `sections`, `links`, `about`, `resumeData`, `projects`, `testimonials`, `leaderships` (`src/index.js:23-31`).
4. `createRoot(document.getElementById('root')).render(<App />)` mounts the tree (`src/index.js:67-69`).
5. `<StrictMode>` wraps a `<SideNav>` and a `<div className="container-fluid">` containing all section components in fixed order (`src/index.js:34-62`).
6. Each section component maps over its slice of data and emits Bootstrap-styled markup.
7. `serviceWorker.unregister()` runs unconditionally after render (`src/index.js:75`).

### Navigation Flow

1. User clicks a link in `SideNav` (`src/components/Navbar.jsx:39`); the anchor `href` comes from `links[id]` in `resumeData.json` (e.g. `#about`).
2. Native anchor jump scrolls to the matching `<section id="...">` rendered by the corresponding component (each component sets an `id` such as `id="about"`, `id="projects"`).
3. The inline jQuery in `public/index.html:69-105` provides smooth-scroll easing and scroll-spy active-link highlighting against `#sideNav`.
4. `react-scroll` is imported in `Navbar.jsx:2` but is not used in the rendered JSX; smooth scrolling is delivered by the legacy jQuery snippet, not by React.

**State Management:**
- No client state. No `useState`, `useReducer`, `useEffect`, or context anywhere in `src/components/` or `src/index.js`. Everything is a pure function of props.

## Key Abstractions

**Section Component:**
- Purpose: Render one vertical resume section from a single prop slice.
- Examples: `src/components/About.jsx`, `src/components/Education.jsx`, `src/components/Work.jsx`, `src/components/Skills.jsx`, `src/components/Projects.jsx`, `src/components/Leadership.jsx`, `src/components/Testimonials.jsx`.
- Pattern: Default-exported arrow function `(props) => <section className="resume-section" id="...">...</section>`, terminated by `<hr className="m-0" />` (except `Testimonials.jsx`, which has no trailing `<hr>`).

**Image Map (Projects only):**
- Purpose: Translate the string `image` field in each project record to an imported binary asset.
- Examples: `image_map` object in `src/components/Projects.jsx:23-37`.
- Pattern: Static object literal keyed by string; lookups via `image_map[project.image]`.

**Data Slice via Destructuring:**
- Purpose: Co-locate JSON shape knowledge inside the root `App` component.
- Examples: `src/index.js:23-31`.
- Pattern: Top-level destructure of `resumeData.json`, then pass each piece as a named prop.

## Entry Points

**Browser entry:**
- Location: `public/index.html`
- Triggers: Initial page load at `https://Rashmil-1999.github.io` (configured by `homepage` in `package.json:13`).
- Responsibilities: Load CDN libraries (jQuery, Bootstrap, Font Awesome, Devicon, Iconify), define inline scroll-spy/easing script, host `<div id="root">` mount point.

**JavaScript entry:**
- Location: `src/index.js`
- Triggers: Bundled and injected into `index.html` by `react-scripts` during `start`/`build`.
- Responsibilities: Import CSS, define `App`, mount it into `#root`, unregister any prior service worker.

**Build entry:**
- Location: `package.json` `scripts.build` -> `react-scripts build`.
- Triggers: `npm run build` or the `predeploy` hook (`package.json:19`).
- Responsibilities: Produce `build/` directory consumed by `gh-pages -d build` (`package.json:20`).

## Architectural Constraints

- **Threading:** Single-threaded browser main thread; no Web Workers, no async data fetching anywhere.
- **Global state:** None in JS. However, global window-scoped jQuery (`$`) and Bootstrap globals are assumed to be available via CDN script tags in `public/index.html`; the React tree depends on these being loaded for scroll-spy and the responsive navbar collapse to work.
- **External CDN dependency:** Rendering correctness relies on `fontawesome.com`, `fonts.googleapis.com`, `jsdelivr.net` (Devicon), `code.iconify.design`, `cdnjs.cloudflare.com`, and `stackpath.bootstrapcdn.com`. Offline or blocked-CDN scenarios degrade the UI.
- **Circular imports:** None observed.
- **Routing:** No client router. All sections are rendered into one page; navigation is anchor-based only.
- **Service Worker:** Disabled at runtime (`serviceWorker.unregister()` in `src/index.js:75`); `serviceWorker.js` ships but is not active.

## Anti-Patterns

### Unused import of `react-scroll` in `Navbar.jsx`

**What happens:** `src/components/Navbar.jsx:2` imports `{ Link, animateScroll as scroll }` from `react-scroll`, but the rendered JSX uses plain `<a className="nav-link js-scroll-trigger" href={links[id]}>` (`src/components/Navbar.jsx:39`). `react-scroll` is a runtime dependency in `package.json` solely because of this dead import.
**Why it's wrong:** Adds bundle weight and signals "scrolling is handled by React" while in reality scrolling is handled by the inline jQuery script in `public/index.html`.
**Do this instead:** Either remove the import and the dependency, or migrate the navbar to actual `<Link>` elements from `react-scroll` and delete the inline jQuery scroll snippet in `public/index.html:69-105`.

### Mixed legacy jQuery scroll logic with a React tree

**What happens:** `public/index.html` ships an inline IIFE (`public/index.html:65-106`) that uses jQuery to attach click handlers to `.js-scroll-trigger` and to invoke `scrollspy` on `#sideNav`. The same DOM is then re-rendered/owned by React.
**Why it's wrong:** React owns the DOM; binding jQuery handlers to React-rendered nodes is fragile across re-renders and is brittle when modernizing the navbar.
**Do this instead:** Replace with `react-scroll`'s `<Link>` components (already a dependency) or with a small `useEffect`-driven scroll-spy in `Navbar.jsx`, and remove the inline jQuery block.

### CDN-loaded UI libraries instead of bundled imports

**What happens:** Bootstrap 4 CSS/JS, Font Awesome, Devicon, Iconify, and jQuery are loaded from third-party CDNs in `public/index.html:14-35,60-63,107`. None of them are listed in `package.json`.
**Why it's wrong:** First paint depends on third-party availability, version drift can silently break styling, and there is no offline build artifact.
**Do this instead:** Install the libraries as npm dependencies and import them from `src/index.js` (or split CSS), so CRA bundles and version-pins them.

### Image lookup via a hard-coded object map

**What happens:** `src/components/Projects.jsx:23-37` maintains an `image_map` that must be updated by hand whenever a project image is added in `resumeData.json`.
**Why it's wrong:** Two sources of truth (JSON value + JS import map) must stay in sync; missing entries silently render broken images.
**Do this instead:** Either point `resumeData.json` directly at paths under `public/` (and load images by URL), or generate the map from a Webpack/CRA `require.context` over `src/assets/`.

### Incorrect `<StrictMode>` placement

**What happens:** `src/index.js:34` wraps the entire `App` JSX inside `<StrictMode>` *inside* the component returned to `createRoot`.
**Why it's wrong:** Conventionally `<StrictMode>` wraps the rendered root in the `render(...)` call (e.g., `createRoot(rootEl).render(<StrictMode><App /></StrictMode>)`). The current placement works but is non-idiomatic and easy to misread.
**Do this instead:** Move `<StrictMode>` to wrap `<App />` at the `createRoot(...).render(...)` call site.

## Error Handling

**Strategy:** None implemented. There is no error boundary, no try/catch, no fallback UI.

**Patterns:**
- Missing project image -> `image_map[project.image]` evaluates to `undefined`, producing a broken `<img>` with no `alt` fallback handling.
- Missing JSON keys -> destructuring in `src/index.js:23-31` yields `undefined`; downstream `.map(...)` calls throw at render time.
- Network-blocked CDNs -> degraded styling and broken scroll-spy, with no React-side detection.

## Cross-Cutting Concerns

**Logging:** None in application code. `src/serviceWorker.js` uses `console.log`/`console.error`, but it is unregistered and dormant.
**Validation:** None. JSON is trusted as-is at build time.
**Authentication:** Not applicable; the site is a public static page.
**Accessibility:** Partial Bootstrap defaults only — `Navbar.jsx` sets `aria-controls`, `aria-expanded`, `aria-label="Toggle navigation"`; other components rely on semantic `<section>`/`<h2>`/`<blockquote>` structure without explicit ARIA wiring. Project cards use external links with `target="_blank" rel="noopener noreferrer"` (`src/components/Projects.jsx:61-62`).

---

*Architecture analysis: 2026-05-26*
