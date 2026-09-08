import { UserRoleType } from "../security/types";

export type HealthStatusLevel = "Operational" | "Degraded" | "Unavailable";

export interface SystemServiceHealth {
  service: string;
  category: "database" | "ai" | "storage" | "payments" | "integrations" | "deployments";
  status: HealthStatusLevel;
  latencyMs: number;
  lastCheckedAt: string;
  message?: string;
}

export interface AdminKPIOverview {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalPortfolios: number;
  publishedPortfolios: number;
  activeSubscriptions: number;
  totalRevenueInr: number;
  totalRevenueUsd: number;
  aiGenerationsToday: number;
  aiGenerationsThisMonth: number;
  systemStatus: HealthStatusLevel;
}

export interface AdminUserListItem {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRoleType;
  accountStatus: "ACTIVE" | "SUSPENDED" | "DELETED";
  portfolioCount: number;
  subscriptionTier: string;
  subscriptionStatus: string;
  createdAt: string;
  lastActiveAt?: string;
}

export interface AdminPortfolioListItem {
  id: string;
  slug: string;
  title: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  isPublished: boolean;
  template: string;
  customDomain: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAIUsageSummary {
  generationsToday: number;
  generationsThisMonth: number;
  totalTokensUsed: number;
  estimatedCostUsd: number;
  errorRatePercentage: number;
  topUsers: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    generationsCount: number;
    tokensUsed: number;
  }>;
}

export interface AdminDeploymentStats {
  totalDeployments: number;
  successfulDeployments: number;
  failedDeployments: number;
  averageDurationSeconds: number;
  currentFailures: Array<{
    id: string;
    portfolioId: string;
    portfolioTitle: string;
    domain?: string;
    errorMsg?: string;
    failedAt: string;
  }>;
}
