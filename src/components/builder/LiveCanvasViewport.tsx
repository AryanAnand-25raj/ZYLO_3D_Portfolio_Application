"use client";

import React, { useState } from "react";
import { PortfolioRenderer } from "@/components/templates/PortfolioRenderer";
import { PortfolioData } from "@/schemas/portfolio.schema";
import { DeviceMode, SelectedElement } from "@/modules/builder/types";
import { AlertTriangle, Cpu, Zap, Sparkles } from "lucide-react";

export interface LiveCanvasViewportProps {
  portfolio: PortfolioData;
  deviceMode: DeviceMode;
  viewMode: "edit" | "preview";
  selectedElement: SelectedElement | null;
  onSelectElement: (elem: SelectedElement) => void;
  onSelectSceneNode: (nodeId: string) => void;
}

export const LiveCanvasViewport: React.FC<LiveCanvasViewportProps> = ({
  portfolio,
  deviceMode,
  viewMode,
  selectedElement,
  onSelectElement,
  onSelectSceneNode,
}) => {
  // Device viewport width simulation
  const getViewportWidthStyle = () => {
    switch (deviceMode) {
      case "mobile":
        return "w-[390px] h-[844px] rounded-[36px] shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[8px] border-slate-800";
      case "tablet":
        return "w-[768px] h-[1024px] rounded-[24px] shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[6px] border-slate-800";
      case "desktop":
      default:
        return "w-full min-h-full";
    }
  };

  const isMobile = deviceMode === "mobile";
  const sceneNodesCount = portfolio.scene?.nodes?.length || 0;
  const isHeavyForMobile = isMobile && sceneNodesCount > 8;

  return (
    <div className="relative flex-1 bg-[#030509] overflow-auto flex flex-col items-center p-4 sm:p-6 select-none">
      {/* Viewport Top HUD: Performance profile & Device Status */}
      <div className="w-full max-w-5xl flex items-center justify-between pb-3 px-2 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>
              {deviceMode === "desktop"
                ? "Profile: Ultra / High DPR (2.0x)"
                : deviceMode === "tablet"
                ? "Profile: Medium (1.5x)"
                : "Profile: Mobile Adaptive (1.0x)"}
            </span>
          </div>

          {isMobile && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Mobile optimization active
            </span>
          )}
        </div>

        {/* 3D Scene quick-selector tags in Editor Mode */}
        {viewMode === "edit" && portfolio.scene?.nodes && (
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-slate-500">3D Objects:</span>
            {portfolio.scene.nodes.slice(0, 4).map((node: any) => {
              const isSelected = selectedElement?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() =>
                    onSelectElement({
                      type: "scene-node",
                      id: node.id,
                      displayName: node.componentType,
                    })
                  }
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                    isSelected
                      ? "bg-cyan-500 text-black font-bold"
                      : "bg-white/5 hover:bg-white/10 text-slate-300"
                  }`}
                >
                  {node.componentType}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Performance alert for mobile if scene has many meshes */}
      {isHeavyForMobile && (
        <div className="mb-4 max-w-xl w-full p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>This scene contains {sceneNodesCount} 3D objects and may reduce frame rates on low-end mobile.</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 rounded">
            Optimization Recommended
          </span>
        </div>
      )}

      {/* Responsive Canvas Frame Container */}
      <div
        className={`transition-all duration-300 relative overflow-hidden bg-black ${getViewportWidthStyle()}`}
      >
        {/* Editor Interactive Overlay Layer: Click on items to select in inspector */}
        {viewMode === "edit" && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Clickable Overlay for Hero Title */}
            <div
              onClick={() =>
                onSelectElement({
                  type: "text",
                  id: "hero-headline",
                  subfield: "headline",
                  displayName: "Hero Headline",
                })
              }
              className={`absolute top-28 left-6 sm:left-12 max-w-lg p-2 rounded-lg pointer-events-auto cursor-pointer transition-all border-2 border-dashed ${
                selectedElement?.id === "hero-headline"
                  ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                  : "border-transparent hover:border-white/30"
              }`}
              title="Click to edit Hero Headline in Inspector"
            >
              <div className="opacity-0 hover:opacity-100 transition-opacity absolute -top-5 left-1 text-[10px] font-mono bg-cyan-500 text-black font-semibold px-1.5 rounded">
                Edit Headline
              </div>
            </div>

            {/* Clickable Overlay for Camera Controls */}
            <button
              onClick={() =>
                onSelectElement({
                  type: "camera",
                  id: "camera",
                  displayName: "Scene Camera",
                })
              }
              className="absolute top-4 right-4 pointer-events-auto p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 hover:border-cyan-400 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Camera Setup</span>
            </button>
          </div>
        )}

        {/* The Exact Production PortfolioRenderer */}
        <PortfolioRenderer
          template={portfolio.metadata.slug || "orbit"}
          profile={portfolio.content.profile}
          content={portfolio.content}
          theme={portfolio.design}
          scene={portfolio.scene as any}
          interactive={viewMode === "preview"}
          enable3D={true}
          className="w-full h-full min-h-full"
        />
      </div>
    </div>
  );
};
