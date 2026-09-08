import { TemplateDefinition, TemplateSchema } from "../types";
import { DESIGN_TOKENS } from "../tokens";

export const spatialTemplate: TemplateDefinition = TemplateSchema.parse({
  id: "spatial",
  name: "Spatial Hologram",
  description:
    "An Apple Vision Pro inspired spatial dimension with holographic pillars, iridescent crystal prisms, chromatic refractions, and floating glass cards.",
  category: "Product & Software",
  templateVersion: "1.0.0",
  bestFor: "Spatial Computing Engineers, VisionOS Developers, AR/VR Pioneers, Interactive 3D Designers & XR Technologists",
  targetAudience: ["Spatial Directors", "XR Studio Executives", "Venture Partners", "Hardware Innovators"],

  supportedSections: ["hero", "about", "experience", "projects", "skills", "education", "contact"],
  supportedObjects: [
    "HologramPillar",
    "CrystalPrism",
    "TorusKnotCore",
    "SphereOrb",
    "NeonRings",
    "particles",
  ],
  supportedAnimations: ["float", "rotate", "orbit", "pulse"],

  defaultTheme: {
    id: "theme-spatial-hologram",
    name: "Spatial Hologram",
    variant: "dark",
    colors: {
      primary: "#A855F7", // Iridescent Violet
      secondary: "#3B82F6", // Electric Blue
      accent: "#67E8F9", // Luminous Cyan
      background: "#06040C",
      surface: "#0E0A1A",
      textPrimary: "#FAF5FF",
      textMuted: "#C084FC",
      border: "rgba(168, 85, 247, 0.28)",
      glowColor: "rgba(168, 85, 247, 0.45)",
    },
    typography: {
      fontFamily: "Outfit",
      headingFontFamily: "Outfit",
      baseSize: "md",
      scaleRatio: 1.25,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 24,
      opacity: 0.68,
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

  defaultScene: {
    id: "scene-spatial-default",
    name: "Spatial Hologram Matrix",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 45,
      position: [0, 0, 7.8],
      target: [0, 0, 0],
      near: 0.1,
      far: 1000,
      zoom: 1,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 0.9,
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: 1.6,
        minPolarAngle: 1.1,
        dampingFactor: 0.05,
      },
    },
    lighting: {
      preset: "studio",
      ambientIntensity: 0.5,
      lights: [
        {
          id: "light-spatial-violet",
          type: "point",
          color: "#A855F7",
          intensity: 3.2,
          position: [3, 3, 3],
          castShadow: false,
        },
        {
          id: "light-spatial-blue",
          type: "point",
          color: "#3B82F6",
          intensity: 2.8,
          position: [-3, -2, 3],
          castShadow: false,
        },
        {
          id: "light-spatial-ambient",
          type: "ambient",
          color: "#0F0B1E",
          intensity: 0.7,
        },
      ],
    },
    background: {
      type: "gradient",
      gradientColors: ["#06040C", "#140C24"],
    },
    environment: {
      stars: {
        enabled: true,
        count: 1400,
        speed: 0.8,
      },
      fog: {
        enabled: true,
        color: "#090614",
        near: 6,
        far: 25,
      },
    },
    nodes: [
      {
        id: "node-spatial-prism",
        componentType: "CrystalPrism",
        position: [0, 0, 0],
        scale: [1.2, 1.2, 1.2],
        materialProps: {
          type: "physical",
          color: "#A855F7",
          emissive: "#3B82F6",
          emissiveIntensity: 0.8,
          roughness: 0.05,
          metalness: 0.1,
          transmission: 0.95,
          ior: 1.52,
          thickness: 1.5,
          transparent: true,
          opacity: 0.9,
        },
        animation: {
          type: "rotate",
          speed: 0.7,
          rotateSpeed: [0.15, 0.35, 0.05],
        },
      },
      {
        id: "node-spatial-pillar",
        componentType: "HologramPillar",
        position: [0, -2.2, 0],
        scale: [1.6, 1, 1.6],
        materialProps: {
          type: "basic",
          color: "#A855F7",
          transparent: true,
          opacity: 0.45,
        },
        animation: {
          type: "pulse",
          pulseSpeed: 0.8,
        },
      },
    ],
    postProcessing: {
      bloom: {
        enabled: true,
        intensity: 1.0,
        threshold: 0.2,
        radius: 0.8,
      },
      vignette: {
        enabled: true,
        darkness: 0.7,
        offset: 0.3,
      },
      chromaticAberration: {
        enabled: true,
        offset: [0.0025, 0.0025],
      },
    },
  },

  defaultLayout: {
    containerWidth: "wide",
    heroLayout: "split-canvas-right",
    cardStyle: "glass",
    navStyle: "floating-pill",
    sectionSpacing: "normal",
  },

  defaultMotion: {
    scrollDriven: true,
    mouseParallax: true,
    parallaxStrength: 0.45,
    rotationSpeed: 0.75,
    transitionPreset: "smooth-fade",
  },

  performanceProfile: "Spatial High-Fidelity",
  performance: {
    tier: "high",
    recommendedParticles: 1800,
    maxLights: 4,
    maxDpr: 2,
    supportsPostProcessing: true,
    supportsShadows: false,
  },
});
