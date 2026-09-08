import { TemplateDefinition, TemplateSchema } from "../types";
import { DESIGN_TOKENS } from "../tokens";

export const minimalTemplate: TemplateDefinition = TemplateSchema.parse({
  id: "minimal",
  name: "Essential Minimal",
  description:
    "An ultra-lightweight, recruiter-focused portfolio template with a single floating matte geometric form, high-contrast typography, and near-zero GPU footprint.",
  category: "Minimal & Professional",
  templateVersion: "1.0.0",
  bestFor: "Students, Junior Developers, Enterprise Consultants & Executives",
  targetAudience: ["Recruiters", "Hiring Managers", "Executive Search"],

  supportedSections: ["hero", "about", "experience", "projects", "skills", "education", "contact"],
  supportedObjects: [
    "sphere",
    "box",
    "model",
  ],
  supportedAnimations: ["float", "rotate"],

  defaultTheme: {
    id: "theme-essential-minimal",
    name: "Essential Minimal",
    variant: "minimal-slate",
    colors: {
      primary: DESIGN_TOKENS.colors.cleanWhite,
      secondary: "#94A3B8",
      accent: "#38BDF8",
      background: "#0A0D14",
      surface: "#111622",
      textPrimary: "#F8FAFC",
      textMuted: "#94A3B8",
      border: "rgba(255, 255, 255, 0.08)",
      glowColor: "rgba(255, 255, 255, 0.1)",
    },
    typography: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      baseSize: "md",
      scaleRatio: 1.2,
    },
    glassmorphism: {
      enabled: false,
      blurIntensity: 0,
      opacity: 0.95,
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
      containerWidth: "standard",
      cardStyle: "solid",
      borderRadius: "md",
    },
  },

  defaultScene: {
    id: "scene-minimal-default",
    name: "Minimal Floating Orb",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 42,
      position: [0, 0, 7.0],
      target: [0, 0, 0],
      near: 0.1,
      far: 500,
      zoom: 1,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 0.25,
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: Math.PI / 2,
        minPolarAngle: Math.PI / 3,
        dampingFactor: 0.05,
      },
    },
    lighting: {
      preset: "minimal-white",
      ambientIntensity: 0.7,
      lights: [
        { id: "soft-ambient", type: "directional", color: "#FFFFFF", intensity: 2.0, position: [2, 3, 2] },
      ],
    },
    environment: {
      preset: "none",
      background: { type: "solid", color: "#0A0D14" },
      blur: 0,
      fog: { enabled: false, color: "#0A0D14", near: 10, far: 30 },
      stars: { enabled: false, count: 0, color: "#FFFFFF", radius: 50, depth: 40, speed: 0 },
    },
    postProcessing: {
      bloom: { enabled: false, intensity: 0, luminanceThreshold: 1, luminanceSmoothing: 0 },
      chromaticAberration: { enabled: false, offset: [0, 0] },
      vignette: { enabled: false, darkness: 0, offset: 0 },
    },
    performance: {
      tier: "low",
      maxPixelRatio: 1.5,
      shadows: false,
      postprocessing: false,
      maxParticles: 100,
      maxLights: 2,
      maxObjects: 5,
      reducedMotion: false,
    },
    nodes: [
      {
        id: "minimal-single-sphere",
        componentType: "sphere",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1.3, 1.3, 1.3],
        materialProps: {
          color: "#E2E8F0",
          metalness: 0.3,
          roughness: 0.4,
          transparent: false,
          opacity: 1,
          wireframe: false,
        },
        animation: { type: "float", floatSpeed: 0.5, floatAmplitude: 0.08, rotateSpeed: [0, 0.1, 0] },
        interactive: { hoverScale: 1.04, hoverGlow: false, pointerParallax: true, parallaxStrength: 0.15 },
        visible: true,
      },
    ],
    quality: "low",
    interactivity: { mouseParallax: true, parallaxFactor: 0.2, scrollDriven: false },
  },

  defaultLayout: {
    containerWidth: "standard",
    heroLayout: "split-canvas-right",
    cardStyle: "solid",
    navStyle: "minimal-links",
    sectionSpacing: "normal",
  },

  defaultMotion: {
    scrollDriven: false,
    mouseParallax: true,
    parallaxStrength: 0.15,
    rotationSpeed: 0.25,
    transitionPreset: "gentle-slide",
  },

  performanceProfile: "Ultra Lightweight (Low-end Hardware / Mobile Optimized)",
  performance: {
    tier: "low",
    recommendedParticles: 0,
    maxLights: 2,
    maxDpr: 1.5,
    supportsPostProcessing: false,
    supportsShadows: false,
  },

  previewImage: "/templates/minimal-preview.webp",
});
