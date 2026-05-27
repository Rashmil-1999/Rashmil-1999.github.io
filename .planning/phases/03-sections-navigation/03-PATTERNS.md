# Phase 3: Sections & Navigation - Pattern Map

**Mapped:** 2026-05-27
**Files analyzed:** 14 (8 section components + SideNav + BaseLayout + BaseHead + global.css + index.astro + astro.config.mjs + package.json)
**Analogs found:** 14 / 14
**Analog sources:** Phase 1 Astro stubs (existing on disk) for the component skeleton; pre-wipe CRA at git `b537845` for the original markup and styling values; Phase 2 `src/content.config.ts` for the typed collection shape; RESEARCH.md Patterns 1-8 for the Astro 6 idioms (canonical for this phase because no prior Astro component fills these stubs).

> **Critical note on analog quality:** This phase has a small but unusual analog set. The closest "role + data flow" match for every section is the **pre-wipe React .jsx component at commit `b537845`** — same role (per-section presentational), same data flow (read-from-collection / render rows). The Phase 1 Astro stubs are empty shells, not analogs. The RESEARCH.md Patterns 1-8 are the **transcription target** (CRA → Astro syntax) and are treated as authoritative for the new file's structure. Pre-wipe CRA values are quoted to preserve visual parity per CONTEXT.md D-01.

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/components/SideNav.astro` | nav-chrome component | request-response (build-time read + browser-side scroll-spy/toggle) | `b537845:src/components/Navbar.jsx` + RESEARCH.md Pattern 5 | role-match (React → Astro syntax change; mobile pattern changes from Bootstrap collapse to inline `aria-expanded`) |
| `src/components/About.astro` | singleton-rendering component | request-response (`getEntry('about', 'about')`) | `b537845:src/components/About.jsx` + RESEARCH.md Pattern 3 | exact (same fields, same composition, same accent-span trick) |
| `src/components/Education.astro` | list-collection-rendering component | request-response (sorted `.map`) | `b537845:src/components/Education.jsx` + RESEARCH.md Pattern 1 | exact |
| `src/components/Work.astro` | list-collection-rendering component | request-response (sorted `.map`) | `b537845:src/components/Work.jsx` + RESEARCH.md Pattern 1 | exact (note: section id changes from `experience` → `work` per Phase 1 D-23) |
| `src/components/Leadership.astro` | list-collection-rendering component | request-response (sorted `.map`) | `b537845:src/components/Leadership.jsx` + RESEARCH.md Pattern 1 | exact |
| `src/components/Skills.astro` | singleton-with-nested-categories component | request-response (`getEntry('skills', 'skills')`) | `b537845:src/components/Skills.jsx` + RESEARCH.md Pattern 4 | role-match (icons resolve via `<Icon>` instead of `<i class="iconify">` / `<i class="devicon-…">`; nested-category shape preserved) |
| `src/components/Projects.astro` | image-bearing list-collection component | request-response with image optimization | `b537845:src/components/Projects.jsx` + RESEARCH.md Pattern 2 | role-match (replaces `image_map` lookup with typed `<Image src={project.data.cover}>`; adds stretched-link a11y pattern) |
| `src/components/Testimonials.astro` | list-collection-rendering component (no `<hr>`) | request-response | `b537845:src/components/Testimonials.jsx` | exact (only section without trailing `<hr>` per CRA + CONTEXT.md D-03) |
| `src/layouts/BaseLayout.astro` | layout / script-injection host | scaffold + browser-script | Self (existing `src/layouts/BaseLayout.astro` on disk) + RESEARCH.md Pattern 7 | partial (add `<script>` block after `<slot />` for scroll-spy + mobile-nav-toggle — D-30 placement) |
| `src/components/BaseHead.astro` | head-fragment component | scaffold | Self (existing `src/components/BaseHead.astro` on disk) | exact (DELETE the two `<link rel="preconnect">` lines 18-19 per D-36; no other changes — OG/Twitter is Phase 4) |
| `src/styles/global.css` | global stylesheet / Tailwind v4 `@theme` host | scaffold | Self (existing `src/styles/global.css` on disk; values from `git show b537845:src/App.css`) + RESEARCH.md Pattern 8 | partial (fill empty `@theme {}` block + add Fontsource `@import`s + base body/h1 + smooth-scroll guard + sidebar layout) |
| `src/pages/index.astro` | page route / composition | scaffold | Self (existing `src/pages/index.astro` on disk) | exact (NO STRUCTURAL CHANGE — composition order already correct from Phase 1 D-07; this file is in scope only as a verification target, not as an edit target) |
| `astro.config.mjs` | build config | config | Self (existing `astro.config.mjs` on disk) | partial (add `icon()` to `integrations[]`; add `trailingSlash: 'always'`; `build.format` default is already `'directory'` per RESEARCH.md A7 — optional explicit set) |
| `package.json` | dependency manifest | config | Self (existing `package.json` on disk) | partial (add 5 devDeps for icons + 2 deps for fonts per RESEARCH.md "New" table) |

---

## Pattern Assignments

### `src/components/SideNav.astro` (nav-chrome, browser-script-bearing)

**Analog:** `git show b537845:src/components/Navbar.jsx` (51 lines) + RESEARCH.md Pattern 5 (lines 616-707 of `03-RESEARCH.md`).

**Imports pattern** (RESEARCH.md 03-RESEARCH.md lines 619-624):
```astro
---
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import profileImage from '../assets/profile.jpg';

