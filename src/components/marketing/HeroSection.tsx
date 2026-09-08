"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SceneRenderer } from "@zylo/three-engine";
import { SCENE_PRESETS } from "@/modules/scene";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  RotateCw,
  Compass,
  Layers,
  Zap,
  Activity,
  Box,
  Eye,
} from "lucide-react";

export const HeroSection: React.FC = () => {
  const [activePresetKey, setActivePresetKey] = useState<string>("anime-dimension");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);

  const baseScene = SCENE_PRESETS[activePresetKey] || SCENE_PRESETS["anime-dimension"];

  // Dynamically apply wireframe mode if toggled
  const currentScene = React.useMemo(() => {
    if (!wireframeMode) return baseScene;
    return {
      ...baseScene,
      nodes: baseScene.nodes.map((node) => ({
        ...node,
        materialProps: {
          ...node.materialProps,
          wireframe: true,
        },
      })),
    };
  }, [baseScene, wireframeMode]);

  const presetConfig = [
    { key: "anime-dimension", label: "Anime 3D", icon: "🌸", color: "text-pink-400 border-pink-500/40 bg-pink-500/10" },
    { key: "cyber-dimension", label: "Cyber Core", icon: "⚡", color: "text-zylo-cyan border-zylo-cyan/40 bg-zylo-cyan/10" },
    { key: "crystal-matrix", label: "Crystal Prism", icon: "💎", color: "text-purple-400 border-purple-500/40 bg-purple-500/10" },
    { key: "space-orbit", label: "Space Orbit", icon: "🪐", color: "text-sky-400 border-sky-500/40 bg-sky-500/10" },
    { key: "cad-architecture", label: "CAD Structure", icon: "🏛️", color: "text-amber-400 border-amber-500/40 bg-amber-500/10" },
  ];

  return (
    <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden pt-8 pb-16">
      {/* Dynamic 3D Spatial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-zylo-cyan/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[550px] h-[550px] bg-zylo-purple/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-pink-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Interactive 3D Perspective Grid Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 240, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.08) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          transform: "perspective(1000px) rotateX(60deg) translateY(-80px)",
          transformOrigin: "top center",
        }}
      />

      <div className="container max-w-7xl px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Spatial Value Prop & CTAs */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-zylo-cyan/30 text-xs font-mono text-zylo-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-zylo-cyan animate-ping" />
              <span>Spatial WebGL & 3D Portfolio Platform</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Render your world in{" "}
              <span className="text-gradient">Real-Time 3D</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Experience the web in true depth. ZYLO renders anime characters, spatial AI nodes,
              aerospace orbital stations, and architectural CAD models into lightweight 60 FPS WebGL
              portfolios without writing 3D shader code.
            </p>

            {/* Dimension Selection Pills */}
            <div className="space-y-2 w-full pt-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-zylo-cyan" /> Switch 3D Dimension:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presetConfig.map((p) => {
                  const isActive = activePresetKey === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setActivePresetKey(p.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isActive
                          ? `${p.color} shadow-lg font-semibold scale-105`
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
              <Link href="/register">
                <Button variant="glow" size="lg" className="gap-2.5 w-full sm:w-auto font-semibold">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto text-slate-300 hover:text-white border-white/20">
                  <Sparkles className="w-4 h-4 text-zylo-cyan" /> Explore 100+ Templates
                </Button>
              </Link>
              <Link href="/3d-test" className="hidden xl:inline-flex">
                <Button variant="ghost" size="lg" className="gap-1.5 text-xs text-slate-400 hover:text-white font-mono">
                  <Cpu className="w-4 h-4 text-emerald-400" /> Live 3D Testbed
                </Button>
              </Link>
            </div>

            {/* Stat Counters / Live Guarantee */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zylo-border w-full text-xs font-mono">
              <div>
                <div className="text-white font-bold text-base sm:text-lg">100+</div>
                <div className="text-slate-400 text-[11px]">3D Presets</div>
              </div>
              <div>
                <div className="text-cyan-400 font-bold text-base sm:text-lg">60 FPS</div>
                <div className="text-slate-400 text-[11px]">WebGL Engine</div>
              </div>
              <div>
                <div className="text-emerald-400 font-bold text-base sm:text-lg">0 Arbitrary JS</div>
                <div className="text-slate-400 text-[11px]">Sandboxed Safe</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive 3D Spatial Stage */}
          <div id="interactive-demo" className="lg:col-span-7 relative w-full h-[520px] sm:h-[600px] flex items-center justify-center">
            <div className="w-full h-full rounded-3xl glass-panel relative overflow-hidden border border-zylo-border shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col backdrop-blur-2xl">
              {/* Canvas Command Header Bar */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-zylo-border bg-zylo-surface/85 backdrop-blur-xl z-20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs text-white font-mono font-medium ml-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-zylo-cyan animate-pulse" />
                    <span>@zylo/three-engine: {currentScene.name}</span>
                  </span>
                </div>

                {/* 3D Viewport Controls HUD */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWireframeMode(!wireframeMode)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
                      wireframeMode
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-sm"
                        : "bg-white/5 border-zylo-border text-slate-400 hover:text-white"
                    }`}
                    title="Toggle 3D Wireframe Mode"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Wireframe</span>
                  </button>

                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
                      autoRotate
                        ? "bg-zylo-cyan/15 border-zylo-cyan/40 text-zylo-cyan shadow-sm"
                        : "bg-white/5 border-zylo-border text-slate-400 hover:text-white"
                    }`}
                    title="Toggle Orbital Rotation"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "12s" }} />
                    <span className="hidden sm:inline">Orbit: {autoRotate ? "ON" : "PAUSED"}</span>
                  </button>
                </div>
              </div>

              {/* 3D Scene Viewport */}
              <div className="relative flex-1 w-full h-full bg-gradient-to-b from-zylo-surface/30 via-zylo-dark/70 to-zylo-dark/95">
                <SceneRenderer
                  sceneConfig={currentScene}
                  interactive={true}
                  autoRotate={autoRotate}
                  className="w-full h-full"
                />

                {/* Top-Right Theme Telemetry Badge */}
                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                  {activePresetKey === "anime-dimension" && (
                    <div className="glass-panel px-3 py-1.5 rounded-lg border border-pink-500/40 text-[11px] font-mono text-pink-300 shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                      <span>Lv.99 SPECIAL GRADE // CEL-SHADED</span>
                    </div>
                  )}
                  {activePresetKey === "cyber-dimension" && (
                    <div className="glass-panel px-3 py-1.5 rounded-lg border border-cyan-500/40 text-[11px] font-mono text-cyan-300 shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>CYBER DAMPING 0.05 // 120HZ</span>
                    </div>
                  )}
                  {activePresetKey === "crystal-matrix" && (
                    <div className="glass-panel px-3 py-1.5 rounded-lg border border-purple-500/40 text-[11px] font-mono text-purple-300 shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      <span>REFRACTION IOR: 1.54 // DISPERSION</span>
                    </div>
                  )}
                  {activePresetKey === "space-orbit" && (
                    <div className="glass-panel px-3 py-1.5 rounded-lg border border-sky-500/40 text-[11px] font-mono text-sky-300 shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      <span>APOGEE: 42,164 KM // LOW-EARTH ORBIT</span>
                    </div>
                  )}
                  {activePresetKey === "cad-architecture" && (
                    <div className="glass-panel px-3 py-1.5 rounded-lg border border-amber-500/40 text-[11px] font-mono text-amber-300 shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>BIM STRUCTURE // TOLERANCE: ±0.02MM</span>
                    </div>
                  )}
                </div>

                {/* Floating Interactive Bottom HUD Overlay */}
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex items-center justify-between z-20">
                  <div className="glass-panel px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-mono flex items-center gap-2.5 border border-white/10 pointer-events-auto shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-zylo-emerald animate-ping" />
                    <span className="font-semibold text-white">WebGL 2.0 • 60 FPS</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">Post-FX Bloom & Ambient Light</span>
                  </div>

                  <div className="glass-panel px-3 py-1.5 rounded-xl text-[11px] text-slate-400 font-mono hidden sm:flex items-center gap-2 border border-white/10 pointer-events-auto">
                    <Eye className="w-3.5 h-3.5 text-zylo-cyan" />
                    <span>Drag to Orbit • Scroll to Zoom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
