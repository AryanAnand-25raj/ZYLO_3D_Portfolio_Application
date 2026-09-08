export type UserRoleType = "USER" | "CREATOR" | "ADMIN" | "SUPER_ADMIN";

export type AuditAction =
  | "AUTH_LOGIN_SUCCESS"
  | "AUTH_LOGIN_FAILED"
  | "ADMIN_USER_DISABLED"
  | "ADMIN_USER_ENABLED"
  | "ADMIN_ROLE_UPDATED"
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_CANCELLED"
  | "SUBSCRIPTION_REACTIVATED"
  | "DOMAIN_VERIFIED"
  | "DOMAIN_REMOVED"
  | "PORTFOLIO_PUBLISHED"
  | "PORTFOLIO_UNPUBLISHED"
  | "PORTFOLIO_DELETED"
  | "INTEGRATION_CONNECTED"
  | "INTEGRATION_DISCONNECTED"
  | "DATA_EXPORTED"
  | "ACCOUNT_DELETED"
  | "RATE_LIMIT_EXCEEDED"
  | "SUSPICIOUS_UPLOAD_BLOCKED"
  | "PROMPT_INJECTION_DETECTED"
  | "UNAUTHORIZED_PATCH_BLOCKED";

export interface AuditLogRecord {
  id: string;
  userId?: string;
  actorEmail?: string;
  action: AuditAction;
  targetResource?: string;
  targetId?: string;
  status: "SUCCESS" | "FAILURE";
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface RateLimitConfig {
  windowMs: number; // e.g. 60,000 (1 minute)
  maxRequests: number; // e.g. 10
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // UNIX timestamp ms
  retryAfterSeconds?: number;
}

export interface FileValidationOptions {
  allowedExtensions: string[];
  allowedMimeTypes: string[];
  maxSizeBytes: number;
  category: "resume" | "model3d" | "texture" | "image";
}

export interface FileValidationResult {
  valid: boolean;
  sanitizedFilename: string;
  safeKey: string;
  error?: string;
}
