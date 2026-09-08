"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Box,
  Layers,
  CheckCircle2,
} from "lucide-react";

export const CallToAction3D: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-zylo-dark border-t border-zylo-border">
      {/* 3D Warp Portal Glow Layers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-zylo-cyan/15 via-zylo-purple/20 to-pink-500/15 blur-[150px] pointer-events-none rounded-full" />

      {/* Decorative concentric rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/10 rounded-full pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-purple-500/10 rounded-full pointer-events-none" />

      <div className="container max-w-5xl px-4 sm:px-8 relative z-10 text-center">
        <div className="p-8 sm:p-14 rounded-3xl glass-panel border border-zylo-cyan/30 shadow-[0_0_60px_rgba(0,240,255,0.12)] space-y-7 bg-gradient-to-b from-zylo-surface/90 via-zylo-dark/95 to-black">
          <Badge variant="cyan" className="gap-2 px-3.5 py-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-zylo-cyan" /> Ready to Build in 3D?
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-[1.15]">
            Turn your resume into an{" "}
            <span className="text-gradient">Award-Winning 3D Website</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Join thousands of developers, 3D artists, AI engineers, and founders showcasing their
            achievements in high-performance WebGL. Free forever starter plan, zero credit card required.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button variant="glow" size="lg" className="gap-2.5 px-8 font-semibold shadow-xl shadow-zylo-cyan/20">
                Create Your 3D Portfolio Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg" className="gap-2 text-slate-200 hover:text-white border-white/20">
                <Box className="w-4 h-4 text-zylo-cyan" /> Browse 100 Presets
              </Button>
            </Link>
          </div>

          {/* Highlights checklist */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono border-t border-white/10">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-zylo-emerald" />
              <span>Free forever starter plan</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-zylo-cyan" />
              <span>Custom domain with SSL</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Real-time 60 FPS WebGL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
