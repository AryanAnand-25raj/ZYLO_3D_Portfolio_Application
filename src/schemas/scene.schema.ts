import { z } from "zod";

export const Vec3Schema = z.tuple([z.number(), z.number(), z.number()]);

export const CameraConfigSchema = z.object({
  type: z.enum(["perspective", "orthographic"]).default("perspective"),
  fov: z.number().min(10).max(120).default(45),
  position: Vec3Schema.default([0, 0, 8]),
  target: Vec3Schema.default([0, 0, 0]),
  near: z.number().min(0.01).default(0.1),
  far: z.number().min(10).default(1000),
  controls: z
    .object({
      enabled: z.boolean().default(true),
      autoRotate: z.boolean().default(true),
      autoRotateSpeed: z.number().default(0.8),
      enableZoom: z.boolean().default(false),
      enablePan: z.boolean().default(false),
      maxPolarAngle: z.number().default(Math.PI / 2 + 0.1),
      minPolarAngle: z.number().default(Math.PI / 3),
      dampingFactor: z.number().default(0.05),
    })
    .default({}),
});

export const LightNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["ambient", "directional", "point", "spot", "hemisphere"]),
  color: z.string().default("#ffffff"),
  intensity: z.number().min(0).max(50).default(1),
  position: Vec3Schema.optional(),
  target: Vec3Schema.optional(),
  castShadow: z.boolean().default(false),
  distance: z.number().optional(),
  decay: z.number().optional(),
});

export const LightingConfigSchema = z.object({
  preset: z.enum(["studio", "cyberpunk", "warm-sunset", "minimal-white", "neon-noir", "deep-space"]).default("cyberpunk"),
  lights: z.array(LightNodeSchema).default([]),
});

export const EnvironmentConfigSchema = z.object({
  preset: z.enum(["city", "sunset", "dawn", "night", "warehouse", "forest", "apartment", "studio", "none"]).default("night"),
  background: z.boolean().default(false),
  blur: z.number().min(0).max(1).default(0.8),
  fog: z
    .object({
      enabled: z.boolean().default(true),
      color: z.string().default("#05070d"),
      near: z.number().default(5),
      far: z.number().default(25),
    })
    .default({}),
  particles: z
    .object({
      enabled: z.boolean().default(true),
      count: z.number().min(0).max(5000).default(800),
      color: z.string().default("#00f0ff"),
      size: z.number().min(0.001).max(0.5).default(0.03),
      speed: z.number().min(0).max(5).default(0.3),
    })
    .default({}),
});

export const PostProcessingConfigSchema = z.object({
  bloom: z
    .object({
      enabled: z.boolean().default(true),
      intensity: z.number().min(0).max(5).default(1.2),
      luminanceThreshold: z.number().min(0).max(1).default(0.2),
      luminanceSmoothing: z.number().min(0).max(1).default(0.9),
    })
    .default({}),
  chromaticAberration: z
    .object({
      enabled: z.boolean().default(false),
      offset: z.tuple([z.number(), z.number()]).default([0.002, 0.002]),
    })
    .default({}),
  vignette: z
    .object({
      enabled: z.boolean().default(true),
      darkness: z.number().min(0).max(1).default(0.5),
      offset: z.number().min(0).max(1).default(0.3),
    })
    .default({}),
});

// Allowed safe registered 3D procedural components - NO ARBITRARY CODE EXECUTION
export const ComponentTypeEnum = z.enum([
  "GeometricCluster",
  "FloatingMeshNode",
  "CyberGrid",
  "ParticleVortex",
  "NeonRings",
  "HologramPillar",
  "InteractiveCard3D",
  "TorusKnotCore",
  "SphereOrb",
  "CrystalPrism",
]);

export const SceneMeshNodeSchema = z.object({
  id: z.string(),
  componentType: ComponentTypeEnum,
  position: Vec3Schema.default([0, 0, 0]),
  rotation: Vec3Schema.default([0, 0, 0]),
  scale: Vec3Schema.default([1, 1, 1]),
  materialProps: z
    .object({
      color: z.string().default("#00F0FF"),
      emissive: z.string().optional(),
      emissiveIntensity: z.number().min(0).max(10).default(0.5),
      roughness: z.number().min(0).max(1).default(0.2),
      metalness: z.number().min(0).max(1).default(0.8),
      wireframe: z.boolean().default(false),
      transparent: z.boolean().default(true),
      opacity: z.number().min(0).max(1).default(0.9),
      transmission: z.number().min(0).max(1).optional(),
      ior: z.number().min(1).max(3).optional(),
    })
    .default({}),
  animation: z
    .object({
      rotateSpeed: Vec3Schema.default([0.1, 0.2, 0]),
      floatAmplitude: z.number().min(0).max(5).default(0.2),
      floatSpeed: z.number().min(0).max(5).default(1),
      pulseSpeed: z.number().min(0).max(5).default(0),
    })
    .default({}),
  interactive: z
    .object({
      hoverScale: z.number().default(1.1),
      hoverGlow: z.boolean().default(true),
      clickAction: z.enum(["none", "rotate", "focus", "trigger-event"]).default("none"),
    })
    .default({}),
});

export const SceneSchema = z.object({
  id: z.string().default("scene-cyber-dimension"),
  name: z.string().default("Cyber Dimension"),
  version: z.string().default("1.0.0"),
  camera: CameraConfigSchema.default({}),
  lighting: LightingConfigSchema.default({}),
  environment: EnvironmentConfigSchema.default({}),
  postProcessing: PostProcessingConfigSchema.default({}),
  nodes: z.array(SceneMeshNodeSchema).default([]),
  quality: z.enum(["low", "medium", "high", "ultra"]).default("high"),
  interactivity: z
    .object({
      mouseParallax: z.boolean().default(true),
      parallaxFactor: z.number().default(0.5),
      scrollDriven: z.boolean().default(true),
    })
    .default({}),
});

export type SceneConfig = z.infer<typeof SceneSchema>;
export type SceneMeshNode = z.infer<typeof SceneMeshNodeSchema>;
export type ComponentType = z.infer<typeof ComponentTypeEnum>;
export type CameraConfig = z.infer<typeof CameraConfigSchema>;
export type LightingConfig = z.infer<typeof LightingConfigSchema>;
export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;
export type PostProcessingConfig = z.infer<typeof PostProcessingConfigSchema>;
