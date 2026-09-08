"use client";

import React, { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SceneMeshNode } from "../schemas/scene.schema";
import { getApprovedAsset } from "../registry/AssetRegistry";
import { defaultAssetResolver } from "../assets/resolver";
import { NodeComponentProps } from "./BasicGeometries";

// Fallback proxy mesh when model is loading or assetId is not found
const ModelFallbackProxy: React.FC<NodeComponentProps> = ({ node, isHovered, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += (node.animation.rotateSpeed[1] || 0.3) * delta;
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
      onClick={onClick}
    >
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={node.materialProps.color || "#00F0FF"}
        wireframe
        emissive={node.materialProps.color || "#00F0FF"}
        emissiveIntensity={isHovered ? 0.8 : 0.3}
      />
    </mesh>
  );
};

const GLTFModelInternal: React.FC<{ url: string; node: SceneMeshNode; isHovered?: boolean; onClick?: () => void }> = ({
  url,
  node,
  isHovered,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(url);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const [rx, ry, rz] = node.animation.rotateSpeed || [0, 0, 0];
    groupRef.current.rotation.x += rx * delta;
    groupRef.current.rotation.y += ry * delta;
    groupRef.current.rotation.z += rz * delta;

    if (node.animation.floatAmplitude > 0) {
      groupRef.current.position.y =
        node.position[1] +
        Math.sin(state.clock.elapsedTime * node.animation.floatSpeed) * node.animation.floatAmplitude;
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
      <primitive object={gltf.scene.clone()} />
    </group>
  );
};

export const ModelObject: React.FC<NodeComponentProps> = (props) => {
  const { node } = props;
  const legacyAsset = node.assetId ? getApprovedAsset(node.assetId) : null;
  const resolved = defaultAssetResolver.resolveAsset(node.assetId);

  const modelUrl = legacyAsset?.url || (resolved && !resolved.isFallback ? resolved.url : null);

  if (!modelUrl) {
    return <ModelFallbackProxy {...props} />;
  }

  return (
    <Suspense fallback={<ModelFallbackProxy {...props} />}>
      <GLTFModelInternal url={modelUrl} node={node} isHovered={props.isHovered} onClick={props.onClick} />
    </Suspense>
  );
};
