// @ts-check
// Astro project config. `integrations` plug capabilities into the build pipeline;
// `vite` lets us drop in raw Vite plugins (Tailwind v4 ships as one).

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    site: 'https://Rashmil-1999.github.io',
    // No `base` set: this is a user-site repo (served at `/`, not a subpath).
    // Adding a `base` here would prepend a subpath to every URL and break the
    // site on GitHub Pages — a common gotcha worth leaving a note about.
    output: 'static',
    trailingSlash: 'always',
    build: { format: 'directory' },
    // React powers the interactive islands; astro-icon renders Iconify SVGs at build.
    integrations: [react(), icon()],
    vite: {
        // Tailwind v4 has no Astro integration — it's wired in as a Vite plugin.
        plugins: [tailwindcss()],
    },
});
