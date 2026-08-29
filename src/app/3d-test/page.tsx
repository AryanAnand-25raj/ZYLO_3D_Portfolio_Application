"use client";

import React, { useState } from "react";
import {
  SceneRenderer,
  ORBIT_SCENE_TEMPLATE,
  NEURAL_SCENE_TEMPLATE,
  GLASS_SCENE_TEMPLATE,
  CREATIVE_SCENE_TEMPLATE,
  MINIMAL_SCENE_TEMPLATE,
  HEAVY_SCENE_TEMPLATE,
  PerformanceTier,
} from "@zylo/three-engine";
import { Sparkles, Eye, ShieldAlert, Zap, Layers, RefreshCw, Smartphone, Monitor } from "lucide-react";

export default function ThreeTestPage() {
  const [activeTemplateKey, setActiveTemplateKey] = useState<
    "orbit" | "neural" | "glass" | "creative" | "minimal" | "heavy"
  >("orbit");
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>("high");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [debugHud, setDebugHud] = useState(true);

  const templates = {
    orbit: { name: "Orbit Exoplanet", config: ORBIT_SCENE_TEMPLATE, tag: "Default Demo" },
    neural: { name: "Neural Vortex", config: NEURAL_SCENE_TEMPLATE, tag: "Particles & Nodes" },
    glass: { name: "Glass Refraction", config: GLASS_SCENE_TEMPLATE, tag: "Physical Shaders" },
    creative: { name: "Creative Cluster", config: CREATIVE_SCENE_TEMPLATE, tag: "Kinetic Geometry" },
    minimal: { name: "Minimalist Torus", config: MINIMAL_SCENE_TEMPLATE, tag: "Subtle Sculptural" },
    heavy: { name: "Heavy Stress Test", config: HEAVY_SCENE_TEMPLATE, tag: "20 Nodes Clamping" },
  };

  const currentConfig = templates[activeTemplateKey].config;

  return (
    <main className="relative min-h-screen bg-[#030712] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 3D Background Runtime Enhancement Layer */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <SceneRenderer
          sceneConfig={currentConfig}
          className="w-full h-full"
          performanceTier={performanceTier}
          reducedMotion={reducedMotion}
          debug={debugHud}
          forceFallback={simulateError}
        />
      </div>

      {/* HTML Semantic UI Content Layer */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen max-w-7xl mx-auto w-full p-6 md:p-12 pointer-events-none">
        {/* Navigation / Header */}
        <header className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 border border-white/20">
              Z
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-lg">ZYLO</span>
              <span className="ml-2 text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                3D Engine Testbed
              </span>
            </div>
          </div>

          <a
            href="/create"
            className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg border border-white/10 transition-colors"
          >
            ← Back to Onboarding
          </a>
        </header>

        {/* Hero Section */}
        <div className="my-auto py-12 max-w-2xl pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Declarative WebGL • React Three Fiber • Zero Arbitrary Code</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Interactive <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">3D Runtime</span> Engine
          </h1>

          <p className="text-base md:text-lg text-zinc-300 mb-8 leading-relaxed">
            Every portfolio features a decoupled, schema-validated Three.js scene layer rendered seamlessly behind indexable semantic HTML.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-xl">
            <div>
              <div className="text-xs text-zinc-400 font-mono">Current Scene</div>
              <div className="text-sm font-bold text-cyan-300 truncate">{templates[activeTemplateKey].name}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Performance Tier</div>
              <div className="text-sm font-bold text-emerald-400 uppercase">{performanceTier}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Accessibility</div>
              <div className="text-sm font-bold text-purple-300">{reducedMotion ? "Reduced Motion" : "Full Kinetic"}</div>
            </div>
          </div>
        </div>

        {/* Interactive Controls Drawer (Bottom) */}
        <div className="pointer-events-auto bg-zinc-950/85 backdrop-blur-2xl border border-white/15 p-5 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mt-8">
          {/* Template Switcher */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Select Template Preset:
            </span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(templates) as Array<keyof typeof templates>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTemplateKey(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                    activeTemplateKey === key
                      ? "bg-cyan-500 text-black border-cyan-400 font-bold shadow-lg shadow-cyan-500/30"
                      : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700"
                  }`}
                >
                  {templates[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* Engine Stress & Fallback Toggles */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Performance Tier Toggle */}
            <button
              onClick={() => {
                const tiers: PerformanceTier[] = ["ultra", "high", "medium", "low", "mobile"];
                const nextIdx = (tiers.indexOf(performanceTier) + 1) % tiers.length;
                setPerformanceTier(tiers[nextIdx]);
              }}
              className="px-3 py-2 text-xs font-mono bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center gap-1.5 text-zinc-200 transition-colors"
              title="Cycle rendering performance profile"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Tier: <span className="uppercase text-yellow-300 font-bold">{performanceTier}</span>
            </button>

            {/* Reduced Motion Toggle */}
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`px-3 py-2 text-xs font-mono border rounded-lg flex items-center gap-1.5 transition-colors ${
                reducedMotion
                  ? "bg-purple-950/70 border-purple-500 text-purple-300 font-bold"
                  : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
              title="Test prefers-reduced-motion override"
            >
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              Reduced Motion: {reducedMotion ? "ON" : "OFF"}
            </button>

            {/* WebGL Failure Simulation Toggle */}
            <button
              onClick={() => setSimulateError(!simulateError)}
              className={`px-3 py-2 text-xs font-mono border rounded-lg flex items-center gap-1.5 transition-colors ${
                simulateError
                  ? "bg-red-950/70 border-red-500 text-red-300 font-bold"
                  : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
              title="Test static fallback on WebGL failure"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              Simulate Fallback: {simulateError ? "ACTIVE" : "OFF"}
            </button>

            {/* Debug HUD Toggle */}
            <button
              onClick={() => setDebugHud(!debugHud)}
              className={`px-3 py-2 text-xs font-mono border rounded-lg flex items-center gap-1.5 transition-colors ${
                debugHud
                  ? "bg-cyan-950/70 border-cyan-500 text-cyan-300 font-bold"
                  : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
              title="Toggle FPS & statistics HUD"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              HUD: {debugHud ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
