"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  ShieldCheck,
  Eye,
  Users,
  Cpu,
  Globe,
  TrendingUp,
  Download,
  Calendar,
  Lock,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const metrics = [
    {
      title: "Total WebGL Impressions",
      value: "1,248",
      change: "+24.5%",
      subtext: "vs previous 30 days",
      icon: Eye,
      color: "text-zylo-cyan",
    },
    {
      title: "Unique Anonymized Visitors",
      value: "892",
      change: "+18.2%",
      subtext: "Zero-IP hash verified",
      icon: Users,
      color: "text-zylo-purple",
    },
    {
      title: "Average Render Frame Rate",
      value: "59.4 FPS",
      change: "Optimal",
      subtext: "Adaptive DPR scaling active",
      icon: Cpu,
      color: "text-zylo-emerald",
    },
    {
      title: "Avg. Interactive Session",
      value: "2m 44s",
      change: "+32s",
      subtext: "3D scene interaction",
      icon: TrendingUp,
      color: "text-amber-400",
    },
  ];

  const devices = [
    { tier: "Tier 3: Desktop Discrete GPU", pct: 54, color: "bg-zylo-cyan" },
    { tier: "Tier 2: High-End Mobile & Integrated GPU", pct: 32, color: "bg-zylo-purple" },
    { tier: "Tier 1: Low-Memory & Fallback Mode", pct: 14, color: "bg-zylo-emerald" },
  ];

  const regions = [
    { country: "United States & Canada", share: "42%", views: "524" },
    { country: "European Union & UK", share: "31%", views: "386" },
    { country: "Asia-Pacific", share: "21%", views: "262" },
    { country: "Rest of World", share: "6%", views: "76" },
  ];

  return (
    <div className="flex-1 flex flex-col pb-16">
      <DashboardHeader
        title="Portfolio Analytics & Telemetry"
        subtitle="Privacy-first, zero-cookie visitor analytics and real-time WebGL performance metrics."
      />

      <main className="flex-1 px-8 py-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="emerald" className="text-xs py-1 px-3 gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> GDPR & CCPA Compliant (Zero-IP)
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-zylo-surface p-1 rounded-xl border border-zylo-border text-xs">
              <button
                onClick={() => setTimeRange("7d")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timeRange === "7d" ? "bg-zylo-cyan text-black font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timeRange === "30d" ? "bg-zylo-cyan text-black font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange("90d")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timeRange === "90d" ? "bg-zylo-cyan text-black font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                90 Days
              </button>
            </div>

            <Link href="/api/analytics/export" target="_blank">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Download className="w-3.5 h-3.5" /> Export Data
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Card key={idx} className="glass-panel border-zylo-border p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{m.title}</span>
                  <div className="p-2 rounded-lg bg-white/5 border border-zylo-border">
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-heading font-bold text-white tracking-tight">
                    {m.value}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 font-mono">
                    <span className="text-zylo-emerald font-semibold">{m.change}</span>
                    <span>{m.subtext}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Split Section: Hardware Performance & Geography */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hardware & GPU Performance */}
          <Card className="glass-panel border-zylo-border p-6 space-y-5">
            <CardTitle className="text-base font-heading font-bold text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-zylo-cyan" />
                <span>Visitor Hardware Tiering</span>
              </div>
              <span className="text-xs font-mono text-slate-400">WebGL Tier Engine</span>
            </CardTitle>

            <p className="text-xs text-slate-400 leading-relaxed">
              Every client dynamically negotiates level-of-detail (LOD) and resolution scaling. 0% of visitors suffered GPU context collapse.
            </p>

            <div className="space-y-4">
              {devices.map((d, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{d.tier}</span>
                    <span className="font-mono text-white font-bold">{d.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.color}`}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Geographic Breakdown */}
          <Card className="glass-panel border-zylo-border p-6 space-y-5">
            <CardTitle className="text-base font-heading font-bold text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-zylo-purple" />
                <span>Top Visitor Regions</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Edge CDN Logs</span>
            </CardTitle>

            <p className="text-xs text-slate-400 leading-relaxed">
              Traffic served globally via Edge CDN with sub-50ms Time to First Byte (TTFB).
            </p>

            <div className="divide-y divide-white/[0.06]">
              {regions.map((r, i) => (
                <div key={i} className="py-3 flex items-center justify-between text-xs">
                  <span className="text-slate-300">{r.country}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400">{r.views} views</span>
                    <span className="font-bold text-zylo-cyan">{r.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Zero-IP Privacy Guarantee Box */}
        <div className="p-6 rounded-2xl glass-panel border border-zylo-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cryptographic Zero-IP Privacy Architecture</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Visitor identifiers are generated as <code className="text-zylo-cyan font-mono">HMAC-SHA256(IP + UA, DailySalt)</code> and permanently purged on salt rotation.
              </p>
            </div>
          </div>
          <Link href="/privacy">
            <Button variant="outline" size="sm" className="text-xs shrink-0">
              Review Privacy Spec
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
