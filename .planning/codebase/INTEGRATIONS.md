# External Integrations

**Analysis Date:** 2026-05-26

## APIs & External Services

This project is a fully static personal résumé/portfolio SPA. There are **no application-level API calls** — no `fetch`, `axios`, or `XMLHttpRequest` usage in any `src/components/*.jsx` or `src/index.js`. The only `fetch` call lives inside the CRA-generated `src/serviceWorker.js`, and that worker is explicitly unregistered in `src/index.js:75`.

All "integrations" are therefore one of:
1. Build/deploy tooling, or
2. Third-party assets loaded directly by `public/index.html` via `<link>` / `<script>` tags from public CDNs (no API keys, no auth).

**Asset CDNs (loaded from `public/index.html`):**
- Font Awesome 5.13.0 — `use.fontawesome.com/releases/v5.13.0/js/all.js` — icon font (used via `<i className="fas fa-download">` in `src/components/About.jsx:56` and via class names supplied by `src/resumeData.json`)
- Devicon (master branch) — `cdn.jsdelivr.net/gh/devicons/devicon@master/devicon.min.css` — technology icons (used via `devicon-*` classes from `src/resumeData.json` skill entries)
- Iconify 1.0.7 — `code.iconify.design/1/1.0.7/iconify.min.js` — generic icon framework (loaded but no `<iconify-icon>` / data attributes detected in components)
- Bootstrap 4.5.0 JS — `stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.bundle.min.js`
- jQuery 3.5.1 — `cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js`
- jQuery Easing 1.4.1 — `cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js`
- Google Fonts: `Saira Extra Condensed` and `Muli` — `fonts.googleapis.com`

**Outbound user-driven links (rendered by components, not invoked by code):**
- `mailto:rashmilp833@gmail.com` (`src/components/About.jsx:25`, value from `src/resumeData.json` `about.email`)
- LinkedIn profile: `https://www.linkedin.com/in/rashmil-panchani-67587a14b/` (`src/resumeData.json` `about.social[0].url`)
- GitHub profile: `http://github.com/Rashmil-1999` (`src/resumeData.json` `about.social[1].url`) — note `http://`, not `https://`
- Per-project `url` fields rendered as `<a target="_blank" rel="noopener noreferrer">` in `src/components/Projects.jsx:60`

## Data Storage

**Databases:**
- None. No DB driver, ORM, or client SDK is declared in `package.json` and none is imported anywhere in `src/`.

**File Storage:**
- Local repository only. All images live in `src/assets/*.{jpg,jpeg,png,webp}` and are bundled by webpack via `import` statements (`src/components/Projects.jsx:3-15`, `src/components/Navbar.jsx:4`).
- The downloadable résumé `public/Rashmil_Panchani.pdf` is served as a static asset and linked from `src/components/About.jsx:52` via the `resume_download` field in `src/resumeData.json`.

**Caching:**
- A CRA-style service worker exists at `src/serviceWorker.js` but is explicitly **unregistered** in `src/index.js:75` (`serviceWorker.unregister()`). No runtime caching is active.

**Application data:**
- All content (about, education, work, skills, projects, leaderships, testimonials, nav sections, links) is bundled at build time from `src/resumeData.json`, imported in `src/index.js:19` and destructured into props.

## Authentication & Identity

**Auth Provider:**
- None. The site has no login, no protected routes, no user accounts, and no session/cookie handling.

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry, Bugsnag, Rollbar, Datadog, or similar SDK is declared or imported.

**Analytics:**
- None. No Google Analytics, Plausible, Fathom, or similar tag detected in `public/index.html` or anywhere in `src/`.

**Logs:**
- Browser `console.log` / `console.error` calls only inside `src/serviceWorker.js` (lines 44, 73, 85, 97, 126, 138) — all dead because the worker is unregistered.

## CI/CD & Deployment

**Hosting:**
- GitHub Pages (`gh-pages` branch of `Rashmil-1999/Rashmil-1999.github.io`)
- Custom domain `rashmilpanchani.me` configured via `public/CNAME`
- `package.json` `homepage` set to `https://Rashmil-1999.github.io` — this drives CRA's `PUBLIC_URL` and the `<base>` paths in the build output

**CI Pipeline:**
- No CI configuration committed: no `.github/workflows/`, no `.circleci/`, no `.travis.yml`, no `.gitlab-ci.yml`
- Deployment is **manual**, run from a developer machine via `npm run deploy`:
  - `predeploy`: `npm run build` (runs `react-scripts build`, output to `build/`)
  - `deploy`: `gh-pages -d build` (publishes `build/` to the `gh-pages` branch on the configured remote)

## Environment Configuration

**Required env vars:**
- None at runtime. Application code does not read `process.env.*` outside the (unregistered) service worker.
- CRA's standard `process.env.NODE_ENV` and `process.env.PUBLIC_URL` are set automatically by `react-scripts` at build time.

**Secrets location:**
- No secrets are required. No `.env*` files are present in the repository (verified).
- GitHub Pages deployment uses the developer's local git credentials to push the `gh-pages` branch — no tokens stored in the repo.

## Webhooks & Callbacks

**Incoming:**
- None. No server exists; nothing can receive webhooks.

**Outgoing:**
- None. Application code makes zero outbound HTTP calls.

---

*Integration audit: 2026-05-26*
