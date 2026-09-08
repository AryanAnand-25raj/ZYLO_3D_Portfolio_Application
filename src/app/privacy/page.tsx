import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  FileCheck2,
  Database,
  ArrowRight,
  Server,
  RefreshCw,
  Mail,
  UserCheck,
  DownloadCloud,
  Trash2,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | ZYLO 3D",
  description:
    "Learn how ZYLO protects your privacy through zero raw IP storage, cookieless telemetry, encrypted asset storage, and GDPR-compliant data rights.",
};

export default function PrivacyPage() {
  const lastUpdated = "September 9, 2026";

  const privacyPillars = [
    {
      icon: EyeOff,
      title: "Zero Raw IP Storage",
      desc: "Visitor IP addresses are immediately hashed using a daily rotated cryptographic salt. Raw IP addresses are never written to disk or databases.",
    },
    {
      icon: ShieldCheck,
      title: "DNT & GPC Respected",
      desc: "We strictly obey Do Not Track (DNT) and Global Privacy Control (Sec-GPC) headers. Telemetry is automatically silenced when signaled.",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      desc: "All portfolio data and 3D assets are encrypted at rest with AES-256 and transmitted exclusively over TLS 1.3.",
    },
    {
      icon: Database,
      title: "Cookieless Telemetry",
      desc: "Our visitor analytics do not place tracking cookies, canvas fingerprints, or cross-site tracking beacons on visitor hardware.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zylo-dark text-foreground selection:bg-zylo-cyan/20 selection:text-zylo-cyan">
      <Navbar />

      <main className="flex-1 container max-w-5xl px-4 sm:px-8 py-14">
        {/* Header Section */}
        <div className="mb-12 space-y-4 pb-8 border-b border-zylo-border">
          <div className="flex items-center gap-2.5">
            <Badge variant="cyan" className="gap-1.5 px-3 py-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Legal & Privacy
            </Badge>
            <span className="text-xs font-mono text-slate-500">
              Last Updated: {lastUpdated}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
            ZYLO was engineered from day one around spatial computing excellence and strict data ethics. We believe modern 3D portfolio presentation does not require invasive tracking or data harvesting.
          </p>
        </div>

        {/* 4 Core Privacy Guarantees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {privacyPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl glass-panel border border-zylo-border/80 hover:border-zylo-cyan/40 transition-all space-y-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-zylo-cyan/10 border border-zylo-cyan/20 flex items-center justify-center text-zylo-cyan">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-white text-base">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Detailed Privacy Policy Content */}
        <div className="space-y-12 text-slate-300 text-sm sm:text-base leading-relaxed">
          {/* Section 1: Overview & Scope */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">01.</span>
              Scope & Core Principles
            </h2>
            <p>
              This Privacy Policy applies to the ZYLO platform, located at <code className="text-zylo-cyan font-mono text-xs">zylo.design</code>, its subdomains, public 3D portfolio dimensions created by users, and associated APIs.
            </p>
            <p>
              We distinguish between two types of individuals:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 text-sm">
              <li>
                <strong className="text-white">Creators & Account Holders:</strong> Registered users who sign up, upload resumes, customize 3D scenes, publish portfolios, and manage subscriptions.
              </li>
              <li>
                <strong className="text-white">Portfolio Visitors:</strong> Individuals who view public 3D portfolios published by creators on custom domains or <code className="text-zylo-cyan font-mono text-xs">*.zylo.design</code>.
              </li>
            </ul>
          </section>

          {/* Section 2: Portfolio Visitors & Telemetry */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">02.</span>
              Portfolio Visitor Telemetry & Zero Raw IP Policy
            </h2>
            <p>
              When a visitor navigates a published ZYLO 3D portfolio, we capture minimal, aggregated operational telemetry to provide creators with view metrics without invading visitor privacy:
            </p>

            <Card className="glass-panel border-zylo-border/80 my-4">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-zylo-cyan font-semibold text-sm">
                  <FileCheck2 className="w-4 h-4" /> Cryptographic Salting Specification
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Unique visitor counting uses a one-way cryptographic SHA-256 hash combining:
                  <br />
                  <code className="text-emerald-400 font-mono text-xs">SHA-256(Raw_IP + User_Agent + Daily_Rotating_Salt + Portfolio_ID)</code>
                  <br />
                  The daily salt is automatically rotated every 24 hours at 00:00 UTC. It is mathematically impossible to reverse this hash or track an individual across multiple days or across different portfolios.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-zylo-surface/60 border border-zylo-border">
                <h4 className="font-bold text-white mb-2 text-emerald-400">What We Collect:</h4>
                <ul className="space-y-1.5 text-slate-400 list-disc pl-5">
                  <li>Aggregated page and project view counts</li>
                  <li>Device category (Mobile, Tablet, Desktop)</li>
                  <li>High-level country/region (from Cloudflare edge headers)</li>
                  <li>Cleaned referral source (domain only, query parameters stripped)</li>
                  <li>3D interaction engagement (FPS diagnostics, WebGL capability)</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-zylo-surface/60 border border-zylo-border">
                <h4 className="font-bold text-white mb-2 text-rose-400">What We NEVER Collect:</h4>
                <ul className="space-y-1.5 text-slate-400 list-disc pl-5">
                  <li>Raw IP addresses (zero raw IP persistence)</li>
                  <li>Visitor names, emails, or personal identities</li>
                  <li>Cross-site tracking identifiers or marketing cookies</li>
                  <li>Session replay or biometric cursor tracking</li>
                  <li>Precise GPS or device geolocation coordinates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Creator Account Information */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">03.</span>
              Information Collected from Creators
            </h2>
            <p>
              When you create an account, build a 3D portfolio, or subscribe to paid tiers, we process:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 text-sm">
              <li>
                <strong className="text-white">Account Credentials:</strong> Full name, email address, password hash (salted bcrypt), or OAuth profile identifiers (GitHub / Google).
              </li>
              <li>
                <strong className="text-white">Portfolio Content:</strong> Biographies, experience records, project descriptions, skills, social links, and custom layout configurations.
              </li>
              <li>
                <strong className="text-white">Uploaded Assets:</strong> 3D models (GLTF/GLB), image assets, and PDF resumes. Uploaded files undergo automated security validation, MIME-type inspection, and path traversal protection.
              </li>
              <li>
                <strong className="text-white">Billing Information:</strong> Transaction IDs, billing interval, selected currency (INR or USD), and subscription status. All credit card processing is handled directly by Stripe or Razorpay; ZYLO never handles or stores raw payment card numbers.
              </li>
            </ul>
          </section>

          {/* Section 4: 3D Asset & Model Data Protection */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">04.</span>
              3D Models, Shaders & Sandboxing Security
            </h2>
            <p>
              To protect both creators and visitors against malicious code injection, all 3D assets are rendered strictly within our sandboxed engine architecture (<code className="text-zylo-cyan font-mono text-xs">@zylo/three-engine</code>).
            </p>
            <p>
              We enforce strict declarative schemas (<code className="text-zylo-cyan font-mono text-xs">SceneSchema</code>). User-supplied scripts, unvetted shader code, or dynamic <code className="text-zylo-cyan font-mono text-xs">eval()</code> statements are rejected at the parser level before reaching the WebGL canvas.
            </p>
          </section>

          {/* Section 5: GDPR & CCPA Rights */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">05.</span>
              Your Rights (GDPR, CCPA & Global Protections)
            </h2>
            <p>
              Regardless of your physical jurisdiction, ZYLO provides comprehensive data autonomy tools to all creators:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Card className="glass-panel border-zylo-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <DownloadCloud className="w-4 h-4 text-zylo-cyan" /> Right to Data Portability
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-400 space-y-2">
                  <p>
                    Download a full machine-readable JSON/ZIP package containing your account profile, published snapshots, 3D scene parameters, and analytics history.
                  </p>
                  <p className="text-zylo-cyan font-mono">
                    Endpoint: /api/user/data-export
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-zylo-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-400" /> Right to Erasure (&quot;Be Forgotten&quot;)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-400 space-y-2">
                  <p>
                    Permanently delete your account. All portfolio deployments, 3D configurations, OAuth tokens, and analytics are immediately purged from active databases.
                  </p>
                  <p className="text-rose-400 font-mono">
                    Endpoint: /api/user/delete-account
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 6: Third-Party Processors & Infrastructure */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">06.</span>
              Third-Party Sub-Processors
            </h2>
            <p>
              We partner with trusted, SOC2 / ISO-27001 certified infrastructure partners to operate our global platform:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300 border border-zylo-border rounded-xl">
                <thead className="bg-zylo-surface/80 text-white font-mono uppercase text-[11px] border-b border-zylo-border">
                  <tr>
                    <th className="p-3">Partner</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Data Handled</th>
                    <th className="p-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zylo-border/60">
                  <tr>
                    <td className="p-3 font-semibold text-white">Stripe / Razorpay</td>
                    <td className="p-3">Payment Processing</td>
                    <td className="p-3">Billing contacts, transaction tokens (PCI-DSS)</td>
                    <td className="p-3">US / Global / India</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Cloudflare</td>
                    <td className="p-3">Edge CDN, DDoS Defense & DNS</td>
                    <td className="p-3">Encrypted HTTP traffic, SSL/TLS caching</td>
                    <td className="p-3">Global Edge Network</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">AWS S3 / Cloud Storage</td>
                    <td className="p-3">Encrypted Asset Storage</td>
                    <td className="p-3">Uploaded GLB/GLTF models, portfolio images</td>
                    <td className="p-3">US / EU Regions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Contact & Data Protection Officer */}
          <section className="space-y-4 pt-4 border-t border-zylo-border">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">07.</span>
              Questions & Data Protection Officer (DPO)
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy, wish to exercise your statutory privacy rights, or request a Data Processing Agreement (DPA), contact our Data Protection Officer:
            </p>
            <div className="p-5 rounded-xl glass-panel border border-zylo-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-white">ZYLO Privacy & Compliance Team</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Email: <a href="mailto:privacy@zylo.design" className="text-zylo-cyan hover:underline">privacy@zylo.design</a>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Response SLA: Under 48 business hours for all statutory inquiries.
                </div>
              </div>
              <Link href="/terms">
                <span className="text-xs font-mono text-zylo-cyan hover:underline flex items-center gap-1">
                  View Terms of Service <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
