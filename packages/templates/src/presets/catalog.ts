import { TemplateDefinition, TemplateSchema } from "../types";
import { animeTemplate } from "../anime/anime.template";
import { architectureTemplate } from "../architecture/architecture.template";
import { automotiveTemplate } from "../automotive/automotive.template";
import { corporateTemplate } from "../corporate/corporate.template";
import { gamingTemplate } from "../gaming/gaming.template";
import { neuralTemplate } from "../neural/neural.template";
import { orbitTemplate } from "../orbit/orbit.template";
import { glassTemplate } from "../glass/glass.template";
import { creativeTemplate } from "../creative/creative.template";
import { minimalTemplate } from "../minimal/minimal.template";
import { cyberpunkTemplate } from "../cyberpunk/cyberpunk.template";
import { matrixTemplate } from "../matrix/matrix.template";
import { spatialTemplate } from "../spatial/spatial.template";

import { ComponentType, SceneMeshNode } from "@zylo/three-engine";

export interface PresetCatalogItem extends TemplateDefinition {
  family:
    | "Anime & Character"
    | "AI & Tech"
    | "Space & Sci-Fi"
    | "3D Creative"
    | "Glassmorphism"
    | "Developer & Cyber"
    | "Corporate & Professional"
    | "Architecture & Engineering"
    | "Automotive & Mechanical"
    | "Gaming & Interactive"
    | "Experimental WebGL";
  tags: string[];
}

// Explicit mapping of preset IDs to signature 3D Procedural Mesh components
const PRESET_COMPONENT_MAP: Record<string, ComponentType> = {
  // Family 1: Anime & Character (1-10)
  "anime-neo-tokyo": "AnimeCharacterAvatar",
  "anime-sakura-rpg": "SakuraPetalField",
  "anime-mecha-striker": "MechaCore",
  "anime-vtuber-streamer": "HologramPillar",
  "anime-cyber-ninja": "TorusKnotCore",
  "anime-kawaii-pastel": "FloatingMeshNode",
  "anime-manga-ink": "GeometricCluster",
  "anime-shrine-mystic": "CrystalPrism",
  "anime-cyber-alchemist": "NeonRings",
  "anime-retro-vapor": "CyberGrid",

  // Family 2: AI & Tech (11-20)
  "ai-fusion": "NeuralNodes",
  "ai-fluence": "ParticleVortex",
  "ai-mahadeva": "VoxelGrid",
  "ai-agentory": "HologramPillar",
  "ai-synaptic-vortex": "ParticleVortex",
  "ai-voxel-matrix": "VoxelGrid",
  "ai-robotics-kinematics": "MechaCore",
  "ai-generative-synth": "CrystalPrism",
  "ai-tensor-flow": "CADStructure",
  "ai-neuromorphic": "NeuralNodes",

  // Family 3: Space & Sci-Fi (21-30)
  "space-orbital-rings": "SpacePlanet",
  "space-deep-voyager": "ParticleVortex",
  "space-lunar-architect": "BuildingWireframe",
  "space-mars-colonizer": "SpacePlanet",
  "space-cubesat-array": "SatelliteOrbit",
  "space-blackhole-lens": "TorusKnotCore",
  "space-exoplanet-survey": "SpacePlanet",
  "space-rocket-propulsion": "MechaCore",
  "space-james-webb": "GeometricCluster",
  "space-interstellar-relay": "SatelliteOrbit",

  // Family 4: 3D Creative (31-40)
  "creative-inky": "TorusKnotCore",
  "creative-mono-x": "GeometricCluster",
  "creative-portfolite": "FloatingMeshNode",
  "creative-majd": "CrystalPrism",
  "creative-iridescent-chrome": "SphereOrb",
  "creative-hologram-foil": "HologramPillar",
  "creative-kinetic-bauhaus": "GeometricCluster",
  "creative-organic-biomimicry": "ParticleVortex",
  "creative-sound-reactive": "NeonRings",
  "creative-chromatic-flow": "TorusKnotCore",

  // Family 5: Glassmorphism (41-50)
  "glass-aura-saas": "CrystalPrism",
  "glass-prismatic-refraction": "CrystalPrism",
  "glass-liquid-bento": "FloatingMeshNode",
  "glass-obsidian-dark": "ExecutiveMonolith",
  "glass-opal-diffuse": "SphereOrb",
  "glass-spectral-dispersion": "CrystalPrism",
  "glass-frosted-aero": "NeonRings",
  "glass-quartz-monolith": "CrystalPrism",
  "glass-icefield-minimal": "GeometricCluster",
  "glass-amber-refraction": "TorusKnotCore",

  // Family 6: Developer & Cyber (51-60)
  "cyber-terminal-matrix": "TerminalCodeWall",
  "cyber-devops-cluster": "VoxelGrid",
  "cyber-threat-hunter": "CyberGrid",
  "cyber-web3-forge": "CADStructure",
  "cyber-kernel-systems": "TerminalCodeWall",
  "cyber-glitch-syndicate": "ParticleVortex",
  "cyber-api-mesh": "NeuralNodes",
  "cyber-quantum-crypto": "CrystalPrism",
  "cyber-database-internals": "MechanicalGears",
  "cyber-fullstack-neon": "NeonRings",

  // Family 7: Corporate & Professional (61-70)
  "corporate-executive-monolith": "ExecutiveMonolith",
  "corporate-fintech-ledger": "GeometricCluster",
  "corporate-vc-partner": "ExecutiveMonolith",
  "corporate-management-consulting": "CADStructure",
  "corporate-swiss-minimal": "FloatingMeshNode",
  "corporate-private-equity": "ExecutiveMonolith",
  "corporate-legal-governance": "ExecutiveMonolith",
  "corporate-enterprise-csuite": "NeuralNodes",
  "corporate-esg-sustainable": "SphereOrb",
  "corporate-mba-fellow": "ExecutiveMonolith",

  // Family 8: Architecture & Engineering (71-80)
  "arch-blueprint-wireframe": "BuildingWireframe",
  "arch-concrete-glass": "BuildingWireframe",
  "arch-parametric-pavilion": "CADStructure",
  "arch-urban-masterplan": "CADStructure",
  "arch-geodesic-biome": "GeometricCluster",
  "arch-mass-timber": "CADStructure",
  "arch-civil-infrastructure": "CADStructure",
  "arch-interior-spatial": "FloatingMeshNode",
  "arch-mep-mechanical": "MechanicalGears",
  "arch-acoustic-concert": "ParticleVortex",

  // Family 9: Automotive & Mechanical (81-90)
  "auto-hypercar-chassis": "AutomotiveChassis",
  "auto-formula-racing": "AutomotiveChassis",
  "auto-turbo-powertrain": "MechaCore",
  "auto-ev-powertrain": "AutomotiveChassis",
  "auto-chronograph-watch": "MechanicalGears",
  "auto-industrial-robot-arm": "MechaCore",
  "auto-drone-propulsion": "SatelliteOrbit",
  "auto-cnc-machinist": "CADStructure",
  "auto-suspension-dynamics": "MechanicalGears",
  "auto-hydrogen-fuel": "SphereOrb",

  // Family 10: Gaming & Interactive (91-100)
  "game-cyber-quest": "SphereOrb",
  "game-retro-arcade": "VoxelGrid",
  "game-scifi-cockpit": "SatelliteOrbit",
  "game-unreal-shader": "CrystalPrism",
  "game-isometric-builder": "VoxelGrid",
  "game-lowpoly-adventurer": "FloatingMeshNode",
  "game-speedrun-platformer": "NeonRings",
  "game-cyber-stealth": "TerminalCodeWall",
  "game-esports-arena": "MechaCore",
  "game-experimental-webgl": "TorusKnotCore",
};

function getFamilyDefaultComponent(family: string): ComponentType {
  switch (family) {
    case "Anime & Character":
      return "AnimeCharacterAvatar";
    case "AI & Tech":
      return "NeuralNodes";
    case "Space & Sci-Fi":
      return "SpacePlanet";
    case "3D Creative":
      return "TorusKnotCore";
    case "Glassmorphism":
      return "CrystalPrism";
    case "Developer & Cyber":
      return "TerminalCodeWall";
    case "Corporate & Professional":
      return "ExecutiveMonolith";
    case "Architecture & Engineering":
      return "BuildingWireframe";
    case "Automotive & Mechanical":
      return "AutomotiveChassis";
    case "Gaming & Interactive":
      return "VoxelGrid";
    default:
      return "TorusKnotCore";
  }
}

