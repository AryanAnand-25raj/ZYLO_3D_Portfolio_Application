import { prisma } from "../../../../src/lib/db";
import { AIUsageRecord } from "../schemas/ai-job.schema";

export interface QuotaCheckResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  error?: string;
}

// In-memory circuit breaker to prevent accidental infinite generation loops
const recentPromptHashes = new Map<string, { count: number; firstTimestamp: number }>();
const userMonthlyUsageCache = new Map<string, number>();

export class AICostControlService {
  public static readonly TIER_LIMITS: Record<string, number> = {
    FREE: 5,
    STARTER: 5,
    PRO: 50,
    AGENCY: 200,
  };

  public static readonly MAX_GENERATION_TOKENS = 4000;

  /**
   * Checks user monthly generation quota against their subscription tier.
   */
  public static checkUserMonthlyQuota(
    userId: string,
    tier: string = "FREE"
  ): QuotaCheckResult {
    const limit = this.TIER_LIMITS[tier.toUpperCase()] || 5;
    const used = userMonthlyUsageCache.get(userId) || 0;
    const remaining = Math.max(0, limit - used);

    if (used >= limit) {
      return {
        allowed: false,
        used,
        limit,
        remaining: 0,
        error: `Monthly AI generation quota reached (${used}/${limit}). Upgrade your plan to continue generating 3D portfolios.`,
      };
    }

    return {
      allowed: true,
      used,
      limit,
      remaining,
    };
  }

  /**
   * Increments the user's recorded generation count.
   */
  public static incrementUserUsage(userId: string): number {
    const current = userMonthlyUsageCache.get(userId) || 0;
    const next = current + 1;
    userMonthlyUsageCache.set(userId, next);
    return next;
  }

  /**
   * Prevents runaway infinite generation loops by tracking rapid repeated identical prompts.
   */
  public static detectInfiniteLoop(userId: string, promptHash: string): boolean {
    const key = `${userId}:${promptHash}`;
    const now = Date.now();
    const entry = recentPromptHashes.get(key);

    if (!entry) {
      recentPromptHashes.set(key, { count: 1, firstTimestamp: now });
      return false;
    }

    if (now - entry.firstTimestamp < 30000) {
      entry.count += 1;
      if (entry.count > 4) {
        // More than 4 identical requests in 30 seconds is flagged as a runaway loop
        return true;
      }
    } else {
      // Reset window
      recentPromptHashes.set(key, { count: 1, firstTimestamp: now });
    }

    return false;
  }

  /**
   * Clamps huge inputs to prevent excessive token cost exploitation.
   */
  public static clampInputPrompt(prompt: string, maxChars = 8000): { prompt: string; isClamped: boolean } {
    if (!prompt || prompt.length <= maxChars) {
      return { prompt, isClamped: false };
    }
    return {
      prompt: prompt.slice(0, maxChars) + "... [Content clamped for token limits]",
      isClamped: true,
    };
  }

  /**
   * Executes an AI request with retries, timeout, and safe deterministic fallback.
   */
  public static async executeWithFallback<T>(
    operation: () => Promise<T>,
    fallbackValue: T,
    options: { maxRetries?: number; timeoutMs?: number } = {}
  ): Promise<{ result: T; wasFallback: boolean; error?: string }> {
    const maxRetries = options.maxRetries ?? 2;
    const timeoutMs = options.timeoutMs ?? 15000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const promiseWithTimeout = Promise.race([
          operation(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("AI operation timed out")), timeoutMs)
          ),
        ]);

        const result = await promiseWithTimeout;
        return { result, wasFallback: false };
      } catch (err: any) {
        if (attempt === maxRetries) {
          console.warn(`[AIResilience] All ${maxRetries} attempts failed. Applying safe fallback:`, err?.message);
          return {
            result: fallbackValue,
            wasFallback: true,
            error: err?.message || "AI service temporarily unavailable. Using standard preset.",
          };
        }
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
      }
    }

    return { result: fallbackValue, wasFallback: true };
  }

  public static resetCaches(): void {
    recentPromptHashes.clear();
    userMonthlyUsageCache.clear();
  }
}

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
  // Track in local cost controller
  AICostControlService.incrementUserUsage(record.userId);

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
