// tests/global-setup.ts
// Source: vitest.dev/config/globalsetup, nodejs.org/api/child_process.html#child_processspawnsynccommand-args-options
// CONTEXT.md D-21: spawns `astro build` ONCE before any test file runs.
// If build fails (non-zero exit), THIS THROWS -> entire test suite fails.
// Implicitly satisfies ROADMAP Phase 1 SC #3: a broken build kills the test suite.

import { spawnSync } from 'node:child_process';

export default function setup() {
    const result = spawnSync('npx', ['astro', 'build'], {
        stdio: 'inherit',
        env: process.env,
    });
    if (result.status !== 0) {
        throw new Error(`astro build exited with status ${result.status} — smoke test aborted.`);
    }
    // No teardown — dist/ is left in place for inspection.
}
