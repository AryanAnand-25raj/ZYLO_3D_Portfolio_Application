import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Box, Plus, Sparkles } from "lucide-react";

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}> = ({
  title = "No 3D Portfolios Created Yet",
  description = "Launch your first dimensional portfolio workspace to configure 3D scenes, design themes, and content.",
  actionText = "Create First 3D Portfolio",
  actionHref = "/dashboard/portfolios/new",
}) => {
  return (
    <div className="rounded-2xl glass-panel border border-dashed border-zylo-border p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-zylo-cyan/10 border border-zylo-cyan/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
        <Box className="w-8 h-8 text-zylo-cyan" />
      </div>
      <h3 className="text-xl font-heading font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      <Link href={actionHref}>
        <Button variant="glow" size="lg" className="gap-2">
          <Plus className="w-4 h-4" /> {actionText}
        </Button>
      </Link>
    </div>
  );
};
