"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SceneRenderer } from "@zylo/three-engine";
import { SceneSchema } from "@/schemas/scene.schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Sliders,
  Code2,
  Check,
  RotateCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export const Interactive3DPlayground: React.FC = () => {
  const [selectedMesh, setSelectedMesh] = useState<string>("AnimeCharacterAvatar");
  const [selectedColor, setSelectedColor] = useState<string>("#FF2A85");
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [bloomIntensity, setBloomIntensity] = useState<number>(1.2);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const meshes = [
    { type: "AnimeCharacterAvatar", label: "Anime Character", icon: "🌸" },
    { type: "TorusKnotCore", label: "Cyber Torus", icon: "⚡" },
    { type: "CrystalPrism", label: "Crystal Prism", icon: "💎" },
    { type: "SpacePlanet", label: "Orbital Planet", icon: "🪐" },
    { type: "BuildingWireframe", label: "CAD Tower", icon: "🏛️" },
    { type: "MechaCore", label: "Mecha Core", icon: "⚔️" },
  ];

  const colors = [
    { label: "Sakura Pink", hex: "#FF2A85" },
    { label: "Cyber Cyan", hex: "#00F0FF" },
    { label: "Shonen Gold", hex: "#FFE600" },
    { label: "Matrix Green", hex: "#10B981" },
    { label: "Spatial Purple", hex: "#A855F7" },
  ];

  // Dynamically compile safe declarative SceneConfig
  const dynamicScene = useMemo(() => {
    return SceneSchema.parse({
      id: "playground-dynamic-scene",
      name: `Playground ${selectedMesh}`,
      version: "1.0.0",
      camera: {
        type: "perspective",
        fov: 45,
        position: [0, 0, 6.5],
        target: [0, selectedMesh === "AnimeCharacterAvatar" ? 0.3 : 0, 0],
        near: 0.1,
        far: 1000,
        controls: {
          enabled: true,
          autoRotate: autoRotate,
          autoRotateSpeed: 0.8,
          enableZoom: false,
          enablePan: false,
          maxPolarAngle: Math.PI / 2 + 0.1,
          minPolarAngle: Math.PI / 4,
          dampingFactor: 0.05,
        },
      },
      lighting: {
        preset: "cyberpunk",
        lights: [
          { id: "p1", type: "point", color: selectedColor, intensity: 4, position: [3, 3, 3], castShadow: false },
          { id: "amb", type: "ambient", color: "#FFFFFF", intensity: 0.35, castShadow: false },
        ],
      },
      environment: {
        preset: "night",
        background: false,
        blur: 0.8,
        fog: { enabled: true, color: "#060913", near: 5, far: 20 },
        particles: { enabled: true, count: 400, color: selectedColor, size: 0.025, speed: 0.3 },
      },
      postProcessing: {
        bloom: { enabled: true, intensity: bloomIntensity, luminanceThreshold: 0.2, luminanceSmoothing: 0.85 },
        chromaticAberration: { enabled: false, offset: [0, 0] },
        vignette: { enabled: true, darkness: 0.5, offset: 0.3 },
      },
      nodes: [
        {
          id: "playground-active-node",
          componentType: selectedMesh,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1.2, 1.2, 1.2],
          materialProps: {
            color: selectedColor,
            wireframe: wireframe,
            roughness: 0.2,
            metalness: 0.4,
            emissive: selectedColor,
            emissiveIntensity: 0.5,
          },
          animation: {
            rotateSpeed: [0.1, 0.3, 0.05],
            floatAmplitude: 0.12,
            floatSpeed: 1,
            pulseSpeed: 0,
          },
          interactive: {
            hoverScale: 1.1,
            hoverGlow: true,
            clickAction: "none",
          },
        },
      ],
      quality: "high",
      interactivity: {
        mouseParallax: true,
        parallaxFactor: 0.4,
        scrollDriven: true,
      },
    });
  }, [selectedMesh, selectedColor, wireframe, bloomIntensity, autoRotate]);

  return (
    <section id="playground" className="py-24 border-t border-zylo-border relative bg-zylo-dark overflow-hidden scroll-mt-16">
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-zylo-cyan/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="container max-w-7xl px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="cyan" className="gap-1.5 px-3 py-1">
            <Sliders className="w-3.5 h-3.5" /> Interactive WebGL Lab
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Live 3D Shader & Mesh Playground
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Customize 3D models and lighting in real time. Inspect how ZYLO compiles your styling
            into sandboxed declarative WebGL without raw JavaScript security risks.
          </p>
        </div>

        {/* 2-Column Playground: Controls & 3D Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl glass-panel border border-zylo-border bg-zylo-surface/85 space-y-6 shadow-xl">
            <div className="space-y-6">
              {/* Mesh Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zylo-cyan" /> 1. Select Procedural 3D Mesh
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {meshes.map((m) => (
                    <button
                      key={m.type}
                      onClick={() => setSelectedMesh(m.type)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center gap-2 transition-all ${
                        selectedMesh === m.type
                          ? "bg-zylo-cyan/15 border-zylo-cyan/50 text-white shadow-sm font-semibold"
                          : "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zylo-pink" /> 2. Emissive Shader Tint
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setSelectedColor(c.hex)}
                      className={`h-9 px-3 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all ${
                        selectedColor === c.hex
                          ? "border-white text-white font-semibold shadow-md scale-105"
                          : "border-transparent text-slate-400 hover:text-white"
                      }`}
                      style={{
                        backgroundColor: `${c.hex}25`,
                      }}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles & Sliders */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" /> 3. Post-Processing & Rendering Flags
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setWireframe(!wireframe)}
                    className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
                      wireframe
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-400 font-semibold"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Wireframe</span>
                    <span>{wireframe ? "ON" : "OFF"}</span>
                  </button>

                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
                      autoRotate
                        ? "bg-zylo-cyan/15 border-zylo-cyan/40 text-zylo-cyan font-semibold"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Orbital Spin</span>
                    <span>{autoRotate ? "ON" : "OFF"}</span>
                  </button>
                </div>

                {/* Bloom Intensity */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Bloom Radiance</span>
                    <span className="text-zylo-cyan">{bloomIntensity.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2.5"
                    step="0.1"
                    value={bloomIntensity}
                    onChange={(e) => setBloomIntensity(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-black/50 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sandbox Security Guarantee */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero eval() • Pure Declarative Nodes</span>
              </div>

              <Link href="/create">
                <Button variant="glow" size="sm" className="gap-1.5 text-xs font-semibold">
                  Launch Studio <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* 3D Viewport Stage & Live JSON Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Viewport Canvas */}
            <div className="relative w-full h-[400px] sm:h-[430px] rounded-2xl glass-panel border border-zylo-border shadow-2xl overflow-hidden flex flex-col bg-gradient-to-b from-zylo-surface/40 to-zylo-dark/95">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-black/40 backdrop-blur-md z-20">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-time Viewport: {selectedMesh}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Color: {selectedColor}
                </span>
              </div>

              <div className="relative flex-1 w-full h-full">
                <SceneRenderer
                  sceneConfig={dynamicScene}
                  interactive={true}
                  autoRotate={autoRotate}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Live Declarative Schema JSON Stream */}
            <div className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2 mb-2">
                <span className="flex items-center gap-1.5 text-zylo-cyan">
                  <Code2 className="w-3.5 h-3.5" /> Compiled SceneSchema Node:
                </span>
                <span className="text-[10px] text-slate-500">Validated via Zod</span>
              </div>
              <pre className="text-emerald-400 overflow-x-auto max-h-24 scrollbar-none">
{`{
  "componentType": "${selectedMesh}",
  "materialProps": { "color": "${selectedColor}", "wireframe": ${wireframe}, "bloom": ${bloomIntensity} },
  "performance": { "tier": "high", "fps": 60, "dpr": 2.0 }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
