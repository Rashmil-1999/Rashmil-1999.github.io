# Codebase Concerns

**Analysis Date:** 2026-05-26

## Tech Debt

**Outdated build toolchain (Create React App):**
- Issue: Project uses `react-scripts` 5.0.1 (Create React App), which is deprecated/unmaintained. CRA has not received a release since early 2022 and is no longer recommended by the React team. Webpack 4/5 toolchain bundled with CRA pulls in many transitively vulnerable packages.
- Files: `package.json`, `package-lock.json`, `yarn.lock`
- Impact: 59 npm audit vulnerabilities (15 low, 17 moderate, 26 high, 1 critical) flow from the build toolchain. No path to a clean `npm audit` without migrating off CRA.
- Fix approach: Migrate to Vite or Next.js (static export). Both work with GitHub Pages and produce far smaller, modern bundles. Keep the same React component tree intact during migration.

**Uncommitted refactor mid-flight:**
- Issue: `src/App.js` and `src/App.test.js` have been deleted and their logic inlined into `src/index.js`, but the changes are unstaged. `package.json` and lockfiles are also modified locally. Repository is in an inconsistent state — the working tree no longer matches the last commit (`c83c1e6 project addition`).
- Files: `src/index.js` (modified), `src/App.js` (deleted, untracked), `src/App.test.js` (deleted, untracked), `package.json`, `package-lock.json`, `yarn.lock`
- Impact: Anyone cloning the repo at `origin/master` gets a different application than the current working tree. Risk of losing the refactor on a checkout or reset.
- Fix approach: Either commit the in-flight refactor (with a meaningful message) or discard it. Do not leave the tree in this state.

**Dual lockfiles (npm + yarn):**
- Issue: Both `package-lock.json` (705 KB) and `yarn.lock` (410 KB) are committed. README references `yarn start` / `yarn build`, but `gh-pages` scripts are written for npm (`npm run build`).
- Files: `package-lock.json`, `yarn.lock`, `README.md`, `package.json`
- Impact: Two package managers can resolve dependencies to different versions, leading to "works on my machine" bugs. CI/local installs become non-deterministic depending on which tool is used.
- Fix approach: Pick one. Delete the other lockfile and update README to match.

**Unused dependency `react-script-tag`:**
- Issue: `react-script-tag` is declared in `package.json` but is not imported anywhere in `src/`.
- Files: `package.json` (line listing `"react-script-tag": "^1.1.2"`)
- Impact: Adds install time and a vulnerable transitive surface for no benefit.
- Fix approach: Remove from `package.json` and re-lock.

**Inline jQuery glue script in `public/index.html`:**
- Issue: `public/index.html` embeds a `<script src="">` (empty `src` attribute) that also contains an inline jQuery IIFE for smooth-scroll, navbar collapse, and scrollspy. The empty `src` makes the browser issue a request to the page URL itself; the inline body is ignored when `src` is present (varies by browser). Behavior is fragile and accidental.
- Files: `public/index.html:65-106`
- Impact: Smooth-scroll / scrollspy may not function in some browsers. Mixes jQuery DOM manipulation with a React-rendered DOM that React owns — classic source of subtle bugs.
- Fix approach: Remove the empty `src=""` attribute so the inline script executes, OR (preferred) port the smooth-scroll / scrollspy behavior to `react-scroll` (already a dependency) and delete jQuery + the easing plugin.

**jQuery + Bootstrap 4 mixed with React 18:**
- Issue: `public/index.html` loads jQuery 3.5.1, Bootstrap 4.5.0 JS, and jquery-easing 1.4.1 from CDNs to operate on the React-rendered DOM. The `Navbar.jsx` uses Bootstrap 4 `data-toggle` / `data-target` attributes (not migrated to BS5 `data-bs-*`).
- Files: `public/index.html:60-63`, `src/components/Navbar.jsx:25-30`
- Impact: jQuery imperatively mutates the DOM React believes it owns, which can cause React to throw `NotFoundError` on re-render. Bootstrap 4 is EOL.
- Fix approach: Replace Bootstrap 4 collapse with React state, or upgrade to Bootstrap 5 with `react-bootstrap` and remove jQuery entirely.

