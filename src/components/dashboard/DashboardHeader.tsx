"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Sparkles, Command } from "lucide-react";
import { CommandPalette } from "./CommandPalette";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  onNewPortfolio?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "Studio Overview",
  subtitle = "Manage your 3D WebGL portfolios and real-time scene configurations.",
  onNewPortfolio,
}) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setCommandPaletteOpen(true);
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, []);

  return (
    <>
      <header className="h-20 border-b border-zylo-border bg-zylo-dark/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Interactive Search Bar / Command Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden md:flex items-center justify-between w-64 h-9 px-3 rounded-lg text-xs bg-zylo-surface/60 hover:bg-zylo-surface/90 border border-zylo-border text-slate-400 hover:text-slate-200 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-zylo-cyan transition-colors" />
              <span>Search portfolios, scenes...</span>
            </div>
            <kbd className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-slate-400">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Create New 3D Portfolio Action */}
          <Link href="/create">
            <Button variant="glow" size="sm" className="gap-2 text-xs font-semibold">
              <Plus className="w-3.5 h-3.5" /> Create 3D Portfolio
            </Button>
          </Link>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
};
