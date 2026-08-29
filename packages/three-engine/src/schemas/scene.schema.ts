import { z } from "zod";

export const Vec3Schema = z.tuple([z.number(), z.number(), z.number()]);
export type Vec3 = z.infer<typeof Vec3Schema>;

export const CameraConfigSchema = z.object({
  type: z.enum(["perspective", "orthographic"]).default("perspective"),
  fov: z.number().min(10).max(120).default(45),
  position: Vec3Schema.default([0, 0, 8]),
  target: Vec3Schema.default([0, 0, 0]),
  near: z.number().min(0.01).default(0.1),
  far: z.number().min(10).max(5000).default(1000),
  zoom: z.number().min(0.1).max(10).default(1),
  controls: z
    .object({
      enabled: z.boolean().default(true),
      autoRotate: z.boolean().default(true),
      autoRotateSpeed: z.number().min(-10).max(10).default(0.8),
      enableZoom: z.boolean().default(false),
      enablePan: z.boolean().default(false),
      maxPolarAngle: z.number().default(Math.PI / 2 + 0.1),
      minPolarAngle: z.number().default(Math.PI / 3),
      dampingFactor: z.number().min(0.01).max(0.5).default(0.05),
    })
    .default({}),
});
export type CameraConfig = z.infer<typeof CameraConfigSchema>;

export const LightNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["ambient", "directional", "point", "spot", "hemisphere"]),
  color: z.string().default("#ffffff"),
  intensity: z.number().min(0).max(50).default(1),
  position: Vec3Schema.optional(),
  target: Vec3Schema.optional(),
  castShadow: z.boolean().default(false),
  distance: z.number().min(0).max(200).optional(),
  decay: z.number().min(0).max(5).optional(),
  angle: z.number().min(0).max(Math.PI / 2).optional(),
  penumbra: z.number().min(0).max(1).optional(),
});
export type LightNode = z.infer<typeof LightNodeSchema>;

export const LightingConfigSchema = z.object({
  preset: z
    .enum(["studio", "cyberpunk", "warm-sunset", "minimal-white", "neon-noir", "deep-space"])
    .default("cyberpunk"),
  ambientIntensity: z.number().min(0).max(5).default(0.4),
  lights: z.array(LightNodeSchema).max(8).default([]),
});
export type LightingConfig = z.infer<typeof LightingConfigSchema>;

export const EnvironmentConfigSchema = z.object({
  preset: z
    .enum(["city", "sunset", "dawn", "night", "warehouse", "forest", "apartment", "studio", "none"])
    .default("night"),
  background: z
    .object({
      type: z.enum(["solid", "gradient", "transparent", "preset"]).default("transparent"),
      color: z.string().default("#05070d"),
      gradientColors: z.tuple([z.string(), z.string()]).optional(),
    })
    .default({}),
  blur: z.number().min(0).max(1).default(0.8),
  fog: z
    .object({
      enabled: z.boolean().default(true),
      color: z.string().default("#05070d"),
      near: z.number().min(0).default(5),
      far: z.number().min(1).default(30),
    })
    .default({}),
  stars: z
    .object({
      enabled: z.boolean().default(true),
      count: z.number().min(0).max(5000).default(1200),
      color: z.string().default("#ffffff"),
      radius: z.number().default(50),
      depth: z.number().default(40),
      speed: z.number().default(0.5),
    })
    .default({}),
});
export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;

export const MaterialPropsSchema = z.object({
  type: z.enum(["standard", "physical", "basic", "toon"]).default("standard"),
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
  thickness: z.number().min(0).max(10).optional(),
  clearcoat: z.number().min(0).max(1).optional(),
});
export type MaterialProps = z.infer<typeof MaterialPropsSchema>;

