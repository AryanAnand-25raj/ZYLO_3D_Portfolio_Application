import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Scale,
  Sparkles,
  ShieldAlert,
  CreditCard,
  Globe2,
  Lock,
  ArrowRight,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Code2,
} from "lucide-react";

export const metadata = {
  title: "Terms of Service | ZYLO 3D",
  description:
    "Read the Terms of Service governing the use of ZYLO 3D portfolio creation, 3D WebGL engine runtime, custom domains, and subscription billing.",
};

export default function TermsPage() {
  const lastUpdated = "September 9, 2026";

  const termsHighlights = [
    {
      icon: Sparkles,
      title: "100% Creator Ownership",
      desc: "You retain full intellectual property, copyright, and commercial ownership over all content, 3D assets, resumes, and code in your portfolio.",
    },
    {
      icon: CreditCard,
      title: "Fair & Transparent Billing",
      desc: "Transparent pricing in INR or USD with zero surprise overage fees. You can cancel subscriptions anytime directly from your dashboard.",
    },
    {
      icon: Globe2,
      title: "Custom Domain Freedom",
      desc: "Bind custom domains with automated TLS 1.3 certificates. You maintain full ownership of your domains and DNS records.",
    },
    {
      icon: ShieldAlert,
      title: "Zero Tolerance for Exploits",
      desc: "Strict sandbox rules protect our ecosystem. Hosting malicious shaders, malware, phishing sites, or crypto miners is forbidden.",
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
              <Scale className="w-3.5 h-3.5" /> Legal Terms
            </Badge>
            <span className="text-xs font-mono text-slate-500">
              Last Updated: {lastUpdated}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
            Please review these Terms of Service carefully before utilizing ZYLO to build, host, and publish your real-time 3D WebGL portfolio dimensions.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {termsHighlights.map((pillar, idx) => {
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

        {/* Detailed Terms Content */}
        <div className="space-y-12 text-slate-300 text-sm sm:text-base leading-relaxed">
          {/* Section 1: Agreement to Terms */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">01.</span>
              Agreement to Terms
            </h2>
            <p>
              By accessing, creating an account, or publishing a portfolio on ZYLO (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these Terms of Service and our{" "}
              <Link href="/privacy" className="text-zylo-cyan hover:underline">
                Privacy Policy
              </Link>
              . If you are entering into this agreement on behalf of a company or organization, you represent that you possess the authority to bind such entity.
            </p>
          </section>

          {/* Section 2: Creator Accounts & Security */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">02.</span>
              Account Registration & Security
            </h2>
            <p>
              To access the 3D Studio, deploy portfolios, or subscribe to paid tiers, you must create a ZYLO account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 text-sm">
              <li>Provide accurate, current, and complete registration information.</li>
              <li>Safeguard your authentication credentials and notify us immediately of any unauthorized access.</li>
              <li>Accept responsibility for all activities conducted through your account.</li>
            </ul>
          </section>

          {/* Section 3: Intellectual Property & 100% Ownership */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">03.</span>
              Intellectual Property Rights & Creator Ownership
            </h2>
            <Card className="glass-panel border-zylo-cyan/30 bg-zylo-cyan/5 my-4">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-zylo-cyan font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> You Retain Complete Ownership of Your Work
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  ZYLO does NOT claim ownership of any content, 3D models, resumes, code snippets, project showcases, or personal branding assets you upload or configure. You retain all copyrights, patents, and trademarks.
                </p>
              </CardContent>
            </Card>
            <p>
              By publishing your portfolio on our global edge network, you grant ZYLO a non-exclusive, worldwide, royalty-free license solely to host, render, cache, and transmit your 3D portfolio to end-users as intended by your privacy and publication settings.
            </p>
            <p>
              All platform software, including <code className="text-zylo-cyan font-mono text-xs">@zylo/three-engine</code>, template architectures, proprietary shaders, and ZYLO logos, remain the exclusive property of ZYLO Inc.
            </p>
          </section>

          {/* Section 4: Acceptable Use & Prohibited Conduct */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">04.</span>
              Acceptable Use Policy
            </h2>
            <p>
              To protect the integrity of our edge infrastructure and the safety of web visitors, you agree NOT to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 text-sm">
              <li>
                Upload or attempt to inject malicious WebGL shaders, memory-overflow loops, or cryptocurrency miners.
              </li>
              <li>
                Host phishing schemes, deceptive job offers, malware, spyware, or counterfeit brand portals.
              </li>
              <li>
                Attempt to bypass our security sandboxes, SSRF filters, or API rate limits.
              </li>
              <li>
                Distribute illegal, infringing, defamatory, or non-consensual personal material.
              </li>
              <li>
                Reverse-engineer, decompile, or extract the source code of our backend services.
              </li>
            </ul>
            <p className="text-xs text-rose-400 font-mono">
              Violation of this policy may result in immediate portfolio takedown and permanent account termination.
            </p>
          </section>

          {/* Section 5: AI Generation & Assisted Customization */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">05.</span>
              AI Generation Services & Quotas
            </h2>
            <p>
              ZYLO includes AI-powered design assistants, resume parsers, and scene synthesizers. When using AI capabilities:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 text-sm">
              <li>
                AI generation is subject to monthly plan quotas (e.g., 5/month on Starter, 50/month on Pro, 200/month on Agency).
              </li>
              <li>
                You are responsible for reviewing all AI-generated content before publishing it live to ensure accuracy.
              </li>
              <li>
                All user prompts pass through automated security sanitization to prevent prompt injection and unauthorized system access.
              </li>
            </ul>
          </section>

          {/* Section 6: Subscriptions, Billing & Cancellations */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">06.</span>
              Subscription Plans, Payments & Refunds
            </h2>
            <div className="space-y-3 text-slate-400 text-sm">
              <p>
                <strong className="text-white">Billing Intervals:</strong> Paid tiers (Pro Spatial Dimension, Agency Suite) are billed in advance on a recurring monthly or annual basis in either Indian Rupees (₹ INR) or US Dollars ($ USD).
              </p>
              <p>
                <strong className="text-white">Cancellation:</strong> You may cancel your subscription at any time via your Dashboard. Upon cancellation, your plan benefits remain active until the end of the current billing cycle, after which your account reverts to Starter tier limits without deleting your portfolio data.
              </p>
              <p>
                <strong className="text-white">14-Day Refund Policy:</strong> If you are dissatisfied with an initial annual subscription purchase, you may request a full refund within 14 calendar days of your initial transaction by contacting billing@zylo.design.
              </p>
            </div>
          </section>

          {/* Section 7: Domains & Subdomains */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">07.</span>
              Custom Domains & Subdomains
            </h2>
            <p>
              ZYLO provides creators with a free subdomain (<code className="text-zylo-cyan font-mono text-xs">zylo.design/username</code>) and the ability to link custom domains (<code className="text-zylo-cyan font-mono text-xs">alex.dev</code>) on eligible plans.
            </p>
            <p>
              We reserve the right to reclaim, suspend, or reassign subdomains that violate registered trademarks, impersonate public figures or entities, or remain dormant on suspended accounts.
            </p>
          </section>

          {/* Section 8: Disclaimer of Warranties & Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">08.</span>
              Disclaimer & Limitation of Liability
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              The platform and 3D engine are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. While we strive for 99.9% uptime, we do not guarantee uninterrupted, bug-free, or GPU-independent operation across every legacy browser or hardware configuration.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              To the maximum extent permitted by applicable law, ZYLO Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues resulting from your use of the platform.
            </p>
          </section>

          {/* Section 9: Governing Law & Contact */}
          <section className="space-y-4 pt-4 border-t border-zylo-border">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <span className="text-zylo-cyan font-mono text-sm">09.</span>
              Governing Law & Inquiries
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Delaware, United States, without regard to its conflict of law provisions.
            </p>
            <div className="p-5 rounded-xl glass-panel border border-zylo-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-white">ZYLO Legal & Compliance</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Email: <a href="mailto:legal@zylo.design" className="text-zylo-cyan hover:underline">legal@zylo.design</a>
                </div>
              </div>
              <Link href="/privacy">
                <span className="text-xs font-mono text-zylo-cyan hover:underline flex items-center gap-1">
                  View Privacy Policy <ArrowRight className="w-3.5 h-3.5" />
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
