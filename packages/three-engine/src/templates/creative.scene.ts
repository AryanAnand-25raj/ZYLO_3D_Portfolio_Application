import { SceneConfig, SceneSchema } from "../schemas/scene.schema";

export const CREATIVE_SCENE_TEMPLATE: SceneConfig = SceneSchema.parse({
  id: "template-creative-01",
  name: "Creative Kinetic Cluster",
  version: "1.0.0",
  camera: {
    type: "perspective",
    fov: 50,
    position: [0, 0, 7.5],
    target: [0, 0, 0],
    controls: { enabled: true, autoRotate: true, autoRotateSpeed: 1 },
  },
  lighting: {
    preset: "warm-sunset",
    ambientIntensity: 0.4,
    lights: [
      { id: "cr-1", type: "directional", color: "#FF5500", intensity: 3, position: [4, 5, 3] },
      { id: "cr-2", type: "point", color: "#FF0077", intensity: 3, position: [-4, -3, 2] },
    ],
  },
  environment: {
    preset: "sunset",
    background: { type: "solid", color: "#0B0410" },
    fog: { enabled: true, color: "#0B0410", near: 5, far: 22 },
  },
  nodes: [
    {
      id: "creative-cluster-core",
      componentType: "GeometricCluster",
      position: [0, 0, 0],
      scale: [1.3, 1.3, 1.3],
      materialProps: { color: "#FF0077", emissive: "#FF5500", wireframe: true },
      animation: { rotateSpeed: [0.2, 0.3, 0.1], floatAmplitude: 0.2, floatSpeed: 1 },
      interactive: { hoverScale: 1.15, hoverGlow: true },
      visible: true,
    },
    {
      id: "creative-rings",
      componentType: "NeonRings",
      position: [0, 0, 0],
      scale: [1.6, 1.6, 1.6],
      materialProps: { color: "#FF5500" },
      animation: { rotateSpeed: [-0.15, 0.2, 0] },
      interactive: {},
      visible: true,
    },
  ],
  quality: "high",
});

export const MINIMAL_SCENE_TEMPLATE: SceneConfig = SceneSchema.parse({
  id: "template-minimal-01",
  name: "Minimalist Sculptural Torus",
  version: "1.0.0",
  camera: {
    type: "perspective",
    fov: 42,
    position: [0, 0, 8],
    target: [0, 0, 0],
    controls: { enabled: true, autoRotate: true, autoRotateSpeed: 0.5 },
  },
  lighting: {
    preset: "minimal-white",
    ambientIntensity: 0.6,
    lights: [
      { id: "min-1", type: "directional", color: "#ffffff", intensity: 2, position: [0, 8, 4] },
    ],
  },
  environment: {
    preset: "apartment",
    background: { type: "solid", color: "#0A0A0C" },
    fog: { enabled: true, color: "#0A0A0C", near: 6, far: 25 },
    stars: { enabled: false },
  },
  nodes: [
    {
      id: "minimal-torus-knot",
      componentType: "TorusKnotCore",
      position: [0, 0, 0],
      scale: [1.2, 1.2, 1.2],
      materialProps: {
        type: "standard",
        color: "#E2E8F0",
        roughness: 0.15,
        metalness: 0.85,
        wireframe: false,
      },
      animation: {
        rotateSpeed: [0.05, 0.1, 0],
        floatAmplitude: 0.1,
        floatSpeed: 0.6,
      },
      interactive: { hoverScale: 1.05 },
      visible: true,
    },
  ],
  quality: "high",
});

export const HEAVY_SCENE_TEMPLATE: SceneConfig = SceneSchema.parse({
  id: "template-heavy-stress",
  name: "Heavy Stress Test Scene",
  version: "1.0.0",
  camera: {
    type: "perspective",
    fov: 50,
    position: [0, 0, 10],
    target: [0, 0, 0],
    controls: { enabled: true, autoRotate: true, autoRotateSpeed: 2 },
  },
  lighting: {
    preset: "cyberpunk",
    lights: [
      { id: "h-1", type: "point", color: "#00F0FF", intensity: 4, position: [4, 4, 4] },
      { id: "h-2", type: "point", color: "#FF007A", intensity: 4, position: [-4, -4, -4] },
      { id: "h-3", type: "directional", color: "#ffffff", intensity: 2, position: [0, 8, 0] },
      { id: "h-4", type: "spot", color: "#9D00FF", intensity: 3, position: [0, -5, 3] },
    ],
  },
  environment: {
    preset: "night",
    stars: { enabled: true, count: 5000, speed: 2 },
  },
  nodes: Array.from({ length: 20 }).map((_, i) => ({
    id: `heavy-node-${i}`,
    componentType: i % 2 === 0 ? "GeometricCluster" : "TorusKnotCore",
    position: [(i % 5 - 2) * 2, Math.floor(i / 5) * 1.5 - 1.5, 0],
    scale: [0.5, 0.5, 0.5],
    materialProps: { color: i % 2 === 0 ? "#00F0FF" : "#FF007A" },
    animation: { rotateSpeed: [0.2, 0.3, 0.1], floatAmplitude: 0.2 },
    interactive: { hoverScale: 1.1 },
    visible: true,
  })),
  quality: "ultra",
});
