import { TemplateDefinition, TemplateSchema } from "../types";
import { DESIGN_TOKENS } from "../tokens";

export const matrixTemplate: TemplateDefinition = TemplateSchema.parse({
  id: "matrix",
  name: "Quantum Matrix",
  description:
    "An obsidian-dark technical environment with streaming emerald digital particles, neural geometric clusters, and cryptographic terminal aesthetics.",
  category: "Technology",
  templateVersion: "1.0.0",
  bestFor: "Security Researchers, Cryptographers, Systems Architects, Backend Engineers & Low-Level Devs",
  targetAudience: ["Cybersecurity Directors", "Lead Architects", "Engineering Executives"],

  supportedSections: ["hero", "about", "experience", "projects", "skills", "education", "contact"],
  supportedObjects: [
    "NeuralNodes",
    "FloatingMeshNode",
    "GeometricCluster",
    "CyberGrid",
    "torus",
    "particles",
  ],
  supportedAnimations: ["float", "pulse", "rotate"],

  defaultTheme: {
    id: "theme-quantum-matrix",
    name: "Quantum Matrix",
    variant: "dark",
    colors: {
      primary: "#00FF66", // Terminal Emerald
      secondary: "#059669", // Deep Jade
      accent: "#A3E635", // Electric Lime
      background: "#020704",
      surface: "#06120A",
      textPrimary: "#ECFDF5",
      textMuted: "#6EE7B7",
      border: "rgba(0, 255, 102, 0.22)",
      glowColor: "rgba(0, 255, 102, 0.4)",
    },
    typography: {
      fontFamily: "Space Grotesk",
      headingFontFamily: "Space Grotesk",
      baseSize: "md",
      scaleRatio: 1.2,
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
      borderRadius: "md",
    },
  },

  defaultScene: {
    id: "scene-matrix-default",
    name: "Quantum Matrix Subsystem",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 46,
      position: [0, 0, 7.2],
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
        maxPolarAngle: 1.6,
        minPolarAngle: 1.1,
        dampingFactor: 0.05,
      },
    },
    lighting: {
      preset: "neon-noir",
      ambientIntensity: 0.45,
      lights: [
        {
          id: "light-matrix-emerald",
          type: "point",
          color: "#00FF66",
          intensity: 2.8,
          position: [3, 2, 4],
          castShadow: false,
        },
        {
          id: "light-matrix-teal",
          type: "point",
          color: "#059669",
          intensity: 2.2,
          position: [-3, -2, 2],
          castShadow: false,
        },
        {
          id: "light-matrix-ambient",
          type: "ambient",
          color: "#021208",
          intensity: 0.6,
        },
      ],
    },
    background: {
      type: "gradient",
      gradientColors: ["#020704", "#05160A"],
    },
    environment: {
      stars: {
        enabled: true,
        count: 900,
        speed: 0.6,
      },
      fog: {
        enabled: true,
        color: "#030A05",
        near: 5,
        far: 22,
      },
    },
    nodes: [
      {
        id: "node-matrix-neural",
        componentType: "NeuralNodes",
        position: [0, 0, 0],
        scale: [1.3, 1.3, 1.3],
        materialProps: {
          type: "standard",
          color: "#00FF66",
          emissive: "#00FF66",
          emissiveIntensity: 1.1,
          metalness: 0.8,
          roughness: 0.2,
        },
        animation: {
          type: "rotate",
          speed: 0.5,
          rotateSpeed: [0.1, 0.3, 0],
        },
      },
      {
        id: "node-matrix-cluster",
        componentType: "GeometricCluster",
        position: [0, -1.8, -1],
        scale: [0.9, 0.9, 0.9],
        materialProps: {
          type: "standard",
          color: "#059669",
          transparent: true,
          opacity: 0.85,
        },
        animation: {
          type: "float",
          floatAmplitude: 0.3,
          floatSpeed: 0.8,
        },
      },
    ],
    postProcessing: {
      bloom: {
        enabled: true,
        intensity: 0.9,
        threshold: 0.25,
        radius: 0.7,
      },
      vignette: {
        enabled: true,
        darkness: 0.8,
        offset: 0.2,
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
    parallaxStrength: 0.4,
    rotationSpeed: 0.6,
    transitionPreset: "smooth-fade",
  },

  performanceProfile: "Quantum Matrix Performance",
  performance: {
    tier: "medium",
    recommendedParticles: 1200,
    maxLights: 3,
    maxDpr: 2,
    supportsPostProcessing: true,
    supportsShadows: false,
  },
});
