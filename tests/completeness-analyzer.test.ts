import { describe, it, expect } from "vitest";
import { analyzeProfileCompleteness } from "../packages/ai/src/completeness-analyzer";
import { DEFAULT_PORTFOLIO_CONTENT } from "../src/modules/content";

describe("CompletenessAnalyzer", () => {
  it("calculates high score for complete profile", () => {
    const result = analyzeProfileCompleteness(DEFAULT_PORTFOLIO_CONTENT);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.missing.length).toBe(0);
  });

  it("identifies missing bio and generates high-value follow-up question", () => {
    const incompleteProfile = {
      ...DEFAULT_PORTFOLIO_CONTENT,
      profile: {
        ...DEFAULT_PORTFOLIO_CONTENT.profile,
        bio: "", // Missing bio
      },
    };

    const result = analyzeProfileCompleteness(incompleteProfile);
    expect(result.score).toBeLessThan(100);
    expect(result.missing).toContain("Short Bio");
    expect(result.questions.some((q) => q.section === "About")).toBe(true);
  });

  it("handles missing work experience when section is enabled", () => {
    const noExpProfile = {
      ...DEFAULT_PORTFOLIO_CONTENT,
      experiences: [],
    };

    const result = analyzeProfileCompleteness(noExpProfile, ["Experience", "Projects"]);
    expect(result.missing).toContain("Work Experience");
  });
});
