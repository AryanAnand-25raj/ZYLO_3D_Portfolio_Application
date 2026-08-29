import { PerformanceTier } from "../schemas/scene.schema";

export interface RenderProfile {
  tier: PerformanceTier;
  pixelRatio: number;
  shadows: boolean;
  postprocessing: boolean;
  maxParticles: number;
  maxLights: number;
  maxObjects: number;
  modelQuality: "high" | "medium" | "low";
}

export const PERFORMANCE_PROFILES: Record<PerformanceTier, RenderProfile> = {
  ultra: {
    tier: "ultra",
    pixelRatio: 2,
    shadows: true,
    postprocessing: true,
    maxParticles: 5000,
    maxLights: 8,
    maxObjects: 60,
    modelQuality: "high",
  },
  high: {
    tier: "high",
    pixelRatio: 1.5,
    shadows: true,
    postprocessing: true,
    maxParticles: 3000,
    maxLights: 6,
    maxObjects: 40,
    modelQuality: "high",
  },
  medium: {
    tier: "medium",
    pixelRatio: 1.25,
    shadows: false,
    postprocessing: true,
    maxParticles: 1500,
    maxLights: 4,
    maxObjects: 25,
    modelQuality: "medium",
  },
  low: {
    tier: "low",
    pixelRatio: 1,
    shadows: false,
    postprocessing: false,
    maxParticles: 500,
    maxLights: 3,
    maxObjects: 15,
    modelQuality: "low",
  },
  mobile: {
    tier: "mobile",
    pixelRatio: 1,
    shadows: false,
    postprocessing: false,
    maxParticles: 300,
    maxLights: 2,
    maxObjects: 10,
    modelQuality: "low",
  },
  reduced_motion: {
    tier: "reduced_motion",
    pixelRatio: 1,
    shadows: false,
    postprocessing: false,
    maxParticles: 100,
    maxLights: 2,
    maxObjects: 10,
    modelQuality: "low",
  },
};

export class PerformanceManager {
  public static detectDeviceTier(): PerformanceTier {
    if (typeof window === "undefined") {
      return "high";
    }

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return "reduced_motion";
    }

    // Mobile / Tablet screen check
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return "mobile";
    }

    // Hardware concurrency & memory estimation if available
    const cores = (navigator as any).hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 8;

    if (cores >= 8 && memory >= 8 && window.innerWidth >= 1920) {
      return "ultra";
    } else if (cores >= 4 && memory >= 4) {
      return "high";
    } else if (cores >= 2) {
      return "medium";
    }

    return "low";
  }

  public static getProfile(tier: PerformanceTier): RenderProfile {
    return PERFORMANCE_PROFILES[tier] || PERFORMANCE_PROFILES.high;
  }
}
