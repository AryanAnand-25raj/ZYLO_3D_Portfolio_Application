"use client";

import React from "react";
import { STEPS, useDraft } from "./DraftProvider";
import { Check, Cloud, Sparkles, RefreshCw } from "lucide-react";

export const StepIndicator: React.FC = () => {
  const { currentStep, goToStep, isSaving } = useDraft();

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full border-b border-zylo-border bg-zylo-dark/90 backdrop-blur-xl sticky top-16 z-40 px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Step Progression Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isCurrent
                    ? "bg-zylo-elevated text-zylo-cyan border border-zylo-cyan/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                    : isCompleted
                    ? "text-slate-300 hover:text-white bg-white/5 border border-transparent"
                    : "text-slate-500 hover:text-slate-400"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isCurrent
                      ? "bg-zylo-cyan text-black"
                      : isCompleted
                      ? "bg-zylo-emerald/20 text-zylo-emerald border border-zylo-emerald/40"
                      : "bg-white/5 text-slate-500 border border-white/10"
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : step.number}
                </div>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Autosave Status Pill */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-amber-400">
              <RefreshCw className="w-3 h-3 animate-spin" /> Autosaving...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-zylo-emerald" />
              Draft saved locally & cloud
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
