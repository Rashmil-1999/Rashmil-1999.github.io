/// <reference types="vitest/config" />
// Vitest config. `getViteConfig` reuses Astro's own Vite pipeline so tests resolve
// imports (like `astro:content`) exactly as the build does.
// The triple-slash reference above adds Vitest's `test` field to Astro's config
// type — without it `astro check` flags `test` as an unknown property.

import { getViteConfig } from 'astro/config';

export default getViteConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        globalSetup: ['./tests/global-setup.ts'],
    },
});
