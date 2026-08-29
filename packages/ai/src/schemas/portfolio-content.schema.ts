import { z } from "zod";
import { ProjectStatSchema } from "./canonical-profile.schema";

export const ContentStylePresetEnum = z.enum([
  "Professional",
  "Minimal",
  "Technical",
  "Creative",
  "Bold",
  "Friendly",
  "Executive",
]);
export type ContentStylePreset = z.infer<typeof ContentStylePresetEnum>;

export const HeroContentSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  badge: z.string().min(1),
  ctaText: z.string().min(1),
  secondaryCtaText: z.string().min(1),
});
export type HeroContent = z.infer<typeof HeroContentSchema>;

export const AboutContentSchema = z.object({
  title: z.string().default("About"),
  tagline: z.string(),
  body: z.string(),
  highlights: z.array(z.string()).default([]),
});
export type AboutContent = z.infer<typeof AboutContentSchema>;

export const ExperienceSummarySchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  duration: z.string(),
  impactSummary: z.string(),
  keyTechnologies: z.array(z.string()).default([]),
});
export type ExperienceSummary = z.infer<typeof ExperienceSummarySchema>;

export const GeneratedProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  summary: z.string(),
  description: z.string(),
  technologies: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  demoUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  impactMetrics: z.array(ProjectStatSchema).default([]),
});
export type GeneratedProject = z.infer<typeof GeneratedProjectSchema>;

export const GeneratedSkillItemSchema = z.object({
  name: z.string(),
  proficiency: z.number().min(0).max(100).default(80),
  highlight: z.boolean().default(false),
});
export type GeneratedSkillItem = z.infer<typeof GeneratedSkillItemSchema>;

export const SkillsMatrixCategorySchema = z.object({
  category: z.string(),
  description: z.string().optional(),
  skills: z.array(GeneratedSkillItemSchema),
});
export type SkillsMatrixCategory = z.infer<typeof SkillsMatrixCategorySchema>;

export const GeneratedServiceSchema = z.object({
  title: z.string(),
  description: z.string(),
});
export type GeneratedService = z.infer<typeof GeneratedServiceSchema>;

export const CallToActionContentSchema = z.object({
  heading: z.string(),
  description: z.string(),
  buttonText: z.string(),
});
export type CallToActionContent = z.infer<typeof CallToActionContentSchema>;

export const ContactCopySchema = z.object({
  heading: z.string().default("Get In Touch"),
  description: z.string(),
  formPlaceholder: z.string().default("Leave a message about your project or inquiry..."),
});
export type ContactCopy = z.infer<typeof ContactCopySchema>;

export const SEOMetadataSchema = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  openGraphDescription: z.string().optional(),
});
export type SEOMetadata = z.infer<typeof SEOMetadataSchema>;

export const PortfolioContentSchema = z.object({
  style: ContentStylePresetEnum.default("Professional"),
  hero: HeroContentSchema,
  about: AboutContentSchema,
  experienceSummaries: z.array(ExperienceSummarySchema).default([]),
  projects: z.array(GeneratedProjectSchema).default([]),
  skillsMatrix: z.array(SkillsMatrixCategorySchema).default([]),
  services: z.array(GeneratedServiceSchema).default([]),
  callToAction: CallToActionContentSchema,
  contactCopy: ContactCopySchema,
  seo: SEOMetadataSchema,
  generatedAt: z.string().optional(),
});
export type PortfolioContent = z.infer<typeof PortfolioContentSchema>;
