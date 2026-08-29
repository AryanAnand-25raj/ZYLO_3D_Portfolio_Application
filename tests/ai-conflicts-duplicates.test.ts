import { describe, it, expect } from "vitest";
import { deduplicateProjects, deduplicateSkillCategories, deduplicateExperiences } from "../packages/ai/src/normalizers/duplicate-detector";
import { detectProfileConflicts } from "../packages/ai/src/normalizers/conflict-detector";

describe("AI Duplicate & Conflict Detection Engines", () => {
  describe("deduplicateProjects", () => {
    it("merges duplicate projects sharing slug/title variations", () => {
      const projects = [
        {
          id: "p1",
          title: "HyperSpace 3D",
          slug: "hyperspace-3d",
          summary: "Original summary",
          description: "Original description",
          category: "3D Graphics",
          tags: ["Three.js", "WebGL"],
          featured: false,
          stats: [{ label: "Frame Rate", value: "60 FPS" }],
          source: "resume" as const,
        },
        {
          id: "p2",
          title: "hyperspace-3d",
          slug: "hyperspace-3d",
          summary: "Updated GitHub summary",
          description: "Updated GitHub description",
          category: "Open Source",
          tags: ["GLSL", "React"],
          featured: true,
          demoUrl: "https://hyperspace.demo",
          stats: [],
          source: "github" as const,
        },
      ];

      const deduplicated = deduplicateProjects(projects);
      expect(deduplicated.length).toBe(1);
      expect(deduplicated[0].demoUrl).toBe("https://hyperspace.demo");
      expect(deduplicated[0].featured).toBe(true);
      expect(deduplicated[0].tags).toContain("Three.js");
      expect(deduplicated[0].tags).toContain("GLSL");
    });
  });

  describe("deduplicateSkillCategories", () => {
    it("merges skills case-insensitively while retaining highest proficiency", () => {
      const categories = [
        {
          id: "cat-1",
          category: "Graphics",
          skills: [{ name: "three.js", proficiency: 80, source: "resume" as const }],
        },
        {
          id: "cat-2",
          category: "Graphics",
          skills: [{ name: "Three.js", proficiency: 95, source: "manual" as const }],
        },
      ];

      const deduplicated = deduplicateSkillCategories(categories);
      expect(deduplicated.length).toBe(1);
      expect(deduplicated[0].skills.length).toBe(1);
      expect(deduplicated[0].skills[0].proficiency).toBe(95);
    });
  });

  describe("detectProfileConflicts", () => {
    it("surfaces meaningful discrepancies with requiresUserDecision = true", () => {
      const conflicts = detectProfileConflicts({
        manual: { headline: "Lead AI Engineer", location: "San Francisco, CA" },
        resume: { headline: "Frontend Developer", location: "San Francisco, CA" },
      });

      expect(conflicts.length).toBe(1);
      expect(conflicts[0].field).toBe("headline");
      expect(conflicts[0].requiresUserDecision).toBe(true);
      expect(conflicts[0].values.length).toBe(2);
    });
  });
});
