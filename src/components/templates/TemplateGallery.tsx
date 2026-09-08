"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getAllTemplatesAndPresets, TemplateDefinition, PresetCatalogItem } from "@zylo/templates";
import { SceneRenderer } from "@zylo/three-engine";
import {
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Box,
  Search,
  SlidersHorizontal,
  Eye,
  Layers,
  Flame,
  Swords,
} from "lucide-react";

export interface TemplateGalleryProps {
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  show3DPreviews?: boolean;
}

const CATEGORIES = [
  "All",
  "Anime & Character",
  "AI & Tech",
  "Space & Sci-Fi",
  "3D Creative",
  "Glassmorphism",
  "Developer & Cyber",
  "Corporate & Professional",
  "Architecture & Engineering",
  "Automotive & Mechanical",
  "Gaming & Interactive",
  "Experimental WebGL",
] as const;

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  show3DPreviews = true,
}) => {
  const allItems = useMemo(() => getAllTemplatesAndPresets(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredTemplates = useMemo(() => {
    return allItems.filter((tpl) => {
      const family = (tpl as any).family || tpl.category;
      const matchesCategory =
        selectedCategory === "All" ||
        family === selectedCategory ||
        tpl.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const tags: string[] = (tpl as any).tags || [];
      const matchesQuery =
        !query ||
        tpl.name.toLowerCase().includes(query) ||
        tpl.id.toLowerCase().includes(query) ||
        tpl.description.toLowerCase().includes(query) ||
        tpl.bestFor.toLowerCase().includes(query) ||
        tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [allItems, selectedCategory, searchQuery]);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "low":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Low Load • Ultra Fast
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Medium • Balanced
          </span>
        );
      case "high":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
            High • Rich WebGL
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-500/10 text-slate-400">
            Standard
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Meta */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Box className="w-7 h-7 text-zylo-cyan" />
            3D Template Architecture & Preset Catalog
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Explore {allItems.length} verified, configuration-driven 3D presets across 10+ core families — including Anime & Character, AI, Space, Glass, Cyber, and CAD architecture.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-zylo-cyan/10 text-zylo-cyan border border-zylo-cyan/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {allItems.length} Curated 3D Presets
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/10">
        {/* Top search & counter row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role (Anime, VTuber, AI, Space, Shader, CEO, CAD, Hypercar)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-zylo-cyan transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Showing <strong className="text-white">{filteredTemplates.length}</strong> of {allItems.length}</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-zylo-cyan text-black font-semibold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-white/10 bg-white/[0.01]">
          <Box className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No presets found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query or choosing another category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 px-4 py-2 rounded-lg text-xs bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => {
            const isSelected = selectedTemplateId.toLowerCase() === tpl.id.toLowerCase();
            const primaryColor = tpl.defaultTheme?.colors?.primary || "#00F0FF";
            const family = (tpl as any).family || tpl.category;
            const tags: string[] = (tpl as any).tags || [];

            return (
              <div
                key={tpl.id}
                className={`rounded-2xl overflow-hidden border transition-all flex flex-col justify-between group ${
                  isSelected
                    ? "border-zylo-cyan ring-2 ring-zylo-cyan/30 shadow-[0_0_35px_rgba(0,240,255,0.25)] bg-[#0C1222]"
                    : "border-white/10 bg-[#080D1A] hover:border-white/20 hover:bg-[#0E1528]"
                }`}
              >
                {/* Card 3D Preview Canvas */}
                <div className="relative w-full h-52 bg-gradient-to-b from-black/40 to-black/80 overflow-hidden border-b border-white/10">
                  {show3DPreviews ? (
                    <SceneRenderer
                      sceneConfig={tpl.defaultScene}
                      interactive={false}
                      autoRotate={true}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-slate-500">
                      3D Scene: {tpl.name}
                    </div>
                  )}

                  {/* Top overlay badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                      {family}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zylo-cyan text-black font-semibold flex items-center gap-1 shadow-md">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>

                  {/* Bottom preview info */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none text-[10px] font-mono text-slate-400 z-10">
                    <span>DPR: {tpl.performance.maxDpr}x</span>
                    <span>Particles: {tpl.performance.recommendedParticles}</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] shrink-0"
                          style={{ backgroundColor: primaryColor, color: primaryColor }}
                        />
                        <span className="line-clamp-1">{tpl.name}</span>
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">v{tpl.templateVersion}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>

                    <div className="pt-1">
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Best For:
                      </p>
                      <p className="text-xs font-medium text-slate-200 mt-0.5 line-clamp-2">
                        {tpl.bestFor}
                      </p>
                    </div>

                    {/* Tags Pills */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {tags.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] text-slate-400 border border-white/[0.06]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <div>{getTierBadge(tpl.performance.tier)}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectTemplate(tpl.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? "bg-zylo-cyan text-black font-semibold hover:bg-zylo-cyan/90"
                            : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Selected
                          </>
                        ) : (
                          "Use Preset"
                        )}
                      </button>

                      <Link
                        href={`/preview?template=${tpl.id}`}
                        target="_blank"
                        className="py-2 px-3 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
