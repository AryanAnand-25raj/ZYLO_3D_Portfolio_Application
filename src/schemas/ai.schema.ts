import { z } from "zod";
import {
  ProfileHeaderSchema,
  ExperienceSchema,
  ProjectSchema,
  SkillCategorySchema,
  EducationSchema,
  SocialLinkSchema,
} from "./content.schema";

// 1. Structured Resume Extraction Schema
export const ExtractedResumeSchema = z.object({
  profile: z.object({
    fullName: z.string().optional().default(""),
    headline: z.string().optional().default(""),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().default(""),
    location: z.string().optional().default(""),
    bio: z.string().optional().default(""),
    socials: z.array(SocialLinkSchema).optional().default([]),
  }),
  experiences: z.array(ExperienceSchema).optional().default([]),
  education: z.array(EducationSchema).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  skillCategories: z.array(SkillCategorySchema).optional().default([]),
  projects: z.array(ProjectSchema).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  awards: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  rawSections: z
    .array(
      z.object({
        heading: z.string(),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});
export type ExtractedResumeData = z.infer<typeof ExtractedResumeSchema>;

// 2. AI Patch Operation Schema
export const AIPatchOperationSchema = z.object({
  op: z.enum(["replace", "add", "remove"]),
  path: z.string().regex(/^\/[a-zA-Z0-9_\-\/]+$/, "Must be a valid JSON pointer path"),
  value: z.unknown().optional(),
});
export type AIPatchOperation = z.infer<typeof AIPatchOperationSchema>;

export const AIPatchBatchSchema = z.object({
  operations: z.array(AIPatchOperationSchema),
  reason: z.string().optional(),
});
export type AIPatchBatch = z.infer<typeof AIPatchBatchSchema>;

// 3. Generated Portfolio Content Schema
export const GeneratedPortfolioContentSchema = z.object({
  hero: z.object({
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    badge: z.string().default("Available for hire"),
    ctaText: z.string().default("Explore Projects"),
    secondaryCtaText: z.string().default("Get in Touch"),
  }),
  about: z.object({
    title: z.string().default("About Me"),
    tagline: z.string().default("Bridging engineering and dimensional interactive design"),
    body: z.string().min(1),
    highlights: z.array(z.string()).default([]),
  }),
  experienceSummaries: z.array(
    z.object({
      id: z.string(),
      company: z.string(),
      role: z.string(),
      duration: z.string(),
      impactSummary: z.string(),
      keyTechnologies: z.array(z.string()),
    })
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      category: z.string(),
      summary: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      featured: z.boolean().default(false),
      demoUrl: z.string().optional(),
      githubUrl: z.string().optional(),
      impactMetrics: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .default([]),
    })
  ),
  skillsMatrix: z.array(
    z.object({
      category: z.string(),
      description: z.string().optional(),
      skills: z.array(
        z.object({
          name: z.string(),
          proficiency: z.number().min(0).max(100).default(80),
          highlight: z.boolean().default(false),
        })
      ),
    })
  ),
  services: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
      })
    )
    .default([]),
  callToAction: z.object({
    heading: z.string().default("Ready to build something extraordinary?"),
    description: z
      .string()
      .default("Let's collaborate on spatial web experiences, scalable products, or creative engineering."),
    buttonText: z.string().default("Start a Conversation"),
  }),
  seo: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    keywords: z.array(z.string()).default([]),
  }),
});
export type GeneratedPortfolioContent = z.infer<typeof GeneratedPortfolioContentSchema>;
