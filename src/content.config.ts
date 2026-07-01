import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const samples = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/samples' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    docType: z.string(),
    audience: z.string(),
    purpose: z.string(),
    note: z.string(),
    highlights: z.array(z.string()),
    pdf: z.string(),
    order: z.number(),
  }),
});

export const collections = { samples };
