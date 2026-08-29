import { z } from "zod";

export const ColorPaletteSchema = z.object({
  primary: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Must be a valid hex color"),
  secondary: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Must be a valid hex color"),
  accent: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Must be a valid hex color"),
  background: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Must be a valid hex color"),
  surface: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Must be a valid hex color"),
  textPrimary: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Must be a valid hex color"),
  textMuted: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Must be a valid hex color"),
  border: z.string().default("rgba(255, 255, 255, 0.1)"),
  glowColor: z.string().default("rgba(0, 240, 255, 0.3)"),
});

export const TypographySchema = z.object({
  fontFamily: z.enum([
    "Inter",
    "Outfit",
    "Space Grotesk",
    "Plus Jakarta Sans",
    "JetBrains Mono",
    "Syne",
    "Clash Display",
  ]).default("Inter"),
  headingFontFamily: z.enum([
    "Inter",
    "Outfit",
    "Space Grotesk",
    "Plus Jakarta Sans",
    "JetBrains Mono",
    "Syne",
    "Clash Display",
  ]).default("Outfit"),
  baseSize: z.enum(["sm", "md", "lg"]).default("md"),
  scaleRatio: z.number().min(1.0).max(1.5).default(1.25),
});

export const GlassmorphismSchema = z.object({
  enabled: z.boolean().default(true),
  blurIntensity: z.number().min(0).max(40).default(16),
  opacity: z.number().min(0).max(1).default(0.65),
  borderWidth: z.number().min(0).max(4).default(1),
  reflectionGlow: z.boolean().default(true),
});

export const AnimationSettingsSchema = z.object({
  reducedMotion: z.boolean().default(false),
  transitionSpeed: z.enum(["slow", "normal", "fast"]).default("normal"),
  entranceEffects: z.boolean().default(true),
  hoverSpring: z.boolean().default(true),
});

export const ThemeSchema = z.object({
  id: z.string().default("theme-neon-cyber"),
  name: z.string().default("Neon Cyberpunk"),
  variant: z.enum(["dark", "light", "oled", "cyber", "minimal-slate"]).default("dark"),
  colors: ColorPaletteSchema,
  typography: TypographySchema.default({}),
  glassmorphism: GlassmorphismSchema.default({}),
  animations: AnimationSettingsSchema.default({}),
  layout: z
    .object({
      containerWidth: z.enum(["standard", "wide", "compact"]).default("wide"),
      cardStyle: z.enum(["glass", "solid", "neon-outline", "minimal"]).default("glass"),
      borderRadius: z.enum(["none", "sm", "md", "lg", "xl", "full"]).default("lg"),
    })
    .default({}),
});

export type ThemeData = z.infer<typeof ThemeSchema>;
export type ColorPalette = z.infer<typeof ColorPaletteSchema>;
export type TypographyConfig = z.infer<typeof TypographySchema>;
export type GlassmorphismConfig = z.infer<typeof GlassmorphismSchema>;
