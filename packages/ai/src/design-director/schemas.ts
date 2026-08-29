import { z } from "zod";
import { CanonicalProfileSchema } from "../schemas/canonical-profile.schema";
import { PortfolioContentSchema } from "../schemas/portfolio-content.schema";
import { SceneSchema, PerformanceTierEnum } from "@zylo/three-engine";
import { ThemeSchema } from "@/schemas/theme.schema";

export const DesignInputSchema = z.object({
  profile: CanonicalProfileSchema,
  content: PortfolioContentSchema.optional(),
  style: z
    .object({
      preset: z.string().optional().default("Futuristic"),
      prompt: z.string().optional().default(""),
    })
    .default({}),
  profession: z.string().optional().default("Software Engineer"),
  industry: z.string().optional().default("Technology"),
  template: z
    .object({
      id: z.enum(["orbit", "neural", "glass", "creative", "minimal"]).default("orbit"),
      category: z.string().optional().default("3D Spatial"),
    })
    .default({ id: "orbit", category: "3D Spatial" }),
  targetAudience: z.string().optional().default("Employers & Clients"),
  performanceTier: PerformanceTierEnum.default("high"),
  reducedMotion: z.boolean().default(false),
});
export type DesignInput = z.infer<typeof DesignInputSchema>;

export const LayoutConfigSchema = z.object({
  hero: z.enum(["split", "center-cinematic", "minimal-editorial", "immersive-canvas"]).default("split"),
  about: z.enum(["split-metrics", "storyline", "bento-grid", "compact"]).default("split-metrics"),
  projects: z.enum(["cards-grid", "interactive-3d-deck", "minimal-list", "carousel"]).default("cards-grid"),
  experience: z.enum(["timeline", "dense-table", "stacked-cards"]).default("timeline"),
  skills: z.enum(["categorized-matrix", "floating-bubbles", "proficiency-bars"]).default("categorized-matrix"),
  contact: z.enum(["minimal-form", "interactive-card", "split-socials"]).default("minimal-form"),
});
export type LayoutConfig = z.infer<typeof LayoutConfigSchema>;

export const MotionConfigSchema = z.object({
  intensity: z.enum(["none", "subtle", "medium", "cinematic"]).default("medium"),
  scrollEffects: z.boolean().default(true),
  cameraParallax: z.boolean().default(true),
  hoverSpring: z.boolean().default(true),
  sectionTransitions: z.enum(["fade", "slide-up", "scale-in", "none"]).default("slide-up"),
});
export type MotionConfig = z.infer<typeof MotionConfigSchema>;

export const DesignPlanSchema = z.object({
  concept: z.string(),
  visualDirection: z.object({
    mood: z.string(),
    style: z.string(),
    paletteDescription: z.string(),
    primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
    secondaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
    accentColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
    backgroundColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
    surfaceColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
    fontFamily: z.enum(["Inter", "Outfit", "Space Grotesk", "Plus Jakarta Sans", "JetBrains Mono", "Syne", "Clash Display"]),
    headingFontFamily: z.enum(["Inter", "Outfit", "Space Grotesk", "Plus Jakarta Sans", "JetBrains Mono", "Syne", "Clash Display"]),
  }),
  layout: LayoutConfigSchema,
  motion: MotionConfigSchema,
  sceneConcept: z.object({
    concept: z.string(),
    templateId: z.enum(["orbit", "neural", "glass", "creative", "minimal"]),
    focalElement: z.string(),
    lightingMood: z.enum(["cyberpunk", "studio", "warm-sunset", "minimal-white", "neon-noir", "deep-space"]),
    particleAtmosphere: z.string(),
  }),
});
export type DesignPlan = z.infer<typeof DesignPlanSchema>;

export const DesignDirectorOutputSchema = z.object({
  theme: ThemeSchema,
  layout: LayoutConfigSchema,
  motion: MotionConfigSchema,
  scene: SceneSchema,
  plan: DesignPlanSchema,
  generatedAt: z.string(),
});
export type DesignDirectorOutput = z.infer<typeof DesignDirectorOutputSchema>;