const linkEntries = await getCollection('links');
linkEntries.sort((a, b) => a.data.order - b.data.order);
---
```

**Original CRA markup pattern** (`b537845:src/components/Navbar.jsx` lines 8-50):
```jsx
<nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" id="sideNav">
  <a className="navbar-brand js-scroll-trigger" href="#page-top">
    <span className="d-block d-lg-none">{name}</span>                     {/* mobile brand text */}
    <span className="d-none d-lg-block">                                  {/* desktop profile pic */}
      <img className="img-fluid img-profile rounded-circle mx-auto mb-2 profile-pic"
           src={profilepic} alt="Profile Pic" />
    </span>
  </a>
  <button className="navbar-toggler" type="button"
          data-toggle="collapse" data-target="#navbarSupportedContent"  /* Bootstrap JS hook — REMOVE */
          aria-controls="navbarSupportedContent"
          aria-expanded="false"                                          /* keep & wire via JS */
          aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav">
      {sections.map((section, id) => (
        <li className="nav-item" key={id}>
          <a className="nav-link js-scroll-trigger" href={links[id]}>{section}</a>
        </li>
      ))}
    </ul>
  </div>
</nav>
```

**Astro port pattern** (RESEARCH.md 03-RESEARCH.md lines 629-674) — copy structure, replace classes with Tailwind utilities, change `<section id>` to `<nav id="sidenav">` (Phase 1 D-23 lowercase id, NOT CRA's `sideNav` mixed-case):
```astro
<nav id="sidenav" class="sidenav" aria-label="Section navigation">
    {/* Mobile top bar: brand text + hamburger (visible < md) */}
    <div class="mobile-bar flex items-center justify-between md:hidden">
        <span class="brand">Rashmil Panchani</span>
        <button
            type="button"
            id="sidenav-toggle"
            aria-label="Toggle navigation menu"
            aria-controls="sidenav-list"
            aria-expanded="false"
            class="hamburger"
        >
            <span aria-hidden="true">☰</span>
        </button>
    </div>

    {/* Desktop sidebar header: profile image (visible >= md per D-11) */}
    <div class="sidenav-header hidden md:block">
        <Image
            src={profileImage}
            alt="Rashmil Panchani"
            class="profile-pic mx-auto rounded-full"
            width={200}
            height={225}
        />
    </div>

    {/* Nav links — collapsed on mobile, always visible on desktop */}
    <ul id="sidenav-list" role="list" class="sidenav-list hidden md:block">
        {
            linkEntries.map((entry) => (
                <li>
                    <a
                        href={`#${entry.data.id}`}
                        class="nav-link block"
                        data-section-link={entry.data.id}
                    >
                        {entry.data.label}
                    </a>
                </li>
            ))
        }
    </ul>
</nav>
```

**Mobile toggle script pattern** (RESEARCH.md 03-RESEARCH.md lines 678-707) — Bootstrap's `data-toggle="collapse"` replaced with vanilla `aria-expanded` toggle + Escape + close-on-link-click:
```astro
<script>
    const toggle = document.getElementById('sidenav-toggle');
    const list = document.getElementById('sidenav-list');
    if (toggle && list) {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            list.classList.toggle('hidden');
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                toggle.setAttribute('aria-expanded', 'false');
                list.classList.add('hidden');
                toggle.focus();
            }
        });
        list.querySelectorAll('a').forEach((a) =>
            a.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 767px)').matches) {
                    toggle.setAttribute('aria-expanded', 'false');
                    list.classList.add('hidden');
                }
            }),
        );
    }
</script>
```

**Diff from CRA (deltas to surface in PLAN.md):**
- Section id changes from `sideNav` → `sidenav` (Phase 1 D-23 lowercase lock; mentioned in stub file comment).
- Profile photo wrapper changes: CRA used `d-block d-lg-none` / `d-none d-lg-block` (Bootstrap `lg` = 992px) — Astro uses `md:hidden` / `hidden md:block` (Tailwind `md` = 768px per D-10 — deliberate widening).
- Bootstrap collapse mechanism (`data-toggle`, `data-target`, `collapse navbar-collapse`) DELETED — replaced with `aria-expanded` toggle + `.hidden` class.
- No `react-scroll` imports (the CRA file imported `Link, animateScroll as scroll` but never used them — see CLAUDE.md project anti-pattern).

---

### `src/components/About.astro` (singleton-rendering, request-response)

**Analog:** `git show b537845:src/components/About.jsx` (72 lines) + RESEARCH.md Pattern 3 (lines 503-577 of `03-RESEARCH.md`).

**Imports pattern** (RESEARCH.md 03-RESEARCH.md lines 506-512):
```astro
---
import { getEntry } from 'astro:content';
import { Image } from 'astro:assets';
import { Icon } from 'astro-icon/components';
import profileImage from '../assets/profile.jpg';

const aboutEntry = await getEntry('about', 'about');
if (!aboutEntry) throw new Error('about.yaml missing — was Phase 2 completed?');
const about = aboutEntry.data;
---
```

**Original CRA accent-span pattern** (`b537845:src/components/About.jsx` lines 16-21) — preserve verbatim:
```jsx
<h1 className="mb-0">
  {first_name}
  <span className="text-primary">{last_name}</span>
</h1>
<div className="subheading mb-5">
  <p className="mb-3">{current_status}</p>
  <p className="lead mb-0">{contact_message}</p>
  <a href={"mailto:" + email}>{email}</a>
