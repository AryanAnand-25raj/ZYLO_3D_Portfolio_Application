export interface RenderingPerformanceTier {
  tier: "low" | "medium" | "high" | "ultra";
  dpr: [number, number];
  shadows: boolean;
  postProcessing: boolean;
  particleLimit: number;
}

export function getPerformanceProfile(): RenderingPerformanceTier {
  if (typeof window === "undefined") {
    return {
      tier: "high",
      dpr: [1, 2],
      shadows: true,
      postProcessing: true,
      particleLimit: 1000,
    };
  }

  // Check hardware concurrency and device memory if supported
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile || cores <= 2) {
    return {
      tier: "low",
      dpr: [1, 1],
      shadows: false,
      postProcessing: false,
      particleLimit: 300,
    };
  }

  if (cores <= 4) {
    return {
      tier: "medium",
      dpr: [1, 1.5],
      shadows: false,
      postProcessing: true,
      particleLimit: 600,
    };
  }

  return {
    tier: "high",
    dpr: [1, 2],
    shadows: true,
    postProcessing: true,
    particleLimit: 1200,
  };
}

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}
