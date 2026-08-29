"use client";

import { useState, useEffect } from "react";
import { PerformanceTier } from "../schemas/scene.schema";
import { PerformanceManager, RenderProfile } from "../performance/PerformanceManager";

export function usePerformanceTier(overrideTier?: PerformanceTier): {
  tier: PerformanceTier;
  profile: RenderProfile;
  setTier: (tier: PerformanceTier) => void;
} {
  const [tier, setTier] = useState<PerformanceTier>(
    overrideTier || PerformanceManager.detectDeviceTier()
  );

  useEffect(() => {
    if (overrideTier) {
      setTier(overrideTier);
    }
  }, [overrideTier]);

  const profile = PerformanceManager.getProfile(tier);

  return { tier, profile, setTier };
}
