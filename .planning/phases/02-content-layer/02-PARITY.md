# Phase 2 Parity Verification (CONTENT-06)

**Diff performed:** 2026-05-27
**Source of truth:** `.planning/snapshots/m1-source/resumeData.json` (343 lines) + `.planning/snapshots/m1-source/assets/` (22 files)
**New tree:** `src/content/{about,skills,links}.yaml` + `src/content/{projects,work,education,leadership,testimonials}/<slug>/index.md` + `src/content/_orphans/` + `src/assets/profile.jpg`

**Claim under verification:** Every resume item in `.planning/snapshots/m1-source/resumeData.json` is reachable through the new Content Layer collections — zero data loss. Every divergence from the snapshot is documented and traced to a CONTEXT.md decision (`D-NN`) or RESEARCH.md Recipe (`R-NN`).

## Legend

| Status         | Meaning                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| `migrated`     | Field copied verbatim from snapshot to new location. No transformation applied.                                    |
| `transformed`  | Field migrated with a documented normalization (trim, case-fix, URL https-bump, mapping). Cites a `D-NN`.          |
| `synthesized`  | Field present in new tree but NOT in snapshot. Added by Phase 2 for schema/test compliance. Cites authorization.   |
| `orphan`       | Snapshot file (asset) with no entry-level reference; preserved under `src/content/_orphans/` per D-10.             |
| `dropped`      | Snapshot file deliberately NOT migrated; rationale cited (CONCERNS.md carry-forward).                              |

## TL;DR — Row Count Summary

| Status         | Count |
| -------------- | :---: |
| `migrated`     |  ~70  |
| `transformed`  |  ~14  |
| `synthesized`  |   4   |
| `orphan`       |   4   |
| `dropped`      |   1   |

**Verdict:** CONTENT-06 satisfied. Zero unexpected data loss. All transformations and additions are documented; every asset and every JSON path has a destination.

---

## Section 1: `about` (snapshot lines 2-22)

8 scalar fields + 2 social entries → `src/content/about.yaml`.

| Snapshot path                       | Snapshot value                                            | New destination                          | New value                                       | Status        | Citation                       |
| ----------------------------------- | --------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------- | ------------- | ------------------------------ |
| `about.first_name`                  | `"Rashmil "` (trailing space)                             | `about.yaml: about.first_name`           | `Rashmil`                                       | `transformed` | D-21 (trim normalization)      |
| `about.last_name`                   | `"Panchani"`                                              | `about.yaml: about.last_name`            | `Panchani`                                      | `migrated`    | —                              |
| `about.current_status`              | `"Undergraduate BE Computer Engineering @Dwarkadas J. Sanghvi College of Engineering"` | `about.yaml: about.current_status` | (verbatim)                                      | `migrated`    | —                              |
| `about.email`                       | `"rashmilp833@gmail.com"`                                 | `about.yaml: about.email`                | `rashmilp833@gmail.com`                         | `migrated`    | —                              |
| `about.contact_message`             | (full ~150 char message)                                  | `about.yaml: about.contact_message`      | (verbatim, incl. en-dashes + apostrophes)       | `migrated`    | D-22 (user voice preserved)    |
| `about.description`                 | (~600 char bio incl. `collegues`, `deveoped` typos)       | `about.yaml: about.description`          | (verbatim — typos preserved)                    | `migrated`    | D-22 (user voice preserved)    |
| `about.resume_download`             | `"Rashmil_Panchani.pdf"`                                  | `about.yaml: about.resume_download`      | `Rashmil_Panchani.pdf` (file in `public/`)      | `migrated`    | —                              |
| `about.social[0].name`              | `"LinkedIn"`                                              | `about.yaml: about.social[0].name`       | `LinkedIn`                                      | `migrated`    | —                              |
| `about.social[0].url`               | `"https://www.linkedin.com/in/rashmil-panchani-67587a14b/"` | `about.yaml: about.social[0].url`     | (verbatim)                                      | `migrated`    | —                              |
| `about.social[0].className`         | `"devicon-linkedin-plain colored"`                        | `about.yaml: about.social[0].icon`       | `simple-icons:linkedin`                         | `transformed` | D-17 + Recipe R7               |
| `about.social[1].name`              | `"Github"`                                                | `about.yaml: about.social[1].name`       | `Github`                                        | `migrated`    | —                              |
| `about.social[1].url`               | `"http://github.com/Rashmil-1999"`                        | `about.yaml: about.social[1].url`       | `https://github.com/Rashmil-1999`               | `transformed` | Plan 02-02 (defensive https normalization; PATTERNS.md L191) |
| `about.social[1].className`         | `"devicon-github-plain colored"`                          | `about.yaml: about.social[1].icon`       | `simple-icons:github`                           | `transformed` | D-17 + Recipe R7               |
| **(not in snapshot)**               | snapshot's profile pic was an asset file, not a JSON field | `about.yaml: about.profile_image`        | `~/assets/profile.jpg`                          | `synthesized` | D-11 (links the relocated binary; see Section 9) |

---

## Section 2: `sections[]` + `links[]` (snapshot lines 23-40)

Pitfall 19 collapse — parallel arrays joined into a single sorted collection. D-24 reconciliation applied.

