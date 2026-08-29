"use client";

import React from "react";
import { LightingConfig, LightNode } from "../schemas/scene.schema";

export interface LightingSystemProps {
  config: LightingConfig;
}

const PRESET_LIGHTS: Record<string, LightNode[]> = {
  cyberpunk: [
    { id: "p-1", type: "point", color: "#00F0FF", intensity: 4, position: [3, 4, 3], distance: 20, castShadow: false },
    { id: "p-2", type: "point", color: "#FF007A", intensity: 4, position: [-3, -2, -2], distance: 20, castShadow: false },
    { id: "d-1", type: "directional", color: "#9D00FF", intensity: 1.5, position: [0, 6, 4], castShadow: false },
  ],
  studio: [
    { id: "s-1", type: "directional", color: "#ffffff", intensity: 2.5, position: [5, 8, 5], castShadow: true },
    { id: "s-2", type: "directional", color: "#b0c4de", intensity: 1.2, position: [-5, 3, -3], castShadow: false },
    { id: "s-3", type: "point", color: "#ffffff", intensity: 1, position: [0, -3, 2], castShadow: false },
  ],
  "warm-sunset": [
    { id: "w-1", type: "directional", color: "#FF7B00", intensity: 3, position: [6, 4, 2], castShadow: false },
    { id: "w-2", type: "point", color: "#FF0055", intensity: 3, position: [-4, 2, -2], castShadow: false },
    { id: "w-3", type: "ambient", color: "#4A0E4E", intensity: 0.8, castShadow: false },
  ],
  "minimal-white": [
    { id: "m-1", type: "directional", color: "#ffffff", intensity: 2, position: [0, 10, 5], castShadow: false },
    { id: "m-2", type: "ambient", color: "#ffffff", intensity: 0.9, castShadow: false },
  ],
  "neon-noir": [
    { id: "n-1", type: "spot", color: "#00FFA3", intensity: 5, position: [4, 6, 2], distance: 15, angle: Math.PI / 4, castShadow: false },
    { id: "n-2", type: "point", color: "#00E5FF", intensity: 3, position: [-4, -2, 2], distance: 15, castShadow: false },
  ],
  "deep-space": [
    { id: "ds-1", type: "point", color: "#7B2CBF", intensity: 3.5, position: [5, 3, 2], distance: 30, castShadow: false },
    { id: "ds-2", type: "point", color: "#00B4D8", intensity: 2.5, position: [-5, -3, -2], distance: 30, castShadow: false },
  ],
};

export const LightingSystem: React.FC<LightingSystemProps> = ({ config }) => {
  const presetLights = PRESET_LIGHTS[config.preset] || PRESET_LIGHTS.cyberpunk;
  const activeLights = config.lights && config.lights.length > 0 ? config.lights : presetLights;

  // Enforce hard limit of max 8 lights
  const clampedLights = activeLights.slice(0, 8);

  return (
    <>
      <ambientLight intensity={config.ambientIntensity ?? 0.4} />

      {clampedLights.map((light) => {
        const key = light.id;
        const pos = (light.position || [0, 5, 0]) as [number, number, number];

        switch (light.type) {
          case "directional":
            return (
              <directionalLight
                key={key}
                color={light.color}
                intensity={light.intensity}
                position={pos}
                castShadow={light.castShadow}
              />
            );
          case "point":
            return (
              <pointLight
                key={key}
                color={light.color}
                intensity={light.intensity}
                position={pos}
                distance={light.distance}
                decay={light.decay ?? 2}
              />
            );
          case "spot":
            return (
              <spotLight
                key={key}
                color={light.color}
                intensity={light.intensity}
                position={pos}
                distance={light.distance}
                angle={light.angle ?? Math.PI / 4}
                penumbra={light.penumbra ?? 0.5}
                castShadow={light.castShadow}
              />
            );
          case "hemisphere":
            return (
              <hemisphereLight
                key={key}
                color={light.color}
                groundColor="#05070d"
                intensity={light.intensity}
              />
            );
          case "ambient":
            return <ambientLight key={key} color={light.color} intensity={light.intensity} />;
          default:
            return <pointLight key={key} color={light.color} intensity={light.intensity} position={pos} />;
        }
      })}
    </>
  );
};
