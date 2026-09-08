import { describe, it, expect, beforeEach } from "vitest";
import {
  ASSET_CATEGORIES,
  APPROVED_ASSET_MANIFEST,
  getManifestAsset,
  getAssetsByCategory,
  defaultAssetValidator,
  AssetValidator,
  AssetCache,
  defaultAssetLoader,
  AssetLoader,
  defaultAssetResolver,
  SAFE_FALLBACK_ASSET,
  defaultAssetOptimizer,
} from "@zylo/three-engine";

describe("Asset System — Manifest & Categories", () => {
  it("defines all 10 approved asset categories", () => {
    expect(ASSET_CATEGORIES).toHaveLength(10);
    expect(ASSET_CATEGORIES).toContain("space");
    expect(ASSET_CATEGORIES).toContain("technology");
    expect(ASSET_CATEGORIES).toContain("abstract");
    expect(ASSET_CATEGORIES).toContain("architecture");
    expect(ASSET_CATEGORIES).toContain("devices");
    expect(ASSET_CATEGORIES).toContain("nature");
    expect(ASSET_CATEGORIES).toContain("geometric");
    expect(ASSET_CATEGORIES).toContain("creative");
    expect(ASSET_CATEGORIES).toContain("education");
    expect(ASSET_CATEGORIES).toContain("professional");
  });

  it("manifest contains valid approved assets across categories", () => {
    const assetKeys = Object.keys(APPROVED_ASSET_MANIFEST);
    expect(assetKeys.length).toBeGreaterThanOrEqual(10);

    const planet = getManifestAsset("planet-01");
    expect(planet).toBeDefined();
    expect(planet?.name).toBe("Cybernetic Exoplanet");
    expect(planet?.category).toBe("space");
    expect(planet?.allowed).toBe(true);
    expect(planet?.polyBudget).toBeLessThanOrEqual(50000);

    const spaceAssets = getAssetsByCategory("space");
    expect(spaceAssets.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Asset System — Validation", () => {
  const validator = new AssetValidator();

  it("passes valid manifest entries", () => {
    const entry = getManifestAsset("planet-01")!;
    const res = validator.validateManifestEntry(entry);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("rejects non-glb/gltf file extensions", () => {
    const invalidEntry = {
      id: "malicious-exe",
      name: "Malicious Model",
      type: "model" as const,
      category: "space" as const,
      file: "/assets/models/payload.exe",
      polyBudget: 5000,
      fileSize: 100000,
      allowed: true,
      tags: [],
    };
    const res = validator.validateManifestEntry(invalidEntry);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("[Format]"))).toBe(true);
  });

  it("rejects assets exceeding maximum file size (5MB)", () => {
    const oversizedEntry = {
      id: "huge-model",
      name: "Huge Model",
      type: "model" as const,
      category: "abstract" as const,
      file: "/assets/models/huge.glb",
      polyBudget: 10000,
      fileSize: 8 * 1024 * 1024, // 8MB
      allowed: true,
      tags: [],
    };
    const res = validator.validateManifestEntry(oversizedEntry);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("[Size]"))).toBe(true);
  });

  it("rejects assets exceeding polygon budget limit (50k)", () => {
    const highPolyEntry = {
      id: "ultra-high-poly",
      name: "Dense Scan",
      type: "model" as const,
      category: "architecture" as const,
      file: "/assets/models/scan.glb",
      polyBudget: 75000, // Exceeds 50,000
      fileSize: 2000000,
      allowed: true,
      tags: [],
    };
    const res = validator.validateManifestEntry(highPolyEntry);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("[Polycount]"))).toBe(true);
  });

  it("rejects arbitrary external URLs in asset file paths", () => {
    const externalUrlEntry = {
      id: "external-link-model",
      name: "External Asset",
      type: "model" as const,
      category: "technology" as const,
      file: "https://evil-server.com/malicious.glb",
      polyBudget: 5000,
      fileSize: 500000,
      allowed: true,
      tags: [],
    };
    const res = validator.validateManifestEntry(externalUrlEntry);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("[Security]"))).toBe(true);
  });
});