// Generate distinct, high-impact 3D scenes for every preset
function generatePresetScene(
  baseScene: any,
  id: string,
  name: string,
  family: string,
  tags: string[],
  primaryColor: string,
  secondaryColor: string,
  sceneComponentOverride?: ComponentType
): any {
  const componentType = sceneComponentOverride || PRESET_COMPONENT_MAP[id] || getFamilyDefaultComponent(family);

  // Tailor camera position & auto-rotate per 3D geometry structure
  let cameraPos: [number, number, number] = [0, 0, 7.5];
  let autoRotateSpeed = 0.8;
  if (componentType === "SpacePlanet") {
    cameraPos = [0, 0.5, 8.5];
    autoRotateSpeed = 0.5;
  } else if (componentType === "BuildingWireframe") {
    cameraPos = [0, 0.5, 7.0];
    autoRotateSpeed = 0.6;
  } else if (componentType === "AutomotiveChassis") {
    cameraPos = [0, 0.8, 6.5];
    autoRotateSpeed = 0.7;
  } else if (componentType === "SatelliteOrbit") {
    cameraPos = [0, 1.2, 9.0];
    autoRotateSpeed = 0.4;
  } else if (componentType === "TerminalCodeWall") {
    cameraPos = [0, 0, 6.0];
    autoRotateSpeed = 0.3;
  } else if (componentType === "VoxelGrid") {
    cameraPos = [0, 1.4, 6.5];
    autoRotateSpeed = 0.6;
  } else if (componentType === "ExecutiveMonolith") {
    cameraPos = [0, 0, 7.0];
    autoRotateSpeed = 0.5;
  }

  // Lighting theme
  let lightPreset: "studio" | "cyberpunk" | "warm-sunset" | "minimal-white" | "neon-noir" | "deep-space" = "cyberpunk";
  if (family === "Space & Sci-Fi") lightPreset = "deep-space";
  else if (family === "Corporate & Professional") lightPreset = "studio";
  else if (family === "Architecture & Engineering") lightPreset = "neon-noir";
  else if (family === "Glassmorphism") lightPreset = "studio";
  else if (primaryColor.toLowerCase().includes("f59e0b") || primaryColor.toLowerCase().includes("ef4444")) lightPreset = "warm-sunset";

  const isWireframe = tags.some((t) => /wireframe|cad|blueprint|mesh|halftone/i.test(t)) || componentType === "CADStructure";
  const isRefractive = family === "Glassmorphism" || tags.some((t) => /crystal|prism|glass/i.test(t));
  const isMetallic = family === "Corporate & Professional" || family === "Automotive & Mechanical" || tags.some((t) => /metal|titanium|gold|chrome/i.test(t));

  const mainNode: SceneMeshNode = {
    id: `node-${id}-primary`,
    componentType,
    label: `${name} 3D Geometry`,
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [1.1, 1.1, 1.1] as [number, number, number],
    materialProps: {
      type: "standard" as const,
      color: primaryColor,
      emissive: secondaryColor,
      emissiveIntensity: 0.5,
      roughness: isRefractive ? 0.08 : isMetallic ? 0.15 : 0.25,
      metalness: isMetallic ? 0.92 : isRefractive ? 0.1 : 0.8,
      wireframe: isWireframe,
      transparent: true,
      opacity: isRefractive ? 0.85 : 0.95,
    },
    animation: {
      type: "rotate",
      axis: "y",
      speed: 0.5,
      rotateSpeed: [0.1, 0.2, 0.05],
      floatAmplitude: 0.2,
      floatSpeed: 1.0,
      pulseSpeed: 0,
      pulseRange: [0.95, 1.05],
    },
    interactive: {
      hoverScale: 1.08,
      hoverGlow: true,
      hoverColor: secondaryColor,
      clickAction: "rotate",
      pointerParallax: true,
      parallaxStrength: 0.3,
    },
    visible: true,
  };

  const nodes: SceneMeshNode[] = [mainNode];

  // Anime character gets floating sakura petals
  if (componentType === "AnimeCharacterAvatar") {
    nodes.push({
      id: `node-${id}-ambient-petals`,
      componentType: "SakuraPetalField" as ComponentType,
      label: "Floating Sakura Petals",
      position: [0, 0, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
      materialProps: {
        type: "standard" as const,
        color: secondaryColor || "#FFB7C5",
        emissive: primaryColor,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.1,
        wireframe: false,
        transparent: true,
        opacity: 0.85,
      },
      animation: {
        type: "float" as const,
        axis: "y" as const,
        speed: 0.6,
        rotateSpeed: [0, 0.1, 0] as [number, number, number],
        floatAmplitude: 0.3,
        floatSpeed: 0.8,
        pulseSpeed: 0,
        pulseRange: [0.95, 1.05] as [number, number],
      },
      interactive: {
        hoverScale: 1,
        hoverGlow: false,
        clickAction: "none" as const,
        pointerParallax: true,
        parallaxStrength: 0.2,
      },
      visible: true,
    });
  }

  return {
    ...baseScene,
    id: `scene-${id}`,
    name: `${name} 3D Scene`,
    camera: {
      ...baseScene?.camera,
      position: cameraPos,
      controls: {
        ...baseScene?.camera?.controls,
        autoRotate: true,
        autoRotateSpeed,
      },
    },
    lighting: {
      preset: lightPreset,
      ambientIntensity: 0.5,
      lights: [
        {
          id: `light-${id}-key`,
          type: "point" as const,
          color: primaryColor,
          intensity: 2.2,
          position: [5, 4, 6] as [number, number, number],
          castShadow: false,
        },
        {
          id: `light-${id}-rim`,
          type: "point" as const,
          color: secondaryColor,
          intensity: 1.8,
          position: [-5, -2, -4] as [number, number, number],
          castShadow: false,
        },
        {
          id: `light-${id}-ambient`,
          type: "ambient" as const,
          color: "#FFFFFF",
          intensity: 0.4,
        },
      ],
    },
    environment: {
      ...baseScene?.environment,
      particles: {
        enabled: true,
        count: 650,
        color: primaryColor,
        size: 0.03,
        speed: 0.3,
      },
    },
    nodes,
  };
}

// Preset generator helper to derive rich distinct presets from flagship bases
function createPreset(
  base: TemplateDefinition,
  override: Partial<TemplateDefinition> & {
    id: string;
    name: string;
    family: PresetCatalogItem["family"];
    tags: string[];
    primaryColor?: string;
    secondaryColor?: string;
    cardStyle?: any;
    heroLayout?: any;
    sceneComponent?: ComponentType;
  }
): PresetCatalogItem {
  const { family, tags, primaryColor, secondaryColor, cardStyle, heroLayout, sceneComponent, ...rest } = override;
  const pColor = primaryColor || base.defaultTheme?.colors?.primary || "#00F0FF";
  const sColor = secondaryColor || base.defaultTheme?.colors?.secondary || "#7928CA";

  const newTheme = {
    ...base.defaultTheme,
    colors: {
      ...base.defaultTheme.colors,
      primary: pColor,
      secondary: sColor,
    },
  };

  const newLayout = {
    ...base.defaultLayout,
    ...(cardStyle ? { cardStyle } : {}),
    ...(heroLayout ? { heroLayout } : {}),
  };

  const newScene = generatePresetScene(
    base.defaultScene,
    override.id,
    override.name,
    family,
    tags,
    pColor,
    sColor,
    sceneComponent
  );

  const nodeTypes = newScene.nodes.map((n: any) => n.componentType);
  const supportedObjects = Array.from(new Set([...(base.supportedObjects || []), ...nodeTypes]));

  const parsed = TemplateSchema.parse({
    ...base,
    ...rest,
    defaultTheme: newTheme,
    defaultLayout: newLayout,
    defaultScene: newScene,
    supportedObjects,
  });

  return {
    ...parsed,
    family,
    tags,
  };
}

// -------------------------------------------------------------
// 100 PRESET CATALOG DEFINITIONS
// -------------------------------------------------------------
export const PRESET_CATALOG: PresetCatalogItem[] = [
  // ==========================================
  // FAMILY 1: ANIME & CHARACTER 3D (1-10)
  // ==========================================
  createPreset(animeTemplate, {
    id: "anime-neo-tokyo",
    name: "Neo-Tokyo Cyberpunk Manga",
    family: "Anime & Character",
    category: "Anime & Character",
    bestFor: "Anime Developers, Manga Illustrators, 3D Character Riggers",
    tags: ["Anime", "Cel-Shaded", "Manga", "Neo-Tokyo", "Cyberpunk"],
    primaryColor: "#FF2A85",
    secondaryColor: "#00F0FF",
    cardStyle: "anime-cel",
    heroLayout: "anime-showcase",
  }),
  createPreset(animeTemplate, {
    id: "anime-sakura-rpg",
    name: "Sakura Fantasy RPG",
    family: "Anime & Character",
    category: "Anime & Character",
    bestFor: "JRPG Artists, Fantasy Concept Creators, VTubers",
    tags: ["Sakura", "Fantasy", "JRPG", "Ghibli", "Floating Petals"],
    primaryColor: "#FF75A0",
    secondaryColor: "#FFE600",
    cardStyle: "anime-cel",
  }),
  createPreset(animeTemplate, {
    id: "anime-mecha-striker",
    name: "EVA Mecha Striker Pilot",
    family: "Anime & Character",
    category: "Anime & Character",
    bestFor: "Mecha Designers, 3D Hard-surface Modellers, Sci-Fi Animators",
    tags: ["Mecha", "Gundam", "Evangelion", "Pilot HUD", "Tactical"],
    primaryColor: "#7928CA",
    secondaryColor: "#00FF66",
    cardStyle: "neon-outline",
  }),
  createPreset(animeTemplate, {
    id: "anime-vtuber-streamer",
    name: "VTuber Hologram Idol",
    family: "Anime & Character",
    category: "Anime & Character",
    bestFor: "Virtual Streamers, Live2D/3D Riggers, Voice Actors",
    tags: ["VTuber", "Idol", "Kawaii", "Holographic", "3D Avatar"],
    primaryColor: "#00F0FF",
    secondaryColor: "#FF2A85",
    cardStyle: "glass",
  }),
  createPreset(animeTemplate, {
    id: "anime-cyber-ninja",
    name: "Cyber Ninja Shinobi",
    family: "Anime & Character",
    category: "Anime & Character",
    bestFor: "Action Game Devs, VFX Artists, Martial Arts 3D Choreographers",
    tags: ["Ninja", "Katana", "Stealth", "Dark Neon", "Shonen"],
    primaryColor: "#FFE600",
    secondaryColor: "#FF0055",
    cardStyle: "anime-cel",
  }),
  createPreset(animeTemplate, {
    id: "anime-kawaii-pastel",
    name: "Kawaii Pastel Creative",
    family: "Anime & Character",
    category: "Anime & Character",
    bestFor: "Cute UI Designers, Kawaii Illustrators, Frontend Devs",
    tags: ["Pastel", "Cute", "Kawaii", "Soft 3D", "Clean"],
    primaryColor: "#F472B6",
    secondaryColor: "#38BDF8",
    cardStyle: "glass",
  }),
  createPreset(animeTemplate, {
    id: "anime-manga-ink",
    name: "Shonen Manga Ink & Halftone",
    family: "Anime & Character",
    category: "Anime & Character",
    bestFor: "Comic Book Artists, Manga Letterers, Narrative Designers",
    tags: ["Manga", "Ink", "Halftone", "Monochrome", "High-Contrast"],
    primaryColor: "#FFFFFF",
    secondaryColor: "#FF2A85",
    cardStyle: "anime-cel",
  }),
  createPreset(animeTemplate, {
    id: "anime-shrine-mystic",
    name: "Torii Spirit Shrine",
    family: "Anime & Character",
    category: "Anime & Character",
    bestFor: "Folklore Creators, Worldbuilders, Environment Artists",
    tags: ["Spirit", "Torii", "Japanese Tradition", "Mystic", "Zen"],
    primaryColor: "#EF4444",
    secondaryColor: "#F59E0B",
  }),
  createPreset(animeTemplate, {
    id: "anime-cyber-alchemist",
    name: "Cyber Alchemist Arcana",
    family: "Anime & Character",
    category: "Anime & Character",
    bestFor: "Game Lore Writers, Card Game Designers, Shader Enthusiasts",
    tags: ["Alchemist", "Rune", "Magic Circle", "Neon Arcana"],
    primaryColor: "#A855F7",
    secondaryColor: "#00F0FF",
  }),
  createPreset(animeTemplate, {
    id: "anime-retro-vapor",
    name: "90s City Pop Anime",
    family: "Anime & Character",
    category: "Anime & Character",
    bestFor: "Synthwave Producers, Retro Illustrators, Lo-Fi Creators",
    tags: ["City Pop", "Vaporwave", "Retro Anime", "90s Nostalgia"],
    primaryColor: "#EC4899",
    secondaryColor: "#06B6D4",
  }),

  // ==========================================
  // FAMILY 2: AI / TECH 3D (11-20)
  // ==========================================
  createPreset(neuralTemplate, {
    id: "ai-fusion",
    name: "Fusion AI — Large Models & Neural Core",
    family: "AI & Tech",
    category: "Technology",
    bestFor: "LLM Researchers, Foundation Model Builders, AI Labs",
    tags: ["Fusion AI", "LLM", "Transformers", "Neural Nodes", "PyTorch"],
    primaryColor: "#00F0FF",
    secondaryColor: "#7928CA",
  }),
  createPreset(neuralTemplate, {
    id: "ai-fluence",
    name: "Fluence AI — Autonomous Multi-Agent",
    family: "AI & Tech",
    category: "Technology",
    bestFor: "Agentic Systems Engineers, AutoGen / LangChain Architects",
    tags: ["Fluence AI", "Agents", "Autonomous", "Graph RAG", "Swarm"],
    primaryColor: "#10B981",
    secondaryColor: "#00F0FF",
  }),
  createPreset(neuralTemplate, {
    id: "ai-mahadeva",
    name: "Mahadeva — Quantum Neural Compute",
    family: "AI & Tech",
    category: "Technology",
    bestFor: "Quantum ML Scientists, HPC Engineers, Supercomputing Leads",
    tags: ["Mahadeva", "Quantum", "HPC", "Voxel Grid", "Supercompute"],
    primaryColor: "#8B5CF6",
    secondaryColor: "#F59E0B",
  }),
  createPreset(neuralTemplate, {
    id: "ai-agentory",
    name: "Agentory — SaaS Workflows & Intelligence",
    family: "AI & Tech",
    category: "Technology",
    bestFor: "AI SaaS Founders, Workflow Automation Builders, Full Stack AI",
    tags: ["Agentory", "SaaS", "Automation", "Workflows", "API"],
    primaryColor: "#38BDF8",
    secondaryColor: "#EC4899",
  }),
  createPreset(neuralTemplate, {
    id: "ai-synaptic-vortex",
    name: "Synaptic Data Vortex",
    family: "AI & Tech",
    category: "Technology",
    bestFor: "Data Science Directors, Vector DB Architects, MLOps Leads",
    tags: ["Synapse", "Data Flow", "Vector Embeddings", "Particles"],
    primaryColor: "#06B6D4",
    secondaryColor: "#3B82F6",
  }),
  createPreset(neuralTemplate, {
    id: "ai-voxel-matrix",
    name: "Voxel AI Neural Cluster",
    family: "AI & Tech",
    category: "Technology",
    bestFor: "Computer Vision Engineers, NeRF Researchers, Spatial AI",
    tags: ["Voxel", "Computer Vision", "NeRF", "Gaussian Splatting"],
    primaryColor: "#6366F1",
    secondaryColor: "#10B981",
  }),
  createPreset(neuralTemplate, {
    id: "ai-robotics-kinematics",
    name: "Humanoid Robotics & Kinematics",
    family: "AI & Tech",
    category: "Technology",
    bestFor: "Robotics Engineers, ROS2 Developers, Embedded Systems",
    tags: ["Robotics", "Kinematics", "ROS2", "Actuators", "Sensors"],
    primaryColor: "#F59E0B",
    secondaryColor: "#00F0FF",
  }),
  createPreset(neuralTemplate, {
    id: "ai-generative-synth",
    name: "Diffusion & Generative Synthesizer",
    family: "AI & Tech",
    category: "Technology",
    bestFor: "Generative Media Artists, Diffusion Model Hackers",
    tags: ["Diffusion", "Stable Diffusion", "Midjourney", "Generative Media"],
    primaryColor: "#D946EF",
    secondaryColor: "#8B5CF6",
  }),
  createPreset(neuralTemplate, {
    id: "ai-tensor-flow",
    name: "Tensor Accelerator Architecture",
    family: "AI & Tech",
    category: "Technology",
    bestFor: "CUDA Kernels, Hardware Accelerators, Semiconductor Architects",
    tags: ["CUDA", "GPU", "Silicon", "Hardware", "Performance"],
    primaryColor: "#76B900", // NVIDIA Green
    secondaryColor: "#00F0FF",
  }),
  createPreset(neuralTemplate, {
    id: "ai-neuromorphic",
    name: "Neuromorphic Spiking Network",
    family: "AI & Tech",
    category: "Technology",
    bestFor: "Brain-Computer Interface Scientists, Spiking Neural Researchers",
    tags: ["BCI", "Spiking Neural", "Biotech", "Neuromorphic"],
    primaryColor: "#EC4899",
    secondaryColor: "#6366F1",
  }),

  // ==========================================
  // FAMILY 3: SPACE / SCI-FI / IMMERSIVE (21-30)
  // ==========================================
  createPreset(orbitTemplate, {
    id: "space-orbital-rings",
    name: "Orbital Rings & Planetary System",
    family: "Space & Sci-Fi",
    category: "Aerospace & Science",
    bestFor: "Aerospace Engineers, Satellite Ground Station Operators",
    tags: ["Orbit", "Planets", "Satellites", "Orbital Mechanics", "Telemetry"],
    primaryColor: "#00F0FF",
    secondaryColor: "#38BDF8",
  }),
  createPreset(orbitTemplate, {
    id: "space-deep-voyager",
    name: "Deep Space Voyager Interstellar",
    family: "Space & Sci-Fi",
    category: "Aerospace & Science",
    bestFor: "Astrophysicists, Deep Space Mission Planners, NASA/ESA Leads",
    tags: ["Deep Space", "Voyager", "Interstellar", "Cosmic Dust"],
    primaryColor: "#38BDF8",
    secondaryColor: "#9333EA",
  }),
  createPreset(orbitTemplate, {
    id: "space-lunar-architect",
    name: "Artemis Lunar Base Station",
    family: "Space & Sci-Fi",
    category: "Aerospace & Science",
    bestFor: "Space Habitat Architects, Lunar Regolith Engineers",
    tags: ["Moon", "Lunar Base", "Artemis", "Life Support", "Habitat"],
    primaryColor: "#E2E8F0",
    secondaryColor: "#00F0FF",
  }),
  createPreset(orbitTemplate, {
    id: "space-mars-colonizer",
    name: "Mars Colonization & Terran Orbit",
    family: "Space & Sci-Fi",
    category: "Aerospace & Science",
    bestFor: "Mars Mission Planners, Propulsion Dynamics, SpaceX Engineers",
    tags: ["Mars", "Red Planet", "Starship", "Propulsion", "Rockets"],
    primaryColor: "#EF4444",
    secondaryColor: "#F59E0B",
  }),
  createPreset(orbitTemplate, {
    id: "space-cubesat-array",
    name: "CubeSat Constellation Array",
    family: "Space & Sci-Fi",
    category: "Aerospace & Science",
    bestFor: "SmallSat Engineers, RF Communications, Geospatial Analysts",
    tags: ["CubeSat", "Constellation", "Low Earth Orbit", "RF Telemetry"],
    primaryColor: "#10B981",
    secondaryColor: "#00F0FF",
  }),
  createPreset(orbitTemplate, {
    id: "space-blackhole-lens",
    name: "Gravitational Black Hole Lens",
    family: "Space & Sci-Fi",
    category: "Aerospace & Science",
    bestFor: "General Relativity Researchers, Computational Astrophysicists",
    tags: ["Black Hole", "Event Horizon", "Accretion Disk", "Gravitational Lens"],
    primaryColor: "#F59E0B",
    secondaryColor: "#05070D",
  }),
  createPreset(orbitTemplate, {
    id: "space-exoplanet-survey",
    name: "Kepler Exoplanet Spectrometry",
    family: "Space & Sci-Fi",
    category: "Aerospace & Science",
    bestFor: "Astronomers, Exoplanet Researchers, Astrobiologists",
    tags: ["Exoplanets", "Spectrometry", "Kepler", "Habitable Zone"],
    primaryColor: "#06B6D4",
    secondaryColor: "#8B5CF6",
  }),
  createPreset(orbitTemplate, {
    id: "space-rocket-propulsion",
    name: "Cryogenic Rocket Propulsion Hub",
    family: "Space & Sci-Fi",
    category: "Aerospace & Science",
    bestFor: "Turbopump Engineers, Combustion Technicians, Rocket Scientists",
    tags: ["Rocket", "Propulsion", "Thrust", "Methane", "Staged Combustion"],
    primaryColor: "#F97316",
    secondaryColor: "#38BDF8",
  }),
  createPreset(orbitTemplate, {
    id: "space-james-webb",
    name: "JWST Infrared Deep Field",
    family: "Space & Sci-Fi",
    category: "Aerospace & Science",
    bestFor: "Optical Engineers, Cryogenic Sensor Leads, Space Telescopes",
    tags: ["JWST", "Infrared", "Gold Hex Mirror", "Deep Field"],
    primaryColor: "#EAB308", // Gold Beryllium
    secondaryColor: "#A855F7",
  }),
  createPreset(orbitTemplate, {
    id: "space-interstellar-relay",
    name: "Interstellar Deep Space Network",
    family: "Space & Sci-Fi",
    category: "Aerospace & Science",
    bestFor: "Laser Space Comms, Deep Space Network Technicians",
    tags: ["Laser Comms", "DSN", "Optical Comm", "Gigabit Space"],
    primaryColor: "#00F0FF",
    secondaryColor: "#10B981",
  }),

  // ==========================================
  // FAMILY 4: 3D CREATIVE PORTFOLIO (31-40)
  // ==========================================
  createPreset(creativeTemplate, {
    id: "creative-inky",
    name: "INKY — 3D Sculptor & Art Direction",
    family: "3D Creative",
    category: "Creative & Design",
    bestFor: "3D Artists, Creative Directors, Photographers, Sculptors",
    tags: ["INKY", "Art Direction", "Fluid 3D", "Sculpture", "High-End"],
    primaryColor: "#F43F5E",
    secondaryColor: "#A855F7",
    heroLayout: "split-canvas-right",
  }),
  createPreset(creativeTemplate, {
    id: "creative-mono-x",
    name: "Mōno X — Kinetic Typographic Studio",
    family: "3D Creative",
    category: "Creative & Design",
    bestFor: "Kinetic Typographers, Brand Designers, Editorial Studios",
    tags: ["Mōno X", "Typography", "Kinetic", "Black & White", "Editorial"],
    primaryColor: "#FFFFFF",
    secondaryColor: "#64748B",
    cardStyle: "minimal",
  }),
  createPreset(creativeTemplate, {
    id: "creative-portfolite",
    name: "Portfolite — Minimalist 3D Atelier",
    family: "3D Creative",
    category: "Creative & Design",
    bestFor: "Minimalist Designers, Luxury Fashion Portfolio, Stylists",
    tags: ["Portfolite", "Atelier", "Luxury", "Minimalist 3D", "Fashion"],
    primaryColor: "#F1F5F9",
    secondaryColor: "#94A3B8",
  }),
  createPreset(creativeTemplate, {
    id: "creative-majd",
    name: "Majd — Real-Time Shader & GLSL Lab",
    family: "3D Creative",
    category: "Creative & Design",
    bestFor: "Creative Developers, Shader Artists, Three.js Experts",
    tags: ["Majd", "GLSL", "Shaders", "Procedural", "WebGPU"],
    primaryColor: "#00F0FF",
    secondaryColor: "#FF007F",
  }),
  createPreset(creativeTemplate, {
    id: "creative-iridescent-chrome",
    name: "Iridescent Liquid Chrome",
    family: "3D Creative",
    category: "Creative & Design",
    bestFor: "Digital Fashion Designers, Music Album Artists, 3D Motion",
    tags: ["Liquid Chrome", "Iridescent", "Metallic", "Organic", "Reflective"],
    primaryColor: "#C084FC",
    secondaryColor: "#22D3EE",
  }),
  createPreset(creativeTemplate, {
    id: "creative-hologram-foil",
    name: "Holographic Foil & Foil Stamping",
    family: "3D Creative",
    category: "Creative & Design",
    bestFor: "Packaging Designers, Printmakers, Hologram Producers",
    tags: ["Hologram", "Foil", "Rainbow Sheen", "Prismatic"],
    primaryColor: "#38BDF8",
    secondaryColor: "#F472B6",
  }),
  createPreset(creativeTemplate, {
    id: "creative-kinetic-bauhaus",
    name: "Kinetic Bauhaus Geometry",
    family: "3D Creative",
    category: "Creative & Design",
    bestFor: "Graphic Designers, Swiss Style Enthusiasts, Poster Artists",
    tags: ["Bauhaus", "Primary Colors", "Constructivism", "Geometry"],
    primaryColor: "#EF4444",
    secondaryColor: "#3B82F6",
  }),
  createPreset(creativeTemplate, {
    id: "creative-organic-biomimicry",
    name: "Biomorphic Generative Nature",
    family: "3D Creative",
    category: "Creative & Design",
    bestFor: "Bio-designers, Parametric Artists, Algorithmic Sculptors",
    tags: ["Biomimicry", "Organic", "Flora", "Growth Shaders"],
    primaryColor: "#10B981",
    secondaryColor: "#F59E0B",
  }),
  createPreset(creativeTemplate, {
    id: "creative-sound-reactive",
    name: "Sound-Reactive Spatial Audio",
    family: "3D Creative",
    category: "Creative & Design",
    bestFor: "Music Producers, Sound Designers, Audiovisual Performers",
    tags: ["Audio Reactive", "Synthesizer", "Spectrogram", "Frequency"],
    primaryColor: "#8B5CF6",
    secondaryColor: "#06B6D4",
  }),
  createPreset(creativeTemplate, {
    id: "creative-chromatic-flow",
    name: "Chromatic Dispersion Wave",
    family: "3D Creative",
    category: "Creative & Design",
    bestFor: "Exhibition Designers, Installation Artists, Creative Tech",
    tags: ["Chromatic", "Dispersion", "Refraction", "Waves"],
    primaryColor: "#EC4899",
    secondaryColor: "#8B5CF6",
  }),

  // ==========================================
  // FAMILY 5: GLASSMORPHISM / 3D OBJECTS (41-50)
  // ==========================================
  createPreset(glassTemplate, {
    id: "glass-aura-saas",
    name: "Aura Frosted Glass SaaS",
    family: "Glassmorphism",
    category: "Product & Software",
    bestFor: "SaaS Founders, Product Designers, Enterprise Software Leads",
    tags: ["Glassmorphism", "Frosted Glass", "Refraction", "SaaS", "Modern UI"],
    primaryColor: "#38BDF8",
    secondaryColor: "#818CF8",
    cardStyle: "glass",
  }),
  createPreset(glassTemplate, {
    id: "glass-prismatic-refraction",
    name: "Prismatic Crystal Refraction",
    family: "Glassmorphism",
    category: "Product & Software",
    bestFor: "Fintech App Designers, Mobile App Leads, Crypto UX Designers",
    tags: ["Crystal", "Prism", "Optical Dispersion", "Luxury Glass"],
    primaryColor: "#00F0FF",
    secondaryColor: "#A855F7",
  }),
  createPreset(glassTemplate, {
    id: "glass-liquid-bento",
    name: "Liquid Glass Bento Grid",
    family: "Glassmorphism",
    category: "Product & Software",
    bestFor: "Design Systems Engineers, Bento Grid Enthusiasts, UI Architects",
    tags: ["Bento Grid", "Liquid", "Frosted Tile", "Apple Style"],
    primaryColor: "#60A5FA",
    secondaryColor: "#34D399",
    heroLayout: "bento-grid",
  }),
  createPreset(glassTemplate, {
    id: "glass-obsidian-dark",
    name: "Dark Obsidian Smoked Glass",
    family: "Glassmorphism",
    category: "Product & Software",
    bestFor: "Cybersecurity UX, Dark Mode Specialists, Hardcore Tech",
    tags: ["Obsidian", "Smoked Glass", "Dark Mode", "Stealth Glass"],
    primaryColor: "#94A3B8",
    secondaryColor: "#00F0FF",
  }),
  createPreset(glassTemplate, {
    id: "glass-opal-diffuse",
    name: "Opal Diffuse Light Translucent",
    family: "Glassmorphism",
    category: "Product & Software",
    bestFor: "Wellness Tech, Clean Beauty Founders, Soft Minimalists",
    tags: ["Opal", "Diffuse Light", "Soft Glow", "Translucent"],
    primaryColor: "#FDA4AF",
    secondaryColor: "#93C5FD",
  }),
  createPreset(glassTemplate, {
    id: "glass-spectral-dispersion",
    name: "Spectral Dispersion Prism",
    family: "Glassmorphism",
    category: "Product & Software",
    bestFor: "Color Theorists, Optical Software Engineers, Creative Coders",
    tags: ["Spectral", "Color Spectrum", "Rainbow", "Caustics"],
    primaryColor: "#F472B6",
    secondaryColor: "#22D3EE",
  }),
  createPreset(glassTemplate, {
    id: "glass-frosted-aero",
    name: "Frosted Aero Glass OS",
    family: "Glassmorphism",
    category: "Product & Software",
    bestFor: "Operating System Enthusiasts, Window Managers, Desktop UX",
    tags: ["Aero", "Blur", "Backdrop Filter", "Vibrant Depth"],
    primaryColor: "#38BDF8",
    secondaryColor: "#818CF8",
  }),
  createPreset(glassTemplate, {
    id: "glass-quartz-monolith",
    name: "Rose Quartz & Amethyst Glass",
    family: "Glassmorphism",
    category: "Product & Software",
    bestFor: "Fine Jewelry Designers, Luxury Brand Consultants",
    tags: ["Rose Quartz", "Amethyst", "Gemstone", "Elegance"],
    primaryColor: "#F43F5E",
    secondaryColor: "#C084FC",
  }),
  createPreset(glassTemplate, {
    id: "glass-icefield-minimal",
    name: "Glacial Icefield Minimalist",
    family: "Glassmorphism",
    category: "Product & Software",
    bestFor: "Nordic Designers, Climate Tech Innovators, Sustainable UI",
    tags: ["Glacial", "Ice", "Arctic", "Crisp", "Minimal"],
    primaryColor: "#E0F2FE",
    secondaryColor: "#0284C7",
  }),
  createPreset(glassTemplate, {
    id: "glass-amber-refraction",
    name: "Warm Amber Honeycomb Glass",
    family: "Glassmorphism",
    category: "Product & Software",
    bestFor: "Beverage Brand Creators, Coffee Tech Founders, Warm Artisans",
    tags: ["Amber", "Honeycomb", "Warm Glass", "Golden Glow"],
    primaryColor: "#F59E0B",
    secondaryColor: "#D97706",
  }),

  // ==========================================
  // FAMILY 6: DEVELOPER / CYBER 3D (51-60)
  // ==========================================
  createPreset(cyberpunkTemplate, {
    id: "cyber-terminal-matrix",
    name: "Hacker Terminal & 3D Code Wall",
    family: "Developer & Cyber",
    category: "Technology",
    bestFor: "Full-Stack Developers, Security Researchers, CLI Tool Makers",
    tags: ["Terminal", "Hacker", "CLI", "Code Wall", "Matrix Grid"],
    primaryColor: "#00FF66",
    secondaryColor: "#00F0FF",
    cardStyle: "neon-outline",
  }),
  createPreset(cyberpunkTemplate, {
    id: "cyber-devops-cluster",
    name: "DevOps Kubernetes Cluster 3D",
    family: "Developer & Cyber",
    category: "Technology",
    bestFor: "Site Reliability Engineers, Cloud Architects, Platform Leads",
    tags: ["Kubernetes", "DevOps", "Docker", "Cluster Nodes", "Cloud"],
    primaryColor: "#326CE5", // Kubernetes Blue
    secondaryColor: "#00F0FF",
  }),
  createPreset(cyberpunkTemplate, {
    id: "cyber-threat-hunter",
    name: "Cybersecurity Threat Hunter",
    family: "Developer & Cyber",
    category: "Technology",
    bestFor: "SOC Analysts, Penetration Testers, Cryptographers",
    tags: ["Cybersecurity", "Zero Trust", "Firewall", "Red Team", "Encryption"],
    primaryColor: "#EF4444",
    secondaryColor: "#00FF66",
  }),
  createPreset(cyberpunkTemplate, {
    id: "cyber-web3-forge",
    name: "Web3 Smart Contract Forge",
    family: "Developer & Cyber",
    category: "Technology",
    bestFor: "Solidity Engineers, DeFi Protocol Architects, Smart Contract Audits",
    tags: ["Web3", "Ethereum", "Solidity", "DeFi", "Blockchain"],
    primaryColor: "#8B5CF6",
    secondaryColor: "#00F0FF",
  }),
  createPreset(cyberpunkTemplate, {
    id: "cyber-kernel-systems",
    name: "Low-Level Kernel & Systems Hub",
    family: "Developer & Cyber",
    category: "Technology",
    bestFor: "Rust Developers, C/C++ Embedded Engineers, OS Kernel Devs",
    tags: ["Rust", "Systems", "Linux", "C++", "Bare Metal"],
    primaryColor: "#F97316", // Rust Orange
    secondaryColor: "#00F0FF",
  }),
  createPreset(cyberpunkTemplate, {
    id: "cyber-glitch-syndicate",
    name: "Glitchpunk Neon Syndicate",
    family: "Developer & Cyber",
    category: "Technology",
    bestFor: "Front-end Creative Hackers, Cyberpunk Enthusiasts",
    tags: ["Glitch", "Synthesizer", "Magenta", "Neon", "Cyberpunk"],
    primaryColor: "#FF007F",
    secondaryColor: "#FFE600",
  }),
  createPreset(cyberpunkTemplate, {
    id: "cyber-api-mesh",
    name: "Distributed Microservices Mesh",
    family: "Developer & Cyber",
    category: "Technology",
    bestFor: "Backend Architects, GraphQL Enthusiasts, Event-Driven Engineers",
    tags: ["Microservices", "GraphQL", "gRPC", "Kafka", "Mesh"],
    primaryColor: "#06B6D4",
    secondaryColor: "#3B82F6",
  }),
  createPreset(cyberpunkTemplate, {
    id: "cyber-quantum-crypto",
    name: "Post-Quantum Cryptography Lattice",
    family: "Developer & Cyber",
    category: "Technology",
    bestFor: "Cryptographic Researchers, Lattice Math Specialists",
    tags: ["Post-Quantum", "Lattice", "Zero Knowledge", "ZK-SNARK"],
    primaryColor: "#10B981",
    secondaryColor: "#6366F1",
  }),
  createPreset(cyberpunkTemplate, {
    id: "cyber-database-internals",
    name: "Database Storage Engine Internals",
    family: "Developer & Cyber",
    category: "Technology",
    bestFor: "Database Architects, LSM-tree / B-tree Authors, SQL Gurus",
    tags: ["Databases", "LSM Tree", "PostgreSQL", "Storage Engine"],
    primaryColor: "#F59E0B",
    secondaryColor: "#38BDF8",
  }),
  createPreset(cyberpunkTemplate, {
    id: "cyber-fullstack-neon",
    name: "Next.js Full-Stack Neon Velocity",
    family: "Developer & Cyber",
    category: "Technology",
    bestFor: "React/Next.js Engineers, TypeScript Architects, Fast Ship Founders",
    tags: ["Next.js", "React", "TypeScript", "Tailwind", "Velocity"],
    primaryColor: "#00F0FF",
    secondaryColor: "#FF007F",
  }),

  // ==========================================
  // FAMILY 7: CORPORATE / PROFESSIONAL 3D (61-70)
  // ==========================================
  createPreset(corporateTemplate, {
    id: "corporate-executive-monolith",
    name: "Monolith — Executive Leadership & Board",
    family: "Corporate & Professional",
    category: "Minimal & Professional",
    bestFor: "Chief Executive Officers, Board Directors, Managing Directors",
    tags: ["Executive", "Board", "Monolith", "Champagne Gold", "Leadership"],
    primaryColor: "#D4AF37",
    secondaryColor: "#94A3B8",
  }),
  createPreset(corporateTemplate, {
    id: "corporate-fintech-ledger",
    name: "Quantitative FinTech & Hedge Fund",
    family: "Corporate & Professional",
    category: "Minimal & Professional",
    bestFor: "Quant Researchers, Algorithmic Traders, Portfolio Managers",
    tags: ["Quantitative", "Fintech", "Hedge Fund", "High Finance", "Bloomberg"],
    primaryColor: "#00F0FF",
    secondaryColor: "#10B981",
  }),
  createPreset(corporateTemplate, {
    id: "corporate-vc-partner",
    name: "Venture Capital Partner & Investor",
    family: "Corporate & Professional",
    category: "Minimal & Professional",
    bestFor: "General Partners, Angel Investors, Startup Advisors",
    tags: ["Venture Capital", "Partner", "Deal Flow", "Portfolio", "Silicon Valley"],
    primaryColor: "#F59E0B",
    secondaryColor: "#E2E8F0",
  }),
  createPreset(corporateTemplate, {
    id: "corporate-management-consulting",
    name: "Strategy & Management Consulting",
    family: "Corporate & Professional",
    category: "Minimal & Professional",
    bestFor: "MBB Consultants (McKinsey/BCG/Bain), Corporate Strategists",
    tags: ["Strategy", "Consulting", "Transformation", "Advisory"],
    primaryColor: "#38BDF8",
    secondaryColor: "#64748B",
  }),
  createPreset(corporateTemplate, {
    id: "corporate-swiss-minimal",
    name: "Swiss Minimalist Ivory",
    family: "Corporate & Professional",
    category: "Minimal & Professional",
    bestFor: "Private Bankers, Luxury Consultants, Zurich Finance",
    tags: ["Swiss", "Ivory", "Minimalist", "Private Wealth", "Typography"],
    primaryColor: "#F8FAFC",
    secondaryColor: "#475569",
    cardStyle: "minimal",
  }),
  createPreset(corporateTemplate, {
    id: "corporate-private-equity",
    name: "Private Equity Buyout Lead",
    family: "Corporate & Professional",
    category: "Minimal & Professional",
    bestFor: "PE Associates, M&A Bankers, Buyout Strategists",
    tags: ["Private Equity", "M&A", "Investment Banking", "Leveraged Buyout"],
    primaryColor: "#94A3B8",
    secondaryColor: "#D4AF37",
  }),
  createPreset(corporateTemplate, {
    id: "corporate-legal-governance",
    name: "Legal Counsel & Corporate Governance",
    family: "Corporate & Professional",
    category: "Minimal & Professional",
    bestFor: "General Counsels, Corporate Lawyers, Compliance Officers",
    tags: ["Legal", "General Counsel", "Compliance", "Governance"],
    primaryColor: "#C084FC",
    secondaryColor: "#E2E8F0",
  }),
  createPreset(corporateTemplate, {
    id: "corporate-enterprise-csuite",
    name: "Enterprise CIO & Technology Strategist",
    family: "Corporate & Professional",
    category: "Minimal & Professional",
    bestFor: "CIOs, CTOs, Enterprise IT Executives, Digital Transformation",
    tags: ["CIO", "Enterprise IT", "Digital Transformation", "Security"],
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
  }),
  createPreset(corporateTemplate, {
    id: "corporate-esg-sustainable",
    name: "ESG & Sustainable Impact Executive",
    family: "Corporate & Professional",
    category: "Minimal & Professional",
    bestFor: "Sustainability Officers, Clean Energy Investors, Carbon Leads",
    tags: ["ESG", "Sustainability", "Impact Investing", "Green Finance"],
    primaryColor: "#10B981",
    secondaryColor: "#38BDF8",
  }),
  createPreset(corporateTemplate, {
    id: "corporate-mba-fellow",
    name: "Ivy League MBA Graduate Portfolio",
    family: "Corporate & Professional",
    category: "Minimal & Professional",
    bestFor: "MBA Candidates, Business School Fellows, Product Managers",
    tags: ["MBA", "Business School", "Product Management", "Recruiting"],
    primaryColor: "#E2E8F0",
    secondaryColor: "#60A5FA",
  }),

  // ==========================================
  // FAMILY 8: ARCHITECTURE & ENGINEERING (71-80)
  // ==========================================
  createPreset(architectureTemplate, {
    id: "arch-blueprint-wireframe",
    name: "Structural Blueprint Wireframe",
    family: "Architecture & Engineering",
    category: "Architecture & Engineering",
    bestFor: "Licensed Architects, Structural Engineers, BIM Coordinators",
    tags: ["Blueprint", "CAD", "Skyscraper", "Structural Wireframe", "Orthographic"],
    primaryColor: "#38BDF8",
    secondaryColor: "#F59E0B",
  }),
  createPreset(architectureTemplate, {
    id: "arch-concrete-glass",
    name: "Modernist Concrete & Glass Tower",
    family: "Architecture & Engineering",
    category: "Architecture & Engineering",
    bestFor: "Commercial Architects, Facade Engineers, High-Rise Designers",
    tags: ["Modernist", "Concrete", "Glass Tower", "Brutalism"],
    primaryColor: "#94A3B8",
    secondaryColor: "#38BDF8",
  }),
  createPreset(architectureTemplate, {
    id: "arch-parametric-pavilion",
    name: "Parametric Algorithmic Pavilion",
    family: "Architecture & Engineering",
    category: "Architecture & Engineering",
    bestFor: "Grasshopper/Rhino Specialists, Computational Architects",
    tags: ["Parametric", "Grasshopper", "Rhino 3D", "Voronoi", "Form Finding"],
    primaryColor: "#A855F7",
    secondaryColor: "#00F0FF",
  }),
  createPreset(architectureTemplate, {
    id: "arch-urban-masterplan",
    name: "Smart City Urban Masterplan",
    family: "Architecture & Engineering",
    category: "Architecture & Engineering",
    bestFor: "Urban Planners, GIS Specialists, Transportation Engineers",
    tags: ["Urban Planning", "Smart City", "GIS", "Transit", "Masterplan"],
    primaryColor: "#10B981",
    secondaryColor: "#38BDF8",
  }),
  createPreset(architectureTemplate, {
    id: "arch-geodesic-biome",
    name: "Geodesic Dome & Biosphere Network",
    family: "Architecture & Engineering",
    category: "Architecture & Engineering",
    bestFor: "Eco-Architects, Greenhouse Designers, Buckminster Fuller fans",
    tags: ["Geodesic", "Biosphere", "Tensile", "Buckminster Fuller"],
    primaryColor: "#00F0FF",
    secondaryColor: "#10B981",
  }),
  createPreset(architectureTemplate, {
    id: "arch-mass-timber",
    name: "Sustainable Mass Timber Structure",
    family: "Architecture & Engineering",
    category: "Architecture & Engineering",
    bestFor: "Mass Timber Pioneers, Cross-Laminated Timber (CLT) Leads",
    tags: ["Mass Timber", "CLT", "Wood Construction", "Eco Architecture"],
    primaryColor: "#D97706",
    secondaryColor: "#10B981",
  }),
  createPreset(architectureTemplate, {
    id: "arch-civil-infrastructure",
    name: "Civil Infrastructure & Mega Bridges",
    family: "Architecture & Engineering",
    category: "Architecture & Engineering",
    bestFor: "Civil Engineers, Suspension Bridge Designers, Tunnel Leads",
    tags: ["Civil Engineering", "Bridges", "Tunnels", "Concrete Slabs"],
    primaryColor: "#F59E0B",
    secondaryColor: "#38BDF8",
  }),
  createPreset(architectureTemplate, {
    id: "arch-interior-spatial",
    name: "Spatial Interior Atelier & Lighting",
    family: "Architecture & Engineering",
    category: "Architecture & Engineering",
    bestFor: "Interior Architects, Lighting Designers, Hospitality Studios",
    tags: ["Interior Design", "Lighting", "Hospitality", "Warm Materiality"],
    primaryColor: "#FBBF24",
    secondaryColor: "#F43F5E",
  }),
  createPreset(architectureTemplate, {
    id: "arch-mep-mechanical",
    name: "MEP Building Systems Coordinator",
    family: "Architecture & Engineering",
    category: "Architecture & Engineering",
    bestFor: "HVAC Engineers, Mechanical Piping Leads, Revit Modelers",
    tags: ["MEP", "HVAC", "Piping", "Revit", "Clash Detection"],
    primaryColor: "#EF4444",
    secondaryColor: "#38BDF8",
  }),
  createPreset(architectureTemplate, {
    id: "arch-acoustic-concert",
    name: "Acoustical Hall & Soundwave Facade",
    family: "Architecture & Engineering",
    category: "Architecture & Engineering",
    bestFor: "Acousticians, Concert Hall Architects, Studio Designers",
    tags: ["Acoustics", "Sound Diffuser", "Concert Hall", "Reverb"],
    primaryColor: "#C084FC",
    secondaryColor: "#60A5FA",
  }),

  // ==========================================
  // FAMILY 9: AUTOMOTIVE & MECHANICAL (81-90)
  // ==========================================
  createPreset(automotiveTemplate, {
    id: "auto-hypercar-chassis",
    name: "Apex Aerodynamic Hypercar Chassis",
    family: "Automotive & Mechanical",
    category: "Automotive & Mechanical",
    bestFor: "Automotive Aerodynamicists, Carbon Monocoque Engineers",
    tags: ["Hypercar", "Aerodynamics", "Chassis", "Carbon Fiber", "Downforce"],
    primaryColor: "#EF4444",
    secondaryColor: "#F59E0B",
  }),
  createPreset(automotiveTemplate, {
    id: "auto-formula-racing",
    name: "Formula Telemetry & CFD Analytics",
    family: "Automotive & Mechanical",
    category: "Automotive & Mechanical",
    bestFor: "Motorsports Engineers, Formula 1 Race Strategists, CFD Leads",
    tags: ["Formula 1", "CFD", "Telemetry", "Pit Lane", "Aero Wings"],
    primaryColor: "#00F0FF",
    secondaryColor: "#EF4444",
  }),
  createPreset(automotiveTemplate, {
    id: "auto-turbo-powertrain",
    name: "Exploded Turbo Engine Assembly",
    family: "Automotive & Mechanical",
    category: "Automotive & Mechanical",
    bestFor: "Internal Combustion Engineers, Camshaft/Piston Technicians",
    tags: ["Engine", "Exploded View", "Turbocharger", "Pistons", "Cams"],
    primaryColor: "#F97316",
    secondaryColor: "#38BDF8",
  }),
  createPreset(automotiveTemplate, {
    id: "auto-ev-powertrain",
    name: "Electric Vehicle (EV) Battery Pack",
    family: "Automotive & Mechanical",
    category: "Automotive & Mechanical",
    bestFor: "EV Battery Engineers, Inverter Specialists, Tesla/Rivian Leads",
    tags: ["EV", "Battery Pack", "Electric Motor", "Inverter", "400V"],
    primaryColor: "#10B981",
    secondaryColor: "#38BDF8",
  }),
  createPreset(automotiveTemplate, {
    id: "auto-chronograph-watch",
    name: "Horology Chronograph & Tourbillon",
    family: "Automotive & Mechanical",
    category: "Automotive & Mechanical",
    bestFor: "Watchmakers, Precision Instrument Engineers, Micromechanics",
    tags: ["Horology", "Tourbillon", "Gears", "Watchmaking", "Jeweled Escapement"],
    primaryColor: "#D4AF37",
    secondaryColor: "#38BDF8",
  }),
  createPreset(automotiveTemplate, {
    id: "auto-industrial-robot-arm",
    name: "6-Axis Industrial Robotics Arm",
    family: "Automotive & Mechanical",
    category: "Automotive & Mechanical",
    bestFor: "Factory Automation Leads, KUKA/Fanuc Robot Integrators",
    tags: ["Robotic Arm", "Automation", "Assembly Line", "Kinematics"],
    primaryColor: "#F59E0B",
    secondaryColor: "#111827",
  }),
  createPreset(automotiveTemplate, {
    id: "auto-drone-propulsion",
    name: "Autonomous eVTOL & Drone Dynamics",
    family: "Automotive & Mechanical",
    category: "Automotive & Mechanical",
    bestFor: "Drone Pilots, eVTOL Flight Dynamics, Rotorcraft Engineers",
    tags: ["eVTOL", "Drone", "Rotor", "Urban Air Mobility", "Propeller"],
    primaryColor: "#38BDF8",
    secondaryColor: "#10B981",
  }),
  createPreset(automotiveTemplate, {
    id: "auto-cnc-machinist",
    name: "5-Axis CNC Precision Machinist",
    family: "Automotive & Mechanical",
    category: "Automotive & Mechanical",
    bestFor: "CNC Programmers, Tool & Die Makers, Billet Titanium Millers",
    tags: ["CNC", "Machining", "Milling", "Titanium", "G-code"],
    primaryColor: "#94A3B8",
    secondaryColor: "#F59E0B",
  }),
  createPreset(automotiveTemplate, {
    id: "auto-suspension-dynamics",
    name: "Multi-Link Active Suspension",
    family: "Automotive & Mechanical",
    category: "Automotive & Mechanical",
    bestFor: "Vehicle Dynamics Engineers, Damper Tuners, Chassis Leads",
    tags: ["Suspension", "Damper", "Ride Height", "Camber", "Dynamics"],
    primaryColor: "#EAB308",
    secondaryColor: "#EF4444",
  }),
  createPreset(automotiveTemplate, {
    id: "auto-hydrogen-fuel",
    name: "Hydrogen Fuel Cell Powertrain",
    family: "Automotive & Mechanical",
    category: "Automotive & Mechanical",
    bestFor: "Hydrogen Engineers, Clean Mobility Innovators",
    tags: ["Hydrogen", "Fuel Cell", "Zero Emissions", "Clean Tech"],
    primaryColor: "#06B6D4",
    secondaryColor: "#10B981",
  }),

  // ==========================================
  // FAMILY 10: GAMING & INTERACTIVE (91-100)
  // ==========================================
  createPreset(gamingTemplate, {
    id: "game-cyber-quest",
    name: "Cyber Quest — RPG Quest & Inventory",
    family: "Gaming & Interactive",
    category: "Gaming & Interactive",
    bestFor: "Game Designers, RPG Systems Authors, Combat Designers",
    tags: ["RPG", "Inventory", "Quest HUD", "Level System", "Loot"],
    primaryColor: "#10B981",
    secondaryColor: "#8B5CF6",
  }),
  createPreset(gamingTemplate, {
    id: "game-retro-arcade",
    name: "Retro 80s Arcade Voxel Dungeon",
    family: "Gaming & Interactive",
    category: "Gaming & Interactive",
    bestFor: "Indie Pixel Artists, Retro Game Devs, Arcade Enthusiasts",
    tags: ["Arcade", "Voxel", "8-bit", "Pixel Art", "CRT Scanline"],
    primaryColor: "#F43F5E",
    secondaryColor: "#FFE600",
  }),
  createPreset(gamingTemplate, {
    id: "game-scifi-cockpit",
    name: "Starfighter Cockpit Combat HUD",
    family: "Gaming & Interactive",
    category: "Gaming & Interactive",
    bestFor: "Space Combat Developers, Flight Sim HUD Designers",
    tags: ["Cockpit", "Fighter", "Combat HUD", "Target Reticle"],
    primaryColor: "#00F0FF",
    secondaryColor: "#EF4444",
  }),
  createPreset(gamingTemplate, {
    id: "game-unreal-shader",
    name: "Unreal Engine 5 Shader Master",
    family: "Gaming & Interactive",
    category: "Gaming & Interactive",
    bestFor: "Technical Artists, Unreal Materials Authors, Lumen/Nanite Leads",
    tags: ["Unreal Engine", "UE5", "Shaders", "Lumen", "Nanite"],
    primaryColor: "#38BDF8",
    secondaryColor: "#A855F7",
  }),
  createPreset(gamingTemplate, {
    id: "game-isometric-builder",
    name: "Isometric Strategy Level Builder",
    family: "Gaming & Interactive",
    category: "Gaming & Interactive",
    bestFor: "Level Designers, Strategy Game Developers, City Builders",
    tags: ["Isometric", "Level Design", "Strategy", "Hex Grid"],
    primaryColor: "#F59E0B",
    secondaryColor: "#10B981",
  }),
  createPreset(gamingTemplate, {
    id: "game-lowpoly-adventurer",
    name: "Low-Poly Cozy Island Adventurer",
    family: "Gaming & Interactive",
    category: "Gaming & Interactive",
    bestFor: "Cozy Game Developers, Low-Poly 3D Generalists",
    tags: ["Low Poly", "Cozy Game", "Stylized Nature", "Warm"],
    primaryColor: "#34D399",
    secondaryColor: "#FBBF24",
  }),
  createPreset(gamingTemplate, {
    id: "game-speedrun-platformer",
    name: "Hyper Speedrun Precision Platformer",
    family: "Gaming & Interactive",
    category: "Gaming & Interactive",
    bestFor: "Platformer Developers, Speedrunners, Tight Physics Programmers",
    tags: ["Speedrun", "Platformer", "Precision", "Neon Trails"],
    primaryColor: "#EC4899",
    secondaryColor: "#00F0FF",
  }),
  createPreset(gamingTemplate, {
    id: "game-cyber-stealth",
    name: "Tactical Espionage Stealth Protocol",
    family: "Gaming & Interactive",
    category: "Gaming & Interactive",
    bestFor: "Stealth Game Designers, AI Behavior Tree Programmers",
    tags: ["Stealth", "Tactical", "Sonar Ping", "Night Vision"],
    primaryColor: "#00FF66",
    secondaryColor: "#1E293B",
  }),
  createPreset(gamingTemplate, {
    id: "game-esports-arena",
    name: "Esports Tournament Champion Arena",
    family: "Gaming & Interactive",
    category: "Gaming & Interactive",
    bestFor: "Pro Gamers, Esports Broadcast Designers, Clan Leaders",
    tags: ["Esports", "Broadcast", "Tournament", "Trophy", "Winner"],
    primaryColor: "#FFE600",
    secondaryColor: "#FF0055",
  }),
  createPreset(gamingTemplate, {
    id: "game-experimental-webgl",
    name: "Experimental WebGL Shader Universe",
    family: "Experimental WebGL",
    category: "Experimental WebGL",
    bestFor: "Highest-End WebGL Masters, Awwwards Site Of The Year Creators",
    tags: ["Experimental", "Awwwards", "Fluid Simulation", "Distortion", "Physics"],
    primaryColor: "#A855F7",
    secondaryColor: "#00F0FF",
  }),
];

export function getAllPresets(): PresetCatalogItem[] {
  return PRESET_CATALOG;
}

export function getPresetsByFamily(family: PresetCatalogItem["family"]): PresetCatalogItem[] {
  return PRESET_CATALOG.filter((p) => p.family === family);
}

export function searchPresets(query: string, familyFilter?: string): PresetCatalogItem[] {
  const q = query.toLowerCase().trim();
  return PRESET_CATALOG.filter((item) => {
    const matchesFamily = !familyFilter || familyFilter === "All" || item.family === familyFilter;
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.bestFor.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));
    return matchesFamily && matchesQuery;
  });
}
