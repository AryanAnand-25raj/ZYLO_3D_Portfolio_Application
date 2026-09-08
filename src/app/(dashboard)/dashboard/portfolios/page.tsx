"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PortfolioCard } from "@/components/dashboard/PortfolioCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SCENE_PRESETS } from "@/modules/scene";
import {
  Layers,
  Plus,
  Search,
  Sparkles,
  Filter,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function MyPortfoliosPage() {
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");

  const portfolios = [
    {
      id: "port-demo-1",
      slug: "alex-vance-3d",
      title: "Alex Vance — 3D Web Architect",
      description:
        "Interactive 3D WebGL portfolio featuring real-time torus knots, neon wireframe rings, and glassmorphic depth.",
      isPublished: true,
      themeName: "Neon Cyberpunk",
      sceneConfig: SCENE_PRESETS["cyber-dimension"],
      updatedAt: "Just now",
    },
    {
      id: "port-demo-2",
      slug: "elena-spatial",
      title: "Elena Rostova — Vision Designer",
      description:
        "Spatial computing portfolio with holographic prisms, translucent glassmorphism, and Apple Vision Pro aesthetic.",
      isPublished: false,
      themeName: "Spatial Hologram",
      sceneConfig: SCENE_PRESETS["floating-mesh"],
      updatedAt: "2 days ago",
    },
  ];

  const filtered = portfolios.filter((p) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && p.isPublished) ||
      (filter === "draft" && !p.isPublished);
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col pb-16">
      <DashboardHeader
        title="My 3D Portfolios"
        subtitle="Manage, deploy, and edit your live WebGL portfolio instances."
      />

      <main className="flex-1 px-8 py-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex bg-zylo-surface p-1 rounded-xl border border-zylo-border text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === "all"
                  ? "bg-zylo-cyan text-black font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All ({portfolios.length})
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === "published"
                  ? "bg-zylo-cyan text-black font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Published ({portfolios.filter((p) => p.isPublished).length})
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === "draft"
                  ? "bg-zylo-cyan text-black font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Drafts ({portfolios.filter((p) => !p.isPublished).length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by title or slug..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-zylo-surface border border-zylo-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-zylo-cyan"
              />
            </div>

            <Link href="/create">
              <Button variant="glow" size="sm" className="text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" /> New Portfolio
              </Button>
            </Link>
          </div>
        </div>

        {/* Portfolios Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-zylo-border bg-zylo-surface/40 space-y-3">
            <Layers className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No portfolios found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query or create a brand new 3D portfolio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((portfolio) => (
              <PortfolioCard key={portfolio.id} {...portfolio} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
