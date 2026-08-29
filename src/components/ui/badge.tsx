import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "cyan" | "purple" | "emerald";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground",
    outline: "text-foreground border border-zylo-border",
    cyan: "border-cyan-500/30 bg-cyan-500/10 text-zylo-cyan shadow-[0_0_12px_rgba(0,240,255,0.15)]",
    purple: "border-purple-500/30 bg-purple-500/10 text-zylo-purple shadow-[0_0_12px_rgba(157,0,255,0.15)]",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-zylo-emerald shadow-[0_0_12px_rgba(0,255,157,0.15)]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
