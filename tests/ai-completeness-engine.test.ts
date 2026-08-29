import { describe, it, expect } from "vitest";
import { evaluateProfileCompleteness } from "../packages/ai/src/completeness/completeness-engine";
import { generatePrioritizedFollowUps } from "../packages/ai/src/completeness/followup-engine";
import { CanonicalProfile } from "../packages/ai/src/schemas/canonical-profile.schema";

describe("AI Completeness & Follow-Up Questions Engine", () => {
  const completeProfile: CanonicalProfile = {
    personal: {
      fullName: "Alex Vance",
      headline: "Staff 3D Web Engineer",
      email: "alex@zylo.design",
      location: "San Francisco, CA",
      availableForHire: true,
    },
    summary: "Architecting interactive 3D WebGL web applications.",
    skills: [
      {
        id: "cat-1",
        category: "Graphics",
        skills: [
          { name: "Three.js", proficiency: 95, source: "manual" },
          { name: "WebGL", proficiency: 90, source: "manual" },
          { name: "TypeScript", proficiency: 95, source: "manual" },
          { name: "React", proficiency: 95, source: "manual" },
          { name: "GLSL", proficiency: 85, source: "manual" },
        ],
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
        description: "Leading WebGL graphics pipeline development.",
        highlights: ["Optimized shader latency"],
        technologies: ["Three.js"],
        source: "manual",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Stanford",
        degree: "B.S. CS",
        startDate: "2018",
        endDate: "2022",
        source: "manual",
      },
    ],
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
        demoUrl: "https://demo.com",
        stats: [{ label: "Frame Rate", value: "60 FPS" }],
        source: "manual",
      },
    ],
    certifications: [],
    achievements: [],
    publications: [],
    services: [],
    socials: [
      { platform: "github", url: "https://github.com/alexvance" },
      { platform: "linkedin", url: "https://linkedin.com/in/alexvance" },
    ],
    sourceMetadata: { resume: true, github: false, linkedin: false, manual: true },
  };

  it("evaluates a complete profile with score >= 85 and 0 required missing fields", () => {
    const report = evaluateProfileCompleteness(completeProfile);

    expect(report.score).toBeGreaterThanOrEqual(85);
    expect(report.requiredMissing.length).toBe(0);
    expect(report.categoryScores.length).toBe(6);
  });

  it("accurately classifies required missing fields on incomplete profile", () => {
    const incompleteProfile: CanonicalProfile = {
      ...completeProfile,
      personal: {
        ...completeProfile.personal,
        fullName: "", // Missing full name
      },
      projects: [], // Missing projects
    };

    const report = evaluateProfileCompleteness(incompleteProfile);
    expect(report.score).toBeLessThan(70);
    expect(report.requiredMissing.some((m) => m.field === "fullName")).toBe(true);
    expect(report.requiredMissing.some((m) => m.field === "projects")).toBe(true);
  });

  it("generates between 1 and 4 prioritized follow-up questions", () => {
    const questions = generatePrioritizedFollowUps(completeProfile, [], []);
    expect(questions.length).toBeGreaterThanOrEqual(1);
    expect(questions.length).toBeLessThanOrEqual(4);
    expect(questions.every((q) => q.question.length > 10)).toBe(true);
  });
});
