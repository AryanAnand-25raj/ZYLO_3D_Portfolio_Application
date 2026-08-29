import { describe, it, expect } from "vitest";
import {
  generateDesignAndScene,
  planDesign,
  planDesignProcedurally,
  generateThemeFromPlan,
  generateLayoutFromPlan,
  validateAndSanitizeScene,
  DesignInput,
} from "../packages/ai/src";

describe("AI Design Director & 3D Scene Generation", () => {
  const baseProfile = {
    personal: {
      fullName: "Elena Rostova",
      headline: "Staff AI Research Engineer",
      email: "elena@zylo.design",
      availableForHire: true,
    },
    skills: [
      {
        id: "cat-1",
        category: "Machine Learning",
        skills: [{ name: "PyTorch", proficiency: 95, source: "manual" as const }],
      },
    ],
    experience: [],
    education: [],
    projects: [
      {
        id: "proj-1",
        title: "Synapse-3D Neural Visualizer",
        slug: "synapse-3d",
        description: "High-performance neural network visualization for deep models.",
        category: "AI Spatial Tool",
        summary: "High-performance neural network visualization.",
        tags: ["PyTorch", "WebGL", "Three.js"],
        featured: true,
        source: "manual" as const,
        stats: [],
      },
    ],
    certifications: [],
    achievements: [],
    publications: [],
    services: [],
    socials: [],
    sourceMetadata: { resume: false, github: false, linkedin: false, manual: true },
  };

  it("plans tailored visual direction for AI/ML Engineer with Neural template", async () => {
    const input: DesignInput = {
      profile: baseProfile,
      profession: "AI Research Engineer",
      industry: "Artificial Intelligence",
      template: { id: "neural", category: "AI & Data Science" },
      style: { preset: "Futuristic", prompt: "Glowing synaptic networks and kinetic data flows" },
      performanceTier: "high",
      reducedMotion: false,
      targetAudience: "AI Labs & Tech Leaders",
    };

    const plan = await planDesign(input);
    expect(plan.visualDirection.mood).toBeDefined();
    expect(plan.sceneConcept.templateId).toBe("neural");
    expect(plan.visualDirection.primaryColor).toMatch(/^#[0-9a-fA-F]{6}$/);

    const result = await generateDesignAndScene(input);
    expect(result.theme.name).toBeDefined();
    expect(result.theme.colors.primary).toBe(plan.visualDirection.primaryColor);
    expect(result.layout.hero).toBe("split");
    expect(result.scene.nodes.length).toBeGreaterThan(0);
  });

  it("plans tailored visual direction for Aerospace Engineer with Orbit template", async () => {
    const input: DesignInput = {
      profile: {
        ...baseProfile,
        personal: {
          ...baseProfile.personal,
          headline: "Orbital Dynamics Architect",
        },
      },
      profession: "Aerospace Engineer",
      industry: "Aerospace & Defense",
      template: { id: "orbit", category: "Space & Aerospace" },
      style: { preset: "Deep Space", prompt: "Cinematic planetary orbit with celestial starfield" },
      performanceTier: "high",
      reducedMotion: false,
      targetAudience: "Space Agencies & Founders",
    };

    const plan = planDesignProcedurally(input);
    expect(plan.visualDirection.style).toContain("Orbital");
    expect(plan.sceneConcept.templateId).toBe("orbit");
    expect(plan.sceneConcept.lightingMood).toBe("deep-space");

    const theme = generateThemeFromPlan(plan);
    expect(theme.colors.primary).toBe(plan.visualDirection.primaryColor);

    const layout = generateLayoutFromPlan(plan);
    expect(layout.projects).toBe("cards-grid");
  });

  it("adapts scene configuration safely for Mobile & Reduced Motion tiers", async () => {
    const input: DesignInput = {
      profile: baseProfile,
      profession: "Product Designer",
      industry: "Design & UX",
      template: { id: "glass", category: "Luxury & Product" },
      style: { preset: "Glassmorphism", prompt: "Refractive crystal with soft lighting" },
      performanceTier: "mobile",
      reducedMotion: true,
      targetAudience: "Design Agencies",
    };

    const result = await generateDesignAndScene(input);
    expect(result.scene.performance.tier).toBe("mobile");
    expect(result.scene.performance.reducedMotion).toBe(true);
    expect(result.scene.lighting.lights.length).toBeLessThanOrEqual(3);
    expect(result.scene.postProcessing.bloom.enabled).toBe(false);
  });

  it("validates and sanitizes scene, stripping unapproved components or assets", () => {
    const maliciousScene = {
      nodes: [
        {
          id: "evil-node",
          componentType: "MaliciousComponentUnknown",
          position: [0, 0, 0],
        },
        {
          id: "fake-model",
          componentType: "model",
          assetId: "https://evil.com/trojan.glb",
          position: [1, 1, 1],
        },
      ],
    };

    const validation = validateAndSanitizeScene(maliciousScene, "orbit", "high", false);
    expect(validation.valid).toBe(false);
    expect(validation.violations.length).toBeGreaterThan(0);
    // Unapproved component was filtered, unapproved asset was replaced with proxy TorusKnotCore
    expect(validation.sanitizedConfig.nodes.every((n) => (n.componentType as string) !== "MaliciousComponentUnknown")).toBe(true);
  });
});
