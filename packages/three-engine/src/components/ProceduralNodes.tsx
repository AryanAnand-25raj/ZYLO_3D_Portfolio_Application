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

// 12. AnimeCharacterAvatar — Stylized 3D Anime Character Bust
export const AnimeCharacterAvatar: React.FC<NodeComponentProps> = ({
  node,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const { materialProps, animation } = node;

  const primary = materialProps.color || "#FF2A85"; // Electric Sakura Pink
  const secondary = materialProps.emissive || "#00F0FF"; // Neo-Tokyo Cyan
  const accent = "#FFE600"; // Anime Gold

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle anime character breathing / idle float
    const floatSpeed = animation.floatSpeed || 1.2;
    const floatAmp = animation.floatAmplitude || 0.15;
    groupRef.current.position.y = node.position[1] + Math.sin(t * floatSpeed) * floatAmp;
    groupRef.current.rotation.y += (animation.rotateSpeed?.[1] || 0.25) * delta;

    // Halo gentle wobble
    if (haloRef.current) {
      haloRef.current.rotation.z += 0.8 * delta;
      haloRef.current.rotation.x = Math.sin(t * 1.5) * 0.15 + 0.3;
    }

    // Eye glow pulsation
    if (eyesRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.2;
      eyesRef.current.scale.set(pulse, pulse, 1);
    }
  });

  const scale = isHovered ? node.scale.map((s) => s * 1.1) : node.scale;

  return (
    <group
      ref={groupRef}
      position={node.position as [number, number, number]}
      scale={scale as [number, number, number]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* 1. Holographic Angelic / Cyber Halo behind head */}
      <mesh ref={haloRef} position={[0, 1.7, -0.4]} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[0.9, 0.04, 16, 64]} />
        <meshStandardMaterial
          color={secondary}
          emissive={secondary}
          emissiveIntensity={isHovered ? 2.5 : 1.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 2. Stylized Anime Head */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial
          color="#FFF0F5"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* 2b. Cel-shaded dark ink outline (slightly enlarged back-face shell) */}
      <mesh position={[0, 0.9, 0]} scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshBasicMaterial color="#0A0A14" side={THREE.BackSide} />
      </mesh>

      {/* 3. Anime Hair Strands / Spiky Crown */}
      {/* Front fringe */}
      <mesh position={[0, 1.35, 0.45]} rotation={[-0.3, 0, 0]}>
        <coneGeometry args={[0.3, 0.8, 4]} />
        <meshStandardMaterial color={primary} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[-0.35, 1.25, 0.4]} rotation={[-0.2, 0.3, 0.4]}>
        <coneGeometry args={[0.25, 0.7, 4]} />
        <meshStandardMaterial color={primary} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0.35, 1.25, 0.4]} rotation={[-0.2, -0.3, -0.4]}>
        <coneGeometry args={[0.25, 0.7, 4]} />
        <meshStandardMaterial color={primary} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Back hair volume */}
      <mesh position={[0, 1.1, -0.3]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.85, 24, 24]} />
        <meshStandardMaterial color={primary} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* 4. Glowing Cybernetic Anime Visor / Eyes */}
      <group ref={eyesRef} position={[0, 0.95, 0.65]}>
        {/* Left eye */}
        <mesh position={[-0.25, 0, 0]}>
          <capsuleGeometry args={[0.07, 0.16, 8, 16]} />
          <meshBasicMaterial color={secondary} />
        </mesh>
        {/* Right eye */}
        <mesh position={[0.25, 0, 0]}>
          <capsuleGeometry args={[0.07, 0.16, 8, 16]} />
          <meshBasicMaterial color={secondary} />
        </mesh>
        {/* Cyber bridge line */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[0.65, 0.03, 0.05]} />
          <meshBasicMaterial color={secondary} transparent opacity={0.7} />
        </mesh>
      </group>

      {/* 5. Cyber Mecha Headset / Ear Accents */}
      <mesh position={[-0.8, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#1A1C2E" emissive={secondary} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.8, 0.9, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#1A1C2E" emissive={secondary} emissiveIntensity={0.6} />
      </mesh>

      {/* 6. Stylized Anime Collar / Torso Bust */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.8, 1.1, 16]} />
        <meshStandardMaterial color="#101322" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* High-collar trim */}
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[0.42, 0.08, 12, 32]} />
        <meshStandardMaterial color={primary} emissive={primary} emissiveIntensity={0.8} />
      </mesh>

      {/* 7. Floating Orbiting Mana / Energy Orbs */}
      <mesh position={[1.4, 0.4, 0.3]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh position={[-1.3, 0.7, -0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={secondary} />
      </mesh>
      <mesh position={[0.5, 1.8, 0.6]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color={primary} />
      </mesh>
    </group>
  );
};

// 13. MechaCore — Evangelion / Gundam Tactical Mech Visor
export const MechaCore: React.FC<NodeComponentProps> = ({ node, isHovered, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sensorRef = useRef<THREE.Mesh>(null);
  const { materialProps, animation } = node;

  const mechaColor = materialProps.color || "#7928CA"; // EVA-01 Purple
  const sensorColor = materialProps.emissive || "#00FF66"; // Neon Green Optic

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y += (animation.rotateSpeed?.[1] || 0.2) * delta;
    groupRef.current.rotation.x = Math.sin(t * 0.8) * 0.08;

    if (sensorRef.current) {
      const scan = Math.sin(t * 4) * 0.3;
      sensorRef.current.position.x = scan;
    }
  });

  return (
    <group
      ref={groupRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
      onClick={onClick}
    >
      {/* Angular Mecha Head Shell */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color={mechaColor}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Optical Sensor Slit Housing */}
      <mesh position={[0, 0.1, 1.0]}>
        <boxGeometry args={[1.2, 0.16, 0.2]} />
        <meshStandardMaterial color="#0A0B12" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Active Glowing Monocular Sensor */}
      <mesh ref={sensorRef} position={[0, 0.1, 1.1]}>
        <boxGeometry args={[0.3, 0.12, 0.08]} />
        <meshBasicMaterial color={sensorColor} />
      </mesh>

      {/* Antenna V-Fin Wings */}
      <mesh position={[-0.7, 1.1, 0.2]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.1, 1.3, 0.05]} />
        <meshStandardMaterial color="#FFE600" roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh position={[0.7, 1.1, 0.2]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.1, 1.3, 0.05]} />
        <meshStandardMaterial color="#FFE600" roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Tactical Decal Ring */}
      <mesh position={[0, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.48, 32]} />
        <meshBasicMaterial color={sensorColor} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// 14. SakuraPetalField — Animated Floating Anime Cherry Blossom Petals
