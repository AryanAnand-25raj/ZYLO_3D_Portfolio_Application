import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PortfolioCard } from "@/components/dashboard/PortfolioCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SCENE_PRESETS } from "@/modules/scene";
import { THEME_PRESETS } from "@/modules/design";
import {
  Layers,
  Sparkles,
  Eye,
  Activity,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  Box,
  Palette,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const demoPortfolio = {
    id: "port-demo-1",
    slug: "alex-vance-3d",
    title: "Alex Vance — 3D Web Architect",
    description:
      "Interactive 3D WebGL portfolio featuring real-time torus knots, neon wireframe rings, and glassmorphic depth.",
    isPublished: true,
    themeName: "Neon Cyberpunk",
    sceneConfig: SCENE_PRESETS["cyber-dimension"],
    updatedAt: "Just now",
  };

  const metrics = [
    {
      label: "Active Portfolios",
      value: "1 / 5",
      change: "PRO Tier",
      icon: Layers,
      color: "text-zylo-cyan",
    },
    {
      label: "Live WebGL Views",
      value: "1,248",
      change: "+24% this week",
      icon: Eye,
      color: "text-zylo-purple",
    },
    {
      label: "Graphics Performance",
      value: "60 FPS",
      change: "Adaptive DPR Active",
      icon: Cpu,
      color: "text-zylo-emerald",
    },
    {
      label: "AI Generation Quota",
      value: "45 / 50",
      change: "Resets in 12d",
      icon: Sparkles,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="flex-1 flex flex-col pb-16">
      <DashboardHeader
        title="Studio Overview"
        subtitle="Manage your 3D WebGL portfolios and real-time scene configurations."
      />

      <main className="flex-1 px-8 py-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx} className="glass-panel border-zylo-border p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{metric.label}</span>
                  <div className="p-2 rounded-lg bg-white/5 border border-zylo-border">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-heading font-bold text-white tracking-tight">
                    {metric.value}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 font-mono">
                    <TrendingUp className="w-3 h-3 text-zylo-emerald" />
                    <span>{metric.change}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Portfolios Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-zylo-cyan" /> Your 3D Portfolios
              </h2>
              <p className="text-xs text-slate-400">
                Live interactive WebGL portfolio instances linked to your account.
              </p>
            </div>
            <Badge variant="cyan" className="font-mono text-xs">
              1 Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PortfolioCard {...demoPortfolio} />
          </div>
        </div>

        {/* Quick Launchpad Studio Cards */}
        <div className="space-y-4 pt-4 border-t border-zylo-border">
          <h3 className="text-base font-heading font-semibold text-white">
            3D Studio Tooling
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="glass-panel glass-panel-hover border-zylo-border p-6 cursor-pointer">
              <div className="p-3 rounded-xl bg-zylo-cyan/10 border border-zylo-cyan/30 w-fit mb-4">
                <Box className="w-6 h-6 text-zylo-cyan" />
              </div>
              <h4 className="font-heading font-semibold text-white mb-1">3D Scene Studio</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Configure procedural geometries, camera orbits, particle fields, and real-time lighting presets.
              </p>
              <span className="text-xs text-zylo-cyan font-medium flex items-center gap-1">
                Open Scene Studio <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Card>

            <Card className="glass-panel glass-panel-hover border-zylo-border p-6 cursor-pointer">
              <div className="p-3 rounded-xl bg-zylo-purple/10 border border-zylo-purple/30 w-fit mb-4">
                <Palette className="w-6 h-6 text-zylo-purple" />
              </div>
              <h4 className="font-heading font-semibold text-white mb-1">Theme & Glass Engine</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Tune HSL color palettes, typography scales, glassmorphism blur shaders, and neon border glows.
              </p>
              <span className="text-xs text-zylo-purple font-medium flex items-center gap-1">
                Customize Themes <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Card>

            <Card className="glass-panel glass-panel-hover border-zylo-border p-6 cursor-pointer">
              <div className="p-3 rounded-xl bg-zylo-emerald/10 border border-zylo-emerald/30 w-fit mb-4">
                <Layers className="w-6 h-6 text-zylo-emerald" />
              </div>
              <h4 className="font-heading font-semibold text-white mb-1">Content Architecture</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Manage your structured experiences, projects, skills, and biography with strict Zod validation.
              </p>
              <span className="text-xs text-zylo-emerald font-medium flex items-center gap-1">
                Edit Content <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
