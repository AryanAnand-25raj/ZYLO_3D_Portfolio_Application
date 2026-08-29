import * as React from "react";
import { cn } from "@/lib/utils";

export const Separator: React.FC<{
  orientation?: "horizontal" | "vertical";
  className?: string;
}> = ({ orientation = "horizontal", className }) => (
  <div
    className={cn(
      "shrink-0 bg-zylo-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
  />
);

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("animate-pulse rounded-md bg-zylo-surface/80", className)}
    {...props}
  />
);
