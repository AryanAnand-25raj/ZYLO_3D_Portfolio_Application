"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Layers,
  Box,
} from "lucide-react";

// Interactive 3D Card Tilt wrapper
const TiltCard3D: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -7);
    setRotateY(((x - centerX) / centerX) * 7);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export const HomeTemplateShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const showcaseItems = [
    {
      id: "anime-neo-tokyo",
      name: "Neo-Tokyo Manga & Cel Avatar",
      family: "Anime & Character",
      category: "Anime",
      badge: "Anime Flagship",
      accentColor: "#FF2A85",
      borderColor: "border-pink-500/30 hover:border-pink-500/60",
      glowColor: "rgba(255, 42, 133, 0.2)",
      description: "Cel-shaded 3D character bust, glowing visor, dual horns, floating sakura petals, and manga status HUD.",
      bestFor: "Anime Artists, VTubers, 3D Modellers, Game Creators",
      telemetry: "Lv.99 SPECIAL GRADE // 🌸 SAKURA FIELD",
      tags: ["Anime", "Cel-Shaded", "Sakura", "Manga HUD"],
      gradient: "from-pink-500/10 via-purple-500/5 to-transparent",
    },
    {
      id: "ai-fusion",
      name: "Fusion AI — Large Models & Neural Core",
      family: "AI & Tech",
      category: "AI",
      badge: "AI & LLM",
      accentColor: "#00F0FF",
      borderColor: "border-cyan-500/30 hover:border-cyan-500/60",
      glowColor: "rgba(0, 240, 255, 0.2)",
      description: "Interactive synaptic data nodes, transformer attention weights, and real-time tensor particle vortex.",
      bestFor: "LLM Researchers, AI Founders, MLOps Engineers",
      telemetry: "SYNAPTIC WEIGHTS: 70B // LATENCY: 14MS",
      tags: ["Fusion AI", "Transformers", "Neural Nodes", "PyTorch"],
      gradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    },
    {
      id: "creative-inky",
      name: "INKY — 3D Sculptor & Art Direction",
      family: "3D Creative",
      category: "Creative",
      badge: "3D Art & Studio",
      accentColor: "#F43F5E",
      borderColor: "border-rose-500/30 hover:border-rose-500/60",
      glowColor: "rgba(244, 63, 94, 0.2)",
      description: "Organic liquid sculpture, iridescent chromatic materials, and tactile mouse-driven kinetic fluidity.",
      bestFor: "3D Artists, Creative Directors, High-End Atelier",
      telemetry: "FLUID VISCOSITY: 1.2 // REFLECTION: PBR",
      tags: ["INKY", "Sculpture", "Liquid Chrome", "Art Direction"],
      gradient: "from-rose-500/10 via-purple-500/5 to-transparent",
    },
    {
      id: "creative-mono-x",
      name: "Mōno X — Kinetic Typographic Atelier",
      family: "3D Creative",
      category: "Creative",
      badge: "Minimal Atelier",
      accentColor: "#FFFFFF",
      borderColor: "border-white/20 hover:border-white/50",
      glowColor: "rgba(255, 255, 255, 0.15)",
      description: "Editorial monochrome aesthetic, kinetic 3D typography, high-contrast layouts, and Swiss modernism.",
      bestFor: "Editorial Designers, Brand Architects, Type Studios",
      telemetry: "TYPOGRAPHY: SWISS 1957 // GRID: 12-COL",
      tags: ["Mōno X", "Kinetic", "Typography", "Editorial"],
      gradient: "from-white/10 via-slate-500/5 to-transparent",
    },
    {
      id: "ai-mahadeva",
      name: "Mahadeva — Quantum Neural Compute",
      family: "AI & Tech",
      category: "AI",
      badge: "Supercompute",
      accentColor: "#8B5CF6",
      borderColor: "border-purple-500/30 hover:border-purple-500/60",
      glowColor: "rgba(139, 92, 246, 0.2)",
      description: "3D pulsating voxel grid, quantum entangled states, and supercomputing tensor matrix simulation.",
      bestFor: "Quantum ML Scientists, HPC Leads, Supercomputing",
      telemetry: "QUBIT FIDELITY: 99.98% // VOXEL: 1024^3",
      tags: ["Mahadeva", "Quantum", "Voxel Grid", "HPC"],
      gradient: "from-purple-500/10 via-amber-500/5 to-transparent",
    },
    {
      id: "space-lunar-architect",
      name: "Artemis Lunar Base & Deep Space",
      family: "Space & Sci-Fi",
      category: "Space",
      badge: "Aerospace",
      accentColor: "#38BDF8",
      borderColor: "border-sky-500/30 hover:border-sky-500/60",
      glowColor: "rgba(56, 189, 248, 0.2)",
      description: "Planetary orbit mechanics, rotating solar satellites, lunar terrain wireframes, and telemetry consoles.",
      bestFor: "Aerospace Engineers, Robotics Founders, Space Tech",
      telemetry: "ORBITAL ALTITUDE: 384,400 KM // DELTA-V",
      tags: ["Artemis", "Satellite", "Orbit", "Deep Space"],
      gradient: "from-sky-500/10 via-indigo-500/5 to-transparent",
    },
  ];

  const filteredItems =
    activeCategory === "all"
      ? showcaseItems
      : showcaseItems.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="templates-showcase" className="py-24 border-t border-zylo-border relative bg-zylo-dark/95 scroll-mt-16">
      {/* Background ambient radial lights */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-zylo-purple/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-zylo-cyan/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="container max-w-7xl px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-zylo-cyan/30 text-xs font-mono text-zylo-cyan">
              <Sparkles className="w-3.5 h-3.5" /> Curated from 100 Production Presets
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
              Flagship 3D Website Portfolios
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Inspired by real-world creators, Webflow 3D showcases, Framer AI templates, and ThemeForest 3D award winners.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 self-start md:self-end">
            {["all", "Anime", "AI", "Creative", "Space"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-zylo-cyan text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat === "all" ? "All Presets" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map((item) => (
            <TiltCard3D key={item.id} className="h-full">
              <div
                className={`h-full rounded-2xl glass-panel border ${item.borderColor} p-6 flex flex-col justify-between transition-all duration-300 bg-gradient-to-b ${item.gradient} hover:shadow-2xl relative overflow-hidden group`}
                style={{
                  boxShadow: `0 10px 30px -10px ${item.glowColor}`,
                }}
              >
                {/* Top Telemetry Bar */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold border"
                      style={{
                        color: item.accentColor,
                        borderColor: `${item.accentColor}40`,
                        backgroundColor: `${item.accentColor}15`,
                      }}
                    >
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                      {item.family}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-zylo-cyan transition-colors">
                    {item.name}
                  </h3>

                  <div className="mt-2.5 px-2.5 py-1.5 rounded bg-black/50 border border-white/5 text-[10px] font-mono text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: item.accentColor }} />
                    <span className="truncate">{item.telemetry}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-3.5 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5">
                    <span className="text-[11px] text-slate-400 font-mono block mb-2">Best for:</span>
                    <span className="text-xs text-slate-200 font-medium">{item.bestFor}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action CTAs */}
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-3">
                  <Link href="/templates" className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs gap-1.5 border-white/10 hover:border-white/30 text-slate-200 hover:text-white"
                    >
                      <Layers className="w-3.5 h-3.5" /> Preview 3D
                    </Button>
                  </Link>

                  <Link href={`/create/generate?template=${item.id}`} className="flex-1">
                    <Button
                      variant="glow"
                      size="sm"
                      className="w-full text-xs gap-1.5 font-semibold"
                    >
                      Use Preset <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </TiltCard3D>
          ))}
        </div>

        {/* Explore Full Catalog Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl glass-panel border border-zylo-cyan/30 bg-gradient-to-r from-zylo-cyan/10 via-zylo-purple/10 to-pink-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-heading font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Box className="w-5 h-5 text-zylo-cyan" />
              <span>Browse All 100 Production 3D Presets</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Spanning AI, Anime & Gaming, Space & Sci-Fi, Creative 3D, CAD Architecture, Automotive, and Experimental WebGL.
            </p>
          </div>

          <Link href="/templates">
            <Button variant="glow" size="lg" className="gap-2 shrink-0 font-semibold shadow-lg shadow-zylo-cyan/20">
              Open Template Studio <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
