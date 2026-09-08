"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SceneRenderer } from "@zylo/three-engine";
import { SceneConfig } from "@/schemas/scene.schema";
import { ExternalLink, Edit3, Eye, Globe, Copy, Check } from "lucide-react";

export interface PortfolioCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPublished: boolean;
  themeName: string;
  sceneConfig: SceneConfig;
  updatedAt: string;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  id,
  slug,
  title,
  description,
  isPublished,
  themeName,
  sceneConfig,
  updatedAt,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="glass-panel glass-panel-hover border-zylo-border flex flex-col overflow-hidden group">
      {/* 3D Scene Mini Viewport */}
      <div className="relative h-48 w-full bg-gradient-to-b from-zylo-surface to-zylo-dark border-b border-zylo-border overflow-hidden">
        <SceneRenderer
          sceneConfig={sceneConfig}
          interactive={false}
          autoRotate={true}
          className="w-full h-full pointer-events-none"
        />

        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          {isPublished ? (
            <Badge variant="emerald" className="text-[10px] py-0.5 px-2 gap-1.5 backdrop-blur-md">
              <Globe className="w-3 h-3" /> Published
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] py-0.5 px-2 bg-black/40 text-slate-400">
              Draft
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <Badge variant="purple" className="text-[10px] py-0.5 px-2 backdrop-blur-md">
            {themeName}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <Link href={`/builder/${id}`} className="hover:underline">
            <CardTitle className="text-base font-heading font-semibold text-white group-hover:text-zylo-cyan transition-colors truncate">
              {title}
            </CardTitle>
          </Link>
        </div>

        {/* Clickable Slug Link */}
        <div className="flex items-center justify-between mt-1">
          <Link
            href={`/${slug}`}
            target="_blank"
            className="text-xs font-mono text-zylo-cyan/90 hover:text-zylo-cyan hover:underline flex items-center gap-1 truncate"
          >
            <span>zylo.design/{slug}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </Link>

          <button
            onClick={handleCopyLink}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Copy Public Link"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <CardDescription className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
          {description || "Interactive 3D WebGL Portfolio"}
        </CardDescription>
      </CardHeader>

      {/* Footer Actions */}
      <CardFooter className="p-5 pt-3 mt-auto border-t border-zylo-border/60 flex items-center justify-between gap-2">
        <Link href={`/preview/${id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-8.5 font-medium">
            <Eye className="w-3.5 h-3.5" /> Preview
          </Button>
        </Link>
        <Link href={`/builder/${id}`} className="flex-1">
          <Button variant="glow" size="sm" className="w-full text-xs gap-1.5 h-8.5 font-semibold">
            <Edit3 className="w-3.5 h-3.5" /> Edit Studio
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