**Unused `Suspense` import:**
- Issue: `src/index.js:1` imports `Suspense` from React but never uses it.
- Files: `src/index.js:1`
- Impact: Minor — dead import, also lints under default CRA ESLint config (though no error is currently shown because of `eslintConfig: react-app`).
- Fix approach: Remove from the import list.

**`eslint-disable-next-line import/no-unresolved` on `react-dom/client`:**
- Issue: `src/index.js:2` disables an ESLint rule to import `react-dom/client`, suggesting the lint configuration was not updated when React 18 was adopted.
- Files: `src/index.js:2-3`
- Impact: Masks a real lint mis-configuration; hides legitimate import errors elsewhere.
- Fix approach: Fix the ESLint resolver (or the `eslint-plugin-import` config) and remove the disable comment.

**Massive `App.css` (186 KB, 10,603 lines):**
- Issue: A single CSS file contains the entire Bootstrap 4.5.0 stylesheet plus the Start Bootstrap "Resume v6.0.1" theme, inlined verbatim. The commented-out CRA boilerplate (`.App`, `.App-logo`, etc.) is still at the top.
- Files: `src/App.css:1-38` (dead CRA boilerplate), full file
- Impact: All 186 KB ship to every visitor before first paint. No tree-shaking, no purging of unused selectors. Maintenance is impossible — any change risks breaking specificity inherited from Bootstrap.
- Fix approach: Install Bootstrap as a dependency (or use `react-bootstrap`), keep only the resume theme overrides in a small local CSS file. Run PurgeCSS / Vite's CSS treeshaking.

**`logo.svg` orphan asset:**
- Issue: `src/logo.svg` (2.7 KB) is leftover CRA boilerplate; no component imports it.
- Files: `src/logo.svg`
- Impact: Minor — dead file checked in.
- Fix approach: Delete.

**`serviceWorker.js` unused but bundled:**
- Issue: `src/serviceWorker.js` (5.1 KB) exposes `register()` / `unregister()`; only `unregister()` is called from `src/index.js:75`. The file is the old CRA template (modern CRA uses `service-worker.js` + Workbox).
- Files: `src/serviceWorker.js`, `src/index.js:20,75`
- Impact: Dead `register()` code path is bundled. Calling `unregister()` on every load is wasteful but harmless.
- Fix approach: Either remove the SW entirely (call site + file) or replace with the Workbox-based CRA PWA template if offline support is genuinely wanted.

**Default CRA `manifest.json`:**
- Issue: `public/manifest.json` still contains `"short_name": "React App"` and `"name": "Create React App Sample"`.
- Files: `public/manifest.json`
- Impact: Wrong app name surfaces when users "Add to Home Screen". Unprofessional for a personal resume site.
- Fix approach: Replace name/short_name/theme_color with values for Rashmil's site.

**Commented-out import:**
- Issue: `src/components/Projects.jsx:6` has a commented-out PNG import (`// import eyantra from "../assets/eyantra.png";`), and both `eyantra.png` and `eyantra.jpg` ship in `src/assets/`.
- Files: `src/components/Projects.jsx:6-7`, `src/assets/eyantra.png` (102 KB, unused), `src/assets/eyantra.jpg` (used)
- Impact: Confusing intent; an unused 102 KB asset survives because it is referenced by a comment.
- Fix approach: Delete the commented import and `src/assets/eyantra.png`.

**Duplicated `archive` assets:**
- Issue: `archive.jpeg` (110 KB), `archive.jpg` (23 KB), and `archive.png` (368 KB) all exist; only `archive.jpeg` is imported in `Projects.jsx`.
- Files: `src/assets/archive.jpg`, `src/assets/archive.png`, `src/components/Projects.jsx:3`
- Impact: ~390 KB of dead binary committed to the repo.
- Fix approach: Keep the one used by `Projects.jsx`, delete the others.