| Snapshot path           | Snapshot value                                                                                       | New destination               | New value                                                            | Status        | Citation                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------- | ------------- | -------------------------------------------------------------- |
| `sections[]` + `links[]` | `["About", "Education", "Experience", "Skills", "Projects", "Leadership", "Testimonials"]` paired with `["#about", "#education", "#experience", "#skills", "#projects", "#leadership", "#testimonials"]` | `links.yaml` (7 entries)      | 7 entries with `{id, label, order}` triples, step-10 order (10..70)  | `transformed` | D-14 (parallel arrays collapsed to a single collection; Pitfall 19) |
| `sections[0]` + `links[0]` | `"About"` + `"#about"`                                                                            | `links.yaml[0]`               | `{ id: about, label: About, order: 10 }`                             | `migrated`    | —                                                              |
| `sections[1]` + `links[1]` | `"Education"` + `"#education"`                                                                    | `links.yaml[1]`               | `{ id: education, label: Education, order: 20 }`                     | `migrated`    | —                                                              |
| `sections[2]` + `links[2]` | `"Experience"` + `"#experience"`                                                                  | `links.yaml[2]`               | `{ id: work, label: Work, order: 30 }`                               | `transformed` | **D-24** (Experience→Work reconciliation to Phase 1 D-23 canonical `<Work>` stub) |
| `sections[3]` + `links[3]` | `"Skills"` + `"#skills"`                                                                          | `links.yaml[3]`               | `{ id: skills, label: Skills, order: 40 }`                           | `migrated`    | —                                                              |
| `sections[4]` + `links[4]` | `"Projects"` + `"#projects"`                                                                      | `links.yaml[4]`               | `{ id: projects, label: Projects, order: 50 }`                       | `migrated`    | —                                                              |
| `sections[5]` + `links[5]` | `"Leadership"` + `"#leadership"`                                                                  | `links.yaml[5]`               | `{ id: leadership, label: Leadership, order: 60 }`                   | `migrated`    | —                                                              |
| `sections[6]` + `links[6]` | `"Testimonials"` + `"#testimonials"`                                                              | `links.yaml[6]`               | `{ id: testimonials, label: Testimonials, order: 70 }`               | `migrated`    | —                                                              |

**Verification:** `grep '^- id: work' src/content/links.yaml` returns 1 match; `grep '^- id: experience' src/content/links.yaml` returns 0 matches. The `Experience` token does not appear anywhere in the 4 new YAML files (about/skills/links) or in any markdown frontmatter under `src/content/`.

---

## Section 3: `resumeData.education[]` (snapshot lines 42-61)

3 entries → `src/content/education/<slug>/index.md`. Casing preserved per D-22; bodies synthesized per D-20 + PATTERNS.md L390.

| Snapshot path                | Snapshot value                                                                                      | New destination                                                              | Status         | Citation                |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------- | ----------------------- |
| `education[0].name`          | `"DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING"` (ALL CAPS)                                          | `education/dj-sanghvi-college-of-engineering/index.md: name`                 | `migrated`     | D-22 (casing preserved) |
| `education[0].degree`        | `"Bachelors in Computer Engineering"`                                                               | same file: `degree`                                                          | `migrated`     | —                       |
| `education[0].graduated`     | `"August 2017 - May 2021"`                                                                          | same file: `graduated`                                                       | `migrated`     | —                       |
| `education[0].score`         | `"CGPA: 9.963 / 10"`                                                                                | same file: `score`                                                           | `migrated`     | —                       |
| **(no snapshot body)**       | —                                                                                                   | same file: body `"Bachelor's in Computer Engineering with a CGPA of 9.963 / 10."` | `synthesized` | D-20 + PATTERNS.md L390 (Plan 02-05) |
| `education[1].name`          | `"ST. Rocks College Of Science and Commerce"` (`ST.` casing + period)                               | `education/st-rocks-college-of-science-and-commerce/index.md: name`          | `migrated`     | D-22 (casing preserved) |
| `education[1].degree`        | `"HSC Maharashtra 11th-12th"`                                                                       | same file: `degree`                                                          | `migrated`     | —                       |
| `education[1].graduated`     | `"July 2015 - June 2017"`                                                                           | same file: `graduated`                                                       | `migrated`     | —                       |
| `education[1].score`         | `"Finals: 89.4% , JEE mains :22000 rank, JEE Advanced :7500 rank."` (irregular spacing)             | same file: `score`                                                           | `migrated`     | D-22 (verbatim spacing) |
| **(no snapshot body)**       | —                                                                                                   | same file: body `"Higher Secondary Certificate, Maharashtra Board, completed July 2015 - June 2017."` | `synthesized` | D-20 + PATTERNS.md L390 (Plan 02-05) |
| `education[2].name`          | `"ST. Francis School"`                                                                              | `education/st-francis-school/index.md: name`                                 | `migrated`     | D-22 (casing preserved) |
| `education[2].degree`        | `"ICSE Board"`                                                                                      | same file: `degree`                                                          | `migrated`     | —                       |
| `education[2].graduated`     | `"May 2015"`                                                                                        | same file: `graduated`                                                       | `migrated`     | —                       |
| `education[2].score`         | `"Finals: 92.5%"`                                                                                   | same file: `score`                                                           | `migrated`     | —                       |
| **(no snapshot body)**       | —                                                                                                   | same file: body `"ICSE Board schooling, graduated May 2015."`                | `synthesized` | D-20 + PATTERNS.md L390 (Plan 02-05) |

**Synthesized count: 3 education bodies.** All are one-sentence restatements of frontmatter fields (degree + score + dates); no invented claims, no fabricated content. Authorized by PATTERNS.md L390 to satisfy the D-20 body-non-emptiness gate enforced by Plan 02-06's Vitest assertion. Flagged here so the parity diff is honest about additions.

---

