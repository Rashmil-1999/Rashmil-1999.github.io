// src/components/HeroWidgets.tsx
// React island: rotating typewriter titles + light/dark theme switch.
// Port of the live site's react-typical + react-switch Header behavior
// (recovered Experience: Header.jsx). Persists theme to localStorage and
// flips body[data-theme]; honors prefers-reduced-motion by pinning the
// first title statically.

import { useEffect, useRef, useState } from 'react';

const TYPE_MS = 70;
const ERASE_MS = 40;
const HOLD_MS = 1500;

function useTypewriter(titles: string[]): string {
    const [text, setText] = useState(titles[0] ?? '');
    const state = useRef({ index: 0, length: titles[0]?.length ?? 0, erasing: false });

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (titles.length < 2) return;

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
        timer = setTimeout(tick, HOLD_MS);
        return () => clearTimeout(timer);
    }, [titles]);

    return text;
}

export default function HeroWidgets({ titles }: { titles: string[] }) {
    const text = useTypewriter(titles.map((t) => t.toUpperCase()));
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
