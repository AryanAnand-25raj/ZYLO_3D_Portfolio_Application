"use client";

import React from "react";
import { Stars, Environment as DreiEnvironment } from "@react-three/drei";
import { EnvironmentConfig } from "../schemas/scene.schema";

export interface EnvironmentRendererProps {
  config: EnvironmentConfig;
}

export const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ config }) => {
  const isDreiPresetValid = config.preset && config.preset !== "none";

  return (
    <>
      {/* Fog */}
      {config.fog.enabled && (
        <fog
          attach="fog"
          args={[
            config.fog.color || "#05070d",
            config.fog.near || 5,
            config.fog.far || 30,
          ]}
        />
      )}

      {/* Solid or gradient background color */}
      {config.background.type === "solid" && (
        <color attach="background" args={[config.background.color || "#05070d"]} />
      )}

      {/* Ambient Starfield / Particles */}
      {config.stars.enabled && (
        <Stars
          radius={config.stars.radius || 50}
          depth={config.stars.depth || 40}
          count={config.stars.count || 1200}
          factor={4}
          saturation={0.5}
          fade
          speed={config.stars.speed || 0.5}
        />
      )}

      {/* Drei Environment Map Presets */}
      {isDreiPresetValid && (
        <DreiEnvironment
          preset={config.preset as any}
          background={config.background.type === "preset"}
          blur={config.blur}
        />
      )}
    </>
  );
};