## Section 4: `resumeData.work[]` (snapshot lines 62-74)

2 entries → `src/content/work/<slug>/index.md`. Casing/punctuation preserved per D-22.

| Snapshot path           | Snapshot value                                                | New destination                                       | Status     | Citation                          |
| ----------------------- | ------------------------------------------------------------- | ----------------------------------------------------- | ---------- | --------------------------------- |
| `work[0].company`       | `"Phionike Solutions: Design-Tech Studio"`                    | `work/phionike-solutions/index.md: company`           | `migrated` | —                                 |
| `work[0].title`         | `"Research and Development Intern"`                           | same file: `title`                                    | `migrated` | —                                 |
| `work[0].duration`      | `"May 2019 - July 2019"`                                      | same file: `duration`                                 | `migrated` | —                                 |
| `work[0].description`   | (full ~700 char paragraph about VUI / Alexa skill / R&D dept) | same file: **body** (D-19 separation)                 | `migrated` | D-19 (long-form text in body)     |
| `work[1].company`       | `"peAR Technologies."` (lowercase `pe`, trailing period)      | `work/pear-technologies/index.md: company`            | `migrated` | D-22 (`peAR` casing + period preserved) |
| `work[1].title`         | `"Professional Photographer"`                                 | same file: `title`                                    | `migrated` | —                                 |
| `work[1].duration`      | `"January 2019 - February 2019"`                              | same file: `duration`                                 | `migrated` | —                                 |
| `work[1].description`   | (full ~400 char paragraph about food photography for AR app)  | same file: **body** (D-19 separation)                 | `migrated` | D-19 (long-form text in body)     |

---

## Section 5: `resumeData.skill_array[]` + `resumeData.skills{}` (snapshot lines 76-225)

D-15 collapse: snapshot's parallel `skill_array[]` (category labels) + `skills{}` (category→items map) joined into a single `skills.yaml: skills.categories[]` array preserving snapshot order. 30 items across 6 categories.

### Categories (D-15 collapse)

| Snapshot path                                        | New destination                              | Status     | Citation                       |
| ---------------------------------------------------- | -------------------------------------------- | ---------- | ------------------------------ |
| `skill_array[0]` + `skills["Programming Languages & Operating Systems"]` | `skills.yaml: categories[0] (order 10)` | `transformed` | D-15 (collapse)               |
| `skill_array[1]` + `skills["Database Technologies"]` | `skills.yaml: categories[1] (order 20)`      | `transformed` | D-15 (collapse)               |
| `skill_array[2]` + `skills["Web Development"]`       | `skills.yaml: categories[2] (order 30)`      | `transformed` | D-15 (collapse)               |
| `skill_array[3]` + `skills["Dev Ops"]`               | `skills.yaml: categories[3] (order 40)`      | `transformed` | D-15 (collapse)               |
| `skill_array[4]` + `skills["Tools and Frameworks"]`  | `skills.yaml: categories[4] (order 50)`      | `transformed` | D-15 (collapse)               |
| `skill_array[5]` + `skills["Version Control"]`       | `skills.yaml: categories[5] (order 60)`      | `transformed` | D-15 (collapse)               |

### Item-level migration (30 items × 2 fields = 60 cells)

For each item: `name` status `migrated` (or `transformed` for the single MySQL case), `class:` (CDN form) → `icon:` (Iconify identifier) status `transformed` per D-17 + Recipe R7.

