import { TemplateDefinition, TemplateSchema } from "../types";

export const automotiveTemplate: TemplateDefinition = TemplateSchema.parse({
  id: "automotive",
  name: "Apex Automotive & Mechanical",
  description:
    "An ultra-aerodynamic mechanical showcase featuring 3D hypercar wireframe chassis, rotating disc brake telemetry, exploded powertrain layers, and carbon fiber styling.",
  category: "Automotive & Mechanical",
  templateVersion: "1.0.0",
  bestFor: "Mechanical Engineers, Automotive Designers, Motorsports Technicians, Aerodynamics Specialists & Industrial Engineers",
  targetAudience: ["Automotive OEMs", "Racing Teams", "Aerospace Contractors", "Hardware Ventures"],

  supportedSections: ["hero", "about", "experience", "projects", "skills", "education", "contact"],
  supportedObjects: ["AutomotiveChassis", "MechanicalGears", "CyberGrid", "cylinder", "box"],
  supportedAnimations: ["rotate", "move", "pulse"],

  defaultTheme: {
    id: "theme-apex-carbon",
    name: "Apex Carbon Racing",
    variant: "automotive",
    colors: {
      primary: "#EF4444", // Racing Crimson
      secondary: "#F59E0B", // Tachometer Amber
      accent: "#38BDF8", // Turbo Cyan
      background: "#09090E",
      surface: "#13131A",
      textPrimary: "#FFFFFF",
      textMuted: "#A1A1B5",
      border: "rgba(239, 68, 68, 0.3)",
      glowColor: "rgba(239, 68, 68, 0.4)",
    },
    typography: {
      fontFamily: "Space Grotesk, sans-serif",
      headingFontFamily: "Space Grotesk, sans-serif",
      baseSize: "md",
      scaleRatio: 1.25,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 16,
      opacity: 0.8,
      borderWidth: 1,
      reflectionGlow: true,
    },
    animations: {
      reducedMotion: false,
      transitionSpeed: "fast",
      entranceEffects: true,
      hoverSpring: true,
    },
    layout: {
      containerWidth: "wide",
      cardStyle: "neon-outline",
      borderRadius: "md",
    },
  },

  defaultScene: {
    id: "scene-automotive-default",
    name: "Aero Track Dimension",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 45,
      position: [3.5, 1.8, 4.5],
      target: [0, 0.2, 0],
      near: 0.1,
      far: 1000,
      zoom: 1,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 0.7,
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: 1.6,
        minPolarAngle: 0.8,
        dampingFactor: 0.05,
      },
    },
    lighting: {
      preset: "studio",
      ambientIntensity: 0.5,
      lights: [
        { id: "auto-spot", type: "spot", color: "#ffffff", intensity: 4, position: [3, 6, 3] },
        { id: "auto-rim", type: "point", color: "#EF4444", intensity: 3, position: [-3, 1, -2] },
      ],
    },
    background: {
      type: "solid",
      color: "#09090E",
    },
    environment: {
      fog: {
        enabled: true,
        color: "#09090E",
        near: 5,
        far: 20,
      },
    },
    nodes: [
      {
        id: "node-chassis",
        componentType: "AutomotiveChassis",
        position: [0, 0, 0],
        scale: [1, 1, 1],
        materialProps: {
          type: "standard",
          color: "#EF4444",
          metalness: 0.9,
          roughness: 0.15,
        },
        animation: {
          type: "rotate",
          rotateSpeed: [0, 0.15, 0],
        },
        interactive: {
          hoverScale: 1.08,
          hoverGlow: true,
        },
      },
    ],
    postProcessing: {
      bloom: {
        enabled: true,
        intensity: 0.9,
        threshold: 0.25,
        radius: 0.8,
      },
      vignette: {
        enabled: true,
        darkness: 0.5,
        offset: 0.3,
      },
    },
  },

  defaultLayout: {
    containerWidth: "wide",
    heroLayout: "split-canvas-right",
    cardStyle: "neon-outline",
    navStyle: "dock-bottom",
    sectionSpacing: "normal",
  },

  defaultMotion: {
    scrollDriven: true,
    mouseParallax: true,
    parallaxStrength: 0.4,
    rotationSpeed: 0.7,
    transitionPreset: "spring-pop",
  },

  performanceProfile: "Automotive High-Octane Performance",
  performance: {
    tier: "high",
    recommendedParticles: 800,
    maxLights: 3,
    maxDpr: 2,
    supportsPostProcessing: true,
    supportsShadows: false,
  },
});
