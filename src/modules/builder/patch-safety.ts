export interface PatchOperation {
  op: "add" | "remove" | "replace";
  path: string;
  value?: any;
}

export interface PatchSafetyResult {
  safe: boolean;
  blockedOperations: Array<{ op: PatchOperation; reason: string }>;
  allowedOperations: PatchOperation[];
}

/**
 * Whitelist patterns permitted for visual portfolio edits.
 * Only visual, textual, design, layout, motion, and scene parameters can be altered.
 */
const ALLOWED_PATH_PREFIXES = [
  "/content/",
  "/design/",
  "/theme/",
  "/scene/",
  "/metadata/title",
  "/metadata/description",
  "/metadata/seo/",
];

/**
 * Blacklist patterns strictly forbidden from modification.
 */
const BLOCKED_PATH_PREFIXES = [
  "/auth",
  "/users",
  "/user",
  "/billing",
  "/subscription",
  "/database",
  "/admin",
  "/permissions",
  "/roles",
  "/id",
  "/userId",
  "__proto__",
  "constructor",
  "prototype",
];

export class PatchSafetyValidator {
  /**
   * Evaluates a list of patch operations against strict safety policies.
   */
  public static validatePatches(operations: PatchOperation[]): PatchSafetyResult {
    const allowedOperations: PatchOperation[] = [];
    const blockedOperations: Array<{ op: PatchOperation; reason: string }> = [];

    for (const op of operations) {
      const normalizedPath = op.path.trim();

      // Check for prototype pollution attempts
      if (
        normalizedPath.includes("__proto__") ||
        normalizedPath.includes("constructor") ||
        normalizedPath.includes("prototype")
      ) {
        blockedOperations.push({
          op,
          reason: "Security Alert: Prototype pollution forbidden.",
        });
        continue;
      }

      // Check against forbidden prefixes
      const isBlocked = BLOCKED_PATH_PREFIXES.some((blocked) =>
        normalizedPath.toLowerCase().startsWith(blocked.toLowerCase())
      );
      if (isBlocked) {
        blockedOperations.push({
          op,
          reason: `Security Alert: Path "${normalizedPath}" accesses sensitive user/billing/auth domain.`,
        });
        continue;
      }

      // Check against allowed whitelist
      const isAllowed = ALLOWED_PATH_PREFIXES.some((allowed) =>
        normalizedPath.startsWith(allowed)
      );

      if (!isAllowed) {
        blockedOperations.push({
          op,
          reason: `Forbidden Path: "${normalizedPath}" is not within the registered portfolio customization whitelist.`,
        });
        continue;
      }

      allowedOperations.push(op);
    }

    return {
      safe: blockedOperations.length === 0,
      allowedOperations,
      blockedOperations,
    };
  }
}