| # | Category               | snapshot `name` → new `name`         | snapshot `class`/`data-icon` → new `icon`                                                              | name status      | icon status   |
| -:| ---------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------- | ---------------- | ------------- |
|  1 | Languages & OS         | `C` → `C`                            | `devicon-c-plain colored` → `devicon:c`                                                                  | `migrated`       | `transformed` |
|  2 | "                      | `C++` → `C++`                        | `devicon-cplusplus-plain colored` → `devicon:cplusplus`                                                  | `migrated`       | `transformed` |
|  3 | "                      | `Java` → `Java`                      | `devicon-java-plain colored` → `devicon:java`                                                            | `migrated`       | `transformed` |
|  4 | "                      | `Python` → `Python`                  | `devicon-python-plain colored` → `devicon:python`                                                        | `migrated`       | `transformed` |
|  5 | "                      | `Go` → `Go`                          | `devicon-go-plain colored` → `devicon:go`                                                                | `migrated`       | `transformed` |
|  6 | "                      | `Javascript` → `JavaScript`          | `devicon-javascript-plain colored` → `devicon:javascript`                                                | `transformed` (D-21 brand-case canonicalization: JS official brand is `JavaScript`) | `transformed` |
|  7 | "                      | `Windows` → `Windows`                | `devicon-windows8-original colored` → **`devicon:windows8`** (drop `-original`)                          | `migrated`       | `transformed` (D-17 correction #1) |
|  8 | "                      | `Linux` → `Linux`                    | `devicon-linux-plain colored` → `devicon:linux`                                                          | `migrated`       | `transformed` |
|  9 | "                      | `macOS` → `macOS`                    | `devicon-apple-original colored` → **`devicon:apple`** (drop `-original`)                                | `migrated`       | `transformed` (D-17 correction #2) |
| 10 | Database               | `My SQL` → `MySQL`                   | `devicon-mysql-plain colored` → `devicon:mysql`                                                          | `transformed` (D-17 — typo, not stylistic; Plan 02-02 documented) | `transformed` |
| 11 | "                      | `Postgre SQL` → `Postgre SQL`        | `devicon-postgresql-plain colored` → `devicon:postgresql`                                                | `migrated`       | `transformed` | D-22 (preserved verbatim — `# user voice preserved per D-22`) |
| 12 | "                      | `MongoDB` → `MongoDB`                | `devicon-mongodb-plain colored` → `devicon:mongodb`                                                      | `migrated`       | `transformed` |
| 13 | "                      | `Redis` → `Redis`                    | `devicon-redis-plain colored` → `devicon:redis`                                                          | `migrated`       | `transformed` |
| 14 | "                      | `GraphQL` → `GraphQL`                | `iconify` + `data-icon: logos:graphql` → `logos:graphql`                                                 | `migrated`       | `migrated`    |
| 15 | Web Dev                | `HTML5` → `HTML5`                    | `devicon-html5-plain colored` → `devicon:html5`                                                          | `migrated`       | `transformed` |
| 16 | "                      | `CSS3` → `CSS3`                      | `devicon-css3-plain colored` → `devicon:css3`                                                            | `migrated`       | `transformed` |
| 17 | "                      | `Django` → `Django`                  | `devicon-django-plain colored` → **`simple-icons:django`** (`devicon:django` does not exist on Iconify)  | `migrated`       | `transformed` (D-17 correction #3) |
| 18 | "                      | `NodeJS` → `NodeJS`                  | `devicon-nodejs-plain-wordmark colored` → **`devicon:nodejs`** (drop `-plain-wordmark`)                  | `migrated`       | `transformed` (D-17 correction #4) |
| 19 | "                      | `ReactJS` → `ReactJS`                | `devicon-react-original colored` → **`devicon:react`** (drop `-original`)                                | `migrated`       | `transformed` (D-17 correction #5) |
| 20 | "                      | `Bootstrap` → `Bootstrap`            | `devicon-bootstrap-plain colored` → `devicon:bootstrap`                                                  | `migrated`       | `transformed` |
| 21 | Dev Ops                | `Heroku` → `Heroku`                  | `devicon-heroku-plain colored` → `devicon:heroku`                                                        | `migrated`       | `transformed` |
| 22 | "                      | `AWS` → `AWS`                        | `devicon-amazonwebservices-original colored` → **`devicon:amazonwebservices`** (drop `-original`)        | `migrated`       | `transformed` (D-17 correction #6) |
| 23 | "                      | `Google Cloud Platform`              | `iconify` + `data-icon: logos-google-cloud-platform` → `logos:google-cloud`                              | `migrated`       | `transformed` (D-17 canonical id) |
| 24 | Tools & Frameworks     | `NumPy` → `NumPy`                    | `iconify` + `bx:bx-code-alt` (generic placeholder) → `simple-icons:numpy`                                | `migrated`       | `transformed` (D-17 brand glyph) |
| 25 | "                      | `Pandas` → `Pandas`                  | `iconify` + `bx:bx-code-alt` → `simple-icons:pandas`                                                     | `migrated`       | `transformed` (D-17 brand glyph) |
| 26 | "                      | `Tensorflow` → `Tensorflow`          | `iconify` + `bx:bx-code-alt` → `simple-icons:tensorflow`                                                 | `migrated`       | `transformed` | D-22 (snapshot casing preserved in skills.yaml; **distinct** from project tech_stack which canonicalized to `TensorFlow` per D-21 — see Section 6) |
| 27 | "                      | `Keras` → `Keras`                    | `iconify` + `bx:bx-code-alt` → `simple-icons:keras`                                                      | `migrated`       | `transformed` (D-17 brand glyph) |
| 28 | "                      | `NLTK` → `NLTK`                      | `iconify` + `bx:bx-code-alt` → `lucide:code` (placeholder; no NLTK brand glyph in any Iconify set)       | `migrated`       | `transformed` (D-17 — documented placeholder, accepted shortcoming) |
| 29 | "                      | `OpenCV` → `OpenCV`                  | `iconify` + `bx:bx-code-alt` → `simple-icons:opencv`                                                     | `migrated`       | `transformed` (D-17 brand glyph) |
| 30 | Version Control        | `Git` → `Git`                        | `devicon-git-plain colored` → `devicon:git`                                                              | `migrated`       | `transformed` |

### Iconify mapping audit — corrections applied (D-17)

Per RESEARCH.md Recipe R7. These corrections were necessary because the snapshot's `className` strings were CDN form (Devicon CSS classes) and required mapping to canonical Iconify `prefix:name` identifiers verified against the live Iconify API on 2026-05-26.

| # | Snapshot class                              | Naive Iconify guess           | Corrected to                       | Reason                                                  |
| -:| ------------------------------------------- | ----------------------------- | ---------------------------------- | ------------------------------------------------------- |
| 1 | `devicon-windows8-original colored`         | `devicon:windows8-original`   | `devicon:windows8`                 | Iconify drops the `-original` suffix                    |
| 2 | `devicon-apple-original colored`            | `devicon:apple-original`      | `devicon:apple`                    | Iconify drops the `-original` suffix                    |
| 3 | `devicon-django-plain colored`              | `devicon:django`              | `simple-icons:django`              | `devicon:django` does not exist; use Simple Icons brand |
| 4 | `devicon-nodejs-plain-wordmark colored`     | `devicon:nodejs-plain-wordmark` | `devicon:nodejs`                 | Iconify drops `-plain-wordmark`; canonical is wordmark-less |
| 5 | `devicon-react-original colored`            | `devicon:react-original`      | `devicon:react`                    | Iconify drops the `-original` suffix                    |
| 6 | `devicon-amazonwebservices-original colored` | `devicon:amazonwebservices-original` | `devicon:amazonwebservices` | Iconify drops the `-original` suffix                    |