</div>
<p className="lead mb-5">{description}</p>
```

**Astro port pattern** (RESEARCH.md 03-RESEARCH.md lines 518-573) — adds mobile-only profile photo (CRA had no profile in About; CRA put it in the sidebar's mobile brand text only); replaces social `<i className={handle.className}>` with `<Icon name={handle.icon}>`; replaces `<i className="fas fa-download">` + " Resume" with plain "Download Resume" label:
```astro
<section id="about" class="resume-section">
    <div class="resume-section-content">
        {/* Profile image on mobile only — sidebar has it on >= md (D-25) */}
        <div class="text-center md:hidden">
            <Image
                src={profileImage}
                alt={`${about.first_name} ${about.last_name}`}
                class="profile-pic mx-auto mb-4 rounded-full"
                width={200}
                height={225}
            />
        </div>

        <h1 class="mb-0">
            {about.first_name}
            {' '}
            <span class="text-primary">{about.last_name}</span>
        </h1>

        <div class="subheading mb-5">
            <p class="mb-3">{about.current_status}</p>
            <p class="lead mb-0">{about.contact_message}</p>
            <a href={`mailto:${about.email}`}>{about.email}</a>
        </div>

        <p class="lead mb-5">{about.description}</p>

        <div class="flex flex-wrap items-center gap-4">
            {/* Social icons */}
            <div class="flex gap-3">
                {about.social.map((handle) => (
                    <a
                        href={handle.url}
                        aria-label={handle.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="social-icon"
                    >
                        <Icon name={handle.icon} aria-hidden="true" class="size-6" />
                        <span class="sr-only">(opens in new tab)</span>
                    </a>
                ))}
            </div>

            {/* Resume download CTA */}
            <a
                href={`/${about.resume_download}`}
                download
                class="btn-primary"
            >
                Download Resume
            </a>
        </div>
    </div>
</section>
<hr class="m-0 border-black/10" />
```

**Diff from CRA (deltas to surface in PLAN.md):**
- Removes Bootstrap `container > row > col` 3-column grid wrapping social/CTA (lines 22-58 of CRA original) — Tailwind `flex flex-wrap items-center gap-4` replaces it.
- Adds mobile-only profile pic (CRA never had one in About — only in sidebar mobile brand; D-25 reinstates because mobile sidebar shows brand text only per D-11).
- `aria-label={handle.name}` is NEW (CRA had no aria-label on social icon anchors — A11Y improvement).
- Resume CTA copy is "Download Resume" (CRA used " Resume" with a download icon prefix; CONTEXT.md D-27 locks visible label).

**Source-of-truth note (Pitfall B):** `getEntry('about', 'about')` second-arg id requires verification during execution. Phase 2 `about.yaml` uses top-level key `about:` (verified at `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/content/about.yaml` line 1). If the `file()` loader derives a different id, adjust per RESEARCH.md Pitfall B.

---

### `src/components/Education.astro` (list-collection, request-response)

**Analog:** `git show b537845:src/components/Education.jsx` (38 lines) + RESEARCH.md Pattern 1 (lines 362-408 of `03-RESEARCH.md`).

**Imports + collection-read pattern** (RESEARCH.md 03-RESEARCH.md lines 362-378):
```astro
---
import { getCollection, render } from 'astro:content';

const entries = await getCollection('education', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
);
entries.sort((a, b) => a.data.order - b.data.order);

const rendered = await Promise.all(
    entries.map(async (entry) => ({
        entry,
        Content: (await render(entry)).Content,
    })),
);
---
```

**Original CRA row pattern** (`b537845:src/components/Education.jsx` lines 13-30) — the conditional class swap (last entry has no `mb-5`) is the load-bearing detail:
```jsx
{schools.map((school, id) => (
  <div
    className={
      id === schools.length - 1
        ? "d-flex flex-column flex-md-row justify-content-between"
        : "d-flex flex-column flex-md-row justify-content-between mb-5"
    }
    key={id}>
    <div className="flex-grow-1">
      <h3 className="mb-0">{school.name}</h3>
      <div className="subheading mb-3">{school.degree}</div>
      <p>{school.score}</p>
    </div>
    <div className="flex-shrink-0">
      <span className="text-secondary">{school.graduated}</span>
    </div>
  </div>
))}
```

**Astro port pattern** (RESEARCH.md 03-RESEARCH.md lines 381-408) — `d-flex flex-column flex-md-row justify-content-between` → `flex flex-col md:flex-row md:justify-between`; `text-secondary` → `text-muted` (or kept as semantic class; RESEARCH.md Pattern 1 uses `text-muted`); `<p>{school.score}</p>` becomes `{entry.data.score && <p>{entry.data.score}</p>}` because score is optional in Phase 2 schema:
```astro
<section id="education" class="resume-section">
    <div class="resume-section-content">
        <h2 class="mb-5">Education</h2>
        {
            rendered.map(({ entry, Content }, id) => (
                <div
                    class={
                        id === rendered.length - 1
                            ? 'flex flex-col md:flex-row md:justify-between'
                            : 'mb-5 flex flex-col md:flex-row md:justify-between'
                    }
                >
                    <div class="flex-grow">
                        <h3 class="mb-0">{entry.data.name}</h3>
                        <div class="subheading mb-3">{entry.data.degree}</div>
                        {entry.data.score && <p>{entry.data.score}</p>}
                        <Content />
                    </div>
                    <div class="flex-shrink-0">
                        <span class="text-muted">{entry.data.graduated}</span>
                    </div>
                </div>
            ))
        }
    </div>
</section>
<hr class="m-0 border-black/10" />
```

**Diff from CRA:**
- Adds `<Content />` for the markdown body (CRA had no body — Phase 2 added one-sentence summaries per Phase 2 D-23).
- Body sorting now by `entry.data.order` ascending (Phase 2 D-25 — `resumeData.json` was already in order; new schema makes it explicit).
- `text-secondary` (Bootstrap utility) → `text-muted` semantic class declared in `global.css` (RESEARCH.md Pattern 8) — or a Tailwind utility tied to `--color-muted` (planner picks).

---

### `src/components/Work.astro` (list-collection, request-response)

**Analog:** `git show b537845:src/components/Work.jsx` (38 lines) + RESEARCH.md Pattern 1 (transposed — same shape as Education).

**Original CRA pattern is structurally identical to Education.jsx.** The only material differences:
- Section id changes from `experience` (CRA) → `work` (Phase 1 D-23 + Phase 2 D-24 lock — see stub file comment at `src/components/Work.astro` lines 4-5).
- Heading text changes from `Experience` (CRA) → `Work` (Phase 2 D-24 canonical label lock).
- Field names: `{job.title}` → `{entry.data.title}`, `{job.company}` → `{entry.data.company}`, `{job.duration}` → `{entry.data.duration}`, `<p>{job.description}</p>` → `<Content />`.

**Reuse the Education.astro skeleton verbatim, swap:**
- `getCollection('education', ...)` → `getCollection('work', ...)`
- `<h2>Education</h2>` → `<h2>Work</h2>`
- `<section id="education">` → `<section id="work">`
- `{entry.data.name}` (school name) → `{entry.data.title}` (job title)
- `{entry.data.degree}` (school degree) → `{entry.data.company}` (company)
- `{entry.data.graduated}` → `{entry.data.duration}`
- `{entry.data.score && <p>...}` → delete (no equivalent field in `work` schema)

**Critical:** Do NOT carry CRA's `<h3>{job.title}</h3><div>{job.company}</div>` ordering blindly — keep this order (title is the h3, company is the subheading) per the CRA original. The schema field name is `title` for the role and `company` for the org.

---

### `src/components/Leadership.astro` (list-collection, request-response)

**Analog:** `git show b537845:src/components/Leadership.jsx` (38 lines) + RESEARCH.md Pattern 1 (transposed).

**Same skeleton as Education / Work.** Field swap from `work` schema → `leadership` schema:
- `getCollection('work', ...)` → `getCollection('leadership', ...)`
- `<h2>Work</h2>` → `<h2>Leadership</h2>`
- `<section id="work">` → `<section id="leadership">`
- `{entry.data.company}` (subheading) → `{entry.data.org}` (org)
- `{entry.data.title}` (h3) → `{entry.data.title}` (h3) — same field name in Phase 2 schema
- `{entry.data.duration}` → `{entry.data.duration}` — same field name

---

### `src/components/Skills.astro` (singleton-with-nested-categories, request-response)

**Analog:** `git show b537845:src/components/Skills.jsx` (42 lines) + RESEARCH.md Pattern 4 (lines 580-614 of `03-RESEARCH.md`).

**Imports + read pattern** (RESEARCH.md 03-RESEARCH.md lines 581-591):
```astro
---
import { getEntry } from 'astro:content';
import { Icon } from 'astro-icon/components';

const skillsEntry = await getEntry('skills', 'skills');
if (!skillsEntry) throw new Error('skills.yaml missing');
const categories = [...skillsEntry.data.categories].sort(
    (a, b) => a.order - b.order,
);
---
```

**Original CRA pattern** (`b537845:src/components/Skills.jsx` lines 5-31) — note the dual-rendering branch (devicon `<i>` vs Iconify `<span data-icon>`) which collapses to a single `<Icon>` in Astro because Phase 2 D-16 unified the id format:
```jsx
{skill_array.map((skill, id) => {
  const skill_set = skills[skill].map((skill_item, id) => {
    return skill_item.class !== "iconify mr-2" ? (
      <li className="list-inline-item mr-3" key={id}>
        <i className={skill_item.class}></i>
        {skill_item.name}
      </li>
    ) : (
      <li className="list-inline-item mr-3" key={id}>
        <span className={skill_item.class}
              data-icon={skill_item["data-icon"]} data-inline="false"></span>
        {skill_item.name}
      </li>
    );
  });
  return (
    <div key={id}>
      <div className="subheading mb-3">{skill}</div>
      <ul className="dev-icons">{skill_set}</ul>
    </div>
  );
})}
```

**Astro port pattern** (RESEARCH.md 03-RESEARCH.md lines 593-613):
```astro
<section id="skills" class="resume-section">
    <div class="resume-section-content">
        <h2 class="mb-5">Skills</h2>
        {
            categories.map((category) => (
                <div class="mb-5">
                    <div class="subheading mb-3">{category.name}</div>
                    <ul role="list" class="dev-icons flex flex-wrap gap-4">
                        {category.items.map((item) => (
                            <li class="flex flex-col items-center">
                                <Icon name={item.icon} aria-hidden="true" class="size-6" />
                                <span class="mt-1 text-xs">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))
        }
    </div>
</section>
<hr class="m-0 border-black/10" />
```

**Diff from CRA:**
- Collapses dual icon-rendering branches (Iconify CDN `<span class="iconify">` vs Devicon class-on-`<i>`) → single `<Icon name={item.icon}>` (Phase 2 D-16 unified id format).
- `<li class="list-inline-item mr-3">` → `<li class="flex flex-col items-center">` (CRA stacked icon + name inline; Phase 3 stacks vertically per the visual layout — name beneath icon per CONTEXT.md D-20).
- Adds `role="list"` (some screen-readers strip semantic list role when `list-style: none` is applied via utility — explicit role keeps a11y).
- Adds `aria-hidden="true"` on each `<Icon>` (decorative — accessible name comes from the visible `<span>` beneath per D-20).
- Category-iteration sort comparator `(a, b) => a.order - b.order` on `categories[]` — Phase 2 schema sets default `order: 10/20/30/40/50/60` on `skills.yaml` (verified at `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/content/skills.yaml`).

**Source-of-truth note (Pitfall B):** `getEntry('skills', 'skills')` second-arg id requires verification (same caveat as About — top-level YAML key is `skills:`).

---

### `src/components/Projects.astro` (image-bearing list-collection, request-response with image optimization)

**Analog:** `git show b537845:src/components/Projects.jsx` (85 lines) + RESEARCH.md Pattern 2 (lines 421-486 of `03-RESEARCH.md`).

**Imports + read pattern** (RESEARCH.md 03-RESEARCH.md lines 422-440):
```astro
---
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';

const entries = await getCollection('projects', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
);
entries.sort((a, b) => a.data.order - b.data.order);

const rendered = await Promise.all(
    entries.map(async (entry) => ({
        entry,
        Content: (await render(entry)).Content,
    })),
);
---
```

**Original CRA pattern** (`b537845:src/components/Projects.jsx` lines 1-79) — the `image_map` lookup table at lines 16-26 is the explicit anti-pattern to NOT reintroduce per SECTION-10:
```jsx
// CRA: image_map lookup table — DELETE; replaced by typed cover field
const image_map = {
  face_detection: face_detection,
  emotion_recognition: emotion,
  library: library,
  eyantra: eyantra,
  archive: archive,
  garduino: garduino,
  resume: resume,
  event: event,
  aowe: aowe,
};

{projects.map((project, id) => (
  <div key={id} className="card bg-light border border-light mb-3">
    <div className="row ">
      <div className="col-md-4 text-center">
        <img src={image_map[project.image]} alt="Project Icon"
             style={image_style} className="card-img mt-5" />
      </div>
      <div className="col-md-8">
        <div className="card-body">
          <h3 className="card-title">
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          </h3>
          <p className="card-text">{project.description}</p>
          <h4 className="card-title">Tech Stack:</h4>
          {project.tech_stack.map((tech, id) => (
            <button key={id} type="button"
                    className="btn btn-secondary mr-2 mb-2" disabled>
              {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
))}
```

**Astro port pattern with stretched-link a11y** (RESEARCH.md 03-RESEARCH.md lines 442-486):
```astro
<section id="projects" class="resume-section">
    <div class="resume-section-content">
        <h2 class="mb-5">Projects</h2>
        {
            rendered.map(({ entry, Content }) => (
                <article class="project-card relative mb-5 flex flex-col md:flex-row md:[&:nth-child(even)]:flex-row-reverse">
                    <div class="md:w-1/3 text-center">
                        <Image
                            src={entry.data.cover}
                            alt={entry.data.title}
                            class="mx-auto max-h-[200px] max-w-[200px] object-contain"
                            loading="lazy"
                        />
                    </div>
                    <div class="relative z-10 md:w-2/3">
                        <h3>
                            <a
                                class="project-card-link text-primary after:absolute after:inset-0"
                                href={entry.data.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {entry.data.title}
                                <span class="sr-only">(opens in new tab)</span>
                            </a>
                        </h3>
                        <div class="relative z-10">
                            <Content />
                        </div>
                        <h4 class="mt-3">Tech Stack:</h4>
                        <ul role="list" class="flex flex-wrap gap-2">
                            {entry.data.tech_stack.map((tech) => (
                                <li class="rounded-full bg-black/5 px-2 py-1 text-xs">
                                    {tech}
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>
            ))
        }
    </div>
</section>
<hr class="m-0 border-black/10" />
```

**Stretched-link contract** (RESEARCH.md 03-RESEARCH.md lines 488-495):
- Card container needs `position: relative` (`class="relative"`).
- Link's `::after` (Tailwind `after:absolute after:inset-0`) overlays the whole card.
- Description + tech-stack column gets `position: relative; z-10` (Tailwind `relative z-10`) so text selection still works above the overlay.
- One `<a>` per card; no nested anchors (a11y requirement).
- "(opens in new tab)" span lives inside the link for AT announcement.

**Diff from CRA:**
- `image_map` lookup table DELETED — `<Image src={entry.data.cover}>` reads typed `ImageMetadata` directly (Phase 2 D-07 / SECTION-10).
- `card bg-light border border-light mb-3` → `project-card relative mb-5 flex flex-col md:flex-row` — Bootstrap card chrome removed (CONTEXT.md D-04: surfaces sit on same cream, no white card-shadow).
- Alternating direction added via `md:[&:nth-child(even)]:flex-row-reverse` (CONTEXT.md D-15; RESEARCH.md A5 — fallback CSS rule if arbitrary variant fails).
- Tech-stack buttons (`<button disabled>` styled as Bootstrap `btn-secondary`) → pill `<li>` chips (CONTEXT.md D-17 — pills with name only, no icon).
- All external links get `rel="noopener noreferrer"` + `target="_blank"` + sr-only "(opens in new tab)" span (CRA had `rel="noopener noreferrer"` on title `<a>` but no announcement).

**`<Image>` dimension caveat (RESEARCH.md Pitfall C):** Don't pass explicit `width`/`height` for project covers — let Astro auto-infer from the typed `ImageMetadata` cover field. If `dist/index.html` shows `<img>` tags without intrinsic dimensions, add `widths={[200, 400]}` to force Astro to emit them.

---

### `src/components/Testimonials.astro` (list-collection, no trailing `<hr>`)

**Analog:** `git show b537845:src/components/Testimonials.jsx` (28 lines).

**Original CRA pattern** (`b537845:src/components/Testimonials.jsx` lines 5-23):
```jsx
{testimonials.map((testimonial, id) => (
  <blockquote key={id} className="blockquote">
    <p className="mb-0 lead">
      <em>{testimonial.text}</em>
    </p>
    <footer className="blockquote-footer">
      <cite title="Source Title">{testimonial.user}</cite>
    </footer>
  </blockquote>
))}
```

**Astro port pattern** — Phase 2 schema renames `text` → markdown body (via `<Content />`); `user` field stays the same:
```astro
---
import { getCollection, render } from 'astro:content';

const entries = await getCollection('testimonials', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
);
entries.sort((a, b) => a.data.order - b.data.order);

const rendered = await Promise.all(
    entries.map(async (entry) => ({
        entry,
        Content: (await render(entry)).Content,
    })),
);
---

<section id="testimonials" class="resume-section">
    <div class="resume-section-content">
        <h2 class="mb-5">Testimonials</h2>
        {
            rendered.map(({ entry, Content }) => (
                <blockquote class="blockquote">
                    <div class="mb-0 lead italic">
                        <Content />
                    </div>
                    <footer class="blockquote-footer">
                        <cite>{entry.data.user}</cite>
                        {entry.data.role && entry.data.org && (
                            <span class="text-muted">
                                {' '}— {entry.data.role}, {entry.data.org}
                            </span>
                        )}
                    </footer>
                </blockquote>
            ))
        }
    </div>
</section>
{/* CONTEXT.md D-03: NO trailing <hr> on Testimonials (matches CRA — last section) */}
```

**Diff from CRA:**
- `<em>{testimonial.text}</em>` → `<div class="italic"><Content /></div>` — markdown body renders inside `italic` wrapper to preserve italic styling (CONTEXT.md D-24 — Mulish 400i for quote text).
- Adds `role` + `org` attribution display (CRA had only `user`; Phase 2 schema added optional `role` and `org` — render them when present).
- `<cite title="Source Title">` → `<cite>` (CRA's hardcoded `title="Source Title"` was a CRA bug — drop it).
- NO trailing `<hr class="m-0 border-black/10" />` — CONTEXT.md D-03 + CRA pattern (CRA's Testimonials.jsx has no `<hr>` either).

---

### `src/layouts/BaseLayout.astro` (layout, scaffold + browser-script host)

**Analog:** Self (existing `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/layouts/BaseLayout.astro`, 24 lines) + RESEARCH.md Pattern 7 (lines 757-782 of `03-RESEARCH.md`).

**Current file** (lines 1-24) — preserve front-matter and `<html>` skeleton; ADD `<script>` block after `<slot />`:
```astro
---
import BaseHead from '../components/BaseHead.astro';
import '../styles/global.css';

interface Props { title: string; }
const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
    <head>
        <BaseHead title={title} />
    </head>
    <body>
        <slot />
        {/* NEW: scroll-spy + (if planner picks BaseLayout home) mobile toggle */}
        <script>
            /* see Scroll-Spy script pattern below */
        </script>
    </body>
</html>
```

**Scroll-Spy script pattern** (RESEARCH.md 03-RESEARCH.md lines 713-750) — single block, vanilla JS, no framework:
```astro
<script>
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('[data-section-link]');
    const linkMap = new Map();
    navLinks.forEach((link) => {
        const id = link.getAttribute('data-section-link');
        if (id) linkMap.set(id, link);
    });

    const observer = new IntersectionObserver(
        (entries) => {
            const active = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!active) return;
            const id = active.target.id;
            linkMap.forEach((link, linkId) => {
                if (linkId === id) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        },
        {
            rootMargin: '-30% 0px -50% 0px',  // D-31 default — tune in preview
            threshold: 0,
        },
    );

    sections.forEach((section) => observer.observe(section));
</script>
```

**Placement recommendation** (RESEARCH.md Open Question 1, line 1106-1109): **BaseLayout.astro** is the recommended home — runs once per page load, single mount, gives every future page free scroll-spy. The mobile-nav-toggle script can either co-locate here or stay in SideNav.astro (the latter keeps nav concerns co-located — planner picks).

---

### `src/components/BaseHead.astro` (head-fragment)

**Analog:** Self (existing `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/components/BaseHead.astro`, 19 lines).

**Current file** (lines 14-19):
```astro
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<link rel="icon" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />            {/* DELETE per D-36 */}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />   {/* DELETE per D-36 */}
```

**Target shape after Phase 3:**
```astro
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<link rel="icon" href="/favicon.svg" />
{/* Phase 3 D-36: Google Fonts preconnects removed — fonts self-hosted via @fontsource/* */}
{/* Phase 4 SEO-01..05: adds description / OG / Twitter / canonical here */}
```

**Diff:** Delete only lines 18-19 of the existing file. Do not touch the four lines above (charset/viewport/title/favicon).

---

### `src/styles/global.css` (Tailwind v4 `@theme` host)

**Analog:** Self (existing `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/styles/global.css`, 9 lines — empty `@theme {}` block) + `git show b537845:src/App.css` (10,567 lines — values to extract) + RESEARCH.md Pattern 8 (lines 786-947 of `03-RESEARCH.md`).

**Current file** (lines 1-9):
```css
@import 'tailwindcss';

@theme {
    /* TODO Phase 3 (STYLE-04) — brand tokens (colors, fonts, spacing) */
}
```

**Target shape** (RESEARCH.md 03-RESEARCH.md lines 786-948 — abbreviated for the assignment; full block in RESEARCH.md):

```css
@import 'tailwindcss';

/* Fontsource per-weight CSS (D-33 / D-34) */
@import '@fontsource/saira-extra-condensed/500.css';
@import '@fontsource/saira-extra-condensed/700.css';
@import '@fontsource/mulish/400.css';
@import '@fontsource/mulish/400-italic.css';
@import '@fontsource/mulish/800.css';
@import '@fontsource/mulish/800-italic.css';

@theme {
    /* Brand colors — recovered from git show b537845:src/App.css */
    --color-bg: #eee2dc;          /* line 123: body background */
    --color-text: #6c757d;        /* line ~10465: body color */
    --color-accent: #bd5d38;      /* lines 58, 66: --primary / --orange */
    --color-link: #123c69;        /* line 220: a color */
    --color-link-hover: #123c69ad;/* line 226: a:hover */
    --color-muted: #6c757d;       /* alias of text */

    /* Typography — recovered */
    --font-heading: 'Saira Extra Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --font-body: 'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Body base (recovered: lines 113-118, 123, ~10465) */
body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    font-weight: 400;
    line-height: 1.5;
}

/* Headings — Saira + uppercase (recovered lines ~10474, ~10484-10489) */
h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    text-transform: uppercase;
}
h1 { line-height: 1; }            /* recovered line ~10487 */

/* Smooth scroll + reduced-motion guard (D-32) */
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
}

/* Subheading utility (recovered lines ~10484-10489) */
.subheading {
    font-family: var(--font-heading);
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.5rem;
}

/* Lead paragraph (recovered line ~10491) */
.lead { font-size: 1.15rem; font-weight: 400; }

/* Resume section base (recovered lines ~10573-10580) */
.resume-section {
    padding: 5rem 1rem;
    max-width: 75rem;
}
@media (min-width: 768px) {  /* CRA used 992px; Phase 3 widens to md per D-10 */
    .resume-section {
        min-height: 100vh;
        padding-left: 3rem;
        padding-right: 3rem;
    }
}
.resume-section-content { width: 100%; }

/* Sidebar layout (recovered lines ~10470, ~10519-10527; breakpoint changed 992px → 768px per D-10) */
@media (min-width: 768px) {
    body { padding-left: 19rem; }  /* matches sidebar width */
    .sidenav {
        position: fixed; top: 0; left: 0;
        width: 19rem; height: 100vh;
        background-color: var(--color-bg);
        display: flex; flex-direction: column;
    }
}
@media (max-width: 767px) {
    body { padding-top: 3.375rem; }
    .sidenav {
        position: sticky; top: 0;
        background-color: var(--color-bg);
        z-index: 50;
    }
}

/* Active nav link — 3 signals: border + 800 weight + accent color (D-12) */
.nav-link {
    font-weight: 800;
    letter-spacing: 0.05rem;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    color: var(--color-text);
    border-left: 4px solid transparent;
}
.nav-link[aria-current='page'] {
    color: var(--color-accent);
    border-left-color: var(--color-accent);
}

/* Profile pic (recovered lines ~10600) */
.profile-pic { width: 200px; height: 225px; object-fit: cover; }

/* Accent text utility — used in <h1>{first_name}<span class="text-primary">{last_name}</span> */
.text-primary { color: var(--color-accent); }

/* Resume Download CTA */
.btn-primary {
    display: inline-flex; align-items: center;
    padding: 0.5rem 1rem;
    background-color: var(--color-accent);
    color: white;
    text-decoration: none;
    border-radius: 0.25rem;
}
.btn-primary:hover { background-color: #a44e2f; }
```

**CRA RECOVERY DELTA (load-bearing for planner):** The recovered CRA `.btn-primary` rule at `git show b537845:src/App.css` line 2688-2691 uses `background-color: #123c69` (deep navy), NOT the accent `#bd5d38`. RESEARCH.md and UI-SPEC.md both prescribe the accent for the Resume Download button per CONTEXT.md D-27 ("accent background or accent border — exact style follows the recovered CRA pattern, D-06"). **The recovered CRA pattern is navy.** Planner must reconcile this discrepancy in PLAN.md — either follow the UI-SPEC accent prescription (modernization choice consistent with "refresh same vibe") or honor the strict recovered CRA navy. Recommendation: surface as an explicit decision in PLAN.md; default to UI-SPEC's accent unless visual parity audit says otherwise.

---

### `src/pages/index.astro` (page route — VERIFICATION ONLY, no edit expected)

**Analog:** Self (existing `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/pages/index.astro`, 30 lines).

**Current shape** (lines 1-29) — already correct from Phase 1 D-07; the 8 components import and compose in the right order; section ids set by the section components themselves (Phase 1 D-23). No structural change expected.

**Verification checklist** (planner runs after stub fills land):
- Composition order: `<SideNav />` outside `<main>`; `<About />, <Education />, <Work />, <Skills />, <Projects />, <Leadership />, <Testimonials />` inside `<main>` in that exact order (matches `links.yaml` 10/20/30/40/50/60/70 — verified at `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/content/links.yaml`).
- Section ids in rendered `dist/index.html`: `about`, `education`, `work`, `skills`, `projects`, `leadership`, `testimonials` (existing smoke test at `tests/smoke.test.ts` already asserts this).
- The page passes `title="Rashmil Panchani"` to `BaseLayout` (line 18) — keep.

If any structural change DOES surface during execution (unlikely), planner flags it as scope creep — Phase 1 D-07 is locked.

---

### `astro.config.mjs` (build config)

**Analog:** Self (existing `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/astro.config.mjs`, 19 lines).

**Current file:**
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    site: 'https://Rashmil-1999.github.io',
    output: 'static',
    integrations: [react()],
    vite: {
        plugins: [tailwindcss()],
    },
});
```

**Target shape after Phase 3:**
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import icon from 'astro-icon';                                            /* NEW: D-28 */
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    site: 'https://Rashmil-1999.github.io',
    output: 'static',
    trailingSlash: 'always',                                              /* NEW: D-38 */
    build: { format: 'directory' },                                       /* NEW: D-38 (default in Astro 6 — explicit for clarity) */
    integrations: [react(), icon()],                                      /* MODIFIED: add icon() */
    vite: {
        plugins: [tailwindcss()],
    },
});
```

**Important — Pitfall E (RESEARCH.md):** Do NOT add `include: { devicon: ['*'] }` or any bulk-include option to `icon()`. Default behavior (each `<Icon name="…" />` reference inlines just that one glyph) is correct. Verify with `du -sh dist/_astro/` after build — total icon overhead should be <20 KB for the ~32 distinct icons referenced.

---

### `package.json` (dependency manifest)

**Analog:** Self (existing `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/package.json`, 63 lines) + RESEARCH.md "Standard Stack — New" (lines 142-153 of `03-RESEARCH.md`).

**New `dependencies`** (Fontsource CSS + .woff2 end up in dist; consumed at runtime):
- `@fontsource/saira-extra-condensed`: `^5.2.7`
- `@fontsource/mulish`: `^5.2.8`

**New `devDependencies`** (build-only — astro-icon resolves at build time; Iconify packs are JSON data):
- `astro-icon`: `^1.1.5`
- `@iconify-json/devicon`: `^1.2.62`
- `@iconify-json/simple-icons`: `^1.2.84`
- `@iconify-json/logos`: `^1.2.11`
- `@iconify-json/lucide`: `^1.2.109`

**Install command** (RESEARCH.md 03-RESEARCH.md lines 168-172):
```bash
npm install --save-dev astro-icon @iconify-json/devicon @iconify-json/simple-icons @iconify-json/logos @iconify-json/lucide
npm install @fontsource/saira-extra-condensed @fontsource/mulish
```

**Do NOT install:** `bootstrap`, `react-scroll`, `react-script-tag`, `gh-pages`, `jquery`, `font-awesome` (Phase 1 wipe removed CRA's set; Phase 5 cleanup verifies absence).

---

## Shared Patterns

### Collection-read with draft predicate (applies to all list-collection sections)

**Source:** Phase 2 D-05 + canonical_refs in CONTEXT.md line 122.
**Apply to:** `Education.astro`, `Work.astro`, `Leadership.astro`, `Projects.astro`, `Testimonials.astro`.
```astro
const entries = await getCollection('<name>', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
);
entries.sort((a, b) => a.data.order - b.data.order);
```

### Markdown body rendering (applies to all list-collection sections with markdown bodies)

**Source:** RESEARCH.md Pattern 1 (lines 373-378).
**Apply to:** `Education.astro`, `Work.astro`, `Leadership.astro`, `Projects.astro`, `Testimonials.astro`.
```astro
const rendered = await Promise.all(
    entries.map(async (entry) => ({
        entry,
        Content: (await render(entry)).Content,
    })),
);
// then in the markup:
<Content />
```

### Singleton read with throw guard (applies to About + Skills)

**Source:** RESEARCH.md Pattern 3 / Pattern 4 (lines 513-515, 586-587).
**Apply to:** `About.astro`, `Skills.astro`.
```astro
const aboutEntry = await getEntry('about', 'about');
if (!aboutEntry) throw new Error('about.yaml missing — was Phase 2 completed?');
```

Pitfall B caveat: verify second-arg id during execution against the `file()`-loader behavior.

### External-link safety triple (applies to every `<a target="_blank">`)

**Source:** CONTEXT.md D-18 + D-26; RESEARCH.md "Security Domain" line 1161.
**Apply to:** Every external `<a>` in `About.astro` (social row + future email), `Projects.astro` (card title + tech-stack URLs if any).
```astro
<a href={url} target="_blank" rel="noopener noreferrer" aria-label={...}>
    {visibleText}
    <span class="sr-only">(opens in new tab)</span>
</a>
```

### Section dividers (applies to every section except Testimonials)

**Source:** CONTEXT.md D-03 + RESEARCH.md Pitfall A.
**Apply to:** End of `About.astro`, `Education.astro`, `Work.astro`, `Skills.astro`, `Projects.astro`, `Leadership.astro`. **NOT** Testimonials (last section, no trailing `<hr>` per CRA).
```astro
<hr class="m-0 border-black/10" />
```

The `border-black/10` utility is Pitfall A mitigation — Tailwind v4 `<hr>` defaults to `currentColor` which would render way darker than Bootstrap's `rgba(0,0,0,.1)`.

### Decorative-icon ARIA (applies to every `<Icon>` whose name is announced by sibling text)

**Source:** CLAUDE.md § 5 + CONTEXT.md D-20, D-26.
**Apply to:** Every `<Icon>` in `Skills.astro` (name appears below) and `About.astro` social row (name appears via aria-label on parent `<a>`).
```astro
<Icon name={...} aria-hidden="true" class="size-6" />
```

### `.text-primary` accent span (single-use carryover from CRA)

**Source:** `git show b537845:src/components/About.jsx` line 18-19.
**Apply to:** `About.astro` `<h1>` last_name only. Do not generalize.
```astro
<h1 class="mb-0">
    {about.first_name}{' '}<span class="text-primary">{about.last_name}</span>
</h1>
```

The `.text-primary` class is defined in `global.css` (see global.css pattern above) — it is NOT a Tailwind utility autogenerated from a `--color-primary` token (RESEARCH.md Open Question 4 — planner picked the explicit-class route per the existing CRA recognition).

---

## No Analog Found

None. Every Phase 3 file has at least one analog — either an existing on-disk file (Astro stubs / current config) or a pre-wipe CRA file (`b537845`) or a RESEARCH.md Pattern that synthesizes the Astro 6 idiom. The closest-to-novel work is the `IntersectionObserver` script (no analog in CRA — CRA used jQuery scroll-spy) and the stretched-link CSS pattern (Bootstrap's `.stretched-link` is the upstream reference; not used in pre-wipe CRA).

---

## Metadata

**Analog search scope:**
- `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/components/*.astro` — current Phase 1 stubs (8 files, all empty).
- `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/layouts/BaseLayout.astro`, `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/styles/global.css`, `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/pages/index.astro` — current Phase 1 scaffolding.
- `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/src/content.config.ts` + `src/content/{about,skills,links}.yaml` + `src/content/{projects,work,education,leadership,testimonials}/*/index.md` — Phase 2 typed data layer (shape consumed by Phase 3).
- `/Users/rashmilpanchani/Documents/Rashmil-1999.github.io/astro.config.mjs` + `package.json` — current build config and deps.
- `git show b537845:src/components/{About,Education,Work,Leadership,Projects,Skills,Testimonials,Navbar}.jsx` — pre-wipe CRA components (8 files, source of original markup shape).
- `git show b537845:src/App.css` — pre-wipe CRA stylesheet (10,567 lines, source of brand-token values per CONTEXT.md D-06 — RESEARCH.md already extracted the load-bearing values).
- RESEARCH.md `03-RESEARCH.md` § Architecture Patterns (Patterns 1-8, lines 354-948) — authoritative Astro 6 syntax for each new file.

**Files scanned:** 25
**Pattern extraction date:** 2026-05-27

---

## PATTERN MAPPING COMPLETE
