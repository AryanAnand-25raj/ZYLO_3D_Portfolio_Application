import {
  SceneConfig,
  ORBIT_SCENE_TEMPLATE,
  NEURAL_SCENE_TEMPLATE,
  GLASS_SCENE_TEMPLATE,
  CREATIVE_SCENE_TEMPLATE,
  MINIMAL_SCENE_TEMPLATE,
  ComponentType,
} from "@zylo/three-engine";

export interface TemplateMetadata {
  id: "orbit" | "neural" | "glass" | "creative" | "minimal";
  name: string;
  category: string;
  description: string;
  supportedComponents: ComponentType[];
  supportedLighting: Array<"cyberpunk" | "studio" | "warm-sunset" | "minimal-white" | "neon-noir" | "deep-space">;
  defaultScene: SceneConfig;
  recommendedProfessions: string[];
}

export const TEMPLATE_METADATA_REGISTRY: Record<string, TemplateMetadata> = {
  orbit: {
    id: "orbit",
    name: "Orbit Exoplanet",
    category: "Space & Aerospace",
    description: "Centrally positioned planetary body with kinetic orbital neon rings and deep starfield.",
    supportedComponents: ["SphereOrb", "NeonRings", "model", "particles", "sphere", "torus"],
    supportedLighting: ["deep-space", "cyberpunk", "studio"],
    defaultScene: ORBIT_SCENE_TEMPLATE,
    recommendedProfessions: ["Aerospace Engineer", "Space Systems", "Astronomer", "Full-Stack Engineer", "Executive"],
  },
  neural: {
    id: "neural",
    name: "Neural Network Vortex",
    category: "AI & Data Science",
    description: "Network nodes with kinetic connecting geometry, particle vortex, and cybernetic ground grid.",
    supportedComponents: ["NeuralNodes", "ParticleVortex", "CyberGrid", "particles", "FloatingMeshNode"],
    supportedLighting: ["cyberpunk", "neon-noir", "deep-space"],
    defaultScene: NEURAL_SCENE_TEMPLATE,
    recommendedProfessions: ["AI/ML Engineer", "Data Scientist", "Robotics Engineer", "Blockchain Developer", "Backend Engineer"],
  },
  glass: {
    id: "glass",
    name: "Glass Refraction Dimension",
    category: "Luxury & Product",
    description: "Refractive crystal prism geometry with floating glass tiles and studio light dispersion.",
    supportedComponents: ["CrystalPrism", "FloatingMeshNode", "box", "plane", "InteractiveCard3D"],
    supportedLighting: ["studio", "warm-sunset", "minimal-white"],
    defaultScene: GLASS_SCENE_TEMPLATE,
    recommendedProfessions: ["Product Designer", "UI/UX Designer", "Frontend Architect", "Creative Director", "Architect"],
  },
  creative: {
    id: "creative",
    name: "Creative Kinetic Cluster",
    category: "Art & Motion",
    description: "Dynamic abstract icosahedrons with floating geometric nodes and neon ring accents.",
    supportedComponents: ["GeometricCluster", "NeonRings", "HologramPillar", "torus", "sphere", "cone"],
    supportedLighting: ["warm-sunset", "cyberpunk", "neon-noir"],
    defaultScene: CREATIVE_SCENE_TEMPLATE,
    recommendedProfessions: ["Creative Technologist", "Motion Designer", "3D Generalist", "Game Developer", "Artist"],
  },
  minimal: {
    id: "minimal",
    name: "Minimalist Sculptural Torus",
    category: "Executive & Architectural",
    description: "Understated floating sculpture with gentle ambient lighting and focus on editorial typography.",
    supportedComponents: ["TorusKnotCore", "sphere", "cylinder", "box"],
    supportedLighting: ["minimal-white", "studio"],
    defaultScene: MINIMAL_SCENE_TEMPLATE,
    recommendedProfessions: ["Executive", "Founder", "Tech Lead", "Consultant", "Student", "Staff Engineer"],
  },
};

export function getTemplateMetadata(templateId: string): TemplateMetadata {
  return TEMPLATE_METADATA_REGISTRY[templateId] || TEMPLATE_METADATA_REGISTRY.orbit;
}