5 brand-glyph mappings from `bx:bx-code-alt` placeholder data-icons → `simple-icons:<name>` (NumPy, Pandas, TensorFlow, Keras, OpenCV). 1 placeholder retained: `NLTK` → `lucide:code` (no NLTK brand glyph exists in any Iconify pack — accepted shortcoming documented in Plan 02-02 SUMMARY).

---

## Section 6: `projects[]` (snapshot lines 227-326)

13 entries → `src/content/projects/<slug>/index.md` (one per project) + colocated images (covered in Section 9).

| # | Snapshot `title` (verbatim)                                                              | Slug                                       | order | Status     | Notable                                          |
| -:| ----------------------------------------------------------------------------------------- | ------------------------------------------ | :---: | ---------- | ------------------------------------------------ |
|  1 | `Face Detection`                                                                          | `face-detection`                           |  10   | `migrated` | tech_stack: `Numpy`→`NumPy`, `Tensorflow`→`TensorFlow` transformed (D-21) |
|  2 | `Emotion Recognizer`                                                                      | `emotion-recognizer`                       |  20   | `migrated` | tech_stack: same D-21 fixes                       |
|  3 | `American Sign Language Detection`                                                        | `american-sign-language-detection`         |  30   | `migrated` | tech_stack: same D-21 fixes                       |
|  4 | `Age Of Warring Empire tower bot`                                                         | `age-of-warring-empire-tower-bot`          |  40   | `migrated` | body contains `50*10` → Prettier-escaped `50\*10` (Plan 02-04 deviation; no semantic change) |
|  5 | `Smart India Hackathon - Attention Span detection and detailed analysis of Dialogue.` (trailing period) | `smart-india-hackathon`         |  50   | `migrated` | D-22 (title period preserved); D-21 tech_stack   |
|  6 | `E - Yantra Competition (Theme - Nutty Squirrel)`                                         | `e-yantra-competition`                     |  60   | `migrated` | `Embedded - C` quoted in YAML (colon-following-hyphen); **alternates wired** (D-07) |
|  7 | `Garduino - Smart Garden`                                                                 | `garduino-smart-garden`                    |  70   | `migrated` | **D-09: image renamed** `graduino.png` → `garduino.png` |
|  8 | `Stack Overflow Chatbot`                                                                  | `stack-overflow-chatbot`                   |  80   | `migrated` | tech_stack: `pandas` + `sklearn` preserved lowercase (D-21 selective — package canonical names); `numpy`→`NumPy` |
|  9 | `Twitter Named Entity Recognition`                                                        | `twitter-named-entity-recognition`         |  90   | `migrated` | tech_stack D-21 fixes                             |
| 10 | `Library Attendance Manager`                                                              | `library-attendance-manager`               | 100   | `migrated` | tech_stack `SQLlite` typo **preserved** (D-22 user voice); `Hardware: Barcode Scanner` quoted (YAML colon) |
| 11 | `DJ Archive`                                                                              | `dj-archive`                               | 110   | `migrated` | **alternates wired** (D-07) — 3 image variants    |
| 12 | `College - Event Manager App`                                                             | `college-event-manager-app`                | 120   | `migrated` | tech_stack: `React`/`Django` migrated verbatim    |
| 13 | `Resume Website`                                                                          | `resume-website`                           | 130   | `migrated` | —                                                |

### tech_stack casing transforms (D-21 lossless canonicalization, Plan 02-04)

