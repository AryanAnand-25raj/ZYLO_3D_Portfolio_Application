import { SceneConfig, SceneSchema } from "../schemas/scene.schema";

export const NEURAL_SCENE_TEMPLATE: SceneConfig = SceneSchema.parse({
  id: "template-neural-01",
  name: "Neural Network Vortex",
  version: "1.0.0",
  camera: {
    type: "perspective",
    fov: 48,
    position: [0, 0, 7.5],
    target: [0, 0, 0],
    near: 0.1,
    far: 1000,
    controls: {
      enabled: true,
      autoRotate: true,
      autoRotateSpeed: 0.6,
      dampingFactor: 0.05,
    },
  },
  lighting: {
    preset: "cyberpunk",
    ambientIntensity: 0.35,
    lights: [
      { id: "neu-1", type: "point", color: "#00F0FF", intensity: 4, position: [3, 3, 3] },
      { id: "neu-2", type: "point", color: "#00FF66", intensity: 3, position: [-3, -2, -2] },
    ],
  },
  environment: {
    preset: "night",
    background: { type: "solid", color: "#040711" },
    fog: { enabled: true, color: "#040711", near: 4, far: 20 },
    stars: { enabled: true, count: 1000, color: "#00F0FF", speed: 0.4 },
  },
  nodes: [
    {
      id: "neural-network-nodes",
      componentType: "NeuralNodes",
      position: [0, 0, 0],
      scale: [1.2, 1.2, 1.2],
      materialProps: { color: "#00F0FF" },
      animation: { rotateSpeed: [0.05, 0.15, 0] },
      interactive: { hoverScale: 1.1, hoverGlow: true },
      visible: true,
    },
    {
      id: "neural-particle-vortex",
      componentType: "ParticleVortex",
      position: [0, 0, 0],
      scale: [1.5, 1.5, 1.5],
      materialProps: { color: "#00FF66", opacity: 0.75 },
      animation: { speed: 0.4 },
      interactive: {},
      visible: true,
    },
    {
      id: "neural-cyber-grid",
      componentType: "CyberGrid",
      position: [0, -2, 0],
      scale: [1, 1, 1],
      materialProps: { color: "#00F0FF", opacity: 0.12 },
      animation: {},
      interactive: {},
      visible: true,
    },
  ],
  quality: "high",
});
