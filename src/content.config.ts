// src/content.config.ts
// Phase 2 (Content Layer) — fills the Phase 1 D-11 placeholder.
// 8 collections: 5 list (glob loader) + 3 singleton (file loader).
//
// Zod 4 idioms used throughout (Astro 6 bundles Zod 4 — RESEARCH.md "State of the Art"):
//   - `z.email()` / `z.url()` — top-level constructors, NOT `.string().email()` / `.string().url()` (Zod 3 forms).
//   - `.regex(..., { error: '...' })` — `error` key, NOT `message` (Zod 3 form).
//
// Import discipline (Pitfall 2/3):
//   - `z` is imported from `astro:content`, NEVER from `zod` directly.
//   - Loader API is `{ loader, schema }` — the legacy Astro 4/5 `type` key
//     (content | data) is forbidden in Astro 6 Content Layer.

import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// --- Shared field schemas (CONTEXT.md "Claude's Discretion") ---
// `iconSchema` enforces the Iconify "prefix:name" shape (D-16).
const iconSchema = z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/, {
    error: 'icon must be in Iconify "prefix:name" form (e.g., "devicon:python")',
});

// `trimmedString` is applied to ~24 string fields — the helper pays for itself (D-21).
const trimmedString = (min = 1) => z.string().trim().min(min);

// --- Projects (image-bearing list) ---
// Schema-function form `({ image }) => z.object({...})` is required so `image()` is in scope (D-07 / Pitfall 4).
const projects = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: ({ image }) =>
        z.object({
            title: trimmedString(),
            start_date: trimmedString(),
            // tech entries carry an Iconify icon id so cards/modals can render
            // the live site's per-technology icons (D-16 shape).
            tech_stack: z.array(z.object({ name: trimmedString(), icon: iconSchema })).default([]),
            url: z.url().optional(),
            cover: image(),
            alternates: z.array(image()).optional(),
            order: z.number().int().default(0),
            draft: z.boolean().default(false),
        }),
});

// --- Work (image-free list) ---
// icon / main_tech / technologies feed the timeline rendering in Work.astro
// (ported from the recovered live-site Experience.jsx — see recovered/live-site-2022/).
const work = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
    schema: z.object({
        company: trimmedString(),
        title: trimmedString(),
        duration: trimmedString(),
        url: z.url().optional(),
        icon: iconSchema.optional(),
        main_tech: z.array(trimmedString()).default([]),
        technologies: z.array(trimmedString()).default([]),
        order: z.number().int().default(0),
        draft: z.boolean().default(false),
    }),
});

// --- Education ---
const education = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/education' }),
    schema: z.object({
        name: trimmedString(),
        degree: trimmedString(),
        graduated: trimmedString(),
        score: trimmedString().optional(),
        order: z.number().int().default(0),
        draft: z.boolean().default(false),
    }),
});

// --- About (object-map singleton; D-13) ---
// `profile_image` is a string (resolved by colocation in Phase 2 Wave 2), NOT `image()` — D-11 / RESEARCH.md.
const about = defineCollection({
    loader: file('src/content/about.yaml'),
    schema: z.object({
        first_name: trimmedString(),
        last_name: trimmedString(),
        current_status: trimmedString(),
        // Hero rotating titles + About card greeting (live-site port).
        titles: z.array(trimmedString()).min(1),
        description_header: trimmedString(),
        email: z.email(),
        contact_message: trimmedString(),
        description: trimmedString(),
        resume_download: trimmedString(),
        profile_image: trimmedString(),
        social: z
            .array(
                z.object({
                    name: trimmedString(),
                    url: z.url(),
                    icon: iconSchema,
                }),
            )
            .min(1),
    }),
});

// --- Skills (object-map singleton; D-15) ---
const skills = defineCollection({
    loader: file('src/content/skills.yaml'),
    schema: z.object({
        categories: z
            .array(
                z.object({
                    name: trimmedString(),
                    order: z.number().int().default(0),
                    items: z
                        .array(
                            z.object({
                                name: trimmedString(),
                                icon: iconSchema,
                            }),
                        )
                        .min(1),
                }),
            )
            .min(1),
    }),
});

export const collections = {
    projects,
    work,
    education,
    about,
    skills,
};
