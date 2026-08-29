import { describe, it, expect } from "vitest";
import {
  ComponentRegistry,
  getComponentByType,
  TorusKnotCore,
  NeonRings,
  GeometricCluster,
  FloatingMeshNode,
  CyberGrid,
  CrystalPrism,
  SphereObject,
  BoxObject,
  TorusObject,
  PlaneObject,
  CylinderObject,
  ConeObject,
  ModelObject,
  Text3DObject,
  ParticleObject,
  NeuralNodes,
  ORBIT_SCENE_TEMPLATE,
  NEURAL_SCENE_TEMPLATE,
  GLASS_SCENE_TEMPLATE,
  CREATIVE_SCENE_TEMPLATE,
  MINIMAL_SCENE_TEMPLATE,
  HEAVY_SCENE_TEMPLATE,
  ComponentType,
} from "../packages/three-engine/src";

describe("@zylo/three-engine ComponentRegistry & Templates", () => {
  it("contains valid React components for all allowed ComponentType keys", () => {
    const requiredTypes: ComponentType[] = [
      "sphere",
      "box",
      "torus",
      "plane",
      "cylinder",
      "cone",
      "model",
      "text3d",
      "particles",
      "TorusKnotCore",
      "NeonRings",
      "GeometricCluster",
      "FloatingMeshNode",
      "CyberGrid",
      "ParticleVortex",
      "HologramPillar",
      "SphereOrb",
      "CrystalPrism",
      "InteractiveCard3D",
      "NeuralNodes",
    ];

    for (const type of requiredTypes) {
      const comp = ComponentRegistry[type];
      expect(comp).toBeDefined();
      expect(typeof comp).toBe("function");
    }
  });

  it("resolves basic geometries and procedural nodes correctly", () => {
    expect(getComponentByType("sphere")).toBe(SphereObject);
    expect(getComponentByType("box")).toBe(BoxObject);
    expect(getComponentByType("torus")).toBe(TorusObject);
    expect(getComponentByType("plane")).toBe(PlaneObject);
    expect(getComponentByType("cylinder")).toBe(CylinderObject);
    expect(getComponentByType("cone")).toBe(ConeObject);
    expect(getComponentByType("model")).toBe(ModelObject);
    expect(getComponentByType("text3d")).toBe(Text3DObject);
    expect(getComponentByType("particles")).toBe(ParticleObject);
    expect(getComponentByType("NeuralNodes")).toBe(NeuralNodes);
    expect(getComponentByType("TorusKnotCore")).toBe(TorusKnotCore);
    expect(getComponentByType("NeonRings")).toBe(NeonRings);
    expect(getComponentByType("GeometricCluster")).toBe(GeometricCluster);
    expect(getComponentByType("CyberGrid")).toBe(CyberGrid);
    expect(getComponentByType("CrystalPrism")).toBe(CrystalPrism);
  });

  it("falls back safely to TorusKnotCore if an unregistered component type is passed", () => {
    const fallback = getComponentByType("NonExistentUnregisteredComponent");
    expect(fallback).toBe(TorusKnotCore);
  });

  it("verifies all 6 built-in scene templates are valid and ready to render", () => {
    expect(ORBIT_SCENE_TEMPLATE.nodes.length).toBeGreaterThan(0);
    expect(NEURAL_SCENE_TEMPLATE.nodes.length).toBeGreaterThan(0);
    expect(GLASS_SCENE_TEMPLATE.nodes.length).toBeGreaterThan(0);
    expect(CREATIVE_SCENE_TEMPLATE.nodes.length).toBeGreaterThan(0);
    expect(MINIMAL_SCENE_TEMPLATE.nodes.length).toBeGreaterThan(0);
    expect(HEAVY_SCENE_TEMPLATE.nodes.length).toBe(20);
  });
});
