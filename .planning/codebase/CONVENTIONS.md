# Coding Conventions

**Analysis Date:** 2026-05-26

## Naming Patterns

**Files:**
- React components: `PascalCase.jsx` (e.g., `About.jsx`, `Navbar.jsx`, `Projects.jsx`, `Education.jsx`, `Work.jsx`, `Skills.jsx`, `Leadership.jsx`, `Testimonials.jsx`)
- Non-component JS/data files: `camelCase.js` or `camelCase.json` (e.g., `serviceWorker.js`, `setupTests.js`, `resumeData.json`)
- Entry / framework files: lowercase (e.g., `src/index.js`, `src/index.css`, `src/App.css`)
- Static assets: lowercase with underscores (e.g., `face_detection.png`, `profilepic.jpg`, `Rashmil_Panchani.pdf` is an exception preserving a proper name)

**Functions:**
- React function components: `PascalCase` declared as arrow functions assigned to a `const` (e.g., `const About = (props) => { ... }` in `src/components/About.jsx`)
- Non-component helpers / lifecycle handlers: `camelCase` (e.g., `register`, `unregister`, `registerValidSW`, `checkValidServiceWorker` in `src/serviceWorker.js`)
- Component aliases at import sites are allowed when the data model differs from the component name (e.g., `import Leaderships from "./components/Leadership"` in `src/index.js`)

**Variables:**
- Local variables and destructured props use `snake_case` mirroring the JSON data shape (e.g., `first_name`, `last_name`, `current_status`, `contact_message`, `resume_download`, `skill_array`, `image_map`, `image_style` in `src/components/About.jsx` and `src/components/Projects.jsx`)
- Loop indices use `id` rather than `i` or `index` (e.g., `projects.map((project, id) => ...)` in `src/components/Projects.jsx`)
- Module-scope constants use `camelCase` (e.g., `isLocalhost` in `src/serviceWorker.js`)

**Types:**
- No TypeScript in use; no PropTypes declared. Components rely on `props` shape via destructuring.

## Code Style

**Formatting:**
- No Prettier or `.prettierrc` config file present in the repo root.
- Observed conventions from source files:
  - 2-space indentation
  - Double-quoted strings in JSX/component files (`src/components/*.jsx`, `src/index.js`)
  - Single-quoted strings in framework files (`src/setupTests.js`, `src/serviceWorker.js` — inherited from Create React App)
  - Trailing commas in multi-line objects and arrays
  - Semicolons terminate statements

**Linting:**
- ESLint via Create React App preset, configured in `package.json`:
  ```json
  "eslintConfig": { "extends": "react-app" }
  ```
- No standalone `.eslintrc` file. Lint errors surface in the dev console during `yarn start` / `npm start`.
- One inline disable in use: `// eslint-disable-next-line import/no-unresolved` in `src/index.js` line 2 (suppresses the `react-dom/client` resolution warning).

## Import Organization

**Order observed across `src/index.js` and `src/components/*.jsx`:**
1. React core (`import React from "react";`, optionally with `StrictMode`, `Suspense`)
2. Third-party packages (`react-dom/client`, `react-scroll`)
3. CSS imports (`import "./App.css";`)
4. Local components (`import About from "./components/About";`)
5. Local data / assets (`import resume from "./resumeData.json";`, `import profilepic from "../assets/profilepic.jpg";`)
6. Service worker / utility imports last

Sections are typically separated by blank lines and a short comment header (e.g., `// CSS`, `// components import`, `// data import` in `src/index.js`).

**Path Aliases:**
- No path aliases configured. All local imports use relative paths (`./`, `../`).

## Error Handling

**Patterns:**
- Components contain no try/catch and no defensive prop checks; they assume `resumeData.json` is well-formed.
- Service worker (`src/serviceWorker.js`) uses promise chains with `.catch(error => console.error(...))` for SW registration failures (lines 96-98, 137-139).
- Offline detection logs via `console.log('No internet connection found. App is running in offline mode.')` (line 125-127).
- No global error boundary component is present.

