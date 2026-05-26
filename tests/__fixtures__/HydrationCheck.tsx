// tests/__fixtures__/HydrationCheck.tsx
// Source: react.dev/reference/react/useState
// CONTEXT.md D-09 + FOUND-04: React 19 verification island. Any state update proves hydration.
// type="button" is mandatory (jsx-a11y rule, Plan 04 lint config will enforce).

import { useState } from 'react';

export default function HydrationCheck() {
    const [n, setN] = useState(0);
    return (
        <button type="button" onClick={() => setN(n + 1)} data-testid="hydration-check">
            Hydration count: {n}
        </button>
    );
}