export const AnimationPropsSchema = z.object({
  type: z.enum(["rotate", "float", "pulse", "scale", "orbit", "fade", "move", "sway", "none"]).default("rotate"),
  axis: z.enum(["x", "y", "z", "all"]).default("y"),
  speed: z.number().min(-10).max(10).default(0.5),
  rotateSpeed: Vec3Schema.default([0.1, 0.2, 0]),
  floatAmplitude: z.number().min(0).max(5).default(0.2),
  floatSpeed: z.number().min(0).max(5).default(1),
  pulseSpeed: z.number().min(0).max(5).default(0),
  pulseRange: z.tuple([z.number(), z.number()]).default([0.9, 1.1]),
});
export type AnimationProps = z.infer<typeof AnimationPropsSchema>;

export const InteractionPropsSchema = z.object({
  hoverScale: z.number().min(0.5).max(3).default(1.08),
  hoverGlow: z.boolean().default(true),
  hoverColor: z.string().optional(),
  clickAction: z.enum(["none", "rotate", "focus", "trigger-event"]).default("none"),
  pointerParallax: z.boolean().default(true),
  parallaxStrength: z.number().min(0).max(2).default(0.3),
});
export type InteractionProps = z.infer<typeof InteractionPropsSchema>;

export const ComponentTypeEnum = z.enum([
  // Basic Geometries
  "sphere",
  "box",
  "torus",
  "plane",
  "cylinder",
  "cone",
  // Models & Assets
  "model",
  "text3d",
  "particles",
  // Procedural Nodes & Presets
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
]);
export type ComponentType = z.infer<typeof ComponentTypeEnum>;

export const SceneMeshNodeSchema = z.object({
  id: z.string(),
  componentType: ComponentTypeEnum,
  assetId: z.string().optional(), // Approved asset ID
  label: z.string().optional(),
  position: Vec3Schema.default([0, 0, 0]),
  rotation: Vec3Schema.default([0, 0, 0]),
  scale: Vec3Schema.default([1, 1, 1]),
  materialProps: MaterialPropsSchema.default({}),
  animation: AnimationPropsSchema.default({}),
  interactive: InteractionPropsSchema.default({}),
  visible: z.boolean().default(true),
});
export type SceneMeshNode = z.infer<typeof SceneMeshNodeSchema>;

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
export type PostProcessingConfig = z.infer<typeof PostProcessingConfigSchema>;

export const PerformanceTierEnum = z.enum(["ultra", "high", "medium", "low", "mobile", "reduced_motion"]);
export type PerformanceTier = z.infer<typeof PerformanceTierEnum>;

export const PerformanceConfigSchema = z.object({
  tier: PerformanceTierEnum.default("high"),
  maxPixelRatio: z.number().min(1).max(3).default(2),
  shadows: z.boolean().default(false),
  postprocessing: z.boolean().default(true),
  maxParticles: z.number().min(100).max(10000).default(3000),
  maxLights: z.number().min(1).max(8).default(6),
  maxObjects: z.number().min(1).max(100).default(50),
  reducedMotion: z.boolean().default(false),
});
export type PerformanceConfig = z.infer<typeof PerformanceConfigSchema>;

export const SceneSchema = z.object({
  id: z.string().default("scene-cyber-dimension"),
  name: z.string().default("Cyber Dimension"),
  version: z.string().default("1.0.0"),
  camera: CameraConfigSchema.default({}),
  lighting: LightingConfigSchema.default({}),
  environment: EnvironmentConfigSchema.default({}),
  postProcessing: PostProcessingConfigSchema.default({}),
  performance: PerformanceConfigSchema.default({}),
  nodes: z.array(SceneMeshNodeSchema).max(100).default([]),
  quality: z.enum(["low", "medium", "high", "ultra"]).default("high"),
  interactivity: z
    .object({
      mouseParallax: z.boolean().default(true),
      parallaxFactor: z.number().min(0).max(2).default(0.5),
      scrollDriven: z.boolean().default(true),
    })
    .default({}),
});
export type SceneConfig = z.infer<typeof SceneSchema>;
