import { AssetManifestEntry } from "../manifest/types";
import { getManifestAsset } from "../manifest/manifest";
import { globalModelCache, AssetCache } from "../cache/AssetCache";
import { defaultAssetValidator } from "../validation/AssetValidator";

export interface AssetLoadOptions {
  priority?: "high" | "low" | "idle";
  stage?: "hero" | "projects" | "skills" | "footer";
  useCache?: boolean;
}

export interface AssetLoadProgress {
  assetId: string;
  loadedBytes: number;
  totalBytes: number;
  percentage: number;
}

export class AssetLoader {
  private cache: AssetCache;
  private pendingLoads: Map<string, Promise<any>>;
  private preloadedAssets: Set<string>;

  constructor(cache: AssetCache = globalModelCache) {
    this.cache = cache;
    this.pendingLoads = new Map();
    this.preloadedAssets = new Set();
  }

  /**
   * Load an approved asset by ID.
   * If already cached, returns immediately without network request.
   * If already in-flight, dedupes promise to avoid redundant concurrent requests.
   */
  public async loadAsset(assetId: string, options: AssetLoadOptions = {}): Promise<any> {
    const { useCache = true } = options;

    // 1. Check cache first
    if (useCache && this.cache.has(assetId)) {
      return this.cache.get(assetId);
    }

    // 2. Check in-flight pending load
    if (this.pendingLoads.has(assetId)) {
      return this.pendingLoads.get(assetId);
    }

    // 3. Resolve manifest metadata
    const manifestEntry = getManifestAsset(assetId);
    if (!manifestEntry) {
      throw new Error(`[AssetLoader] Unknown or unapproved asset ID "${assetId}".`);
    }

    // 4. Validate metadata
    const validation = defaultAssetValidator.validateManifestEntry(manifestEntry);
    if (!validation.valid) {
      throw new Error(`[AssetLoader] Asset "${assetId}" failed validation: ${validation.errors.join("; ")}`);
    }

    // 5. Execute simulated / actual load with promise deduplication
    const loadPromise = this.executeLoad(manifestEntry)
      .then((result) => {
        if (useCache) {
          this.cache.set(assetId, result, manifestEntry.fileSize);
        }
        this.pendingLoads.delete(assetId);
        return result;
      })
      .catch((err) => {
        this.pendingLoads.delete(assetId);
        throw err;
      });

    this.pendingLoads.set(assetId, loadPromise);
    return loadPromise;
  }

  /**
   * Selective Preloading: Only preloads critical assets for the given section/stage.
   * NEVER blindly preloads the entire asset library.
   */
  public async preloadStageAssets(stage: "hero" | "projects", assetIds: string[]): Promise<string[]> {
    const results: string[] = [];

    // Filter to only approved, non-preloaded assets
    const targetIds = assetIds.filter((id) => !this.preloadedAssets.has(id));

    await Promise.all(
      targetIds.map(async (id) => {
        try {
          await this.loadAsset(id, { priority: stage === "hero" ? "high" : "low", stage });
          this.preloadedAssets.add(id);
          results.push(id);
        } catch (e) {
          console.warn(`[AssetLoader] Preload skipped or failed for asset "${id}":`, e);
        }
      })
    );

    return results;
  }

  public isPreloaded(assetId: string): boolean {
    return this.preloadedAssets.has(assetId);
  }

  private async executeLoad(asset: AssetManifestEntry): Promise<{
    assetId: string;
    url: string;
    polyBudget: number;
    optimization: typeof asset.optimization;
    loadedAt: number;
  }> {
    // In web environment, this handles three/drei loader invocation or fetch
    return {
      assetId: asset.id,
      url: asset.file,
      polyBudget: asset.polyBudget,
      optimization: asset.optimization,
      loadedAt: Date.now(),
    };
  }
}

export const defaultAssetLoader = new AssetLoader();
