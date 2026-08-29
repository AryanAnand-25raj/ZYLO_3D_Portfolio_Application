"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Box,
  Palette,
  Layers,
  Sparkles,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Portfolios",
      href: "/dashboard/portfolios",
      icon: Layers,
      count: "1",
    },
    {
      title: "3D Scene Studio",
      href: "/dashboard/scenes",
      icon: Box,
    },
    {
      title: "Theme Editor",
      href: "/dashboard/themes",
      icon: Palette,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Subscription & Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
      badge: "PRO",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 border-r border-zylo-border bg-zylo-dark/95 flex flex-col justify-between shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-zylo-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-zylo-cyan via-zylo-purple to-zylo-pink flex items-center justify-center p-[1px]">
            <div className="w-full h-full bg-zylo-dark rounded-[7px] flex items-center justify-center">
              <Box className="w-4 h-4 text-zylo-cyan" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg text-white">ZYLO Studio</span>
            <span className="text-[10px] text-slate-500 font-mono">3D PORTFOLIO ENGINE</span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-zylo-elevated text-zylo-cyan border border-zylo-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.08)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-zylo-cyan" : "text-slate-400"}`} />
                <span>{item.title}</span>
              </div>
              {item.count && (
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-slate-300 font-mono">
                  {item.count}
                </span>
              )}
              {item.badge && (
                <Badge variant="purple" className="text-[9px] py-0 px-1.5 font-mono">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Profile & Subscription Footer */}
      <div className="p-4 border-t border-zylo-border bg-zylo-surface/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar
              src={session?.user?.image}
              fallback={session?.user?.name || "Alex Vance"}
              size="sm"
            />
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white truncate">
                {session?.user?.name || "Alex Vance"}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {session?.user?.email || "alex@zylo.design"}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2.5 rounded-lg bg-zylo-elevated border border-zylo-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-zylo-cyan" />
            <span>Pro Creator</span>
          </div>
          <Badge variant="cyan" className="text-[10px] py-0 px-1.5">
            Active
          </Badge>
        </div>
      </div>
    </aside>
  );
};
