import { describe, it, expect } from "vitest";
import {
  extractStructuredResume,
  normalizeAndDetectConflicts,
  analyzeProfileCompleteness,
  generatePortfolioContent,
  regenerateSection,
  applyAIPatches,
} from "../packages/ai/src";
import { DEFAULT_PORTFOLIO_CONTENT } from "../src/modules/content";
import { GeneratedPortfolioContentSchema } from "../src/schemas/ai.schema";

describe("Onboarding End-to-End Pipeline Integration", () => {
  it("executes the entire onboarding pipeline from resume to validated portfolio draft", async () => {
    // 1. Raw Resume Text Simulation
    const rawResume = `Alex Vance
Staff 3D Web Graphics Engineer
alex@zylo.design
San Francisco, CA

EXPERIENCE
Aura Spatial — Lead Engineer (2023 - Present)
Architected WebGL spatial canvas pipelines reducing shader latency by 45%.

PROJECTS
HyperSpace 3D — Real-time WebGL universe.

SKILLS
TypeScript, Three.js, React, WebGL, Next.js`;

    // 2. Structured Extraction
    const extracted = await extractStructuredResume(rawResume);
    expect(extracted.profile.fullName).toBe("Alex Vance");
    expect(extracted.skills).toContain("Three.js");

    // 3. Normalization & Conflict Detection
    const manualInput = {
      ...DEFAULT_PORTFOLIO_CONTENT,
      profile: {
        ...DEFAULT_PORTFOLIO_CONTENT.profile,
        fullName: "Alex Vance",
        headline: "Staff 3D Web Engineer",
      },
    };

    const normResult = normalizeAndDetectConflicts(manualInput, extracted);
    expect(normResult.canonicalProfile.profile.fullName).toBe("Alex Vance");
    expect(normResult.canonicalProfile.experiences.length).toBeGreaterThan(0);

    // 4. Completeness Analysis
    const completeness = analyzeProfileCompleteness(normResult.canonicalProfile);
    expect(completeness.score).toBeGreaterThanOrEqual(70);

    // 5. AI Content Generation
    const generated = await generatePortfolioContent({
      profile: normResult.canonicalProfile,
      preferences: {
        preset: "Futuristic",
        stylePrompt: "Futuristic dark neon cyberpunk aesthetic with glowing cyan accents.",
        targetAudience: "Employers",
        portfolioGoal: "Get a Job",
        visualIntensity: "Highly Interactive",
        selectedSections: ["Hero", "About", "Experience", "Skills", "Projects", "Contact"],
      },
      answeredQuestions: completeness.questions.map((q) => ({
        ...q,
        answer: "Lead graphics developer with focus on WebGL performance.",
      })),
    });

    const validatedGenerated = GeneratedPortfolioContentSchema.safeParse(generated);
    expect(validatedGenerated.success).toBe(true);
    expect(generated.hero.headline).toBeDefined();
    expect(generated.about.body).toBeDefined();
    expect(generated.projects.length).toBeGreaterThan(0);

    // 6. Section Regeneration
    const regenerated = regenerateSection(
      generated,
      "hero",
      normResult.canonicalProfile,
      {
        preset: "Cyberpunk",
        stylePrompt: "More intense neon pink glow",
        targetAudience: "Employers",
        portfolioGoal: "Get a Job",
        visualIntensity: "Highly Interactive",
        selectedSections: ["Hero"],
      }
    );

    expect(regenerated.hero).toBeDefined();
    expect(regenerated.about.body).toBe(generated.about.body); // About remained unchanged

    // 7. AI Patching
    const patchResult = applyAIPatches(regenerated, [
      {
        op: "replace",
        path: "/hero/badge",
        value: "Verified 3D Web Architect",
      },
    ]);

    expect(patchResult.updated.hero.badge).toBe("Verified 3D Web Architect");
  });
});
