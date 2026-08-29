export interface AssetDefinition {
  id: string;
  name: string;
  type: "model" | "texture" | "environment";
  category: "space" | "tech" | "abstract" | "shapes";
  url: string;
  preview?: string;
  fileSize?: number; // In KB
  polyBudget?: number;
  allowed: boolean;
}

export const APPROVED_ASSETS: Record<string, AssetDefinition> = {
  "planet-01": {
    id: "planet-01",
    name: "Cybernetic Exoplanet",
    type: "model",
    category: "space",
    url: "/assets/models/planet-01.glb",
    preview: "/assets/previews/planet-01.webp",
    fileSize: 450,
    polyBudget: 12000,
    allowed: true,
  },
  "robot-01": {
    id: "robot-01",
    name: "Autonomous Spatial Drone",
    type: "model",
    category: "tech",
    url: "/assets/models/robot-01.glb",
    preview: "/assets/previews/robot-01.webp",
    fileSize: 680,
    polyBudget: 18000,
    allowed: true,
  },
  "abstract-ring-01": {
    id: "abstract-ring-01",
    name: "Quantum Gyro Ring",
    type: "model",
    category: "abstract",
    url: "/assets/models/abstract-ring-01.glb",
    preview: "/assets/previews/abstract-ring-01.webp",
    fileSize: 320,
    polyBudget: 8000,
    allowed: true,
  },
  "computer-01": {
    id: "computer-01",
    name: "Retro-Futuristic Terminal",
    type: "model",
    category: "tech",
    url: "/assets/models/computer-01.glb",
    preview: "/assets/previews/computer-01.webp",
    fileSize: 520,
    polyBudget: 14000,
    allowed: true,
  },
  "crystal-01": {
    id: "crystal-01",
    name: "Refractive Hologram Crystal",
    type: "model",
    category: "shapes",
    url: "/assets/models/crystal-01.glb",
    preview: "/assets/previews/crystal-01.webp",
    fileSize: 210,
    polyBudget: 5000,
    allowed: true,
  },
};

export function getApprovedAsset(assetId: string): AssetDefinition | null {
  const asset = APPROVED_ASSETS[assetId];
  if (!asset || !asset.allowed) {
    return null;
  }
  return asset;
}

export function isAssetAllowed(assetId: string): boolean {
  return Boolean(APPROVED_ASSETS[assetId]?.allowed);
}
