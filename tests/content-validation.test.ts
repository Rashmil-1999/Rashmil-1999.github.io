// tests/content-validation.test.ts
// CONTEXT.md D-26..D-28 + RESEARCH.md Recipe R9 (lines 974-1031).
// Source: docs.astro.build/en/reference/cli-reference/ (astro check exits non-zero on schema failure),
//         docs.astro.build/en/guides/content-collections/ (data-store.json is the build artifact).
//
// Three sub-tests:
//   1. CONTENT-08 schema gate: spawnSync of `npx astro check` against a temp
//      copy of tests/__fixtures__/malformed-project.md (placed inside
//      src/content/projects/__test__/index.md) must exit non-zero AND surface
//      both the entry id (`__test__`) AND the missing field name (`title`).
//
//      DEVIATION from Recipe R9 (RESEARCH.md Assumption A1 was wrong):
//      `astro check` does NOT emit the JSON-shaped `"path": ["title"]` form
//      that `astro dev`/`astro build` uses (RESEARCH.md Q2 only confirmed the
//      latter). The actual `astro check` output is a human-readable
//      `InvalidContentEntryDataError ... title: Required` block. Assertion
//      regex updated to match the v6 `astro check` format observed live.
//
//   2. Phase 2 SC #1 positive path (D-28): the build artifact at
//      node_modules/.astro/data-store.json contains 13 typed project entries
//      and `CollectionEntry<'projects'>['data']['title']` is `string` (not `any`).
//
//      DEVIATION from Recipe R9 (RESEARCH.md Open Question 2 failure mode):
//      `await import('astro:content')` + `getCollection('projects')` returns
//      0 entries inside Vitest under getViteConfig — confirmed live. Open
//      Question 2's recommended fallback is "consume the build output". The
//      build artifact (data-store.json populated by astro build in
//      globalSetup) is the source-of-truth and the cleanest fallback.
//      `expectTypeOf` keeps the D-28 compile-time type assertion intact.
//
//   3. D-20 body non-emptiness across all 5 list collections (Astro's Zod
//      schema cannot gate markdown body — RESEARCH.md Open Question 1).
//      Same data-store fallback: read the persisted entries.

import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, expectTypeOf, it } from 'vitest';

import type { CollectionEntry } from 'astro:content';

const REPO_ROOT = process.cwd();
const FIXTURE = join(REPO_ROOT, 'tests/__fixtures__/malformed-project.md');
const TEMP_DIR = join(REPO_ROOT, 'src/content/projects/__test__');
const TEMP_FILE = join(TEMP_DIR, 'index.md');
const DATA_STORE = join(REPO_ROOT, 'node_modules/.astro/data-store.json');

/**
 * Read the data-store.json artifact written by `astro build` (or `astro sync`)
 * and return a Map<collectionName, Map<entryId, entryData>> reconstructed
 * from the devalue-encoded flat index array.
 *
 * Schema reverse-engineered from observed output:
 *   [0]: top-level Map = ['Map', k1Idx, v1Idx, k2Idx, v2Idx, ...]
 *   Each kIdx points to a collection-name string.
 *   Each vIdx points to another Map of (entryId -> entryRecord).
 *   entryRecord = { id, data, filePath, body? } whose values are themselves
 *   indices into the flat array.
 */
function loadDataStore(): Map<string, Map<string, Record<string, unknown>>> {
    const raw = JSON.parse(readFileSync(DATA_STORE, 'utf8')) as unknown[];
    const resolve = (idx: unknown): unknown => {
        if (typeof idx === 'number') return raw[idx];
        return idx;
    };
    const result = new Map<string, Map<string, Record<string, unknown>>>();
    const root = raw[0];
    if (!Array.isArray(root) || root[0] !== 'Map') {
        throw new Error('data-store.json: unexpected root shape');
    }
    for (let i = 1; i < root.length; i += 2) {
        const collectionName = resolve(root[i]) as string;
        const entriesMap = resolve(root[i + 1]) as unknown[];
        if (!Array.isArray(entriesMap) || entriesMap[0] !== 'Map') continue;
        const entries = new Map<string, Record<string, unknown>>();
        for (let j = 1; j < entriesMap.length; j += 2) {
            const entryId = resolve(entriesMap[j]) as string;
            const entryRec = resolve(entriesMap[j + 1]) as Record<string, unknown> | undefined;
            if (!entryRec) continue;
            // Resolve all indirected fields one level deep.
            const resolved: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(entryRec)) {
                resolved[k] = resolve(v);
            }
            entries.set(entryId, resolved);
        }
        result.set(collectionName, entries);
    }
    return result;
}

