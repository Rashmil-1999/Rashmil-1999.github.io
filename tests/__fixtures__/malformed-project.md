---
# tests/__fixtures__/malformed-project.md
# CONTEXT.md D-26 + RESEARCH.md Recipe R9 (lines 974-1046).
# Both `title` and `cover` are intentionally omitted; `astro check` emits
# two `Required` errors (one per missing field). The test asserts on the
# `title: Required` error in particular because it is unambiguous and
# survives any future Zod path-sort change.
# Consumed by tests/content-validation.test.ts via copyFileSync into
# src/content/projects/__test__/index.md, then npx astro check is spawned.
order: 999
---

This entry intentionally lacks a title so CONTENT-08 can verify schema enforcement.
