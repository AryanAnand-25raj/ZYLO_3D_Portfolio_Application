import { PortfolioData } from "@/schemas/portfolio.schema";

export type PublishStatus =
  | "draft"
  | "validating"
  | "building"
  | "deploying"
  | "published"
  | "failed"
  | "unpublished";

export type DeploymentStepStatus =
  | "queued"
  | "validating"
  | "building"
  | "uploading"
  | "deploying"
  | "success"
  | "failed";

export interface DeploymentLogEntry {
  timestamp: string;
  step: DeploymentStepStatus;
  message: string;
  level: "info" | "warn" | "error";
}

export interface PublishedPortfolioRecord {
  id: string;
  portfolioId: string;
  versionNumber: number;
  versionId: string;
  slug: string;
  status: "published" | "unpublished";
  deploymentUrl: string;
  snapshot: PortfolioData;
  publishedAt: string;
  updatedAt: string;
}

export interface DeploymentRecord {
  id: string;
  portfolioId: string;
  versionNumber: number;
  versionId: string;
  status: DeploymentStepStatus;
  provider: "edge_cdn" | "cloudflare" | "vercel";
  deploymentUrl: string;
  snapshot?: PortfolioData;
  logs: DeploymentLogEntry[];
  error?: string;
  startedAt: string;
  completedAt?: string;
  deployedAt?: string;
}

export interface DnsRecordInstruction {
  type: "CNAME" | "A" | "TXT";
  name: string;
  value: string;
  ttl?: number;
  purpose: "routing" | "verification";
}

export interface DomainRecord {
  id: string;
  portfolioId: string;
  hostname: string;
  type: "apex" | "subdomain";
  status: "pending" | "verified" | "failed";
  verificationToken: string;
  sslStatus: "pending" | "active" | "failed";
  dnsRecords: DnsRecordInstruction[];
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ValidationSeverity = "critical" | "warning";

export interface ValidationCheckItem {
  id: string;
  category:
    | "profile"
    | "content"
    | "theme"
    | "scene"
    | "assets"
    | "seo"
    | "performance"
    | "accessibility";
  name: string;
  passed: boolean;
  severity: ValidationSeverity;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  canPublish: boolean; // True if zero critical failures
  criticalErrorsCount: number;
  warningsCount: number;
  checks: ValidationCheckItem[];
}
