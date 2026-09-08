import { TemplateDefinition, TemplateSchema } from "../types";
import { DESIGN_TOKENS } from "../tokens";

export const cyberpunkTemplate: TemplateDefinition = TemplateSchema.parse({
  id: "cyberpunk",
  name: "Cyberpunk Syndicate",
  description:
    "A high-octane futuristic theme featuring glowing cyber grids, neon wireframes, particle speed lines, and high-contrast electric magenta accents.",
  category: "Creative & Design",
  templateVersion: "1.0.0",
  bestFor: "Game Developers, Web3 Engineers, Creative Technologists, Shader Artists & Hardware Hackers",
  targetAudience: ["Gaming Studios", "Web3 Founders", "Creative Agencies", "Venture Capitalists"],

  supportedSections: ["hero", "about", "experience", "projects", "skills", "education", "contact"],
  supportedObjects: [
    "CyberGrid",
    "NeonRings",
    "ParticleVortex",
    "FloatingMeshNode",
    "torus",
    "model",
    "particles",
  ],
  supportedAnimations: ["rotate", "pulse", "float", "orbit"],

  defaultTheme: {
    id: "theme-cyberpunk-syndicate",
    name: "Cyber Syndicate",
    variant: "cyber",
    colors: {
      primary: "#FF007F", // Electric Magenta
      secondary: "#00F0FF", // Neon Cyan
      accent: "#FFE600", // Cyber Yellow
      background: "#05050A",
      surface: "#0D0D18",
      textPrimary: "#FFFFFF",
      textMuted: "#A0A0B8",
      border: "rgba(255, 0, 127, 0.3)",
      glowColor: "rgba(255, 0, 127, 0.5)",
    },
    typography: {
      fontFamily: "Space Grotesk",
      headingFontFamily: "Space Grotesk",
      baseSize: "md",
      scaleRatio: 1.25,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 20,
      opacity: 0.75,
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
    id: "scene-cyberpunk-default",
    name: "Cyberpunk Grid Dimension",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 50,
      position: [0, 0, 7.5],
      target: [0, 0, 0],
      near: 0.1,
      far: 1000,
      zoom: 1,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 1.2,
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: 1.65,
        minPolarAngle: 1.05,
        dampingFactor: 0.05,
      },
    },
    lighting: {
      preset: "cyberpunk",
      ambientIntensity: 0.5,
      lights: [
        {
          id: "light-cyber-pink",
          type: "point",
          color: "#FF007F",
          intensity: 3.5,
          position: [4, 3, 3],
          castShadow: false,
        },
        {
          id: "light-cyber-cyan",
          type: "point",
          color: "#00F0FF",
          intensity: 3.0,
          position: [-4, -2, 2],
          castShadow: false,
        },
        {
          id: "light-cyber-ambient",
          type: "ambient",
          color: "#180D2B",
          intensity: 0.8,
        },
      ],
    },
    background: {
      type: "gradient",
      gradientColors: ["#05050A", "#12071E"],
    },
    environment: {
      stars: {
        enabled: true,
        count: 1200,
        speed: 1.2,
      },
      fog: {
        enabled: true,
        color: "#080612",
        near: 6,
        far: 24,
      },
    },
    nodes: [
      {
        id: "node-cyber-grid",
        componentType: "CyberGrid",
        position: [0, -2.5, 0],
        scale: [2.5, 1, 2.5],
        materialProps: {
          type: "basic",
          color: "#FF007F",
          transparent: true,
          opacity: 0.6,
        },
        animation: {
          type: "none",
        },
      },
      {
        id: "node-cyber-rings",
        componentType: "NeonRings",
        position: [0, 0.2, 0],
        scale: [1.2, 1.2, 1.2],
        materialProps: {
          type: "standard",
          color: "#00F0FF",
          emissive: "#00F0FF",
          emissiveIntensity: 1.5,
          metalness: 0.9,
          roughness: 0.1,
        },
        animation: {
          type: "rotate",
          speed: 1.0,
          rotateSpeed: [0.2, 0.6, 0.1],
        },
      },
      {
        id: "node-cyber-vortex",
        componentType: "ParticleVortex",
        position: [0, 0, -1],
        scale: [1, 1, 1],
        materialProps: {
          type: "basic",
          color: "#FF007F",
          transparent: true,
          opacity: 0.7,
        },
        animation: {
          type: "pulse",
          pulseSpeed: 1.2,
        },
      },
    ],
    postProcessing: {
      bloom: {
        enabled: true,
        intensity: 1.2,
        threshold: 0.2,
        radius: 0.8,
      },
      vignette: {
        enabled: true,
        darkness: 0.75,
        offset: 0.25,
      },
      chromaticAberration: {
        enabled: true,
        offset: [0.003, 0.003],
      },
    },
  },

  defaultLayout: {
    containerWidth: "wide",
    heroLayout: "split-canvas-right",
    cardStyle: "neon-outline",
    navStyle: "floating-pill",
    sectionSpacing: "normal",
  },

  defaultMotion: {
    scrollDriven: true,
    mouseParallax: true,
    parallaxStrength: 0.5,
    rotationSpeed: 0.9,
    transitionPreset: "cyber-glitch",
  },

  performanceProfile: "Cyberpunk High-Fidelity",
  performance: {
    tier: "high",
    recommendedParticles: 2000,
    maxLights: 4,
    maxDpr: 2,
    supportsPostProcessing: true,
    supportsShadows: false,
  },
});
