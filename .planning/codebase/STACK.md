# Technology Stack

**Analysis Date:** 2026-05-26

## Languages

**Primary:**
- JavaScript (ES6+, JSX) - All application source code in `src/` (`src/index.js`, `src/components/*.jsx`)

**Secondary:**
- HTML5 - Single-page template at `public/index.html` (CRA injects bundled scripts at build)
- CSS3 - Stylesheets in `src/App.css` and `src/index.css`
- JSON - Static content/data at `src/resumeData.json` and `public/manifest.json`

## Runtime

**Environment:**
- Browser-only single-page application (no server-side rendering)
- Static site deployed to GitHub Pages (`Rashmil-1999.github.io`, custom domain `rashmilpanchani.me` via `public/CNAME`)
- Build-time tooling runs on Node.js (Node version not pinned — no `.nvmrc` present)

**Package Manager:**
- Both `package-lock.json` (npm) and `yarn.lock` (Yarn Classic) are committed at repo root — this is a stack inconsistency, see CONCERNS scope
- `README.md` documents `yarn` commands; `package.json` `scripts.deploy` uses `npm run build`
- Lockfile: present (both)

## Frameworks

**Core:**
- React 18.3.1 (`react`, `react-dom`) — UI library; rendered via the React 18 concurrent root API (`createRoot` in `src/index.js`)
- React renders the entire app inside `<StrictMode>` (`src/index.js:34`)

**Testing:**
- Jest (transitive via `react-scripts` 5.0.1; locked at `^27.4.3` per `package-lock.json`) — test runner
- `@testing-library/jest-dom` — referenced in `src/setupTests.js:5` but NOT declared in `package.json` dependencies (provided transitively by `react-scripts`); risks breaking if peer changes
- `src/setupTests.js` only imports `@testing-library/jest-dom/extend-expect`
- No `*.test.*` or `*.spec.*` files exist in `src/`; the prior `src/App.test.js` is deleted (see `git status`)

**Build/Dev:**
- `react-scripts` 5.0.1 — Create React App (CRA) build/dev/test wrapper (webpack 5 + Babel under the hood)
- `gh-pages` 6.1.1 — Publishes the production `build/` directory to the `gh-pages` branch (`npm run deploy`)

## Key Dependencies

**Critical:**
- `react` 18.3.1 — UI rendering
- `react-dom` 18.3.1 — DOM bindings; only `react-dom/client` is consumed (`src/index.js:3`)
- `react-scripts` 5.0.1 — Hosts the entire build/test toolchain; ejection not performed
- `react-scroll` 1.9.0 — Imported in `src/components/Navbar.jsx:2` (`Link`, `animateScroll as scroll`), but the imports are unused at the call site (nav uses plain anchor tags with `#hash` hrefs and jQuery smooth-scroll). Carried as a dead dependency.
- `react-script-tag` 1.1.2 — Declared in `package.json` but NOT imported anywhere in `src/` (verified by grep). Carried as a dead dependency.

**Infrastructure:**
- `gh-pages` 6.1.1 — Deployment tool, dev-only in spirit but declared under `dependencies`
- Service worker scaffolding at `src/serviceWorker.js` exists but is explicitly **unregistered** in `src/index.js:75` (PWA disabled at runtime despite `public/manifest.json` being present)

**Runtime-loaded via CDN (in `public/index.html`, not in `package.json`):**
- Font Awesome 5.13.0 (`use.fontawesome.com/releases/v5.13.0/js/all.js`)
- jQuery 3.5.1 (`cdnjs.cloudflare.com`) — required by Bootstrap and inline smooth-scroll IIFE (`public/index.html:69-105`)
- Bootstrap 4.5.0 JS bundle (`stackpath.bootstrapcdn.com`)
- jQuery Easing 1.4.1 (`cdnjs.cloudflare.com`)
- Iconify 1.0.7 (`code.iconify.design`)
- Devicon (`cdn.jsdelivr.net/gh/devicons/devicon@master/devicon.min.css`) — `@master` tag, not version-pinned
- Google Fonts: `Saira Extra Condensed` (500, 700), `Muli` (400, 400i, 800, 800i)

Note: Bootstrap **CSS** is referenced via class names throughout the components (`navbar`, `container-fluid`, `card`, `btn`, etc.) but no Bootstrap CSS file is loaded in `public/index.html` — only the JS bundle. Styling likely relies on a Bootstrap CSS file that is missing or expected via another mechanism.

## Configuration

**Environment:**
- No `.env`, `.env.*`, or other dotenv files present at repo root (verified)
- No runtime environment variables consumed by application code (no `process.env.*` usage in `src/components/*` or `src/index.js`)
- `src/serviceWorker.js` references `process.env.NODE_ENV` and `process.env.PUBLIC_URL` (standard CRA-injected vars), but the worker is unregistered

**Build:**
- `package.json` is the sole build config — no `craco`, no `customize-cra`, no `webpack.config.*`, no `babel.config.*`, no `.babelrc`
- `package.json` `eslintConfig` extends `react-app` (CRA defaults); no `.eslintrc*` or `.prettierrc*` files present
- `package.json` `browserslist`: production `>0.2%`, `not dead`, `not op_mini all`; development is last 1 Chrome/Firefox/Safari
- `package.json` `homepage`: `https://Rashmil-1999.github.io` (sets CRA's `PUBLIC_URL` at build time)
- `package.json` `private: true`
- No TypeScript (`tsconfig.json` absent)

**Routing & static assets:**
- `public/CNAME` → `rashmilpanchani.me` (custom domain for GitHub Pages)
- `public/robots.txt` allows all crawlers (`Disallow:` empty)
- `public/manifest.json` is the default CRA boilerplate ("Create React App Sample") — not customized for this site
- `public/Rashmil_Panchani.pdf` is the downloadable résumé linked from `src/components/About.jsx:52`

## Platform Requirements

**Development:**
- Node.js + npm or Yarn (version not pinned)
- Standard CRA scripts: `yarn start` (dev server on `localhost:3000`), `yarn build`, `yarn test`, `yarn eject`
- Internet connectivity required at runtime for CDN-hosted CSS/JS to load (Bootstrap JS, jQuery, Font Awesome, Iconify, Devicon, Google Fonts)

**Production:**
- GitHub Pages static hosting (`gh-pages` branch of this repo)
- Custom domain: `rashmilpanchani.me`
- Deploy command: `npm run deploy` (runs `predeploy: npm run build` then `gh-pages -d build`)
- No backend, no API, no database — pure static SPA bootstrapping from `src/resumeData.json`

---

*Stack analysis: 2026-05-26*
