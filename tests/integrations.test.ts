import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  TokenEncryptionService,
  OAuthStateService,
  GitHubProvider,
  ProjectQualityScorer,
  GitHubProject,
  LinkedInProvider,
  LinkedInFallbackParser,
  IntegrationNormalizer,
} from "@zylo/integrations";
import { IntegrationStorageManager } from "../src/modules/integrations/storage";

describe("Professional Integrations — Token Encryption & Security", () => {
  it("encrypts and decrypts OAuth tokens using AES-256-GCM with authenticated verification", () => {
    const rawToken = "mock_gho_16C7e42F292c6912E7710c838347Ae178B4a";
    const encrypted = TokenEncryptionService.encrypt(rawToken);

    // Formatted as iv:authTag:ciphertext
    expect(encrypted).toContain(":");
    expect(encrypted.split(":")).toHaveLength(3);
    expect(encrypted).not.toContain(rawToken);

    // Round-trip decryption
    const decrypted = TokenEncryptionService.decrypt(encrypted);
    expect(decrypted).toBe(rawToken);
  });

  it("strictly rejects tampered ciphertext or altered authentication tags", () => {
    const rawToken = "gho_super_secret_oauth_token";
    const encrypted = TokenEncryptionService.encrypt(rawToken);
    const [iv, tag, cipher] = encrypted.split(":");

    // Tampered ciphertext
    const tamperedCipher = `${iv}:${tag}:${cipher.slice(0, -2)}ff`;
    expect(() => TokenEncryptionService.decrypt(tamperedCipher)).toThrow();

    // Tampered auth tag
    const tamperedTag = `${iv}:${tag.slice(0, -2)}00:${cipher}`;
    expect(() => TokenEncryptionService.decrypt(tamperedTag)).toThrow();
  });

  it("generates single-use cryptographic CSRF state and prevents replay attacks", () => {
    const userId = "user-test-42";
    const state = OAuthStateService.generateState(userId, "github");

    expect(state).toContain("zylo_github_");

    // First validation succeeds
    const firstValidation = OAuthStateService.validateAndConsumeState(state, "github");
    expect(firstValidation.valid).toBe(true);
    expect(firstValidation.userId).toBe(userId);

    // Second validation fails (single-use replay prevention)
    const replayValidation = OAuthStateService.validateAndConsumeState(state, "github");
    expect(replayValidation.valid).toBe(false);
    expect(replayValidation.error).toContain("Invalid or expired");
  });

  it("rejects state validation on provider mismatch", () => {
    const state = OAuthStateService.generateState("user-1", "github");
    const result = OAuthStateService.validateAndConsumeState(state, "linkedin");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("mismatch");
  });
});

