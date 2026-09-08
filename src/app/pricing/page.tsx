"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Sparkles,
  Zap,
  Globe2,
  ShieldCheck,
  Layers,
  Code2,
  ArrowRight,
  HelpCircle,
  Cpu,
  BarChart3,
  Lock,
  Minus,
} from "lucide-react";
import { Currency } from "@/modules/billing/types";

export default function PricingPage() {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          currency,
          billingInterval: billingCycle === "yearly" ? "year" : "month",
          successUrl: window.location.origin + "/dashboard/billing?payment=success",
          cancelUrl: window.location.origin + "/pricing?payment=cancelled",
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.error) {
        alert(data.error);
      }
    } catch {
      alert("Failed to initialize checkout session. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const discountMultiplier = billingCycle === "yearly" ? 0.8 : 1.0;

  const plans = [
    {
      id: "plan_starter",
      code: "STARTER",
      name: "Starter Dimension",
      tagline: "Ideal for student developers & creators launching their first 3D presence.",
      inrMonthly: 500,
      usdMonthly: 49,
      isPopular: false,
      ctaText: "Get Started Free",
      highlights: [
        "1 Live 3D WebGL Portfolio",
        "Standard 3D Components & Presets",
        "Neural & Minimal Templates",
        "Free zylo.design/{slug} Subdomain",
        "5 AI generations / month",
        "PDF Resume Parser",
        "Zero Raw IP Visitor Analytics",
        "Community Support",
      ],
      disabledFeatures: [
        "Custom Domain Binding (Auto SSL)",
        "Premium Orbit & Glass Templates",
        "Advanced Shader Shading & Post-Processing",
        "Remove ZYLO Branding Badge",
      ],
    },
    {
      id: "plan_pro",
      code: "PRO",
      name: "Pro Spatial Dimension",
      tagline: "For senior developers, creators & freelancers requiring maximum prestige.",
      inrMonthly: 1999,
      usdMonthly: 149,
      isPopular: true,
      badge: "Most Popular",
      ctaText: "Upgrade to Pro",
      highlights: [
        "5 Live 3D WebGL Portfolios",
        "Custom Domain Binding with TLS 1.3 Auto SSL",
        "All 5 Templates (Glass, Orbit, Creative, Neural, Minimal)",
        "Full 3D Visual Customizer & Procedural Shaders",
        "50 AI generations / month",
        "Privacy-First Geolocation & Device Analytics",
        "Remove 'Created with ZYLO' Badge",
        "Priority Global Edge CDN Routing",
      ],
      disabledFeatures: [
        "White-Label Agency Client Portal",
      ],
    },
    {
      id: "plan_agency",
      code: "AGENCY",
      name: "Agency & Studio Suite",
      tagline: "For boutique design studios & teams delivering 3D client portfolios.",
      inrMonthly: 5999,
      usdMonthly: 399,
      isPopular: false,
      ctaText: "Launch Agency Suite",
      highlights: [
        "25 Live 3D Client Portfolios",
        "Full White-Labeling (Zero platform branding)",
        "200 AI generations / month",
        "Unlimited Custom Domains & Automated SSL",
        "Studio Client Review Links & Sandbox Access",
        "Dedicated Edge CDN Infrastructure",
        "Direct 1-on-1 Shader Engineering Support",
      ],
      disabledFeatures: [],
    },
  ];

  const comparisonRows = [
    {
      category: "3D Engine & Templates",
      features: [
        { name: "Included Templates", starter: "Neural, Minimal", pro: "All 5 Templates", agency: "All 5 + Custom Shaders" },
        { name: "Max 3D Scene Nodes", starter: "8 Nodes", pro: "25 Nodes", agency: "60 Nodes" },
        { name: "Hardware DPR Tiering", starter: "Automatic", pro: "Configurable Ultra", agency: "Configurable Ultra + Custom" },
        { name: "Physical Glass & Orbit Shaders", starter: false, pro: true, agency: true },
      ],
    },
    {
      category: "Publishing & Domains",
      features: [
        { name: "Live 3D Portfolios", starter: "1 Portfolio", pro: "5 Portfolios", agency: "25 Portfolios" },
        { name: "Free zylo.design Subdomain", starter: true, pro: true, agency: true },
        { name: "Custom Domain with Auto SSL", starter: false, pro: true, agency: "Unlimited" },
        { name: "Global Edge CDN Caching", starter: "Standard", pro: "Priority Global", agency: "Dedicated Route" },
        { name: "Remove 'Created with ZYLO' Badge", starter: false, pro: true, agency: true },
      ],
    },
    {
      category: "AI & Automation",
      features: [
        { name: "Monthly AI Credits", starter: "5 credits", pro: "50 credits", agency: "200 credits" },
        { name: "PDF Resume Parser", starter: true, pro: true, agency: true },
        { name: "AI Scene Synthesizer", starter: "Basic", pro: "Advanced", agency: "Unlimited Re-rolls" },
      ],
    },
    {
      category: "Privacy & Analytics",
      features: [
        { name: "Zero Raw IP Storage", starter: true, pro: true, agency: true },
        { name: "DNT & GPC Auto-Compliance", starter: true, pro: true, agency: true },
        { name: "Visitor Device & Region Telemetry", starter: "Basic Counts", pro: "7d/30d/90d Breakdown", agency: "Full Export + Audit" },
        { name: "GDPR Data Portability & Erasure", starter: true, pro: true, agency: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#05070f] text-white selection:bg-zylo-cyan/20 selection:text-zylo-cyan overflow-x-hidden font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center w-full">
        {/* Dynamic Glow Element */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-zylo-cyan/10 via-zylo-purple/5 to-transparent blur-3xl pointer-events-none" />

        {/* Hero Section */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zylo-cyan/10 border border-zylo-cyan/25 text-zylo-cyan text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Configurable Spatial Computing Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Turn your static profile into an{" "}
            <span className="bg-gradient-to-r from-zylo-cyan via-teal-300 to-zylo-purple bg-clip-text text-transparent">
              interactive 3D realm
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Predictable, fair pricing with native region support. Zero surprise overages.
            Upgrade or cancel anytime — your 3D assets and portfolio configurations remain safe.
          </p>

          {/* Currency and Billing Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            {/* Region / Currency Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-900/80 border border-white/10 shadow-lg">
              <button
                onClick={() => setCurrency("INR")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  currency === "INR"
                    ? "bg-gradient-to-r from-zylo-cyan to-blue-600 text-black shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>🇮🇳 India (₹ INR)</span>
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  currency === "USD"
                    ? "bg-gradient-to-r from-zylo-cyan to-blue-600 text-black shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>🌐 Global ($ USD)</span>
              </button>
            </div>

            {/* Monthly / Yearly Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-slate-900/80 border border-white/10 shadow-lg items-center">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  billingCycle === "monthly" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  billingCycle === "yearly" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left mb-20">
            {plans.map((p) => {
              const rawPrice = currency === "INR" ? p.inrMonthly : p.usdMonthly;
              const price = Math.round(rawPrice * discountMultiplier);
              const symbol = currency === "INR" ? "₹" : "$";

              return (
                <div
                  key={p.id}
                  className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 border ${
                    p.isPopular
                      ? "bg-gradient-to-b from-cyan-950/40 via-slate-900/80 to-slate-950/90 border-zylo-cyan/40 shadow-2xl shadow-zylo-cyan/10 scale-105"
                      : "bg-slate-900/40 border-white/10 hover:border-white/20"
                  }`}
                >
                  {p.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-zylo-cyan to-blue-500 text-black text-[11px] font-extrabold uppercase tracking-wider shadow-lg shadow-zylo-cyan/30">
                      {p.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{p.name}</h3>
                      {p.code === "PRO" && <Zap className="w-5 h-5 text-zylo-cyan fill-zylo-cyan" />}
                    </div>

                    <p className="text-xs text-slate-400 mb-6 min-h-[36px]">{p.tagline}</p>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold text-white">
                        {symbol}{price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        / {billingCycle === "yearly" ? "mo (billed yearly)" : "month"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(p.id)}
                      disabled={loadingPlan === p.id}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mb-8 ${
                        p.isPopular
                          ? "bg-gradient-to-r from-zylo-cyan to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-lg shadow-zylo-cyan/25"
                          : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                      }`}
                    >
                      <span>{loadingPlan === p.id ? "Connecting..." : p.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4 font-mono">
                      Included Features
                    </div>

                    <ul className="space-y-3 mb-6">
                      {p.highlights.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-zylo-cyan shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {p.disabledFeatures.length > 0 && (
                      <ul className="space-y-2 pt-4 border-t border-white/5">
                        {p.disabledFeatures.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-500 line-through">
                            <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">
                              ✕
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-between font-mono">
                    <span>Provider: {currency === "INR" ? "Razorpay (UPI / Cards)" : "Stripe (Global)"}</span>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Feature Comparison Table */}
          <section className="text-left mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
                Detailed Plan Feature Matrix
              </h2>
              <p className="text-slate-400 text-sm">
                Compare technical capabilities, quotas, and 3D engine features across tiers.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zylo-border glass-panel">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-zylo-border bg-zylo-surface/80 text-white font-mono uppercase text-[11px]">
                    <th className="p-4 w-1/3">Feature</th>
                    <th className="p-4">Starter</th>
                    <th className="p-4 text-zylo-cyan">Pro</th>
                    <th className="p-4 text-purple-400">Agency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zylo-border/60 text-slate-300">
                  {comparisonRows.map((cat, cIdx) => (
                    <React.Fragment key={cIdx}>
                      <tr className="bg-white/5 font-semibold text-white font-mono text-[11px]">
                        <td colSpan={4} className="p-3 px-4">
                          {cat.category}
                        </td>
                      </tr>
                      {cat.features.map((feat, fIdx) => (
                        <tr key={fIdx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3.5 px-4 font-medium text-slate-200">{feat.name}</td>
                          <td className="p-3.5">
                            {typeof feat.starter === "boolean" ? (
                              feat.starter ? <Check className="w-4 h-4 text-emerald-400" /> : <Minus className="w-4 h-4 text-slate-600" />
                            ) : (
                              <span>{feat.starter}</span>
                            )}
                          </td>
                          <td className="p-3.5 font-medium text-zylo-cyan">
                            {typeof feat.pro === "boolean" ? (
                              feat.pro ? <Check className="w-4 h-4 text-zylo-cyan" /> : <Minus className="w-4 h-4 text-slate-600" />
                            ) : (
                              <span>{feat.pro}</span>
                            )}
                          </td>
                          <td className="p-3.5 font-medium text-purple-300">
                            {typeof feat.agency === "boolean" ? (
                              feat.agency ? <Check className="w-4 h-4 text-purple-400" /> : <Minus className="w-4 h-4 text-slate-600" />
                            ) : (
                              <span>{feat.agency}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="text-left max-w-4xl mx-auto border-t border-white/10 pt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-zylo-cyan" />
                  <span>Can I pay in Indian Rupees (₹ INR)?</span>
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Yes! Our platform natively integrates with Razorpay, supporting UPI (Google Pay, PhonePe, Paytm), Indian NetBanking, and RuPay/Visa/Mastercard cards starting at just ₹500/month.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zylo-cyan" />
                  <span>What happens if I cancel my subscription?</span>
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  You retain complete access to Pro features until the end of your billing cycle. After that, your published websites safely degrade to the Starter tier without losing any content or 3D scene parameters.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-zylo-cyan" />
                  <span>What are AI generation limits?</span>
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  AI limits manage GPU token utilization. Each time our AI engine synthesizes biography sections, writes project highlights, or generates procedural 3D palettes, it consumes 1 generation credit.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-zylo-cyan" />
                  <span>How does Custom Domain verification work?</span>
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  On the Pro plan, connect any domain (apex e.g. <code className="text-zylo-cyan font-mono text-[11px]">yourname.dev</code> or subdomain). We provision automated TLS 1.3 certificates and edge caching with zero SSL configuration hassle.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
