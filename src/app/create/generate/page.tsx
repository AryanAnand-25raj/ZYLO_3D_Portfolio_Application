"use client";

import React, { useState, useEffect } from "react";
import { useDraft } from "@/components/create/DraftProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Cpu,
  Layers,
  FileCheck,
} from "lucide-react";

export default function CreateGenerateStepPage() {
  const {
    profileData,
    preferences,
    completeness,
    setCompleteness,
    followUpQuestions,
    setFollowUpQuestions,
    answerQuestion,
    skipQuestion,
    setGeneratedContent,
    nextStep,
    prevStep,
    saveDraft,
  } = useDraft();

  const [currentStage, setCurrentStage] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const pipelineStages = [
    { title: "Analyzing Resume & Factual History", desc: "Checking factual credentials & companies" },
    { title: "Understanding Profile Architecture", desc: "Synthesizing bio, roles & technical specializations" },
    { title: "Reviewing Featured Projects", desc: "Extracting measurable highlights & tech stacks" },
    { title: `Applying "${preferences.preset}" Style Tokens`, desc: "Aligning narrative with chosen 3D visual atmosphere" },
    { title: "Synthesizing Portfolio Content", desc: "Drafting hero, about, projects, skills & SEO tags" },
    { title: "Validating Structured Output", desc: "Enforcing strict Zod schema compliance" },
  ];

  // Run completeness analysis on mount
  useEffect(() => {
    async function runAnalysis() {
      setIsAnalyzing(true);
      try {
        const res = await fetch("/api/ai/profile/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: profileData,
            selectedSections: preferences.selectedSections,
            preferences,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setCompleteness(data);
          if (data.questions && data.questions.length > 0) {
            setFollowUpQuestions(data.questions);
          }
        }
      } catch (e) {
        console.warn("[Generate] Completeness analysis fetch failed:", e);
      } finally {
        setIsAnalyzing(false);
      }
    }

    runAnalysis();
  }, []);

  const triggerGeneration = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setCurrentStage(0);

    // Simulate authentic pipeline transitions
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < pipelineStages.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 450);

    try {
      const res = await fetch("/api/ai/portfolio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profileData,
          preferences,
          answeredQuestions: followUpQuestions.filter((q) => !q.skipped && q.answer.trim().length > 0),
        }),
      });

      clearInterval(interval);
      setCurrentStage(pipelineStages.length);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate portfolio content");
      }

      const data = await res.json();
      setGeneratedContent(data.generatedContent);
      await saveDraft();

      setTimeout(() => {
        nextStep();
      }, 600);
    } catch (e) {
      setGenerationError(e instanceof Error ? e.message : "Error during AI generation.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="font-mono text-[10px]">
            STEP 05 OF 06
          </Badge>
          <span className="text-xs text-slate-400 font-mono">AI Content Generation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
          AI Analysis & Content Synthesis
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl">
          Review your profile completeness score, answer optional follow-up questions to enrich your
          narrative, and launch the structured portfolio content generator.
        </p>
      </div>

      {/* Completeness Meter Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="glass-panel border-zylo-border p-6 md:col-span-4 flex flex-col justify-between items-center text-center space-y-4">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-zylo-cyan transition-all duration-1000 ease-out"
                strokeDasharray={`${completeness?.score || 85}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-heading font-bold text-white">
                {completeness?.score || 85}%
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-mono">Profile Score</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-white">Completeness Evaluation</h4>
            <p className="text-[11px] text-slate-400">
              {completeness && completeness.score >= 80
                ? "Profile is rich and ready for high-fidelity 3D generation."
                : "Answer follow-up questions to maximize presentation quality."}
            </p>
          </div>
        </Card>

        {/* Recommendations & Follow-Up Questions */}
        <Card className="glass-panel border-zylo-border p-6 md:col-span-8 space-y-4">
          <CardHeader className="p-0 space-y-1">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-zylo-purple" /> Optional Follow-Up Questions
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Short questions detected by the AI to make your 3D portfolio stand out.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-3">
            {followUpQuestions.length === 0 ? (
              <div className="p-4 rounded-xl bg-zylo-surface/40 text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zylo-emerald shrink-0" />
                <span>All key narrative fields populated! Ready to generate.</span>
              </div>
            ) : (
              followUpQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    q.skipped
                      ? "bg-white/[0.01] border-zylo-border opacity-50"
                      : "glass-panel border-zylo-border space-y-2"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-medium text-slate-200">{q.question}</span>
                    <Badge variant="outline" className="text-[9px] font-mono shrink-0">
                      {q.section}
                    </Badge>
                  </div>

                  {!q.skipped && (
                    <div className="space-y-2 pt-1">
                      <Input
                        value={q.answer}
                        onChange={(e) => answerQuestion(q.id, e.target.value)}
                        placeholder="Your answer (e.g. Architected custom WebGL shader pipeline)..."
                        className="h-8 text-xs bg-zylo-surface/80"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => skipQuestion(q.id)}
                          className="text-[10px] text-slate-500 hover:text-slate-400"
                        >
                          Skip question
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Real-time AI Generation Stages Card */}
      <Card className="glass-panel border-zylo-border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-heading font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-zylo-cyan" /> Generation Pipeline Stages
            </h4>
            <p className="text-xs text-slate-400">
              Transforming canonical history and &quot;{preferences.preset}&quot; preferences into structured portfolio JSON.
            </p>
          </div>
          {isGenerating && (
            <Badge variant="cyan" className="font-mono text-[10px] animate-pulse">
              Synthesizing...
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {pipelineStages.map((stage, idx) => {
            const isDone = currentStage > idx;
            const isActive = currentStage === idx && isGenerating;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  isDone
                    ? "bg-zylo-emerald/[0.05] border-zylo-emerald/30 text-slate-300"
                    : isActive
                    ? "bg-zylo-cyan/[0.08] border-zylo-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)] text-white"
                    : "bg-zylo-surface/40 border-zylo-border text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">{stage.title}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-zylo-emerald shrink-0" />
                  ) : isActive ? (
                    <RefreshCw className="w-3.5 h-3.5 text-zylo-cyan animate-spin shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white/10 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">{stage.desc}</p>
              </div>
            );
          })}
        </div>

        {generationError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generationError}</span>
          </div>
        )}
      </Card>

      {/* Navigation Actions */}
      <div className="pt-6 border-t border-zylo-border flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={isGenerating}
          className="gap-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Style
        </Button>

        <Button
          type="button"
          variant="glow"
          size="lg"
          onClick={triggerGeneration}
          disabled={isGenerating}
          className="gap-2 text-xs"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing Content...
            </>
          ) : (
            <>
              Generate Portfolio Content Draft <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
