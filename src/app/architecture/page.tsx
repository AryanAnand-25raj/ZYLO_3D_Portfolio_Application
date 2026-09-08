import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Cpu,
  Box,
  Code2,
  Lock,
  Globe2,
  Server,
  ArrowRight,
  Zap,
  RefreshCw,
  Terminal,
  Database,
  CreditCard,
  Eye,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "System Architecture & 3D Engine | ZYLO",
  description:
    "Explore ZYLO's system architecture: 7 decoupled core domains, sandboxed declarative 3D WebGL graphics pipeline, and global edge publishing.",
};

export default function ArchitecturePage() {
  const domains = [
    {
      id: "user-data",
      number: "01",
      name: "User Data & Identity",
      icon: Lock,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgGradient: "from-blue-500/10",
      responsibilities: [
        "Multi-tenant session tokens & credentials",
        "NextAuth OAuth profile integrations",
        "Prisma database persistence (PostgreSQL)",
        "RBAC roles (USER, CREATOR, ADMIN, SUPER_ADMIN)",
      ],
      boundary: "Never directly exposes billing tokens or raw rendering matrices.",
    },
    {
      id: "content",
      number: "02",
      name: "Content Engine",
      icon: Code2,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgGradient: "from-emerald-500/10",
      responsibilities: [
        "Biographies, work history & achievements",
        "Categorized technical skills & project showcases",
        "Zod ContentSchema validation contract",
        "AI resume parser & text extraction pipeline",
      ],
      boundary: "Strictly decoupled from 3D scene placement and CSS styles.",
    },
    {
      id: "design",
      number: "03",
      name: "Design & Style Tokens",
      icon: Sparkles,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgGradient: "from-purple-500/10",
      responsibilities: [
        "HSL dynamic color token hierarchies",
        "Glassmorphism blur, border and opacity metrics",
        "Neon glow accents & typography scale tokens",
        "Responsive grid & kinetic layout rules",
      ],
      boundary: "Applied via CSS variables without mutating raw user content.",
    },
    {
      id: "3d-scene",
      number: "04",
      name: "3D Scene Specification",
      icon: Box,
      color: "text-zylo-cyan",
      borderColor: "border-zylo-cyan/30",
      bgGradient: "from-cyan-500/10",
      responsibilities: [
        "Declarative JSON scene graph (SceneSchema)",
        "Camera coordinates, target matrices & FOV",
        "Atmospheric fog, particle simulations & HDRI maps",
        "Lighting presets (Cyberpunk, Studio, Neon, Ambient)",
      ],
      boundary: "Pure schema definitions without executable runtime code.",
    },
    {
      id: "rendering",
      number: "05",
      name: "Rendering Engine (@zylo/three-engine)",
      icon: Cpu,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgGradient: "from-amber-500/10",
      responsibilities: [
        "Three.js & React Three Fiber execution canvas",
        "Hardware-adaptive DPR tiering (Ultra to Mobile)",
        "Precompiled ComponentRegistry whitelist",
        "Automatic WebGL failure detection & CSS fallback",
      ],
      boundary: "Refuses dynamic eval() or external unvetted script tags.",
    },
    {
      id: "publishing",
      number: "06",
      name: "Publishing & Edge CDN",
      icon: Globe2,
      color: "text-teal-400",
      borderColor: "border-teal-500/30",
      bgGradient: "from-teal-500/10",
      responsibilities: [
        "Subdomain routing (zylo.design/{slug})",
        "Custom domain binding with automated TLS 1.3 SSL",
        "Immutable deployment snapshots in PostgreSQL",
        "Dynamic OpenGraph & Twitter card generation",
      ],
      boundary: "Freezes deployment states so editor drafts never leak live.",
    },
    {
      id: "billing",
      number: "07",
      name: "Billing & Quotas",
      icon: CreditCard,
      color: "text-pink-400",
      borderColor: "border-pink-500/30",
      bgGradient: "from-pink-500/10",
      responsibilities: [
        "Stripe & Razorpay multi-currency checkout (INR / USD)",
        "Webhooks with signature verification & idempotency",
        "Tier entitlements (Portfolios, AI credits, Domains)",
        "Automated subscription status synchronization",
      ],
      boundary: "Zero cardholder data stored on ZYLO servers (PCI-DSS).",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zylo-dark text-foreground selection:bg-zylo-cyan/20 selection:text-zylo-cyan">
      <Navbar />

      <main className="flex-1 container max-w-7xl px-4 sm:px-8 py-14">
        {/* Header & Hero */}
        <div className="mb-14 space-y-4 pb-8 border-b border-zylo-border">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="cyan" className="gap-1.5 px-3 py-1">
              <Layers className="w-3.5 h-3.5" /> Technical Blueprint
            </Badge>
            <Badge variant="purple" className="px-2.5 py-0.5 text-[11px] font-mono">
              Version 0.1.0 Architecture
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            ZYLO System Architecture
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
            A real-time spatial computing SaaS built on strict separation of concerns, zero-arbitrary-code execution sandboxing, and a declarative WebGL graphics pipeline.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link href="/3d-test">
              <Button variant="glow" className="gap-2 text-xs">
                <Sparkles className="w-3.5 h-3.5" /> Open 3D Engine Testbed
              </Button>
            </Link>
            <Link href="/docs?tab=architecture">
              <Button variant="outline" className="gap-2 text-xs">
                <Terminal className="w-3.5 h-3.5" /> Technical Docs Reference
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="ghost" className="gap-2 text-xs text-slate-300 hover:text-white">
                Template Studio <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 1: The 7 Core Architectural Domains */}
        <section className="space-y-6 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
                <Server className="w-6 h-6 text-zylo-cyan" />
                The Seven Core Architectural Domains
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Each domain maintains distinct responsibilities, explicit Zod validation schemas, and isolated boundaries.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <div
                  key={domain.id}
                  className={`p-6 rounded-2xl glass-panel border ${domain.borderColor} bg-gradient-to-b ${domain.bgGradient} to-transparent flex flex-col justify-between hover:scale-[1.01] transition-transform`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${domain.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-500">
                        DOMAIN {domain.number}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">
                        {domain.name}
                      </h3>
                      <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                        {domain.responsibilities.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-zylo-cyan text-xs leading-none mt-1">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-slate-400 font-mono">
                    <span className="text-slate-500 uppercase font-semibold">Boundary:</span>{" "}
                    {domain.boundary}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Sandboxing & Zero Arbitrary Code Model */}
        <section className="space-y-6 mb-16">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Security Sandboxing & Zero-Arbitrary-Code Model
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Unlike traditional website builders that execute unsanitized user scripts, ZYLO treats 3D scenes as pure, declarative data contracts.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-zylo-border space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-zylo-surface/80 border border-zylo-border flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono font-bold text-white uppercase">1. User / AI Prompt</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Untrusted input requesting scene modifications or custom meshes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zylo-surface/80 border border-zylo-cyan/30 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-zylo-cyan/10 text-zylo-cyan flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono font-bold text-zylo-cyan uppercase">2. Zod Schema Parser</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Strict SceneSchema validator rejects unexpected keys or script tags.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zylo-surface/80 border border-purple-500/30 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                  <Box className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono font-bold text-purple-400 uppercase">3. Component Registry</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Only whitelisted pre-compiled R3F meshes are resolved.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zylo-surface/80 border border-emerald-500/30 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">4. Three.js Canvas</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Isolated WebGL context rendered behind accessible semantic HTML.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Guaranteed Sandbox Safety
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Even if an attacker attempts prompt injection or supplies manipulated JSON, our graphics engine never calls <code className="text-zylo-cyan font-mono">eval()</code>, <code className="text-zylo-cyan font-mono">new Function()</code>, or innerHTML on the 3D canvas.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="text-zylo-cyan font-bold flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Indexable Semantic HTML Dominance
                </div>
                <p className="text-slate-400 leading-relaxed">
                  The 3D canvas is purely a background visual enhancement layer. All headings, project descriptions, and resume links exist as semantic HTML elements fully crawlable by search engines and screen readers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Hardware Adaptability & Performance Tiers */}
        <section className="space-y-6 mb-16">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <Zap className="w-6 h-6 text-amber-400" />
              Hardware Adaptability & Tier Scaling
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              To achieve smooth 60 FPS across everything from high-end workstations to budget smartphones, the engine dynamically modulates rendering parameters.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300 border border-zylo-border rounded-xl">
              <thead className="bg-zylo-surface/80 text-white font-mono uppercase text-[11px] border-b border-zylo-border">
                <tr>
                  <th className="p-3.5">Tier</th>
                  <th className="p-3.5">DPR Clamp</th>
                  <th className="p-3.5">Shadow Maps</th>
                  <th className="p-3.5">Post-Processing</th>
                  <th className="p-3.5">Particle Limit</th>
                  <th className="p-3.5">Target Hardware</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zylo-border/60">
                <tr className="hover:bg-white/5">
                  <td className="p-3.5 font-bold text-cyan-400 font-mono">ULTRA</td>
                  <td className="p-3.5 font-mono">2.5</td>
                  <td className="p-3.5 text-emerald-400">Soft Shadows (2048px)</td>
                  <td className="p-3.5 text-emerald-400">Bloom + Chromatic Aberration</td>
                  <td className="p-3.5 font-mono">300</td>
                  <td className="p-3.5 text-slate-400">Discrete GPUs (RTX / Apple M-Pro)</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3.5 font-bold text-emerald-400 font-mono">HIGH</td>
                  <td className="p-3.5 font-mono">2.0</td>
                  <td className="p-3.5 text-emerald-400">Directional Shadows (1024px)</td>
                  <td className="p-3.5 text-emerald-400">Light Bloom</td>
                  <td className="p-3.5 font-mono">150</td>
                  <td className="p-3.5 text-slate-400">Modern Laptops & Desktop iGPUs</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3.5 font-bold text-yellow-400 font-mono">MEDIUM</td>
                  <td className="p-3.5 font-mono">1.5</td>
                  <td className="p-3.5 text-yellow-400">Basic Shadow Maps (512px)</td>
                  <td className="p-3.5 text-slate-500">Disabled</td>
                  <td className="p-3.5 font-mono">75</td>
                  <td className="p-3.5 text-slate-400">Tablets & Mid-range Phones</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3.5 font-bold text-orange-400 font-mono">LOW / MOBILE</td>
                  <td className="p-3.5 font-mono">1.0</td>
                  <td className="p-3.5 text-slate-500">Disabled (Ambient only)</td>
                  <td className="p-3.5 text-slate-500">Disabled</td>
                  <td className="p-3.5 font-mono">30</td>
                  <td className="p-3.5 text-slate-400">Budget Mobile & Battery Saver</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Edge Publishing & Custom Domains */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <Globe2 className="w-6 h-6 text-teal-400" />
              Edge Publishing & Custom Domain Routing
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Deployments are stored as immutable snapshots, distributed to edge points of presence with automated TLS 1.3 encryption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-panel border-zylo-border/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-teal-400" /> Automated Subdomains
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-400 leading-relaxed">
                Every creator receives an instant vanity route at <code className="text-zylo-cyan font-mono text-[11px]">zylo.design/username</code> served from edge caches with sub-millisecond route resolution.
              </CardContent>
            </Card>

            <Card className="glass-panel border-zylo-border/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zylo-cyan" /> Custom CNAME & TLS 1.3
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-400 leading-relaxed">
                Creators on Pro and Agency plans can bind apex or subdomains with automatic SSL provisioning, HTTP-to-HTTPS redirection, and HSTS headers.
              </CardContent>
            </Card>

            <Card className="glass-panel border-zylo-border/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-400" /> Immutable Snapshots
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-400 leading-relaxed">
                Live portfolios are decoupled from active studio drafts. When a creator publishes, a frozen JSON snapshot is versioned in PostgreSQL, ensuring 100% production stability.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
