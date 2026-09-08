import { SceneConfig, SceneSchema } from "../schemas/scene.schema";

export const ANIME_SCENE_TEMPLATE: SceneConfig = SceneSchema.parse({
  id: "template-anime-01",
  name: "Neo-Tokyo Anime Dimension",
  version: "1.0.0",
  camera: {
    type: "perspective",
    fov: 45,
    position: [0, 0, 7.5],
    target: [0, 0.4, 0],
    near: 0.1,
    far: 1000,
    controls: {
      enabled: true,
      autoRotate: true,
      autoRotateSpeed: 0.9,
      enableZoom: false,
      enablePan: false,
      dampingFactor: 0.05,
      maxPolarAngle: Math.PI / 2 + 0.1,
      minPolarAngle: Math.PI / 3,
    },
  },
  lighting: {
    preset: "cyberpunk",
    ambientIntensity: 0.5,
    lights: [
      { id: "anime-key-pink", type: "point", color: "#FF2A85", intensity: 4.5, position: [3, 4, 3], distance: 20 },
      { id: "anime-fill-cyan", type: "point", color: "#00F0FF", intensity: 4.0, position: [-3, 2, 3], distance: 20 },
      { id: "anime-rim-gold", type: "point", color: "#FFE600", intensity: 2.5, position: [0, -3, -2], distance: 20 },
      { id: "anime-dir", type: "directional", color: "#ffffff", intensity: 1.2, position: [0, 5, 4] },
    ],
  },
  environment: {
    preset: "night",
    background: { type: "solid", color: "#080612" },
    blur: 0.7,
    fog: { enabled: true, color: "#080612", near: 6, far: 24 },
    stars: { enabled: true, count: 1200, color: "#FF75A0", radius: 50, depth: 30, speed: 0.8 },
  },
  postProcessing: {
    bloom: { enabled: true, intensity: 1.4, luminanceThreshold: 0.2, luminanceSmoothing: 0.85 },
    chromaticAberration: { enabled: true, offset: [0.002, 0.002] },
    vignette: { enabled: true, darkness: 0.55, offset: 0.3 },
  },
  nodes: [
    {
      id: "node-anime-character",
      componentType: "AnimeCharacterAvatar",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
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
        rotateSpeed: [0, 0.2, 0],
        floatAmplitude: 0.15,
        floatSpeed: 1.2,
      },
      interactive: {
        hoverScale: 1.08,
        hoverGlow: true,
        pointerParallax: true,
        parallaxStrength: 0.4,
      },
      visible: true,
    },
    {
      id: "node-sakura-petals",
      componentType: "SakuraPetalField",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      materialProps: {
        type: "basic",
        color: "#FF75A0",
        transparent: true,
        opacity: 0.8,
      },
      animation: {
        type: "none",
      },
      interactive: {
        hoverScale: 1,
        hoverGlow: false,
        pointerParallax: false,
      },
      visible: true,
    },
    {
      id: "node-cyber-grid-floor",
      componentType: "CyberGrid",
      position: [0, -1.8, 0],
      rotation: [0, 0, 0],
      scale: [1.8, 1, 1.8],
      materialProps: {
        type: "basic",
        color: "#FF2A85",
        transparent: true,
        opacity: 0.15,
      },
      animation: {
        type: "none",
      },
      interactive: {
        hoverScale: 1,
        hoverGlow: false,
        pointerParallax: false,
      },
      visible: true,
    },
  ],
  quality: "high",
});

