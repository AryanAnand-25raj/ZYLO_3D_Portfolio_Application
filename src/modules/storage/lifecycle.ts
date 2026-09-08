import crypto from "crypto";
import path from "path";
import fs from "fs";

export type StorageTier = "private_uploads" | "public_assets" | "cdn_cache";

export interface StorageAssetMetadata {
  fileKey: string;
  tier: StorageTier;
  mimeType: string;
  sizeBytes: number;
  userId?: string;
  portfolioId?: string;
  createdAt: Date;
  isOrphan?: boolean;
}

export interface SignedUrlResult {
  url: string;
  expiresAt: Date;
  fileKey: string;
}

export class StorageLifecycleManager {
  private static readonly SECRET_KEY =
    process.env.STORAGE_SIGNING_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "zylo_storage_signing_key_32_bytes_minimum_secret";

  /**
   * Generates a tamper-proof HMAC-SHA256 signed access URL for private assets.
   */
  static generateSignedUrl(
    fileKey: string,
    options: {
      expiresInSeconds?: number;
      permission?: "read" | "write";
      baseUrl?: string;
    } = {}
  ): SignedUrlResult {
    const ttl = options.expiresInSeconds || 3600; // 1 hour default
    const expiresAt = new Date(Date.now() + ttl * 1000);
    const permission = options.permission || "read";
    const baseUrl = options.baseUrl || "/api/storage";

    const payload = `${fileKey}:${permission}:${expiresAt.getTime()}`;
    const signature = crypto
      .createHmac("sha256", this.SECRET_KEY)
      .update(payload)
      .digest("hex");

    const url = `${baseUrl}/access?key=${encodeURIComponent(
      fileKey
    )}&perm=${permission}&exp=${expiresAt.getTime()}&sig=${signature}`;

    return {
      url,
      expiresAt,
      fileKey,
    };
  }

  /**
   * Validates a signed access token. Rejects expired or altered requests.
   */
  static verifySignedAccess(
    fileKey: string,
    permission: string,
    expTimestamp: number,
    signature: string
  ): { valid: boolean; reason?: string } {
    if (Date.now() > expTimestamp) {
      return { valid: false, reason: "Signed URL has expired." };
    }

    const payload = `${fileKey}:${permission}:${expTimestamp}`;
    const expectedSig = crypto
      .createHmac("sha256", this.SECRET_KEY)
      .update(payload)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSig, "hex");
    const providedBuffer = Buffer.from(signature, "hex");

    if (
      expectedBuffer.length !== providedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      return { valid: false, reason: "Invalid cryptographic signature." };
    }

    return { valid: true };
  }

  /**
   * Evaluates cache-control directives based on storage tier.
   */
  static getCacheControlHeaders(tier: StorageTier): Record<string, string> {
    switch (tier) {
      case "public_assets":
      case "cdn_cache":
        return {
          "Cache-Control": "public, max-age=31536000, immutable",
          "CDN-Cache-Control": "max-age=31536000",
        };
      case "private_uploads":
      default:
        return {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        };
    }
  }

  /**
   * Scans for abandoned draft assets older than retention window and purges them.
   */
  static evaluateOrphanAssets(
    assets: StorageAssetMetadata[],
    activeDraftIds: Set<string>,
    activePortfolioIds: Set<string>,
    retentionDays = 30
  ): {
    orphans: StorageAssetMetadata[];
    retainedCount: number;
    purgedBytes: number;
  } {
    const cutoffTime = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    const orphans: StorageAssetMetadata[] = [];
    let retainedCount = 0;
    let purgedBytes = 0;

    for (const asset of assets) {
      const isReferenced =
        (asset.portfolioId && activePortfolioIds.has(asset.portfolioId)) ||
        (asset.portfolioId && activeDraftIds.has(asset.portfolioId));

      const isExpired = asset.createdAt.getTime() < cutoffTime;

      if (!isReferenced && isExpired) {
        orphans.push({ ...asset, isOrphan: true });
        purgedBytes += asset.sizeBytes;
      } else {
        retainedCount++;
      }
    }

    return {
      orphans,
      retainedCount,
      purgedBytes,
    };
  }
}
