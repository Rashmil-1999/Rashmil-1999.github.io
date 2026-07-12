## Project

**Rashmil Panchani Portfolio (rashmil-1999.github.io)**

A single-page personal portfolio site for Rashmil Panchani — about, education, work, skills, projects, leadership, and testimonials, with a downloadable résumé PDF. Today it is a Create React App SPA published to GitHub Pages. This project rebuilds it on a modern static stack so the same content renders cleanly and the data is structured for in-place editing through a future editing surface.

**Core Value:** The site looks and reads the same to a visitor, but underneath the stack is modern, the code is conventional, and resume content lives in typed Content Collections that a future editing surface can write to without touching code.

### Constraints

- **Hosting**: GitHub Pages (free tier) — no backend, no server runtime, must publish as static files
- **Tech stack**: Astro 6, React 19 (islands only), Tailwind v4 (via `@tailwindcss/vite`, NOT the deprecated `@astrojs/tailwind` integration which is v3-only), TypeScript 5 (strict), Node 22 LTS — current stable as of 2026-05; "use the latest features where they help, not for the sake of it"
- **Repo type**: User-site repo → site serves at root path `/`, not a subpath
- **Content**: All resume content must round-trip from the current `src/resumeData.json` shape into the new Content Layer collections — no data loss
- **PDF**: `public/Rashmil_Panchani.pdf` download link must keep working
- **Accessibility**: WCAG 2.1 AA is a hard requirement (per `.claude/CLAUDE.md`), not a stretch goal
- **No CDN UI libs**: Bootstrap, jQuery, Font Awesome, Devicon, Iconify are CDN-loaded today and must be replaced with bundled equivalents (or dropped)
- **Compatibility with a future editing surface**: Content shape and storage must be amenable to an editing surface (admin UI / headless CMS / git-based editor) later — informs the Content Layer choice

## Technology Stack

## Languages

- JavaScript (ES6+, JSX) - All application source code in `src/` (`src/index.js`, `src/components/*.jsx`)
- HTML5 - Single-page template at `public/index.html` (CRA injects bundled scripts at build)
- CSS3 - Stylesheets in `src/App.css` and `src/index.css`
- JSON - Static content/data at `src/resumeData.json` and `public/manifest.json`

## Runtime

- Browser-only single-page application (no server-side rendering)
- Static site deployed to GitHub Pages (`Rashmil-1999.github.io`, custom domain `rashmilpanchani.me` via `public/CNAME`)
- Build-time tooling runs on Node.js (Node version not pinned — no `.nvmrc` present)
- Both `package-lock.json` (npm) and `yarn.lock` (Yarn Classic) are committed at repo root — this is a stack inconsistency, see CONCERNS scope
- `README.md` documents `yarn` commands; `package.json` `scripts.deploy` uses `npm run build`
- Lockfile: present (both)

## Frameworks

- React 18.3.1 (`react`, `react-dom`) — UI library; rendered via the React 18 concurrent root API (`createRoot` in `src/index.js`)
- React renders the entire app inside `<StrictMode>` (`src/index.js:34`)
- Jest (transitive via `react-scripts` 5.0.1; locked at `^27.4.3` per `package-lock.json`) — test runner
- `@testing-library/jest-dom` — referenced in `src/setupTests.js:5` but NOT declared in `package.json` dependencies (provided transitively by `react-scripts`); risks breaking if peer changes
- `src/setupTests.js` only imports `@testing-library/jest-dom/extend-expect`
- No `*.test.*` or `*.spec.*` files exist in `src/`; the prior `src/App.test.js` is deleted (see `git status`)
- `react-scripts` 5.0.1 — Create React App (CRA) build/dev/test wrapper (webpack 5 + Babel under the hood)
- `gh-pages` 6.1.1 — Publishes the production `build/` directory to the `gh-pages` branch (`npm run deploy`)

## Key Dependencies

