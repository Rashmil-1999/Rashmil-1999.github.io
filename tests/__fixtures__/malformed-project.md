---
# Malformed fixture for content-validation.test.ts. Both `title` and `cover` are
# intentionally omitted so `astro check` reports them as Required. The test copies
# this into the projects collection and asserts on the `title: Required` error.
order: 999
---

This entry intentionally lacks a title so the schema-enforcement test can fail the build.
