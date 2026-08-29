import { DesignPlan } from "./schemas";
import { ThemeData, ThemeSchema } from "@/schemas/theme.schema";

export function generateThemeFromPlan(plan: DesignPlan, reducedMotion = false): ThemeData {
  const { visualDirection, motion } = plan;

  const isOled = visualDirection.backgroundColor === "#000000" || visualDirection.backgroundColor === "#030712";
  const variant = visualDirection.style.toLowerCase().includes("cyber")
    ? "cyber"
    : isOled
    ? "oled"
    : "dark";

  const theme: ThemeData = {
    id: `theme-${plan.sceneConcept.templateId}-${Date.now()}`,
    name: `${visualDirection.mood} ${visualDirection.style}`,
    variant,
    colors: {
      primary: visualDirection.primaryColor,
      secondary: visualDirection.secondaryColor,
      accent: visualDirection.accentColor,
      background: visualDirection.backgroundColor,
      surface: visualDirection.surfaceColor,
      textPrimary: "#F8FAFC",
      textMuted: "#94A3B8",
      border: "rgba(255, 255, 255, 0.12)",
      glowColor: `${visualDirection.primaryColor}4D`, // 30% alpha glow
    },
    typography: {
      fontFamily: visualDirection.fontFamily,
      headingFontFamily: visualDirection.headingFontFamily,
      baseSize: "md",
      scaleRatio: 1.25,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 16,
      opacity: 0.65,
      borderWidth: 1,
      reflectionGlow: true,
    },
    animations: {
      reducedMotion: reducedMotion || motion.intensity === "none",
      transitionSpeed: motion.intensity === "cinematic" ? "slow" : motion.intensity === "subtle" ? "fast" : "normal",
      entranceEffects: !reducedMotion && motion.intensity !== "none",
      hoverSpring: !reducedMotion && motion.hoverSpring,
    },
    layout: {
      containerWidth: "wide",
      cardStyle: "glass",
      borderRadius: "lg",
    },
  };

  return ThemeSchema.parse(theme);
}
