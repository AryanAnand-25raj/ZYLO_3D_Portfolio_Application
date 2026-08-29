"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { SceneConfig, PerformanceTier } from "../schemas/scene.schema";
import { normalizeSceneConfig } from "../schemas/normalizer";
import { SceneRuntime } from "./SceneRuntime";
import { ErrorBoundary3D } from "../fallbacks/ErrorBoundary3D";
import { StaticFallback } from "../fallbacks/StaticFallback";
import { usePerformanceTier } from "../hooks/usePerformanceTier";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useSceneLifecycle } from "../hooks/useSceneLifecycle";
import { DebugHUD } from "../performance/DebugHUD";

export interface SceneRendererProps {
  sceneConfig: SceneConfig | any;
  className?: string;
  interactive?: boolean;
  onNodeClick?: (nodeId: string) => void;
  onNodeHover?: (nodeId: string | null) => void;
  enableControls?: boolean;
  autoRotate?: boolean;
  performanceTier?: PerformanceTier;
  reducedMotion?: boolean;
  debug?: boolean;
  forceFallback?: boolean;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  sceneConfig,
  className = "w-full h-full min-h-[400px]",
  interactive = true,
  onNodeClick,
  onNodeHover,
  enableControls = true,
  autoRotate,
  performanceTier,
  reducedMotion: reducedMotionProp,
  debug = false,
  forceFallback = false,
}) => {
  const { tier, profile } = usePerformanceTier(performanceTier);
  const reducedMotion = useReducedMotion(reducedMotionProp);
  const { isVisible } = useSceneLifecycle();
  const [isDebugActive, setIsDebugActive] = useState(debug);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("debug3d") === "true") {
        setIsDebugActive(true);
      }
    }
  }, []);

  // Normalize, validate, and clamp all scene inputs
  const validatedConfig = useMemo(() => {
    return normalizeSceneConfig(sceneConfig, { tier, reducedMotion });
  }, [sceneConfig, tier, reducedMotion]);

  if (forceFallback) {
    return <StaticFallback className={className} reason="error" />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <ErrorBoundary3D fallback={<StaticFallback className={className} reason="error" />}>
        {/* Debug HUD Overlay */}
        {isDebugActive && (
          <div className="absolute top-2 left-2 z-50 pointer-events-none">
            <div className="p-2.5 bg-black/85 backdrop-blur-md border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300">
              <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                ZYLO 3D Engine HUD
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-zinc-300">
                <div>Tier: <span className="text-cyan-300 uppercase font-semibold">{tier}</span></div>
                <div>Motion: <span className="text-zinc-200">{reducedMotion ? "Reduced" : "Normal"}</span></div>
                <div>Nodes: <span className="text-zinc-200">{validatedConfig.nodes.length}</span></div>
                <div>DPR: <span className="text-zinc-200">{profile.pixelRatio}</span></div>
              </div>
            </div>
          </div>
        )}

        <Canvas
          dpr={[1, profile.pixelRatio]}
          frameloop={isVisible ? "always" : "never"}
          gl={{
            antialias: tier !== "mobile" && tier !== "low",
            alpha: true,
            powerPreference: "high-performance",
          }}
          shadows={profile.shadows}
        >
          <SceneRuntime
            sceneConfig={validatedConfig}
            profile={profile}
            interactive={interactive}
            onNodeClick={onNodeClick}
            onNodeHover={onNodeHover}
            enableControls={enableControls}
            autoRotate={autoRotate}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </ErrorBoundary3D>
    </div>
  );
};
