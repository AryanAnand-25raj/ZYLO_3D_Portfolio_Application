"use client";

import React from "react";
import { SelectedElement } from "@/modules/builder/types";
import { AIBuilderCommands, TextActionType } from "@/modules/builder/ai-commands";
import { SceneConfig, SceneMeshNode } from "@zylo/three-engine";
import {
  Sliders,
  Sparkles,
  Layers,
  Box,
  Camera,
  Sun,
  Activity,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Trash2,
} from "lucide-react";

export interface BuilderInspectorProps {
  selectedElement: SelectedElement | null;
  portfolio: any;
  onUpdateText: (path: string, newText: string) => void;
  onUpdateSceneNode: (nodeId: string, updates: Partial<SceneMeshNode>) => void;
  onUpdateCamera: (updates: Partial<SceneConfig["camera"]>) => void;
  onUpdateLighting: (updates: Partial<SceneConfig["lighting"]>) => void;
  onDeleteSceneNode?: (nodeId: string) => void;
}

export const BuilderInspector: React.FC<BuilderInspectorProps> = ({
  selectedElement,
  portfolio,
  onUpdateText,
  onUpdateSceneNode,
  onUpdateCamera,
  onUpdateLighting,
  onDeleteSceneNode,
}) => {
  if (!selectedElement || selectedElement.type === "none") {
    return (
      <aside className="w-80 bg-[#070B14] border-l border-white/10 p-5 select-none flex flex-col justify-center items-center text-center text-slate-500 shrink-0">
        <Sliders className="w-8 h-8 mb-3 opacity-40 text-cyan-400" />
        <h4 className="text-sm font-semibold text-slate-300">Property Inspector</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
          Select any text element, section, or 3D mesh in the canvas to inspect and edit its properties.
        </p>
      </aside>
    );
  }

  // Helper for text actions
  const handleAITextAction = (action: TextActionType, currentVal: string, path: string) => {
    const transformed = AIBuilderCommands.transformText(currentVal, action);
    onUpdateText(path, transformed);
  };

  // Find 3D node if selected
  const activeNode: SceneMeshNode | undefined =
    selectedElement.type === "scene-node"
      ? portfolio.scene?.nodes?.find((n: any) => n.id === selectedElement.id)
      : undefined;

  return (
    <aside className="w-80 bg-[#070B14] border-l border-white/10 p-5 select-none flex flex-col shrink-0 max-h-[calc(100vh-56px)] overflow-y-auto space-y-6">
      {/* Inspector Header */}
      <div className="border-b border-white/10 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
            {selectedElement.type}
          </span>
          <h3 className="text-sm font-bold text-white truncate max-w-[200px]">
            {selectedElement.displayName}
          </h3>
        </div>
        {selectedElement.type === "scene-node" && onDeleteSceneNode && (
          <button
            onClick={() => onDeleteSceneNode(selectedElement.id)}
            className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete 3D Object"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 1. TEXT / CONTENT INSPECTOR */}
      {selectedElement.type === "text" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
              Content String
            </label>
            <textarea
              rows={4}
              value={
                selectedElement.subfield === "headline"
                  ? portfolio.content.profile.headline
                  : selectedElement.subfield === "bio"
                  ? portfolio.content.profile.bio
                  : portfolio.content.profile.fullName
              }
              onChange={(e) => {
                const targetPath =
                  selectedElement.subfield === "headline"
                    ? "/content/profile/headline"
                    : selectedElement.subfield === "bio"
                    ? "/content/profile/bio"
                    : "/content/profile/fullName";
                onUpdateText(targetPath, e.target.value);
              }}
              className="w-full bg-black/40 border border-white/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* AI Content Directives */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> AI Content Actions
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              {(["improve", "shorten", "expand", "professional", "creative"] as TextActionType[]).map(
                (act) => {
                  const currentVal =
                    selectedElement.subfield === "headline"
                      ? portfolio.content.profile.headline
                      : portfolio.content.profile.bio;
                  const targetPath =
                    selectedElement.subfield === "headline"
                      ? "/content/profile/headline"
                      : "/content/profile/bio";

                  return (
                    <button
                      key={act}
                      onClick={() => handleAITextAction(act, currentVal, targetPath)}
                      className="p-1.5 rounded text-[11px] font-mono capitalize bg-white/5 hover:bg-cyan-500/15 hover:text-cyan-300 text-slate-300 border border-white/5 transition-all text-center"
                    >
                      {act}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. 3D MESH NODE INSPECTOR */}
      {selectedElement.type === "scene-node" && activeNode && (
        <div className="space-y-5 text-xs">
          {/* Position (X, Y, Z) */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block">
              Position Coordinates
            </span>
            <div className="grid grid-cols-3 gap-2">
              {["X", "Y", "Z"].map((axis, i) => (
                <div key={axis} className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500">{axis}</span>
                  <input
                    type="number"
                    step="0.2"
                    value={activeNode.position[i] || 0}
                    onChange={(e) => {
                      const newPos = [...activeNode.position] as [number, number, number];
                      newPos[i] = parseFloat(e.target.value) || 0;
                      onUpdateSceneNode(activeNode.id, { position: newPos });
                    }}
                    className="w-full bg-black/40 border border-white/15 rounded px-2 py-1 text-xs text-white font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                Uniform Scale
              </span>
              <span className="font-mono text-cyan-400">{activeNode.scale[0]}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.1"
              value={activeNode.scale[0] || 1}
              onChange={(e) => {
                const s = parseFloat(e.target.value) || 1;
                onUpdateSceneNode(activeNode.id, { scale: [s, s, s] });
              }}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Material Properties */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block">
              Material Surface
            </span>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Base Color</span>
              <input
                type="color"
                value={activeNode.materialProps.color || "#00F0FF"}
                onChange={(e) => {
                  onUpdateSceneNode(activeNode.id, {
                    materialProps: { ...activeNode.materialProps, color: e.target.value },
                  });
                }}
                className="w-6 h-6 rounded border border-white/20 bg-transparent cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Roughness</span>
                <span className="text-slate-200">{activeNode.materialProps.roughness}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={activeNode.materialProps.roughness ?? 0.2}
                onChange={(e) => {
                  onUpdateSceneNode(activeNode.id, {
                    materialProps: {
                      ...activeNode.materialProps,
                      roughness: parseFloat(e.target.value),
                    },
                  });
                }}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Metalness</span>
                <span className="text-slate-200">{activeNode.materialProps.metalness}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={activeNode.materialProps.metalness ?? 0.8}
                onChange={(e) => {
                  onUpdateSceneNode(activeNode.id, {
                    materialProps: {
                      ...activeNode.materialProps,
                      metalness: parseFloat(e.target.value),
                    },
                  });
                }}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          {/* Animation Properties */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block">
              Procedural Animation
            </span>

            <div>
              <span className="text-slate-400 text-[11px] block mb-1">Motion Type</span>
              <select
                value={activeNode.animation.type || "rotate"}
                onChange={(e) => {
                  onUpdateSceneNode(activeNode.id, {
                    animation: { ...activeNode.animation, type: e.target.value as any },
                  });
                }}
                className="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white"
              >
                {["rotate", "float", "pulse", "orbit", "sway", "none"].map((t) => (
                  <option key={t} value={t} className="bg-[#0B101E]">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Speed</span>
                <span className="text-slate-200">{activeNode.animation.speed}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={activeNode.animation.speed ?? 0.5}
                onChange={(e) => {
                  onUpdateSceneNode(activeNode.id, {
                    animation: {
                      ...activeNode.animation,
                      speed: parseFloat(e.target.value),
                    },
                  });
                }}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. CAMERA CONTROLS */}
      {selectedElement.type === "camera" && (
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Field of View (FOV)</span>
              <span className="text-cyan-400">{portfolio.scene?.camera?.fov || 45}°</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="1"
              value={portfolio.scene?.camera?.fov || 45}
              onChange={(e) => {
                onUpdateCamera({ fov: parseInt(e.target.value, 10) });
              }}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Auto Rotate Speed</span>
              <span className="text-slate-200">
                {portfolio.scene?.camera?.controls?.autoRotateSpeed || 0.5}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={portfolio.scene?.camera?.controls?.autoRotateSpeed || 0.5}
              onChange={(e) => {
                onUpdateCamera({
                  controls: {
                    ...portfolio.scene?.camera?.controls,
                    autoRotateSpeed: parseFloat(e.target.value),
                  },
                });
              }}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>
      )}

      {/* 4. LIGHTING CONTROLS */}
      {selectedElement.type === "lighting" && (
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Ambient Intensity</span>
              <span className="text-cyan-400">
                {portfolio.scene?.lighting?.ambientIntensity || 0.4}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={portfolio.scene?.lighting?.ambientIntensity || 0.4}
              onChange={(e) => {
                onUpdateLighting({ ambientIntensity: parseFloat(e.target.value) });
              }}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>
      )}
    </aside>
  );
};