describe('CONTENT-08: schema validation', () => {
    it('astro check fails on a malformed project entry with a useful Zod error', () => {
        // Defensive: a prior run killed by a signal may have left the
        // malformed fixture in TEMP_DIR. Remove it before re-staging so the
        // test always starts from a clean slate (belt-and-braces against the
        // OS-signal interrupt case that bypasses the try/finally below).
        rmSync(TEMP_DIR, { recursive: true, force: true });
        mkdirSync(dirname(TEMP_FILE), { recursive: true });
        copyFileSync(FIXTURE, TEMP_FILE);
        try {
            const result = spawnSync('npx', ['astro', 'check'], {
                cwd: REPO_ROOT,
                encoding: 'utf8',
            });
            // D-27 (a): exited (not signal-killed) with a non-zero status.
            // spawnSync sets `status` to null when the process was killed by
            // a signal (segfault, OOM, SIGKILL). `.not.toBe(0)` would pass
            // on null too, silently masking a crash as a schema failure.
            // Use toBeGreaterThan(0) so null fails and a real schema error
            // (exit code 1) passes.
            expect(result.status).toBeGreaterThan(0);
            const combined = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
            // D-27 (b): output cites the entry id from the temp dir name.
            expect(combined).toContain('__test__');
            // D-27 (c): output cites the missing required field.
            // v6 `astro check` format: "title: Required" inside an
            // InvalidContentEntryDataError block (NOT the JSON `"path":
            // ["title"]` shape that astro dev emits — A1 deviation).
            expect(combined).toMatch(/title\s*:\s*Required/);
            // Belt-and-braces: the canonical error class name is present.
            expect(combined).toContain('InvalidContentEntryDataError');
        } finally {
            rmSync(TEMP_DIR, { recursive: true, force: true });
        }
    }, 60_000); // astro check is slow; give it a minute (Recipe R9 line 1007).
});

describe('CONTENT-08 positive path (SC #1)', () => {
    it('await getCollection("projects") returns >0 typed entries', () => {
        // RESEARCH.md Open Question 2 fallback: `await import('astro:content')`
        // resolves under getViteConfig but `getCollection` returns 0 entries
        // (the data-store populated by `astro build` in globalSetup isn't
        // exposed through Vitest's Vite plugin instance). Read the build
        // artifact directly — same source of truth, no API gap.
        const store = loadDataStore();
        const projects = store.get('projects');
        expect(projects, 'projects collection missing from data-store').toBeDefined();
        // SC #1 first half: Plan 02-04 authored exactly 13 entries. Phase 3
        // ROADMAP gating assumes that count, so assert it precisely (a
        // regression that drops 12 of 13 entries via draft:true or rename
        // would otherwise slip past a > 0 check).
        const EXPECTED_PROJECT_COUNT = 13;
        expect(
            projects!.size,
            'expected exactly 13 project entries (Phase 2 Plan 02-04)',
        ).toBe(EXPECTED_PROJECT_COUNT);

        // D-28 type assertion: `entry.data.title` must be `string`, not `any`.
        // This is a compile-time check via expectTypeOf — the runtime value
        // doesn't matter (TypeScript performs the check on the type alias).
        // Source: `CollectionEntry<'projects'>` is the public type alias
        // generated by `astro sync` from src/content.config.ts.
        type ProjectTitle = CollectionEntry<'projects'>['data']['title'];
        expectTypeOf<ProjectTitle>().toEqualTypeOf<string>();
    });

    it('links collection has no duplicate ids (D-14)', () => {
        // CONTEXT.md D-14 requires unique `id` values across `links.yaml`
        // entries. The Astro `file()` loader hands the schema one entry at
        // a time, so per-entry Zod validation cannot detect duplicates.
        // Enforce uniqueness at the collection level by reading the
        // data-store and asserting Set(ids).size === entries.length.
        const store = loadDataStore();
        const links = store.get('links');
        expect(links, 'links collection missing from data-store').toBeDefined();
        const ids = Array.from(links!.keys());
        expect(
            new Set(ids).size,
            `duplicate ids in links: ${ids.join(', ')}`,
        ).toBe(ids.length);
    });

    it('every list-collection entry has a non-empty markdown body (D-20)', () => {
        // Same data-store fallback. Astro 6's glob loader stores the raw
        // markdown body under entry.body (Assumption A2 in RESEARCH.md A2).
        // If the field is named differently in a future Astro release, this
        // is a one-line update.
        const store = loadDataStore();
        for (const collection of [
            'projects',
            'work',
            'education',
            'leadership',
            'testimonials',
        ] as const) {
            const entries = store.get(collection);
            expect(entries, `${collection} collection missing`).toBeDefined();
            for (const [id, entry] of entries!) {
                const body = entry['body'];
                const bodyStr = typeof body === 'string' ? body : '';
                expect(bodyStr.trim().length, `${collection}/${id}`).toBeGreaterThan(0);
            }
        }
    });
});
