import { z } from "zod";
import { SceneSchema } from "@zylo/three-engine";

export const TemplatePerformanceSchema = z.object({
  tier: z.enum(["low", "medium", "high", "ultra"]),
  recommendedParticles: z.number().int().nonnegative().default(1000),
  maxLights: z.number().int().min(1).max(8).default(4),
  maxDpr: z.number().min(1).max(3).default(2),
  supportsPostProcessing: z.boolean().default(true),
  supportsShadows: z.boolean().default(false),
});
export type TemplatePerformance = z.infer<typeof TemplatePerformanceSchema>;

export const TemplateLayoutSchema = z.object({
  containerWidth: z.enum(["compact", "standard", "wide"]).default("wide"),
  heroLayout: z
    .enum([
      "split-canvas-right",
      "fullscreen-behind",
      "minimal-centered",
      "gallery-grid",
      "anime-showcase",
      "bento-grid",
      "terminal-split",
    ])
    .default("split-canvas-right"),
  cardStyle: z.enum(["glass", "solid", "neon-outline", "minimal", "anime-cel"]).default("glass"),
  navStyle: z.enum(["floating-pill", "sticky-header", "dock-bottom", "minimal-links"]).default("floating-pill"),
  sectionSpacing: z.enum(["compact", "normal", "spacious"]).default("normal"),
});
export type TemplateLayout = z.infer<typeof TemplateLayoutSchema>;

export const TemplateMotionSchema = z.object({
  scrollDriven: z.boolean().default(true),
  mouseParallax: z.boolean().default(true),
  parallaxStrength: z.number().min(0).max(2).default(0.4),
  rotationSpeed: z.number().min(0).max(5).default(0.5),
  transitionPreset: z.enum(["smooth-fade", "spring-pop", "cyber-glitch", "gentle-slide"]).default("smooth-fade"),
});
export type TemplateMotion = z.infer<typeof TemplateMotionSchema>;

export const TemplateCategoryEnum = z.enum([
  "Technology",
  "Aerospace & Science",
  "Product & Software",
  "Creative & Design",
  "Minimal & Professional",
  "Anime & Character",
  "Gaming & Interactive",
  "Architecture & Engineering",
  "Automotive & Mechanical",
  "Experimental WebGL",
]);
export type TemplateCategory = z.infer<typeof TemplateCategoryEnum>;

export const TemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: TemplateCategoryEnum,
  templateVersion: z.string().default("1.0.0"),
  bestFor: z.string(),
  targetAudience: z.array(z.string()).default([]),

  supportedSections: z.array(z.string()),
  supportedObjects: z.array(z.string()),
  supportedAnimations: z.array(z.string()),

  defaultTheme: z.record(z.any()), // ThemeConfig compatible
  defaultScene: SceneSchema,
  defaultLayout: TemplateLayoutSchema.default({}),
  defaultMotion: TemplateMotionSchema.default({}),

  performanceProfile: z.string().default("Balanced WebGL"),
  performance: TemplatePerformanceSchema,

  previewImage: z.string().default(""),
});

export type TemplateDefinition = z.infer<typeof TemplateSchema>;
