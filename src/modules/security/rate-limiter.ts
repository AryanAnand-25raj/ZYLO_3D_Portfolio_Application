import { RateLimitConfig, RateLimitResult } from "./types";

export type RateLimitBucketName =
  | "auth"
  | "ai"
  | "resume_upload"
  | "sync"
  | "publish"
  | "payment"
  | "domain_verify"
  | "general";

const DEFAULT_BUCKETS: Record<RateLimitBucketName, RateLimitConfig> = {
  auth: { windowMs: 60 * 1000, maxRequests: 10 },
  ai: { windowMs: 60 * 1000, maxRequests: 20 },
  resume_upload: { windowMs: 60 * 1000, maxRequests: 5 },
  sync: { windowMs: 60 * 1000, maxRequests: 10 },
  publish: { windowMs: 60 * 1000, maxRequests: 10 },
  payment: { windowMs: 60 * 1000, maxRequests: 10 },
  domain_verify: { windowMs: 60 * 1000, maxRequests: 10 },
  general: { windowMs: 60 * 1000, maxRequests: 60 },
};

// In-memory sliding window store: key -> array of timestamps (ms)
const rateLimitStore = new Map<string, number[]>();

export class CentralRateLimiter {
  /**
   * Resets rate limiter state (useful in test suites).
   */
  public static reset(): void {
    rateLimitStore.clear();
  }

  /**
   * Checks and consumes a rate-limit token for an identifier and bucket.
   */
  public static check(
    identifier: string,
    bucket: RateLimitBucketName = "general",
    customConfig?: Partial<RateLimitConfig>
  ): RateLimitResult {
    const config: RateLimitConfig = {
      ...DEFAULT_BUCKETS[bucket],
      ...customConfig,
    };

    const now = Date.now();
    const windowStart = now - config.windowMs;
    const storeKey = `${bucket}:${identifier}`;

    // Get previous timestamps in current window
    const timestamps = rateLimitStore.get(storeKey) || [];
    const validTimestamps = timestamps.filter((t) => t > windowStart);

    if (validTimestamps.length >= config.maxRequests) {
      const oldestTimestamp = validTimestamps[0];
      const resetTime = oldestTimestamp + config.windowMs;
      const retryAfterSeconds = Math.ceil(Math.max(1, (resetTime - now) / 1000));

      rateLimitStore.set(storeKey, validTimestamps);

      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime,
        retryAfterSeconds,
      };
    }

    // Add current timestamp and store
    validTimestamps.push(now);
    rateLimitStore.set(storeKey, validTimestamps);

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - validTimestamps.length,
      resetTime: now + config.windowMs,
    };
  }
}
