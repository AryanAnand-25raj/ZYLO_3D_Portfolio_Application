import { z } from "zod";

export const QuestionTypeEnum = z.enum(["required", "recommended", "optional"]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

export const FollowUpQuestionSchema = z.object({
  id: z.string(),
  section: z.string(),
  field: z.string(),
  question: z.string(),
  type: QuestionTypeEnum.default("recommended"),
  answer: z.string().default(""),
  skipped: z.boolean().default(false),
});
export type FollowUpQuestion = z.infer<typeof FollowUpQuestionSchema>;

export const MissingFieldItemSchema = z.object({
  field: z.string(),
  section: z.string(),
  reason: z.string(),
  type: QuestionTypeEnum.default("recommended"),
});
export type MissingFieldItem = z.infer<typeof MissingFieldItemSchema>;

export const CategoryScoreSchema = z.object({
  category: z.string(),
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  status: z.enum(["complete", "adequate", "incomplete"]),
});
export type CategoryScore = z.infer<typeof CategoryScoreSchema>;

export const CompletenessReportSchema = z.object({
  score: z.number().min(0).max(100),
  categoryScores: z.array(CategoryScoreSchema).default([]),
  requiredMissing: z.array(MissingFieldItemSchema).default([]),
  recommendedMissing: z.array(MissingFieldItemSchema).default([]),
  recommendations: z.array(z.string()).default([]),
  questions: z.array(FollowUpQuestionSchema).default([]),
  analyzedAt: z.string().optional(),
});
export type CompletenessReport = z.infer<typeof CompletenessReportSchema>;
