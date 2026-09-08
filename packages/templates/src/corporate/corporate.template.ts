import { TemplateDefinition, TemplateSchema } from "../types";

export const corporateTemplate: TemplateDefinition = TemplateSchema.parse({
  id: "corporate",
  name: "Monolith Executive & Corporate",
  description:
    "An ultra-refined executive dimension featuring a slow-rotating titanium and champagne gold monolith, Swiss typographic hierarchy, and pristine minimalism tailored for recruiters and corporate leaders.",
  category: "Minimal & Professional",
  templateVersion: "1.0.0",
  bestFor: "C-Suite Executives, Finance Leaders, Management Consultants, Venture Capital Partners, MBA Graduates & Enterprise Advisors",
  targetAudience: ["Board Members", "Venture Partners", "Executive Search", "Enterprise Clients"],

  supportedSections: ["hero", "about", "experience", "projects", "skills", "education", "contact"],
  supportedObjects: ["ExecutiveMonolith", "TorusKnotCore", "sphere", "box"],
  supportedAnimations: ["rotate", "float"],

  defaultTheme: {
    id: "theme-monolith-gold",
    name: "Executive Monolith Gold",
    variant: "corporate",
    colors: {
      primary: "#D4AF37", // Champagne Gold
      secondary: "#94A3B8", // Platinum Slate
      accent: "#E2E8F0", // Titanium White
      background: "#06080F",
      surface: "#0D111C",
      textPrimary: "#FFFFFF",
      textMuted: "#94A3B8",
      border: "rgba(212, 175, 55, 0.2)",
      glowColor: "rgba(212, 175, 55, 0.25)",
    },
    typography: {
      fontFamily: "Space Grotesk, sans-serif",
      headingFontFamily: "Space Grotesk, sans-serif",
      baseSize: "md",
      scaleRatio: 1.2,
    },
    glassmorphism: {
      enabled: true,
      blurIntensity: 20,
      opacity: 0.9,
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
      containerWidth: "standard",
      cardStyle: "minimal",
      borderRadius: "sm",
    },
  },

  defaultScene: {
    id: "scene-corporate-default",
    name: "Executive Monolith Dimension",
    version: "1.0.0",
    camera: {
      type: "perspective",
      fov: 40,
      position: [0, 0, 6.5],
      target: [0, 0, 0],
      near: 0.1,
      far: 1000,
      zoom: 1,
      controls: {
        enabled: true,
        autoRotate: true,
        autoRotateSpeed: 0.3,
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: 1.6,
        minPolarAngle: 1.0,
        dampingFactor: 0.05,
      },
    },
    lighting: {
      preset: "minimal-white",
      ambientIntensity: 0.4,
      lights: [
        { id: "monolith-dir", type: "directional", color: "#D4AF37", intensity: 2, position: [2, 5, 3] },
        { id: "monolith-fill", type: "point", color: "#ffffff", intensity: 1.5, position: [-3, -2, 2] },
      ],
    },
    background: {
      type: "solid",
      color: "#06080F",
    },
    environment: {
      fog: {
        enabled: true,
        color: "#06080F",
        near: 4,
        far: 18,
      },
    },
    nodes: [
      {
        id: "node-monolith",
        componentType: "ExecutiveMonolith",
        position: [0, 0, 0],
        scale: [1.1, 1.1, 1.1],
        materialProps: {
          type: "standard",
          color: "#D4AF37",
          metalness: 0.95,
          roughness: 0.08,
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
    ],
    postProcessing: {
      bloom: {
        enabled: true,
        intensity: 0.5,
        threshold: 0.4,
        radius: 0.8,
      },
      vignette: {
        enabled: true,
        darkness: 0.4,
        offset: 0.2,
      },
    },
  },

  defaultLayout: {
    containerWidth: "standard",
    heroLayout: "minimal-centered",
    cardStyle: "minimal",
    navStyle: "minimal-links",
    sectionSpacing: "spacious",
  },

  defaultMotion: {
    scrollDriven: true,
    mouseParallax: true,
    parallaxStrength: 0.2,
    rotationSpeed: 0.3,
    transitionPreset: "smooth-fade",
  },

  performanceProfile: "Executive Lightweight Pure WebGL",
  performance: {
    tier: "low",
    recommendedParticles: 300,
    maxLights: 2,
    maxDpr: 2,
    supportsPostProcessing: false,
    supportsShadows: false,
  },
});