## Logging

**Framework:** `console` only (no logger library).

**Patterns:**
- `console.log` for informational SW lifecycle messages (`src/serviceWorker.js` lines 44, 73, 85, 125).
- `console.error` for SW registration failures (`src/serviceWorker.js` lines 97, 138).
- No logging inside React components.

## Comments

**When to Comment:**
- JSX layout sections are annotated with HTML-style comments inside braces (e.g., `{/* <!-- Navigation --> */}`, `{/* <!-- About --> */}` in `src/index.js` lines 36-60).
- Service worker explains rationale in block comments at the top of the file and above conditional branches (`src/serviceWorker.js` lines 1-12, 26-32, 70-86).
- Components themselves are not commented; behavior is communicated by component and prop names.
- Commented-out imports are occasionally left in place (e.g., `// import eyantra from "../assets/eyantra.png";` in `src/components/Projects.jsx` line 6).

**JSDoc/TSDoc:**
- Not used anywhere in the codebase.

## Function Design

**Size:** Each component file holds a single component, typically 25-95 lines including JSX. The largest is `src/components/Projects.jsx` (95 lines), driven by an inline image-name-to-import map.

**Parameters:**
- Components receive a single `props` object and destructure within the function body, either at the top (e.g., `const { sections, links, name } = props;` in `src/components/Navbar.jsx`) or against a nested field (e.g., `const { first_name, last_name, ... } = props.about;` in `src/components/About.jsx`).
- Non-component functions take positional parameters with simple names (e.g., `register(config)`, `registerValidSW(swUrl, config)` in `src/serviceWorker.js`).

**Return Values:**
- Components return a single root `<div>` wrapper containing a `<section className="resume-section">` and a trailing `<hr className="m-0" />` (pattern seen in `About.jsx`, `Education.jsx`, `Work.jsx`, `Skills.jsx`, `Projects.jsx`, `Leadership.jsx`). `Testimonials.jsx` omits the `<hr/>` as the last section.
- Lifecycle helpers in `serviceWorker.js` return implicitly (`undefined`).

## Module Design

**Exports:**
- One default export per component file: `export default ComponentName;` at the bottom (e.g., `export default About;`).
- `src/serviceWorker.js` uses named exports (`export function register`, `export function unregister`).
- `src/index.js` has no exports; it is the application entry point.

**Barrel Files:**
- No `index.js` re-export barrel in `src/components/`. Each component is imported directly by file path from `src/index.js`.

## Component Patterns

**Structure of a typical component (mirror this for new sections):**
```jsx
import React from "react";

const SectionName = (props) => {
  const { items } = props;
  return (
    <div>
      <section className="resume-section" id="section-id">
        <div className="resume-section-content">
          <h2 className="mb-5">Section Title</h2>
          {items.map((item, id) => {
            return (
              <div key={id} /* ...layout classes... */>
                {/* item content */}
              </div>
            );
          })}
        </div>
      </section>
      <hr className="m-0" />
    </div>
  );
};

export default SectionName;
```

**Styling:**
- Bootstrap utility classes are used directly in JSX `className` strings (e.g., `mb-5`, `d-flex flex-column flex-md-row justify-content-between`, `col-md-4 text-center`).
- A single global stylesheet (`src/App.css`) is imported once from `src/index.js`. Components do not import their own CSS modules.
- Inline `style={{ ... }}` objects are used only when a value must be JS-driven (e.g., `image_style` in `src/components/Projects.jsx`).

**Keys in lists:**
- The list index is used as the `key`, named `id` (e.g., `<li key={id}>`). Exception: `src/components/About.jsx` uses `handle.name` as the social-link key.

## Data Flow

- All content lives in `src/resumeData.json` and is imported once in `src/index.js`.
- The top-level `App` destructures the JSON and passes named slices down as props to each section component.
- There is no `useState`, `useEffect`, `useContext`, or other hook usage in any component — the app is fully static after first render.

---

*Convention analysis: 2026-05-26*