describe("Professional Integrations — GitHub Provider & Project Ranking", () => {
  const sampleRepos: GitHubProject[] = [
    {
      id: "101",
      name: "hyperion-3d-visualizer",
      fullName: "alexvance/hyperion-3d-visualizer",
      description: "Real-time WebGL space simulation built with Three.js and custom GLSL shaders.",
      url: "https://github.com/alexvance/hyperion-3d-visualizer",
      homepage: "https://hyperion.dimension.dev",
      language: "TypeScript",
      languages: ["TypeScript", "GLSL"],
      topics: ["threejs", "webgl", "shader", "3d"],
      stars: 120,
      forks: 18,
      isFork: false,
      isPrivate: false,
      createdAt: "2023-01-15T00:00:00Z",
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      pushedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "102",
      name: "abandoned-star-experiment",
      fullName: "alexvance/abandoned-star-experiment",
      description: "Old experiment from 4 years ago",
      url: "https://github.com/alexvance/abandoned-star-experiment",
      homepage: "",
      language: "JavaScript",
      languages: ["JavaScript"],
      topics: [],
      stars: 400, // High stars but inactive and unmaintained
      forks: 10,
      isFork: false,
      isPrivate: false,
      createdAt: "2019-01-15T00:00:00Z",
      updatedAt: "2020-05-10T00:00:00Z",
      pushedAt: "2020-05-10T00:00:00Z",
    },
    {
      id: "103",
      name: "forked-helper-repo",
      fullName: "alexvance/forked-helper-repo",
      description: "A fork of a popular utility library",
      url: "https://github.com/alexvance/forked-helper-repo",
      homepage: "",
      language: "TypeScript",
      languages: ["TypeScript"],
      topics: ["utility"],
      stars: 5,
      forks: 0,
      isFork: true,
      isPrivate: false,
      createdAt: "2023-05-01T00:00:00Z",
      updatedAt: "2023-05-01T00:00:00Z",
    },
  ];

  it("evaluates project quality objectively without equating raw stars to quality", () => {
    const ranked = ProjectQualityScorer.rankProjects(sampleRepos);

    // Hyperion should be the top ranked project because of live demo, recent activity, and 3D stack
    const topProject = ranked.topRecommended[0];
    expect(topProject.project.id).toBe("101");
    expect(topProject.recommendation.score).toBeGreaterThan(75);
    expect(topProject.recommendation.recommendedCategory).toBe("Interactive 3D / WebGL");
    expect(topProject.recommendation.reasons).toContain("Live interactive demo available");

    // Abandoned experiment with 400 stars should score lower than active hyperion
    const abandonedEval = ranked.evaluated.find((e) => e.project.id === "102")!;
    expect(abandonedEval.recommendation.score).toBeLessThan(topProject.recommendation.score);
    expect(abandonedEval.recommendation.reasons).toContain("Inactive for over a year");

    // Forked repo receives fork penalty
    const forkedEval = ranked.evaluated.find((e) => e.project.id === "103")!;
    expect(forkedEval.recommendation.reasons.some((r) => r.includes("Forked"))).toBe(true);
  });

  it("generates GitHub OAuth URL with read:user,public_repo scopes", async () => {
    const provider = new GitHubProvider({ clientId: "gh_test_client_id" });
    const authUrl = await provider.getAuthorizationUrl("test_state_123", "http://localhost:3000/callback");

    expect(authUrl).toContain("https://github.com/login/oauth/authorize");
    expect(authUrl).toContain("client_id=gh_test_client_id");
    expect(authUrl).toContain("scope=read%3Auser%2Cpublic_repo");
    expect(authUrl).toContain("state=test_state_123");
  });

  it("handles GitHub API failures and expired token detection", async () => {
    const provider = new GitHubProvider();

    // Mock expired token response
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Bad credentials" }),
    });

    const mockConn = {
      id: "conn-1",
      userId: "user-1",
      provider: "github" as const,
      status: "connected" as const,
      externalAccountId: "123",
      scopes: ["read:user"],
      encryptedAccessToken: TokenEncryptionService.encrypt("expired_token"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await expect(provider.fetchRepositories(mockConn)).rejects.toThrow("expired or revoked");

    global.fetch = originalFetch;
  });
});

describe("Professional Integrations — LinkedIn Provider & Fallback Parser", () => {
  it("parses public LinkedIn profile URLs into structured reference data", () => {
    const url = "https://www.linkedin.com/in/alex-vance-developer/";
    const parsed = LinkedInFallbackParser.parse(url);

    expect(parsed.sourceType).toBe("url_reference");
    expect(parsed.publicUrl).toBe(url);
    expect(parsed.fullName).toContain("Alex Vance");
  });

  it("parses freeform pasted LinkedIn profile text extracting headline and career summary", () => {
    const pastedText = `
      Alex Vance
      Staff 3D Graphics & Spatial Software Engineer
      San Francisco Bay Area
      About
      Pioneering real-time 3D WebGL rendering engines and interactive spatial portfolios.
      Experience
      Lead Graphics Architect at Dimension Studios
      Skills
      Three.js · WebGL · GLSL · React Three Fiber · TypeScript
    `;

    const parsed = LinkedInFallbackParser.parse(pastedText);

    expect(parsed.sourceType).toBe("pasted_text");
    expect(parsed.fullName).toBe("Alex Vance");
    expect(parsed.headline).toContain("3D Graphics");
    expect(parsed.location).toContain("San Francisco");
    expect(parsed.skills).toContain("Three.js");
    expect(parsed.skills).toContain("TypeScript");
    expect(parsed.experiences.length).toBeGreaterThan(0);
    expect(parsed.experiences[0].company).toBe("Dimension Studios");
  });

  it("parses legitimate LinkedIn JSON archive exports", () => {
    const archiveJson = JSON.stringify({
      profile: {
        firstName: "Alex",
        lastName: "Vance",
        headline: "Principal 3D Engineer",
        summary: "Specializing in GPU shaders",
      },
      positions: [
        { companyName: "Nexus Labs", title: "Senior Fullstack Engineer", startDate: "2021" },
      ],
      skills: ["Three.js", "Rust", "Next.js"],
    });

    const parsed = LinkedInFallbackParser.parse(archiveJson);

    expect(parsed.sourceType).toBe("exported_data");
    expect(parsed.fullName).toBe("Alex Vance");
    expect(parsed.headline).toBe("Principal 3D Engineer");
    expect(parsed.experiences).toHaveLength(1);
    expect(parsed.experiences[0].company).toBe("Nexus Labs");
    expect(parsed.skills).toContain("Rust");
  });

  it("handles LinkedIn limited API permissions gracefully", async () => {
    const provider = new LinkedInProvider();

    // Mock code exchange & limited userinfo
    const originalFetch = global.fetch;
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "li_token_123", expires_in: 3600 }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 403, // Elevated member permissions denied
        json: async () => ({ message: "Not enough permissions" }),
      });

    const result = await provider.handleCallback({
      code: "valid_code",
      state: "state_123",
      redirectUri: "http://localhost:3000/callback",
    });

    expect(result.success).toBe(true);
    expect(result.limitedPermissions).toBe(true);

    global.fetch = originalFetch;
  });
});

