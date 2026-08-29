import { z } from "zod";
import { ContentSchema } from "./content.schema";

export const DataSourceEnum = z.enum(["resume", "manual", "github", "linkedin", "ai"]);
export type DataSource = z.infer<typeof DataSourceEnum>;

export const SourceTrackedValueSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    value: valueSchema,
    source: DataSourceEnum,
    confidence: z.number().min(0).max(1).optional(),
    updatedAt: z.string().default(() => new Date().toISOString()),
  });

export const DataConflictSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  field: z.string(),
  section: z.string().default("profile"),
  label: z.string().optional(),
  values: z.array(
    z.object({
      source: DataSourceEnum,
      value: z.unknown(),
      timestamp: z.string().default(() => new Date().toISOString()),
    })
  ),
  resolved: z.boolean().default(false),
  resolvedValue: z.unknown().optional(),
});
export type DataConflict = z.infer<typeof DataConflictSchema>;

export const TargetAudienceEnum = z.enum([
  "Recruiters",
  "Clients",
  "Freelance Clients",
  "Employers",
  "Creative Agencies",
  "General Audience",
]);
export type TargetAudience = z.infer<typeof TargetAudienceEnum>;

export const PortfolioGoalEnum = z.enum([
  "Get a Job",
  "Get Freelance Work",
  "Showcase Projects",
  "Build Personal Brand",
  "Academic Portfolio",
]);
export type PortfolioGoal = z.infer<typeof PortfolioGoalEnum>;

export const VisualIntensityEnum = z.enum([
  "Minimal",
  "Balanced",
  "Highly Interactive",
  "Cinematic",
]);
export type VisualIntensity = z.infer<typeof VisualIntensityEnum>;

export const StylePresetEnum = z.enum([
  "Minimal",
  "Professional",
  "Futuristic",
  "Cyberpunk",
  "Space",
  "Creative",
  "Luxury",
  "Glass",
  "Editorial",
  "Experimental",
]);
export type StylePreset = z.infer<typeof StylePresetEnum>;

export const SectionEnum = z.enum([
  "Hero",
  "About",
  "Experience",
  "Skills",
  "Projects",
  "Education",
  "Certifications",
  "GitHub",
  "Contact",
  "Resume",
]);
export type SectionName = z.infer<typeof SectionEnum>;

export const StylePreferencesSchema = z.object({
  preset: StylePresetEnum.default("Futuristic"),
  stylePrompt: z.string().max(2000).default(""),
  targetAudience: TargetAudienceEnum.default("Employers"),
  portfolioGoal: PortfolioGoalEnum.default("Get a Job"),
  visualIntensity: VisualIntensityEnum.default("Highly Interactive"),
  selectedSections: z
    .array(SectionEnum)
    .default(["Hero", "About", "Experience", "Skills", "Projects", "Contact"]),
});
export type StylePreferences = z.infer<typeof StylePreferencesSchema>;

export const FollowUpQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  section: z.string().default("general"),
  context: z.string().optional(),
  answer: z.string().default(""),
  skipped: z.boolean().default(false),
});
export type FollowUpQuestion = z.infer<typeof FollowUpQuestionSchema>;

export const CompletenessResultSchema = z.object({
  score: z.number().min(0).max(100),
  missing: z.array(z.string()),
  recommendations: z.array(z.string()),
  questions: z.array(FollowUpQuestionSchema),
});
export type CompletenessResult = z.infer<typeof CompletenessResultSchema>;

export const PortfolioDraftSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  currentStep: z
    .enum(["profile", "resume", "review", "style", "generate", "result"])
    .default("profile"),
  profileData: ContentSchema,
  extractedData: z.record(z.unknown()).optional(),
  canonicalProfile: ContentSchema.optional(),
  preferences: StylePreferencesSchema.default({}),
  conflicts: z.array(DataConflictSchema).default([]),
  completeness: CompletenessResultSchema.optional(),
  generatedContent: z.record(z.unknown()).optional(),
  updatedAt: z.string().default(() => new Date().toISOString()),
});
export type PortfolioDraft = z.infer<typeof PortfolioDraftSchema>;
