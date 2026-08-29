"use client";

import React, { Suspense } from "react";
import { SceneConfig } from "../schemas/scene.schema";
import { CameraSystem } from "../camera/CameraSystem";
import { LightingSystem } from "../lighting/LightingSystem";
import { EnvironmentRenderer } from "../environment/EnvironmentRenderer";
import { getComponentByType } from "../registry/ComponentRegistry";
import { InteractionController } from "../interaction/InteractionController";
import { RenderProfile } from "../performance/PerformanceManager";

export interface SceneRuntimeProps {
  sceneConfig: SceneConfig;
  profile: RenderProfile;
  interactive?: boolean;
  onNodeClick?: (nodeId: string) => void;
  onNodeHover?: (nodeId: string | null) => void;
  enableControls?: boolean;
  autoRotate?: boolean;
  reducedMotion?: boolean;
}

const DefaultMeshFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="#00F0FF" wireframe />
  </mesh>
);

export const SceneRuntime: React.FC<SceneRuntimeProps> = ({
  sceneConfig,
  profile,
  interactive = true,
  onNodeClick,
  onNodeHover,
  enableControls = true,
  autoRotate,
  reducedMotion = false,
}) => {
  return (
    <Suspense fallback={<DefaultMeshFallback />}>
      {/* 1. Camera System */}
      <CameraSystem
        config={sceneConfig.camera}
        enableControls={enableControls}
        autoRotate={reducedMotion ? false : autoRotate}
        mouseParallax={sceneConfig.interactivity.mouseParallax && !reducedMotion}
        parallaxStrength={sceneConfig.interactivity.parallaxFactor}
      />

      {/* 2. Lighting System */}
      <LightingSystem config={sceneConfig.lighting} />

      {/* 3. Environment & Fog & Stars */}
      <EnvironmentRenderer config={sceneConfig.environment} />

      {/* 4. Scene Nodes rendered through ComponentRegistry */}
      <InteractionController onNodeClick={onNodeClick} onNodeHover={onNodeHover} nodes={sceneConfig.nodes}>
        {({ hoveredNodeId, handlePointerOver, handlePointerOut, handleClick }) => (
          <group name="scene-nodes">
            {sceneConfig.nodes
              .slice(0, profile.maxObjects)
              .filter((node) => node.visible)
              .map((node) => {
                const Component = getComponentByType(node.componentType);
                const isHovered = hoveredNodeId === node.id;

                return (
                  <Component
                    key={node.id}
                    node={node}
                    isHovered={isHovered}
                    onClick={() => interactive && handleClick(node.id)}
                    onPointerOver={() => interactive && handlePointerOver(node.id)}
                    onPointerOut={() => interactive && handlePointerOut(node.id)}
                  />
                );
              })}
          </group>
        )}
      </InteractionController>
    </Suspense>
  );
};
