import { SceneConfig, SceneSchema } from "../schemas/scene.schema";

export const GLASS_SCENE_TEMPLATE: SceneConfig = SceneSchema.parse({
  id: "template-glass-01",
  name: "Glass Refraction Dimension",
  version: "1.0.0",
  camera: {
    type: "perspective",
    fov: 45,
    position: [0, 0, 7],
    target: [0, 0, 0],
    near: 0.1,
    far: 1000,
    controls: {
      enabled: true,
      autoRotate: true,
      autoRotateSpeed: 0.7,
      dampingFactor: 0.05,
    },
  },
  lighting: {
    preset: "studio",
    ambientIntensity: 0.5,
    lights: [
      { id: "gl-1", type: "directional", color: "#ffffff", intensity: 3, position: [5, 8, 5] },
      { id: "gl-2", type: "point", color: "#00F0FF", intensity: 2, position: [-3, 2, 2] },
      { id: "gl-3", type: "point", color: "#FF00AA", intensity: 2, position: [3, -2, -2] },
    ],
  },
  environment: {
    preset: "studio",
    background: { type: "solid", color: "#080B14" },
    fog: { enabled: true, color: "#080B14", near: 6, far: 24 },
    stars: { enabled: false },
  },
  nodes: [
    {
      id: "glass-crystal-prism",
      componentType: "CrystalPrism",
      position: [0, 0, 0],
      scale: [1.4, 1.4, 1.4],
      materialProps: {
        type: "physical",
        color: "#ffffff",
        transmission: 0.92,
        roughness: 0.05,
        ior: 1.52,
        opacity: 0.95,
      },
      animation: {
        type: "rotate",
        rotateSpeed: [0.1, 0.25, 0.08],
        floatAmplitude: 0.15,
        floatSpeed: 0.9,
      },
      interactive: {
        hoverScale: 1.1,
        hoverGlow: true,
      },
      visible: true,
    },
    {
      id: "glass-floating-node-1",
      componentType: "FloatingMeshNode",
      position: [-2.2, 1.2, -1],
      scale: [0.6, 0.6, 0.6],
      materialProps: { color: "#00F0FF", opacity: 0.8 },
      animation: { rotateSpeed: [0.1, 0.2, 0], floatAmplitude: 0.2, floatSpeed: 1.2 },
      interactive: { hoverScale: 1.15 },
      visible: true,
    },
    {
      id: "glass-floating-node-2",
      componentType: "FloatingMeshNode",
      position: [2.2, -1, -1],
      scale: [0.5, 0.5, 0.5],
      materialProps: { color: "#FF00AA", opacity: 0.8 },
      animation: { rotateSpeed: [0.2, -0.1, 0], floatAmplitude: 0.2, floatSpeed: 0.8 },
      interactive: { hoverScale: 1.15 },
      visible: true,
    },
  ],
  quality: "high",
});
