import { z } from "zod";

export const AIJobTypeEnum = z.enum([
  "RESUME_EXTRACT",
  "PROFILE_NORMALIZE",
  "COMPLETENESS_ANALYZE",
  "CONTENT_GENERATE",
  "SECTION_REGENERATE",
  "FOLLOW_UP_GENERATE",
  "PATCH_APPLY",
  "DESIGN_PLANNING",
  "DESIGN_GENERATION",
  "SCENE_GENERATION",
]);
export type AIJobType = z.infer<typeof AIJobTypeEnum>;

export const AIJobStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
]);
export type AIJobStatus = z.infer<typeof AIJobStatusEnum>;

export const AIJobRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  portfolioId: z.string().optional(),
  type: AIJobTypeEnum,
  status: AIJobStatusEnum.default("PENDING"),
  progress: z.number().min(0).max(100).default(0),
  input: z.unknown(),
  output: z.unknown().optional(),
  error: z.string().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  completedAt: z.date().or(z.string()).optional(),
});
export type AIJobRecord = z.infer<typeof AIJobRecordSchema>;

export const AIUsageRecordSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  portfolioId: z.string().optional(),
  jobId: z.string().optional(),
  provider: z.string().default("openai"),
  model: z.string(),
  task: z.string(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  estimatedCost: z.number().default(0),
  createdAt: z.date().or(z.string()).optional(),
});
export type AIUsageRecord = z.infer<typeof AIUsageRecordSchema>;

export const AIErrorSchema = z.object({
  code: z.enum([
    "INVALID_REQUEST",
    "UNAUTHORIZED",
    "RATE_LIMIT_EXCEEDED",
    "SCHEMA_VALIDATION_FAILED",
    "PROVIDER_UNAVAILABLE",
    "TIMEOUT",
    "CONTENT_POLICY_VIOLATION",
    "INTERNAL_ERROR",
  ]),
  message: z.string(),
  details: z.unknown().optional(),
  retryable: z.boolean().default(false),
});
export type AIError = z.infer<typeof AIErrorSchema>;
