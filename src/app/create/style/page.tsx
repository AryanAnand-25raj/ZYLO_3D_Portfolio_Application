"use client";

import React, { useState } from "react";
import { useDraft } from "@/components/create/DraftProvider";
import {
  StylePreset,
  StylePresetEnum,
  TargetAudience,
  TargetAudienceEnum,
  PortfolioGoal,
  PortfolioGoalEnum,
  VisualIntensity,
  VisualIntensityEnum,
  SectionName,
  SectionEnum,
} from "@/schemas/draft.schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Sparkles,
  Target,
  Layers,
  ArrowLeft,
  ArrowRight,
  Sliders,
  Check,
  CheckSquare,
  Square,
} from "lucide-react";

export default function CreateStyleStepPage() {
  const { preferences, setPreferences, prevStep, nextStep, saveDraft } = useDraft();

  const [preset, setPreset] = useState<StylePreset>(preferences.preset || "Futuristic");
  const [stylePrompt, setStylePrompt] = useState(
    preferences.stylePrompt ||
      "I want a futuristic dark portfolio inspired by space exploration. Use glowing cyan accents, glass panels, floating 3D objects, subtle particles and cinematic animations. Keep the overall design professional."
  );
  const [targetAudience, setTargetAudience] = useState<TargetAudience>(
    preferences.targetAudience || "Employers"
  );
  const [portfolioGoal, setPortfolioGoal] = useState<PortfolioGoal>(
    preferences.portfolioGoal || "Get a Job"
  );
  const [visualIntensity, setVisualIntensity] = useState<VisualIntensity>(
    preferences.visualIntensity || "Highly Interactive"
  );
  const [selectedSections, setSelectedSections] = useState<SectionName[]>(
    preferences.selectedSections || ["Hero", "About", "Experience", "Skills", "Projects", "Contact"]
  );

  const stylePresetsList: { name: StylePreset; description: string; colors: string[] }[] = [
    { name: "Futuristic", description: "Deep dark voids with vibrant cyan glows and floating cyber objects", colors: ["#00F0FF", "#9D00FF", "#05070D"] },
    { name: "Cyberpunk", description: "Neon pink & purple laser aesthetics with high-contrast wireframe grids", colors: ["#FF007A", "#00F0FF", "#9D00FF"] },
    { name: "Minimal", description: "Clean monochrome typography with subtle glass depth and precision spacing", colors: ["#FFFFFF", "#94A3B8", "#0F172A"] },
    { name: "Space", description: "Cosmic nebulae, particle vortexes, and floating planetary crystal prisms", colors: ["#38BDF8", "#818CF8", "#030712"] },
    { name: "Glass", description: "Frosted translucent glassmorphism with dynamic light refractions", colors: ["#E2E8F0", "#38BDF8", "#1E293B"] },
    { name: "Creative", description: "Experimental 3D geometries, playful kinetic spring physics, and bold accents", colors: ["#F43F5E", "#F59E0B", "#10B981"] },
    { name: "Luxury", description: "Obsidian dark backgrounds with rich champagne gold and emerald lighting", colors: ["#D4AF37", "#059669", "#0B0F19"] },
    { name: "Professional", description: "Structured corporate clarity, slate tones, and refined interactive cards", colors: ["#2563EB", "#64748B", "#F8FAFC"] },
    { name: "Editorial", description: "Sophisticated serif typography, high-fashion layouts, and museum lighting", colors: ["#FAFAFA", "#52525B", "#18181B"] },
    { name: "Experimental", description: "Glitch shaders, dynamic chromatic aberration, and holographic pillars", colors: ["#00FF9D", "#FF0055", "#000000"] },
  ];

  const allSections: SectionName[] = [
    "Hero",
    "About",
    "Experience",
    "Skills",
    "Projects",
    "Education",
    "Certifications",
    "GitHub",
    "Contact",
    "Resume",
  ];

  const toggleSection = (section: SectionName) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter((s) => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    setPreferences({
      preset,
      stylePrompt,
      targetAudience,
      portfolioGoal,
      visualIntensity,
      selectedSections,
    });

    await saveDraft();
    nextStep();
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="font-mono text-[10px]">
            STEP 04 OF 06
          </Badge>
          <span className="text-xs text-slate-400 font-mono">Design Direction & Preferences</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
          Define Your 3D Portfolio Style & Audience
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl">
          Describe your vision in natural language or choose a preset. The AI will synthesize your
          preferences into the portfolio content and 3D design architecture.
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-6">
        {/* Style Prompt Card */}
        <Card className="glass-panel border-zylo-border p-6 space-y-4">
          <CardHeader className="p-0 space-y-1">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zylo-cyan" /> Natural Language Style Prompt
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Describe colors, atmosphere, 3D metaphors, or tone in your own words.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <textarea
              rows={4}
              value={stylePrompt}
              onChange={(e) => setStylePrompt(e.target.value)}
              placeholder="e.g. I want a futuristic dark portfolio inspired by space exploration. Use glowing blue accents, glass panels, floating 3D objects, subtle particles and cinematic animations..."
              className="w-full rounded-xl border border-zylo-border bg-zylo-surface/80 p-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-zylo-cyan transition-all leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* 10 Selectable Style Presets */}
        <Card className="glass-panel border-zylo-border p-6 space-y-4">
          <CardHeader className="p-0 space-y-1">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Palette className="w-4 h-4 text-zylo-purple" /> Select a Visual Style Preset
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Choose an aesthetic baseline. You can customize it anytime.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stylePresetsList.map((p) => {
              const isSelected = preset === p.name;
              return (
                <div
                  key={p.name}
                  onClick={() => setPreset(p.name)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-zylo-elevated border-zylo-cyan shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                      : "bg-zylo-surface/60 border-zylo-border hover:border-white/20 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white">{p.name}</span>
                    <div className="flex items-center gap-1">
                      {p.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-black/40"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{p.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Audience, Goal & Visual Intensity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Audience */}
          <Card className="glass-panel border-zylo-border p-5 space-y-3">
            <label className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-zylo-cyan" /> Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
              className="w-full h-9 rounded-lg border border-zylo-border bg-zylo-surface/80 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-zylo-cyan"
            >
              {TargetAudienceEnum.options.map((opt) => (
                <option key={opt} value={opt} className="bg-zylo-dark text-white">
                  {opt}
                </option>
              ))}
            </select>
          </Card>

          {/* Portfolio Goal */}
          <Card className="glass-panel border-zylo-border p-5 space-y-3">
            <label className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zylo-purple" /> Primary Goal
            </label>
            <select
              value={portfolioGoal}
              onChange={(e) => setPortfolioGoal(e.target.value as PortfolioGoal)}
              className="w-full h-9 rounded-lg border border-zylo-border bg-zylo-surface/80 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-zylo-purple"
            >
              {PortfolioGoalEnum.options.map((opt) => (
                <option key={opt} value={opt} className="bg-zylo-dark text-white">
                  {opt}
                </option>
              ))}
            </select>
          </Card>

          {/* Visual Intensity */}
          <Card className="glass-panel border-zylo-border p-5 space-y-3">
            <label className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-zylo-emerald" /> 3D Visual Intensity
            </label>
            <select
              value={visualIntensity}
              onChange={(e) => setVisualIntensity(e.target.value as VisualIntensity)}
              className="w-full h-9 rounded-lg border border-zylo-border bg-zylo-surface/80 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-zylo-emerald"
            >
              {VisualIntensityEnum.options.map((opt) => (
                <option key={opt} value={opt} className="bg-zylo-dark text-white">
                  {opt}
                </option>
              ))}
            </select>
          </Card>
        </div>

        {/* Section Selection Checklist */}
        <Card className="glass-panel border-zylo-border p-6 space-y-4">
          <CardHeader className="p-0 space-y-1">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Layers className="w-4 h-4 text-zylo-cyan" /> Select Included Portfolio Sections
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Toggle which sections will be synthesized and rendered into your portfolio.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 flex flex-wrap gap-2.5">
            {allSections.map((sec) => {
              const isChecked = selectedSections.includes(sec);
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => toggleSection(sec)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    isChecked
                      ? "bg-zylo-elevated border-zylo-cyan/40 text-zylo-cyan"
                      : "bg-zylo-surface/40 border-zylo-border text-slate-400 hover:text-white"
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-zylo-cyan" />
                  ) : (
                    <Square className="w-3.5 h-3.5" />
                  )}
                  <span>{sec}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Navigation Actions */}
        <div className="pt-6 border-t border-zylo-border flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Review
          </Button>

          <Button
            type="submit"
            variant="glow"
            size="lg"
            className="gap-2 text-xs"
          >
            Proceed to AI Analysis & Generation <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
