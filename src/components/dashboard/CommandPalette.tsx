"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Box,
  Palette,
  Sparkles,
  Layers,
  CreditCard,
  Settings,
  BarChart3,
  BookOpen,
  X,
  ArrowRight,
  Plus,
  Cpu,
  Eye,
} from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Actions" | "Resources";
  href: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
}

const COMMANDS: CommandItem[] = [
  {
    id: "new-portfolio",
    title: "Create New 3D Portfolio",
    category: "Actions",
    href: "/create",
    icon: Plus,
    description: "Launch the multi-agent 3D generation wizard",
    badge: "AI Powered",
  },
  {
    id: "builder-studio",
    title: "Open Visual 3D Builder",
    category: "Actions",
    href: "/builder/port-demo-1",
    icon: Box,
    description: "Edit scene nodes, camera, and lighting in real-time",
  },
  {
    id: "portfolios",
    title: "My Portfolios",
    category: "Navigation",
    href: "/dashboard/portfolios",
    icon: Layers,
    description: "View and manage your active and draft portfolios",
  },
  {
    id: "scenes",
    title: "3D Scene Studio",
    category: "Navigation",
    href: "/dashboard/scenes",
    icon: Box,
    description: "Explore and test procedural 3D scene presets",
  },
  {
    id: "themes",
    title: "Theme & Style Editor",
    category: "Navigation",
    href: "/dashboard/themes",
    icon: Palette,
    description: "Customize color palettes, typography, and glassmorphism",
  },
  {
    id: "analytics",
    title: "Analytics & Telemetry",
    category: "Navigation",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "View privacy-first visitor metrics and WebGL FPS logs",
  },
  {
    id: "billing",
    title: "Subscription & Billing",
    category: "Navigation",
    href: "/dashboard/billing",
    icon: CreditCard,
    description: "Manage PRO tier, payment methods, and invoices",
  },
  {
    id: "settings",
    title: "Studio Settings & Integrations",
    category: "Navigation",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Connect GitHub, export data, and configure account",
  },
  {
    id: "templates",
    title: "Browse 8 Production Templates",
    category: "Resources",
    href: "/templates",
    icon: Sparkles,
    description: "Explore Cyberpunk, Matrix, Spatial, and Orbit presets",
  },
  {
    id: "architecture",
    title: "System Architecture Blueprint",
    category: "Resources",
    href: "/architecture",
    icon: Cpu,
    description: "Review real-time dataflow, security, and edge CDN pipeline",
  },
  {
    id: "docs",
    title: "Technical Documentation",
    category: "Resources",
    href: "/docs",
    icon: BookOpen,
    description: "API references, schemas, and deployment guides",
  },
];

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or custom event
          window.dispatchEvent(new CustomEvent("open-command-palette"));
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-2xl bg-zylo-surface border border-zylo-border shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-zylo-border gap-3 bg-black/40">
          <Search className="w-4 h-4 text-zylo-cyan shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search studio..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-slate-400 border border-white/15">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Commands List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-white/[0.04]">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => handleSelect(cmd.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-zylo-elevated text-white border border-zylo-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg border ${
                        isSelected
                          ? "bg-zylo-cyan/15 border-zylo-cyan/40 text-zylo-cyan"
                          : "bg-white/5 border-white/10 text-slate-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {cmd.title}
                        </span>
                        {cmd.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zylo-cyan/15 text-zylo-cyan border border-zylo-cyan/30 font-mono">
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {cmd.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {cmd.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-zylo-cyan" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-zylo-border flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Navigation & Actions</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px]">
              ↵ Enter
            </kbd>
            <span>to execute</span>
          </div>
        </div>
      </div>
    </div>
  );
};
