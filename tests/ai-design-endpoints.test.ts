import { describe, it, expect } from "vitest";
import { POST as handleDesignGenerate } from "../src/app/api/ai/design/generate/route";
import { POST as handleSceneGenerate } from "../src/app/api/ai/scene/generate/route";
import { NextRequest } from "next/server";

describe("AI Design & Scene API Endpoints Integration", () => {
  const mockProfile = {
    personal: {
      fullName: "Marcus Vance",
      headline: "Staff Graphics Architect",
      email: "marcus@zylo.design",
      availableForHire: true,
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: [],
    publications: [],
    services: [],
    socials: [],
    sourceMetadata: { resume: false, github: false, linkedin: false, manual: true },
  };

  it("POST /api/ai/design/generate returns complete Theme, Layout, Motion and Scene config", async () => {
    const body = {
      profile: mockProfile,
      profession: "Graphics Architect",
      industry: "Spatial Computing",
      template: { id: "orbit", category: "Space & Aerospace" },
      style: { preset: "Futuristic", prompt: "Exoplanet with neon cyber rings" },
      performanceTier: "high",
    };

    const req = new NextRequest("http://localhost:3000/api/ai/design/generate", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await handleDesignGenerate(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.theme.colors.primary).toBeDefined();
    expect(json.data.layout.hero).toBeDefined();
    expect(json.data.scene.nodes.length).toBeGreaterThan(0);
  });

  it("POST /api/ai/scene/generate synthesizes validated 3D scene from plan", async () => {
    const plan = {
      concept: "Orbital spatial experience",
      visualDirection: {
        mood: "Cinematic Space",
        style: "Orbital Deep-Space",
        paletteDescription: "Deep space cyan and violet",
        primaryColor: "#00F0FF",
        secondaryColor: "#9D00FF",
        accentColor: "#FF007A",
        backgroundColor: "#030712",
        surfaceColor: "#0D111C",
        fontFamily: "Inter" as const,
        headingFontFamily: "Outfit" as const,
      },
      layout: {
        hero: "split" as const,
        about: "split-metrics" as const,
        projects: "cards-grid" as const,
        experience: "timeline" as const,
        skills: "categorized-matrix" as const,
        contact: "minimal-form" as const,
      },
      motion: {
        intensity: "medium" as const,
        scrollEffects: true,
        cameraParallax: true,
        hoverSpring: true,
        sectionTransitions: "slide-up" as const,
      },
      sceneConcept: {
        concept: "Exoplanet with glowing orbit rings",
        templateId: "orbit" as const,
        focalElement: "Planet Core",
        lightingMood: "deep-space" as const,
        particleAtmosphere: "Starfield and stardust",
      },
    };

    const req = new NextRequest("http://localhost:3000/api/ai/scene/generate", {
      method: "POST",
      body: JSON.stringify({ plan, performanceTier: "high" }),
    });

    const res = await handleSceneGenerate(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.scene.camera.fov).toBeDefined();
    expect(json.scene.nodes.length).toBeGreaterThan(0);
  });
});
