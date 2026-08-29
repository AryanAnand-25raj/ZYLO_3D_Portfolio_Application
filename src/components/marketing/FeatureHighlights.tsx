"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck,
  FileText,
  Palette,
  Box,
  Cpu,
  Globe,
  CreditCard,
  ShieldCheck,
  Layers,
} from "lucide-react";

export const FeatureHighlights: React.FC = () => {
  const architecturalDomains = [
    {
      icon: UserCheck,
      title: "1. User Data Domain",
      description: "Secure profile authentication, multi-tenant accounts, roles, and session persistence via NextAuth & PostgreSQL.",
      badge: "Auth & Identity",
      color: "text-sky-400",
    },
    {
      icon: FileText,
      title: "2. Content Domain",
      description: "Validated structured data models for biographies, work experience, projects, skills, and credentials with Zod.",
      badge: "ContentSchema",
      color: "text-amber-400",
    },
    {
      icon: Palette,
      title: "3. Design Domain",
      description: "Declarative design tokens: HSL palettes, glassmorphism blur, typography scales, glowing borders, and animations.",
      badge: "ThemeSchema",
      color: "text-zylo-pink",
    },
    {
      icon: Box,
      title: "4. 3D Scene Domain",
      description: "Pure declarative scene graph defining camera matrices, dynamic light nodes, environment maps, and mesh hierarchies.",
      badge: "SceneSchema",
      color: "text-zylo-cyan",
    },
    {
      icon: Cpu,
      title: "5. Rendering Domain",
      description: "Isolated @zylo/three-engine package with sandboxed ComponentRegistry preventing arbitrary script execution.",
      badge: "WebGL / R3F",
      color: "text-zylo-emerald",
    },
    {
      icon: Globe,
      title: "6. Publishing Domain",
      description: "Static snapshot freezing, custom domains, subdomain routing, and automated SEO metadata generation.",
      badge: "Deployments",
      color: "text-zylo-purple",
    },
    {
      icon: CreditCard,
      title: "7. Billing Domain",
      description: "Tiered subscription entitlements (Free, Pro, Agency), portfolio limits, and quota enforcement.",
      badge: "Subscriptions",
      color: "text-emerald-400",
    },
  ];

  return (
    <section id="features" className="py-24 border-t border-zylo-border relative bg-zylo-dark">
      <div className="container max-w-7xl px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="purple" className="gap-1.5 px-3 py-1">
            <Layers className="w-3.5 h-3.5" /> Strict Separation of Concerns
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Engineered with 7 Isolated Core Domains
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Every layer in ZYLO is independently validated, typed, and decoupled to guarantee
            rock-solid reliability, security, and lightning-fast rendering performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {architecturalDomains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <Card
                key={index}
                className="glass-panel glass-panel-hover border-zylo-border/80 flex flex-col justify-between"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-zylo-border">
                      <Icon className={`w-6 h-6 ${domain.color}`} />
                    </div>
                    <Badge variant="outline" className="text-[11px] font-mono border-white/10">
                      {domain.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-heading">{domain.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-sm leading-relaxed">
                    {domain.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}

          {/* Sandboxing & Security Spotlight Card */}
          <Card className="glass-panel border-zylo-cyan/30 bg-gradient-to-br from-zylo-cyan/5 to-zylo-purple/5 md:col-span-2 lg:col-span-2 flex flex-col justify-center p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-zylo-cyan/10 border border-zylo-cyan/30">
                <ShieldCheck className="w-8 h-8 text-zylo-cyan" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
                  Sandboxed 3D Component Registry
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Unlike unsafe platforms that eval() arbitrary JavaScript code, ZYLO enforces a strict
                  schema-validated ComponentRegistry. All 3D meshes, geometries, shaders, and animations
                  are constructed from pre-compiled, verified WebGL building blocks.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
