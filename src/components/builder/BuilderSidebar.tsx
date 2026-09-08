"use client";

import React from "react";
import {
  Layers,
  FileText,
  Box,
  Palette,
  Package,
  Sparkles,
  History,
} from "lucide-react";
import { SidebarTab } from "@/modules/builder/types";

export interface BuilderSidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: Array<{ id: SidebarTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "sections", label: "Sections", icon: Layers },
    { id: "content", label: "Content", icon: FileText },
    { id: "scene", label: "3D Scene", icon: Box },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "assets", label: "Assets", icon: Package },
    { id: "ai", label: "AI Assistant", icon: Sparkles },
    { id: "versions", label: "History", icon: History },
  ];

  return (
    <aside
      aria-label="Builder Sidebar Navigation"
      className="w-16 md:w-56 bg-[#070B14] border-r border-white/10 flex flex-col justify-between py-4 select-none shrink-0"
    >
      <div className="space-y-1 px-2">
        <div className="px-3 pb-2 hidden md:block">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Editor Navigation
          </span>
        </div>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
              title={tab.label}
              aria-label={tab.label}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              <span className="hidden md:inline truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="px-3 text-center hidden md:block border-t border-white/10 pt-4">
        <span className="text-[10px] font-mono text-slate-500 block">
          ZYLO Visual Engine v1.0
        </span>
      </div>
    </aside>
  );
};
