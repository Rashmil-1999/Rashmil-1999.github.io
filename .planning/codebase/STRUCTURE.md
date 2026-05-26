# Codebase Structure

**Analysis Date:** 2026-05-26

## Directory Layout

```
Rashmil-1999.github.io/
├── public/                     # Static assets served as-is by CRA / GitHub Pages
│   ├── index.html              # HTML shell, CDN <script>/<link> tags, inline scroll-spy JS
│   ├── manifest.json           # PWA manifest (CRA default template)
│   ├── favicon.ico             # Favicon (legacy .ico)
│   ├── favicon.png             # Favicon used in <link rel="icon"> in index.html
│   ├── logo192.png             # PWA icon (192x192)
│   ├── logo512.png             # PWA icon (512x512)
│   ├── robots.txt              # Crawler directives
│   ├── CNAME                   # Custom domain mapping for GitHub Pages
│   └── Rashmil_Panchani.pdf    # Downloadable resume PDF referenced by About.jsx
├── src/                        # Application source bundled by react-scripts
│   ├── index.js                # React entry; defines App; mounts via createRoot
│   ├── index.css               # Body/code base typography
│   ├── App.css                 # Site styling (large, single global stylesheet)
│   ├── logo.svg                # Unused CRA template asset
│   ├── resumeData.json         # Single source of truth for all displayed content
│   ├── serviceWorker.js        # PWA helpers (currently unregistered)
│   ├── setupTests.js           # Jest DOM matcher setup (Create React App default)
│   ├── components/             # Stateless section components (one per resume area)
│   │   ├── Navbar.jsx          # Fixed-top sidebar nav with profile picture
│   │   ├── About.jsx           # Name, status, contact, social, resume download
│   │   ├── Education.jsx       # Schools list
│   │   ├── Work.jsx            # Job history list
│   │   ├── Skills.jsx          # Categorized skills with icon classes
│   │   ├── Projects.jsx        # Project cards with imported images and tech-stack chips
│   │   ├── Leadership.jsx      # Leadership / committee entries
│   │   └── Testimonials.jsx    # Quoted testimonials
│   └── assets/                 # Imported images (CRA hashes them at build time)
│       ├── profilepic.jpg      # Used by Navbar.jsx
│       ├── archive.{jpeg,jpg,png}, asl.png, attendance{,1}.png, attendance.webp,
│       ├── aowe.jpg, chatbot.png, emotion{,_recognition}.png, event.png,
│       ├── eyantra.{jpg,png}, face_detection.png, graduino.png, library.png,
│       ├── ner.png, resume.png, SIH.png, smgarden.png        # Used by Projects.jsx
├── node_modules/               # Installed dependencies (gitignored)
├── package.json                # CRA scripts, deps, GitHub Pages homepage, browserslist
├── package-lock.json           # npm lockfile
├── yarn.lock                   # yarn lockfile (both managers have been used)
├── README.md                   # Default CRA README
└── .gitignore
```

## Directory Purposes

**`public/`:**
- Purpose: Static files copied verbatim into the build output; referenced from JSX via the literal filename in `homepage` URL space.
- Contains: HTML template, manifest, favicons, PWA icons, robots.txt, GitHub Pages `CNAME`, downloadable PDF resume.
- Key files: `public/index.html`, `public/Rashmil_Panchani.pdf`, `public/manifest.json`, `public/CNAME`.

**`src/`:**
- Purpose: All source compiled by `react-scripts`.
- Contains: React entry, root styles, data JSON, service worker, and the `components/` and `assets/` subtrees.
- Key files: `src/index.js`, `src/App.css`, `src/resumeData.json`.

**`src/components/`:**
- Purpose: One `.jsx` file per visible resume section.
- Contains: Default-exported stateless functional components.
- Key files: All eight files are equally important — each is rendered exactly once from `src/index.js`.

**`src/assets/`:**
- Purpose: Binary images that are `import`-ed into JSX so CRA fingerprints them and rewrites URLs.
- Contains: Project thumbnails (used by `src/components/Projects.jsx`) and the profile photo (used by `src/components/Navbar.jsx`).
- Key files: `src/assets/profilepic.jpg` and any image listed in the `image_map` inside `src/components/Projects.jsx`.

**`.planning/codebase/`:**
- Purpose: GSD codebase-mapping output (this folder).
- Generated: Yes, by the codebase-mapping agent.
- Committed: Yes (under version control).

**`.claude/`:**
- Purpose: Local Claude Code configuration, GSD workflows, and project instructions.
- Contains: `.claude/CLAUDE.md` (project rules), `.claude/agents/`, `.claude/commands/gsd/`, `.claude/get-shit-done/` workflow scaffolding.
- Committed: Yes (currently untracked per `git status`).

**`node_modules/`:**
- Purpose: Installed npm dependencies.
- Generated: Yes (via `npm install` / `yarn install`).
- Committed: No.

## Key File Locations

**Entry Points:**
- `public/index.html`: HTML shell, CDN library tags, inline jQuery scroll-spy script, mount point `<div id="root">`.
- `src/index.js`: React entry; defines `App`; mounts with `createRoot`; unregisters service worker.

