"use client";

import React from "react";
import Link from "next/link";
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  Globe,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  History,
  Globe2,
  ExternalLink,
} from "lucide-react";
import { DeviceMode } from "@/modules/builder/types";

export interface BuilderTopBarProps {
  portfolioTitle: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  deviceMode: DeviceMode;
  onDeviceChange: (mode: DeviceMode) => void;
  viewMode: "edit" | "preview";
  onToggleViewMode: () => void;
  onSave: () => void;
  onPublish: () => void;
  onOpenDomains?: () => void;
  onOpenHistory?: () => void;
  onSharePreview?: () => void;
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: string | null;
  isPublished?: boolean;
  publishedUrl?: string | null;
}

export const BuilderTopBar: React.FC<BuilderTopBarProps> = ({
  portfolioTitle,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  deviceMode,
  onDeviceChange,
  viewMode,
  onToggleViewMode,
  onSave,
  onPublish,
  onOpenDomains,
  onOpenHistory,
  onSharePreview,
  isSaving,
  isDirty,
  lastSavedAt,
  isPublished = false,
  publishedUrl = null,
}) => {

  return (
    <header className="h-14 border-b border-white/10 bg-[#070B14] px-4 flex items-center justify-between gap-4 select-none z-30">
      {/* Left: Logo & Portfolio Info & Undo/Redo */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Back to Dashboard"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-white tracking-wider">ZYLO</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
            Builder
          </span>
        </div>

        <div className="hidden sm:flex items-center text-xs text-slate-400 font-medium truncate max-w-[180px] md:max-w-xs">
          <span className="truncate">{portfolioTitle}</span>
        </div>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Undo / Redo buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Device Mode Switcher */}
      <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/10">
        <button
          onClick={() => onDeviceChange("desktop")}
          className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
            deviceMode === "desktop"
              ? "bg-white/15 text-cyan-400 font-medium"
              : "text-slate-400 hover:text-white"
          }`}
          title="Desktop View (100% width)"
          aria-label="Desktop preview mode"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">Desktop</span>
        </button>

        <button
          onClick={() => onDeviceChange("tablet")}
          className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
            deviceMode === "tablet"
              ? "bg-white/15 text-cyan-400 font-medium"
              : "text-slate-400 hover:text-white"
          }`}
          title="Tablet View (768px width)"
          aria-label="Tablet preview mode"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">Tablet</span>
        </button>

        <button
          onClick={() => onDeviceChange("mobile")}
          className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
            deviceMode === "mobile"
              ? "bg-white/15 text-cyan-400 font-medium"
              : "text-slate-400 hover:text-white"
          }`}
          title="Mobile View (390px width)"
          aria-label="Mobile preview mode"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">Mobile</span>
        </button>
      </div>

      {/* Right: Autosave Status, Preview Toggle, Save, Publish */}
      <div className="flex items-center gap-3">
        {/* Autosave Status */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
              <span>Saving...</span>
            </>
          ) : isDirty ? (
            <span className="text-amber-400/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Unsaved changes
            </span>
          ) : (
            <span className="text-emerald-400/80 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Saved
            </span>
          )}
        </div>

        {/* Live Preview Toggle */}
        <button
          onClick={onToggleViewMode}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
            viewMode === "preview"
              ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400"
              : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
          }`}
          title="Toggle Full Preview Mode"
        >
          {viewMode === "preview" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{viewMode === "preview" ? "Edit Mode" : "Preview"}</span>
        </button>

        {/* Share Preview Link */}
        {onSharePreview && (
          <button
            onClick={onSharePreview}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors hidden md:flex items-center gap-1 text-xs"
            title="Get Shareable 24h Preview Link"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Share</span>
          </button>
        )}

        {/* Custom Domains Modal Trigger */}
        {onOpenDomains && (
          <button
            onClick={onOpenDomains}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors hidden sm:flex items-center gap-1 text-xs"
            title="Manage Custom Domains"
          >
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">Domains</span>
          </button>
        )}

        {/* Deployment History Modal Trigger */}
        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors hidden sm:flex items-center gap-1 text-xs"
            title="Deployment History & Rollback"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
          </button>
        )}

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/15 text-white flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Save</span>
        </button>

        {/* Publish Button */}
        <button
          onClick={onPublish}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
            isPublished
              ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20"
              : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isPublished ? "Live" : "Publish"}</span>
        </button>
      </div>
    </header>
  );
};
