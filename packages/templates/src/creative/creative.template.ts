import { TemplateDefinition, TemplateSchema } from "../types";
import { DESIGN_TOKENS } from "../tokens";

export const creativeTemplate: TemplateDefinition = TemplateSchema.parse({
  id: "creative",
  name: "Avant-Garde Creative",
  description:
    "An expressive art-gallery exhibition space featuring dynamic kinetic geometry, torus knot sculptures, bold color gradients, and museum-grade lighting.",
  category: "Creative & Design",
  templateVersion: "1.0.0",
  bestFor: "Art Directors, 3D Artists, Creative Technologists, Motion Designers & Fashion Brands",
  targetAudience: ["Creative Directors", "Agencies", "Museum Curators"],

  supportedSections: ["hero", "about", "experience", "projects", "skills", "education", "contact"],
  supportedObjects: [
    "TorusKnotCore",
    "GeometricCluster",
    "torus",
    "cone",
    "cylinder",
    "model",
  ],
  supportedAnimations: ["rotate", "float", "pulse", "sway"],

  defaultTheme: {
    id: "theme-avant-creative",
    name: "Avant-Garde Creative",
    variant: "dark",
    colors: {
      primary: DESIGN_TOKENS.colors.creativeRose,
      secondary: DESIGN_TOKENS.colors.amberWarm,
      accent: DESIGN_TOKENS.colors.neonEmerald,
      background: "#09050C",
      surface: "#170E1F",
      textPrimary: "#FFF1F2",
      textMuted: "#FDA4AF",
      border: "rgba(244, 63, 94, 0.25)",
      glowColor: "rgba(244, 63, 94, 0.3)",
    },
    typography: {
      fontFamily: "Outfit",
      headingFontFamily: "Clash Display",
      baseSize: "md",
      scaleRatio: 1.3,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 14,
      opacity: 0.68,
      borderWidth: 1.5,
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
      borderRadius: "xl",
    },
  },

  defaultScene: {
    id: "scene-creative-default",
    name: "Kinetic Sculpture Gallery",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 50,
      position: [0, 0.5, 7.8],
      target: [0, 0, 0],
      near: 0.1,
      far: 1000,
      zoom: 1,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 0.7,
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: Math.PI / 2 + 0.2,
        minPolarAngle: Math.PI / 3,
        dampingFactor: 0.04,
      },
    },
    lighting: {
      preset: "warm-sunset",
      ambientIntensity: 0.45,
      lights: [
        { id: "rose-spot", type: "spot", color: "#F43F5E", intensity: 5.5, position: [4, 5, 4] },
        { id: "amber-fill", type: "point", color: "#F59E0B", intensity: 3.5, position: [-4, -2, 2] },
      ],
    },
    environment: {
      preset: "sunset",
      background: { type: "solid", color: "#09050C" },
      blur: 0.8,
      fog: { enabled: true, color: "#09050C", near: 4, far: 20 },
      stars: { enabled: true, count: 600, color: "#F59E0B", radius: 45, depth: 35, speed: 0.5 },
    },
    postProcessing: {
      bloom: { enabled: true, intensity: 1.35, luminanceThreshold: 0.3, luminanceSmoothing: 0.8 },
      chromaticAberration: { enabled: false, offset: [0.002, 0.002] },
      vignette: { enabled: true, darkness: 0.55, offset: 0.3 },
    },
    performance: {
      tier: "high",
      maxPixelRatio: 2,
      shadows: false,
      postprocessing: true,
      maxParticles: 1500,
      maxLights: 4,
      maxObjects: 30,
      reducedMotion: false,
    },
    nodes: [
      {
        id: "creative-torus-knot",
        componentType: "TorusKnotCore",
        position: [0, 0, 0],
        rotation: [0.4, 0.2, 0],
        scale: [1.3, 1.3, 1.3],
        materialProps: { color: "#F43F5E", metalness: 0.9, roughness: 0.15, emissive: "#BE123C", emissiveIntensity: 0.5 },
        animation: { type: "rotate", rotateSpeed: [0.15, 0.3, 0.08], speed: 0.6 },
        interactive: { hoverScale: 1.12, hoverGlow: true, pointerParallax: true, parallaxStrength: 0.4 },
        visible: true,
      },
      {
        id: "creative-geometric-cluster",
        componentType: "GeometricCluster",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1.6, 1.6, 1.6],
        materialProps: { color: "#F59E0B", metalness: 0.8, roughness: 0.25 },
        animation: { type: "rotate", speed: 0.35 },
        interactive: { pointerParallax: true, parallaxStrength: 0.3 },
        visible: true,
      },
    ],
    quality: "high",
    interactivity: { mouseParallax: true, parallaxFactor: 0.5, scrollDriven: true },
  },

  defaultLayout: {
    containerWidth: "wide",
    heroLayout: "split-canvas-right",
    cardStyle: "neon-outline",
    navStyle: "floating-pill",
    sectionSpacing: "spacious",
  },

  defaultMotion: {
    scrollDriven: true,
    mouseParallax: true,
    parallaxStrength: 0.5,
    rotationSpeed: 0.7,
    transitionPreset: "spring-pop",
  },

  performanceProfile: "Expressive High-End Motion (Strong Visual Impact)",
  performance: {
    tier: "high",
    recommendedParticles: 1500,
    maxLights: 4,
    maxDpr: 2,
    supportsPostProcessing: true,
    supportsShadows: false,
  },

  previewImage: "/templates/creative-preview.webp",
});
