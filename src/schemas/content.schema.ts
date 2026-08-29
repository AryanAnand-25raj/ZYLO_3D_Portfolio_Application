import { z } from "zod";

export const SocialLinkSchema = z.object({
  platform: z.enum([
    "github",
    "linkedin",
    "twitter",
    "youtube",
    "dribbble",
    "behance",
    "figma",
    "instagram",
    "website",
    "email",
  ]),
  url: z.string().url("Must be a valid URL"),
  label: z.string().optional(),
});

export const ExperienceSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().max(2000).default(""),
  highlights: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

export const ProjectSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  title: z.string().min(1, "Project title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().max(300, "Summary must be under 300 characters"),
  description: z.string().max(5000).default(""),
  category: z.string().default("Web App"),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  stats: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .default([]),
});

export const SkillCategorySchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  category: z.string().min(1, "Category name is required"),
  skills: z.array(
    z.object({
      name: z.string().min(1),
      proficiency: z.number().min(0).max(100).optional(),
      icon: z.string().optional(),
    })
  ),
});

export const EducationSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  grade: z.string().optional(),
});

export const ProfileHeaderSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  headline: z.string().max(160, "Headline must be under 160 characters"),
  bio: z.string().max(1500).default(""),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  availableForHire: z.boolean().default(true),
  badgeText: z.string().default("Available for projects"),
});

export const ContentSchema = z.object({
  profile: ProfileHeaderSchema,
  socials: z.array(SocialLinkSchema).default([]),
  experiences: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  skillCategories: z.array(SkillCategorySchema).default([]),
  education: z.array(EducationSchema).default([]),
  customSections: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
      })
    )
    .default([]),
});

export type ContentData = z.infer<typeof ContentSchema>;
export type ProfileHeader = z.infer<typeof ProfileHeaderSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Education = z.infer<typeof EducationSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