| Snapshot token   | New token     | Entries affected (count) | Rule                                                                                              |
| ---------------- | ------------- | :----------------------: | ------------------------------------------------------------------------------------------------- |
| `Numpy` / `numpy` | `NumPy`      | 6 entries (#1-3, 5, 8-9) | D-21 lossless canonicalization (PATTERNS.md L325 pre-approval — official brand is `NumPy`)        |
| `Tensorflow`     | `TensorFlow` | 5 entries (#1-3, 8-9)    | D-21 lossless canonicalization (official brand `TensorFlow`)                                      |
| `pandas`         | `pandas`     | 1 entry (#8)             | D-21 selective preservation — `pandas` IS the canonical package name (lowercase `import pandas`)  |
| `sklearn`        | `sklearn`    | 1 entry (#8)             | D-21 selective preservation — `sklearn` IS the canonical package name                             |
| `SQLlite`        | `SQLlite`    | 1 entry (#10)            | D-22 user voice preserved (author misspelling kept verbatim — distinct from D-21 brand fixes)     |

**Note:** The `skills.yaml` field for TensorFlow keeps the snapshot's `Tensorflow` casing per D-22 (verbatim user voice in singleton — see Section 5 row #26), while `projects/*/index.md` tech_stack canonicalizes to `TensorFlow` per D-21 (brand-case in arrays). The two are different fields with different decisions; this divergence is intentional and traced.

### Project descriptions (snapshot `description` → body — D-19)

All 13 snapshot `description` strings are migrated verbatim to the markdown body of each entry per D-19 (long-form text in body, structured fields in frontmatter). The single mechanical transformation is the Prettier-applied `*` → `\*` escape in entry #4 (no semantic/rendered-output change).

### Project URLs (snapshot `url` → frontmatter)

All 13 snapshot `url` values migrated verbatim (all are `https://github.com/...` already; no http→https bump needed in this collection).

### Multi-variant alternates wiring (D-07)

| Project                | Snapshot image references          | cover (frontmatter)         | alternates (frontmatter)            | Citation |
| ---------------------- | ---------------------------------- | --------------------------- | ----------------------------------- | -------- |
| `e-yantra-competition` | `eyantra` (snapshot) → 2 assets    | `./eyantra.jpg`             | `./eyantra.png`                     | D-07     |
| `dj-archive`           | `archive` (snapshot) → 3 assets    | `./archive.jpeg`            | `./archive.jpg`, `./archive.png`    | D-07     |

---

## Section 7: `testimonials[]` (snapshot lines 328-333)

1 entry → `src/content/testimonials/<slug>/index.md`. User/role/org split applied per RESEARCH.md L673-679.

| Snapshot path          | Snapshot value                                                                                  | New destination                                  | Status        | Citation                       |
| ---------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------- | ------------------------------ |
| `testimonials[0].text` | (~250 char quote about R&D + Alexa skill + team play)                                           | `testimonials/roopam-mishra/index.md`: **body**  | `migrated`    | D-19 (long-form text in body)  |
| `testimonials[0].user` | `"Roopam Mishra, Founder of Phionike Solutions: Design-Tech Studio."` (single concatenated string with trailing period) | same file: `user: Roopam Mishra`         | `transformed` | **user-role-org split** (RESEARCH.md L673-679 + PATTERNS.md L437) |
| `testimonials[0].user` (split) | (continued)                                                                              | same file: `role: Founder`                       | `transformed` | user-role-org split            |
| `testimonials[0].user` (split) | (continued)                                                                              | same file: `org: Phionike Solutions: Design-Tech Studio` (trailing period dropped — terminated joined sentence, not org name) | `transformed` | user-role-org split — matches snapshot `work[0].company` spelling (no trailing period) |

**Decomposition rationale (Plan 02-05):** The snapshot's joined `user` field was a single sentence-form string. Splitting into three schema fields (`user` / `role` / `org`) preserves all information and aligns with the testimonials schema in Plan 02-01. The trailing period belonged to the joined sentence-terminator, not to the org name; matches the `work[0].company` value which never had a trailing period in the snapshot.

---

## Section 8: `leaderships[]` (snapshot lines 334-341)

1 entry → `src/content/leadership/<slug>/index.md`. Note snapshot key is plural `leaderships` (snapshot quirk); new collection is singular `leadership` (schema canonical per Plan 02-01 D-14/D-15 reconciliation).

| Snapshot path                | Snapshot value                                          | New destination                              | Status     | Citation |
| ---------------------------- | ------------------------------------------------------- | -------------------------------------------- | ---------- | -------- |
| `leaderships[0].org`         | `"DJ Unicode"`                                          | `leadership/dj-unicode/index.md: org`        | `migrated` | —        |
| `leaderships[0].title`       | `"Full Stack Mentor & Events Head"`                     | same file: `title`                           | `migrated` | —        |
| `leaderships[0].duration`    | `"August 2018 - Present"`                               | same file: `duration`                        | `migrated` | —        |
| `leaderships[0].description` | (~830 char paragraph on DJ Unicode mentorship, DJ Archive lead, workshops, 45→70 dev growth) | same file: **body** (D-19) | `migrated` | D-19     |

---

## Section 9: Snapshot `assets/` directory (22 files)

Every asset accounted for. 16 migrated to project directories, 4 to `_orphans/`, 1 to `src/assets/`, 1 dropped.

### Migrated to `src/content/projects/<slug>/` (16 files)

| Snapshot file              | Size  | Destination                                                                  | Status        | Citation                          |
| -------------------------- | :---: | ---------------------------------------------------------------------------- | ------------- | --------------------------------- |
| `face_detection.png`       | 5.9 KB | `src/content/projects/face-detection/face_detection.png`                     | `migrated`    | D-08 (verbatim filename)          |
| `emotion_recognition.png`  | 23 KB | `src/content/projects/emotion-recognizer/emotion_recognition.png`            | `migrated`    | D-08                              |
| `asl.png`                  | 85 KB | `src/content/projects/american-sign-language-detection/asl.png`              | `migrated`    | D-08                              |
| `aowe.jpg`                 | 190 KB | `src/content/projects/age-of-warring-empire-tower-bot/aowe.jpg`              | `migrated`    | D-08                              |
| `SIH.png`                  | 62 KB | `src/content/projects/smart-india-hackathon/SIH.png`                         | `migrated`    | D-08 (uppercase casing preserved) |
| `eyantra.jpg`              | 103 KB | `src/content/projects/e-yantra-competition/eyantra.jpg`                      | `migrated`    | D-08 (cover variant)              |
| `eyantra.png`              | 3.8 KB | `src/content/projects/e-yantra-competition/eyantra.png`                      | `migrated`    | D-08 + D-07 (alternate variant)   |
| `graduino.png`             | 37 KB | `src/content/projects/garduino-smart-garden/garduino.png`                    | `transformed` | **D-09** (sole filename change: typo→correct spelling) |
| `chatbot.png`              | 241 KB | `src/content/projects/stack-overflow-chatbot/chatbot.png`                    | `migrated`    | D-08                              |
| `ner.png`                  | 97 KB | `src/content/projects/twitter-named-entity-recognition/ner.png`              | `migrated`    | D-08                              |
| `library.png`              | 6.1 KB | `src/content/projects/library-attendance-manager/library.png`                | `migrated`    | D-08                              |
| `archive.jpeg`             | 110 KB | `src/content/projects/dj-archive/archive.jpeg`                               | `migrated`    | D-08 + D-07 (cover variant)       |
| `archive.jpg`              | 23 KB | `src/content/projects/dj-archive/archive.jpg`                                | `migrated`    | D-08 + D-07 (alternate variant)   |
| `archive.png`              | 368 KB | `src/content/projects/dj-archive/archive.png`                                | `migrated`    | D-08 + D-07 (alternate variant)   |
| `event.png`                | 32 KB | `src/content/projects/college-event-manager-app/event.png`                   | `migrated`    | D-08                              |
| `resume.png`               | 622 KB | `src/content/projects/resume-website/resume.png`                             | `migrated`    | D-08                              |

### Orphan to `src/content/_orphans/` (4 files — D-10)

No snapshot project ever referenced these images (no `image` field in `projects[].image` maps to them). Preserved per D-10 to retain snapshot-archive fidelity; invisible to every collection's `glob` because `_orphans/` has no schema base in `src/content.config.ts`.

| Snapshot file        | Size   | Destination                                  | Status   | Citation     |
| -------------------- | :----: | -------------------------------------------- | -------- | ------------ |
| `attendance.png`     | 110 KB | `src/content/_orphans/attendance.png`        | `orphan` | D-10         |
| `attendance.webp`    | 12 KB  | `src/content/_orphans/attendance.webp`       | `orphan` | D-10         |
| `attendance1.png`    | 747 KB | `src/content/_orphans/attendance1.png`       | `orphan` | D-10         |
| `smgarden.png`       | 42 KB  | `src/content/_orphans/smgarden.png`          | `orphan` | D-10 (snapshot Garduino references `graduino.png`, NOT `smgarden.png`) |

### Special — profile picture relocation (1 file — D-11)

| Snapshot file        | Size   | Destination                  | Status        | Citation                                      |
| -------------------- | :----: | ---------------------------- | ------------- | --------------------------------------------- |
| `profilepic.jpg`     | 1.0 MB (1,037,392 bytes byte-identical) | `src/assets/profile.jpg` | `transformed` | **D-11** (relocate to `src/assets/` + rename for Astro `image()` import convention) |

### Dropped — intentional non-migration (1 file)

| Snapshot file | Size  | Destination | Status    | Citation                                                                                       |
| ------------- | :---: | ----------- | --------- | ---------------------------------------------------------------------------------------------- |
| `emotion.png` | 4.8 MB | **(not copied)** | `dropped` | CONCERNS.md carry-forward — 4.8 MB unoptimized PNG is build-bloat; the 23 KB `emotion_recognition.png` IS the cover for `emotion-recognizer/`. Snapshot retained for archive; new tree intentionally omits. |

**Asset accounting:** 16 migrated to projects + 4 orphans + 1 relocated profile + 1 dropped = 22 = snapshot total. Zero unaccounted files.

---

## Section 10: Acceptable-loss inventory (full enumeration)

Per `must_haves.truths` in the plan frontmatter — these are the only losses/additions in the entire migration; every one is authorized.

### Losses (data NOT in new tree that WAS in snapshot)

1. **Trailing space on `about.first_name`** — `"Rashmil "` → `"Rashmil"`. Authorized by D-21 (`trimmedString` helper invocations). Not a data loss; a normalization.
2. **`emotion.png` 4.8 MB PNG asset** — deliberately not copied (build-bloat). Authorized by CONCERNS.md carry-forward. The 23 KB `emotion_recognition.png` is the active cover for the `emotion-recognizer` project.

### Transformations (data SHAPE changed; semantics preserved)

3. **`http://github.com` → `https://github.com`** (about.social[1].url) — authorized by Plan 02-02 (defensive URL normalization; PATTERNS.md L191).
4. **`graduino.png` → `garduino.png`** (typo fix on filename) — authorized by D-09. Sole filename change in the entire migration.
5. **`My SQL` → `MySQL`** (skills.yaml database first item) — authorized by D-17 (typo, not stylistic; RESEARCH.md L792 + PATTERNS.md L221; documented as a Plan 02-02 conflict resolution).
6. **`Numpy` → `NumPy`** in 6 project tech_stack arrays — authorized by D-21 + PATTERNS.md L325 (lossless brand-case canonicalization). `Tensorflow` → `TensorFlow` likewise in 5 projects.
7. **`Javascript` → `JavaScript`** in skills.yaml — authorized by D-21 (brand case).
8. **30× Iconify identifier transforms** — every snapshot `className: "devicon-*-* colored"` or `data-icon: bx:bx-code-alt` → canonical Iconify `prefix:name` form. Authorized by D-17 + Recipe R7 (verified against live Iconify API 2026-05-26).
9. **`Experience` / `#experience` → `id: work` / `label: Work`** (links.yaml) — authorized by D-24 (reconciliation to Phase 1 D-23 canonical `Work.astro` stub).
10. **`sections[]` + `links[]` parallel arrays → `links.yaml` single collection** — authorized by D-14 (Pitfall 19 collapse).
11. **`skill_array[]` + `skills{}` parallel structures → `skills.yaml: categories[]` ordered array** — authorized by D-15.
12. **`testimonials[0].user` joined string → `user` + `role` + `org` triple** — authorized by RESEARCH.md L673-679 + PATTERNS.md L437.
13. **`leaderships[]` (plural snapshot key) → `leadership/` (singular collection name)** — authorized by Plan 02-01 D-14/D-15 schema canonical naming.
14. **`projects[].image: "<stem>"` (no extension) → `projects/<slug>/index.md: cover: ./<stem>.<ext>`** (image() schema resolution) — authorized by D-08 + Recipe R5 (per-slug colocation kills the `image_map` anti-pattern).
15. **`projects[].description` → markdown body** + **`work[].description` → markdown body** + **`leaderships[0].description` → markdown body** + **`testimonials[0].text` → markdown body** — authorized by D-19 (long-form text in body; structured fields in frontmatter).
16. **Prettier YAML single-quote normalization** (about/skills/links/all frontmatter) — semantic-equivalent reformatting only; not a content change.
17. **Prettier markdown `*` → `\*` escape** in `age-of-warring-empire-tower-bot/index.md` body — no rendered-output change.

### Additions (data in new tree that was NOT in snapshot)

18. **`about.yaml: about.profile_image: ~/assets/profile.jpg`** — synthesized field linking the relocated binary. Snapshot's profile picture was a raw asset reference (`<img src=".../profilepic.jpg">`), not a JSON field. Authorized by D-11.
19. **3 synthesized one-sentence education bodies** — restatements of frontmatter (degree + CGPA + dates / board + dates / board + grad year). Authorized by D-20 + PATTERNS.md L390. No invented claims, no fabricated content.
20. **Step-10 `order` integers across all 7 link entries + 6 skills categories + 13 projects + 2 work + 3 education + 1 leadership + 1 testimonial** — synthesized field for deterministic display order. Snapshot relied on JSON array order (implicit). Authorized by D-04 (sparse step-10 numbering for insert-friendly ordering).
21. **`draft: false` (defaulted) on every list-collection entry** — schema default per D-05; not authored in any entry (the field is invisible in markdown frontmatter but is set by the schema's `.default(false)` and consumed by Phase 3's Recipe R8 PROD filter).

**4 synthesized rows** (= 1 profile_image + 3 education bodies) flagged explicitly. **Note:** items 20-21 are *schema-mandated structural fields*, not content additions — they don't add author intent, they make implicit JSON-array order explicit and machine-readable. The TL;DR `synthesized: 4` count tracks only the content additions; the structural fields are not content losses or content additions in the parity sense.

---

## Section 11: Decision-ID coverage cross-check

| Decision ID | Appears in PARITY.md? | Section(s)                                              |
| ----------- | :-------------------: | ------------------------------------------------------- |
| D-04        | yes                   | Section 10 (#20)                                        |
| D-05        | yes                   | Section 10 (#21)                                        |
| D-07        | yes                   | Section 6 (multi-variant), Section 9 (alternates)       |
| D-08        | yes                   | Section 9 (verbatim filenames)                          |
| **D-09**    | yes                   | Section 6 (Garduino), Section 9 (graduino→garduino), Section 10 (#4) |
| D-10        | yes                   | Section 9 (orphans)                                     |
| **D-11**    | yes                   | Section 1 (synthesized profile_image), Section 9 (profilepic→profile), Section 10 (#18) |
| D-14        | yes                   | Section 2 (links collapse), Section 10 (#10)            |
| D-15        | yes                   | Section 5 (skills collapse), Section 10 (#11)           |
| D-16        | implicit via D-17     | (Iconify regex shape — every D-17 id satisfies D-16)    |
| **D-17**    | yes                   | Section 1 (social icons), Section 5 (all 30 items + 6 corrections), Section 10 (#5, #8) |
| D-19        | yes                   | Section 4 (work bodies), Section 6 (project bodies), Section 7 (testimonial body), Section 8 (leadership body), Section 10 (#15) |
| D-20        | yes                   | Section 3 (synthesized education bodies), Section 10 (#19) |
| **D-21**    | yes                   | Section 1 (first_name trim), Section 5 (JavaScript case), Section 6 (tech_stack NumPy/TensorFlow), Section 10 (#1, #6, #7) |
| **D-22**    | yes                   | Section 1 (description typos), Section 3 (school casing), Section 4 (peAR Technologies.), Section 5 (Postgre SQL, Tensorflow), Section 6 (SQLlite, SIH trailing period) |
| **D-24**    | yes                   | Section 2 (Experience→Work), Section 10 (#9)            |

**6 distinct D-IDs explicitly cited:** D-09, D-11, D-17, D-21, D-22, D-24 — meets the plan's acceptance criterion (at least 5).

---

## Footer — CONTENT-06 Verdict

### Counts by status (final tally)

| Status         | Count (rows in PARITY.md tables) |
| -------------- | :------------------------------: |
| `migrated`     | ~70 (full enumeration above)     |
| `transformed`  | ~14 (every one cites a `D-NN`)   |
| `synthesized`  |    4 (1 profile_image + 3 education bodies) |
| `orphan`       |    4 (attendance.png/webp/1.png + smgarden.png) |
| `dropped`      |    1 (`emotion.png` 4.8 MB)      |

### Verdict

**CONTENT-06 satisfied: zero unexpected data loss.** Every snapshot key is reachable through the new Content Layer collections. Every transformation cites a CONTEXT.md `D-NN` decision or a RESEARCH.md `R-NN` recipe. Every addition is documented and authorized. Every orphan file is preserved verbatim in `src/content/_orphans/`. The single dropped file (`emotion.png` at 4.8 MB) is explicitly authorized by CONCERNS.md carry-forward, and its smaller sibling (`emotion_recognition.png`) is the active cover.

Phase 5 will reference this artifact when deciding to delete the snapshot at `.planning/snapshots/m1-source/`. If Phase 5 chooses to delete the snapshot, this PARITY.md serves as the durable record of what existed and where every byte went.

---

*Phase: 02-content-layer · Plan: 07 · Task: 1 · Authored: 2026-05-27*
