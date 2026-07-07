// Minimal React island used only by the hydration test: clicking it updates state,
// which can only happen if the component hydrated in the browser.
// `type="button"` keeps the jsx-a11y lint rule happy.

import { useState } from 'react';

export default function HydrationCheck() {
    const [n, setN] = useState(0);
    return (
        <button type="button" onClick={() => setN(n + 1)} data-testid="hydration-check">
            Hydration count: {n}
        </button>
    );
}
