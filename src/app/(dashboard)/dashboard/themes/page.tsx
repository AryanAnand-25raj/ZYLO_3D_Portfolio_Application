"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { THEME_PRESETS } from "@/modules/design";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Sparkles,
  Sliders,
  Check,
  ArrowRight,
  Eye,
  Type,
  Layers,
} from "lucide-react";

export default function ThemeEditorPage() {
  const [selectedThemeId, setSelectedThemeId] = useState<string>("neon-cyber");
  const [blurIntensity, setBlurIntensity] = useState<number>(20);
  const [opacity, setOpacity] = useState<number>(0.75);

  const activePreset = THEME_PRESETS[selectedThemeId] || Object.values(THEME_PRESETS)[0];

  return (
    <div className="flex-1 flex flex-col pb-16">
      <DashboardHeader
        title="Theme & Style Editor"
        subtitle="Manage color palettes, typography scales, glassmorphism tokens, and micro-animations."
      />

      <main className="flex-1 px-8 py-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Preset Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.entries(THEME_PRESETS).map(([key, theme]) => {
            const isSelected = selectedThemeId === key;
            const primary = theme.colors.primary;
            const accent = theme.colors.accent;

            return (
              <Card
                key={key}
                onClick={() => setSelectedThemeId(key)}
                className={`p-5 cursor-pointer transition-all border ${
                  isSelected
                    ? "border-zylo-cyan ring-2 ring-zylo-cyan/30 shadow-[0_0_25px_rgba(0,240,255,0.2)] bg-[#0E1528]"
                    : "border-zylo-border bg-zylo-surface/60 hover:bg-zylo-surface hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{theme.name}</span>
                  {isSelected && (
                    <Badge variant="cyan" className="text-[10px] py-0 px-1.5 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Active
                    </Badge>
                  )}
                </div>

                {/* Color Swatch Bar */}
                <div className="flex items-center gap-2 mt-4">
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: primary }}
                    title={`Primary: ${primary}`}
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title={`Secondary: ${theme.colors.secondary}`}
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: accent }}
                    title={`Accent: ${accent}`}
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow-sm ml-auto"
                    style={{ backgroundColor: theme.colors.background }}
                    title={`Background: ${theme.colors.background}`}
                  />
                </div>

                <div className="mt-3 text-[11px] text-slate-400 font-mono">
                  Variant: <span className="text-slate-200 capitalize">{theme.variant}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Live Theme Preview Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mock Interactive Portfolio Card */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-sm font-heading font-semibold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-zylo-cyan" /> Real-time Theme Rendering Simulation
            </h3>

            <div
              className="p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden space-y-6"
              style={{
                backgroundColor: activePreset.colors.background,
                borderColor: activePreset.colors.border,
                boxShadow: `0 0 50px ${activePreset.colors.glowColor}`,
              }}
            >
              {/* Background Ambient Glow */}
              <div
                className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-60"
                style={{ backgroundColor: activePreset.colors.primary }}
              />

              {/* Mock Hero Header */}
              <div className="relative z-10 space-y-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-semibold inline-block"
                  style={{
                    backgroundColor: `${activePreset.colors.primary}20`,
                    color: activePreset.colors.primary,
                    border: `1px solid ${activePreset.colors.primary}40`,
                  }}
                >
                  Active Theme: {activePreset.name}
                </span>

                <h1
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                  style={{
                    fontFamily: activePreset.typography.headingFontFamily,
                    color: activePreset.colors.textPrimary,
                  }}
                >
                  Alex Vance — <span style={{ color: activePreset.colors.primary }}>Spatial WebGL Architect</span>
                </h1>

                <p
                  className="text-sm leading-relaxed max-w-xl"
                  style={{ color: activePreset.colors.textMuted }}
                >
                  Synthesizing computational design, high-frequency WebGL shaders, and multi-agent AI systems into interactive portfolios.
                </p>
              </div>

              {/* Simulated Glass Panel */}
              <div
                className="p-6 rounded-2xl transition-all relative z-10 space-y-4"
                style={{
                  backgroundColor: `${activePreset.colors.surface}`,
                  backdropFilter: `blur(${blurIntensity}px)`,
                  opacity: opacity,
                  border: `1px solid ${activePreset.colors.border}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Glassmorphism Token Preview
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: activePreset.colors.accent }}
                  />
                </div>

                <p className="text-xs text-slate-200">
                  Real-time glass depth test with dynamic blur intensity ({blurIntensity}px) and surface transmission ({Math.round(opacity * 100)}%).
                </p>

                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-bold text-black shadow-lg transition-transform hover:scale-105"
                    style={{ backgroundColor: activePreset.colors.primary }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
                    style={{
                      borderColor: activePreset.colors.border,
                      color: activePreset.colors.textPrimary,
                    }}
                  >
                    Secondary Action
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl glass-panel border border-zylo-border">
              <span className="text-xs text-slate-300">
                Ready to apply this theme to your live 3D portfolio?
              </span>
              <Link href="/builder/port-demo-1">
                <Button variant="glow" size="sm" className="gap-2 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Open in Visual Builder
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Tokens & Sliders */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="glass-panel border-zylo-border p-5 space-y-4">
              <CardTitle className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zylo-cyan" /> Glass Tokens
              </CardTitle>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Backdrop Blur</span>
                    <span className="font-mono text-zylo-cyan">{blurIntensity}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    value={blurIntensity}
                    onChange={(e) => setBlurIntensity(Number(e.target.value))}
                    className="w-full accent-zylo-cyan cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Surface Opacity</span>
                    <span className="font-mono text-zylo-cyan">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="1.0"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-zylo-cyan cursor-pointer"
                  />
                </div>
              </div>
            </Card>

            <Card className="glass-panel border-zylo-border p-5 space-y-3">
              <CardTitle className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-zylo-purple" /> Typography Pairing
              </CardTitle>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex justify-between">
                  <span className="text-slate-400">Headings:</span>
                  <span className="font-bold text-white font-mono">
                    {activePreset.typography.headingFontFamily}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex justify-between">
                  <span className="text-slate-400">Body Font:</span>
                  <span className="font-bold text-white font-mono">
                    {activePreset.typography.fontFamily}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
