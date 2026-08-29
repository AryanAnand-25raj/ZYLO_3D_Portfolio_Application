"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SceneRenderer } from "@zylo/three-engine";
import { SceneConfig } from "@/schemas/scene.schema";
import { ExternalLink, Edit3, Eye, MoreHorizontal, Sparkles, Globe } from "lucide-react";

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
        <div className="absolute top-3 left-3 flex items-center gap-2">
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

        <div className="absolute top-3 right-3">
          <Badge variant="purple" className="text-[10px] py-0.5 px-2 backdrop-blur-md">
            {themeName}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-heading font-semibold text-white group-hover:text-zylo-cyan transition-colors truncate">
            {title}
          </CardTitle>
        </div>
        <span className="text-xs font-mono text-zylo-cyan/80 truncate">
          zylo.design/{slug}
        </span>
        <CardDescription className="text-xs text-slate-400 line-clamp-2 mt-1">
          {description || "Interactive 3D WebGL Portfolio"}
        </CardDescription>
      </CardHeader>

      {/* Footer Actions */}
      <CardFooter className="p-5 pt-4 mt-auto border-t border-zylo-border/60 flex items-center justify-between gap-2">
        <Link href={`/p/${slug}`} target="_blank" className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-8">
            <Eye className="w-3.5 h-3.5" /> Preview
          </Button>
        </Link>
        <Link href={`/dashboard/portfolios/${id}/edit`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full text-xs gap-1.5 h-8">
            <Edit3 className="w-3.5 h-3.5" /> Edit Studio
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
