import { describe, it, expect } from "vitest";
import { POST as normalizeHandler } from "../src/app/api/ai/profile/normalize/route";
import { POST as contentHandler } from "../src/app/api/ai/content/generate/route";
import { POST as completenessHandler } from "../src/app/api/ai/completeness/analyze/route";
import { POST as followupsHandler } from "../src/app/api/ai/followups/generate/route";
import { GET as jobStatusHandler } from "../src/app/api/ai/jobs/[id]/route";
import { NextRequest } from "next/server";

describe("AI API Endpoints Integration", () => {
  const sampleProfile = {
    personal: {
      fullName: "Alex Vance",
      headline: "Staff 3D Web Graphics Engineer",
      email: "alex@zylo.design",
      location: "San Francisco, CA",
      availableForHire: true,
    },
    summary: "Pioneering spatial computing.",
    skills: [
      {
        id: "cat-1",
        category: "3D",
        skills: [{ name: "Three.js", proficiency: 95, source: "manual" }],
      },
    ],
    experience: [],
    education: [],
    projects: [
      {
        id: "p1",
        title: "HyperSpace",
        slug: "hyperspace",
        summary: "Real-time 3D universe.",
        description: "Built with WebGL.",
        category: "3D Graphics",
        tags: ["Three.js"],
        featured: true,
        stats: [{ label: "Frame Rate", value: "60 FPS" }],
        source: "manual",
      },
    ],
    certifications: [],
    achievements: [],
    publications: [],
    services: [],
    socials: [],
    sourceMetadata: { resume: false, github: false, linkedin: false, manual: true },
  };

  it("POST /api/ai/profile/normalize returns canonical profile and conflicts", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/profile/normalize", {
      method: "POST",
      body: JSON.stringify({
        manualData: sampleProfile,
        extractedData: {
          profile: { fullName: "Alex Vance", headline: "Lead Engineer" },
        },
      }),
    });

    const res = await normalizeHandler(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.canonicalProfile.personal.fullName).toBe("Alex Vance");
  });

  it("POST /api/ai/content/generate returns valid structured copy", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/content/generate", {
      method: "POST",
      body: JSON.stringify({
        profile: sampleProfile,
        style: "Technical",
        stylePrompt: "High-density GLSL shaders",
      }),
    });

    const res = await contentHandler(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.generatedContent.hero.headline).toBeDefined();
    expect(json.generatedContent.about.body).toBeDefined();
  });

  it("POST /api/ai/completeness/analyze returns completeness score and report", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/completeness/analyze", {
      method: "POST",
      body: JSON.stringify({
        profile: sampleProfile,
      }),
    });

    const res = await completenessHandler(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.report.score).toBeGreaterThan(0);
  });

  it("POST /api/ai/followups/generate returns prioritized questions", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/followups/generate", {
      method: "POST",
      body: JSON.stringify({
        profile: sampleProfile,
      }),
    });

    const res = await followupsHandler(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.questions.length).toBeGreaterThan(0);
  });

  it("GET /api/ai/jobs/:id returns job status", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/jobs/test-job-123", {
      method: "GET",
    });

    const res = await jobStatusHandler(req, { params: { id: "test-job-123" } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.job.id).toBe("test-job-123");
  });
});
