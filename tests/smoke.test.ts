// tests/smoke.test.ts
// CONTEXT.md D-23: five assertions against dist/.
// Hydration page URL is /hydration-test/ (NOT /__hydration-test/) per Plan 03 SUMMARY
// Deviation #1: Astro 6 excludes src/pages/*.astro whose filename starts with `_`
// from route generation, so the underscore-prefixed path is structurally infeasible.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIST = join(process.cwd(), 'dist');

// Live-site layout: hero header + 5 sections (no nav, no leadership/testimonials).
const sectionIds = ['home', 'about', 'education', 'projects', 'skills', 'work'];

describe('Phase 1 smoke', () => {
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
        // CONTEXT.md D-12: Pitfall 29 mitigation.
        // The marker class `text-[#abc123]` compiles to `color: #abc123` in v4.
        const astroDir = join(DIST, '_astro');
        const cssFiles = readdirSync(astroDir).filter((f) => f.endsWith('.css'));
        const cssBlob = cssFiles.map((f) => readFileSync(join(astroDir, f), 'utf8')).join('\n');
        expect(cssBlob).toMatch(/#abc123/i);
    });
});
