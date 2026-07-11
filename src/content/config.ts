import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()),
    section: z.enum(['selected', 'foundations']).default('selected'),
    hidden: z.boolean().default(false),
  }),
});

export const collections = { blog };
