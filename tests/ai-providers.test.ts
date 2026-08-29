import { describe, it, expect } from "vitest";
import { MockAIProvider } from "../packages/ai/src/providers/mock-ai-provider";
import { getAIProvider } from "../packages/ai/src/providers/provider-factory";
import { globalAIRateLimiter } from "../packages/ai/src/rate-limiting/rate-limiter";
import { CanonicalProfileSchema } from "../packages/ai/src/schemas/canonical-profile.schema";
import { PortfolioContentSchema } from "../packages/ai/src/schemas/portfolio-content.schema";

describe("AI Providers & Rate Limiting Subsystem", () => {
  it("MockAIProvider generates structured outputs for all AIJobTypes", async () => {
    const provider = new MockAIProvider();

    // Profile Normalization
    const normRes = await provider.generateStructuredOutput({
      task: "PROFILE_NORMALIZE",
      systemPrompt: "system",
      userPrompt: "user",
      schema: CanonicalProfileSchema,
    });
    expect(normRes.success).toBe(true);
    expect(normRes.data).toBeDefined();
    expect(normRes.usage.totalTokens).toBeGreaterThan(0);

    // Content Generation
    const contentRes = await provider.generateStructuredOutput({
      task: "CONTENT_GENERATE",
      systemPrompt: "system",
      userPrompt: "user",
      schema: PortfolioContentSchema,
    });
    expect(contentRes.success).toBe(true);
    expect(contentRes.data).toBeDefined();
  });

  it("provider-factory returns MockAIProvider when in test or without API key", () => {
    const provider = getAIProvider(true);
    expect(provider.name).toBe("mock");
  });

  it("SlidingWindowRateLimiter throttles users exceeding the per-minute threshold", () => {
    const testUserId = "user-rate-test-123";
    globalAIRateLimiter.reset(testUserId);

    // Run within allowance
    for (let i = 0; i < 24; i++) {
      const check = globalAIRateLimiter.checkLimit(testUserId);
      expect(check.allowed).toBe(true);
    }

    // 25th request allowed
    const finalAllowed = globalAIRateLimiter.checkLimit(testUserId);
    expect(finalAllowed.allowed).toBe(true);

    // 26th request blocked
    const blocked = globalAIRateLimiter.checkLimit(testUserId);
    expect(blocked.allowed).toBe(false);
    expect(blocked.error).toContain("rate limit");

    // Clean up
    globalAIRateLimiter.reset(testUserId);
  });
});
