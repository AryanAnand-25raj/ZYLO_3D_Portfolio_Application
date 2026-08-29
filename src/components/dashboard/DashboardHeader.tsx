"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Bell, Sparkles, ExternalLink } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  onNewPortfolio?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "Studio Overview",
  subtitle = "Manage your 3D WebGL portfolios and design configurations.",
  onNewPortfolio,
}) => {
  return (
    <header className="h-20 border-b border-zylo-border bg-zylo-dark/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search portfolios, scenes..."
            className="pl-9 h-9 text-xs bg-zylo-surface/60 border-zylo-border"
          />
        </div>

        {/* Create New 3D Portfolio Action */}
        <Link href="/dashboard/portfolios/new">
          <Button variant="glow" size="sm" className="gap-2 text-xs">
            <Plus className="w-3.5 h-3.5" /> Create 3D Portfolio
          </Button>
        </Link>
      </div>
    </header>
  );
};