describe("Asset System — Cache & LRU Eviction", () => {
  let cache: AssetCache<any>;

  beforeEach(() => {
    cache = new AssetCache(3, 1000000); // Max 3 items
  });

  it("stores and retrieves cached assets correctly", () => {
    cache.set("item-1", { data: "mesh-1" }, 1000);
    expect(cache.has("item-1")).toBe(true);
    expect(cache.get("item-1")).toEqual({ data: "mesh-1" });

    const stats = cache.getStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(0);
    expect(stats.size).toBe(1);
  });

  it("records cache misses for absent keys", () => {
    const result = cache.get("non-existent");
    expect(result).toBeNull();
    expect(cache.getStats().misses).toBe(1);
  });

  it("evicts oldest accessed items when capacity limit is reached (LRU)", () => {
    cache.set("item-1", { data: 1 }, 100);
    cache.set("item-2", { data: 2 }, 100);
    cache.set("item-3", { data: 3 }, 100);

    // Access item-1 so item-2 becomes oldest
    cache.get("item-1");

    // Add 4th item, should evict item-2
    cache.set("item-4", { data: 4 }, 100);

    expect(cache.has("item-1")).toBe(true);
    expect(cache.has("item-2")).toBe(false); // Evicted!
    expect(cache.has("item-3")).toBe(true);
    expect(cache.has("item-4")).toBe(true);
    expect(cache.getStats().size).toBe(3);
  });
});

describe("Asset System — Loader & Selective Preloading", () => {
  it("loads approved asset and returns manifest metadata", async () => {
    const asset = await defaultAssetLoader.loadAsset("planet-01");
    expect(asset.assetId).toBe("planet-01");
    expect(asset.url).toBe("/assets/3d/planet-01.glb");
    expect(asset.polyBudget).toBe(12000);
  });

  it("deduplicates concurrent load promises for the same asset", async () => {
    const [res1, res2] = await Promise.all([
      defaultAssetLoader.loadAsset("orbit-ring-01"),
      defaultAssetLoader.loadAsset("orbit-ring-01"),
    ]);
    expect(res1).toEqual(res2);
  });

  it("preloads only stage-specific assets instead of entire manifest", async () => {
    const loader = new AssetLoader();
    const heroAssets = ["planet-01", "orbit-ring-01"];
    const preloaded = await loader.preloadStageAssets("hero", heroAssets);

    expect(preloaded).toHaveLength(2);
    expect(loader.isPreloaded("planet-01")).toBe(true);
    expect(loader.isPreloaded("satellite-01")).toBe(false); // Deferred, not preloaded!
  });
});

describe("Asset System — Secure Resolver", () => {
  it("resolves approved asset IDs to manifest entries", () => {
    const res = defaultAssetResolver.resolveAsset("planet-01");
    expect(res.assetId).toBe("planet-01");
    expect(res.isFallback).toBe(false);
    expect(res.url).toBe("/assets/3d/planet-01.glb");
  });

  it("strictly intercepts and blocks arbitrary user-supplied URLs", () => {
    const maliciousUrls = [
      "https://attacker.com/malicious.glb",
      "http://cdn.sketchfab.com/untrusted.gltf",
      "javascript:alert(1)",
      "/etc/passwd",
      "blob:http://localhost/342938",
    ];

    maliciousUrls.forEach((url) => {
      const res = defaultAssetResolver.resolveAsset(url);
      expect(res.isFallback).toBe(true);
      expect(res.assetId).toBe(SAFE_FALLBACK_ASSET.assetId);
    });
  });

  it("falls back safely for unknown or unapproved asset IDs", () => {
    const res = defaultAssetResolver.resolveAsset("unregistered-super-model");
    expect(res.isFallback).toBe(true);
    expect(res.assetId).toBe(SAFE_FALLBACK_ASSET.assetId);
  });
});

describe("Asset System — Optimizer & Benchmarking", () => {
  it("evaluates Draco compression for high-polygon models", () => {
    const highPolyAsset = getManifestAsset("neural-core-01")!;
    const profile = defaultAssetOptimizer.evaluateOptimization(highPolyAsset);

    expect(profile.dracoEnabled).toBe(true);
    expect(profile.compressedSizeBytes).toBeLessThan(highPolyAsset.fileSize);
    expect(profile.recommendedLodLevels).toBe(2);
  });

  it("benchmarks asset load time and memory estimation", () => {
    const asset = getManifestAsset("planet-01")!;
    const benchmark = defaultAssetOptimizer.benchmarkAsset(asset, 42);

    expect(benchmark.assetId).toBe("planet-01");
    expect(benchmark.loadDurationMs).toBe(42);
    expect(benchmark.memoryEstimateBytes).toBeGreaterThan(0);
    expect(benchmark.qualityScore).toBeGreaterThan(0.9);
  });
});
