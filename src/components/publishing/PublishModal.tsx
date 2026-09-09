"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Globe,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Server,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  History,
  Settings2,
  PowerOff,
} from "lucide-react";
import { ValidationResult, DeploymentRecord, PublishedPortfolioRecord } from "@/modules/publishing/types";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  initialSlug?: string;
  onOpenDomains?: () => void;
  onOpenHistory?: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  portfolioId,
  initialSlug = "",
  onOpenDomains,
  onOpenHistory,
}) => {
  const [slug, setSlug] = useState(initialSlug);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentRecord, setDeploymentRecord] = useState<DeploymentRecord | null>(null);
  const [publishedRecord, setPublishedRecord] = useState<PublishedPortfolioRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"validate" | "deploying" | "success">("validate");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnpublishing, setIsUnpublishing] = useState(false);

  // Fetch status and run validation on open
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    async function loadStatusAndValidate() {
      setIsValidating(true);
      setErrorMessage(null);
      try {
        // 1. Check existing publish status
        const statusRes = await fetch(`/api/publish/${portfolioId}`);
        const statusData = await statusRes.json();
        if (mounted && statusData.published) {
          setPublishedRecord(statusData.published);
          if (!slug && statusData.published.slug) {
            setSlug(statusData.published.slug);
          }
        }

        // 2. Run pre-publish validation
        const valRes = await fetch(`/api/publish/${portfolioId}/validate`, {
          method: "POST",
        });
        const valData = await valRes.json();
        if (mounted) {
          if (valData.validation) {
            setValidation(valData.validation);
          }
        }
      } catch (err) {
        if (mounted) setErrorMessage("Failed to run validation checks.");
      } finally {
        if (mounted) setIsValidating(false);
      }
    }

    loadStatusAndValidate();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, portfolioId]);

  if (!isOpen) return null;

  const handleStartDeploy = async () => {
    setIsDeploying(true);
    setActiveTab("deploying");
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/publish/${portfolioId}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug.trim() || undefined }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Deployment failed.");
        if (data.deployment) setDeploymentRecord(data.deployment);
        return;
      }

      setDeploymentRecord(data.deployment);
      setPublishedRecord(data.published);
      setActiveTab("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Deployment network error");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm("Are you sure you want to unpublish this portfolio? The public URL will be deactivated immediately.")) {
      return;
    }

    setIsUnpublishing(true);
    try {
      const res = await fetch(`/api/publish/${portfolioId}/unpublish`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setPublishedRecord(null);
        alert("Portfolio has been unpublished.");
        onClose();
      } else {
        alert(data.error || "Failed to unpublish.");
      }
    } catch {
      alert("Failed to unpublish.");
    } finally {
      setIsUnpublishing(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const liveUrl = publishedRecord?.deploymentUrl || `http://localhost:3000/${slug || "portfolio"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0B0F1C] border border-white/10 rounded-2xl shadow-2xl shadow-cyan-950/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Publish Portfolio</h2>
              <p className="text-xs text-slate-400">
                Deploy immutable production snapshot to the global edge network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === "validate" && (
            <>
              {/* Slug configuration input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Public URL Path / Slug
                </label>
                <div className="flex items-center rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-xs focus-within:border-cyan-500/50">
                  <span className="text-slate-500 font-mono select-none">https://zylo.design/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="your-name-3d"
                    className="flex-1 bg-transparent text-white font-mono outline-none px-1"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Lowercase alphanumeric letters and hyphens only.
                </p>
              </div>

              {/* Pre-Publish Validation Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Pre-Publish Validation Engine</span>
                  </h3>
                  {validation && (
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                      validation.canPublish
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {validation.canPublish ? "Ready to Publish" : `${validation.criticalErrorsCount} Blocking Issue(s)`}
                    </span>
                  )}
                </div>

                {isValidating ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                    <span className="text-xs">Analyzing profile, 3D nodes, and assets...</span>
                  </div>
                ) : validation ? (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {validation.checks.map((c) => (
                      <div
                        key={c.id}
                        className={`flex items-start justify-between gap-3 p-2.5 rounded-xl border text-xs transition-colors ${
                          c.passed
                            ? "bg-white/[0.02] border-white/5 text-slate-300"
                            : c.severity === "critical"
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {c.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : c.severity === "critical" ? (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                          <div>
                            <span className="font-medium text-white">{c.name}</span>
                            <p className="text-[11px] opacity-80">{c.message}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/40 border border-white/10 shrink-0">
                          {c.category}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Already published status notification */}
              {publishedRecord && publishedRecord.status === "published" && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Live at: <strong className="text-white font-mono">{publishedRecord.deploymentUrl}</strong></span>
                  </div>
                  <button
                    onClick={handleUnpublish}
                    disabled={isUnpublishing}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>{isUnpublishing ? "Unpublishing..." : "Unpublish"}</span>
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "deploying" && (
            <div className="py-6 space-y-4">
              <div className="text-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
                <h3 className="text-base font-semibold text-white">Deploying to Edge Network</h3>
                <p className="text-xs text-slate-400">
                  Freezing immutable snapshot, optimizing 3D assets, and configuring edge CDN routes...
                </p>
              </div>

              {/* Pipeline Log Stream */}
              <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
                <div className="text-slate-500">[1/5] Queuing production build worker...</div>
                <div className="text-cyan-400">[2/5] Verified scene nodes and approved asset manifests.</div>
                <div className="text-cyan-400">[3/5] Cloned draft and created immutable published snapshot.</div>
                <div className="text-cyan-400">[4/5] Promoted asset references to edge CDN.</div>
                <div className="text-amber-400">[5/5] Propagating public route...</div>
              </div>
            </div>
          )}

          {activeTab === "success" && (
            <div className="py-4 space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <Sparkles className="w-7 h-7 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Your 3D Portfolio is Live!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Public production snapshot deployed successfully.
                </p>
              </div>

              {/* Live URL Box */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-cyan-500/30 font-mono text-xs text-cyan-300">
                <span className="truncate pr-2">{liveUrl}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopyUrl(liveUrl)}
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Copy URL"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Additional Options */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
                {onOpenDomains && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDomains();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Connect Custom Domain</span>
                  </button>
                )}
                {onOpenHistory && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenHistory();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Deployment History</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {activeTab === "success" ? "Done" : "Cancel"}
          </button>

          {activeTab === "validate" && (
            <button
              onClick={handleStartDeploy}
              disabled={isValidating || !validation?.canPublish}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none text-black flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
            >
              <span>Deploy to Production</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {activeTab === "success" && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
