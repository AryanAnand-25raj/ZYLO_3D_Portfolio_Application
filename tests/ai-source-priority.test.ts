import { describe, it, expect } from "vitest";
import { normalizeMultiSourceProfile } from "../packages/ai/src/normalizers/profile-normalizer";
import { CanonicalProfileSchema } from "../packages/ai/src/schemas/canonical-profile.schema";

describe("AI Source Priority & Factuality Rules", () => {
  it("enforces Source Priority: Manual Form > Resume > GitHub > LinkedIn", () => {
    const inputs = {
      manualData: {
        personal: {
          fullName: "Alex Vance (Manual)",
          headline: "Staff AI Graphics Architect",
          location: "San Francisco, CA",
        },
      },
      resumeData: {
        profile: {
          fullName: "Alex Vance (Resume)",
          headline: "Senior Frontend Engineer",
          location: "Austin, TX",
        },
      },
      githubData: {
        name: "Alex Vance (GitHub)",
        bio: "Open-source WebGL Hacker",
        location: "Remote",
      },
    };

    const result = normalizeMultiSourceProfile(inputs);

    // Form data must win over Resume and GitHub
    expect(result.canonicalProfile.personal.fullName).toBe("Alex Vance (Manual)");
    expect(result.canonicalProfile.personal.headline).toBe("Staff AI Graphics Architect");
    expect(result.canonicalProfile.personal.location).toBe("San Francisco, CA");

    // Conflicts must be surfaced for auditing
    expect(result.conflicts.length).toBeGreaterThan(0);
    expect(result.conflicts.some((c) => c.field === "headline")).toBe(true);
  });

  it("uses Resume data as priority fallback when manual field is empty", () => {
    const inputs = {
      manualData: {
        personal: {
          fullName: "Alex Vance",
          headline: "", // Empty manual headline
        },
      },
      resumeData: {
        profile: {
          headline: "Lead 3D Web Engineer",
          email: "alex@zylo.design",
        },
      },
    };

    const result = normalizeMultiSourceProfile(inputs);
    expect(result.canonicalProfile.personal.fullName).toBe("Alex Vance");
    expect(result.canonicalProfile.personal.headline).toBe("Lead 3D Web Engineer");
    expect(result.canonicalProfile.personal.email).toBe("alex@zylo.design");
  });

  it("strictly enforces Factual Accuracy Rule: never invents non-existent credentials or jobs", () => {
    const minimalInputs = {
      manualData: {
        personal: {
          fullName: "Alex Vance",
        },
        experience: [],
      },
    };

    const result = normalizeMultiSourceProfile(minimalInputs);
    const parsed = CanonicalProfileSchema.safeParse(result.canonicalProfile);

    expect(parsed.success).toBe(true);
    expect(result.canonicalProfile.experience.length).toBe(0);
    expect(result.canonicalProfile.certifications.length).toBe(0);
  });
});
