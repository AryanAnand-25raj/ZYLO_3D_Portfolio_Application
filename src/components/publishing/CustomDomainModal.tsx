"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Globe2,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
  Clock,
} from "lucide-react";
import { DomainRecord } from "@/modules/publishing/types";

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
}

export const CustomDomainModal: React.FC<CustomDomainModalProps> = ({
  isOpen,
  onClose,
  portfolioId,
}) => {
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hostnameInput, setHostnameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    async function loadDomains() {
      setLoading(true);
      setMessage(null);
      try {
        const res = await fetch(`/api/domains?portfolioId=${portfolioId}`);
        const data = await res.json();
        if (mounted && data.domains) {
          setDomains(data.domains);
        }
      } catch {
        if (mounted) {
          setMessage({ type: "error", text: "Failed to load domain configuration." });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDomains();
    return () => {
      mounted = false;
    };
  }, [isOpen, portfolioId]);

  if (!isOpen) return null;

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostnameInput.trim()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioId,
          hostname: hostnameInput.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Failed to register custom domain." });
        return;
      }

      setDomains((prev) => [...prev, data.domain]);
      setHostnameInput("");
      setMessage({
        type: "success",
        text: `Custom domain ${data.domain.hostname} registered. Configure the DNS records below to verify.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Network error registering domain",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (domainId: string) => {
    setVerifyingId(domainId);
    setMessage(null);

    try {
      const res = await fetch(`/api/domains/${domainId}/verify`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.verified) {
        setMessage({
          type: "success",
          text: "DNS Verified successfully! SSL Certificate issued and active.",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "DNS records not detected yet. Please allow propagation time.",
        });
      }

      // Update local state
      if (data.domain) {
        setDomains((prev) =>
          prev.map((d) => (d.id === domainId ? data.domain : d))
        );
      }
    } catch {
      setMessage({ type: "error", text: "DNS verification check failed." });
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDelete = async (domainId: string) => {
    if (!confirm("Are you sure you want to remove this custom domain?")) return;

    try {
      const res = await fetch(`/api/domains/${domainId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setDomains((prev) => prev.filter((d) => d.id !== domainId));
      }
    } catch {
      alert("Failed to remove domain.");
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0B0F1C] border border-white/10 rounded-2xl shadow-2xl shadow-cyan-950/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Custom Domain Management</h2>
              <p className="text-xs text-slate-400">
                Route your custom apex domain or subdomain with automated SSL and edge routing
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

          {/* Add Domain Form */}
          <form onSubmit={handleAddDomain} className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Add Custom Domain
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hostnameInput}
                onChange={(e) => setHostnameInput(e.target.value)}
                placeholder="portfolio.yourname.com or yourname.design"
                className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                disabled={isSubmitting || !hostnameInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Add Domain</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Apex domains (e.g. <code className="text-slate-400">example.com</code>) and subdomains (e.g. <code className="text-slate-400">portfolio.example.com</code>) are supported.
            </p>
          </form>

          {/* Domains List */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Configured Domains
            </h3>

            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="text-xs">Loading domains...</span>
              </div>
            ) : domains.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-white/10 rounded-xl">
                No custom domains connected yet.
              </div>
            ) : (
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div
                    key={domain.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3"
                  >
                    {/* Domain Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-white text-sm">
                          {domain.hostname}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase text-slate-400">
                          {domain.type}
                        </span>
                        {domain.status === "verified" ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Pending DNS</span>
                          </span>
                        )}
                      </div>

                      {/* SSL Status Badge (Strict, never fake!) */}
                      <div className="flex items-center gap-2">
                        <div className={`text-[11px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border ${
                          domain.sslStatus === "active"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}>
                          <Lock className="w-3 h-3" />
                          <span>SSL: {domain.sslStatus === "active" ? "Active (TLS 1.3)" : "Pending Verification"}</span>
                        </div>

                        <button
                          onClick={() => handleVerify(domain.id)}
                          disabled={verifyingId === domain.id}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-colors"
                          title="Check DNS Verification"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${verifyingId === domain.id ? "animate-spin" : ""}`} />
                        </button>

                        <button
                          onClick={() => handleDelete(domain.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Remove Domain"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* DNS Instructions Table */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-medium text-slate-400">Required DNS Records:</div>
                      <div className="overflow-x-auto rounded-lg border border-white/5 bg-black/40">
                        <table className="w-full text-left font-mono text-[11px]">
                          <thead className="bg-white/[0.03] text-slate-400 text-[10px] uppercase">
                            <tr>
                              <th className="py-1.5 px-3">Type</th>
                              <th className="py-1.5 px-3">Name / Host</th>
                              <th className="py-1.5 px-3">Value / Target</th>
                              <th className="py-1.5 px-3 text-right">Copy</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {domain.dnsRecords.map((r, i) => {
                              const key = `${domain.id}-${i}`;
                              return (
                                <tr key={key} className="hover:bg-white/[0.01]">
                                  <td className="py-1.5 px-3 text-cyan-400 font-bold">{r.type}</td>
                                  <td className="py-1.5 px-3 text-white">{r.name}</td>
                                  <td className="py-1.5 px-3 text-slate-300 truncate max-w-xs">{r.value}</td>
                                  <td className="py-1.5 px-3 text-right">
                                    <button
                                      onClick={() => copyToClipboard(r.value, key)}
                                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                                      title="Copy value"
                                    >
                                      {copiedKey === key ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