export const SakuraPetalField: React.FC<NodeComponentProps> = ({ node }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const petalCount = 200;

  const [positions, rotations] = useMemo(() => {
    const pos = new Float32Array(petalCount * 3);
    const rot = new Float32Array(petalCount * 3);
    for (let i = 0; i < petalCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      rot[i * 3] = Math.random() * Math.PI;
      rot[i * 3 + 1] = Math.random() * Math.PI;
      rot[i * 3 + 2] = Math.random() * Math.PI;
    }
    return [pos, rot];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < petalCount; i++) {
      // Drifting downwards with lateral sine wave breeze
      arr[i * 3 + 1] -= 0.6 * delta;
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 2) * 0.3 * delta;

      // Loop back to top
      if (arr[i * 3 + 1] < -5) {
        arr[i * 3 + 1] = 5;
        arr[i * 3] = (Math.random() - 0.5) * 14;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={node.position as [number, number, number]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={petalCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={node.materialProps.color || "#FFB7C5"}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 15. SpacePlanet — Celestial Planet with Atmosphere & Ring
export const SpacePlanet: React.FC<NodeComponentProps> = ({ node, isHovered }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { materialProps, animation } = node;

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += (animation.rotateSpeed?.[1] || 0.15) * delta;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.05 * delta;
    }
  });

  return (
    <group position={node.position as [number, number, number]} scale={node.scale as [number, number, number]}>
      {/* Planet Body */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color={materialProps.color || "#1E3A8A"}
          roughness={0.7}
          metalness={0.2}
          emissive={materialProps.emissive || "#0284C7"}
          emissiveIntensity={isHovered ? 0.6 : 0.25}
        />
      </mesh>

      {/* Atmospheric Glow Shell */}
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Planetary Orbit Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[2.0, 2.7, 64]} />
        <meshBasicMaterial
          color={materialProps.emissive || "#38BDF8"}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// 16. SatelliteOrbit — Space Satellite with Solar Panels in Orbit
export const SatelliteOrbit: React.FC<NodeComponentProps> = ({ node }) => {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += 0.3 * delta;
    }
    if (satelliteRef.current) {
      satelliteRef.current.rotation.x += 0.4 * delta;
    }
  });

  return (
    <group ref={orbitGroupRef} position={node.position as [number, number, number]} rotation={[0.4, 0, 0.3]}>
      {/* Orbital Path Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.22, 64]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Satellite Body along radius */}
      <group ref={satelliteRef} position={[3.2, 0, 0]}>
        {/* Main chassis */}
        <mesh>
          <boxGeometry args={[0.3, 0.3, 0.45]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Left Solar Panel */}
        <mesh position={[-0.45, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.25]} />
          <meshStandardMaterial color="#0284C7" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Right Solar Panel */}
        <mesh position={[0.45, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.25]} />
          <meshStandardMaterial color="#0284C7" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Dish */}
        <mesh position={[0, 0.22, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.15, 0.1, 16, 1, true]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

// 17. BuildingWireframe — Architectural Skyscraper Blueprint Wireframe
export const BuildingWireframe: React.FC<NodeComponentProps> = ({ node, isHovered }) => {
  const groupRef = useRef<THREE.Group>(null);
  const floors = 7;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.12 * delta;
  });

  return (
    <group
      ref={groupRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
    >
      {/* Stacked floor slabs */}
      {Array.from({ length: floors }).map((_, i) => {
        const y = (i - floors / 2) * 0.45;
        const width = 1.4 - i * 0.08;
        return (
          <mesh key={`floor-${i}`} position={[0, y, 0]}>
            <boxGeometry args={[width, 0.04, width]} />
            <meshStandardMaterial
              color={node.materialProps.color || "#00F0FF"}
              emissive={node.materialProps.color || "#00F0FF"}
              emissiveIntensity={isHovered ? 0.8 : 0.3}
              wireframe
            />
          </mesh>
        );
      })}

      {/* Central Core Column */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 3.2, 0.4]} />
        <meshStandardMaterial
          color="#0D1528"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Roof Spire */}
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.08, 0.8, 8]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>
    </group>
  );
};

