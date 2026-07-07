// Tests that the Content Collections schema actually guards the data. Three checks:
//
//   1. Schema gate: copy a deliberately malformed project into the projects
//      collection, run `astro check`, and confirm it exits non-zero and names both
//      the bad entry (`__test__`) and the missing field (`title`).
//
//   2. Positive path: the build's data-store artifact holds the expected typed
//      project entries, and `entry.data.title` is `string` (not `any`).
//
//   3. Body non-emptiness: every Markdown entry has a non-empty body. (Zod can't
//      validate a Markdown body, so this is checked here instead.)
//
// Note on reading data: `getCollection` returns 0 entries when called inside Vitest,
// so checks 2 and 3 read `node_modules/.astro/data-store.json` — the artifact
// `astro build` writes (produced in global-setup) — as the source of truth.

import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, expectTypeOf, it } from 'vitest';

import type { CollectionEntry } from 'astro:content';

// Anchor on the test file's own location so paths resolve correctly even
// when Vitest is launched with a non-repo cwd (IDE runner, monorepo
// wrapper, CI scratch dir). `import.meta.url` -> tests/, then up one.
const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(TEST_DIR, '..');
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
            // Must have exited with a non-zero status, NOT been killed by a signal.
            // spawnSync sets `status` to null on a signal kill (segfault, OOM), and
            // `.not.toBe(0)` would pass on null too — masking a crash as a schema
            // failure. `toBeGreaterThan(0)` fails on null and passes on exit code 1.
            expect(result.status).toBeGreaterThan(0);
            // Strip ANSI color codes: CI forces color in `astro check`, which
            // interleaves escape sequences inside the error text (e.g. between
            // "title" and ":") and would break the field regex below. Locally the
            // output is plain. Built via fromCharCode(27) to avoid a literal ESC.
            const ansi = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g');
            const combined = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.replace(ansi, '');
            // Output must cite the bad entry id (the temp dir name)...
            expect(combined).toContain('__test__');
            // ...and the missing required field. `astro check` prints this as
            // "title: Required" inside an InvalidContentEntryDataError block.
            expect(combined).toMatch(/title\s*:\s*Required/);
            // Belt-and-braces: the canonical error class name is present.
            expect(combined).toContain('InvalidContentEntryDataError');
        } finally {
            rmSync(TEMP_DIR, { recursive: true, force: true });
        }
    }, 60_000); // astro check is slow; give it a minute.
});

describe('content collections: typed entries', () => {
    it('the projects collection has the expected typed entries', () => {
        // Read the build artifact directly (see file header) — `getCollection`
        // returns 0 entries under Vitest.
        const store = loadDataStore();
        const projects = store.get('projects');
        expect(projects, 'projects collection missing from data-store').toBeDefined();
        const EXPECTED_PROJECT_COUNT = 8;
        expect(projects!.size, 'expected exactly 8 project entries').toBe(EXPECTED_PROJECT_COUNT);

        // Compile-time check: `entry.data.title` must be typed `string`, not `any`.
        // expectTypeOf runs in the type system, so the runtime value is irrelevant.
        // `CollectionEntry<'projects'>` is the type Astro generates from the schema.
        type ProjectTitle = CollectionEntry<'projects'>['data']['title'];
        expectTypeOf<ProjectTitle>().toEqualTypeOf<string>();
    });

    it('every list-collection entry has a non-empty markdown body', () => {
        // Same build-artifact read. Astro's glob loader stores the raw Markdown
        // body under entry.body.
        const store = loadDataStore();
        for (const collection of ['projects', 'work', 'education'] as const) {
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