**Duplicated `attendance` assets:**
- Issue: `attendance.png` (110 KB), `attendance.webp` (12 KB), and `attendance1.png` (732 KB) all exist; only `attendance1.png` is used.
- Files: `src/assets/attendance.png`, `src/assets/attendance.webp`, `src/components/Projects.jsx:10`
- Impact: ~120 KB of dead assets, plus the chosen file is the largest of the three.
- Fix approach: Use the `webp` (12 KB) version, delete the others, update the import.

**`emotion_recognition.png` vs `emotion.png` confusion:**
- Issue: Two emotion-related assets exist: `emotion.png` (4.8 MB) and `emotion_recognition.png` (23 KB). `Projects.jsx:4` imports `emotion.png` (the 4.8 MB one) but maps it as `emotion_recognition` in the lookup, while the smaller appropriately-named file is unused.
- Files: `src/components/Projects.jsx:4,25`, `src/assets/emotion.png` (4.8 MB), `src/assets/emotion_recognition.png` (23 KB)
- Impact: A single ~5 MB image is shipped to every visitor just for the Projects section. Visible page-load regression on mobile.
- Fix approach: Switch the import to `emotion_recognition.png`, then delete `emotion.png`.

## Known Bugs

**Smooth scrolling and scrollspy do not work as written:**
- Symptoms: Clicking navbar links does not animate; navbar items don't gain an `active` class on scroll.
- Files: `public/index.html:65-106`
- Trigger: The inline `<script src="">…</script>` has an empty `src` attribute. Most browsers treat a `<script>` with any `src` (even empty) as external-only and ignore the inline body. The bundled jQuery init code therefore never runs.
- Workaround: Remove `src=""` from line 65, or migrate to `react-scroll`'s `<Link>` (already imported in `Navbar.jsx:2` but never actually used — links are plain `<a>`).

**`react-scroll` imported but unused in `Navbar.jsx`:**
- Symptoms: Smooth scroll behavior absent.
- Files: `src/components/Navbar.jsx:2,39`
- Trigger: `Link` and `animateScroll as scroll` are imported but the nav items render as raw `<a href={links[id]}>`, bypassing react-scroll entirely.
- Workaround: Replace the `<a>` with `<Link to={...} smooth duration={500}>` and remove the dependency on the broken jQuery script in `index.html`.

**Mobile navbar will not collapse on link click:**
- Symptoms: On mobile, after tapping a section link the off-canvas/expanded navbar stays open.
- Files: `public/index.html:97-99`, `src/components/Navbar.jsx`
- Trigger: The collapse-on-click is implemented in the broken jQuery script (same root cause as above).
- Workaround: Implement collapse via component state in `Navbar.jsx`.

**Trailing space in `first_name`:**
- Symptoms: Heading renders as `Rashmil  Panchani` (double space) because `App` concatenates `first_name + " " + last_name` and `first_name` already ends with a space.
- Files: `src/resumeData.json:3` (`"first_name": "Rashmil "`), `src/index.js:40`
- Trigger: Renders any time the name banner is shown.
- Workaround: Trim the trailing space from `resumeData.json`.

**Duplicate React `key` on social-icon row:**
- Symptoms: React console warning in dev mode (`Each child in a list should have a unique "key" prop` is satisfied, but the inner `<a>` carries a redundant `key` that React strips with a warning in StrictMode).
- Files: `src/components/About.jsx:36,40`
- Trigger: Both the `<div>` and the nested `<a>` set `key={handle.name}`; only the outermost element in a `.map` needs a key.
- Workaround: Remove `key={handle.name}` from the `<a>` on line 40.

**Variable shadowing — `id` inside Skills:**
- Symptoms: ESLint `no-shadow` would flag; in practice the inner `id` shadows the outer `id` and silently changes which value is bound to the React key (correct here, but error-prone).
- Files: `src/components/Skills.jsx:10-29` (`skill_array.map((skill, id) => { ... skills[skill].map((skill_item, id) => ...)})`)
- Trigger: Always.
- Workaround: Rename inner index variable (e.g., `itemId`).

