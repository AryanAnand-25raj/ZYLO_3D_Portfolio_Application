"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Cpu,
  Box,
  Code2,
  FileCode,
  ArrowRight,
  Zap,
  Globe,
  Database,
  Lock,
  ExternalLink,
  ChevronRight,
  Terminal,
  CreditCard,
  Layout,
  FileCheck2,
  DownloadCloud,
  Trash2,
  CheckCircle2,
} from "lucide-react";

function DocsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "3d-engine";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab &&
      [
        "3d-engine",
        "architecture",
        "templates",
        "pricing",
        "security",
        "schemas",
        "compliance",
      ].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: "3d-engine", label: "3D Engine Runtime", icon: Sparkles },
    { id: "architecture", label: "System Architecture", icon: Layers },
    { id: "templates", label: "Templates & Tokens", icon: Layout },
    { id: "pricing", label: "Pricing & Quotas", icon: CreditCard },
    { id: "security", label: "Security & Sandboxing", icon: ShieldCheck },
    { id: "schemas", label: "Schemas & Contracts", icon: Code2 },
    { id: "compliance", label: "Privacy & Compliance", icon: FileCheck2 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zylo-dark text-foreground selection:bg-zylo-cyan/20 selection:text-zylo-cyan">
      <Navbar />

      <main className="flex-1 container max-w-7xl px-4 sm:px-8 py-12">
        {/* Breadcrumb & Header */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-zylo-cyan transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-zylo-cyan font-medium">Documentation</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-zylo-border">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Badge variant="cyan" className="gap-1.5 px-3 py-1">
                  <Terminal className="w-3.5 h-3.5" /> Technical Documentation
                </Badge>
                <Badge variant="purple" className="px-2.5 py-0.5 text-[11px] font-mono">
                  v0.1.0 Architecture
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                ZYLO System & 3D Engine Documentation
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
                Comprehensive architectural specs, WebGL graphics pipeline, templates system, billing quotas, and privacy sandboxing.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Link href="/3d-test">
                <Button variant="glow" className="gap-2 text-xs">
                  <Sparkles className="w-3.5 h-3.5" /> Launch 3D Testbed
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="gap-2 text-xs">
                  Pricing Plans <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 rounded-xl bg-zylo-surface/80 border border-zylo-border backdrop-blur-md">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-zylo-elevated text-zylo-cyan border border-zylo-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-zylo-cyan" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: 3D Engine Runtime */}
        {activeTab === "3d-engine" && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
                    <Sparkles className="w-6 h-6 text-zylo-cyan" />
                    The @zylo/three-engine Graphics Pipeline
                  </h2>
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                    The ZYLO 3D Engine is an isolated, declarative WebGL runtime built on <strong>Three.js</strong> and <strong>React Three Fiber (R3F)</strong>. It completely decouples 3D scene execution from user content and business logic.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="p-4 rounded-xl glass-panel border-zylo-border/80 space-y-2">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-zylo-cyan" /> 1. SceneRenderer Core
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Manages the R3F Canvas lifecycle, dynamic camera matrices, background environments, and hardware-adaptive frame rates. Wraps scenes in an error boundary that seamlessly renders a graceful CSS fallback if WebGL fails.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl glass-panel border-zylo-border/80 space-y-2">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Box className="w-4 h-4 text-zylo-purple" /> 2. Component Registry Whitelist
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Rather than executing raw script tags or procedural JavaScript strings, all 3D scene nodes are instantiated from a strictly audited component registry. Only approved types like <code className="text-zylo-cyan font-mono text-[11px]">TorusKnotCore</code>, <code className="text-zylo-cyan font-mono text-[11px]">NeonRings</code>, <code className="text-zylo-cyan font-mono text-[11px]">CyberGrid</code>, and <code className="text-zylo-cyan font-mono text-[11px]">CrystalPrism</code> are rendered.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl glass-panel border-zylo-border/80 space-y-2">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" /> 3. Hardware Adaptability & Performance Tiers
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Automatically detects client GPU capabilities and classifies devices into <strong>Ultra</strong> (DPR 2.5), <strong>High</strong> (DPR 2.0, shadow maps, post-processing bloom), <strong>Medium</strong> (DPR 1.5, directional shadows), and <strong>Low/Mobile</strong> (DPR 1.0, ambient lighting, disabled post-processing).
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/3d-test">
                    <Button variant="glow" className="gap-2">
                      <ExternalLink className="w-4 h-4" /> Open Interactive 3D Testbed (/3d-test)
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Code Example / Schema Visualizer */}
              <div className="lg:col-span-5 space-y-4">
                <Card className="glass-panel border-zylo-border/80">
                  <CardHeader className="py-3 px-4 border-b border-zylo-border/60 bg-zylo-surface/60">
                    <CardTitle className="text-xs font-mono text-zylo-cyan flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5" /> Declarative SceneSchema (JSON)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto bg-black/50 rounded-b-lg">
                    <pre>{`{
  "name": "Cyber Dimension",
  "camera": {
    "fov": 45,
    "position": [0, 0, 5],
    "target": [0, 0, 0],
    "type": "perspective"
  },
  "environment": {
    "backgroundType": "gradient",
    "gradient": {
      "stops": ["#030712", "#0f172a"]
    },
    "fog": {
      "color": "#030712",
      "near": 3,
      "far": 15
    },
    "particles": {
      "count": 150,
      "color": "#00f0ff"
    }
  },
  "lighting": {
    "preset": "cyberpunk",
    "ambient": { "intensity": 0.3 }
  },
  "nodes": [
    {
      "id": "hero-torus",
      "type": "TorusKnotCore",
      "position": [0, 0, 0],
      "scale": [1, 1, 1],
      "material": {
        "color": "#00f0ff",
        "metalness": 0.85,
        "roughness": 0.15
      }
    }
  ]
}`}</pre>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Approved 3D Nodes Table */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-bold text-white">
                Pre-Approved 3D Component Whitelist
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "TorusKnotCore", type: "Procedural", desc: "Glowing mathematical knot with procedural normal displacement." },
                  { name: "NeonRings", type: "Geometric", desc: "Concentric rotating neon rings with dynamic emissive pulses." },
                  { name: "CyberGrid", type: "Environment", desc: "Infinite perspective grid with horizon fading and wireframes." },
                  { name: "CrystalPrism", type: "Shader", desc: "Physical transmission material with simulated chromatic dispersion." },
                  { name: "GeometricCluster", type: "Kinetic", desc: "Floating polyhedra with spring-based cursor tracking." },
                  { name: "NeuralNodes", type: "Particles", desc: "Interconnected synaptic nodes with simulated data pulses." },
                  { name: "SphereOrb", type: "Primitive", desc: "Micro-surface roughness orb with Fresnel edge illumination." },
                  { name: "Model (GLTF)", type: "Asset", desc: "Whitelisted asset resolver strictly rejecting external arbitrary URLs." },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl glass-panel border-zylo-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-zylo-cyan">{item.name}</span>
                      <Badge variant="outline" className="text-[10px] font-mono border-white/10">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: System Architecture */}
        {activeTab === "architecture" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-zylo-purple" />
                Seven Core Architectural Domains
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-3xl">
                ZYLO enforces a strict separation of concerns to guarantee independent maintainability, zero cross-layer pollution, and rock-solid reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  domain: "1. User Data Domain",
                  responsibility: "Identity, credential auth, OAuth, RBAC permissions, and session tokens.",
                  tech: "NextAuth.js, PostgreSQL, Prisma",
                  boundary: "Isolated in src/modules/user-data/",
                  color: "border-sky-500/30",
                },
                {
                  domain: "2. Content Domain",
                  responsibility: "Canonical profiles: biographies, work history, projects, metrics, and skills.",
                  tech: "Zod ContentSchema, PostgreSQL",
                  boundary: "Isolated in src/modules/content/",
                  color: "border-amber-500/30",
                },
                {
                  domain: "3. Design Domain",
                  responsibility: "Visual styling: HSL tokens, typography scale, blur/glassmorphism, and neon glows.",
                  tech: "Zod ThemeSchema, Tailwind CSS",
                  boundary: "Isolated in src/modules/design/",
                  color: "border-zylo-pink/30",
                },
                {
                  domain: "4. 3D Scene Domain",
                  responsibility: "Pure declarative scene graph: cameras, lights, fog, particles, and mesh nodes.",
                  tech: "Zod SceneSchema, JSON-RPC",
                  boundary: "Isolated in src/modules/scene/",
                  color: "border-zylo-cyan/30",
                },
                {
                  domain: "5. Rendering Domain",
                  responsibility: "Execution of the 3D scene graph with adaptive DPR, controls, and error boundaries.",
                  tech: "Three.js, React Three Fiber",
                  boundary: "Isolated in @zylo/three-engine",
                  color: "border-zylo-emerald/30",
                },
                {
                  domain: "6. Publishing Domain",
                  responsibility: "Static snapshot freezing, custom domains (SSL/DNS), and subdomain routing.",
                  tech: "Prisma Deployments, Edge Routers",
                  boundary: "Isolated in src/modules/publishing/",
                  color: "border-zylo-purple/30",
                },
                {
                  domain: "7. Billing & Entitlements",
                  responsibility: "Subscriptions (Starter ₹500, Pro ₹1,999, Agency), usage quotas, and payment webhooks.",
                  tech: "Stripe, Razorpay, Entitlement Gates",
                  boundary: "Isolated in src/modules/billing/",
                  color: "border-emerald-500/30",
                },
              ].map((item, idx) => (
                <Card key={idx} className={`glass-panel border ${item.color} flex flex-col justify-between`}>
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-base font-heading font-bold text-white">
                      {item.domain}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-300">
                      {item.responsibility}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2 space-y-2 border-t border-zylo-border/40 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Stack:</span>
                      <span className="font-mono text-slate-200">{item.tech}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Boundary:</span>
                      <span className="font-mono text-zylo-cyan">{item.boundary}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Link to Full Visual Architecture Portal */}
            <div className="p-6 rounded-2xl glass-panel border border-zylo-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Looking for the complete visual architecture blueprint?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Explore our dedicated architecture portal with interactive domain inspectors and graphics execution flowcharts.
                </p>
              </div>
              <Link href="/architecture">
                <Button variant="glow" className="gap-2 text-xs">
                  View Architecture Portal <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 3: Templates & Tokens */}
        {activeTab === "templates" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
                <Layout className="w-6 h-6 text-zylo-cyan" />
                The @zylo/templates Engine & Design Tokens
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-3xl">
                ZYLO features five pre-engineered template presets. Each template couples declarative 3D scene presets with semantic HTML typography, glass tokens, and non-destructive schema migrations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: "orbit",
                  name: "Orbit Exoplanet",
                  tag: "Celestial / Sci-Fi",
                  desc: "Massive planetary ring system with dynamic gravitational particle fields and deep void fog.",
                  features: ["Concentric Rings", "Camera Orbit Controls", "Stellar Lighting Preset"],
                  color: "border-cyan-500/30",
                },
                {
                  id: "neural",
                  name: "Neural Vortex",
                  tag: "AI / Particles",
                  desc: "Synaptic particle network connecting technical skills with animated kinetic pulses.",
                  features: ["Particle Lines", "Dynamic Vertex Shaders", "Cyberpunk Lighting"],
                  color: "border-purple-500/30",
                },
                {
                  id: "glass",
                  name: "Glass Refraction",
                  tag: "Physical / Frosted",
                  desc: "Refractive transmission shaders with frosted backdrop blur and prism dispersion.",
                  features: ["MeshTransmissionMaterial", "Frosted Glass Panels", "High Specularity"],
                  color: "border-blue-500/30",
                },
                {
                  id: "creative",
                  name: "Creative Cluster",
                  tag: "Kinetic / Polyhedra",
                  desc: "Floating kinetic geometric solids with smooth spring cursor tracking and neon reflections.",
                  features: ["Polyhedra Cluster", "Cursor Velocity Tracking", "Vibrant Accent Palette"],
                  color: "border-pink-500/30",
                },
                {
                  id: "minimal",
                  name: "Minimalist Torus",
                  tag: "Subtle / Sculptural",
                  desc: "Ultra-fast, understated mathematical torus with micro-roughness and minimal GPU overhead.",
                  features: ["Torus Sculptural Mesh", "High Mobile FPS", "Dark Monochrome Palette"],
                  color: "border-emerald-500/30",
                },
              ].map((tpl) => (
                <Card key={tpl.id} className={`glass-panel border ${tpl.color} flex flex-col justify-between`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-1">
                      <CardTitle className="text-base font-bold text-white">{tpl.name}</CardTitle>
                      <Badge variant="outline" className="text-[10px] font-mono">{tpl.tag}</Badge>
                    </div>
                    <CardDescription className="text-xs text-slate-300 leading-relaxed">
                      {tpl.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2 border-t border-white/10 text-xs space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                      Key Highlights:
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {tpl.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-zylo-cyan text-xs">•</span> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Non-Destructive Migration Specification */}
            <div className="p-6 rounded-2xl glass-panel border border-zylo-border/80 space-y-4">
              <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" /> Non-Destructive Template Migration
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Creators can switch templates at any time without losing biography details, project descriptions, or custom colors. The <code className="text-zylo-cyan font-mono text-xs">TemplateMigration.migrate()</code> pipeline automatically remaps content fields and synthesizes corresponding 3D scene parameters.
              </p>
              <div className="pt-2">
                <Link href="/templates">
                  <Button variant="outline" className="gap-2 text-xs">
                    Explore Template Studio (/templates) <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Pricing & Quotas */}
        {activeTab === "pricing" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
                <CreditCard className="w-6 h-6 text-emerald-400" />
                Subscription Tiers, Quotas & Billing Engine
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-3xl">
                ZYLO features three clear subscription tiers with native multi-currency support, entitlement gates, and zero surprise overage fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-white">Starter Dimension</CardTitle>
                  <CardDescription className="text-xs text-slate-400">₹500 / $49 per month</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-slate-300 space-y-2">
                  <p>• 1 Live 3D Portfolio</p>
                  <p>• Neural & Minimalist Templates</p>
                  <p>• Free <code className="text-zylo-cyan font-mono">zylo.design/{'{slug}'}</code> route</p>
                  <p>• 5 AI generations / month</p>
                  <p>• Standard community support</p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-zylo-cyan/40 bg-zylo-cyan/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-white">Pro Spatial</CardTitle>
                    <Badge variant="cyan" className="text-[10px]">Most Popular</Badge>
                  </div>
                  <CardDescription className="text-xs text-slate-400">₹1,999 / $149 per month</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-slate-300 space-y-2">
                  <p>• 5 Live 3D Portfolios</p>
                  <p>• Custom Domain Binding (Auto TLS 1.3)</p>
                  <p>• All 5 Premium Templates (Glass, Orbit, etc.)</p>
                  <p>• 50 AI generations / month</p>
                  <p>• Priority Edge CDN Routing</p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-white">Agency Suite</CardTitle>
                  <CardDescription className="text-xs text-slate-400">₹5,999 / $399 per month</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-slate-300 space-y-2">
                  <p>• 25 Live Client Portfolios</p>
                  <p>• 100% White-Label Client Portals</p>
                  <p>• Unlimited Custom Domains</p>
                  <p>• 200 AI generations / month</p>
                  <p>• Dedicated Shader Engineering Support</p>
                </CardContent>
              </Card>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-zylo-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Ready to upgrade or adjust currency?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Toggle between INR (UPI / RuPay) and USD (Stripe Global) on our interactive pricing page.
                </p>
              </div>
              <Link href="/pricing">
                <Button variant="glow" className="gap-2 text-xs">
                  Visit Pricing Page <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 5: Security & Sandboxing */}
        {activeTab === "security" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                Security Sandboxing & Integrity Model
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-3xl">
                ZYLO was built with non-negotiable security rules preventing code injection, cross-tenant leaks, and arbitrary asset loading.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl glass-panel border border-zylo-border/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-heading font-bold text-white">1. Zero Arbitrary JavaScript Execution</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The application completely bans <code className="text-rose-400 font-mono">eval()</code>, <code className="text-rose-400 font-mono">new Function()</code>, or dynamic script injection into the 3D canvas or DOM. All AI output is constrained to pure declarative JSON schemas.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-zylo-border/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-zylo-cyan">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-heading font-bold text-white">2. Whitelisted Asset Resolver</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  External arbitrary URLs (e.g. <code className="text-slate-400 font-mono">http://attacker.com/model.glb</code>) are intercepted and rejected. Only approved asset IDs mapped in the secure Asset Registry can be loaded into WebGL scenes.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-zylo-border/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-base font-heading font-bold text-white">3. HTML-First Semantic SEO & Accessibility</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The 3D canvas is contained in an overlay marked <code className="text-purple-400 font-mono">aria-hidden=&quot;true&quot;</code>. All titles, career bios, and project links are rendered in native semantic HTML elements accessible to screen readers and search bots.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-zylo-border/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-base font-heading font-bold text-white">4. Multi-Tenant RBAC Authorization</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Strict tenancy validation ensures users can only mutate portfolios they own. Role-based access control gates administrative metrics and security audit logs to verified admin sessions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Schemas & Data Models */}
        {activeTab === "schemas" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
                <Code2 className="w-6 h-6 text-zylo-pink" />
                Validation Schemas & API Contracts
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-3xl">
                Every layer of ZYLO is strictly validated via Zod before touching the database or WebGL runtime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-panel border-zylo-border/80">
                <CardHeader>
                  <CardTitle className="text-sm font-mono text-zylo-cyan">ContentSchema</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Canonical portfolio data</CardDescription>
                </CardHeader>
                <CardContent className="font-mono text-[11px] text-slate-300 bg-black/40 p-4 rounded-b-lg overflow-x-auto">
                  <pre>{`profile: {
  fullName: string,
  headline: string,
  bio: string,
  location?: string,
  socialLinks: {
    github?: string,
    linkedin?: string
  }
},
experiences: Array<Job>,
projects: Array<Project>,
skills: Array<SkillCategory>`}</pre>
                </CardContent>
              </Card>

              <Card className="glass-panel border-zylo-border/80">
                <CardHeader>
                  <CardTitle className="text-sm font-mono text-zylo-pink">ThemeSchema</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Visual style tokens</CardDescription>
                </CardHeader>
                <CardContent className="font-mono text-[11px] text-slate-300 bg-black/40 p-4 rounded-b-lg overflow-x-auto">
                  <pre>{`colors: {
  background: HSLString,
  foreground: HSLString,
  primary: HSLString,
  accent: HSLString,
  glow: HSLString
},
typography: {
  headingFont: string,
  bodyFont: string
},
glassmorphism: {
  blurPx: number,
  opacity: number
}`}</pre>
                </CardContent>
              </Card>

              <Card className="glass-panel border-zylo-border/80">
                <CardHeader>
                  <CardTitle className="text-sm font-mono text-emerald-400">SceneSchema</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Declarative 3D configuration</CardDescription>
                </CardHeader>
                <CardContent className="font-mono text-[11px] text-slate-300 bg-black/40 p-4 rounded-b-lg overflow-x-auto">
                  <pre>{`camera: {
  fov: number,
  position: [x, y, z],
  type: "perspective"
},
environment: {
  backgroundType: "gradient",
  fog?: FogConfig,
  particles?: ParticleConfig
},
lighting: LightingPreset,
nodes: Array<SceneNode>`}</pre>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 7: Privacy & Compliance */}
        {activeTab === "compliance" && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
                <FileCheck2 className="w-6 h-6 text-zylo-cyan" />
                Data Privacy, Telemetry & GDPR Compliance
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-3xl">
                ZYLO was built with privacy-first principles. We do not store raw IP addresses, we respect browser privacy signals, and we provide automated data lifecycle endpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-panel border-zylo-cyan/30">
                <CardHeader>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-zylo-cyan" /> Zero Raw IP Telemetry
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-400 space-y-2 leading-relaxed">
                  <p>
                    Visitor sessions are hashed with a daily rotated cryptographic salt: <code className="text-zylo-cyan font-mono text-[10px]">SHA-256(IP + Salt + Date + PortfolioId)</code>.
                  </p>
                  <p>
                    Raw IP addresses are never written to disk or database tables.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <DownloadCloud className="w-4 h-4 text-emerald-400" /> GDPR Data Portability
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-400 space-y-2 leading-relaxed">
                  <p>
                    Users can trigger an automated export of their profile, 3D configurations, snapshots, and metrics anytime.
                  </p>
                  <p className="text-emerald-400 font-mono text-[11px]">
                    GET /api/user/data-export
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-rose-500/30">
                <CardHeader>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-400" /> Right to Erasure
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-400 space-y-2 leading-relaxed">
                  <p>
                    Immediate purge of user records, OAuth connections, and published 3D dimensions upon account deletion.
                  </p>
                  <p className="text-rose-400 font-mono text-[11px]">
                    POST /api/user/delete-account
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-zylo-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Read our complete legal documents
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  View our official Privacy Policy and Terms of Service for full statutory disclosures.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/privacy">
                  <Button variant="outline" className="text-xs">
                    Privacy Policy
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="outline" className="text-xs">
                    Terms of Service
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function DocsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-zylo-dark" />}>
      <DocsContent />
    </React.Suspense>
  );
}
