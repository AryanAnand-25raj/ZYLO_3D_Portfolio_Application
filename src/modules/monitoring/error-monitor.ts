export type ErrorCategory =
  | "SERVER"
  | "CLIENT"
  | "THREE_RUNTIME"
  | "DEPLOYMENT"
  | "PAYMENT"
  | "AI";

export interface ErrorReport {
  id: string;
  category: ErrorCategory;
  message: string;
  fingerprint: string;
  stack?: string;
  context: Record<string, any>;
  count: number;
  firstSeenAt: string;
  lastSeenAt: string;
}

const inMemoryErrors = new Map<string, ErrorReport>();

const SENSITIVE_FIELDS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "password",
  "token",
  "secret",
  "cardnumber",
  "cvv",
  "apikey",
]);

export class ErrorMonitoringService {
  public static resetState(): void {
    inMemoryErrors.clear();
  }

  /**
   * Captures, sanitizes, and aggregates an application runtime error.
   */
  public static captureError(
    category: ErrorCategory,
    error: Error | string,
    rawContext: Record<string, any> = {}
  ): ErrorReport {
    const message = typeof error === "string" ? error : error.message || "Unknown error";
    const stack = typeof error === "object" ? error.stack : undefined;
    const sanitizedContext = this.sanitizePayload(rawContext);

    // Generate fingerprint for deduplication
    const fingerprint = `${category}:${message.slice(0, 80)}`;
    const now = new Date().toISOString();

    const existing = inMemoryErrors.get(fingerprint);
    if (existing) {
      existing.count++;
      existing.lastSeenAt = now;
      existing.context = { ...existing.context, ...sanitizedContext };
      return existing;
    }

    const report: ErrorReport = {
      id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      category,
      message,
      fingerprint,
      stack,
      context: sanitizedContext,
      count: 1,
      firstSeenAt: now,
      lastSeenAt: now,
    };

    inMemoryErrors.set(fingerprint, report);
    return report;
  }

  /**
   * Retrieves summary statistics of captured errors.
   */
  public static getStats(): {
    totalErrors: number;
    byCategory: Record<ErrorCategory, number>;
    recentErrors: ErrorReport[];
  } {
    const all = Array.from(inMemoryErrors.values());
    const byCategory: Record<ErrorCategory, number> = {
      SERVER: 0,
      CLIENT: 0,
      THREE_RUNTIME: 0,
      DEPLOYMENT: 0,
      PAYMENT: 0,
      AI: 0,
    };

    let totalErrors = 0;
    for (const item of all) {
      byCategory[item.category] += item.count;
      totalErrors += item.count;
    }

    const recentErrors = all
      .sort((a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime())
      .slice(0, 20);

    return {
      totalErrors,
      byCategory,
      recentErrors,
    };
  }

  /**
   * Strips auth tokens, secrets, and PII from error context dictionaries.
   */
  public static sanitizePayload(obj: Record<string, any>): Record<string, any> {
    if (!obj || typeof obj !== "object") return {};

    const clean: any = Array.isArray(obj) ? [] : {};
    for (const [key, val] of Object.entries(obj)) {
      const lower = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (SENSITIVE_FIELDS.has(lower)) {
        clean[key] = "[FILTERED_SECRET]";
      } else if (typeof val === "object" && val !== null) {
        clean[key] = this.sanitizePayload(val);
      } else {
        clean[key] = val;
      }
    }
    return clean;
  }
}
