"use client";

import React from "react";
import { useDraft } from "@/components/create/DraftProvider";
import { ResumeUploader } from "@/components/create/ResumeUploader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Sparkles, FileText } from "lucide-react";

export default function CreateResumeStepPage() {
  const { prevStep, nextStep } = useDraft();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="font-mono text-[10px]">
            STEP 02 OF 06
          </Badge>
          <span className="text-xs text-slate-400 font-mono">Resume Extraction Pipeline</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
          Upload your Resume or CV
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl">
          Our sandboxed AI parser extracts work experience, project history, technical skills, and
          education behind a private storage layer adhering strictly to factual accuracy.
        </p>
      </div>

      {/* Production Uploader Component */}
      <ResumeUploader />

      {/* Skip / Manual Option */}
      <div className="pt-6 border-t border-zylo-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="gap-2 text-xs w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={nextStep}
            className="text-xs text-slate-400 hover:text-white"
          >
            Skip Resume Upload (Enter Manually)
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={nextStep}
            className="gap-2 text-xs"
          >
            Review Details <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
