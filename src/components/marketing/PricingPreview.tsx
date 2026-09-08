"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Sparkles, ArrowRight, Zap, ShieldCheck, Globe2 } from "lucide-react";
import { Currency } from "@/modules/billing/types";

export const PricingPreview: React.FC = () => {
  const [currency, setCurrency] = useState<Currency>("INR");

  const plans = [
    {
      code: "STARTER",
      name: "Starter Dimension",
      tagline: "For individual creators launching their first 3D portfolio.",
      price: currency === "INR" ? "₹500" : "$49",
      interval: "/ month",
      popular: false,
      features: [
        "1 Live 3D WebGL Portfolio",
        "Neural & Minimal 3D Templates",
        "Standard Procedural Presets",
        "zylo.design/{slug} Subdomain",
        "5 AI generations / month",
        "Automated Resume Parser",
      ],
      ctaText: "Get Started",
      ctaVariant: "outline" as const,
    },
    {
      code: "PRO",
      name: "Pro Spatial Dimension",
      tagline: "For senior engineers & designers wanting standout personal branding.",
      price: currency === "INR" ? "₹1,999" : "$149",
      interval: "/ month",
      popular: true,
      features: [
        "5 Live 3D WebGL Portfolios",
        "All Premium Templates (Glass, Orbit, Creative)",
        "Custom Domain with Auto SSL (TLS 1.3)",
        "Real-Time Visitor & Geo Analytics",
        "50 AI generations / month",
        "Priority Global Edge CDN",
        "Remove 'Powered by ZYLO' Branding",
      ],
      ctaText: "Upgrade to Pro",
      ctaVariant: "glow" as const,
    },
    {
      code: "AGENCY",
      name: "Studio & Agency",
      tagline: "For design agencies and studios managing multiple client rosters.",
      price: currency === "INR" ? "₹4,999" : "$399",
      interval: "/ month",
      popular: false,
      features: [
        "15 Live 3D WebGL Portfolios",
        "White-labeling & Custom Branding",
        "Full Client Roster Management",
        "Team Workspace Collaboration",
        "Unlimited AI generations",
        "Priority 3D Rendering Pipeline",
        "24/7 Dedicated Concierge Support",
      ],
      ctaText: "Explore Agency Plan",
      ctaVariant: "outline" as const,
    },
  ];

  return (
    <section id="pricing" className="py-24 border-t border-zylo-border relative bg-zylo-dark/90 scroll-mt-16">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-zylo-cyan/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-zylo-purple/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="container max-w-7xl px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <Badge variant="cyan" className="gap-1.5 px-3 py-1">
            <Zap className="w-3.5 h-3.5" /> Flexible & Transparent Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Simple Plans for Incredible 3D Experiences
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Start at <span className="text-zylo-cyan font-semibold">{currency === "INR" ? "₹500" : "$49"}</span>. Scale with custom domains, premium 3D shaders, and real-time visitor analytics.
          </p>

          {/* Currency Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="p-1 rounded-xl bg-zylo-surface border border-zylo-border flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setCurrency("INR")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  currency === "INR"
                    ? "bg-zylo-cyan text-black font-semibold shadow-md shadow-zylo-cyan/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🇮🇳 INR (₹)
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  currency === "USD"
                    ? "bg-zylo-cyan text-black font-semibold shadow-md shadow-zylo-cyan/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" /> Global USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.code}
              className={`glass-panel flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? "border-zylo-cyan/50 shadow-[0_0_30px_rgba(0,240,255,0.12)] relative -translate-y-2 bg-zylo-surface/90"
                  : "border-zylo-border/80 hover:border-zylo-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="cyan" className="px-3 py-1 gap-1 text-[11px] font-semibold tracking-wide uppercase bg-zylo-surface border-zylo-cyan/60">
                    <Sparkles className="w-3 h-3 text-zylo-cyan" /> Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="space-y-3 pt-6">
                <div>
                  <CardTitle className="text-xl font-heading font-bold text-white flex items-center justify-between">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 mt-1 min-h-[32px]">
                    {plan.tagline}
                  </CardDescription>
                </div>

                <div className="pt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {plan.interval}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-1">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Included Features:
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="mt-0.5 rounded-full p-0.5 bg-zylo-cyan/15 text-zylo-cyan shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4 border-t border-zylo-border/60">
                <Link href="/pricing" className="w-full">
                  <Button variant={plan.ctaVariant} className="w-full gap-2 text-xs">
                    {plan.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bottom CTA to Full Pricing Portal */}
        <div className="mt-14 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm text-zylo-cyan hover:underline underline-offset-4 group transition-all"
          >
            <span>Need billing interval discounts, FAQ, or complete feature comparison?</span>
            <span className="font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Full Pricing Portal <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
