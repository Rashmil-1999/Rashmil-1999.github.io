---
# tests/__fixtures__/malformed-project.md
# CONTEXT.md D-26 + RESEARCH.md Recipe R9 (lines 974-1046).
# Deliberately missing the required `title` field so CONTENT-08 can prove
# that `astro check` surfaces a Zod error citing `"path": ["title"]`.
# Open Question 3 (RESEARCH.md line 1192) applied: `cover` is OMITTED too,
# so the only missing-required-field error is for `title` — easier to debug.
# Consumed by tests/content-validation.test.ts via copyFileSync into
# src/content/projects/__test__/index.md, then npx astro check is spawned.
order: 999
---

This entry intentionally lacks a title so CONTENT-08 can verify schema enforcement.
