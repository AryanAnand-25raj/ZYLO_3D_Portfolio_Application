import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glow" | "neon";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
      outline: "border border-zylo-border bg-transparent hover:bg-white/5 hover:border-white/20 text-foreground",
      secondary: "bg-zylo-elevated text-foreground hover:bg-zylo-elevated/80 border border-zylo-border",
      ghost: "hover:bg-white/5 hover:text-white text-muted-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      glow: "bg-zylo-cyan text-black font-semibold hover:bg-zylo-cyan/90 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all",
      neon: "bg-gradient-to-r from-zylo-cyan via-zylo-purple to-zylo-pink text-white font-medium shadow-[0_0_25px_rgba(157,0,255,0.3)] hover:shadow-[0_0_35px_rgba(157,0,255,0.5)] border-0 transition-all",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-lg px-8 text-base font-semibold",
      icon: "h-10 w-10 p-0 flex items-center justify-center",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
