// Flat ESLint config. Order matters: each entry layers onto the previous, and the
// last one wins on conflicts — which is why `prettier` sits at the very bottom.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
    {
        ignores: ['dist/', 'node_modules/', '.astro/', 'coverage/', '.claude/'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        // Type-checked rules read type info, so they need a parser pointed at the
        // TS project (`project: true` finds the nearest tsconfig).
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: { ...globals.browser, ...globals.node },
        },
    },
    ...astro.configs.recommended,
    {
        // jsx-a11y + react-hooks are React rules, so scope them to JSX/TSX only.
        files: ['**/*.{jsx,tsx}'],
        plugins: { 'jsx-a11y': jsxA11y, 'react-hooks': reactHooks },
        rules: {
            ...jsxA11y.flatConfigs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
        },
    },
    {
        // Disable type-checked rules on plain JS config files (eslint.config.js itself,
        // astro.config.mjs, etc.). These files import third-party plugins whose exports are
        // typed as `any`, which the type-checked rule set flags as `no-unsafe-*` violations.
        // typescript-eslint ships `disableTypeChecked` for exactly this case.
        files: ['**/*.{js,mjs,cjs}'],
        ...tseslint.configs.disableTypeChecked,
    },
    {
        // Disable type-checked rules on the virtual files Astro extracts from
        // `<script>` blocks (e.g. `Foo.astro/1_1.ts`). They aren't part of the TS
        // project, so type-checked rules would throw trying to read type info.
        files: ['**/*.astro/*.ts', '**/*.astro/*.js'],
        ...tseslint.configs.disableTypeChecked,
    },
    prettier, // MUST be last — turns off any style rules that would fight Prettier.
);
