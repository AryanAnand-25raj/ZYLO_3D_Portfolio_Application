import React from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { HomeTemplateShowcase } from "@/components/marketing/HomeTemplateShowcase";
import { Interactive3DPlayground } from "@/components/marketing/Interactive3DPlayground";
import { FeatureHighlights } from "@/components/marketing/FeatureHighlights";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { CallToAction3D } from "@/components/marketing/CallToAction3D";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zylo-dark text-foreground selection:bg-zylo-cyan/20 selection:text-zylo-cyan">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HomeTemplateShowcase />
        <Interactive3DPlayground />
        <FeatureHighlights />
        <PricingPreview />
        <CallToAction3D />
      </main>
      <Footer />
    </div>
  );
}
