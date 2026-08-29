"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Layers, Box, LogIn, LayoutDashboard } from "lucide-react";

export const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zylo-border bg-zylo-dark/80 backdrop-blur-xl">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zylo-cyan via-zylo-purple to-zylo-pink flex items-center justify-center p-[1px] shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zylo-dark rounded-[11px] flex items-center justify-center">
              <Box className="w-5 h-5 text-zylo-cyan group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              ZYLO <Badge variant="cyan" className="text-[10px] py-0 px-1.5">v0.1</Badge>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-zylo-cyan transition-colors flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> Architecture
          </Link>
          <Link href="#interactive-demo" className="hover:text-zylo-cyan transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 3D Engine
          </Link>
          <Link href="#pricing" className="hover:text-zylo-cyan transition-colors">
            Pricing
          </Link>
          <Link href="https://github.com" target="_blank" className="hover:text-zylo-cyan transition-colors">
            Docs
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          {session ? (
            <Link href="/dashboard">
              <Button variant="glow" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-1.5 text-slate-300 hover:text-white">
                  <LogIn className="w-4 h-4" /> Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="neon" size="sm" className="gap-1.5 hidden sm:inline-flex">
                  Explore Studio
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