export const ARCHITECTURE_SCENE_TEMPLATE: SceneConfig = SceneSchema.parse({
  id: "template-architecture-01",
  name: "BIM Blueprint CAD Dimension",
  version: "1.0.0",
  camera: {
    type: "perspective",
    fov: 45,
    position: [4, 3, 6],
    target: [0, 0, 0],
    near: 0.1,
    far: 1000,
    controls: {
      enabled: true,
      autoRotate: true,
      autoRotateSpeed: 0.5,
      enableZoom: false,
      enablePan: false,
      dampingFactor: 0.05,
    },
  },
  lighting: {
    preset: "studio",
    ambientIntensity: 0.6,
    lights: [
      { id: "cad-light-1", type: "directional", color: "#38BDF8", intensity: 2.5, position: [5, 8, 4] },
      { id: "cad-light-2", type: "point", color: "#F59E0B", intensity: 2, position: [-4, 2, -2] },
    ],
  },
  environment: {
    preset: "studio",
    background: { type: "solid", color: "#060A14" },
    blur: 0.6,
    fog: { enabled: true, color: "#060A14", near: 6, far: 20 },
  },
  postProcessing: {
    bloom: { enabled: true, intensity: 0.7, luminanceThreshold: 0.3, luminanceSmoothing: 0.9 },
    vignette: { enabled: true, darkness: 0.4, offset: 0.3 },
  },
  nodes: [
    {
      id: "node-building-wireframe",
      componentType: "BuildingWireframe",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
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
      visible: true,
    },
    {
      id: "node-cad-grid",
      componentType: "CyberGrid",
      position: [0, -1.8, 0],
      rotation: [0, 0, 0],
      scale: [2.2, 1, 2.2],
      materialProps: {
        type: "basic",
        color: "#38BDF8",
        transparent: true,
        opacity: 0.2,
      },
      animation: { type: "none" },
      interactive: { hoverScale: 1, hoverGlow: false },
      visible: true,
    },
  ],
  quality: "high",
});

export const AUTOMOTIVE_SCENE_TEMPLATE: SceneConfig = SceneSchema.parse({
  id: "template-automotive-01",
  name: "Aero Performance Studio",
  version: "1.0.0",
  camera: {
    type: "perspective",
    fov: 45,
    position: [3.5, 1.8, 4.5],
    target: [0, 0.2, 0],
    near: 0.1,
    far: 1000,
    controls: {
      enabled: true,
      autoRotate: true,
      autoRotateSpeed: 0.7,
      enableZoom: false,
      enablePan: false,
      dampingFactor: 0.05,
    },
  },
  lighting: {
    preset: "studio",
    ambientIntensity: 0.5,
    lights: [
      { id: "auto-spot-1", type: "spot", color: "#ffffff", intensity: 4, position: [3, 6, 3] },
      { id: "auto-rim-red", type: "point", color: "#EF4444", intensity: 3, position: [-3, 1, -2] },
    ],
  },
  environment: {
    preset: "studio",
    background: { type: "solid", color: "#09090E" },
    blur: 0.8,
    fog: { enabled: true, color: "#09090E", near: 5, far: 18 },
  },
  postProcessing: {
    bloom: { enabled: true, intensity: 0.9, luminanceThreshold: 0.25, luminanceSmoothing: 0.9 },
    vignette: { enabled: true, darkness: 0.5, offset: 0.3 },
  },
  nodes: [
    {
      id: "node-automotive-chassis",
      componentType: "AutomotiveChassis",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
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
      visible: true,
    },
  ],
  quality: "high",
});

export const CORPORATE_SCENE_TEMPLATE: SceneConfig = SceneSchema.parse({
  id: "template-corporate-01",
  name: "Executive Monolith",
  version: "1.0.0",
  camera: {
    type: "perspective",
    fov: 40,
    position: [0, 0, 6.5],
    target: [0, 0, 0],
    near: 0.1,
    far: 1000,
    controls: {
      enabled: true,
      autoRotate: true,
      autoRotateSpeed: 0.3,
      enableZoom: false,
      enablePan: false,
      dampingFactor: 0.05,
    },
  },
  lighting: {
    preset: "minimal-white",
    ambientIntensity: 0.4,
    lights: [
      { id: "monolith-light-1", type: "directional", color: "#D4AF37", intensity: 2, position: [2, 5, 3] },
      { id: "monolith-light-2", type: "point", color: "#ffffff", intensity: 1.5, position: [-3, -2, 2] },
    ],
  },
  environment: {
    preset: "studio",
    background: { type: "solid", color: "#06080F" },
    blur: 0.9,
    fog: { enabled: true, color: "#06080F", near: 4, far: 16 },
  },
  postProcessing: {
    bloom: { enabled: true, intensity: 0.5, luminanceThreshold: 0.4, luminanceSmoothing: 0.9 },
    vignette: { enabled: true, darkness: 0.4, offset: 0.2 },
  },
  nodes: [
    {
      id: "node-executive-monolith",
      componentType: "ExecutiveMonolith",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
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
      visible: true,
    },
  ],
  quality: "high",
});