// 18. CADStructure — Engineering Structural Truss Grid
export const CADStructure: React.FC<NodeComponentProps> = ({ node }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.1 * delta;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <group
      ref={groupRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
    >
      {/* 3D Wireframe Cube Cage */}
      <mesh>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshBasicMaterial color={node.materialProps.color || "#38BDF8"} wireframe />
      </mesh>

      {/* Internal Diagonal Cross Braces */}
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#F59E0B" wireframe />
      </mesh>
    </group>
  );
};

// 19. AutomotiveChassis — Aerodynamic Vehicle Silhouette with Rotating Wheels
export const AutomotiveChassis: React.FC<NodeComponentProps> = ({ node, isHovered }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.15 * delta;
    }
    if (wheelsRef.current) {
      wheelsRef.current.children.forEach((w) => {
        w.rotation.x += 2.5 * delta;
      });
    }
  });

  const bodyColor = node.materialProps.color || "#EF4444"; // Ferrari Red

  return (
    <group
      ref={groupRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
    >
      {/* Sleek Aerodynamic Car Body Shell */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.3, 0.35, 2.8]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.9}
          roughness={0.15}
          emissive={bodyColor}
          emissiveIntensity={isHovered ? 0.5 : 0.15}
        />
      </mesh>

      {/* Cockpit Canopy (Glass) */}
      <mesh position={[0, 0.5, -0.1]}>
        <boxGeometry args={[1.0, 0.3, 1.2]} />
        <meshPhysicalMaterial
          color="#0A0F1A"
          roughness={0.05}
          transmission={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Rear Spoiler Wing */}
      <mesh position={[0, 0.65, -1.25]}>
        <boxGeometry args={[1.4, 0.05, 0.3]} />
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 4 Rotating Disc Wheels */}
      <group ref={wheelsRef}>
        {/* Front Left */}
        <mesh position={[-0.75, 0, 0.9]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.18, 24]} />
          <meshStandardMaterial color="#1F2937" metalness={0.8} wireframe={false} />
        </mesh>
        {/* Front Right */}
        <mesh position={[0.75, 0, 0.9]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.18, 24]} />
          <meshStandardMaterial color="#1F2937" metalness={0.8} wireframe={false} />
        </mesh>
        {/* Rear Left */}
        <mesh position={[-0.75, 0, -0.9]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.22, 24]} />
          <meshStandardMaterial color="#1F2937" metalness={0.8} wireframe={false} />
        </mesh>
        {/* Rear Right */}
        <mesh position={[0.75, 0, -0.9]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.22, 24]} />
          <meshStandardMaterial color="#1F2937" metalness={0.8} wireframe={false} />
        </mesh>
      </group>
    </group>
  );
};

