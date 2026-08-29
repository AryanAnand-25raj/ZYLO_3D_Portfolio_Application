import React from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { FeatureHighlights } from "@/components/marketing/FeatureHighlights";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zylo-dark text-foreground selection:bg-zylo-cyan/20 selection:text-zylo-cyan">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureHighlights />
      </main>
      <Footer />
    </div>
  );
}
