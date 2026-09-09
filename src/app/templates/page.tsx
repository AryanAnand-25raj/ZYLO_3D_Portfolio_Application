"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortfolioRenderer } from "@/components/templates/PortfolioRenderer";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import {
  templateRegistry,
  TemplateMigration,
  getTemplate,
  getAllTemplates,
  getAllTemplatesAndPresets,
} from "@zylo/templates";
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Zap,
  RefreshCw,
  Eye,
  Sliders,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function TemplatesShowcasePage() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>("orbit");
  const [enable3D, setEnable3D] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"preview" | "gallery" | "migration">("gallery");
  const [migrationLogs, setMigrationLogs] = useState<string[]>([
    "Initialized default Orbit template (orbit@1.0.0)",
  ]);

  // Demo portfolio profile & content data
  const demoProfile = {
    fullName: "Elena Rostova",
    headline: "Principal Spatial WebGL Architect & Creative Technologist",
    bio: "Pioneering spatial computational design, WebGL graphics pipelines, and real-time interactive portfolios. Combining rigorous software systems engineering with cutting-edge visual experiences.",
    location: "Berlin, Germany / Remote",
    availableForHire: true,
    badgeText: "Open for Advisory & Senior Engineering Roles",
  };

  const handleTemplateSwitch = (targetId: string) => {
    // Run real non-destructive migration pipeline
    const migration = TemplateMigration.migrate(
      {
        templateId: activeTemplateId,
        content: {},
      },
      targetId,
      { preserveUserAccents: true }
    );

    setActiveTemplateId(targetId);
    setMigrationLogs((prev) => [
      `Migrated from ${activeTemplateId} → ${targetId} (${migration.migratedPortfolio.templateVersion})`,
      ...migration.changesApplied.map((c) => `  • ${c}`),
      ...prev.slice(0, 8),
    ]);
  };

  const currentTemplate = getTemplate(activeTemplateId);

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 flex flex-col">
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 bg-[#070B14]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-wide">ZYLO</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/20">
              Template Studio
            </span>
          </div>
        </div>

        {/* Quick Template Switcher Pills */}
        <div className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 overflow-x-auto max-w-sm xl:max-w-lg scrollbar-none">
          {Object.keys(templateRegistry).map((tid) => {
            const isActive = activeTemplateId === tid;
            return (
              <button
                key={tid}
                onClick={() => handleTemplateSwitch(tid)}
                className={`px-2.5 py-1 rounded text-xs font-mono capitalize transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-cyan-500 text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tid}
              </button>
            );
          })}
        </div>

        {/* View mode toggle & 3D WebGL switch */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setEnable3D(!enable3D)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              enable3D
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
            title="Toggle 3D WebGL (Tests accessible fallback)"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D: {enable3D ? "ON" : "OFF"}</span>
          </button>

          <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === "preview" ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              Full Preview
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === "gallery" ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              Gallery ({getAllTemplatesAndPresets().length})
            </button>
            <button
              onClick={() => setActiveTab("migration")}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === "migration" ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              Audit
            </button>
          </div>

          <Link
            href={`/create/generate?template=${activeTemplateId}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use in Studio</span>
          </Link>
        </div>
      </header>

      {/* Main Viewport Content */}
      <div className="flex-1">
        {activeTab === "preview" && (
          <PortfolioRenderer
            template={activeTemplateId}
            profile={demoProfile}
            enable3D={enable3D}
            interactive={true}
          />
        )}

        {activeTab === "gallery" && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <TemplateGallery
              selectedTemplateId={activeTemplateId}
              onSelectTemplate={(tid) => {
                handleTemplateSwitch(tid);
                setActiveTab("preview");
              }}
              show3DPreviews={true}
            />
          </div>
        )}

        {activeTab === "migration" && (
          <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
            <div className="border-b border-white/10 pb-4">
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                Template Architecture & Migration Audit
              </h1>
              <p className="text-sm text-slate-400">
                Verified configuration guarantees: data integrity, version stamping, and graceful node downsampling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-[#090E1C] border border-white/10 space-y-3">
                <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-wider">
                  Active Architecture
                </h3>
                <div className="space-y-1 text-xs font-mono">
                  <p className="text-white font-bold text-base">{currentTemplate.name}</p>
                  <p className="text-slate-400">Version: {currentTemplate.templateVersion}</p>
                  <p className="text-slate-400">Category: {currentTemplate.category}</p>
                  <p className="text-slate-400">Tier: {currentTemplate.performance.tier}</p>
                  <p className="text-slate-400">Max DPR: {currentTemplate.performance.maxDpr}x</p>
                  <p className="text-slate-400">Rec. Particles: {currentTemplate.performance.recommendedParticles}</p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#090E1C] border border-white/10 space-y-3">
                <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-wider">
                  Supported 3D Objects
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {currentTemplate.supportedObjects.map((obj) => (
                    <span
                      key={obj}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                    >
                      {obj}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#070B14] border border-white/10 space-y-3">
              <h3 className="text-sm font-mono text-slate-300 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" /> Live Migration Logs
              </h3>
              <div className="font-mono text-xs text-slate-400 bg-black/60 p-4 rounded-lg space-y-1 max-h-60 overflow-y-auto border border-white/5">
                {migrationLogs.map((log, index) => (
                  <div key={index} className="text-emerald-400/90 leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
