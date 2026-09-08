import { db } from "@/lib/db";
import { AuditAction, AuditLogRecord } from "./types";

const inMemoryAuditLogs = new Map<string, AuditLogRecord>();

const REDACTED_KEYS = new Set([
  "password",
  "secret",
  "token",
  "accesstoken",
  "refreshtoken",
  "authorization",
  "creditcard",
  "cardnumber",
  "cvv",
  "apikey",
  "keysecret",
  "webhooksecret",
]);

export class AuditLogger {
  /**
   * Resets in-memory audit logs (useful in test suites).
   */
  public static resetState(): void {
    inMemoryAuditLogs.clear();
  }

  /**
   * Records a security or administrative audit log.
   */
  public static async log(entry: {
    userId?: string;
    actorEmail?: string;
    action: AuditAction;
    targetResource?: string;
    targetId?: string;
    status?: "SUCCESS" | "FAILURE";
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLogRecord> {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const sanitizedDetails = this.redactSensitiveData(entry.details || {});
    const maskedIp = this.maskIpAddress(entry.ipAddress);

    const record: AuditLogRecord = {
      id,
      userId: entry.userId,
      actorEmail: entry.actorEmail,
      action: entry.action,
      targetResource: entry.targetResource,
      targetId: entry.targetId,
      status: entry.status || "SUCCESS",
      details: sanitizedDetails,
      ipAddress: maskedIp,
      userAgent: entry.userAgent,
      createdAt: now,
    };

    inMemoryAuditLogs.set(id, record);

    try {
      await (db as any).auditLog.create({
        data: {
          id: record.id,
          userId: record.userId,
          actorEmail: record.actorEmail,
          action: record.action,
          targetResource: record.targetResource,
          targetId: record.targetId,
          status: record.status,
          details: record.details,
          ipAddress: record.ipAddress,
          userAgent: record.userAgent,
          createdAt: new Date(record.createdAt),
        },
      });
    } catch {
      // In-memory fallback
    }

    return record;
  }

  /**
   * Retrieves audit logs with optional filtering, sorting, and pagination.
   */
  public static async query(options?: {
    userId?: string;
    action?: AuditAction;
    targetResource?: string;
    status?: "SUCCESS" | "FAILURE";
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLogRecord[]; total: number }> {
    const all = Array.from(inMemoryAuditLogs.values());

    let filtered = all;
    if (options?.userId) {
      filtered = filtered.filter((l) => l.userId === options.userId);
    }
    if (options?.action) {
      filtered = filtered.filter((l) => l.action === options.action);
    }
    if (options?.targetResource) {
      filtered = filtered.filter((l) => l.targetResource === options.targetResource);
    }
    if (options?.status) {
      filtered = filtered.filter((l) => l.status === options.status);
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || 50;
    const logs = filtered.slice(offset, offset + limit);

    return { logs, total };
  }

  /**
   * Recursively redacts sensitive keys such as passwords, tokens, API keys, and CVVs.
   */
  public static redactSensitiveData(obj: Record<string, any>): Record<string, any> {
    if (!obj || typeof obj !== "object") return obj;

    const sanitized: any = Array.isArray(obj) ? [] : {};

    for (const [key, val] of Object.entries(obj)) {
      const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (REDACTED_KEYS.has(cleanKey)) {
        sanitized[key] = "[REDACTED]";
      } else if (typeof val === "object" && val !== null) {
        sanitized[key] = this.redactSensitiveData(val);
      } else {
        sanitized[key] = val;
      }
    }

    return sanitized;
  }

  /**
   * Masks client IP addresses for privacy compliance (e.g. 192.168.1.50 -> 192.168.1.***).
   */
  public static maskIpAddress(ip?: string): string | undefined {
    if (!ip || typeof ip !== "string") return undefined;

    // IPv4
    if (ip.includes(".")) {
      const parts = ip.split(".");
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
      }
    }

    // IPv6
    if (ip.includes(":")) {
      const parts = ip.split(":");
      if (parts.length > 2) {
        return `${parts[0]}:${parts[1]}:****:****`;
      }
    }

    return "masked_ip";
  }
}
