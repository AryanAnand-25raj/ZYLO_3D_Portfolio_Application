"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { BuilderTopBar } from "@/components/builder/BuilderTopBar";
import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import { SectionManagerPanel } from "@/components/builder/SectionManagerPanel";
import { AssetPalettePanel } from "@/components/builder/AssetPalettePanel";
import { ThemeEditorPanel } from "@/components/builder/ThemeEditorPanel";
import { AIAssistantPanel } from "@/components/builder/AIAssistantPanel";
import { BuilderInspector } from "@/components/builder/BuilderInspector";
import { LiveCanvasViewport } from "@/components/builder/LiveCanvasViewport";
import {
  BuilderState,
  SidebarTab,
  DeviceMode,
  SelectedElement,
  HistorySnapshot,
  PortfolioVersionRecord,
} from "@/modules/builder/types";
import { PortfolioData } from "@/schemas/portfolio.schema";
import { AssetManifestEntry, SceneMeshNode } from "@zylo/three-engine";
import { Loader2, History, RotateCcw } from "lucide-react";
import { PublishModal } from "@/components/publishing/PublishModal";
import { DeploymentHistoryModal } from "@/components/publishing/DeploymentHistoryModal";
import { CustomDomainModal } from "@/components/publishing/CustomDomainModal";

