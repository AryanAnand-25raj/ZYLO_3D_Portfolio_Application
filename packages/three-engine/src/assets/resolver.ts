import { AssetManifestEntry } from "./manifest/types";
import { getManifestAsset } from "./manifest/manifest";
import { defaultAssetValidator } from "./validation/AssetValidator";

export interface ResolvedAsset {
  assetId: string;
  url: string;
  name: string;
  category: string;
  polyBudget: number;
  isFallback: boolean;
  optimization: AssetManifestEntry["optimization"];
}

// Fallback asset when an assetId is missing or disallowed
export const SAFE_FALLBACK_ASSET: ResolvedAsset = {
  assetId: "minimal-sphere-01",
  url: "/assets/3d/minimal-sphere-01.glb",
  name: "Safe Procedural Fallback Mesh",
  category: "geometric",
  polyBudget: 3200,
  isFallback: true,
  optimization: { draco: false, meshopt: false, ktx2: false, lodLevels: 1 },
};

export class AssetResolver {
  /**
   * Resolves an assetId against the approved manifest.
   * STRICT SECURITY: Arbitrary URLs or unmanifested IDs are strictly rejected.
   */
  public resolveAsset(assetId?: string | null): ResolvedAsset {
    if (!assetId || typeof assetId !== "string") {
      return SAFE_FALLBACK_ASSET;
    }

    const trimmed = assetId.trim();

    // Block any URL patterns (http://, https://, data:, blob:, file:, javascript:)
    if (/^(https?|data|blob|file|javascript):/i.test(trimmed) || trimmed.includes("/") || trimmed.includes("\\")) {
      console.warn(`[AssetResolver] Security alert: Arbitrary URL or file path rejected in assetId "${trimmed}".`);
      return SAFE_FALLBACK_ASSET;
    }

    const manifestEntry = getManifestAsset(trimmed);
    if (!manifestEntry || !manifestEntry.allowed) {
      console.warn(`[AssetResolver] Unapproved or missing assetId "${trimmed}". Using safe fallback.`);
      return SAFE_FALLBACK_ASSET;
    }

    const validation = defaultAssetValidator.validateManifestEntry(manifestEntry);
    if (!validation.valid) {
      console.warn(`[AssetResolver] Asset "${trimmed}" failed security validation. Using safe fallback.`);
      return SAFE_FALLBACK_ASSET;
    }

    return {
      assetId: manifestEntry.id,
      url: manifestEntry.file,
      name: manifestEntry.name,
      category: manifestEntry.category,
      polyBudget: manifestEntry.polyBudget,
      isFallback: false,
      optimization: manifestEntry.optimization,
    };
  }

  /**
   * Check if an asset is approved in the manifest
   */
  public isApproved(assetId: string): boolean {
    const entry = getManifestAsset(assetId);
    return Boolean(entry && entry.allowed);
  }
}

export const defaultAssetResolver = new AssetResolver();
