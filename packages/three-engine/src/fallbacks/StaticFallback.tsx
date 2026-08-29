"use client";

import React from "react";

export interface StaticFallbackProps {
  className?: string;
  reason?: "unsupported" | "error" | "reduced_motion";
}

export const StaticFallback: React.FC<StaticFallbackProps> = ({
  className = "w-full h-full min-h-[400px]",
  reason = "unsupported",
}) => {
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center bg-zinc-950 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Ambient background glow layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.12),transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-cyan-500/20 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 blur-xl animate-pulse" />

      {/* Decorative center icon/ring */}
      <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-400/40 flex items-center justify-center bg-cyan-950/30">
          <div className="w-8 h-8 rounded-full bg-cyan-400/60 blur-xs" />
        </div>
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
          {reason === "reduced_motion"
            ? "3D Motion Reduced"
            : reason === "error"
            ? "3D Fallback Mode Active"
            : "Interactive 3D Layer Ready"}
        </p>
      </div>
    </div>
  );
};
