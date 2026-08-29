import { z } from "zod";

export const DataSourceEnum = z.enum(["manual", "resume", "github", "linkedin", "ai"]);
export type DataSource = z.infer<typeof DataSourceEnum>;

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  headline: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  profileImage: z.string().url().optional().or(z.literal("")),
  availableForHire: z.boolean().default(true),
});
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;

export const SkillItemSchema = z.object({
  name: z.string().min(1),
  proficiency: z.number().min(0).max(100).default(80),
  category: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  source: DataSourceEnum.default("manual"),
});
export type SkillItem = z.infer<typeof SkillItemSchema>;

export const SkillCategorySchema = z.object({
  id: z.string(),
  category: z.string().min(1),
  skills: z.array(SkillItemSchema),
});
export type SkillCategory = z.infer<typeof SkillCategorySchema>;

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string(),
  highlights: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  source: DataSourceEnum.default("manual"),
});
export type Experience = z.infer<typeof ExperienceSchema>;

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  grade: z.string().optional(),
  activities: z.array(z.string()).optional(),
  source: DataSourceEnum.default("manual"),
});
export type Education = z.infer<typeof EducationSchema>;

export const ProjectStatSchema = z.object({
  label: z.string(),
  value: z.string(),
});
export type ProjectStat = z.infer<typeof ProjectStatSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  slug: z.string().min(1),
  summary: z.string(),
  description: z.string(),
  category: z.string().default("3D Web Graphics"),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  imageUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  stats: z.array(ProjectStatSchema).default([]),
  stars: z.number().optional(),
  forks: z.number().optional(),
  source: DataSourceEnum.default("manual"),
});
export type Project = z.infer<typeof ProjectSchema>;

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  issuer: z.string().min(1),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  credentialId: z.string().optional(),
});
export type Certification = z.infer<typeof CertificationSchema>;

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  date: z.string().optional(),
  description: z.string(),
  url: z.string().url().optional().or(z.literal("")),
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const PublicationSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  publisher: z.string().optional(),
  date: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});
export type Publication = z.infer<typeof PublicationSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  icon: z.string().optional(),
});
export type Service = z.infer<typeof ServiceSchema>;

export const SocialLinkSchema = z.object({
  platform: z.enum([
    "github",
    "linkedin",
    "twitter",
    "website",
    "instagram",
    "youtube",
    "behance",
    "dribbble",
  ]),
  url: z.string().url(),
  label: z.string().optional(),
});
export type SocialLink = z.infer<typeof SocialLinkSchema>;

export const CanonicalProfileSchema = z.object({
  personal: PersonalInfoSchema,
  summary: z.string().optional(),
  skills: z.array(SkillCategorySchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  achievements: z.array(AchievementSchema).default([]),
  publications: z.array(PublicationSchema).default([]),
  services: z.array(ServiceSchema).default([]),
  socials: z.array(SocialLinkSchema).default([]),
  sourceMetadata: z.object({
    resume: z.boolean().default(false),
    github: z.boolean().default(false),
    linkedin: z.boolean().default(false),
    manual: z.boolean().default(true),
    normalizedAt: z.string().optional(),
  }).default({ resume: false, github: false, linkedin: false, manual: true }),
});
export type CanonicalProfile = z.infer<typeof CanonicalProfileSchema>;
