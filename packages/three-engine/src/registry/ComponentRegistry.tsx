"use client";

import React from "react";
import { ComponentType } from "../schemas/scene.schema";
import {
  SphereObject,
  BoxObject,
  TorusObject,
  PlaneObject,
  CylinderObject,
  ConeObject,
  ModelObject,
  Text3DObject,
  ParticleObject,
  TorusKnotCore,
  NeonRings,
  GeometricCluster,
  FloatingMeshNode,
  CyberGrid,
  ParticleVortex,
  HologramPillar,
  SphereOrb,
  CrystalPrism,
  InteractiveCard3D,
  NeuralNodes,
  AnimeCharacterAvatar,
  MechaCore,
  SakuraPetalField,
  SpacePlanet,
  SatelliteOrbit,
  BuildingWireframe,
  CADStructure,
  AutomotiveChassis,
  MechanicalGears,
  TerminalCodeWall,
  ExecutiveMonolith,
  VoxelGrid,
  NodeComponentProps,
} from "../components";

/**
 * SAFE COMPONENT REGISTRY
 * Maps declarative component types to strictly validated R3F components.
 * Arbitrary user or AI JavaScript code is strictly forbidden.
 */
export const ComponentRegistry: Record<ComponentType, React.FC<NodeComponentProps>> = {
  // Basic Geometries
  sphere: SphereObject,
  box: BoxObject,
  torus: TorusObject,
  plane: PlaneObject,
  cylinder: CylinderObject,
  cone: ConeObject,

  // Models & Assets
  model: ModelObject,
  text3d: Text3DObject,
  particles: ParticleObject,

  // Procedural Nodes & Presets
  TorusKnotCore,
  NeonRings,
  GeometricCluster,
  FloatingMeshNode,
  CyberGrid,
  ParticleVortex,
  HologramPillar,
  SphereOrb,
  CrystalPrism,
  InteractiveCard3D,
  NeuralNodes,

  // New Anime & Domain Procedural Nodes
  AnimeCharacterAvatar,
  MechaCore,
  SakuraPetalField,
  SpacePlanet,
  SatelliteOrbit,
  BuildingWireframe,
  CADStructure,
  AutomotiveChassis,
  MechanicalGears,
  TerminalCodeWall,
  ExecutiveMonolith,
  VoxelGrid,
};

export function getComponentByType(type: ComponentType | string): React.FC<NodeComponentProps> {
  const Component = ComponentRegistry[type as ComponentType];
  if (!Component) {
    console.warn(`[ComponentRegistry] Unknown 3D component type: ${type}. Using TorusKnotCore fallback.`);
    return TorusKnotCore;
  }
  return Component;
}

export function isComponentRegistered(type: string): boolean {
  return Boolean(ComponentRegistry[type as ComponentType]);
}
