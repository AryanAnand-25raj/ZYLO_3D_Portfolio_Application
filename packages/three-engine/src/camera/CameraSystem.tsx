"use client";

import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrthographicCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CameraConfig } from "../schemas/scene.schema";

export interface CameraSystemProps {
  config: CameraConfig;
  enableControls?: boolean;
  autoRotate?: boolean;
  mouseParallax?: boolean;
  parallaxStrength?: number;
}

export const CameraSystem: React.FC<CameraSystemProps> = ({
  config,
  enableControls = true,
  autoRotate,
  mouseParallax = true,
  parallaxStrength = 0.4,
}) => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const basePos = useRef(new THREE.Vector3(...config.position));

  useEffect(() => {
    basePos.current.set(...config.position);
    camera.position.set(...config.position);
    camera.lookAt(new THREE.Vector3(...config.target));
  }, [config.position, config.target, camera]);

  useEffect(() => {
    if (!mouseParallax) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseParallax]);

  useFrame((_, delta) => {
    if (!mouseParallax) return;

    // Smooth lerp for mouse parallax
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * delta * 3;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * delta * 3;

    camera.position.x = basePos.current.x + mouse.current.x * parallaxStrength;
    camera.position.y = basePos.current.y + mouse.current.y * parallaxStrength;
  });

  const shouldAutoRotate = autoRotate ?? config.controls.autoRotate;

  return (
    <>
      {config.type === "orthographic" ? (
        <OrthographicCamera
          makeDefault
          position={config.position as [number, number, number]}
          zoom={config.zoom || 50}
          near={config.near}
          far={config.far}
        />
      ) : (
        <PerspectiveCamera
          makeDefault
          fov={config.fov}
          position={config.position as [number, number, number]}
          near={config.near}
          far={config.far}
        />
      )}

      {enableControls && config.controls.enabled && (
        <OrbitControls
          enableZoom={config.controls.enableZoom}
          enablePan={config.controls.enablePan}
          autoRotate={shouldAutoRotate}
          autoRotateSpeed={config.controls.autoRotateSpeed}
          maxPolarAngle={config.controls.maxPolarAngle}
          minPolarAngle={config.controls.minPolarAngle}
          dampingFactor={config.controls.dampingFactor}
        />
      )}
    </>
  );
};