// 20. MechanicalGears — Interlocking Rotating Mechanical Clockwork Gears
export const MechanicalGears: React.FC<NodeComponentProps> = ({ node }) => {
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (gear1Ref.current) gear1Ref.current.rotation.z += 0.8 * delta;
    if (gear2Ref.current) gear2Ref.current.rotation.z -= 0.8 * delta;
  });

  return (
    <group position={node.position as [number, number, number]} scale={node.scale as [number, number, number]}>
      {/* Primary Gear */}
      <mesh ref={gear1Ref} position={[-0.8, 0, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.2, 16]} />
        <meshStandardMaterial
          color={node.materialProps.color || "#F59E0B"}
          roughness={0.3}
          metalness={0.85}
          wireframe
        />
      </mesh>

      {/* Secondary Counter-Rotating Gear */}
      <mesh ref={gear2Ref} position={[0.8, 0.6, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.2, 12]} />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.3}
          metalness={0.85}
          wireframe
        />
      </mesh>
    </group>
  );
};

// 21. TerminalCodeWall — Floating 3D Matrix Terminal Code Lines
export const TerminalCodeWall: React.FC<NodeComponentProps> = ({ node }) => {
  const groupRef = useRef<THREE.Group>(null);
  const codeLines = 8;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <group
      ref={groupRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
    >
      {/* Stack of horizontal holographic code strips */}
      {Array.from({ length: codeLines }).map((_, i) => {
        const y = (codeLines / 2 - i) * 0.35;
        const width = 1.6 + (i % 3) * 0.5;
        return (
          <mesh key={`code-line-${i}`} position={[0, y, (i % 2) * 0.1]}>
            <boxGeometry args={[width, 0.12, 0.02]} />
            <meshBasicMaterial
              color={node.materialProps.color || "#00F0FF"}
              transparent
              opacity={0.8 - i * 0.05}
            />
          </mesh>
        );
      })}

      {/* Blinking Prompt Cursor */}
      <mesh position={[-0.8, -1.3, 0.1]}>
        <boxGeometry args={[0.15, 0.22, 0.02]} />
        <meshBasicMaterial color="#00FF66" />
      </mesh>
    </group>
  );
};

// 22. ExecutiveMonolith — Luxury Beveled Titanium / Gold Obelisk with Gyroscopic Rings
export const ExecutiveMonolith: React.FC<NodeComponentProps> = ({ node, isHovered }) => {
  const monolithRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (monolithRef.current) {
      monolithRef.current.rotation.y += 0.2 * delta;
      monolithRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.x += 0.4 * delta;
    if (ring2Ref.current) ring2Ref.current.rotation.y += 0.3 * delta;
  });

  const gold = node.materialProps.color || "#D4AF37"; // Champagne Gold

  return (
    <group position={node.position as [number, number, number]} scale={node.scale as [number, number, number]}>
      {/* Pristine Monolith Slab */}
      <mesh ref={monolithRef}>
        <boxGeometry args={[0.8, 2.4, 0.3]} />
        <meshStandardMaterial
          color="#0F172A"
          emissive={gold}
          emissiveIntensity={isHovered ? 0.6 : 0.2}
          roughness={0.08}
          metalness={0.95}
        />
      </mesh>

      {/* Outer Gyro Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.8, 0.03, 16, 64]} />
        <meshStandardMaterial color={gold} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Inner Tilted Gyro Ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
};

// 23. VoxelGrid — Modular 3D Voxel Matrix Pulsating in Real-Time
export const VoxelGrid: React.FC<NodeComponentProps> = ({ node }) => {
  const groupRef = useRef<THREE.Group>(null);
  const gridSize = 3;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    let idx = 0;
    groupRef.current.children.forEach((child) => {
      child.scale.y = 1 + Math.sin(t * 3 + idx * 0.5) * 0.6;
      idx++;
    });
  });

  return (
    <group
      ref={groupRef}
      position={node.position as [number, number, number]}
      scale={node.scale as [number, number, number]}
    >
      {Array.from({ length: gridSize }).map((_, x) =>
        Array.from({ length: gridSize }).map((_, z) => (
          <mesh key={`voxel-${x}-${z}`} position={[(x - 1) * 0.7, 0, (z - 1) * 0.7]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color={node.materialProps.color || "#8B5CF6"}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        ))
      )}
    </group>
  );
};

