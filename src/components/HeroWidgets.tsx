// React island: rotating typewriter titles + a light/dark theme switch.
//
// "Island" = a React component the .astro parent hydrates in the browser (here
// Header.astro uses `client:load`). Only islands ship JS; everything else is static
// HTML. This one persists the chosen theme to localStorage and flips
// body[data-theme], and respects prefers-reduced-motion by pinning the first title.

import { useEffect, useMemo, useRef, useState } from 'react';

const TYPE_MS = 70;
const ERASE_MS = 40;
const HOLD_MS = 3000; // how long a fully typed title stays before erasing
const RESTART_MS = 400; // pause on the empty line before (re)typing

function useTypewriter(titles: string[]): string {
    // SSR renders the full first title so the hero reads fine without JS (and for
    // reduced-motion users, who never enter the animation loop below).
    const [text, setText] = useState(titles[0] ?? '');
    const state = useRef({ index: 0, length: 0, erasing: false });

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (titles.length === 0) return;

        // Arm the loop in the erasing state, one character from empty: the first
        // tick clears the SSR-rendered title, then the wrap to the next index
        // starts typing the first title from the empty line. (Setting state via a
        // tick instead of synchronously here keeps effect renders non-cascading.)
        state.current = { index: titles.length - 1, length: 1, erasing: true };

        let timer: ReturnType<typeof setTimeout>;
        const tick = () => {
            const s = state.current;
            const current = titles[s.index] ?? '';
            let delay = s.erasing ? ERASE_MS : TYPE_MS;

            if (s.erasing) {
                s.length -= 1;
                if (s.length === 0) {
                    s.erasing = false;
                    s.index = (s.index + 1) % titles.length;
                    delay = RESTART_MS;
                }
            } else {
                s.length += 1;
                if (s.length === current.length) {
                    s.erasing = true;
                    delay = HOLD_MS;
                }
            }
            setText((titles[s.index] ?? '').slice(0, s.length));
            timer = setTimeout(tick, delay);
        };
        timer = setTimeout(tick, RESTART_MS);
        return () => clearTimeout(timer);
    }, [titles]);

    return text;
}

export default function HeroWidgets({ titles }: { titles: string[] }) {
    // Memoized so the array keeps the same identity across re-renders — the
    // typewriter effect depends on it and must not reset on every keystroke.
    const upperTitles = useMemo(() => titles.map((t) => t.toUpperCase()), [titles]);
    const text = useTypewriter(upperTitles);
    // Lazy init: SSR renders light (matches the pre-hydration default); on the
    // client the body attribute set by the BaseLayout restore script wins.
    const [dark, setDark] = useState(
        () =>
            typeof document !== 'undefined' && document.body.getAttribute('data-theme') === 'dark',
    );

    const toggleTheme = () => {
        const next = dark ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        try {
            localStorage.setItem('theme', next);
        } catch {
            /* storage unavailable */
        }
        setDark(!dark);
    };

    return (
        <>
            <div className="title-container mb-8 min-h-12" aria-live="off">
                <p className="title-styles">
                    {text}
                    <span aria-hidden="true" className="animate-pulse">
                        |
                    </span>
                </p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={dark}
                aria-label="Dark theme"
                className="theme-switch mx-auto"
                onClick={toggleTheme}
                // The server renders the light state, but the client may restore dark
                // before React hydrates. This silences the expected mismatch warning.
                suppressHydrationWarning
            >
                <span className="theme-switch-thumb" aria-hidden="true"></span>
                <span aria-hidden="true" className="absolute right-2.5 text-xl">
                    {dark ? '' : '\u{1F989}'}
                </span>
                <span aria-hidden="true" className="absolute left-2.5 text-xl">
                    {dark ? '\u{1F31E}' : ''}
                </span>
            </button>
        </>
    );
}
