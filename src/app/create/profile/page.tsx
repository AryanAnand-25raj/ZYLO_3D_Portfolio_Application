"use client";

import React, { useState } from "react";
import { useDraft } from "@/components/create/DraftProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  Github,
  Linkedin,
  Twitter,
  ArrowRight,
  Sparkles,
  Phone,
} from "lucide-react";

export default function CreateProfileStepPage() {
  const { profileData, setProfileData, nextStep, saveDraft } = useDraft();

  const [fullName, setFullName] = useState(profileData.profile.fullName || "Alex Vance");
  const [headline, setHeadline] = useState(
    profileData.profile.headline || "Creative Technologist & 3D Interactive Web Architect"
  );
  const [bio, setBio] = useState(
    profileData.profile.bio ||
      "Pioneering interactive spatial dimensions, combining spatial computing, generative visual systems, and high-performance WebGL architectures."
  );
  const [location, setLocation] = useState(profileData.profile.location || "San Francisco, CA");
  const [availableForHire, setAvailableForHire] = useState(profileData.profile.availableForHire ?? true);

  // Social Links state
  const [githubUrl, setGithubUrl] = useState(
    profileData.socials.find((s) => s.platform === "github")?.url || "https://github.com"
  );
  const [linkedinUrl, setLinkedinUrl] = useState(
    profileData.socials.find((s) => s.platform === "linkedin")?.url || "https://linkedin.com"
  );
  const [twitterUrl, setTwitterUrl] = useState(
    profileData.socials.find((s) => s.platform === "twitter")?.url || "https://twitter.com"
  );
  const [websiteUrl, setWebsiteUrl] = useState(
    profileData.socials.find((s) => s.platform === "website")?.url || "https://zylo.design"
  );

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile = {
      ...profileData,
      profile: {
        ...profileData.profile,
        fullName,
        headline,
        bio,
        location,
        availableForHire,
      },
      socials: [
        { platform: "github" as const, url: githubUrl, label: "GitHub" },
        { platform: "linkedin" as const, url: linkedinUrl, label: "LinkedIn" },
        { platform: "twitter" as const, url: twitterUrl, label: "X" },
        { platform: "website" as const, url: websiteUrl, label: "Portfolio" },
      ].filter((s) => Boolean(s.url)),
    };

    setProfileData(updatedProfile);
    await saveDraft();
    nextStep();
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="font-mono text-[10px]">
            STEP 01 OF 06
          </Badge>
          <span className="text-xs text-slate-400 font-mono">Profile Foundation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
          Let&apos;s build your core profile narrative
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl">
          Enter your personal and professional details. You can also upload your resume in the next
          step to auto-fill additional experience, education, and projects.
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-6">
        {/* Personal Details Card */}
        <Card className="glass-panel border-zylo-border p-6 space-y-6">
          <CardHeader className="p-0 space-y-1">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <User className="w-4 h-4 text-zylo-cyan" /> Personal & Professional Identity
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              This information powers your portfolio hero, about card, and meta tags.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Full Name <span className="text-zylo-cyan">*</span>
                </label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="bg-zylo-surface/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="bg-zylo-surface/80"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Professional Headline{" "}
                <span className="text-zylo-cyan">*</span>
              </label>
              <Input
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Staff 3D Web Engineer & Creative Technologist"
                className="bg-zylo-surface/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Short Biography / Elevator Pitch
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your creative engineering philosophy, domain focus, or core strengths..."
                className="w-full rounded-lg border border-zylo-border bg-zylo-surface/80 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-zylo-cyan transition-all"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="hireable"
                checked={availableForHire}
                onChange={(e) => setAvailableForHire(e.target.checked)}
                className="rounded border-zylo-border bg-zylo-surface text-zylo-cyan focus:ring-zylo-cyan"
              />
              <label htmlFor="hireable" className="text-xs text-slate-300 cursor-pointer">
                Display &quot;Available for Projects / Hire&quot; badge on 3D hero scene
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Social Links Card */}
        <Card className="glass-panel border-zylo-border p-6 space-y-6">
          <CardHeader className="p-0 space-y-1">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Globe className="w-4 h-4 text-zylo-purple" /> Social Links & Presence
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Connected links will render as floating interactive spatial pills.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-400" /> GitHub URL
              </label>
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="bg-zylo-surface/80 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-sky-400" /> LinkedIn URL
              </label>
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="bg-zylo-surface/80 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 text-sky-300" /> X (Twitter) URL
              </label>
              <Input
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://twitter.com/username"
                className="bg-zylo-surface/80 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> Website / Blog URL
              </label>
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourdomain.com"
                className="bg-zylo-surface/80 text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-zylo-border">
          <span className="text-xs text-slate-500">
            Step 1 of 6 • All entries auto-saved
          </span>
          <Button type="submit" variant="glow" size="lg" className="gap-2">
            Continue to Resume Upload <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
