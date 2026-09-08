"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Layers, Box, LogIn, LayoutDashboard, Menu, X, CreditCard, ArrowRight } from "lucide-react";

export const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <Link href="/architecture" className="hover:text-zylo-cyan transition-colors flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> Architecture
          </Link>
          <Link href="/3d-test" className="hover:text-zylo-cyan transition-colors flex items-center gap-1.5 text-white">
            <Sparkles className="w-4 h-4 text-zylo-cyan" /> 3D Engine
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zylo-cyan/15 text-zylo-cyan font-mono border border-zylo-cyan/30">
              Live
            </span>
          </Link>
          <Link href="/pricing" className="hover:text-zylo-cyan transition-colors flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-400" /> Pricing
          </Link>
          <Link href="/templates" className="hover:text-zylo-cyan transition-colors">
            Templates
          </Link>
          <Link href="/docs" className="hover:text-zylo-cyan transition-colors">
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
                <Button variant="ghost" size="sm" className="gap-1.5 text-slate-300 hover:text-white hidden sm:inline-flex">
                  <LogIn className="w-4 h-4" /> Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="glow" size="sm" className="gap-1.5 hidden sm:inline-flex">
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zylo-border bg-zylo-surface/95 backdrop-blur-2xl px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zylo-cyan font-semibold flex items-center gap-2 py-1.5"
            >
              <CreditCard className="w-4 h-4" /> Pricing & Plans
            </Link>
            <Link
              href="/3d-test"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white flex items-center gap-2 py-1.5"
            >
              <Sparkles className="w-4 h-4 text-zylo-cyan" /> 3D Engine Testbed (Live)
            </Link>
            <Link
              href="/architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white flex items-center gap-2 py-1.5"
            >
              <Layers className="w-4 h-4" /> System Architecture
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white flex items-center gap-2 py-1.5"
            >
              Templates
            </Link>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white flex items-center gap-2 py-1.5"
            >
              Technical Docs
            </Link>
          </nav>

          <div className="pt-3 border-t border-zylo-border flex flex-col gap-2.5">
            {session ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="glow" className="w-full text-xs gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="glow" className="w-full text-xs gap-1.5">
                    Get Started Free <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs">
                    <LogIn className="w-3.5 h-3.5 mr-1.5" /> Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

