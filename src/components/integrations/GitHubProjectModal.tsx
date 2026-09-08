"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Star,
  GitFork,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Search,
  Check,
  FolderGit2,
} from "lucide-react";

interface GitHubProjectItem {
  project: {
    id: string;
    name: string;
    fullName: string;
    description: string;
    url: string;
    homepage?: string;
    language?: string;
    topics: string[];
    stars: number;
    forks: number;
    isFork: boolean;
  };
  recommendation: {
    score: number;
    reasons: string[];
    recommendedCategory: string;
    highlightedTags: string[];
  };
}

interface GitHubProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositories: GitHubProjectItem[];
  onImportSelected: (selectedIds: string[]) => Promise<void>;
}

export const GitHubProjectModal: React.FC<GitHubProjectModalProps> = ({
  isOpen,
  onClose,
  repositories,
  onImportSelected,
}) => {
  const [activeTab, setActiveTab] = useState<"recommended" | "all" | "selected">("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    // By default, pre-select top 3 recommended
    const initial = new Set<string>();
    repositories
      .filter((r) => r.recommendation.score >= 70 && !r.project.isFork)
      .slice(0, 3)
      .forEach((r) => initial.add(r.project.id));
    return initial;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle selection
  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filtered repositories based on active tab & search
  const filtered = useMemo(() => {
    return repositories.filter((item) => {
      const p = item.project;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeTab === "recommended") {
        return item.recommendation.score >= 50 && !p.isFork;
      }
      if (activeTab === "selected") {
        return selectedIds.has(p.id);
      }
      return true;
    });
  }, [repositories, activeTab, searchQuery, selectedIds]);

  const handleImport = async () => {
    if (selectedIds.size === 0) return;
    setIsSubmitting(true);
    try {
      await onImportSelected(Array.from(selectedIds));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0D111C] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090D16]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Select GitHub Projects</h2>
              <p className="text-xs text-slate-400">
                Choose repositories to feature in your 3D interactive portfolio.
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

        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-b border-white/5 bg-[#0D111C]">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("recommended")}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === "recommended"
                  ? "bg-cyan-500 text-black font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Recommended ({repositories.filter((r) => r.recommendation.score >= 50).length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                activeTab === "all"
                  ? "bg-cyan-500 text-black font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Repositories ({repositories.length})
            </button>
            <button
              onClick={() => setActiveTab("selected")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                activeTab === "selected"
                  ? "bg-cyan-500 text-black font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Selected ({selectedIds.size})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-black/30 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Repository Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No repositories found matching current criteria.
            </div>
          ) : (
            filtered.map((item) => {
              const p = item.project;
              const rec = item.recommendation;
              const isSelected = selectedIds.has(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => handleToggle(p.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all ${
                    isSelected
                      ? "bg-cyan-950/20 border-cyan-500/50 shadow-md shadow-cyan-950/30"
                      : "bg-[#111827]/60 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-cyan-500 border-cyan-500 text-black"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors">
                            {p.name}
                          </h3>
                          {p.isFork && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                              Fork
                            </span>
                          )}
                          <span className="text-[10px] px-1.5 py-0.5 bg-white/5 text-slate-400 rounded">
                            {rec.recommendedCategory}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2">
                          {p.description || "No description provided."}
                        </p>

                        {/* Recommendation rationale */}
                        {rec.reasons.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/90 pt-1">
                            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{rec.reasons.slice(0, 2).join(" • ")}</span>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                          {p.language && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {p.language}
                            </span>
                          )}
                          {p.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400"
                            >
                              #{topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right side stats & score */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs">
                        <span className="font-semibold">{rec.score}</span>
                        <span className="text-[9px] text-cyan-500/70">SCORE</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          <span>{p.stars}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5 text-slate-400" />
                          <span>{p.forks}</span>
                        </div>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#090D16]">
          <div className="text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">{selectedIds.size}</span> projects selected for portfolio inclusion
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={selectedIds.size === 0 || isSubmitting}
              className="px-5 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? "Importing..." : "Add to Portfolio"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
