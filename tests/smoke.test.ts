// Smoke test: a handful of assertions against the built `dist/` output.
// The hydration page is served at /hydration-test/ (no leading underscore) because
// Astro excludes `src/pages/` files whose name starts with `_` from routing.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIST = join(process.cwd(), 'dist');

// Live-site layout: hero header + 5 sections (no nav, no leadership/testimonials).
const sectionIds = ['home', 'about', 'education', 'projects', 'skills', 'work'];

describe('build output smoke test', () => {
    it('emits dist/index.html', () => {
        expect(existsSync(join(DIST, 'index.html'))).toBe(true);
    });

    it('dist/index.html contains all live-site section ids', () => {
        const html = readFileSync(join(DIST, 'index.html'), 'utf8');
        for (const id of sectionIds) {
            expect(html).toContain(`id="${id}"`);
        }
    });

    it('emits dist/hydration-test/index.html', () => {
        expect(existsSync(join(DIST, 'hydration-test', 'index.html'))).toBe(true);
    });

    it('emits a React JS chunk in dist/_astro/', () => {
        const astroDir = join(DIST, '_astro');
        const files = readdirSync(astroDir);
        const jsChunks = files.filter((f) => f.endsWith('.js'));
        expect(jsChunks.length).toBeGreaterThan(0);
    });

    it('emits the Tailwind marker utility in dist/_astro/*.css', () => {
        // Proves Tailwind v4 actually compiled: the marker class `text-[#abc123]`
        // should appear as `color: #abc123` in the emitted CSS.
        const astroDir = join(DIST, '_astro');
        const cssFiles = readdirSync(astroDir).filter((f) => f.endsWith('.css'));
        const cssBlob = cssFiles.map((f) => readFileSync(join(astroDir, f), 'utf8')).join('\n');
        expect(cssBlob).toMatch(/#abc123/i);
    });
});
