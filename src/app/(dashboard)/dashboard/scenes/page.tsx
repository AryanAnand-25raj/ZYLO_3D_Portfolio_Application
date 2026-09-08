"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SceneRenderer } from "@zylo/three-engine";
import { SCENE_PRESETS } from "@/modules/scene";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Box,
  RotateCw,
  Sliders,
  Sparkles,
  ArrowRight,
  Eye,
  Camera,
  Layers,
  Zap,
} from "lucide-react";

export default function SceneStudioPage() {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("cyber-dimension");
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [cameraFov, setCameraFov] = useState(45);

  const currentPreset = SCENE_PRESETS[selectedPresetKey] || SCENE_PRESETS["cyber-dimension"];

  // Augmented scene with live state overrides
  const liveScene = {
    ...currentPreset,
    camera: {
      ...currentPreset.camera,
      fov: cameraFov,
      controls: {
        ...currentPreset.camera.controls,
        autoRotate: autoRotate,
        autoRotateSpeed: rotationSpeed,
      },
    },
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <DashboardHeader
        title="3D Scene Studio"
        subtitle="Test and tweak procedural WebGL scenes, camera paths, and lighting setups in real-time."
      />

      <main className="flex-1 px-8 py-8 max-w-7xl w-full mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main 3D Canvas Showcase */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="relative h-[520px] rounded-2xl overflow-hidden glass-panel border border-zylo-border shadow-2xl flex flex-col">
              {/* Canvas Header */}
              <div className="px-4 py-3 border-b border-zylo-border bg-zylo-surface/80 backdrop-blur-md flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-300 ml-2">
                    {currentPreset.name} (Scene Studio)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="cyan" className="text-[10px] py-0 px-2 font-mono">
                    Live WebGL
                  </Badge>
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-1.5 rounded-md border text-xs transition-colors ${
                      autoRotate
                        ? "bg-zylo-cyan/15 border-zylo-cyan/40 text-zylo-cyan"
                        : "bg-white/5 border-zylo-border text-slate-400 hover:text-white"
                    }`}
                    title="Toggle Auto Rotation"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Three.js Scene Viewport */}
              <div className="relative flex-1 w-full h-full bg-[#04060E]">
                <SceneRenderer
                  sceneConfig={liveScene}
                  interactive={true}
                  autoRotate={autoRotate}
                  className="w-full h-full"
                />

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-400 pointer-events-none z-10">
                  <span className="bg-black/60 px-2.5 py-1 rounded-md border border-white/10">
                    Nodes: {currentPreset.nodes.length} | Lights: {currentPreset.lighting.lights.length}
                  </span>
                  <span className="bg-black/60 px-2.5 py-1 rounded-md border border-white/10">
                    FOV: {cameraFov}° | Speed: {rotationSpeed}x
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-zylo-border">
              <div className="flex items-center gap-3">
                <Link href="/builder/port-demo-1">
                  <Button variant="glow" size="sm" className="gap-2 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Open in Visual Builder
                  </Button>
                </Link>
                <Link href="/3d-test">
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <Zap className="w-3.5 h-3.5 text-zylo-cyan" /> Benchmark in 3D Testbed
                  </Button>
                </Link>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Hardware Adaptive: 60 FPS Lock
              </span>
            </div>
          </div>

          {/* Right Column: Controls & Preset Switcher */}
          <div className="lg:col-span-4 space-y-6">
            {/* Presets List */}
            <Card className="glass-panel border-zylo-border p-5 space-y-4">
              <CardTitle className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-zylo-cyan" /> Scene Presets
              </CardTitle>
              <div className="space-y-2">
                {Object.entries(SCENE_PRESETS).map(([key, preset]) => {
                  const isSelected = selectedPresetKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPresetKey(key)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-zylo-cyan/15 border-zylo-cyan/50 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                          : "bg-white/5 border-zylo-border text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {preset.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {preset.nodes.length} 3D Mesh Nodes
                        </div>
                      </div>
                      <Badge
                        variant={isSelected ? "cyan" : "outline"}
                        className="text-[10px] py-0 px-2"
                      >
                        {preset.lighting.preset}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Live Sliders */}
            <Card className="glass-panel border-zylo-border p-5 space-y-4">
              <CardTitle className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zylo-purple" /> Studio Tweaks
              </CardTitle>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Camera FOV</span>
                    <span className="font-mono text-zylo-cyan">{cameraFov}°</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="80"
                    value={cameraFov}
                    onChange={(e) => setCameraFov(Number(e.target.value))}
                    className="w-full accent-zylo-cyan cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Rotation Speed</span>
                    <span className="font-mono text-zylo-cyan">{rotationSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(Number(e.target.value))}
                    className="w-full accent-zylo-cyan cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