describe("Professional Integrations — Multi-Source Normalization & Conflicts", () => {
  it("attaches source attribution and maps GitHub projects into Canonical Project schema", () => {
    const sampleRepo: GitHubProject = {
      id: "999",
      name: "zylo-engine",
      fullName: "zylo/zylo-engine",
      description: "WebGL 3D engine",
      url: "https://github.com/zylo/zylo-engine",
      homepage: "https://zylo.design",
      language: "TypeScript",
      languages: ["TypeScript"],
      topics: ["webgl", "3d"],
      stars: 88,
      forks: 12,
      isFork: false,
      isPrivate: false,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    const mapped = IntegrationNormalizer.mapGitHubToCanonicalProjects([sampleRepo]);
    expect(mapped).toHaveLength(1);
    expect(mapped[0].source).toBe("github");
    expect(mapped[0].sourceMetadata.importedFrom).toBe("github");
    expect(mapped[0].stars).toBe(88);
    expect(mapped[0].githubUrl).toBe("https://github.com/zylo/zylo-engine");
  });

  it("detects discrepancies across Resume, GitHub, LinkedIn, and Manual inputs", () => {
    const unified = IntegrationNormalizer.unifyProfessionalProfile({
      manualData: {
        profile: {
          fullName: "Alex Vance",
          headline: "Manual Form Headline",
        },
      },
      resumeData: {
        profile: {
          fullName: "Alex Vance",
          headline: "Resume Extracted Headline",
        },
      },
      githubProfile: {
        provider: "github",
        externalAccountId: "1",
        fullName: "Alex Vance",
        bio: "GitHub Bio Headline",
        importedAt: new Date().toISOString(),
      },
    });

    expect(unified.conflicts.length).toBeGreaterThan(0);
    const headlineConflict = unified.conflicts.find((c) => c.field === "headline" || c.field === "profile.headline");
    expect(headlineConflict).toBeDefined();
    expect(headlineConflict?.values.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Professional Integrations — Storage & Disconnect Lifecycle", () => {
  const testUserId = "user-lifecycle-test";

  beforeEach(async () => {
    await IntegrationStorageManager.deleteIntegration(testUserId, "github");
    await IntegrationStorageManager.deleteIntegration(testUserId, "linkedin");
  });

  it("persists connection, updates sync metadata, and securely purges on disconnect", async () => {
    const connection = {
      id: "conn-gh-test",
      userId: testUserId,
      provider: "github" as const,
      status: "connected" as const,
      externalAccountId: "gh_9876",
      externalUsername: "alexvance",
      scopes: ["read:user", "public_repo"],
      encryptedAccessToken: TokenEncryptionService.encrypt("test_token_val"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Save
    await IntegrationStorageManager.saveIntegration(connection);
    const retrieved = await IntegrationStorageManager.getIntegration(testUserId, "github");
    expect(retrieved).toBeDefined();
    expect(retrieved?.externalUsername).toBe("alexvance");

    // 2. Update Sync Metadata
    await IntegrationStorageManager.updateSyncMetadata(testUserId, "github", {
      repoCount: 15,
    });
    const updated = await IntegrationStorageManager.getIntegration(testUserId, "github");
    expect(updated?.metadata?.repoCount).toBe(15);
    expect(updated?.lastSyncedAt).toBeDefined();

    // 3. Disconnect
    await IntegrationStorageManager.deleteIntegration(testUserId, "github");
    const deleted = await IntegrationStorageManager.getIntegration(testUserId, "github");
    expect(deleted).toBeNull();
  });
});
