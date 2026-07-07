// Content Layer config — the single source of truth for the site's data.
//
// Astro's Content Collections turn folders of Markdown/YAML into typed, validated
// data you read in components with `getCollection`/`getEntry`. Each collection is
// declared with `defineCollection({ loader, schema })`:
//   - `loader` says WHERE the data comes from:
//       · `glob(...)`  — every file matching a pattern becomes one entry (a "list").
//       · `file(...)`  — one file becomes a single entry (a "singleton").
//   - `schema` is a Zod shape Astro validates at build time. If a file is missing a
//     field or has the wrong type, the build fails loudly instead of shipping bad data.
//
// Two Astro-specific habits to note:
//   - `z` is imported from `astro:content`, NOT from `zod` directly. Astro re-exports
//     its bundled Zod so versions can't drift.
//   - Astro 6 bundles Zod 4, so use the modern idioms: `z.email()` / `z.url()` as
//     top-level constructors (not `.string().email()`), and `.regex(..., { error })`
//     (the key is `error`, not Zod 3's `message`).

import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// --- Shared field schemas ---
// Every icon in the site is an Iconify id of the form "prefix:name"
// (e.g. "devicon:python"); this regex rejects anything else at build time.
const iconSchema = z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/, {
    error: 'icon must be in Iconify "prefix:name" form (e.g., "devicon:python")',
});

// Reused for the ~24 string fields below so each one is trimmed and non-empty.
const trimmedString = (min = 1) => z.string().trim().min(min);

// --- Projects (image-bearing list) ---
// `schema` is written as a function `({ image }) => z.object({...})` rather than a
// plain object: that's how Astro injects the `image()` helper, which validates a
// referenced asset exists and hands components an optimizable image (see `cover`).
const projects = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: ({ image }) =>
        z.object({
            title: trimmedString(),
            start_date: trimmedString(),
            // Each tech entry carries an Iconify icon id so cards/modals can render
            // the per-technology icons.
            tech_stack: z.array(z.object({ name: trimmedString(), icon: iconSchema })).default([]),
            url: z.url().optional(),
            cover: image(),
            alternates: z.array(image()).optional(),
            order: z.number().int().default(0),
            draft: z.boolean().default(false),
        }),
});

// --- Work (image-free list) ---
// icon / main_tech / technologies feed the experience timeline in Work.astro.
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

// --- About (singleton: one YAML file via the `file` loader) ---
const about = defineCollection({
    loader: file('src/content/about.yaml'),
    schema: z.object({
        first_name: trimmedString(),
        last_name: trimmedString(),
        current_status: trimmedString(),
        // Hero rotating titles + About card greeting.
        titles: z.array(trimmedString()).min(1),
        description_header: trimmedString(),
        email: z.email(),
        contact_message: trimmedString(),
        description: trimmedString(),
        resume_download: trimmedString(),
        // Plain filename string, not `image()`: the profile photo is imported
        // directly in About.astro rather than resolved through the schema.
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

// --- Skills (singleton: one YAML file via the `file` loader) ---
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
