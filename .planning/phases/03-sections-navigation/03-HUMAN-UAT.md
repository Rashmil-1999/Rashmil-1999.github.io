---
status: partial
phase: 03-sections-navigation
source: [03-VERIFICATION.md]
started: 2026-05-27T09:05:00Z
updated: 2026-05-27T09:05:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Visual parity of all 8 sections (npm run preview)

expected: SideNav, About, Education, Work, Skills, Projects, Leadership, Testimonials all render in correct order with content from collections; visual density matches the existing CRA site under the "refresh same vibe" bar.
result: [pending]

### 2. Side-nav links smooth-scroll + scroll-spy

expected: Clicking a side-nav link smooth-scrolls to the target section; `aria-current="page"` updates on the matching nav link via IntersectionObserver as the user scrolls.
result: [pending]

### 3. Mobile menu toggle (< 768px viewport)

expected: Hamburger toggles open/closed; `aria-expanded` flips; Escape key closes; tapping a link closes the menu and scrolls.
result: [pending]

### 4. Reduced-motion respect

expected: With OS `prefers-reduced-motion: reduce`, page jumps to section without smooth animation when a nav link is clicked.
result: [pending]

### 5. DevTools Network: zero CDN UI dependencies

expected: First page load with empty cache shows zero requests to fonts.googleapis.com, fontawesome.com, code.iconify.design, jsdelivr.net, cdnjs.cloudflare.com, stackpath.bootstrapcdn.com.
result: [pending]

### 6. Browser-actual image weight (SC #5 carve-out attestation)

expected: DevTools Network filter for images shows total bytes ≈ 399 KB (semantic interpretation per Option B carve-out, commit db9ab24). SC #5 already accepted; this is documentation-grade attestation only.
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps
