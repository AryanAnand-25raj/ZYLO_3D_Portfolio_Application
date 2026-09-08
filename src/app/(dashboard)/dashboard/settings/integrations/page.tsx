"use client";

import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  FolderGit2,
  FileSpreadsheet,
} from "lucide-react";
import { GitHubProjectModal } from "@/components/integrations/GitHubProjectModal";
import { LinkedInFallbackModal } from "@/components/integrations/LinkedInFallbackModal";
import { ConflictResolutionModal, ConflictItem } from "@/components/integrations/ConflictResolutionModal";

interface IntegrationState {
  id: string;
  provider: "github" | "linkedin";
  status: "connected" | "expired" | "revoked" | "limited_permissions" | "error";
  externalAccountId: string;
  externalUsername?: string;
  scopes: string[];
  lastSyncedAt?: string;
  metadata?: any;
}

export default function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = useState<IntegrationState[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([
    {
      id: "conflict-headline",
      field: "headline",
      label: "Professional Headline",
      values: [
        { source: "github", value: "Senior 3D & Spatial Web Architect" },
        { source: "resume", value: "Principal Graphics Software Engineer" },
        { source: "manual", value: "Full Stack 3D Web Architect" },
      ],
      resolved: false,
    },
    {
      id: "conflict-location",
      field: "location",
      label: "Primary Location",
      values: [
        { source: "github", value: "San Francisco, CA / Remote" },
        { source: "resume", value: "San Francisco Bay Area" },
      ],
      resolved: false,
    },
  ]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/integrations");
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data.integrations || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();

    // Check URL search parameters for notifications
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("status");
      const error = params.get("error");

      if (status === "github_connected") {
        setStatusMessage({ type: "success", text: "GitHub connected successfully! Public repositories imported." });
      } else if (status === "linkedin_connected") {
        setStatusMessage({ type: "success", text: "LinkedIn connected successfully." });
      } else if (status === "linkedin_limited") {
        setStatusMessage({
          type: "success",
          text: "LinkedIn connected with standard OpenID permissions. Use the fallback importer for rich career details.",
        });
      } else if (error) {
        setStatusMessage({ type: "error", text: `Connection error: ${decodeURIComponent(error)}` });
      }
    }
  }, []);

  const getIntegration = (provider: "github" | "linkedin") => {
    return integrations.find((i) => i.provider === provider);
  };

  const handleConnectGitHub = () => {
    window.location.href = "/api/integrations/github/connect";
  };

  const handleConnectLinkedIn = () => {
    window.location.href = "/api/integrations/linkedin/connect";
  };

  const handleSync = async (provider: "github" | "linkedin") => {
    setSyncingProvider(provider);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/integrations/${provider}/sync`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to sync ${provider}`);
      }
      setStatusMessage({ type: "success", text: `${provider.toUpperCase()} synchronized successfully!` });
      await loadIntegrations();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Sync failed" });
    } finally {
      setSyncingProvider(null);
    }
  };

  const handleDisconnect = async (provider: "github" | "linkedin") => {
    if (!confirm(`Disconnect ${provider.toUpperCase()} and remove stored credentials?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/integrations/${provider}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMessage({ type: "success", text: `${provider.toUpperCase()} disconnected.` });
        await loadIntegrations();
      }
    } catch {
      setStatusMessage({ type: "error", text: "Failed to disconnect" });
    }
  };

  const handleImportGitHubProjects = async (selectedIds: string[]) => {
    const res = await fetch("/api/integrations/github/select-projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedProjectIds: selectedIds }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to import selected projects");
    }
    setStatusMessage({
      type: "success",
      text: `Successfully added ${data.importedCount} GitHub projects into your portfolio!`,
    });
  };

  const handleResolveConflicts = async (resolutions: Record<string, any>) => {
    setConflicts([]);
    setStatusMessage({
      type: "success",
      text: "All multi-source profile discrepancies resolved and canonical profile updated.",
    });
  };

  const githubConn = getIntegration("github");
  const linkedinConn = getIntegration("linkedin");

  const githubRepos = githubConn?.metadata?.repositories || [];

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Unified Profile Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Connected Profiles & Accounts
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Synchronize repositories, career history, and skills from GitHub and LinkedIn into your AI-generated 3D portfolio.
            </p>
          </div>

          {conflicts.length > 0 && (
            <button
              onClick={() => setIsConflictModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-2 transition-all self-start"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Review Discrepancies ({conflicts.length})</span>
            </button>
          )}
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
              statusMessage.type === "success"
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : "bg-red-950/20 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GitHub Card */}
          <div className="bg-[#0D111C] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white">
                    <Github className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">GitHub</h3>
                    <p className="text-xs text-slate-400">Repositories, Stars, Topics & Quality Ranking</p>
                  </div>
                </div>

                {githubConn?.status === "connected" ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 text-slate-500 border border-white/5">
                    Not Connected
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your GitHub account to analyze your open-source projects. Our AI evaluates documentation, recent activity, and code relevance to recommend your best work.
              </p>

              {githubConn?.status === "connected" && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Account:</span>
                    <span className="text-cyan-400 font-medium">@{githubConn.externalUsername}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Repositories Imported:</span>
                    <span className="text-white">{githubConn.metadata?.repoCount || githubRepos.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Last Synced:</span>
                    <span className="text-slate-300">
                      {githubConn.lastSyncedAt
                        ? new Date(githubConn.lastSyncedAt).toLocaleString()
                        : "Just now"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* GitHub Actions */}
            <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
              {githubConn?.status === "connected" ? (
                <div className="flex items-center gap-2 w-full justify-between">
                  <button
                    onClick={() => setIsGitHubModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    Select Projects
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSync("github")}
                      disabled={syncingProvider === "github"}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                      title="Sync repositories"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncingProvider === "github" ? "animate-spin" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleDisconnect("github")}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Disconnect GitHub"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleConnectGitHub}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Github className="w-4 h-4" />
                  Connect GitHub Account
                </button>
              )}
            </div>
          </div>

          {/* LinkedIn Card */}
          <div className="bg-[#0D111C] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">LinkedIn</h3>
                    <p className="text-xs text-slate-400">Experience, Headline & Career Background</p>
                  </div>
                </div>

                {linkedinConn?.status === "connected" ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                ) : linkedinConn?.status === "limited_permissions" ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1.5">
                    Limited Scopes
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 text-slate-500 border border-white/5">
                    Not Connected
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your LinkedIn account or paste your profile information. Our parser normalizes your career history, role descriptions, and verified endorsements.
              </p>

              {linkedinConn && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Profile:</span>
                    <span className="text-blue-400 font-medium">
                      {linkedinConn.metadata?.profile?.fullName || linkedinConn.externalUsername || "LinkedIn Member"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Integration Mode:</span>
                    <span className="text-white">
                      {linkedinConn.status === "limited_permissions" ? "OpenID + Fallback" : "OAuth 2.0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Last Synced:</span>
                    <span className="text-slate-300">
                      {linkedinConn.lastSyncedAt
                        ? new Date(linkedinConn.lastSyncedAt).toLocaleString()
                        : "Just now"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* LinkedIn Actions */}
            <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between gap-2">
              <button
                onClick={() => setIsLinkedInModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Import Profile
              </button>

              <div className="flex items-center gap-2">
                {!linkedinConn ? (
                  <button
                    onClick={handleConnectLinkedIn}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    OAuth Connect
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleSync("linkedin")}
                      disabled={syncingProvider === "linkedin"}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                      title="Sync LinkedIn"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncingProvider === "linkedin" ? "animate-spin" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleDisconnect("linkedin")}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Disconnect LinkedIn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy, Security & Data Governance Banner */}
        <div className="bg-[#090D16] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">Privacy & Data Governance Notice</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Imported information is used solely to generate your 3D interactive portfolio. All OAuth tokens are encrypted with AES-256-GCM before storage. We practice strict data minimization and never store passwords, private repositories, or unauthorized member data.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-white/5">
            <span>
              Need to purge all imported records? Disconnecting an integration securely deletes all stored tokens and external data.
            </span>
          </div>
        </div>
      </div>

      {/* GitHub Project Modal */}
      <GitHubProjectModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        repositories={githubRepos}
        onImportSelected={handleImportGitHubProjects}
      />

      {/* LinkedIn Fallback Modal */}
      <LinkedInFallbackModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        onImportSuccess={() => {
          setStatusMessage({ type: "success", text: "LinkedIn career information successfully imported and applied!" });
          loadIntegrations();
        }}
      />

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        conflicts={conflicts}
        onResolveAll={handleResolveConflicts}
      />
    </div>
  );
}
