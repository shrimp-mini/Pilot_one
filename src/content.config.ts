import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const certifications = defineCollection({
  loader: file("./src/content/certifications.json"),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    url: z.string().url().optional(),
    category: z.string().optional(),
  }),
});

export const collections = { works, blog, certifications };
