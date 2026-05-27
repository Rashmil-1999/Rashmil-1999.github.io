// tests/global-setup.ts
// Source: vitest.dev/config/globalsetup, nodejs.org/api/child_process.html#child_processspawnsynccommand-args-options
// CONTEXT.md D-21: spawns `astro build` ONCE before any test file runs.
// If build fails (non-zero exit), THIS THROWS -> entire test suite fails.
// Implicitly satisfies ROADMAP Phase 1 SC #3: a broken build kills the test suite.

import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';

// Defensive cleanup: the CONTENT-08 schema-gate test in
// content-validation.test.ts copies a malformed fixture into
// src/content/projects/__test__/index.md and relies on try/finally to
// remove it. If a prior test run was killed by a signal (Ctrl-C, OOM,
// CI timeout) the leftover entry poisons every subsequent `astro build`
// with an InvalidContentEntryDataError far from the root cause. Remove
// any stale fixture before spawning astro build.
const POISON_DIR = join(process.cwd(), 'src/content/projects/__test__');

export default function setup() {
    rmSync(POISON_DIR, { recursive: true, force: true });

    const result = spawnSync('npx', ['astro', 'build'], {
        stdio: 'inherit',
        env: process.env,
    });
    if (result.status !== 0) {
        throw new Error(`astro build exited with status ${result.status} — smoke test aborted.`);
    }
    // No teardown — dist/ is left in place for inspection.
}
