"use client";

import React, { useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PerformanceTier } from "../schemas/scene.schema";

export interface DebugHUDProps {
  tier: PerformanceTier;
  sceneNodeCount: number;
}

export const DebugHUD: React.FC<DebugHUDProps> = ({ tier, sceneNodeCount }) => {
  const { gl } = useThree();
  const [fps, setFps] = useState(60);
  const [drawCalls, setDrawCalls] = useState(0);
  const [triangles, setTriangles] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      setFps(Math.round(frameCount / delta));
      frameCount = 0;
      lastTime = now;

      if (gl?.info) {
        setDrawCalls(gl.info.render.calls);
        setTriangles(gl.info.render.triangles);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [gl]);

  useFrame(() => {
    // Increment on every tick
  });

  return (
    <div className="absolute top-4 left-4 z-50 p-3 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300 pointer-events-none shadow-xl">
      <div className="font-bold text-cyan-400 mb-1 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        ZYLO 3D Engine HUD
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-zinc-300">
        <div>FPS: <span className={fps < 30 ? "text-red-400" : "text-emerald-400 font-bold"}>{fps}</span></div>
        <div>Tier: <span className="text-cyan-300 uppercase font-semibold">{tier}</span></div>
        <div>Draw Calls: <span className="text-zinc-200">{drawCalls}</span></div>
        <div>Triangles: <span className="text-zinc-200">{triangles.toLocaleString()}</span></div>
        <div>Active Nodes: <span className="text-zinc-200">{sceneNodeCount}</span></div>
        <div>DPR: <span className="text-zinc-200">{typeof window !== "undefined" ? window.devicePixelRatio : 1}</span></div>
      </div>
    </div>
  );
};