**`SIH` capitalized key in `image_map`:**
- Symptoms: Works because `resumeData.json` matches the casing, but breaks the otherwise-consistent snake_case convention.
- Files: `src/components/Projects.jsx:33`, `src/resumeData.json:260`
- Trigger: N/A — currently functional.
- Workaround: Normalize to `sih` in both files.

## Security Considerations

**59 known vulnerabilities in dependency tree:**
- Risk: `npm audit` reports 1 critical, 26 high, 17 moderate, 15 low across the dep graph (e.g., `@babel/helpers`, `ajv`, `cookie`, `cross-spawn`, `follow-redirects`, `form-data`, `nth-check`, `webpack-dev-server`, `ws`, `yaml`, `brace-expansion`, `body-parser`).
- Files: `package-lock.json`, `yarn.lock` (transitive)
- Current mitigation: None. Most are dev-time vulnerabilities (build toolchain) and do not affect the deployed static site, but `npm audit fix --force` is blocked by CRA's pinning of dev deps.
- Recommendations: Migrate off Create React App to a maintained toolchain (Vite/Next). Otherwise pin direct deps and accept the dev-time risk.

**`<a target="_blank">` without `rel="noopener"`:**
- Risk: All social links in `About.jsx` open in the same tab (no `target="_blank"`), but in `Projects.jsx:60-63` the project title `<a target="_blank">` does correctly include `rel="noopener noreferrer"`. The social-icon links in `About.jsx:37-44` have no `target` set at all — clicking takes the visitor away from the site (UX issue, not security).
- Files: `src/components/About.jsx:37-44`
- Current mitigation: `noopener noreferrer` is present where `_blank` is used.
- Recommendations: Add `target="_blank" rel="noopener noreferrer"` to social links so they open in a new tab.

**Third-party scripts loaded from CDNs without SRI:**
- Risk: `public/index.html` loads jQuery, Bootstrap, jquery-easing, Font Awesome, devicon, and iconify directly from `cdnjs`, `stackpath`, `use.fontawesome.com`, `jsdelivr`, and `code.iconify.design`. None has a `integrity=` / `crossorigin=` (well, `use.fontawesome.com` has `crossorigin` but no `integrity`) attribute. A CDN compromise would inject arbitrary JS into the page.
- Files: `public/index.html:14-33,60-63,107`
- Current mitigation: None.
- Recommendations: Either bundle these as npm deps and serve from the same origin, or add Subresource Integrity (`integrity="sha384-…"`) hashes.

**Personal email exposed in plain text:**
- Risk: `rashmilp833@gmail.com` is hard-coded in `src/resumeData.json:6` and rendered into a `mailto:` link. This is intentional for a resume site, but is a target for scrapers / spam.
- Files: `src/resumeData.json:6`, `src/components/About.jsx:25`
- Current mitigation: None.
- Recommendations: Optional — use a contact form, a JS-obfuscated mailto, or a forwarding address.

**`robots.txt` allows everything:**
- Risk: Not a security issue per se; ensure this is intentional given the site contains a downloadable PDF resume with personal details.
- Files: `public/robots.txt`
- Current mitigation: N/A.
- Recommendations: Confirm the PDF resume is the version Rashmil is comfortable being indexed.

## Performance Bottlenecks

**Single 4.8 MB image dominates page weight:**
- Problem: `src/assets/emotion.png` is 4.8 MB and is imported via `src/components/Projects.jsx:4` for the Emotion Recognizer card. On a 4G connection this alone adds multiple seconds to the page load.
- Files: `src/components/Projects.jsx:4`, `src/assets/emotion.png`
- Cause: Source image was committed at full resolution; a 23 KB alternative (`emotion_recognition.png`) already exists.
- Improvement path: Switch the import to `emotion_recognition.png` and delete the 4.8 MB file. Saves ~99% on that image.

**Profile picture is 1 MB:**
- Problem: `src/assets/profilepic.jpg` is 1.0 MB and is displayed at ~120 px (rounded thumbnail) on the sidebar.
- Files: `src/assets/profilepic.jpg`, `src/components/Navbar.jsx:18`
- Cause: Original camera image committed without resizing.
- Improvement path: Resize to 256×256 or 512×512 WebP/AVIF. Should drop to ~20 KB.

