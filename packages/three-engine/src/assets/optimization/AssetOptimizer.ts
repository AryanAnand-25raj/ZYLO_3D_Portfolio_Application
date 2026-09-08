import { AssetManifestEntry } from "../manifest/types";

export interface AssetOptimizationProfile {
  assetId: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  dracoEnabled: boolean;
  meshoptEnabled: boolean;
  ktx2Textures: boolean;
  recommendedLodLevels: number;
}

export interface OptimizationBenchmark {
  assetId: string;
  loadDurationMs: number;
  memoryEstimateBytes: number;
  qualityScore: number; // 0 to 1
  compressionRatio: number;
}

export class AssetOptimizer {
  /**
   * Determine whether Draco or Meshopt compression is recommended based on asset metrics.
   * Draco excels on high-poly meshes (> 10,000 vertices) with high geometric complexity.
   * Meshopt excels on animation-heavy or medium-geometry models with fast decompression.
   */
  public evaluateOptimization(asset: AssetManifestEntry): AssetOptimizationProfile {
    const isHighPoly = asset.polyBudget >= 10000;
    const isLargeFile = asset.fileSize >= 400000; // >= 400KB

    const dracoEnabled = isHighPoly;
    const meshoptEnabled = isLargeFile && !isHighPoly;
    const ktx2Textures = asset.category === "space" || asset.category === "technology";
    const recommendedLodLevels = isHighPoly ? 2 : 1;

    // Estimated compressed size based on typical Draco/Meshopt ratios (40-65% reduction)
    const compressionFactor = dracoEnabled ? 0.45 : meshoptEnabled ? 0.6 : 1.0;
    const compressedSizeBytes = Math.round(asset.fileSize * compressionFactor);

    return {
      assetId: asset.id,
      originalSizeBytes: asset.fileSize,
      compressedSizeBytes,
      dracoEnabled,
      meshoptEnabled,
      ktx2Textures,
      recommendedLodLevels,
    };
  }

  /**
   * Benchmark load time and quality simulation
   */
  public benchmarkAsset(asset: AssetManifestEntry, loadDurationMs: number): OptimizationBenchmark {
    const memoryEstimateBytes = asset.polyBudget * 48 + asset.fileSize * 2;
    const compressionRatio = asset.optimization.draco || asset.optimization.meshopt ? 0.5 : 1.0;

    return {
      assetId: asset.id,
      loadDurationMs,
      memoryEstimateBytes,
      qualityScore: 0.98,
      compressionRatio,
    };
  }
}

export const defaultAssetOptimizer = new AssetOptimizer();
