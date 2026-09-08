"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  History,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2,
  Clock,
  Server,
  AlertCircle,
} from "lucide-react";
import { DeploymentRecord } from "@/modules/publishing/types";

interface DeploymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  onRollbackSuccess?: () => void;
}

export const DeploymentHistoryModal: React.FC<DeploymentHistoryModalProps> = ({
  isOpen,
  onClose,
  portfolioId,
  onRollbackSuccess,
}) => {
  const [deployments, setDeployments] = useState<DeploymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    async function loadHistory() {
      setLoading(true);
      setMessage(null);
      try {
        const res = await fetch(`/api/publish/${portfolioId}`);
        const data = await res.json();
        if (mounted && data.deployments) {
          setDeployments(data.deployments);
        }
      } catch {
        if (mounted) {
          setMessage({ type: "error", text: "Failed to load deployment history." });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadHistory();
    return () => {
      mounted = false;
    };
  }, [isOpen, portfolioId]);

  if (!isOpen) return null;

  const handleRollback = async (deployment: DeploymentRecord) => {
    if (
      !confirm(
        `Roll back live site to historical snapshot version v${deployment.versionNumber}? Current live version will be replaced.`
      )
    ) {
      return;
    }

    setRollingBackId(deployment.id);
    setMessage(null);

    try {
      const res = await fetch(`/api/publish/${portfolioId}/rollback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDeploymentId: deployment.id }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Rollback failed." });
        return;
      }

      setMessage({
        type: "success",
        text: `Successfully rolled back to version v${data.restoredVersionNumber}. Live site updated!`,
      });

      // Refresh list
      const updatedRes = await fetch(`/api/publish/${portfolioId}`);
      const updatedData = await updatedRes.json();
      if (updatedData.deployments) {
        setDeployments(updatedData.deployments);
      }

      if (onRollbackSuccess) onRollbackSuccess();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Rollback request failed.",
      });
    } finally {
      setRollingBackId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0B0F1C] border border-white/10 rounded-2xl shadow-2xl shadow-cyan-950/30 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Deployment History & Rollback</h2>
              <p className="text-xs text-slate-400">
                Audit immutable production versions and restore previous snapshots with 1-click
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
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-slate-300">
          {message && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                message.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              <span className="text-xs">Loading historical deployments...</span>
            </div>
          ) : deployments.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No historical deployments found. Publish your portfolio to create your first release!
            </div>
          ) : (
            <div className="space-y-3">
              {deployments.map((d, index) => (
                <div
                  key={d.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-white">v{d.versionNumber}</span>
                      {index === 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                          Latest Active
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase text-slate-400">
                        {d.provider}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(d.startedAt).toLocaleString()}
                      </span>
                      {d.deploymentUrl && (
                        <a
                          href={d.deploymentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>{d.deploymentUrl.replace(/^https?:\/\//, "")}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {index !== 0 && (
                      <button
                        onClick={() => handleRollback(d)}
                        disabled={rollingBackId === d.id}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-30"
                      >
                        {rollingBackId === d.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                        ) : (
                          <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                        )}
                        <span>Rollback</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
