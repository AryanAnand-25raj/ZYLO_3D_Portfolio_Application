"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDraft } from "@/components/create/DraftProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Edit3,
  Globe,
  Box,
  Layers,
  ArrowRight,
  RotateCcw,
  Check,
  Cpu,
  FileText,
} from "lucide-react";

export default function CreateResultStepPage() {
  const router = useRouter();
  const {
    profileData,
    preferences,
    generatedContent,
    setGeneratedContent,
    goToStep,
    saveDraft,
  } = useDraft();

  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // If no generated content exists yet, show fallback synthesized preview
  const content = generatedContent || {
    hero: {
      headline: "Architecting Dimensional Web Experiences",
      subheadline: `${profileData.profile.fullName || "Alex Vance"} — ${profileData.profile.headline}. Pioneering interactive 3D WebGL architectures.`,
      badge: "Available for High-Impact Roles",
      ctaText: "Explore 3D Work",
      secondaryCtaText: "Contact Me",
    },
    about: {
      title: "About",
      tagline: profileData.profile.headline || "Creative Technologist & 3D Interactive Web Architect",
      body: profileData.profile.bio || "Crafting dimensional web experiences bridging real-time WebGL graphics, generative design, and high-performance frontend engineering.",
      highlights: ["100% Declarative WebGL Graphics Pipeline", "Hardware-Adaptive DPR", "Modern Component Architecture"],
    },
    experienceSummaries: profileData.experiences.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      duration: `${e.startDate} — ${e.current ? "Present" : e.endDate || "2023"}`,
      impactSummary: e.description,
      keyTechnologies: e.technologies,
    })),
    projects: profileData.projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      summary: p.summary,
      description: p.description,
      technologies: p.tags,
      featured: p.featured,
      impactMetrics: p.stats,
    })),
    skillsMatrix: profileData.skillCategories.map((c) => ({
      category: c.category,
      skills: c.skills.map((s) => ({ name: s.name, proficiency: s.proficiency || 85, highlight: true })),
    })),
    services: [
      { title: "Real-Time 3D & WebGL Engineering", description: "Custom shaders, R3F canvases, and procedural geometries." },
      { title: "Design Systems & Token Pipelines", description: "Glassmorphic UI components, HSL color palettes, and animations." },
    ],
    callToAction: {
      heading: "Ready to Build Something Extraordinary?",
      description: "Let's collaborate on spatial web experiences and creative engineering.",
      buttonText: "Initiate Collaboration",
    },
    seo: {
      metaTitle: `${profileData.profile.fullName || "Alex Vance"} — 3D Portfolio`,
      metaDescription: profileData.profile.bio?.slice(0, 150) || "Interactive 3D Portfolio",
      keywords: ["3D Portfolio", "WebGL", "Three.js"],
    },
  };

  const handleRegenerateSection = async (
    sectionKey: "hero" | "about" | "projects" | "skillsMatrix" | "seo"
  ) => {
    setRegeneratingSection(sectionKey);
    try {
      const res = await fetch("/api/ai/portfolio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profileData,
          preferences,
          currentContent: content,
          sectionToRegenerate: sectionKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedContent(data.generatedContent);
        await saveDraft();
      }
    } catch (e) {
      console.warn(`[Result] Section regeneration failed for ${sectionKey}:`, e);
    } finally {
      setRegeneratingSection(null);
    }
  };

  const handleAcceptAndSave = async () => {
    await saveDraft();
    setSaveSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-zylo-cyan/30 bg-gradient-to-r from-zylo-cyan/[0.06] to-zylo-purple/[0.06]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="font-mono text-[10px]">
              STEP 06 OF 06
            </Badge>
            <span className="text-xs text-zylo-cyan font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-zylo-emerald" /> Portfolio Draft Ready
            </span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-white tracking-tight">
            Your structured 3D portfolio draft is complete
          </h2>
          <p className="text-xs text-slate-300">
            Review the AI-synthesized narrative below. Regenerate individual sections or accept to save.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToStep("style")}
            className="text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Adjust Style
          </Button>

          <Button
            variant="glow"
            size="lg"
            onClick={handleAcceptAndSave}
            className="text-xs gap-2"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Saved! Redirecting...
              </>
            ) : (
              <>
                Accept & Save Draft <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 1. Hero Preview Section */}
      <Card className="glass-panel border-zylo-border p-6 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono">
              HERO SECTION
            </Badge>
            <Badge variant="cyan" className="text-[10px] py-0 px-1.5">
              {content.hero.badge}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRegenerateSection("hero")}
            disabled={regeneratingSection === "hero"}
            className="text-xs text-slate-400 hover:text-zylo-cyan gap-1.5 h-8"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${regeneratingSection === "hero" ? "animate-spin" : ""}`}
            />
            Regenerate Hero
          </Button>
        </div>

        <div className="space-y-2 pt-1 max-w-3xl">
          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight">
            {content.hero.headline}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">{content.hero.subheadline}</p>
          <div className="flex items-center gap-3 pt-3">
            <span className="px-4 py-2 rounded-lg bg-zylo-cyan text-black font-semibold text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              {content.hero.ctaText}
            </span>
            <span className="px-4 py-2 rounded-lg bg-white/5 border border-zylo-border text-slate-300 text-xs">
              {content.hero.secondaryCtaText}
            </span>
          </div>
        </div>
      </Card>

      {/* 2. About Preview Section */}
      <Card className="glass-panel border-zylo-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] font-mono">
            ABOUT SECTION
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRegenerateSection("about")}
            disabled={regeneratingSection === "about"}
            className="text-xs text-slate-400 hover:text-zylo-purple gap-1.5 h-8"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${regeneratingSection === "about" ? "animate-spin" : ""}`}
            />
            Regenerate About
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-base font-heading font-bold text-white">{content.about.title}</h4>
            <span className="text-xs font-mono text-zylo-purple">{content.about.tagline}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{content.about.body}</p>
          {content.about.highlights && (
            <div className="flex flex-wrap gap-2 pt-1">
              {content.about.highlights.map((hl, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-[10px] bg-zylo-elevated border-zylo-border text-slate-300"
                >
                  ✓ {hl}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* 3. Featured Projects Preview */}
      <Card className="glass-panel border-zylo-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] font-mono">
            PROJECTS ({content.projects.length})
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRegenerateSection("projects")}
            disabled={regeneratingSection === "projects"}
            className="text-xs text-slate-400 hover:text-zylo-cyan gap-1.5 h-8"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${regeneratingSection === "projects" ? "animate-spin" : ""}`}
            />
            Regenerate Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.projects.map((proj, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zylo-surface/60 border border-zylo-border space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{proj.title}</span>
                {proj.featured && (
                  <Badge variant="purple" className="text-[9px] py-0 px-1.5">
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{proj.summary}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {proj.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded text-[9px] bg-zylo-elevated text-slate-300 font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. SEO & Meta Tags Preview */}
      <Card className="glass-panel border-zylo-border p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-zylo-emerald" />
            <span className="text-xs font-semibold text-white">SEO & Social Graph Metadata</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRegenerateSection("seo")}
            disabled={regeneratingSection === "seo"}
            className="text-xs text-slate-400 hover:text-zylo-emerald gap-1.5 h-8"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${regeneratingSection === "seo" ? "animate-spin" : ""}`}
            />
            Regenerate SEO
          </Button>
        </div>

        <div className="p-3.5 rounded-xl bg-zylo-surface/80 border border-zylo-border space-y-1.5 text-xs">
          <div className="font-semibold text-zylo-cyan">{content.seo.metaTitle}</div>
          <p className="text-slate-400 text-[11px]">{content.seo.metaDescription}</p>
        </div>
      </Card>

      {/* Bottom Final Actions */}
      <div className="pt-6 border-t border-zylo-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => goToStep("profile")}
          className="text-xs gap-1.5 w-full sm:w-auto"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit Raw Profile Form
        </Button>

        <Button
          type="button"
          variant="glow"
          size="lg"
          onClick={handleAcceptAndSave}
          className="gap-2 text-xs w-full sm:w-auto"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" /> Saved! Redirecting...
            </>
          ) : (
            <>
              Save & Launch 3D Studio <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
