"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneMeshNode } from "../schemas/scene.schema";

export interface NodeComponentProps {
  node: SceneMeshNode;
  isHovered?: boolean;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

function useNodeAnimation(meshRef: React.RefObject<THREE.Mesh>, node: SceneMeshNode) {
  const { animation } = node;
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const [rx, ry, rz] = animation.rotateSpeed || [0, 0, 0];
    meshRef.current.rotation.x += rx * delta;
    meshRef.current.rotation.y += ry * delta;
    meshRef.current.rotation.z += rz * delta;

    if (animation.floatAmplitude > 0) {
      meshRef.current.position.y =
        node.position[1] +
        Math.sin(state.clock.elapsedTime * animation.floatSpeed) * animation.floatAmplitude;
    }

    if (animation.pulseSpeed > 0) {
      const [minS, maxS] = animation.pulseRange || [0.9, 1.1];
      const pulse = minS + (Math.sin(state.clock.elapsedTime * animation.pulseSpeed) + 1) * 0.5 * (maxS - minS);
      meshRef.current.scale.set(
        node.scale[0] * pulse,
        node.scale[1] * pulse,
        node.scale[2] * pulse
      );
    }
  });
}

// 1. SphereObject
export const SphereObject: React.FC<NodeComponentProps> = ({ node, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useNodeAnimation(meshRef, node);
  const { materialProps } = node;
  const scaleMultiplier = isHovered ? node.interactive.hoverScale || 1.1 : 1;

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      rotation={node.rotation as [number, number, number]}
      scale={node.scale.map((s) => s * scaleMultiplier) as [number, number, number]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <sphereGeometry args={[1, 32, 32]} />
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

// 2. BoxObject
export const BoxObject: React.FC<NodeComponentProps> = ({ node, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useNodeAnimation(meshRef, node);
  const { materialProps } = node;
  const scaleMultiplier = isHovered ? node.interactive.hoverScale || 1.1 : 1;

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      rotation={node.rotation as [number, number, number]}
      scale={node.scale.map((s) => s * scaleMultiplier) as [number, number, number]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <boxGeometry args={[1, 1, 1]} />
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

// 3. TorusObject
export const TorusObject: React.FC<NodeComponentProps> = ({ node, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useNodeAnimation(meshRef, node);
  const { materialProps } = node;
  const scaleMultiplier = isHovered ? node.interactive.hoverScale || 1.1 : 1;

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      rotation={node.rotation as [number, number, number]}
      scale={node.scale.map((s) => s * scaleMultiplier) as [number, number, number]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <torusGeometry args={[1, 0.3, 30, 64]} />
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

// 4. PlaneObject
export const PlaneObject: React.FC<NodeComponentProps> = ({ node, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useNodeAnimation(meshRef, node);
  const { materialProps } = node;

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      rotation={node.rotation as [number, number, number]}
      scale={node.scale as [number, number, number]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial
        color={materialProps.color}
        roughness={materialProps.roughness ?? 0.2}
        metalness={materialProps.metalness ?? 0.8}
        wireframe={materialProps.wireframe}
        transparent={materialProps.transparent}
        opacity={materialProps.opacity ?? 0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// 5. CylinderObject
export const CylinderObject: React.FC<NodeComponentProps> = ({ node, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useNodeAnimation(meshRef, node);
  const { materialProps } = node;
  const scaleMultiplier = isHovered ? node.interactive.hoverScale || 1.1 : 1;

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      rotation={node.rotation as [number, number, number]}
      scale={node.scale.map((s) => s * scaleMultiplier) as [number, number, number]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <cylinderGeometry args={[0.6, 0.6, 1.8, 32]} />
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

// 6. ConeObject
export const ConeObject: React.FC<NodeComponentProps> = ({ node, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useNodeAnimation(meshRef, node);
  const { materialProps } = node;
  const scaleMultiplier = isHovered ? node.interactive.hoverScale || 1.1 : 1;

  return (
    <mesh
      ref={meshRef}
      position={node.position as [number, number, number]}
      rotation={node.rotation as [number, number, number]}
      scale={node.scale.map((s) => s * scaleMultiplier) as [number, number, number]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <coneGeometry args={[0.8, 1.6, 32]} />
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