- `react` 18.3.1 — UI rendering
- `react-dom` 18.3.1 — DOM bindings; only `react-dom/client` is consumed (`src/index.js:3`)
- `react-scripts` 5.0.1 — Hosts the entire build/test toolchain; ejection not performed
- `react-scroll` 1.9.0 — Imported in `src/components/Navbar.jsx:2` (`Link`, `animateScroll as scroll`), but the imports are unused at the call site (nav uses plain anchor tags with `#hash` hrefs and jQuery smooth-scroll). Carried as a dead dependency.
- `react-script-tag` 1.1.2 — Declared in `package.json` but NOT imported anywhere in `src/` (verified by grep). Carried as a dead dependency.
- `gh-pages` 6.1.1 — Deployment tool, dev-only in spirit but declared under `dependencies`
- Service worker scaffolding at `src/serviceWorker.js` exists but is explicitly **unregistered** in `src/index.js:75` (PWA disabled at runtime despite `public/manifest.json` being present)
- Font Awesome 5.13.0 (`use.fontawesome.com/releases/v5.13.0/js/all.js`)
- jQuery 3.5.1 (`cdnjs.cloudflare.com`) — required by Bootstrap and inline smooth-scroll IIFE (`public/index.html:69-105`)
- Bootstrap 4.5.0 JS bundle (`stackpath.bootstrapcdn.com`)
- jQuery Easing 1.4.1 (`cdnjs.cloudflare.com`)
- Iconify 1.0.7 (`code.iconify.design`)
- Devicon (`cdn.jsdelivr.net/gh/devicons/devicon@master/devicon.min.css`) — `@master` tag, not version-pinned
- Google Fonts: `Saira Extra Condensed` (500, 700), `Muli` (400, 400i, 800, 800i)

## Configuration

