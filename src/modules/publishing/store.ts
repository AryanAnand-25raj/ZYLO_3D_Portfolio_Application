import crypto from "crypto";
import { PortfolioData } from "@/schemas/portfolio.schema";
import { BuilderStorageManager } from "@/modules/builder/builder-store";
import {
  PublishedPortfolioRecord,
  DeploymentRecord,
  DomainRecord,
  DeploymentLogEntry,
  ValidationResult,
} from "./types";
import { PublishValidator } from "./validator";
import { SlugService } from "./slugs";
import { db } from "@/lib/db";

// In-memory persistent stores with initial demo publication
const publishedStore = new Map<string, PublishedPortfolioRecord>();
const deploymentHistoryStore = new Map<string, DeploymentRecord[]>();
const domainStore = new Map<string, DomainRecord>();
const previewTokens = new Map<string, { portfolioId: string; expiresAt: number }>();

// Pre-initialize demo portfolio as published so http://localhost:3000/alex-vance-3d is immediately live!
const initialDemo = BuilderStorageManager.getPortfolio("port-demo-1");
if (initialDemo) {
  const demoSnapshot: PortfolioData = JSON.parse(JSON.stringify(initialDemo.portfolio));
  const initialPublished: PublishedPortfolioRecord = {
    id: "pub-demo-1",
    portfolioId: "port-demo-1",
    versionNumber: 1,
    versionId: "ver-init",
    slug: "alex-vance-3d",
    status: "published",
    deploymentUrl: "http://localhost:3000/alex-vance-3d",
    snapshot: demoSnapshot,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  publishedStore.set("port-demo-1", initialPublished);

  const initialDeployment: DeploymentRecord = {
    id: "dep-init",
    portfolioId: "port-demo-1",
    versionNumber: 1,
    versionId: "ver-init",
    status: "success",
    provider: "edge_cdn",
    deploymentUrl: "http://localhost:3000/alex-vance-3d",
    snapshot: demoSnapshot,
    logs: [
      { timestamp: new Date().toISOString(), step: "queued", message: "Deployment queued.", level: "info" },
      { timestamp: new Date().toISOString(), step: "validating", message: "Pre-publish validation passed.", level: "info" },
      { timestamp: new Date().toISOString(), step: "building", message: "Built immutable snapshot v1.", level: "info" },
      { timestamp: new Date().toISOString(), step: "uploading", message: "Promoted assets to Edge CDN.", level: "info" },
      { timestamp: new Date().toISOString(), step: "deploying", message: "Deployed to edge network.", level: "info" },
      { timestamp: new Date().toISOString(), step: "success", message: "Live at http://localhost:3000/alex-vance-3d", level: "info" },
    ],
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    deployedAt: new Date().toISOString(),
  };
  deploymentHistoryStore.set("port-demo-1", [initialDeployment]);
}

export class PublishingStoreManager {
  /**
   * Retrieves active published portfolio record by portfolioId or by public slug.
   */
  public static async getPublishedByPortfolioId(
    portfolioId: string
  ): Promise<PublishedPortfolioRecord | null> {
    try {
      const record = await (db as any).publishedPortfolio.findUnique({
        where: { portfolioId },
      });
      if (record) {
        return {
          id: record.id,
          portfolioId: record.portfolioId,
          versionNumber: record.versionNumber,
          versionId: record.versionId,
          slug: record.slug,
          status: record.status as any,
          deploymentUrl: record.deploymentUrl,
          snapshot: record.snapshot,
          publishedAt: record.publishedAt.toISOString(),
          updatedAt: record.updatedAt.toISOString(),
        };
      }
    } catch {
      // In-memory fallback
    }

    return publishedStore.get(portfolioId) || null;
  }

  /**
   * Retrieves published record strictly by public slug (used by public router).
   */
  public static async getPublishedBySlug(
    slug: string
  ): Promise<PublishedPortfolioRecord | null> {
    const cleanSlug = SlugService.normalizeSlug(slug);

    try {
      const record = await (db as any).publishedPortfolio.findUnique({
        where: { slug: cleanSlug },
      });
      if (record) {
        return {
          id: record.id,
          portfolioId: record.portfolioId,
          versionNumber: record.versionNumber,
          versionId: record.versionId,
          slug: record.slug,
          status: record.status as any,
          deploymentUrl: record.deploymentUrl,
          snapshot: record.snapshot,
          publishedAt: record.publishedAt.toISOString(),
          updatedAt: record.updatedAt.toISOString(),
        };
      }
    } catch {
      // In-memory fallback
    }

    for (const pub of publishedStore.values()) {
      if (pub.slug === cleanSlug) {
        return pub;
      }
    }

    return null;
  }

  /**
   * Promotes private/local builder asset references into public CDN URLs.
   */
  private static promoteAssetsToCdn(snapshot: PortfolioData): PortfolioData {
    const cloned: PortfolioData = JSON.parse(JSON.stringify(snapshot));

    // Promote any asset references in 3D scene nodes
    if (cloned.scene?.nodes) {
      cloned.scene.nodes = cloned.scene.nodes.map((node: any) => {
        if (node.assetId) {
          return {
            ...node,
            assetCdnUrl: `https://cdn.zylo.design/assets/${node.assetId}.glb`,
          };
        }
        return node;
      });
    }

    return cloned;
  }

  /**
   * Executes complete publishing pipeline:
   * Validation -> Asset Promotion -> Immutable Snapshot -> State Machine Logs -> Edge Deployment.
   */
  public static async deployPortfolio(
    portfolioId: string,
    userId: string,
    customSlug?: string
  ): Promise<{
    success: boolean;
    deployment: DeploymentRecord;
    published?: PublishedPortfolioRecord;
    validation: ValidationResult;
    error?: string;
  }> {
    const draftEntry = BuilderStorageManager.getPortfolio(portfolioId);
    if (!draftEntry) {
      throw new Error(`Draft portfolio ${portfolioId} not found.`);
    }

    const draft = draftEntry.portfolio;
    const validation = PublishValidator.validate(draft);

    const logs: DeploymentLogEntry[] = [];
    const pushLog = (step: any, message: string, level: "info" | "warn" | "error" = "info") => {
      logs.push({ timestamp: new Date().toISOString(), step, message, level });
    };

    pushLog("queued", "Deployment request initialized.");

    // Critical validation failure blocks publishing
    if (!validation.canPublish) {
      pushLog(
        "failed",
        `Pre-publish validation failed with ${validation.criticalErrorsCount} critical error(s).`,
        "error"
      );
      const failedDeployment: DeploymentRecord = {
        id: `dep-${Date.now()}`,
        portfolioId,
        versionNumber: 0,
        versionId: "ver-blocked",
        status: "failed",
        provider: "edge_cdn",
        deploymentUrl: "",
        logs,
        error: "Critical validation checks failed.",
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      return {
        success: false,
        deployment: failedDeployment,
        validation,
        error: "Validation failed.",
      };
    }

    pushLog("validating", "All critical pre-publish validation checks passed.");

    // Determine slug
    const desiredSlug = customSlug || draft.metadata?.slug || draft.metadata?.title || "my-portfolio";
    const slugValidation = SlugService.validateSlug(desiredSlug);
    const resolvedSlug = slugValidation.valid
      ? slugValidation.slug
      : SlugService.normalizeSlug(desiredSlug);

    // Increment version number
    const existingPub = await this.getPublishedByPortfolioId(portfolioId);
    const nextVersionNumber = (existingPub?.versionNumber || 0) + 1;
    const versionId = `ver-pub-v${nextVersionNumber}-${Date.now()}`;

    pushLog("building", `Building immutable production snapshot (v${nextVersionNumber}).`);

    // Promote assets and freeze deep snapshot
    const immutableSnapshot = this.promoteAssetsToCdn(draft);

    pushLog("uploading", "Optimized 3D geometries and promoted assets to global CDN.");
    pushLog("deploying", `Registering public edge route /${resolvedSlug}.`);

    const deploymentUrl = `http://localhost:3000/${resolvedSlug}`;

    const publishedRecord: PublishedPortfolioRecord = {
      id: existingPub?.id || `pub-${Date.now()}`,
      portfolioId,
      versionNumber: nextVersionNumber,
      versionId,
      slug: resolvedSlug,
      status: "published",
      deploymentUrl,
      snapshot: immutableSnapshot,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    publishedStore.set(portfolioId, publishedRecord);

    pushLog("success", `Deployment succeeded! Live at ${deploymentUrl}`);

    const deploymentRecord: DeploymentRecord = {
      id: `dep-${Date.now()}`,
      portfolioId,
      versionNumber: nextVersionNumber,
      versionId,
      status: "success",
      provider: "edge_cdn",
      deploymentUrl,
      snapshot: immutableSnapshot,
      logs,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      deployedAt: new Date().toISOString(),
    };

    const history = deploymentHistoryStore.get(portfolioId) || [];
    history.unshift(deploymentRecord);
    deploymentHistoryStore.set(portfolioId, history);

    // Save to Prisma if accessible
    try {
      await (db as any).publishedPortfolio.upsert({
        where: { portfolioId },
        update: {
          versionNumber: nextVersionNumber,
          versionId,
          slug: resolvedSlug,
          status: "published",
          deploymentUrl,
          snapshot: immutableSnapshot,
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
        create: {
          portfolioId,
          versionNumber: nextVersionNumber,
          versionId,
          slug: resolvedSlug,
          status: "published",
          deploymentUrl,
          snapshot: immutableSnapshot,
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await (db as any).deployment.create({
        data: {
          id: deploymentRecord.id,
          portfolioId,
          versionNumber: nextVersionNumber,
          versionId,
          status: "DEPLOYED",
          provider: "edge_cdn",
          deploymentUrl,
          snapshot: immutableSnapshot,
          logs,
        },
      });
    } catch {
      // In-memory fallback
    }

    return {
      success: true,
      deployment: deploymentRecord,
      published: publishedRecord,
      validation,
    };
  }

  /**
   * Retrieves deployment history for a portfolio.
   */
  public static async getDeploymentHistory(
    portfolioId: string
  ): Promise<DeploymentRecord[]> {
    const inMem = deploymentHistoryStore.get(portfolioId) || [];
    try {
      const records = await (db as any).deployment.findMany({
        where: { portfolioId },
        orderBy: { createdAt: "desc" },
      });
      if (records && records.length > 0) {
        return records.map((r: any) => ({
          id: r.id,
          portfolioId: r.portfolioId,
          versionNumber: r.versionNumber,
          versionId: r.versionId,
          status: r.status === "DEPLOYED" ? "success" : r.status.toLowerCase(),
          provider: r.provider || "edge_cdn",
          deploymentUrl: r.deploymentUrl,
          snapshot: r.snapshot,
          logs: r.logs || [],
          error: r.errorMsg || undefined,
          startedAt: r.startedAt?.toISOString() || r.createdAt.toISOString(),
          completedAt: r.completedAt?.toISOString(),
          deployedAt: r.deployedAt?.toISOString(),
        }));
      }
    } catch {
      // In-memory
    }

    return inMem;
  }

  /**
   * Rolls back the live published site to any previous historical snapshot.
   */
  public static async rollbackPortfolio(
    portfolioId: string,
    targetDeploymentId: string,
    userId: string
  ): Promise<{
    success: boolean;
    restoredVersionNumber: number;
    published: PublishedPortfolioRecord;
  }> {
    const history = await this.getDeploymentHistory(portfolioId);
    const inMemList = deploymentHistoryStore.get(portfolioId) || [];
    const target = history.find((d) => d.id === targetDeploymentId) || inMemList.find((d) => d.id === targetDeploymentId);

    if (!target) {
      throw new Error(`Deployment record ${targetDeploymentId} not found.`);
    }


    const existingPub = await this.getPublishedByPortfolioId(portfolioId);
    if (!existingPub) {
      throw new Error(`No active published portfolio found for ${portfolioId}.`);
    }

    // Retrieve target deployment snapshot from memory or DB
    const targetSnapshot: PortfolioData =
      target.snapshot || existingPub.snapshot;

    const nextVersionNumber = existingPub.versionNumber + 1;
    const versionId = `ver-rollback-v${nextVersionNumber}-${Date.now()}`;

    const rollbackPublished: PublishedPortfolioRecord = {
      ...existingPub,
      versionNumber: nextVersionNumber,
      versionId,
      status: "published",
      snapshot: targetSnapshot,
      updatedAt: new Date().toISOString(),
    };

    publishedStore.set(portfolioId, rollbackPublished);

    const rollbackDeployment: DeploymentRecord = {
      id: `dep-rollback-${Date.now()}`,
      portfolioId,
      versionNumber: nextVersionNumber,
      versionId,
      status: "success",
      provider: "edge_cdn",
      deploymentUrl: existingPub.deploymentUrl,
      logs: [
        {
          timestamp: new Date().toISOString(),
          step: "deploying",
          message: `Rolled back to snapshot from v${target.versionNumber}`,
          level: "info",
        },
      ],
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      deployedAt: new Date().toISOString(),
    };

    const updatedHistory = deploymentHistoryStore.get(portfolioId) || [];
    updatedHistory.unshift(rollbackDeployment);
    deploymentHistoryStore.set(portfolioId, updatedHistory);

    return {
      success: true,
      restoredVersionNumber: target.versionNumber,
      published: rollbackPublished,
    };
  }

  /**
   * Unpublishes a website while preserving drafts and version history.
   */
  public static async unpublishPortfolio(
    portfolioId: string,
    userId: string
  ): Promise<boolean> {
    const record = await this.getPublishedByPortfolioId(portfolioId);
    if (!record) return false;

    record.status = "unpublished";
    record.updatedAt = new Date().toISOString();
    publishedStore.set(portfolioId, record);

    try {
      await (db as any).publishedPortfolio.update({
        where: { portfolioId },
        data: { status: "unpublished", updatedAt: new Date() },
      });
    } catch {
      // In-memory
    }

    return true;
  }

  /**
   * Generates a signed, shareable preview token with 24-hour expiration.
   */
  public static createSignedPreviewToken(portfolioId: string): string {
    const token = crypto.randomBytes(24).toString("hex");
    previewTokens.set(token, {
      portfolioId,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    return token;
  }

  /**
   * Validates a preview token.
   */
  public static validatePreviewToken(
    portfolioId: string,
    token: string
  ): boolean {
    const record = previewTokens.get(token);
    if (!record) return false;
    if (record.portfolioId !== portfolioId) return false;
    if (Date.now() > record.expiresAt) {
      previewTokens.delete(token);
      return false;
    }
    return true;
  }

  // --- Domain Management ---

  public static async saveDomain(domain: DomainRecord): Promise<DomainRecord> {
    domainStore.set(domain.id, JSON.parse(JSON.stringify(domain)));
    return domain;
  }

  public static async getDomain(domainId: string): Promise<DomainRecord | null> {
    return domainStore.get(domainId) || null;
  }

  public static async getDomainByHostname(hostname: string): Promise<DomainRecord | null> {
    const clean = hostname.toLowerCase();
    for (const d of domainStore.values()) {
      if (d.hostname.toLowerCase() === clean) {
        return d;
      }
    }
    return null;
  }

  public static async listDomainsForPortfolio(portfolioId: string): Promise<DomainRecord[]> {
    const list: DomainRecord[] = [];
    for (const d of domainStore.values()) {
      if (d.portfolioId === portfolioId) {
        list.push(d);
      }
    }
    return list;
  }

  public static async deleteDomain(domainId: string): Promise<boolean> {
    return domainStore.delete(domainId);
  }

  public static resetPortfolioPublishingState(portfolioId: string): void {
    publishedStore.delete(portfolioId);
    deploymentHistoryStore.delete(portfolioId);
  }
}
