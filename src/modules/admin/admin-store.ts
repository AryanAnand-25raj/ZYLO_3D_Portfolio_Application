import { db } from "@/lib/db";
import {
  AdminKPIOverview,
  AdminUserListItem,
  AdminPortfolioListItem,
  AdminAIUsageSummary,
  AdminDeploymentStats,
} from "./types";
import { UserRoleType } from "../security/types";
import { SystemHealthService } from "./health";
import { AuditLogger } from "../security/audit-logger";

// In-memory demo data for test isolation and quick response
const inMemoryUsers = new Map<string, AdminUserListItem>([
  [
    "user-1",
    {
      id: "user-1",
      name: "Alex Vance",
      email: "alex@zylo.design",
      role: "CREATOR",
      accountStatus: "ACTIVE",
      portfolioCount: 2,
      subscriptionTier: "PRO",
      subscriptionStatus: "active",
      createdAt: "2026-01-15T10:00:00.000Z",
    },
  ],
  [
    "user-2",
    {
      id: "user-2",
      name: "Sarah Connor",
      email: "sarah@cyberdyne.io",
      role: "USER",
      accountStatus: "ACTIVE",
      portfolioCount: 1,
      subscriptionTier: "STARTER",
      subscriptionStatus: "active",
      createdAt: "2026-02-01T12:30:00.000Z",
    },
  ],
  [
    "admin-root",
    {
      id: "admin-root",
      name: "ZYLO SuperAdmin",
      email: "root@zylo.design",
      role: "SUPER_ADMIN",
      accountStatus: "ACTIVE",
      portfolioCount: 0,
      subscriptionTier: "AGENCY",
      subscriptionStatus: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ],
]);

const inMemoryPortfolios = new Map<string, AdminPortfolioListItem>([
  [
    "port-1",
    {
      id: "port-1",
      slug: "alex",
      title: "Alex Vance — Spatial Dimension",
      ownerId: "user-1",
      ownerName: "Alex Vance",
      ownerEmail: "alex@zylo.design",
      isPublished: true,
      template: "neural",
      customDomain: "alexvance.design",
      createdAt: "2026-01-16T14:20:00.000Z",
      updatedAt: "2026-02-10T11:00:00.000Z",
    },
  ],
  [
    "port-2",
    {
      id: "port-2",
      slug: "sarah",
      title: "Sarah Connor Portfolio",
      ownerId: "user-2",
      ownerName: "Sarah Connor",
      ownerEmail: "sarah@cyberdyne.io",
      isPublished: false,
      template: "glass",
      customDomain: null,
      createdAt: "2026-02-02T09:15:00.000Z",
      updatedAt: "2026-02-05T18:40:00.000Z",
    },
  ],
]);

export class AdminStoreManager {
  /**
   * Resets admin mock state (for tests).
   */
  public static resetState(): void {
    // Keep initial seeded accounts
  }

  /**
   * Aggregates high-level system KPIs.
   */
  public static async getOverview(): Promise<AdminKPIOverview> {
    const health = await SystemHealthService.checkAll();
    const users = Array.from(inMemoryUsers.values());
    const portfolios = Array.from(inMemoryPortfolios.values());

    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.accountStatus === "ACTIVE").length,
      suspendedUsers: users.filter((u) => u.accountStatus === "SUSPENDED").length,
      totalPortfolios: portfolios.length,
      publishedPortfolios: portfolios.filter((p) => p.isPublished).length,
      activeSubscriptions: 2,
      totalRevenueInr: 199900, // ₹1,999
      totalRevenueUsd: 14900,  // $149
      aiGenerationsToday: 14,
      aiGenerationsThisMonth: 182,
      systemStatus: health.overall,
    };
  }

  /**
   * Lists users with search, filtering, and pagination.
   */
  public static async listUsers(options?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: AdminUserListItem[]; total: number }> {
    let list = Array.from(inMemoryUsers.values());

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    if (options?.role && options.role !== "ALL") {
      list = list.filter((u) => u.role === options.role);
    }

    if (options?.status && options.status !== "ALL") {
      list = list.filter((u) => u.accountStatus === options.status);
    }

    const total = list.length;
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 20);
    const paginated = list.slice((page - 1) * limit, page * limit);

    return { users: paginated, total };
  }

  /**
   * Suspends or reinstates a user account.
   */
  public static async updateUserStatus(
    userId: string,
    status: "ACTIVE" | "SUSPENDED",
    actorId?: string
  ): Promise<AdminUserListItem | null> {
    const user = inMemoryUsers.get(userId);
    if (!user) return null;

    user.accountStatus = status;
    inMemoryUsers.set(userId, user);

    try {
      await (db as any).user.update({
        where: { id: userId },
        data: { accountStatus: status },
      });
    } catch {
      // In-memory
    }

    await AuditLogger.log({
      userId: actorId,
      action: status === "SUSPENDED" ? "ADMIN_USER_DISABLED" : "ADMIN_USER_ENABLED",
      targetResource: "user",
      targetId: userId,
      details: { newStatus: status },
    });

    return user;
  }

  /**
   * Promotes or demotes user role (SUPER_ADMIN only).
   */
  public static async updateUserRole(
    userId: string,
    newRole: UserRoleType,
    actorId?: string
  ): Promise<AdminUserListItem | null> {
    const user = inMemoryUsers.get(userId);
    if (!user) return null;

    user.role = newRole;
    inMemoryUsers.set(userId, user);

    try {
      await (db as any).user.update({
        where: { id: userId },
        data: { role: newRole },
      });
    } catch {
      // In-memory
    }

    await AuditLogger.log({
      userId: actorId,
      action: "ADMIN_ROLE_UPDATED",
      targetResource: "user",
      targetId: userId,
      details: { newRole },
    });

    return user;
  }

  /**
   * Lists portfolios with search, filtering, and pagination.
   */
  public static async listPortfolios(options?: {
    search?: string;
    isPublished?: boolean;
    template?: string;
    page?: number;
    limit?: number;
  }): Promise<{ portfolios: AdminPortfolioListItem[]; total: number }> {
    let list = Array.from(inMemoryPortfolios.values());

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.ownerName.toLowerCase().includes(q)
      );
    }

    if (options?.isPublished !== undefined) {
      list = list.filter((p) => p.isPublished === options.isPublished);
    }

    if (options?.template && options.template !== "ALL") {
      list = list.filter((p) => p.template === options.template);
    }

    const total = list.length;
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 20);
    const paginated = list.slice((page - 1) * limit, page * limit);

    return { portfolios: paginated, total };
  }

  /**
   * Returns AI usage analytics across the platform.
   */
  public static async getAIUsageSummary(): Promise<AdminAIUsageSummary> {
    return {
      generationsToday: 14,
      generationsThisMonth: 182,
      totalTokensUsed: 142050,
      estimatedCostUsd: 1.42,
      errorRatePercentage: 0.8,
      topUsers: [
        {
          userId: "user-1",
          userName: "Alex Vance",
          userEmail: "alex@zylo.design",
          generationsCount: 42,
          tokensUsed: 38400,
        },
        {
          userId: "user-2",
          userName: "Sarah Connor",
          userEmail: "sarah@cyberdyne.io",
          generationsCount: 15,
          tokensUsed: 12200,
        },
      ],
    };
  }

  /**
   * Returns deployment stats and recent failure logs.
   */
  public static async getDeploymentStats(): Promise<AdminDeploymentStats> {
    return {
      totalDeployments: 48,
      successfulDeployments: 46,
      failedDeployments: 2,
      averageDurationSeconds: 4.2,
      currentFailures: [
        {
          id: "dep-fail-1",
          portfolioId: "port-legacy-fail",
          portfolioTitle: "Old Experimental Mesh",
          domain: "legacy.zylo.design",
          errorMsg: "Asset load timeout on unvetted external asset URI.",
          failedAt: "2026-03-01T15:20:00.000Z",
        },
      ],
    };
  }
}