- No `.env`, `.env.*`, or other dotenv files present at repo root (verified)
- No runtime environment variables consumed by application code (no `process.env.*` usage in `src/components/*` or `src/index.js`)
- `src/serviceWorker.js` references `process.env.NODE_ENV` and `process.env.PUBLIC_URL` (standard CRA-injected vars), but the worker is unregistered
- `package.json` is the sole build config — no `craco`, no `customize-cra`, no `webpack.config.*`, no `babel.config.*`, no `.babelrc`
- `package.json` `eslintConfig` extends `react-app` (CRA defaults); no `.eslintrc*` or `.prettierrc*` files present
- `package.json` `browserslist`: production `>0.2%`, `not dead`, `not op_mini all`; development is last 1 Chrome/Firefox/Safari
- `package.json` `homepage`: `https://Rashmil-1999.github.io` (sets CRA's `PUBLIC_URL` at build time)
- `package.json` `private: true`
- No TypeScript (`tsconfig.json` absent)
- `public/CNAME` → `rashmilpanchani.me` (custom domain for GitHub Pages)
- `public/robots.txt` allows all crawlers (`Disallow:` empty)
- `public/manifest.json` is the default CRA boilerplate ("Create React App Sample") — not customized for this site
- `public/Rashmil_Panchani.pdf` is the downloadable résumé linked from `src/components/About.jsx:52`

## Platform Requirements

- Node.js + npm or Yarn (version not pinned)
- Standard CRA scripts: `yarn start` (dev server on `localhost:3000`), `yarn build`, `yarn test`, `yarn eject`
- Internet connectivity required at runtime for CDN-hosted CSS/JS to load (Bootstrap JS, jQuery, Font Awesome, Iconify, Devicon, Google Fonts)
- GitHub Pages static hosting (`gh-pages` branch of this repo)
- Custom domain: `rashmilpanchani.me`
- Deploy command: `npm run deploy` (runs `predeploy: npm run build` then `gh-pages -d build`)
- No backend, no API, no database — pure static SPA bootstrapping from `src/resumeData.json`

## Conventions

## Naming Patterns

- React components: `PascalCase.jsx` (e.g., `About.jsx`, `Navbar.jsx`, `Projects.jsx`, `Education.jsx`, `Work.jsx`, `Skills.jsx`, `Leadership.jsx`, `Testimonials.jsx`)
- Non-component JS/data files: `camelCase.js` or `camelCase.json` (e.g., `serviceWorker.js`, `setupTests.js`, `resumeData.json`)
- Entry / framework files: lowercase (e.g., `src/index.js`, `src/index.css`, `src/App.css`)
- Static assets: lowercase with underscores (e.g., `face_detection.png`, `profilepic.jpg`, `Rashmil_Panchani.pdf` is an exception preserving a proper name)
- React function components: `PascalCase` declared as arrow functions assigned to a `const` (e.g., `const About = (props) => { ... }` in `src/components/About.jsx`)
- Non-component helpers / lifecycle handlers: `camelCase` (e.g., `register`, `unregister`, `registerValidSW`, `checkValidServiceWorker` in `src/serviceWorker.js`)
- Component aliases at import sites are allowed when the data model differs from the component name (e.g., `import Leaderships from "./components/Leadership"` in `src/index.js`)
- Local variables and destructured props use `snake_case` mirroring the JSON data shape (e.g., `first_name`, `last_name`, `current_status`, `contact_message`, `resume_download`, `skill_array`, `image_map`, `image_style` in `src/components/About.jsx` and `src/components/Projects.jsx`)
- Loop indices use `id` rather than `i` or `index` (e.g., `projects.map((project, id) => ...)` in `src/components/Projects.jsx`)
- Module-scope constants use `camelCase` (e.g., `isLocalhost` in `src/serviceWorker.js`)
- No TypeScript in use; no PropTypes declared. Components rely on `props` shape via destructuring.

## Code Style

- No Prettier or `.prettierrc` config file present in the repo root.
- Observed conventions from source files:
- ESLint via Create React App preset, configured in `package.json`:
- No standalone `.eslintrc` file. Lint errors surface in the dev console during `yarn start` / `npm start`.
- One inline disable in use: `// eslint-disable-next-line import/no-unresolved` in `src/index.js` line 2 (suppresses the `react-dom/client` resolution warning).

## Import Organization

- No path aliases configured. All local imports use relative paths (`./`, `../`).

## Error Handling

- Components contain no try/catch and no defensive prop checks; they assume `resumeData.json` is well-formed.
- Service worker (`src/serviceWorker.js`) uses promise chains with `.catch(error => console.error(...))` for SW registration failures (lines 96-98, 137-139).
- Offline detection logs via `console.log('No internet connection found. App is running in offline mode.')` (line 125-127).
- No global error boundary component is present.

## Logging

- `console.log` for informational SW lifecycle messages (`src/serviceWorker.js` lines 44, 73, 85, 125).
- `console.error` for SW registration failures (`src/serviceWorker.js` lines 97, 138).
- No logging inside React components.

## Comments

- JSX layout sections are annotated with HTML-style comments inside braces (e.g., `{/* <!-- Navigation --> */}`, `{/* <!-- About --> */}` in `src/index.js` lines 36-60).
- Service worker explains rationale in block comments at the top of the file and above conditional branches (`src/serviceWorker.js` lines 1-12, 26-32, 70-86).
- Components themselves are not commented; behavior is communicated by component and prop names.
- Commented-out imports are occasionally left in place (e.g., `// import eyantra from "../assets/eyantra.png";` in `src/components/Projects.jsx` line 6).
- Not used anywhere in the codebase.

## Function Design

- Components receive a single `props` object and destructure within the function body, either at the top (e.g., `const { sections, links, name } = props;` in `src/components/Navbar.jsx`) or against a nested field (e.g., `const { first_name, last_name, ... } = props.about;` in `src/components/About.jsx`).
- Non-component functions take positional parameters with simple names (e.g., `register(config)`, `registerValidSW(swUrl, config)` in `src/serviceWorker.js`).
- Components return a single root `<div>` wrapper containing a `<section className="resume-section">` and a trailing `<hr className="m-0" />` (pattern seen in `About.jsx`, `Education.jsx`, `Work.jsx`, `Skills.jsx`, `Projects.jsx`, `Leadership.jsx`). `Testimonials.jsx` omits the `<hr/>` as the last section.
- Lifecycle helpers in `serviceWorker.js` return implicitly (`undefined`).

## Module Design

- One default export per component file: `export default ComponentName;` at the bottom (e.g., `export default About;`).
- `src/serviceWorker.js` uses named exports (`export function register`, `export function unregister`).
- `src/index.js` has no exports; it is the application entry point.
- No `index.js` re-export barrel in `src/components/`. Each component is imported directly by file path from `src/index.js`.

## Component Patterns

- Bootstrap utility classes are used directly in JSX `className` strings (e.g., `mb-5`, `d-flex flex-column flex-md-row justify-content-between`, `col-md-4 text-center`).
- A single global stylesheet (`src/App.css`) is imported once from `src/index.js`. Components do not import their own CSS modules.
- Inline `style={{ ... }}` objects are used only when a value must be JS-driven (e.g., `image_style` in `src/components/Projects.jsx`).
- The list index is used as the `key`, named `id` (e.g., `<li key={id}>`). Exception: `src/components/About.jsx` uses `handle.name` as the social-link key.

## Data Flow

- All content lives in `src/resumeData.json` and is imported once in `src/index.js`.
- The top-level `App` destructures the JSON and passes named slices down as props to each section component.
- There is no `useState`, `useEffect`, `useContext`, or other hook usage in any component — the app is fully static after first render.

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component       | Responsibility                                                    | File                              |
| --------------- | ----------------------------------------------------------------- | --------------------------------- |
| `App` (inline)  | Reads `resumeData.json`, slices it, passes props to each section  | `src/index.js`                    |
| `SideNav`       | Fixed-top sidebar nav with profile image and section anchor links | `src/components/Navbar.jsx`       |
| `About`         | Renders name, status, contact, social icons, resume download      | `src/components/About.jsx`        |
| `Education`     | Renders education history list                                    | `src/components/Education.jsx`    |
| `Work`          | Renders work experience list                                      | `src/components/Work.jsx`         |
| `Skills`        | Renders categorized skills with Devicon/Iconify icons             | `src/components/Skills.jsx`       |
| `Projects`      | Renders project cards with images, links, tech-stack chips        | `src/components/Projects.jsx`     |
| `Leadership`    | Renders leadership/committee roles                                | `src/components/Leadership.jsx`   |
| `Testimonials`  | Renders quoted testimonials                                       | `src/components/Testimonials.jsx` |
| `serviceWorker` | Optional PWA registration helpers (currently unregistered)        | `src/serviceWorker.js`            |

## Pattern Overview

- Single-page composition: one `App` component renders every section vertically in `src/index.js`; there is no router.
- Data-driven views: all displayed content originates from `src/resumeData.json` and is destructured at the root.
- Presentational components only: each component in `src/components/` is a stateless functional component that receives data via props and renders Bootstrap-styled JSX.
- Styling is global: `src/App.css` (~10.6k lines) and Bootstrap 4 (loaded via CDN in `public/index.html`) drive all visual styling; no CSS modules or styled-components.
- Static deployment: `react-scripts build` outputs to `build/`, which is published to GitHub Pages by the `deploy` script.

## Layers

- Purpose: Mounts React, owns the JSON data, fans out props to section components.
- Location: `src/index.js`
- Contains: `App` functional component, `createRoot` call, service worker `unregister()`.
- Depends on: `react`, `react-dom/client`, all components in `src/components/`, `src/resumeData.json`, `src/App.css`.
- Used by: Browser via `public/index.html` (`<div id="root">`).
- Purpose: Pure presentational components, one per resume section.
- Location: `src/components/`
- Contains: Stateless functional `.jsx` components that consume props and emit Bootstrap-classed JSX.
- Depends on: `react`, `react-scroll` (only `Navbar.jsx`), image imports from `../assets/` (only `Navbar.jsx` and `Projects.jsx`).
- Used by: `App` in `src/index.js`.
- Purpose: Source of truth for all resume content.
- Location: `src/resumeData.json`
- Contains: `about`, `sections`, `links`, `resumeData` (education, work, skills, skill_array), `projects`, `leaderships`, `testimonials`.
- Depends on: Nothing.
- Used by: `App` in `src/index.js`.
- Purpose: Images and downloadable artifacts.
- Location: `src/assets/` (imported, hashed at build) and `public/` (served as-is).
- Contains: Project/profile images (`src/assets/*.png|jpg|jpeg|webp`), favicons and PDF in `public/`.
- Used by: `Navbar.jsx` (profile image), `Projects.jsx` (project images), `About.jsx` (`resume_download` references `Rashmil_Panchani.pdf` in `public/`).
- Purpose: HTML shell, CDN-loaded libraries (jQuery, Bootstrap JS, Font Awesome, Devicon, Iconify), legacy inline scroll-spy script.
- Location: `public/index.html`
- Used by: The browser; React mounts into `#root`.

## Data Flow

### Primary Render Path

### Navigation Flow

- No client state. No `useState`, `useReducer`, `useEffect`, or context anywhere in `src/components/` or `src/index.js`. Everything is a pure function of props.

## Key Abstractions

- Purpose: Render one vertical resume section from a single prop slice.
- Examples: `src/components/About.jsx`, `src/components/Education.jsx`, `src/components/Work.jsx`, `src/components/Skills.jsx`, `src/components/Projects.jsx`, `src/components/Leadership.jsx`, `src/components/Testimonials.jsx`.
- Pattern: Default-exported arrow function `(props) => <section className="resume-section" id="...">...</section>`, terminated by `<hr className="m-0" />` (except `Testimonials.jsx`, which has no trailing `<hr>`).
- Purpose: Translate the string `image` field in each project record to an imported binary asset.
- Examples: `image_map` object in `src/components/Projects.jsx:23-37`.
- Pattern: Static object literal keyed by string; lookups via `image_map[project.image]`.
- Purpose: Co-locate JSON shape knowledge inside the root `App` component.
- Examples: `src/index.js:23-31`.
- Pattern: Top-level destructure of `resumeData.json`, then pass each piece as a named prop.

## Entry Points

- Location: `public/index.html`
- Triggers: Initial page load at `https://Rashmil-1999.github.io` (configured by `homepage` in `package.json:13`).
- Responsibilities: Load CDN libraries (jQuery, Bootstrap, Font Awesome, Devicon, Iconify), define inline scroll-spy/easing script, host `<div id="root">` mount point.
- Location: `src/index.js`
- Triggers: Bundled and injected into `index.html` by `react-scripts` during `start`/`build`.
- Responsibilities: Import CSS, define `App`, mount it into `#root`, unregister any prior service worker.
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

### Mixed legacy jQuery scroll logic with a React tree

### CDN-loaded UI libraries instead of bundled imports

### Image lookup via a hard-coded object map

### Incorrect `<StrictMode>` placement

## Error Handling

- Missing project image -> `image_map[project.image]` evaluates to `undefined`, producing a broken `<img>` with no `alt` fallback handling.
- Missing JSON keys -> destructuring in `src/index.js:23-31` yields `undefined`; downstream `.map(...)` calls throw at render time.
- Network-blocked CDNs -> degraded styling and broken scroll-spy, with no React-side detection.

## Cross-Cutting Concerns
