import { prisma } from "../../../../src/lib/db";
import { AIUsageRecord } from "../schemas/ai-job.schema";

export async function recordAIUsage(record: {
  userId: string;
  portfolioId?: string;
  jobId?: string;
  provider?: string;
  model: string;
  task: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost?: number;
}): Promise<void> {
  try {
    if (prisma && typeof (prisma as any).aIUsage?.create === "function") {
      await (prisma as any).aIUsage.create({
        data: {
          userId: record.userId,
          portfolioId: record.portfolioId,
          jobId: record.jobId,
          provider: record.provider || "openai",
          model: record.model,
          task: record.task,
          inputTokens: record.inputTokens,
          outputTokens: record.outputTokens,
          estimatedCost: record.estimatedCost || 0.0,
        },
      });
    }
  } catch (e) {
    // Non-blocking in development/offline test mode
    console.warn("[UsageTracker] Failed to record usage in DB (continuing safely):", e);
  }
}