**`attendance1.png` is 732 KB:**
- Problem: 732 KB PNG used as a project thumbnail at 200×200 max-size.
- Files: `src/assets/attendance1.png`, `src/components/Projects.jsx:10`
- Cause: Unoptimized full-resolution screenshot.
- Improvement path: Down-sample to 400×400 WebP. Alternatively the existing `attendance.webp` (12 KB) is already in the repo and unused.

**`resume.png` is 608 KB:**
- Problem: 608 KB PNG used as a 200×200 project thumbnail.
- Files: `src/assets/resume.png`, `src/components/Projects.jsx:11`
- Cause: Unoptimized.
- Improvement path: Resize / convert to WebP.

**No image lazy loading:**
- Problem: All project images load eagerly because `<img>` tags omit `loading="lazy"`. The Projects section is below the fold.
- Files: `src/components/Projects.jsx:49-54`
- Cause: HTML attribute not set.
- Improvement path: Add `loading="lazy"` to each project `<img>`.

**Whole Bootstrap CSS shipped:**
- Problem: 186 KB of CSS (the entire Bootstrap 4 stylesheet plus theme overrides) ships uncached and unminified-by-source.
- Files: `src/App.css`
- Cause: Bootstrap is inlined rather than installed and tree-shaken.
- Improvement path: Install `bootstrap` and `react-bootstrap` (or pull from CDN with SRI), keep only theme overrides locally. CRA does minify, but it still cannot drop unused selectors.

**Iconify + Devicon both loaded:**
- Problem: Two large icon CSS/JS libraries load on every page (devicon CSS + iconify JS).
- Files: `public/index.html:30-33,107`
- Cause: `skills[].class` uses `devicon-*` for some items and `iconify` for others (`Skills.jsx:12`).
- Improvement path: Consolidate on a single icon system or import only the icons used.

## Fragile Areas

**Image lookup in `Projects.jsx`:**
- Files: `src/components/Projects.jsx:23-37`
- Why fragile: A hard-coded JS object maps image keys to imports. Adding a project requires editing both `resumeData.json` and `Projects.jsx`. A typo in the JSON key silently renders a broken image (`<img src={undefined}>`).
- Safe modification: When adding a project, update the map AND the JSON in the same commit. Consider falling back to a default image via `image_map[project.image] ?? defaultImg`.
- Test coverage: None.

**`src/index.js` data destructuring:**
- Files: `src/index.js:23-31`
- Why fragile: Component breaks at runtime if any top-level key in `resumeData.json` (`sections`, `links`, `about`, `resumeData`, `projects`, `testimonials`, `leaderships`) is renamed or removed. No defensive defaults.
- Safe modification: Add JSON schema validation or TypeScript types around `resumeData.json`.
- Test coverage: None.

**Parallel `sections` / `links` arrays:**
- Files: `src/resumeData.json:23-40`, `src/components/Navbar.jsx:36-43`
- Why fragile: `sections[i]` must align with `links[i]` by index. Removing one without the other shifts every label.
- Safe modification: Combine into `[{name, href}, ...]`.
- Test coverage: None.

**`public/index.html` inline jQuery + React mount target:**
- Files: `public/index.html:46-106`
- Why fragile: jQuery selectors target IDs (`#page-top`, `#sideNav`) that are rendered by React. If React unmounts/remounts those nodes, jQuery's bound handlers and scrollspy state are stale.
- Safe modification: Replace with `react-scroll`-based navigation, drop jQuery.
- Test coverage: None.

## Scaling Limits

**Static site — no runtime backend:**
- Current capacity: Hosted on GitHub Pages (`Rashmil-1999.github.io`, CNAME `rashmilpanchani.me`). Effectively unlimited static traffic.
- Limit: No dynamic content, no contact form backend, no analytics out of the box.
- Scaling path: If a contact form or visitor analytics is wanted, add a serverless function (Cloudflare Pages Functions, Netlify Functions) or a third-party form provider.

