import { describe, it, expect } from "vitest";
import {
  PerformanceManager,
  PERFORMANCE_PROFILES,
  normalizeSceneConfig,
} from "../packages/three-engine/src";

describe("Three Engine Performance Manager & Tiering", () => {
  it("provides tailored render profiles for all 6 tiers", () => {
    expect(PERFORMANCE_PROFILES.ultra.pixelRatio).toBe(2);
    expect(PERFORMANCE_PROFILES.ultra.shadows).toBe(true);

    expect(PERFORMANCE_PROFILES.mobile.pixelRatio).toBe(1);
    expect(PERFORMANCE_PROFILES.mobile.shadows).toBe(false);
    expect(PERFORMANCE_PROFILES.mobile.postprocessing).toBe(false);
    expect(PERFORMANCE_PROFILES.mobile.maxParticles).toBe(300);

    expect(PERFORMANCE_PROFILES.reduced_motion.postprocessing).toBe(false);
  });

  it("applies mobile budget constraints when mobile tier is requested", () => {
    const heavyScene = {
      nodes: Array.from({ length: 40 }).map((_, i) => ({
        id: `node-${i}`,
        componentType: "box",
      })),
      environment: {
        stars: { count: 4000 },
      },
      lighting: {
        lights: Array.from({ length: 10 }).map((_, i) => ({
          id: `l-${i}`,
          type: "point",
        })),
      },
    };

    const normalized = normalizeSceneConfig(heavyScene, { tier: "mobile" });
    expect(normalized.performance.tier).toBe("mobile");
    expect(normalized.nodes.length).toBeLessThanOrEqual(15);
    expect(normalized.lighting.lights.length).toBeLessThanOrEqual(3);
    expect(normalized.environment.stars.count).toBeLessThanOrEqual(300);
    expect(normalized.postProcessing.bloom.enabled).toBe(false);
  });

  it("retrieves valid profile via PerformanceManager.getProfile", () => {
    const profile = PerformanceManager.getProfile("high");
    expect(profile.tier).toBe("high");
    expect(profile.maxParticles).toBe(3000);
  });
});
