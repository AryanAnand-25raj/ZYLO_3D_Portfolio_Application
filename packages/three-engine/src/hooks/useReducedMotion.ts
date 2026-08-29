"use client";

import { useState, useEffect } from "react";

export function useReducedMotion(overrideReduced?: boolean): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof overrideReduced === "boolean") return overrideReduced;
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof overrideReduced === "boolean") {
      setReducedMotion(overrideReduced);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [overrideReduced]);

  return reducedMotion;
}
