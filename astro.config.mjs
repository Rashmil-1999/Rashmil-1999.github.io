// @ts-check
// astro.config.mjs
// Source: docs.astro.build/en/reference/configuration-reference/
//         tailwindcss.com/docs/installation/framework-guides/astro
//         (and CONTEXT.md D-13)

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://Rashmil-1999.github.io',
    // No `base` set — this is a user-site repo, served at /.
    // Setting `base` here is the #1 Astro-on-GH-Pages footgun (Pitfall 10).
    output: 'static',
    trailingSlash: 'always',
    build: { format: 'directory' },
    integrations: [react(), icon()],
    vite: {
        plugins: [tailwindcss()],
    },
});
