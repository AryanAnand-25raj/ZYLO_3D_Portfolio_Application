"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneMeshNode } from "../schemas/scene.schema";
import { NodeComponentProps } from "./BasicGeometries";

export const ParticleObject: React.FC<NodeComponentProps> = ({ node }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = Math.min(Math.max(node.scale[0] * 300, 100), 2000);
  const { materialProps, animation } = node;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const baseColor = new THREE.Color(materialProps.color || "#00F0FF");
    const altColor = new THREE.Color(materialProps.emissive || "#9D00FF");

    for (let i = 0; i < count; i++) {
      const radius = 1 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = baseColor.clone().lerp(altColor, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [count, materialProps.color, materialProps.emissive]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const speed = animation.speed || 0.3;
    pointsRef.current.rotation.y += speed * delta;
    pointsRef.current.rotation.x += speed * 0.5 * delta;
  });

  return (
    <points ref={pointsRef} position={node.position as [number, number, number]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={materialProps.opacity ?? 0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
