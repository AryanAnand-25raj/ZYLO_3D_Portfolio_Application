"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Center } from "@react-three/drei";
import * as THREE from "three";
import { SceneMeshNode } from "../schemas/scene.schema";
import { NodeComponentProps } from "./BasicGeometries";

export const Text3DObject: React.FC<NodeComponentProps> = ({ node, isHovered, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const textContent = node.label || "ZYLO 3D";
  const { materialProps, animation } = node;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const [rx, ry, rz] = animation.rotateSpeed || [0, 0, 0];
    groupRef.current.rotation.x += rx * delta;
    groupRef.current.rotation.y += ry * delta;
    groupRef.current.rotation.z += rz * delta;

    if (animation.floatAmplitude > 0) {
      groupRef.current.position.y =
        node.position[1] +
        Math.sin(state.clock.elapsedTime * animation.floatSpeed) * animation.floatAmplitude;
    }
  });

  const scaleMultiplier = isHovered ? node.interactive.hoverScale || 1.1 : 1;

  return (
    <group
      ref={groupRef}
      position={node.position as [number, number, number]}
      rotation={node.rotation as [number, number, number]}
      scale={node.scale.map((s) => s * scaleMultiplier) as [number, number, number]}
      onClick={onClick}
    >
      <Center>
        <Text
          fontSize={0.8}
          color={materialProps.color || "#00F0FF"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#05070d"
        >
          {textContent}
        </Text>
      </Center>
    </group>
  );
};