**Configuration:**
- `package.json`: CRA scripts (`start`, `build`, `test`, `eject`, `predeploy`, `deploy`), `homepage` for GitHub Pages, ESLint extends `react-app`, browserslist targets.
- `public/manifest.json`: PWA manifest (still the CRA template).
- `public/CNAME`: Custom domain configuration for GitHub Pages deploys.

**Core Logic:**
- `src/index.js`: Composition root; declares the section order.
- `src/components/*.jsx`: One presentational component per section (see table in `ARCHITECTURE.md`).

**Data:**
- `src/resumeData.json`: All displayed content — `about`, `sections`, `links`, `resumeData.{education,work,skills,skill_array}`, `projects`, `leaderships`, `testimonials`.

**Styling:**
- `src/App.css`: Large global stylesheet (~10.6k lines) imported in `src/index.js:6`.
- `src/index.css`: Body and `<code>` font defaults (not currently imported anywhere; `App.css` is the active root stylesheet).

**Testing:**
- `src/setupTests.js`: Jest DOM matcher setup. No `*.test.jsx` files currently exist under `src/`.

**Assets / Downloads:**
- `src/assets/`: Imported (hashed) images.
- `public/Rashmil_Panchani.pdf`: Resume download target referenced as `resume_download` in `src/resumeData.json` and downloaded by `src/components/About.jsx:53`.

## Naming Conventions

**Files:**
- React components: `PascalCase.jsx` (e.g., `Navbar.jsx`, `Projects.jsx`).
- Non-component JS: `camelCase.js` (e.g., `serviceWorker.js`, `setupTests.js`).
- Entry/root files: lowercase (`index.js`, `index.css`, `App.css`).
- Data files: `camelCase.json` (e.g., `resumeData.json`).
- Image assets: `lower_snake_case` or `lowercase` (e.g., `face_detection.png`, `profilepic.jpg`); a few use uppercase acronyms (`SIH.png`).

**Directories:**
- All lowercase (`src`, `public`, `components`, `assets`).

**Components:**
- Default-exported, named with `PascalCase`. The exported name matches the file name except for `Navbar.jsx`, which exports `SideNav` (imported as `SideNav` in `src/index.js:9`).

**Props / variables:**
- `snake_case` keys appear inside `resumeData.json` (e.g., `first_name`, `contact_message`, `tech_stack`, `skill_array`) and are destructured by the same name inside components (`src/components/About.jsx:4-12`).
- Local JS identifiers in components mix `camelCase` (`image_style` is `camelCase`-ish but actually `snake_case`) — convention is loose; expect both.

**JSX classes:**
- All `className` values are Bootstrap 4 utility / component classes (e.g., `resume-section`, `container-fluid p-0`, `d-flex flex-column flex-md-row`), plus a few custom classes defined in `src/App.css` (`profile-pic`, `social-icons`, `dev-icons`, `resume-section-content`).

## Where to Add New Code

**New resume section (e.g., "Publications"):**
1. Add the data slice to `src/resumeData.json` (top-level key, plus an entry in `sections` and `links`).
2. Create `src/components/Publications.jsx` following the existing pattern: `import React`, default-export a functional component that receives `props` and renders `<section className="resume-section" id="publications">...<hr className="m-0" /></section>`.
3. Import the component in `src/index.js` and add `<Publications publications={publications} />` in the desired order inside the `<div className="container-fluid p-0">`.

**New project:**
1. Add the image to `src/assets/` (any of `.png`, `.jpg`, `.jpeg`, `.webp`).
2. Import the image at the top of `src/components/Projects.jsx` and add it to the `image_map` object (`src/components/Projects.jsx:23-37`).
3. Add the project record to the `projects` array in `src/resumeData.json`, setting `image` to the matching `image_map` key.

**New skill / skill category:**
- Edit `src/resumeData.json` only — add an entry under `resumeData.skills.<Category>` (with `name`, `class`, optionally `data-icon`) and add the category name to `resumeData.skill_array` so `src/components/Skills.jsx:10` will iterate it.

**New social link or contact field:**
- Edit `about.social` (or `about.*`) in `src/resumeData.json`. `src/components/About.jsx:34-45` reads `social` automatically.

**New global style:**
- Append to `src/App.css`. There is currently no component-scoped CSS pattern in this codebase.

**Shared helper utilities (none today):**
- Place in a new `src/utils/` directory (does not yet exist) and import with relative paths; CRA does not have configured path aliases beyond defaults.

**Tests (none today):**
- Co-locate as `src/components/Component.test.jsx` next to the component. `src/setupTests.js` already configures `@testing-library/jest-dom`; run with `npm test`.

## Special Directories

**`build/` (not present in git):**
- Purpose: Production bundle output from `react-scripts build`.
- Generated: Yes.
- Committed: No (CRA default; deployed to GitHub Pages by `gh-pages -d build`).

**`node_modules/`:**
- Purpose: Installed npm dependencies.
- Generated: Yes.
- Committed: No.

**`.claude/`:**
- Purpose: Claude Code project configuration, custom commands, agents, hooks, and GSD workflow scaffolding.
- Generated: Partially (commands/agents are authored; runtime caches may live here).
- Committed: Yes (currently shown as untracked in `git status`).

**`.planning/`:**
- Purpose: GSD planning artifacts including this `codebase/` analysis folder.
- Generated: By GSD commands.
- Committed: Yes.

---

*Structure analysis: 2026-05-26*
