import { TemplateDefinition, TemplateSchema } from "../types";

export const gamingTemplate: TemplateDefinition = TemplateSchema.parse({
  id: "gaming",
  name: "Cyber Quest Gaming & Interactive",
  description:
    "An action-packed 3D gaming studio theme featuring mecha helmet visors, tactical quest card HUDs, live particle trails, and low-poly game asset displays.",
  category: "Gaming & Interactive",
  templateVersion: "1.0.0",
  bestFor: "Game Developers, Unity/Unreal Developers, Shader Artists, Technical Artists, 3D Modellers & Level Designers",
  targetAudience: ["AAA Studios", "Indie Publishers", "Esports Organizations", "Gaming DAOs"],

  supportedSections: ["hero", "about", "experience", "projects", "skills", "education", "contact"],
  supportedObjects: ["MechaCore", "ParticleVortex", "CyberGrid", "TorusKnotCore", "sphere"],
  supportedAnimations: ["rotate", "pulse", "float"],

  defaultTheme: {
    id: "theme-cyber-quest",
    name: "Cyber Quest Gaming",
    variant: "gaming",
    colors: {
      primary: "#10B981", // Emerald Quest Green
      secondary: "#8B5CF6", // Arcane Violet
      accent: "#F59E0B", // Legendary Gold
      background: "#080B10",
      surface: "#101620",
      textPrimary: "#FFFFFF",
      textMuted: "#9CA3AF",
      border: "rgba(16, 185, 129, 0.3)",
      glowColor: "rgba(16, 185, 129, 0.4)",
    },
    typography: {
      fontFamily: "Space Grotesk, sans-serif",
      headingFontFamily: "Space Grotesk, sans-serif",
      baseSize: "md",
      scaleRatio: 1.25,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 18,
      opacity: 0.8,
      borderWidth: 1.5,
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
      borderRadius: "lg",
    },
  },

  defaultScene: {
    id: "scene-gaming-default",
    name: "Cyber Arena Dimension",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 48,
      position: [0, 0, 7],
      target: [0, 0, 0],
      near: 0.1,
      far: 1000,
      zoom: 1,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 1.0,
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: 1.6,
        minPolarAngle: 0.9,
        dampingFactor: 0.05,
      },
    },
    lighting: {
      preset: "cyberpunk",
      ambientIntensity: 0.5,
      lights: [
        { id: "game-key-emerald", type: "point", color: "#10B981", intensity: 4, position: [3, 3, 2] },
        { id: "game-fill-violet", type: "point", color: "#8B5CF6", intensity: 3.5, position: [-3, -2, 2] },
      ],
    },
    background: {
      type: "gradient",
      gradientColors: ["#080B10", "#140F22"],
    },
    environment: {
      stars: {
        enabled: true,
        count: 1000,
        speed: 1.0,
      },
      fog: {
        enabled: true,
        color: "#080B10",
        near: 5,
        far: 20,
      },
    },
    nodes: [
      {
        id: "node-mecha",
        componentType: "MechaCore",
        position: [0, 0, 0],
        scale: [1.1, 1.1, 1.1],
        materialProps: {
          type: "standard",
          color: "#7928CA",
          emissive: "#00FF66",
          emissiveIntensity: 1.2,
          roughness: 0.2,
          metalness: 0.8,
        },
        animation: {
          type: "rotate",
          rotateSpeed: [0, 0.2, 0],
        },
        interactive: {
          hoverScale: 1.08,
          hoverGlow: true,
        },
      },
      {
        id: "node-vortex",
        componentType: "ParticleVortex",
        position: [0, 0, -1],
        scale: [1, 1, 1],
        materialProps: {
          type: "basic",
          color: "#10B981",
          transparent: true,
          opacity: 0.7,
        },
        animation: {
          type: "pulse",
          pulseSpeed: 1.0,
        },
      },
    ],
    postProcessing: {
      bloom: {
        enabled: true,
        intensity: 1.3,
        threshold: 0.2,
        radius: 0.85,
      },
      vignette: {
        enabled: true,
        darkness: 0.6,
        offset: 0.3,
      },
    },
  },

  defaultLayout: {
    containerWidth: "wide",
    heroLayout: "bento-grid",
    cardStyle: "neon-outline",
    navStyle: "floating-pill",
    sectionSpacing: "normal",
  },

  defaultMotion: {
    scrollDriven: true,
    mouseParallax: true,
    parallaxStrength: 0.5,
    rotationSpeed: 1.0,
    transitionPreset: "spring-pop",
  },

  performanceProfile: "Gaming High-Performance WebGL",
  performance: {
    tier: "high",
    recommendedParticles: 1600,
    maxLights: 4,
    maxDpr: 2,
    supportsPostProcessing: true,
    supportsShadows: false,
  },
});
