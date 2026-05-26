/// <reference types="vitest/config" />
// vitest.config.ts
// Source: vitest.dev/config/globalsetup, vitest.dev/config (triple-slash reference idiom)
// CONTEXT.md D-21, D-24.
// Shares Astro's Vite pipeline via getViteConfig so Vitest sees the same
// resolution + plugin chain that `astro build` uses.
// The triple-slash reference loads Vitest's UserConfig augmentation so the
// `test` field is recognized on the object passed to getViteConfig (otherwise
// astro check reports ts(2353) — `test` not in UserConfig).

import { getViteConfig } from 'astro/config';

export default getViteConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        globalSetup: ['./tests/global-setup.ts'],
    },
});