**Resume PDF served from `public/`:**
- Current capacity: ~91 KB PDF served alongside the bundle.
- Limit: Every update requires a redeploy; no versioning, no analytics on downloads.
- Scaling path: For a personal site this is fine — no action needed.

## Dependencies at Risk

**`react-scripts` 5.0.1 (Create React App):**
- Risk: CRA is officially deprecated. No future releases. Pulls in dozens of vulnerable transitive deps. React docs no longer recommend it.
- Impact: All 59 npm audit findings; locked out of modern React 19 features (server components, etc.) without ejecting.
- Migration plan: Move to Vite (`npm create vite@latest -- --template react`) or Next.js with `output: 'export'` for static hosting. The component tree in `src/` ports unchanged.

**`react-script-tag` 1.1.2:**
- Risk: Unused (see Tech Debt).
- Impact: Unnecessary attack surface.
- Migration plan: Remove.

**Bootstrap 4.5.0 (via CDN + inlined CSS):**
- Risk: Bootstrap 4 reached end-of-life in January 2023; no security patches.
- Impact: Any future Bootstrap 4 CVE will not be patched.
- Migration plan: Upgrade to Bootstrap 5 (`react-bootstrap` peer-deps it) and migrate `data-toggle` → `data-bs-toggle` etc.

**jQuery 3.5.1 (via CDN):**
- Risk: 3.5.1 has known XSS issues (CVE-2020-11023). Latest is 3.7.x.
- Impact: Mostly relevant if untrusted HTML is processed, which is not the case here, but still.
- Migration plan: Remove jQuery entirely once `react-scroll` is wired up correctly.

**Font Awesome 5.13.0 (via CDN):**
- Risk: Outdated; current is 6.x. Loaded via `<script>` tag (kit-based), which embeds the entire icon set even though only a few icons are used.
- Impact: Bandwidth, not security.
- Migration plan: Install `@fortawesome/react-fontawesome` and import only the icons referenced.

## Missing Critical Features

**No automated tests:**
- Problem: `setupTests.js` exists (CRA boilerplate) but `App.test.js` has been deleted. No `*.test.*` or `*.spec.*` files anywhere in `src/`.
- Blocks: Refactors (CRA migration, jQuery removal) cannot be verified. Regressions ship to production.

**No CI/CD pipeline:**
- Problem: No `.github/workflows/`, no Travis/Circle config. Deploys rely on `npm run deploy` (`gh-pages -d build`) being run manually.
- Blocks: No automated build verification on PR. No automated security scans.

**No environment configuration:**
- Problem: All content lives in `src/resumeData.json`. No `.env`, no build-time content management.
- Blocks: Editing resume content requires a code change and redeploy. Acceptable for a personal site, noting only for completeness.

**No accessibility validation:**
- Problem: Icon-only social links (`About.jsx:37-44`) have no `aria-label`. Navbar toggler has `aria-label="Toggle navigation"` (good), but `<i>` icons throughout are decorative-only without `aria-hidden="true"`. Profile picture has alt text "Profile Pic" (vague).
- Blocks: Site likely fails WCAG 2.1 AA contrast and label requirements.

## Test Coverage Gaps

**No tests exist:**
- What's not tested: All eight components (`About`, `Education`, `Leadership`, `Navbar`, `Projects`, `Skills`, `Testimonials`, `Work`), the `serviceWorker` unregister flow, and the data destructuring in `src/index.js`.
- Files: All of `src/`
- Risk: Any change can break rendering silently. The `image_map` in `Projects.jsx` is particularly likely to break unnoticed when projects are added.
- Priority: Medium for a static personal site; High if migrating off CRA (need a regression net).

**No visual regression testing:**
- What's not tested: Layout / CSS changes against 186 KB `App.css`.
- Files: `src/App.css`
- Risk: Bootstrap upgrade or CSS purge would visually break the site with no automated detection.
- Priority: Low.

---

*Concerns audit: 2026-05-26*
