import { describe, it, expect } from "vitest";
import {
  generatePortfolioContent,
  synthesizeContentProcedurally,
  regenerateSection,
} from "../packages/ai/src/content/content-engine";
import { ContentStylePresetEnum, PortfolioContentSchema } from "../packages/ai/src/schemas/portfolio-content.schema";
import { CanonicalProfile } from "../packages/ai/src/schemas/canonical-profile.schema";

describe("AI Content Generation Engine & Multi-Style Presets", () => {
  const sampleProfile: CanonicalProfile = {
    personal: {
      fullName: "Alex Vance",
      headline: "Staff 3D Web Graphics Engineer",
      email: "alex@zylo.design",
      location: "San Francisco, CA",
      availableForHire: true,
    },
    summary: "Pioneering spatial computing and real-time WebGL graphics.",
    skills: [
      {
        id: "cat-1",
        category: "Graphics",
        skills: [{ name: "Three.js", proficiency: 95, source: "manual" }],
      },
    ],
    experience: [
      {
        id: "exp-1",
        company: "Aura Spatial",
        role: "Lead Graphics Engineer",
        startDate: "2023",
        endDate: "Present",
        current: true,
        description: "Architected real-time WebGL canvas rendering pipelines.",
        highlights: ["Reduced shader draw call overhead"],
        technologies: ["Three.js", "GLSL"],
        source: "manual",
      },
    ],
    education: [],
    projects: [
      {
        id: "p1",
        title: "HyperSpace",
        slug: "hyperspace",
        summary: "Real-time 3D universe.",
        description: "Built with WebGL and React.",
        category: "3D Graphics",
        tags: ["Three.js", "GLSL"],
        featured: true,
        stats: [{ label: "Frame Rate", value: "60 FPS" }],
        source: "manual",
      },
    ],
    certifications: [],
    achievements: [],
    publications: [],
    services: [],
    socials: [{ platform: "github", url: "https://github.com/alexvance" }],
    sourceMetadata: { resume: true, github: false, linkedin: false, manual: true },
  };

  it("generates valid PortfolioContent conforming to schema for all 7 styles", async () => {
    for (const style of ContentStylePresetEnum.options) {
      const content = await generatePortfolioContent({
        profile: sampleProfile,
        style,
        stylePrompt: "Cinematic dark nebula lighting",
      });

      const parsed = PortfolioContentSchema.safeParse(content);
      expect(parsed.success).toBe(true);
      expect(content.hero.headline).toBeDefined();
      expect(content.about.title).toContain("Alex Vance");
      expect(content.projects.length).toBe(1);
    }
  });

  it("produces distinct phrasing for Technical vs Creative vs Minimal styles", () => {
    const technical = synthesizeContentProcedurally(sampleProfile, "Technical");
    const creative = synthesizeContentProcedurally(sampleProfile, "Creative");
    const minimal = synthesizeContentProcedurally(sampleProfile, "Minimal");

    expect(technical.hero.headline).not.toBe(creative.hero.headline);
    expect(technical.hero.headline).not.toBe(minimal.hero.headline);
  });

  it("supports single-section regeneration while preserving unchanged sections", () => {
    const original = synthesizeContentProcedurally(sampleProfile, "Professional");
    const updated = regenerateSection(original, "hero", sampleProfile, "Bold");

    expect(updated.hero.headline).not.toBe(original.hero.headline);
    expect(updated.about.body).toBe(original.about.body);
    expect(updated.projects).toEqual(original.projects);
  });
});
