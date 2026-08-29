"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SceneRenderer } from "@zylo/three-engine";
import { SCENE_PRESETS } from "@/modules/scene";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Play, RotateCw } from "lucide-react";

export const HeroSection: React.FC = () => {
  const [activePresetKey, setActivePresetKey] = useState<string>("cyber-dimension");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const currentScene = SCENE_PRESETS[activePresetKey] || SCENE_PRESETS["cyber-dimension"];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-zylo-cyan/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-zylo-purple/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="container max-w-7xl px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Prop & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6 text-left">
            <Badge variant="cyan" className="gap-2 px-3 py-1 text-xs">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen 3D WebGL Portfolio SaaS
            </Badge>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Transform your work into an{" "}
              <span className="text-gradient">Interactive 3D Dimension</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              ZYLO synthesizes your career narrative into high-performance, real-time WebGL
              portfolios. Driven by Three.js, React Three Fiber, and strictly sandboxed declarative
              scene configurations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link href="/dashboard">
                <Button variant="glow" size="lg" className="gap-2.5 w-full sm:w-auto">
                  Launch Studio <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <Cpu className="w-4 h-4 text-zylo-cyan" /> View Architecture
                </Button>
              </Link>
            </div>

            {/* Architecture Highlights Pill */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-t border-zylo-border w-full">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zylo-emerald" />
                <span>Zero arbitrary JS execution</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-zylo-cyan" />
                <span>Hardware-adaptive DPR</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive 3D Canvas Showcase */}
          <div className="lg:col-span-6 relative w-full h-[480px] sm:h-[540px] flex items-center justify-center">
            <div className="w-full h-full rounded-2xl glass-panel relative overflow-hidden border border-zylo-border shadow-2xl flex flex-col">
              {/* Canvas Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zylo-border bg-zylo-surface/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-mono ml-2">
                    @zylo/three-engine: {currentScene.name}
                  </span>
                </div>

                {/* Preset Switcher & Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-colors ${
                      autoRotate
                        ? "bg-zylo-cyan/10 border-zylo-cyan/40 text-zylo-cyan"
                        : "bg-white/5 border-zylo-border text-slate-400 hover:text-white"
                    }`}
                    title="Toggle Auto Rotation"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex bg-black/40 rounded-md p-0.5 border border-zylo-border">
                    <button
                      onClick={() => setActivePresetKey("cyber-dimension")}
                      className={`px-2.5 py-1 text-xs rounded transition-all ${
                        activePresetKey === "cyber-dimension"
                          ? "bg-zylo-elevated text-zylo-cyan shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Cyber
                    </button>
                    <button
                      onClick={() => setActivePresetKey("crystal-matrix")}
                      className={`px-2.5 py-1 text-xs rounded transition-all ${
                        activePresetKey === "crystal-matrix"
                          ? "bg-zylo-elevated text-zylo-cyan shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Crystal
                    </button>
                  </div>
                </div>
              </div>

              {/* 3D Scene Viewport */}
              <div className="relative flex-1 w-full h-full bg-gradient-to-b from-zylo-surface/40 to-zylo-dark/90">
                <SceneRenderer
                  sceneConfig={currentScene}
                  interactive={true}
                  autoRotate={autoRotate}
                  className="w-full h-full"
                />

                {/* Floating Interactive HUD Overlay */}
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex items-center justify-between z-20">
                  <div className="glass-panel px-3 py-1.5 rounded-lg text-[11px] text-slate-300 font-mono flex items-center gap-2 border-zylo-border pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-zylo-emerald animate-ping" />
                    <span>Real-Time WebGL • 60 FPS</span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
                    Drag to Orbit • Hover to Inspect
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
