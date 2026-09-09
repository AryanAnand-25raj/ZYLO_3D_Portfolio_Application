"use client";

import React, { useEffect } from "react";
import { useDraft } from "@/components/create/DraftProvider";
import { ConflictResolver } from "@/components/create/ConflictResolver";
import { ExperienceManager } from "@/components/create/ExperienceManager";
import { ProjectManager } from "@/components/create/ProjectManager";
import { SkillsInput } from "@/components/create/SkillsInput";
import { EducationManager } from "@/components/create/EducationManager";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";

export default function CreateReviewStepPage() {
  const {
    profileData,
    setProfileData,
    extractedData,
    conflicts,
    setConflicts,
    resolveConflict,
    prevStep,
    nextStep,
    saveDraft,
  } = useDraft();

  // Run normalization & conflict detection when entering review step
  useEffect(() => {
    async function runNormalize() {
      try {
        const res = await fetch("/api/ai/profile/normalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            manualData: profileData,
            extractedData,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.conflicts && data.conflicts.length > 0) {
            setConflicts(data.conflicts);
          }
          if (data.canonicalProfile) {
            setProfileData(data.canonicalProfile);
          }
        }
      } catch (e) {
        console.warn("[Review] Normalization fetch failed:", e);
      }
    }

    runNormalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedData]);

  const handleContinue = async () => {
    await saveDraft();
    nextStep();
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="font-mono text-[10px]">
            STEP 03 OF 06
          </Badge>
          <span className="text-xs text-slate-400 font-mono">Data Normalization & Review</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
          Review & Refine Your Canonical Portfolio Data
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl">
          Review extracted items, resolve any discrepancies, and ensure all work experiences,
          projects, and skills are accurate before AI content generation.
        </p>
      </div>

      {/* Review Notice Banner */}
      <div className="p-4 rounded-xl glass-panel border border-zylo-cyan/30 bg-zylo-cyan/[0.04] text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-zylo-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5">Please review extracted information:</strong>
          Our parser extracts factual entities without inventing new data. You have complete
          control to edit, add, or remove any item below.
        </div>
      </div>

      {/* Conflict Resolver (if conflicts detected) */}
      <ConflictResolver conflicts={conflicts} onResolve={resolveConflict} />

      {/* Experience Manager */}
      <ExperienceManager
        experiences={profileData.experiences}
        onChange={(updated) => setProfileData({ ...profileData, experiences: updated })}
      />

      {/* Project Manager */}
      <ProjectManager
        projects={profileData.projects}
        onChange={(updated) => setProfileData({ ...profileData, projects: updated })}
      />

      {/* Skills Manager */}
      <SkillsInput
        categories={profileData.skillCategories}
        onChange={(updated) => setProfileData({ ...profileData, skillCategories: updated })}
      />

      {/* Education Manager */}
      <EducationManager
        education={profileData.education}
        onChange={(updated) => setProfileData({ ...profileData, education: updated })}
      />

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-zylo-border flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="gap-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resume
        </Button>

        <Button
          type="button"
          variant="glow"
          size="lg"
          onClick={handleContinue}
          className="gap-2 text-xs"
        >
          Proceed to Style & Preferences <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
