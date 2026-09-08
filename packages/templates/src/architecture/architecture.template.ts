import { TemplateDefinition, TemplateSchema } from "../types";

export const architectureTemplate: TemplateDefinition = TemplateSchema.parse({
  id: "architecture",
  name: "BIM Architecture & Engineering",
  description:
    "A precision CAD blueprint dimension featuring 3D building structural wireframes, coordinate floor plans, isometric orthographic views, and technical annotations.",
  category: "Architecture & Engineering",
  templateVersion: "1.0.0",
  bestFor: "Architects, Civil Engineers, BIM Coordinators, Structural Engineers, Urban Planners & Industrial Designers",
  targetAudience: ["Architecture Studios", "Engineering Firms", "General Contractors", "Real Estate Developers"],

  supportedSections: ["hero", "about", "experience", "projects", "skills", "education", "contact"],
  supportedObjects: ["BuildingWireframe", "CADStructure", "CyberGrid", "box", "cylinder"],
  supportedAnimations: ["rotate", "float"],

  defaultTheme: {
    id: "theme-blueprint-cad",
    name: "CAD Blueprint Grid",
    variant: "architecture",
    colors: {
      primary: "#38BDF8", // Cyan Blueprint
      secondary: "#F59E0B", // CAD Orange
      accent: "#10B981", // Structural Green
      background: "#060A14",
      surface: "#0C1322",
      textPrimary: "#FFFFFF",
      textMuted: "#8DA2C0",
      border: "rgba(56, 189, 248, 0.25)",
      glowColor: "rgba(56, 189, 248, 0.35)",
    },
    typography: {
      fontFamily: "Space Grotesk, sans-serif",
      headingFontFamily: "Space Grotesk, sans-serif",
      baseSize: "md",
      scaleRatio: 1.25,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 14,
      opacity: 0.85,
      borderWidth: 1,
      reflectionGlow: false,
    },
    animations: {
      reducedMotion: false,
      transitionSpeed: "normal",
      entranceEffects: true,
      hoverSpring: false,
    },
    layout: {
      containerWidth: "wide",
      cardStyle: "solid",
      borderRadius: "md",
    },
  },

  defaultScene: {
    id: "scene-architecture-default",
    name: "Blueprint Wireframe Dimension",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 45,
      position: [4, 3, 6],
      target: [0, 0, 0],
      near: 0.1,
      far: 1000,
      zoom: 1,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 0.5,
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: 1.6,
        minPolarAngle: 0.8,
        dampingFactor: 0.05,
      },
    },
    lighting: {
      preset: "studio",
      ambientIntensity: 0.6,
      lights: [
        { id: "cad-dir", type: "directional", color: "#38BDF8", intensity: 2.5, position: [5, 8, 4] },
        { id: "cad-point", type: "point", color: "#F59E0B", intensity: 2, position: [-4, 2, -2] },
      ],
    },
    background: {
      type: "solid",
      color: "#060A14",
    },
    environment: {
      fog: {
        enabled: true,
        color: "#060A14",
        near: 6,
        far: 22,
      },
    },
    nodes: [
      {
        id: "node-building",
        componentType: "BuildingWireframe",
        position: [0, 0, 0],
        scale: [1.1, 1.1, 1.1],
        materialProps: {
          type: "standard",
          color: "#38BDF8",
          emissive: "#0284C7",
          emissiveIntensity: 0.4,
        },
        animation: {
          type: "rotate",
          rotateSpeed: [0, 0.15, 0],
        },
        interactive: {
          hoverScale: 1.05,
          hoverGlow: true,
        },
      },
      {
        id: "node-cad-grid",
        componentType: "CyberGrid",
        position: [0, -1.8, 0],
        scale: [2.2, 1, 2.2],
        materialProps: {
          type: "basic",
          color: "#38BDF8",
          transparent: true,
          opacity: 0.2,
        },
        animation: { type: "none" },
      },
    ],
    postProcessing: {
      bloom: {
        enabled: true,
        intensity: 0.7,
        threshold: 0.3,
        radius: 0.8,
      },
      vignette: {
        enabled: true,
        darkness: 0.4,
        offset: 0.3,
      },
    },
  },

  defaultLayout: {
    containerWidth: "wide",
    heroLayout: "split-canvas-right",
    cardStyle: "solid",
    navStyle: "sticky-header",
    sectionSpacing: "normal",
  },

  defaultMotion: {
    scrollDriven: true,
    mouseParallax: true,
    parallaxStrength: 0.3,
    rotationSpeed: 0.5,
    transitionPreset: "gentle-slide",
  },

  performanceProfile: "CAD Structural Balanced",
  performance: {
    tier: "medium",
    recommendedParticles: 600,
    maxLights: 3,
    maxDpr: 2,
    supportsPostProcessing: true,
    supportsShadows: false,
  },
});
