// React island: clickable project cards that open a native <dialog> modal with an
// image carousel, external link, description, and tech-stack icons.
//
// Hydrated by Projects.astro via `client:visible` (JS loads only when the section
// scrolls into view). Every prop here is plain data: the tech icon SVGs were
// pre-rendered to strings at build time by Projects.astro, so this component just
// injects them with `dangerouslySetInnerHTML` — no icon library runs in the browser.

import { useEffect, useRef, useState } from 'react';

export interface GalleryTech {
    name: string;
    svg: string;
}

export interface GalleryProject {
    title: string;
    startDate: string;
    description: string;
    url?: string | undefined;
    images: string[];
    tech: GalleryTech[];
}

export default function ProjectsGallery({ projects }: { projects: GalleryProject[] }) {
    const [open, setOpen] = useState<number | null>(null);
    const [slide, setSlide] = useState(0);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open !== null && !dialog.open) dialog.showModal();
        if (open === null && dialog.open) dialog.close();
    }, [open]);

    const project = open !== null ? projects[open] : undefined;

    const show = (i: number) => {
        setSlide(0);
        setOpen(i);
    };

    return (
        <div className="mx-auto max-w-4xl">
            {projects.map((p, i) => (
                <article
                    key={p.title}
                    className="project-card relative mb-10 flex flex-col md:flex-row"
                >
                    <div className="flex items-center justify-center p-4 md:w-1/3">
                        <img
                            src={p.images[0]}
                            alt={p.title}
                            loading="lazy"
                            className="max-h-52 rounded object-contain"
                        />
                    </div>
                    <div className="p-6 text-center md:w-2/3">
                        <h3 className="mb-1 text-xl font-bold">{p.title}</h3>
                        <p className="mb-3 text-sm opacity-80">{p.startDate}</p>
                        <p className="mb-3 text-left text-sm">{p.description}</p>
                        <button
                            type="button"
                            className="font-bold tracking-wide uppercase after:absolute after:inset-0 after:cursor-pointer"
                            aria-haspopup="dialog"
                            onClick={() => show(i)}
                        >
                            Click for more information
                        </button>
                    </div>
                </article>
            ))}

            <dialog
                ref={dialogRef}
                className="m-auto w-[min(56rem,95vw)] rounded-lg bg-(--color-card) p-0 text-(--color-card-text) backdrop:bg-black/70"
                aria-label={project?.title}
                onClose={() => setOpen(null)}
            >
                {project && (
                    <div className="p-6">
                        <div className="text-right">
                            <button
                                type="button"
                                aria-label="Close"
                                className="text-3xl leading-none"
                                onClick={() => setOpen(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="mx-auto mb-6 max-w-2xl">
                            <div className="slider-tab" aria-hidden="true">
                                <span className="terminal-dot bg-[#ff5f57]"></span>
                                <span className="terminal-dot bg-[#febc2e]"></span>
                                <span className="terminal-dot bg-[#28c840]"></span>
                            </div>
                            <div className="slider-frame relative bg-black/5">
                                <img
                                    src={project.images[slide]}
                                    alt={`${project.title} screenshot ${slide + 1} of ${project.images.length}`}
                                    className="mx-auto max-h-[28rem] object-contain"
                                />
                                {project.images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="Previous image"
                                            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1 text-2xl text-white"
                                            onClick={() =>
                                                setSlide(
                                                    (slide - 1 + project.images.length) %
                                                        project.images.length,
                                                )
                                            }
                                        >
                                            ‹
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Next image"
                                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1 text-2xl text-white"
                                            onClick={() =>
                                                setSlide((slide + 1) % project.images.length)
                                            }
                                        >
                                            ›
                                        </button>
                                        <p className="sr-only" aria-live="polite">
                                            Image {slide + 1} of {project.images.length}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold">
                            {project.title}
                            {project.url && (
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-3 inline-block align-middle text-base underline"
                                >
                                    View on GitHub
                                    <span className="sr-only"> (opens in new tab)</span>
                                </a>
                            )}
                        </h3>
                        <p className="mb-6 text-justify text-sm">{project.description}</p>
                        <ul className="flex flex-wrap items-end justify-center gap-6">
                            {project.tech.map((t) => (
                                <li key={t.name} className="flex flex-col items-center">
                                    <span
                                        aria-hidden="true"
                                        className="[&>svg]:size-10"
                                        dangerouslySetInnerHTML={{ __html: t.svg }}
                                    />
                                    <span className="mt-1 text-xs">{t.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </dialog>
        </div>
    );
}
