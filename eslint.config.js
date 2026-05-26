// eslint.config.js
// Source: eslint.org/docs/latest/use/configure/configuration-files
//         typescript-eslint.io/getting-started
//         github.com/ota-meshi/eslint-plugin-astro
//         github.com/jsx-eslint/eslint-plugin-jsx-a11y (flatConfigs.recommended)
// CONTEXT.md D-15 (composition order), D-18 (ignore list — `.planning/` and `.claude/` mandatory).
// Per PATTERNS.md Shared Patterns: `.planning/` and `.claude/` MUST appear in the ignore list.
// Per RESEARCH.md Pitfall A: pin ESLint to 9.x (NOT 10) so eslint-plugin-jsx-a11y@6 peer is satisfied.
// Per RESEARCH.md Pitfall C: parserOptions.project is required for type-checked rules to attach parserServices.
// Per RESEARCH.md Pitfall F (adjacent rule): eslint-config-prettier MUST be the LAST entry.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
    {
        ignores: ['dist/', 'node_modules/', '.astro/', 'coverage/', '.planning/', '.claude/'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        // Type-checked rules require parserOptions.project (Pitfall C mitigation).
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
        // jsx-a11y + react-hooks apply to JSX/TSX only, NOT .astro files (D-15).
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
    prettier, // MUST be last — turns off stylistic conflicts with Prettier (Pitfall F adjacent).
);
