import { ThemeSchema, ThemeData } from "@/schemas/theme.schema";

export const THEME_PRESETS: Record<string, ThemeData> = {
  "neon-cyber": {
    id: "theme-neon-cyber",
    name: "Neon Cyberpunk",
    variant: "dark",
    colors: {
      primary: "#00F0FF",
      secondary: "#9D00FF",
      accent: "#FF007A",
      background: "#05070D",
      surface: "#0D111C",
      textPrimary: "#F8FAFC",
      textMuted: "#94A3B8",
      border: "rgba(255, 255, 255, 0.08)",
      glowColor: "rgba(0, 240, 255, 0.35)",
    },
    typography: {
      fontFamily: "Inter",
      headingFontFamily: "Outfit",
      baseSize: "md",
      scaleRatio: 1.25,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 16,
      opacity: 0.7,
      borderWidth: 1,
      reflectionGlow: true,
    },
    animations: {
      reducedMotion: false,
      transitionSpeed: "normal",
      entranceEffects: true,
      hoverSpring: true,
    },
    layout: {
      containerWidth: "wide",
      cardStyle: "glass",
      borderRadius: "lg",
    },
  },
  "minimal-slate": {
    id: "theme-minimal-slate",
    name: "Minimal Slate",
    variant: "minimal-slate",
    colors: {
      primary: "#E2E8F0",
      secondary: "#64748B",
      accent: "#38BDF8",
      background: "#090D16",
      surface: "#111827",
      textPrimary: "#F8FAFC",
      textMuted: "#64748B",
      border: "rgba(255, 255, 255, 0.05)",
      glowColor: "rgba(56, 189, 248, 0.2)",
    },
    typography: {
      fontFamily: "Space Grotesk",
      headingFontFamily: "Space Grotesk",
      baseSize: "md",
      scaleRatio: 1.2,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 12,
      opacity: 0.5,
      borderWidth: 1,
      reflectionGlow: false,
    },
    animations: {
      reducedMotion: false,
      transitionSpeed: "fast",
      entranceEffects: true,
      hoverSpring: false,
    },
    layout: {
      containerWidth: "compact",
      cardStyle: "minimal",
      borderRadius: "md",
    },
  },
  "emerald-matrix": {
    id: "theme-emerald-matrix",
    name: "Emerald Matrix",
    variant: "cyber",
    colors: {
      primary: "#00FF9D",
      secondary: "#059669",
      accent: "#00F0FF",
      background: "#030A07",
      surface: "#081C14",
      textPrimary: "#ECFDF5",
      textMuted: "#6EE7B7",
      border: "rgba(0, 255, 157, 0.15)",
      glowColor: "rgba(0, 255, 157, 0.3)",
    },
    typography: {
      fontFamily: "JetBrains Mono",
      headingFontFamily: "Syne",
      baseSize: "md",
      scaleRatio: 1.3,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 20,
      opacity: 0.8,
      borderWidth: 1,
      reflectionGlow: true,
    },
    animations: {
      reducedMotion: false,
      transitionSpeed: "normal",
      entranceEffects: true,
      hoverSpring: true,
    },
    layout: {
      containerWidth: "wide",
      cardStyle: "neon-outline",
      borderRadius: "lg",
    },
  },
};

export function validateTheme(theme: unknown): ThemeData {
  return ThemeSchema.parse(theme);
}
