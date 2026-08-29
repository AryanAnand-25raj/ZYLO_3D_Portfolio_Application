export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  error?: string;
}

interface RequestRecord {
  timestamps: number[];
}

class SlidingWindowRateLimiter {
  private userRequests = new Map<string, RequestRecord>();
  private readonly maxRequestsPerMinute: number;
  private readonly maxRequestsPerHour: number;

  constructor(maxPerMinute = 20, maxPerHour = 100) {
    this.maxRequestsPerMinute = maxPerMinute;
    this.maxRequestsPerHour = maxPerHour;
  }

  public checkLimit(userId: string): RateLimitResult {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;

    let record = this.userRequests.get(userId);
    if (!record) {
      record = { timestamps: [] };
      this.userRequests.set(userId, record);
    }

    // Filter to last hour only
    record.timestamps = record.timestamps.filter((t) => t > oneHourAgo);

    const minuteCount = record.timestamps.filter((t) => t > oneMinuteAgo).length;
    const hourCount = record.timestamps.length;

    if (minuteCount >= this.maxRequestsPerMinute) {
      return {
        allowed: false,
        remaining: 0,
        resetSeconds: 60 - Math.floor((now - (record.timestamps[record.timestamps.length - 1] || now)) / 1000),
        error: "You've reached your AI generation rate limit. Please wait a moment before trying again.",
      };
    }

    if (hourCount >= this.maxRequestsPerHour) {
      return {
        allowed: false,
        remaining: 0,
        resetSeconds: 3600,
        error: "Hourly AI request limit reached. Please try again later.",
      };
    }

    // Record request
    record.timestamps.push(now);

    return {
      allowed: true,
      remaining: this.maxRequestsPerMinute - minuteCount - 1,
      resetSeconds: 60,
    };
  }

  public reset(userId: string) {
    this.userRequests.delete(userId);
  }
}

export const globalAIRateLimiter = new SlidingWindowRateLimiter(25, 120);
