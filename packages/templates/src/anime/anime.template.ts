import { TemplateDefinition, TemplateSchema } from "../types";
import { DESIGN_TOKENS } from "../tokens";

export const animeTemplate: TemplateDefinition = TemplateSchema.parse({
  id: "anime",
  name: "Neo-Tokyo Manga & Character",
  description:
    "An electrifying anime & stylized character dimension featuring 3D anime avatars, cel-shaded outlines, glowing visors, floating Sakura blossom particles, and high-impact manga Japanese typography.",
  category: "Anime & Character",
  templateVersion: "1.0.0",
  bestFor: "Anime Artists, VTubers, 3D Character Creators, Game Developers, Manga Illustrators, Creative Technologists & Japanese Pop-Culture Founders",
  targetAudience: ["Anime Gaming Studios", "VTuber Agencies", "Animation Studios", "Web3 Gaming Guilds", "Creative Fans"],

  supportedSections: [
    "hero",
    "about",
    "experience",
    "projects",
    "skills",
    "education",
    "contact",
  ],
  supportedObjects: [
    "AnimeCharacterAvatar",
    "MechaCore",
    "SakuraPetalField",
    "CyberGrid",
    "NeonRings",
    "SphereOrb",
    "particles",
  ],
  supportedAnimations: ["float", "rotate", "pulse", "orbit"],

  defaultTheme: {
    id: "theme-neo-tokyo-manga",
    name: "Neo-Tokyo Manga Cel",
    variant: "anime",
    colors: {
      primary: "#FF2A85", // Electric Sakura Magenta
      secondary: "#00F0FF", // Neo-Tokyo Cyan
      accent: "#FFE600", // Anime Shonen Gold
      background: "#080612",
      surface: "#120D22",
      textPrimary: "#FFFFFF",
      textMuted: "#B8B3D1",
      border: "rgba(255, 42, 133, 0.35)",
      glowColor: "rgba(255, 42, 133, 0.5)",
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
      cardStyle: "anime-cel",
      borderRadius: "lg",
    },
  },

  defaultScene: {
    id: "scene-anime-character-default",
    name: "Neo-Tokyo Character Stage",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 45,
      position: [0, 0, 7.5],
      target: [0, 0.4, 0],
      near: 0.1,
      far: 1000,
      zoom: 1,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 0.9,
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
          id: "light-anime-key-pink",
          type: "point",
          color: "#FF2A85",
          intensity: 4.5,
          position: [3, 4, 3],
          castShadow: false,
        },
        {
          id: "light-anime-fill-cyan",
          type: "point",
          color: "#00F0FF",
          intensity: 4.0,
          position: [-3, 2, 3],
          castShadow: false,
        },
        {
          id: "light-anime-rim-gold",
          type: "point",
          color: "#FFE600",
          intensity: 2.5,
          position: [0, -3, -2],
          castShadow: false,
        },
      ],
    },
    background: {
      type: "gradient",
      gradientColors: ["#080612", "#180B28"],
    },
    environment: {
      stars: {
        enabled: true,
        count: 1400,
        speed: 0.8,
      },
      fog: {
        enabled: true,
        color: "#0A0818",
        near: 6,
        far: 24,
      },
    },
    nodes: [
      {
        id: "node-anime-avatar",
        componentType: "AnimeCharacterAvatar",
        position: [0, 0, 0],
        scale: [1.15, 1.15, 1.15],
        materialProps: {
          type: "standard",
          color: "#FF2A85",
          emissive: "#00F0FF",
          emissiveIntensity: 0.8,
          roughness: 0.3,
          metalness: 0.2,
        },
        animation: {
          type: "float",
          speed: 1.2,
          floatAmplitude: 0.15,
          floatSpeed: 1.2,
          rotateSpeed: [0, 0.25, 0],
        },
        interactive: {
          hoverScale: 1.08,
          hoverGlow: true,
          pointerParallax: true,
          parallaxStrength: 0.4,
        },
      },
      {
        id: "node-sakura-petals",
        componentType: "SakuraPetalField",
        position: [0, 0, 0],
        scale: [1, 1, 1],
        materialProps: {
          type: "basic",
          color: "#FF75A0",
          transparent: true,
          opacity: 0.85,
        },
        animation: {
          type: "none",
        },
      },
      {
        id: "node-cyber-grid",
        componentType: "CyberGrid",
        position: [0, -1.8, 0],
        scale: [2.0, 1, 2.0],
        materialProps: {
          type: "basic",
          color: "#FF2A85",
          transparent: true,
          opacity: 0.18,
        },
        animation: {
          type: "none",
        },
      },
    ],
    postProcessing: {
      bloom: {
        enabled: true,
        intensity: 1.4,
        threshold: 0.2,
        radius: 0.85,
      },
      vignette: {
        enabled: true,
        darkness: 0.6,
        offset: 0.3,
      },
      chromaticAberration: {
        enabled: true,
        offset: [0.002, 0.002],
      },
    },
  },

  defaultLayout: {
    containerWidth: "wide",
    heroLayout: "anime-showcase",
    cardStyle: "anime-cel",
    navStyle: "floating-pill",
    sectionSpacing: "normal",
  },

  defaultMotion: {
    scrollDriven: true,
    mouseParallax: true,
    parallaxStrength: 0.5,
    rotationSpeed: 0.9,
    transitionPreset: "spring-pop",
  },

  performanceProfile: "Anime High-Fidelity Cel-Shaded",
  performance: {
    tier: "high",
    recommendedParticles: 1500,
    maxLights: 4,
    maxDpr: 2,
    supportsPostProcessing: true,
    supportsShadows: false,
  },
});