export default function VisualBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const portfolioId = (params?.portfolioId as string) || "port-demo-1";

  const [loading, setLoading] = useState<boolean>(true);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);

  // Editor UI State (separate from portfolio state)
  const [activeTab, setActiveTab] = useState<SidebarTab>("sections");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>({
    type: "text",
    id: "hero-headline",
    subfield: "headline",
    displayName: "Hero Headline",
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Publishing Modals & Live Status
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isDomainsModalOpen, setIsDomainsModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // Undo / Redo History Stack
  const [historyStack, setHistoryStack] = useState<HistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Versions list
  const [versions, setVersions] = useState<PortfolioVersionRecord[]>([]);

  // AI Diff Preview state
  const [aiDiffPreview, setAiDiffPreview] = useState<{
    prompt: string;
    explanation: string;
    operations: any[];
    updatedPortfolio: PortfolioData;
  } | null>(null);

  // Autosave timer ref
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);


  // 1. Initial Data Fetch
  useEffect(() => {
    async function loadPortfolio() {
      setLoading(true);
      try {
        const res = await fetch(`/api/builder/${portfolioId}`);
        const data = await res.json();

        if (data.success && data.portfolio) {
          setPortfolio(data.portfolio);
          setVersions(data.versions || []);
          // Initialize history stack with original snapshot
          setHistoryStack([{ portfolio: data.portfolio, timestamp: Date.now(), label: "Initial" }]);
          setHistoryIndex(0);
        } else {
          console.warn("Failed to load portfolio:", data.error);
        }

        // Check active published status
        try {
          const pubRes = await fetch(`/api/publish/${portfolioId}`);
          const pubData = await pubRes.json();
          if (pubData.published && pubData.published.status === "published") {
            setIsPublished(true);
            setPublishedUrl(pubData.published.deploymentUrl);
          }
        } catch {
          // In-memory fallback
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, [portfolioId]);


  // Helper to push state into history stack
  const recordHistory = useCallback(
    (newPortfolio: PortfolioData, label: string) => {
      setHistoryStack((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        return [...trimmed, { portfolio: newPortfolio, timestamp: Date.now(), label }];
      });
      setHistoryIndex((prev) => prev + 1);
      setIsDirty(true);
    },
    [historyIndex]
  );

  // 2. Autosave with debounce
  useEffect(() => {
    if (!isDirty || !portfolio) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        const res = await fetch(`/api/builder/${portfolioId}/autosave`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ portfolio }),
        });
        const data = await res.json();
        if (data.success) {
          setIsDirty(false);
          setLastSavedAt(new Date().toLocaleTimeString());
        }
      } catch (e) {
        console.warn("Autosave failed:", e);
      } finally {
        setIsSaving(false);
      }
    }, 2500);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [portfolio, isDirty, portfolioId]);

  // Keyboard Shortcuts (Ctrl+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleUndo = () => {
    if (historyIndex > 0) {
      const target = historyStack[historyIndex - 1];
      setPortfolio(JSON.parse(JSON.stringify(target.portfolio)));
      setHistoryIndex(historyIndex - 1);
      setIsDirty(true);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const target = historyStack[historyIndex + 1];
      setPortfolio(JSON.parse(JSON.stringify(target.portfolio)));
      setHistoryIndex(historyIndex + 1);
      setIsDirty(true);
    }
  };

  const handleExplicitSave = async () => {
    if (!portfolio) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/builder/${portfolioId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolio,
          versionName: "Manual Save",
          reason: "User clicked Save in Visual Editor",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsDirty(false);
        setLastSavedAt(new Date().toLocaleTimeString());
        if (data.version) {
          setVersions((prev) => [data.version, ...prev]);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = () => {
    setIsPublishModalOpen(true);
  };

  const handleSharePreview = async () => {
    try {
      const res = await fetch(`/api/publish/${portfolioId}/preview`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.previewUrl) {
        const fullUrl = `${window.location.origin}${data.previewUrl}`;
        navigator.clipboard.writeText(fullUrl);
        alert(`24-hour private preview link copied to clipboard!\n\n${fullUrl}`);
      } else {
        alert("Failed to create preview token.");
      }
    } catch {
      alert("Network error generating preview link.");
    }
  };


  // Section Manager Handlers
  const handleReorderSections = (fromIndex: number, toIndex: number) => {
    if (!portfolio || fromIndex < 0 || toIndex < 0) return;
    // Section reordering logic
    recordHistory(portfolio, "Reordered Sections");
  };

  // Content Text Updating
  const handleUpdateText = (path: string, newText: string) => {
    if (!portfolio) return;
    const cloned = JSON.parse(JSON.stringify(portfolio));

    if (path.includes("headline")) {
      cloned.content.profile.headline = newText;
    } else if (path.includes("bio")) {
      cloned.content.profile.bio = newText;
    } else if (path.includes("fullName")) {
      cloned.content.profile.fullName = newText;
    }

    setPortfolio(cloned);
    recordHistory(cloned, "Updated Text");
  };

  // 3D Scene Node Updating
  const handleUpdateSceneNode = (nodeId: string, updates: Partial<SceneMeshNode>) => {
    if (!portfolio || !portfolio.scene) return;
    const cloned = JSON.parse(JSON.stringify(portfolio));
    const nodeIndex = cloned.scene.nodes.findIndex((n: any) => n.id === nodeId);
    if (nodeIndex !== -1) {
      cloned.scene.nodes[nodeIndex] = {
        ...cloned.scene.nodes[nodeIndex],
        ...updates,
      };
      setPortfolio(cloned);
      recordHistory(cloned, `Updated 3D Node ${nodeId}`);
    }
  };

  // 3D Add Asset to Scene
  const handleAddAssetToScene = (asset: AssetManifestEntry) => {
    if (!portfolio || !portfolio.scene) return;
    const cloned = JSON.parse(JSON.stringify(portfolio));
    const newNodeId = `node-${asset.id}-${Date.now()}`;

    const newNode: SceneMeshNode = {
      id: newNodeId,
      componentType: "model",
      assetId: asset.id,
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      materialProps: {
        type: "standard",
        color: "#00F0FF",
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: false,
        transparent: true,
        opacity: 0.9,
      } as any,
      animation: {
        type: "rotate",
        axis: "y",
        speed: 0.4,
        rotateSpeed: [0.1, 0.2, 0],
        floatAmplitude: 0.2,
        floatSpeed: 1,
        pulseSpeed: 0,
        pulseRange: [0.9, 1.1],
      } as any,
      interactive: {
        hoverScale: 1.08,
        hoverGlow: true,
        clickAction: "none",
        pointerParallax: true,
        parallaxStrength: 0.3,
      } as any,
      visible: true,
    };

    cloned.scene.nodes.push(newNode);
    setPortfolio(cloned);
    recordHistory(cloned, `Added ${asset.name} to 3D Scene`);
    setSelectedElement({
      type: "scene-node",
      id: newNodeId,
      displayName: asset.name,
    });
  };

  // 3D Delete Scene Node
  const handleDeleteSceneNode = (nodeId: string) => {
    if (!portfolio || !portfolio.scene) return;
    const cloned = JSON.parse(JSON.stringify(portfolio));
    cloned.scene.nodes = cloned.scene.nodes.filter((n: any) => n.id !== nodeId);
    setPortfolio(cloned);
    recordHistory(cloned, `Deleted 3D Node ${nodeId}`);
    setSelectedElement(null);
  };

  // Theme Color Updating
  const handleChangeThemeColor = (colorKey: string, hex: string) => {
    if (!portfolio) return;
    const cloned = JSON.parse(JSON.stringify(portfolio));
    cloned.design.colors[colorKey] = hex;
    setPortfolio(cloned);
    recordHistory(cloned, `Updated Theme Color (${colorKey})`);
  };

  // Theme Preset
  const handleApplyThemePreset = (presetKey: string) => {
    if (!portfolio) return;
    const cloned = JSON.parse(JSON.stringify(portfolio));
    const presetPalettes: Record<string, any> = {
      blue: { primary: "#38BDF8", accent: "#818CF8", background: "#02040A", surface: "#080E1E" },
      purple: { primary: "#00F0FF", accent: "#9D00FF", background: "#05070D", surface: "#0A0F20" },
      green: { primary: "#10B981", accent: "#34D399", background: "#030A06", surface: "#06140D" },
      orange: { primary: "#F59E0B", accent: "#F97316", background: "#0D0803", surface: "#1A1005" },
      red: { primary: "#F43F5E", accent: "#FB7185", background: "#09050C", surface: "#170E1F" },
      monochrome: { primary: "#FFFFFF", accent: "#94A3B8", background: "#0A0D14", surface: "#111622" },
    };

    if (presetPalettes[presetKey]) {
      cloned.design.colors = { ...cloned.design.colors, ...presetPalettes[presetKey] };
      setPortfolio(cloned);
      recordHistory(cloned, `Applied Theme Preset (${presetKey})`);
    }
  };

  // AI Prompt Execution
  const handleExecuteAIPrompt = async (prompt: string, previewOnly: boolean) => {
    if (!portfolio) return;
    try {
      const res = await fetch(`/api/builder/${portfolioId}/ai-edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, currentPortfolio: portfolio, previewOnly }),
      });
      const data = await res.json();
      if (data.success) {
        if (previewOnly) {
          setAiDiffPreview({
            prompt,
            explanation: data.explanation,
            operations: data.operations,
            updatedPortfolio: data.updatedPortfolio,
          });
        } else {
          setPortfolio(data.updatedPortfolio);
          recordHistory(data.updatedPortfolio, `AI Edit: ${prompt}`);
        }
      } else {
        alert(`AI Edit Failed: ${data.error}`);
      }
    } catch (e: any) {
      alert(`AI Edit Error: ${e.message}`);
    }
  };

  const handleAcceptAIDiff = () => {
    if (!aiDiffPreview) return;
    setPortfolio(aiDiffPreview.updatedPortfolio);
    recordHistory(aiDiffPreview.updatedPortfolio, `AI Edit: ${aiDiffPreview.prompt}`);
    setAiDiffPreview(null);
  };

  const handleRejectAIDiff = () => {
    setAiDiffPreview(null);
  };

  // Version Restore
  const handleRestoreVersion = async (versionId: string) => {
    try {
      const res = await fetch(`/api/builder/${portfolioId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (data.success && data.portfolio) {
        setPortfolio(data.portfolio);
        setVersions(data.versions);
        recordHistory(data.portfolio, `Restored Version ${versionId}`);
        alert("Portfolio successfully restored to chosen checkpoint!");
      }
    } catch (e) {
      console.error("Restore failed:", e);
    }
  };

  if (loading || !portfolio) {
    return (
      <div className="h-screen w-screen bg-[#04060C] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="font-mono text-xs">Loading 3D Visual Builder...</span>
      </div>
    );
  }

  const sectionsList = [
    { id: "hero", name: "Hero Header", visible: true, required: true },
    { id: "projects", name: "Projects Showcase", visible: true },
    { id: "experience", name: "Career Experience", visible: true },
    { id: "skills", name: "Skills Matrix", visible: true },
    { id: "contact", name: "Contact & Collaboration", visible: true },
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#04060C]">
      {/* Top Bar */}
      <BuilderTopBar
        portfolioTitle={portfolio.metadata.title}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < historyStack.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        deviceMode={deviceMode}
        onDeviceChange={setDeviceMode}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
        onSave={handleExplicitSave}
        onPublish={handlePublish}
        onOpenDomains={() => setIsDomainsModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onSharePreview={handleSharePreview}
        isSaving={isSaving}
        isDirty={isDirty}
        lastSavedAt={lastSavedAt}
        isPublished={isPublished}
        publishedUrl={publishedUrl}
      />


      {/* 3-Column Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Leftmost Sidebar Nav */}
        <BuilderSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Secondary Left Panel (Contextual sub-panel) */}
        {viewMode === "edit" && (
          <aside className="w-72 bg-[#050810] border-r border-white/10 flex flex-col shrink-0 overflow-y-auto select-none">
            {activeTab === "sections" && (
              <SectionManagerPanel
                sections={sectionsList}
                onReorder={handleReorderSections}
                onToggleVisibility={(id) => console.log("Toggle section:", id)}
                onDuplicate={(id) => console.log("Duplicate section:", id)}
                onDelete={(id) => console.log("Delete section:", id)}
                onSelectSection={(id) =>
                  setSelectedElement({
                    type: "section",
                    id,
                    displayName: id.toUpperCase(),
                  })
                }
                selectedSectionId={selectedElement?.id}
              />
            )}

            {activeTab === "assets" && (
              <AssetPalettePanel onAddAssetToScene={handleAddAssetToScene} />
            )}

            {activeTab === "theme" && (
              <ThemeEditorPanel
                theme={portfolio.design}
                onChangeThemeColor={handleChangeThemeColor}
                onApplyThemePreset={handleApplyThemePreset}
                onChangeTypography={(f, v) => {
                  const cloned = JSON.parse(JSON.stringify(portfolio));
                  cloned.design.typography[f] = v;
                  setPortfolio(cloned);
                  recordHistory(cloned, `Changed Typography (${f})`);
                }}
                onChangeMotion={(f, v) => {
                  const cloned = JSON.parse(JSON.stringify(portfolio));
                  cloned.design.animations[f] = v;
                  setPortfolio(cloned);
                  recordHistory(cloned, `Changed Motion (${f})`);
                }}
              />
            )}

            {activeTab === "ai" && (
              <AIAssistantPanel
                onExecuteAIPrompt={handleExecuteAIPrompt}
                onAcceptDiff={handleAcceptAIDiff}
                onRejectDiff={handleRejectAIDiff}
                diffPreview={aiDiffPreview}
              />
            )}

            {activeTab === "versions" && (
              <div className="p-4 space-y-3">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <History className="w-4 h-4 text-cyan-400" /> Version Checkpoints
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Named restore points created automatically or manually.
                  </p>
                </div>

                <div className="space-y-2">
                  {versions.map((ver) => (
                    <div
                      key={ver.id}
                      className="p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                          {ver.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(ver.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{ver.reason}</p>
                      <button
                        onClick={() => handleRestoreVersion(ver.id)}
                        className="w-full mt-1 py-1 px-2 rounded bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black text-[10px] font-mono font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" /> Restore Checkpoint
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Center: Live Responsive Canvas */}
        <LiveCanvasViewport
          portfolio={portfolio}
          deviceMode={deviceMode}
          viewMode={viewMode}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
          onSelectSceneNode={(nodeId) =>
            setSelectedElement({
              type: "scene-node",
              id: nodeId,
              displayName: nodeId,
            })
          }
        />

        {/* Right: Property Inspector (Hidden in full preview mode) */}
        {viewMode === "edit" && (
          <BuilderInspector
            selectedElement={selectedElement}
            portfolio={portfolio}
            onUpdateText={handleUpdateText}
            onUpdateSceneNode={handleUpdateSceneNode}
            onUpdateCamera={(updates) => {
              const cloned = JSON.parse(JSON.stringify(portfolio));
              cloned.scene.camera = { ...cloned.scene.camera, ...updates };
              setPortfolio(cloned);
              recordHistory(cloned, "Updated Camera");
            }}
            onUpdateLighting={(updates) => {
              const cloned = JSON.parse(JSON.stringify(portfolio));
              cloned.scene.lighting = { ...cloned.scene.lighting, ...updates };
              setPortfolio(cloned);
              recordHistory(cloned, "Updated Lighting");
            }}
            onDeleteSceneNode={handleDeleteSceneNode}
          />
        )}
      </div>

      {/* Publishing Modals */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        portfolioId={portfolioId}
        initialSlug={portfolio.metadata?.slug || ""}
        onOpenDomains={() => setIsDomainsModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />

      <DeploymentHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        portfolioId={portfolioId}
        onRollbackSuccess={async () => {
          setIsPublished(true);
          const res = await fetch(`/api/builder/${portfolioId}`);
          const data = await res.json();
          if (data.portfolio) setPortfolio(data.portfolio);
        }}
      />

      <CustomDomainModal
        isOpen={isDomainsModalOpen}
        onClose={() => setIsDomainsModalOpen(false)}
        portfolioId={portfolioId}
      />
    </div>
  );
}

