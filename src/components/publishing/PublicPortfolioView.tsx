"use client";

import React, { useState, useEffect } from "react";
import { PortfolioRenderer } from "@/components/templates/PortfolioRenderer";
import { PortfolioData } from "@/schemas/portfolio.schema";
import { AlertCircle, Eye, Sparkles } from "lucide-react";

interface PublicPortfolioViewProps {
  portfolio: PortfolioData;
  slug?: string;
  isPreview?: boolean;
}

export function PublicPortfolioView({
  portfolio,
  slug,
  isPreview = false,
}: PublicPortfolioViewProps) {
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Detect WebGL capability
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }

    // Detect prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  }, []);

  const templateId = (portfolio as any).templateId || (portfolio.design as any)?.templateId || "neural";

  return (
    <div className="relative min-h-screen w-full bg-[#05070f] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Optional Preview Banner */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 backdrop-blur-md text-black px-4 py-2 text-xs font-mono font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 animate-pulse" />
            <span>PREVIEW MODE — This is a private draft snapshot. Changes are not live until published.</span>
          </div>
          <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            Unpublished Draft
          </span>
        </div>
      )}

      {/* WebGL Fallback Notification Banner */}
      {!webglSupported && (
        <div className="fixed top-12 left-4 right-4 z-40 max-w-xl mx-auto bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md text-cyan-200 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <div className="font-semibold text-white">WebGL Hardware Acceleration Unavailable</div>
            <div className="text-xs text-slate-300">
              Rendering high-fidelity glassmorphic visual presentation with CSS ambient effects.
            </div>
          </div>
        </div>
      )}

      {/* Production Portfolio View (Zero editor gizmos, zero overlays) */}
      <PortfolioRenderer
        template={templateId}
        profile={portfolio.content?.profile}
        content={portfolio.content}
        theme={portfolio.design}
        scene={portfolio.scene}
        interactive={true}
        enable3D={webglSupported && !reducedMotion}
        className={isPreview ? "pt-10" : ""}
      />

      {/* Subtle Powered by ZYLO badge */}
      <footer className="relative z-20 py-8 border-t border-white/5 text-center text-xs text-slate-500 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Created with{" "}
            <a
              href="/"
              className="text-slate-300 hover:text-cyan-400 font-medium transition-colors"
            >
              ZYLO 3D
            </a>{" "}
            — The Spatial Web Portfolio Engine
          </span>
        </div>
      </footer>
    </div>
  );
}
