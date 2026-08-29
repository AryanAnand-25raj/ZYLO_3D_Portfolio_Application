"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneMeshNode } from "../schemas/scene.schema";
import { NodeComponentProps } from "./BasicGeometries";

// 1. TorusKnotCore
export const TorusKnotCore: React.FC<NodeComponentProps> = ({
  node,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { materialProps, animation } = node;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const [rx, ry, rz] = animation.rotateSpeed || [0.1, 0.2, 0];
    meshRef.current.rotation.x += rx * delta;
    meshRef.current.rotation.y += ry * delta;
    meshRef.current.rotation.z += rz * delta;

    if (animation.floatAmplitude > 0) {
      meshRef.current.position.y =
        node.position[1] +
        Math.sin(state.clock.elapsedTime * animation.floatSpeed) * animation.floatAmplitude;
    }
  });

  const scale = isHovered ? node.scale.map((s) => s * 1.1) : node.scale;

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      rotation={node.rotation as [number, number, number]}
      scale={scale as [number, number, number]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
      <meshStandardMaterial
        color={materialProps.color}
        emissive={materialProps.emissive || materialProps.color}
        emissiveIntensity={isHovered ? 0.8 : materialProps.emissiveIntensity ?? 0.3}
        roughness={materialProps.roughness ?? 0.2}
        metalness={materialProps.metalness ?? 0.8}
        wireframe={materialProps.wireframe}
        transparent={materialProps.transparent}
        opacity={materialProps.opacity ?? 0.9}
      />
    </mesh>
  );
};

// 2. NeonRings
export const NeonRings: React.FC<NodeComponentProps> = ({ node }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { materialProps, animation } = node;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const [rx, ry, rz] = animation.rotateSpeed || [0.1, 0.15, 0];
    groupRef.current.rotation.x += rx * delta;
    groupRef.current.rotation.y += ry * delta;
    groupRef.current.rotation.z += rz * delta;
  });

  return (
    <group
      ref={groupRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.25, 64]} />
        <meshBasicMaterial
          color={materialProps.color}
          side={THREE.DoubleSide}
          transparent
          opacity={materialProps.opacity ?? 0.8}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <ringGeometry args={[1.5, 1.54, 64]} />
        <meshBasicMaterial
          color={materialProps.emissive || "#9D00FF"}
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

// 3. GeometricCluster
export const GeometricCluster: React.FC<NodeComponentProps> = ({ node, isHovered, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { materialProps, animation } = node;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += (animation.rotateSpeed[0] || 0.1) * delta;
    meshRef.current.rotation.y += (animation.rotateSpeed[1] || 0.2) * delta;
    if (animation.floatAmplitude > 0) {
      meshRef.current.position.y =
        node.position[1] +
        Math.cos(state.clock.elapsedTime * animation.floatSpeed) * animation.floatAmplitude;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
      onClick={onClick}
    >
      <icosahedronGeometry args={[1.2, 0]} />
      <meshStandardMaterial
        color={materialProps.color}
        wireframe={materialProps.wireframe ?? true}
        emissive={materialProps.color}
        emissiveIntensity={isHovered ? 1 : 0.4}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
};

// 4. FloatingMeshNode
export const FloatingMeshNode: React.FC<NodeComponentProps> = ({ node }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { materialProps, animation } = node;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += (animation.rotateSpeed[1] || 0.2) * delta;
    meshRef.current.position.y =
      node.position[1] +
      Math.sin(state.clock.elapsedTime * (animation.floatSpeed || 1)) *
        (animation.floatAmplitude || 0.2);
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
    >
      <dodecahedronGeometry args={[0.9, 0]} />
      <meshStandardMaterial
        color={materialProps.color}
        roughness={materialProps.roughness ?? 0.3}
        metalness={materialProps.metalness ?? 0.7}
        transparent={materialProps.transparent ?? true}
        opacity={materialProps.opacity ?? 0.85}
      />
    </mesh>
  );
};

// 5. CyberGrid
export const CyberGrid: React.FC<NodeComponentProps> = ({ node }) => {
  const { materialProps } = node;

  return (
    <mesh
      position={[node.position[0], node.position[1] - 2, node.position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={node.scale as [number, number, number]}
    >
      <planeGeometry args={[40, 40, 30, 30]} />
      <meshBasicMaterial
        color={materialProps.color || "#00F0FF"}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
};

// 6. SphereOrb
export const SphereOrb: React.FC<NodeComponentProps> = ({ node, isHovered }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { materialProps, animation } = node;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += (animation.rotateSpeed[1] || 0.2) * delta;
    meshRef.current.position.y =
      node.position[1] +
      Math.sin(state.clock.elapsedTime * (animation.floatSpeed || 1)) * (animation.floatAmplitude || 0.2);
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
    >
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial
        color={materialProps.color}
        emissive={materialProps.color}
        emissiveIntensity={isHovered ? 0.8 : 0.3}
        roughness={0.1}
        metalness={0.9}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

// 7. CrystalPrism
export const CrystalPrism: React.FC<NodeComponentProps> = ({ node }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { materialProps, animation } = node;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += (animation.rotateSpeed[1] || 0.2) * delta;
    meshRef.current.rotation.z += (animation.rotateSpeed[2] || 0.1) * delta;
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
    >
      <octahedronGeometry args={[1.2, 0]} />
      <meshPhysicalMaterial
        color={materialProps.color}
        roughness={0.05}
        transmission={0.9}
        thickness={1.2}
        ior={1.5}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
};

// 8. ParticleVortex
export const ParticleVortex: React.FC<NodeComponentProps> = ({ node }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 400;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return [pos];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.3 * delta;
  });

  return (
    <points ref={pointsRef} position={node.position as [number, number, number]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={node.materialProps.color || "#00F0FF"}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 9. HologramPillar
export const HologramPillar: React.FC<NodeComponentProps> = ({ node }) => {
  return (
    <mesh position={node.position as [number, number, number]} scale={node.scale as [number, number, number]}>
      <cylinderGeometry args={[0.8, 0.8, 3, 32, 1, true]} />
      <meshBasicMaterial
        color={node.materialProps.color || "#00F0FF"}
        wireframe
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// 10. InteractiveCard3D
export const InteractiveCard3D: React.FC<NodeComponentProps> = ({ node, isHovered, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.1 * delta;
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
      onClick={onClick}
    >
      <boxGeometry args={[2, 1.2, 0.1]} />
      <meshStandardMaterial
        color={node.materialProps.color || "#0D111C"}
        emissive={node.materialProps.color || "#00F0FF"}
        emissiveIntensity={isHovered ? 0.5 : 0.1}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
};

// 11. NeuralNodes (Connected kinetic network for Neural template)
export const NeuralNodes: React.FC<NodeComponentProps> = ({ node }) => {
  const groupRef = useRef<THREE.Group>(null);
  const nodeCount = 12;

  const nodePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      const radius = 2 + Math.random() * 1.5;
      const angle = (i / nodeCount) * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2;
      positions.push([Math.cos(angle) * radius, y, Math.sin(angle) * radius]);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.15 * delta;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef} position={node.position as [number, number, number]} scale={node.scale as [number, number, number]}>
      {nodePositions.map((pos, i) => (
        <mesh key={`node-${i}`} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={node.materialProps.color || "#00F0FF"} />
        </mesh>
      ))}
    </group>
  );
};
