import { z } from "zod";
import { AIJobType } from "../schemas/ai-job.schema";

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AIRequest<TInput = unknown> {
  task: AIJobType;
  systemPrompt: string;
  userPrompt: string;
  inputData?: TInput;
  schema?: z.ZodType<unknown>;
  schemaName?: string;
  temperature?: number;
  maxTokens?: number;
  userId?: string;
  portfolioId?: string;
}

export interface AIResponse<TOutput = unknown> {
  success: boolean;
  data: TOutput;
  rawText?: string;
  usage: TokenUsage;
  model: string;
  provider: string;
  latencyMs: number;
  error?: string;
}

export interface AIProvider {
  name: string;
  generateStructuredOutput<T>(request: AIRequest): Promise<AIResponse<T>>;
  estimateCost(promptTokens: number, completionTokens: number, model?: string): number;
}
