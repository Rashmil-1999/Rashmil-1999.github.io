# Testing Patterns

**Analysis Date:** 2026-05-26

## Test Framework

**Runner:**
- Jest (bundled with `react-scripts` 5.0.1 — no explicit `jest` entry in `package.json` dependencies).
- Config: none. No `jest.config.js`, `jest.config.ts`, or `jest` key in `package.json`. Jest runs with the Create React App defaults.

**Assertion Library:**
- Jest built-in `expect` matchers.
- Extended with `@testing-library/jest-dom` (custom DOM matchers like `toHaveTextContent`, `toBeInTheDocument`) — imported in `src/setupTests.js`:
  ```js
  import '@testing-library/jest-dom/extend-expect';
  ```
- `@testing-library/react` is the expected component rendering library under CRA, but no rendering helpers are currently invoked anywhere in `src/`.

**Run Commands:**
```bash
yarn test              # Interactive watch mode (CRA default)
npm test               # Same as above
CI=true yarn test      # Single run, no watch (CI-friendly)
yarn test --coverage   # Run with coverage report
```

Defined in `package.json`:
```json
"scripts": {
  "test": "react-scripts test"
}
```

## Test File Organization

**Location:**
- No test files currently exist in the repository (the legacy `src/App.test.js` was deleted; see git status).
- The CRA convention — which this project should follow when tests are added — is co-located test files: `Component.jsx` alongside `Component.test.jsx` (or `Component.test.js`) in the same directory.

**Naming:**
- Use `<ComponentName>.test.jsx` for component tests (matches the `.jsx` extension used by source files in `src/components/`).
- Use `<moduleName>.test.js` for plain-JS utility tests (e.g., a future `serviceWorker.test.js`).

**Structure:**
```
src/
├── components/
│   ├── About.jsx
│   ├── About.test.jsx        # co-located test (to be added)
│   ├── Navbar.jsx
│   └── Navbar.test.jsx
├── setupTests.js             # Global jest-dom setup (already present)
└── ...
```

CRA's default Jest config auto-discovers any file matching `*.test.{js,jsx,ts,tsx}` or `*.spec.{js,jsx,ts,tsx}` inside `src/`, plus anything under `src/__tests__/`.

## Test Structure

**Suite Organization:**

No tests exist today. The CRA + React Testing Library idiom to follow when adding tests:

```jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import About from "./About";

describe("About", () => {
  const aboutProps = {
    first_name: "Rashmil ",
    last_name: "Panchani",
    current_status: "Undergraduate",
    contact_message: "Reach out",
    email: "test@example.com",
    description: "...",
    resume_download: "Rashmil_Panchani.pdf",
    social: [],
  };

  it("renders the full name", () => {
    render(<About about={aboutProps} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Rashmil Panchani"
    );
  });
});
```

**Patterns to apply:**
- Setup: build a typed-shape prop object once per `describe` block; the JSON shape in `src/resumeData.json` is the source of truth.
- Teardown: not required — React Testing Library auto-cleans the DOM between tests when `setupTests.js` imports `@testing-library/jest-dom/extend-expect` under CRA's preset.
- Assertions: prefer accessibility queries (`getByRole`, `getByText`, `getByLabelText`) over CSS-selector queries.

## Mocking

**Framework:** Jest built-ins (`jest.fn()`, `jest.mock()`).

**Patterns to apply when tests are added:**
```js
// Mock the static JSON to keep component tests deterministic
jest.mock("./resumeData.json", () => ({
  about: { /* fixture */ },
  sections: [],
  links: [],
  resumeData: { education: [], work: [], skills: {}, skill_array: [] },
  projects: [],
  leaderships: [],
  testimonials: [],
}));

// Mock react-scroll for Navbar tests
jest.mock("react-scroll", () => ({
  Link: ({ children }) => children,
  animateScroll: { scrollTo: jest.fn() },
}));
```

**What to Mock:**
- External browser APIs touched by `src/serviceWorker.js` (`navigator.serviceWorker`, `window.location`, `fetch`) when writing SW-registration tests.
- Image asset imports in component tests — CRA's Jest transform already stubs static file imports (`*.png`, `*.jpg`, `*.svg`) via `jest-transform-stub`/CRA's `fileTransform.js`, so no manual mocking is needed for the images used in `src/components/Projects.jsx`.
- `react-scroll` `Link`/`animateScroll` interactions in `src/components/Navbar.jsx` if testing navigation behavior.

**What NOT to Mock:**
- React itself.
- `@testing-library/react` rendering primitives.
- Pure presentational children — render them and assert on the resulting DOM rather than mocking child components.

## Fixtures and Factories

**Test Data:**
- No fixtures directory exists today. `src/resumeData.json` is the live data file used by the app.
- Recommended pattern when tests are added: inline fixture objects per `describe` block, shaped to the slice of `resumeData.json` the component consumes. Example for `Projects`:
  ```js
  const projectsFixture = [
    {
      title: "Sample",
      url: "https://example.com",
      description: "...",
      image: "resume",            // must match a key in image_map
      tech_stack: ["React"],
    },
  ];
  ```

**Location:**
- If shared fixtures become necessary, place them under `src/__fixtures__/` or `src/test-utils/` and import explicitly. None exist yet.

## Coverage

**Requirements:** None enforced. No `coverageThreshold` is configured (no Jest config file exists).

**View Coverage:**
```bash
yarn test --coverage --watchAll=false
```
The CRA preset writes an HTML report to `coverage/lcov-report/index.html`.

## Test Types

**Unit Tests:**
- Scope: individual presentational components in `src/components/*.jsx` rendered with `@testing-library/react`. Assert that data from props lands in the DOM.

**Integration Tests:**
- Scope: render the full `App` component from `src/index.js` against a fixture of `resumeData.json` and assert that all sections (About, Education, Work, Skills, Projects, Leadership, Testimonials) mount without throwing.

**E2E Tests:**
- Not used. No Cypress, Playwright, or Selenium configuration in the repo.

## Common Patterns

**Async Testing:**
- Not currently required — the app has no `useEffect`, network calls, or promises in the component tree. For the service worker, use:
  ```js
  await waitFor(() => expect(navigator.serviceWorker.register).toHaveBeenCalled());
  ```

**Error Testing:**
- No error paths in components. For `src/serviceWorker.js`, simulate a rejected `register()` and assert `console.error` was called:
  ```js
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  // ...trigger SW registration with a failing mock...
  expect(errorSpy).toHaveBeenCalled();
  errorSpy.mockRestore();
  ```

## Current State Summary

- Test infrastructure (Jest via `react-scripts`, `setupTests.js` with `jest-dom`) is wired up.
- Zero test files exist in `src/` — the original `src/App.test.js` was deleted (visible in git status) and not replaced.
- There is no CI workflow running tests; `package.json` defines no `test:ci` script and no `.github/workflows/` directory is present.

---

*Testing analysis: 2026-05-26*
