import { PortfolioData } from "@/schemas/portfolio.schema";
import { SceneConfig, SceneMeshNode } from "@zylo/three-engine";

export type DeviceMode = "desktop" | "tablet" | "mobile";
export type SidebarTab = "sections" | "content" | "scene" | "theme" | "assets" | "ai" | "versions";

export type SelectionType = "section" | "text" | "scene-node" | "camera" | "lighting" | "none";

export interface SelectedElement {
  type: SelectionType;
  id: string; // e.g. "hero", "proj-1", "node-planet", "camera", "light-1"
  subfield?: string; // e.g. "headline", "bio", "materialProps.color"
  displayName: string;
}

export interface PortfolioVersionRecord {
  id: string;
  portfolioId: string;
  name: string;
  reason: string;
  createdAt: string;
  snapshot: PortfolioData;
}

export interface HistorySnapshot {
  portfolio: PortfolioData;
  timestamp: number;
  label: string;
}

export interface BuilderState {
  portfolioId: string;
  activeSidebarTab: SidebarTab;
  deviceMode: DeviceMode;
  selectedElement: SelectedElement | null;
  zoomLevel: number; // 50 to 150%
  viewMode: "edit" | "preview";
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  history: HistorySnapshot[];
  historyIndex: number; // index into history stack
  versions: PortfolioVersionRecord[];
  aiDiffPreview: {
    prompt: string;
    original: PortfolioData;
    proposed: PortfolioData;
    patches: any[];
  } | null;
}
