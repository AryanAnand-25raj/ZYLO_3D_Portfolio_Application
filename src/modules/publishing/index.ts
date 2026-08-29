export type DeploymentState = "QUEUED" | "BUILDING" | "DEPLOYED" | "FAILED" | "REMOVED";

export interface DeploymentSnapshot {
  portfolioId: string;
  slug: string;
  version: number;
  contentSnapshot: unknown;
  designSnapshot: unknown;
  sceneSnapshot: unknown;
  generatedAt: string;
}

export function generatePortfolioSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export function validateCustomDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}
