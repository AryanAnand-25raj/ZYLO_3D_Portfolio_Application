"use client";

import React, { useState } from "react";
import { X, Globe, FileText, Upload, Sparkles, CheckCircle, AlertCircle } from "lucide-react";

interface LinkedInFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

export const LinkedInFallbackModal: React.FC<LinkedInFallbackModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "url" | "archive">("text");
  const [inputVal, setInputVal] = useState("");
  const [applyToPortfolio, setApplyToPortfolio] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!inputVal.trim()) {
      setErrorMsg("Please provide valid input data.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/integrations/linkedin/fallback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: inputVal,
          applyToPortfolio,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process LinkedIn data");
      }

      setParsedPreview(data.parsed);
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to parse input");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0D111C] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090D16]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">LinkedIn Profile Import</h2>
              <p className="text-xs text-slate-400">
                Safe, permission-compliant profile import without automated scraping.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Scope Notice */}
        <div className="bg-blue-950/20 border-b border-blue-500/20 px-6 py-2.5 flex items-center gap-2 text-xs text-blue-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-blue-400" />
          <span>
            LinkedIn OAuth grants basic identity. Use this tool to paste or upload your public career highlights directly.
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2">
          <button
            onClick={() => {
              setActiveTab("text");
              setErrorMsg(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "text"
                ? "bg-blue-600 text-white font-semibold shadow-sm"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Paste Profile Text
          </button>
          <button
            onClick={() => {
              setActiveTab("url");
              setErrorMsg(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "url"
                ? "bg-blue-600 text-white font-semibold shadow-sm"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            LinkedIn URL
          </button>
          <button
            onClick={() => {
              setActiveTab("archive");
              setErrorMsg(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "archive"
                ? "bg-blue-600 text-white font-semibold shadow-sm"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            JSON Archive Export
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === "text" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Paste your headline, bio, experience summary, and skills:
              </label>
              <textarea
                rows={7}
                placeholder="Example:
Alex Vance
Senior Spatial & 3D Web Architect in San Francisco, CA
About: Pioneering real-time 3D WebGL experiences.
Experience: Principal Engineer at Dimension Studios
Skills: Three.js, React Three Fiber, GLSL, TypeScript"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          )}

          {activeTab === "url" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Your Public LinkedIn Profile URL:
              </label>
              <input
                type="url"
                placeholder="https://www.linkedin.com/in/alex-vance"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {activeTab === "archive" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Paste content of your LinkedIn Profile.json export:
              </label>
              <textarea
                rows={7}
                placeholder='{ "profile": { "firstName": "Alex", "lastName": "Vance", "headline": "3D Architect" } }'
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          )}

          {/* Success Preview */}
          {parsedPreview && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Successfully Parsed Profile Data</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px] pt-1">
                <div>Name: <span className="text-white">{parsedPreview.fullName || "Detected"}</span></div>
                <div>Headline: <span className="text-white">{parsedPreview.headline || "Detected"}</span></div>
                <div>Skills Extracted: <span className="text-white">{parsedPreview.skills?.length || 0}</span></div>
                <div>Experiences: <span className="text-white">{parsedPreview.experiences?.length || 0}</span></div>
              </div>
            </div>
          )}

          {/* Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="apply-to-portfolio"
              checked={applyToPortfolio}
              onChange={(e) => setApplyToPortfolio(e.target.checked)}
              className="rounded bg-black/40 border-white/20 text-blue-600 focus:ring-0 w-4 h-4"
            />
            <label htmlFor="apply-to-portfolio" className="text-xs text-slate-300 cursor-pointer">
              Automatically merge parsed career details into active 3D portfolio
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#090D16]">
          <span className="text-xs text-slate-500">
            Source attributed as <span className="text-blue-400 font-mono">linkedin</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !inputVal.trim()}
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Parsing..." : "Parse & Import"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
