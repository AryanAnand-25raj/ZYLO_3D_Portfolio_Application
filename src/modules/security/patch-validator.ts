export interface PatchValidationResult {
  allowed: boolean;
  rejectedOperations: Array<{
    path: string;
    reason: string;
  }>;
}

const ALLOWED_PATH_ROOTS = [
  "content",
  "scene",
  "theme",
  "preferences",
  "sections",
  "profileData",
  "customization",
  "generatedContent",
];

const FORBIDDEN_SEGMENTS = new Set([
  "auth",
  "user",
  "users",
  "billing",
  "subscription",
  "subscriptions",
  "permissions",
  "role",
  "roles",
  "apicredentials",
  "apikey",
  "apikeys",
  "payment",
  "payments",
  "invoice",
  "invoices",
  "account",
  "accounts",
  "password",
  "secret",
  "customdomain",
]);

export class AIPatchSecurityValidator {
  /**
   * Validates a batch of JSON patch operations against strict security rules.
   * Disallows modifications to auth, users, billing, permissions, credentials, etc.
   */
  public static validate(
    operations: Array<{ path: string; op: string; value?: any }>
  ): PatchValidationResult {
    const rejected: Array<{ path: string; reason: string }> = [];

    for (const op of operations) {
      const check = this.validatePath(op.path);
      if (!check.allowed) {
        rejected.push({
          path: op.path,
          reason: check.reason || "Unauthorized patch path.",
        });
      }
    }

    return {
      allowed: rejected.length === 0,
      rejectedOperations: rejected,
    };
  }

  /**
   * Validates a single JSON patch path string.
   */
  public static validatePath(path: string): { allowed: boolean; reason?: string } {
    if (!path || typeof path !== "string") {
      return { allowed: false, reason: "Empty or malformed patch path." };
    }

    // Normalize path parts
    const parts = path
      .split("/")
      .filter(Boolean)
      .map((p) => p.toLowerCase());

    if (parts.length === 0) {
      return { allowed: false, reason: "Root modification is prohibited." };
    }

    // 1. Root allowlist check
    const rootSegment = parts[0];
    if (!ALLOWED_PATH_ROOTS.includes(rootSegment)) {
      return {
        allowed: false,
        reason: `Root segment '${rootSegment}' is not in the allowed portfolio patch catalog.`,
      };
    }

    // 2. Prohibited segment check in any part of the path
    for (const part of parts) {
      if (FORBIDDEN_SEGMENTS.has(part)) {
        return {
          allowed: false,
          reason: `Security violation: Path segment '${part}' targets protected system configuration.`,
        };
      }
    }

    return { allowed: true };
  }
}
