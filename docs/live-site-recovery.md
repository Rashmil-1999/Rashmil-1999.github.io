# Recovered source of the live site (rashmil-1999.github.io)

**Provenance.** The site live at https://rashmil-1999.github.io was last deployed on
**2022-09-15** (`gh-pages` commit `8c0cb75`). Its source — a CRA project named
`resume-rashmil`, adapted from the `hashirshoaeb/home` portfolio template — was
**never pushed to GitHub**. Only built artifacts exist on the `gh-pages` branch. The
pre-revamp `master`/`main` history of this repo (ending Oct 2020 at `c83c1e6`) is an
older, different CRA app and is NOT what is live.

**Recovery method.** The 2022 deploy shipped source maps
(`static/js/main.9d251857.js.map`, `static/css/main.2e4e88db.css.map`). The full
`src/` tree was extracted verbatim from `sourcesContent`. The two JSON data files
(`portfolio_shared_data.json`, `res_primaryLanguage.json`) were inlined into the
bundle by webpack with mangled top-level keys; the keys were restored from how
`App.jsx` destructures them. Images and `Rashmil_Resume.pdf` came from the
`gh-pages` branch tree.

**Where everything lives now.** The temporary `recovered/` archive was deleted after
the port was completed — every piece of value was absorbed into the Astro app:

| Live-site artifact                                       | Now                                                            |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| Content JSONs (about, education, work, projects, skills) | `src/content/` collections (yaml + md frontmatter)             |
| `Experience.jsx` / `Education.jsx` timelines             | `src/components/Work.astro`, `Education.astro`                 |
| `Header.jsx` (react-typical + react-switch)              | `src/components/Header.astro` + `HeroWidgets.tsx` island       |
| `Projects.jsx` + `ProjectDetailsModal.jsx`               | `src/components/Projects.astro` + `ProjectsGallery.tsx`        |
| `App.scss` + `theme-light/dark.scss` palettes            | `src/styles/global.css` (`@theme` tokens + `body[data-theme]`) |
| Project images (`images/portfolio/*`)                    | colocated in `src/content/projects/<slug>/`                    |
| `myProfile.jpeg`, `Rashmil_Resume.pdf`                   | `src/assets/profile.jpeg`, `public/Rashmil_Resume.pdf`         |

**Re-recovering from scratch** (if ever needed): the deployed build and its source
maps are permanent in `gh-pages` history —
`git show origin/gh-pages:static/js/main.9d251857.js.map`, then read
`sourcesContent` out of the JSON.
