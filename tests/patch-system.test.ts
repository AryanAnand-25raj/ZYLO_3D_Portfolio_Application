import { describe, it, expect } from "vitest";
import { applyAIPatches } from "../packages/ai/src/patch-system";

describe("AI Patch System", () => {
  it("applies replace operations on deep JSON paths", () => {
    const target = {
      hero: {
        headline: "Original Headline",
        subheadline: "Original Subheadline",
      },
    };

    const result = applyAIPatches(target, {
      operations: [
        {
          op: "replace",
          path: "/hero/headline",
          value: "Architecting Dimensional Spatial Web Experiences",
        },
      ],
    });

    expect(result.appliedCount).toBe(1);
    expect(result.errors.length).toBe(0);
    expect(result.updated.hero.headline).toBe(
      "Architecting Dimensional Spatial Web Experiences"
    );
    expect(result.updated.hero.subheadline).toBe("Original Subheadline");
  });

  it("applies add and remove operations to array items", () => {
    const target = {
      about: {
        highlights: ["Highlight 1", "Highlight 2"],
      },
    };

    const addResult = applyAIPatches(target, {
      operations: [
        {
          op: "add",
          path: "/about/highlights/2",
          value: "Highlight 3",
        },
      ],
    });

    expect(addResult.updated.about.highlights.length).toBe(3);
    expect(addResult.updated.about.highlights[2]).toBe("Highlight 3");

    const removeResult = applyAIPatches(addResult.updated, {
      operations: [
        {
          op: "remove",
          path: "/about/highlights/0",
        },
      ],
    });

    expect(removeResult.updated.about.highlights.length).toBe(2);
    expect(removeResult.updated.about.highlights[0]).toBe("Highlight 2");
  });
});
