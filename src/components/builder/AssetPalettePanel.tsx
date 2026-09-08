"use client";

import React, { useState } from "react";
import { getAllManifestAssets, AssetManifestEntry, AssetCategory } from "@zylo/three-engine";
import { Package, Plus, Sparkles, Box, ShieldCheck } from "lucide-react";

export interface AssetPalettePanelProps {
  onAddAssetToScene: (asset: AssetManifestEntry) => void;
}

export const AssetPalettePanel: React.FC<AssetPalettePanelProps> = ({
  onAddAssetToScene,
}) => {
  const allAssets = getAllManifestAssets();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "space", "technology", "abstract", "creative", "professional", "geometric"];

  const filteredAssets = selectedCategory === "all"
    ? allAssets
    : allAssets.filter((a) => a.category === selectedCategory);

  return (
    <div className="space-y-4 p-4">
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <Package className="w-4 h-4 text-cyan-400" />
          3D Asset Palette
        </h3>
        <p className="text-[11px] text-slate-400">
          Approved WebGL 3D meshes and models. Add directly to your active spatial scene.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition-all ${
              selectedCategory === cat
                ? "bg-cyan-500 text-black font-semibold shadow-sm"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 gap-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                <Box className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>

              <div>
                <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {asset.name}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="capitalize">{asset.category}</span>
                  <span>•</span>
                  <span>{asset.polyBudget.toLocaleString()} polys</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAddAssetToScene(asset)}
              className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black border border-cyan-500/20 transition-all shrink-0"
              title={`Add ${asset.name} to 3D Scene`}
              aria-label={`Add ${asset.name} to 3D Scene`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
