import { SceneSchema, SceneConfig } from "@/schemas/scene.schema";

export const SCENE_PRESETS: Record<string, SceneConfig> = {
  "cyber-dimension": SceneSchema.parse({
    id: "scene-cyber-dimension",
    name: "Cyber Dimension",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 45,
      position: [0, 0, 7.5],
      target: [0, 0, 0],
      near: 0.1,
      far: 1000,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 0.8,
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: Math.PI / 2 + 0.1,
        minPolarAngle: Math.PI / 3,
        dampingFactor: 0.05,
      },
    },
    lighting: {
      preset: "cyberpunk",
      lights: [
        { id: "amb", type: "ambient", color: "#00F0FF", intensity: 0.4, castShadow: false },
        { id: "p1", type: "point", color: "#9D00FF", intensity: 5, position: [4, 3, 2], castShadow: false },
        { id: "p2", type: "point", color: "#00F0FF", intensity: 5, position: [-4, -3, 2], castShadow: false },
      ],
    },
    environment: {
      preset: "night",
      background: false,
      blur: 0.8,
      fog: { enabled: true, color: "#05070d", near: 5, far: 20 },
      particles: { enabled: true, count: 600, color: "#00F0FF", size: 0.025, speed: 0.4 },
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 1.2, luminanceThreshold: 0.2, luminanceSmoothing: 0.9 },
      chromaticAberration: { enabled: false, offset: [0.002, 0.002] },
      vignette: { enabled: true, darkness: 0.5, offset: 0.3 },
    },
    nodes: [
      {
        id: "core-torus",
        componentType: "TorusKnotCore",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        materialProps: {
          color: "#00F0FF",
          roughness: 0.1,
          metalness: 0.9,
          wireframe: false,
          transparent: true,
          opacity: 0.85,
          emissive: "#00F0FF",
          emissiveIntensity: 0.4,
        },
        animation: {
          rotateSpeed: [0.15, 0.3, 0.05],
          floatAmplitude: 0.15,
          floatSpeed: 1,
          pulseSpeed: 0,
        },
        interactive: {
          hoverScale: 1.1,
          hoverGlow: true,
          clickAction: "none",
        },
      },
      {
        id: "neon-rings",
        componentType: "NeonRings",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1.6, 1.6, 1.6],
        materialProps: {
          color: "#9D00FF",
          wireframe: true,
          opacity: 0.6,
        },
        animation: {
          rotateSpeed: [-0.2, 0.1, 0.15],
          floatAmplitude: 0,
          floatSpeed: 0,
          pulseSpeed: 0,
        },
        interactive: {
          hoverScale: 1.05,
          hoverGlow: true,
          clickAction: "none",
        },
      },
      {
        id: "grid-floor",
        componentType: "CyberGrid",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        materialProps: {
          color: "#00F0FF",
          opacity: 0.12,
        },
        animation: {
          rotateSpeed: [0, 0, 0],
          floatAmplitude: 0,
          floatSpeed: 0,
          pulseSpeed: 0,
        },
        interactive: {
          hoverScale: 1,
          hoverGlow: false,
          clickAction: "none",
        },
      },
    ],
    quality: "high",
    interactivity: {
      mouseParallax: true,
      parallaxFactor: 0.5,
      scrollDriven: true,
    },
  }),
  "crystal-matrix": SceneSchema.parse({
    id: "scene-crystal-matrix",
    name: "Crystal Matrix",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 45,
      position: [0, 0, 6],
      target: [0, 0, 0],
      near: 0.1,
      far: 1000,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 0.5,
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: Math.PI / 2,
        minPolarAngle: Math.PI / 4,
        dampingFactor: 0.05,
      },
    },
    lighting: {
      preset: "studio",
      lights: [],
    },
    environment: {
      preset: "city",
      background: false,
      blur: 0.8,
      fog: { enabled: true, color: "#090D16", near: 4, far: 18 },
      particles: { enabled: true, count: 400, color: "#38BDF8", size: 0.02, speed: 0.2 },
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 0.8, luminanceThreshold: 0.3, luminanceSmoothing: 0.8 },
      chromaticAberration: { enabled: false, offset: [0, 0] },
      vignette: { enabled: true, darkness: 0.4, offset: 0.2 },
    },
    nodes: [
      {
        id: "crystal-center",
        componentType: "CrystalPrism",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1.2, 1.2, 1.2],
        materialProps: {
          color: "#38BDF8",
          roughness: 0.05,
          metalness: 0.1,
          transparent: true,
          opacity: 0.95,
        },
        animation: {
          rotateSpeed: [0.1, 0.2, 0.1],
          floatAmplitude: 0.1,
          floatSpeed: 0.8,
          pulseSpeed: 0,
        },
        interactive: {
          hoverScale: 1.15,
          hoverGlow: true,
          clickAction: "none",
        },
      },
    ],
    quality: "high",
    interactivity: {
      mouseParallax: true,
      parallaxFactor: 0.4,
      scrollDriven: true,
    },
  }),
};

export function validateScene(scene: unknown): SceneConfig {
  return SceneSchema.parse(scene);
}
