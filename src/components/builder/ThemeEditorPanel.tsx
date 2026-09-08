"use client";

import React from "react";
import { Palette, Sparkles, Type, Activity } from "lucide-react";

export interface ThemeEditorPanelProps {
  theme: Record<string, any>;
  onChangeThemeColor: (colorKey: string, hex: string) => void;
  onApplyThemePreset: (presetKey: string) => void;
  onChangeTypography: (field: string, value: any) => void;
  onChangeMotion: (field: string, value: any) => void;
}

export const ThemeEditorPanel: React.FC<ThemeEditorPanelProps> = ({
  theme,
  onChangeThemeColor,
  onApplyThemePreset,
  onChangeTypography,
  onChangeMotion,
}) => {
  const colors = theme.colors || {};
  const typography = theme.typography || {};
  const animations = theme.animations || {};

  const presets = [
    { key: "blue", label: "Orbit Blue", primary: "#38BDF8", accent: "#818CF8", bg: "#02040A" },
    { key: "purple", label: "Neon Cyber", primary: "#00F0FF", accent: "#9D00FF", bg: "#05070D" },
    { key: "green", label: "Emerald Matrix", primary: "#10B981", accent: "#34D399", bg: "#030A06" },
    { key: "orange", label: "Warm Sunset", primary: "#F59E0B", accent: "#F97316", bg: "#0D0803" },
    { key: "red", label: "Creative Rose", primary: "#F43F5E", accent: "#FB7185", bg: "#09050C" },
    { key: "monochrome", label: "Minimal Slate", primary: "#FFFFFF", accent: "#94A3B8", bg: "#0A0D14" },
  ];

  const fontFamilies = [
    "Inter",
    "Outfit",
    "Space Grotesk",
    "Plus Jakarta Sans",
    "JetBrains Mono",
    "Syne",
    "Clash Display",
  ];

  return (
    <div className="space-y-6 p-4 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
      {/* Header */}
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          Theme & Design Tokens
        </h3>
        <p className="text-[11px] text-slate-400">
          Customize visual styling, HSL colors, typography, and motion dynamics.
        </p>
      </div>

      {/* Preset Palettes */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
          Preset Palettes
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.key}
              onClick={() => onApplyThemePreset(preset.key)}
              className="p-2 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] flex items-center gap-2 transition-all text-left"
            >
              <div className="flex -space-x-1 shrink-0">
                <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: preset.primary }} />
                <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: preset.accent }} />
              </div>
              <span className="text-[11px] font-medium text-slate-200 truncate">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Individual Color Pickers */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
          Custom Color Tokens
        </label>

        <div className="space-y-2.5">
          {[
            { key: "primary", label: "Primary Glow" },
            { key: "accent", label: "Accent Color" },
            { key: "secondary", label: "Secondary Light" },
            { key: "background", label: "Canvas Background" },
            { key: "surface", label: "Card Surface" },
            { key: "textPrimary", label: "Heading Text" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300">{label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors[key] || "#00F0FF"}
                  onChange={(e) => onChangeThemeColor(key, e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border border-white/20 bg-transparent p-0"
                />
                <span className="font-mono text-[11px] text-slate-400 w-16 uppercase">
                  {colors[key] || "#00F0FF"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-cyan-400" />
          Curated Typography
        </label>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block mb-1">Heading Font</span>
            <select
              value={typography.headingFontFamily || "Outfit"}
              onChange={(e) => onChangeTypography("headingFontFamily", e.target.value)}
              className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font} className="bg-[#0B101E]">
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block mb-1">Body Font</span>
            <select
              value={typography.fontFamily || "Inter"}
              onChange={(e) => onChangeTypography("fontFamily", e.target.value)}
              className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font} className="bg-[#0B101E]">
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Motion & Transition Intensity */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Motion Settings
        </label>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Reduced Motion (A11y)</span>
            <input
              type="checkbox"
              checked={Boolean(animations.reducedMotion)}
              onChange={(e) => onChangeMotion("reducedMotion", e.target.checked)}
              className="rounded accent-cyan-400"
            />
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block mb-1">Transition Speed</span>
            <select
              value={animations.transitionSpeed || "normal"}
              onChange={(e) => onChangeMotion("transitionSpeed", e.target.value)}
              className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              <option value="slow" className="bg-[#0B101E]">Subtle (Slow)</option>
              <option value="normal" className="bg-[#0B101E]">Medium (Normal)</option>
              <option value="fast" className="bg-[#0B101E]">Cinematic (Fast)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
