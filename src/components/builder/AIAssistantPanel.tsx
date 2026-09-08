"use client";

import React, { useState } from "react";
import { Sparkles, Send, Check, X, ArrowRight, Loader2, Wand2 } from "lucide-react";

export interface AIAssistantPanelProps {
  onExecuteAIPrompt: (prompt: string, previewOnly: boolean) => Promise<any>;
  onAcceptDiff?: () => void;
  onRejectDiff?: () => void;
  diffPreview?: {
    prompt: string;
    explanation: string;
    operations: any[];
  } | null;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  onExecuteAIPrompt,
  onAcceptDiff,
  onRejectDiff,
  diffPreview,
}) => {
  const [promptInput, setPromptInput] = useState("");
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Make my hero look more futuristic.",
    "Make the portfolio more minimal.",
    "Add an orbit around the planet.",
    "Slow down all animations.",
    "Change the accent color to violet.",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || loading) return;

    setLoading(true);
    try {
      await onExecuteAIPrompt(promptInput, true); // Trigger preview first
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = async (sample: string) => {
    setPromptInput(sample);
    setLoading(true);
    try {
      await onExecuteAIPrompt(sample, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 p-4">
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          AI Portfolio Assistant
        </h3>
        <p className="text-[11px] text-slate-400">
          Describe desired visual, 3D, or content transformations in natural language.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g. Make my hero look more futuristic and change accent color to violet..."
            rows={3}
            className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!promptInput.trim() || loading}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center gap-2 disabled:opacity-40 transition-all shadow-md shadow-cyan-500/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating Safe Patches...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>Generate AI Changes</span>
            </>
          )}
        </button>
      </form>

      {/* Diff Review Card */}
      {diffPreview && (
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/[0.04] space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Proposed Changes
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              {diffPreview.operations.length} Patches
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {diffPreview.explanation}
          </p>

          <div className="space-y-1 bg-black/40 p-2.5 rounded-lg font-mono text-[10px] text-slate-400 max-h-32 overflow-y-auto">
            {diffPreview.operations.map((op, idx) => (
              <div key={idx} className="truncate">
                <span className="text-cyan-400">{op.op}</span> {op.path}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onAcceptDiff}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-3.5 h-3.5" /> Accept & Apply
            </button>
            <button
              onClick={onRejectDiff}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Suggested Prompt Chips */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
          Quick Prompts
        </span>
        <div className="space-y-1.5">
          {samplePrompts.map((sample) => (
            <button
              key={sample}
              onClick={() => handleSampleClick(sample)}
              className="w-full text-left p-2 rounded-lg text-[11px] text-slate-300 bg-white/[0.02] hover:bg-white/[0.06] hover:text-white border border-white/5 transition-all flex items-center justify-between group"
            >
              <span className="truncate">{sample}</span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
