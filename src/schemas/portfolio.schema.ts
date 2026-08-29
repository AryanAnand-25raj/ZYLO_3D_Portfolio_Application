import { z } from "zod";
import { ContentSchema } from "./content.schema";
import { ThemeSchema } from "./theme.schema";
import { SceneSchema } from "./scene.schema";

export const PortfolioMetadataSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(300).default(""),
  isPublished: z.boolean().default(false),
  customDomain: z.string().optional().nullable(),
  createdAt: z.date().or(z.string()).default(() => new Date().toISOString()),
  updatedAt: z.date().or(z.string()).default(() => new Date().toISOString()),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImage: z.string().url().optional().or(z.literal("")),
      keywords: z.array(z.string()).default([]),
    })
    .default({}),
});

export const PortfolioSchema = z.object({
  metadata: PortfolioMetadataSchema,
  content: ContentSchema,
  design: ThemeSchema,
  scene: SceneSchema,
});

export type PortfolioData = z.infer<typeof PortfolioSchema>;
export type PortfolioMetadata = z.infer<typeof PortfolioMetadataSchema>;
