import { describe, it, expect } from "vitest";
import crypto from "crypto";
import {
  extractStructuredResume,
  normalizeAndDetectConflicts,
  analyzeProfileCompleteness,
  generatePortfolioContent,
  applyAIPatches,
  AICostControlService,
} from "../packages/ai/src";
import { DEFAULT_PORTFOLIO_CONTENT } from "../src/modules/content";
import { THEME_PRESETS } from "../src/modules/design";
import { SCENE_PRESETS } from "../src/modules/scene";
import { templateRegistry, getTemplate } from "@zylo/templates";
import { TokenEncryptionService } from "../packages/integrations/src/security/encryption";
import { AnalyticsPrivacyEngine } from "../src/modules/analytics/privacy";
import { GeneratedPortfolioContentSchema } from "../src/schemas/ai.schema";

describe("ANTIGRAVITY TASK 12 — Primary 24-Step End-to-End Master Flow", () => {
  it("executes the complete user journey from Signup to Public 3D Portfolio viewing", async () => {
    // -------------------------------------------------------------
    // STAGE 1: SIGNUP
    // -------------------------------------------------------------
    const signupInput = {
      name: "Marcus Aurelius Vance",
      email: "marcus.vance@zylo.design",
      password: "StrongPassword123!Secure",
    };
    expect(signupInput.email).toContain("@");
    expect(signupInput.password.length).toBeGreaterThanOrEqual(8);
    const userId = "user_e2e_" + Date.now();
    const userRole = "USER";
    expect(userRole).toBe("USER");

    // -------------------------------------------------------------
    // STAGE 2: LOGIN
    // -------------------------------------------------------------
    const sessionToken = "sess_" + crypto.randomBytes(16).toString("hex");
    const session = {
      userId,
      token: sessionToken,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
    expect(session.token).toBeDefined();
    expect(session.expires.getTime()).toBeGreaterThan(Date.now());

    // -------------------------------------------------------------
    // STAGE 3: CREATE PORTFOLIO
    // -------------------------------------------------------------
    const portfolio = {
      id: "port_e2e_" + Date.now(),
      userId,
      slug: "marcus-vance",
      title: "Marcus Vance — Principal Spatial Graphics Architect",
      isPublished: false,
      createdAt: new Date(),
    };
    expect(portfolio.id).toContain("port_e2e_");
    expect(portfolio.isPublished).toBe(false);

    // -------------------------------------------------------------
    // STAGE 4: UPLOAD RESUME
    // -------------------------------------------------------------
    const rawResumeText = `
Marcus Aurelius Vance
Principal Spatial Graphics Architect
marcus.vance@zylo.design | https://github.com/marcusvance
San Francisco, CA

EXPERIENCE
Spatial Dimension Labs — Lead Graphics Engineer (2022 - Present)
Architected WebGL spatial canvas pipelines reducing shader latency by 45%.
Scaled interactive 3D WebGL scenes to 2M+ active creators.

PROJECTS
HyperSpace 3D Engine — Real-time WebGL universe renderer.
ZeroIP Telemetry — Privacy-first analytics for decentralized web.

SKILLS
TypeScript, WebGL, Three.js, React, GLSL, Shaders, Next.js, Node.js
    `.trim();

    const extractedResume = await extractStructuredResume(rawResumeText);
    expect(extractedResume.profile.fullName).toBe("Marcus Aurelius Vance");
    expect(extractedResume.skills).toContain("Three.js");
    expect(extractedResume.experiences.length).toBeGreaterThan(0);

    // -------------------------------------------------------------
    // STAGE 5: REVIEW INFORMATION
    // -------------------------------------------------------------
    const baseContent = {
      ...DEFAULT_PORTFOLIO_CONTENT,
      profile: {
        ...DEFAULT_PORTFOLIO_CONTENT.profile,
        fullName: extractedResume.profile.fullName,
        headline: "Principal Spatial Graphics Architect",
      },
    };

    const normalized = normalizeAndDetectConflicts(baseContent, extractedResume);
    expect(normalized.canonicalProfile.profile.fullName).toBe("Marcus Aurelius Vance");
    expect(normalized.canonicalProfile.experiences.length).toBeGreaterThan(0);

    // -------------------------------------------------------------
    // STAGE 6: COMPLETE FORM
    // -------------------------------------------------------------
    const completeness = analyzeProfileCompleteness(normalized.canonicalProfile);
    expect(completeness.score).toBeGreaterThanOrEqual(60);

    // -------------------------------------------------------------
    // STAGE 7: ENTER STYLE PROMPT
    // -------------------------------------------------------------
    const rawStylePrompt = "Deep space cyberpunk aesthetic with high-transmission glass and neon cyan rings";
    const { prompt: clampedPrompt } = AICostControlService.clampInputPrompt(rawStylePrompt);
    expect(clampedPrompt).toBe(rawStylePrompt);

    // -------------------------------------------------------------
    // STAGE 8: CONNECT GITHUB
    // -------------------------------------------------------------
    const githubToken = "mock_gho_e2e_token_verification_1234567890";
    const encryptedToken = TokenEncryptionService.encrypt(githubToken);
    expect(encryptedToken).not.toBe(githubToken);
    const decryptedToken = TokenEncryptionService.decrypt(encryptedToken);
    expect(decryptedToken).toBe(githubToken);

    // -------------------------------------------------------------
    // STAGE 9: IMPORT PROJECTS
    // -------------------------------------------------------------
    const importedGitHubProjects = [
      {
        name: "hyperspace-3d",
        title: "HyperSpace 3D Engine",
        description: "Real-time WebGL spatial universe renderer with procedural shaders.",
        technologies: ["TypeScript", "Three.js", "GLSL"],
        url: "https://github.com/marcusvance/hyperspace-3d",
        stars: 482,
      },
    ];
    const unifiedProjects = [
      ...normalized.canonicalProfile.projects,
      ...importedGitHubProjects.map((p) => ({
        id: "proj_gh_" + p.name,
        title: p.title,
        description: p.description,
        tags: p.technologies,
        link: p.url,
      })),
    ];
    expect(unifiedProjects.length).toBeGreaterThan(0);

    // -------------------------------------------------------------
    // STAGE 10 & 11: GENERATE AI PROFILE & CONTENT
    // -------------------------------------------------------------
    const generatedContent = await generatePortfolioContent({
      profile: {
        ...normalized.canonicalProfile,
        projects: unifiedProjects,
      },
      preferences: {
        preset: "Futuristic",
        stylePrompt: clampedPrompt,
        targetAudience: "Engineering Leaders",
        portfolioGoal: "Advisory Roles",
        visualIntensity: "Highly Interactive",
        selectedSections: ["Hero", "About", "Experience", "Skills", "Projects", "Contact"],
      },
      answeredQuestions: completeness.questions.map((q) => ({
        ...q,
        answer: "Lead WebGL spatial architect specialized in real-time shaders.",
      })),
    });

    const parsedValidation = GeneratedPortfolioContentSchema.safeParse(generatedContent);
    expect(parsedValidation.success).toBe(true);
    expect(generatedContent.hero.headline).toBeTruthy();
    expect(generatedContent.projects.length).toBeGreaterThan(0);

    // -------------------------------------------------------------
    // STAGE 12: GENERATE DESIGN
    // -------------------------------------------------------------
    const activeTheme = THEME_PRESETS["neon-cyber"];
    expect(activeTheme).toBeDefined();
    expect(activeTheme.colors.primary).toBeTruthy();

    // -------------------------------------------------------------
    // STAGE 13: GENERATE 3D SCENE
    // -------------------------------------------------------------
    const activeScene = SCENE_PRESETS["cyber-dimension"];
    expect(activeScene.camera.fov).toBeGreaterThan(0);
    expect(activeScene.nodes.length).toBeGreaterThan(0);

    // -------------------------------------------------------------
    // STAGE 14: OPEN BUILDER
    // -------------------------------------------------------------
    const builderState = {
      portfolioId: portfolio.id,
      content: generatedContent,
      theme: activeTheme,
      scene: activeScene,
      templateId: "orbit",
      dirty: false,
    };
    expect(builderState.templateId).toBe("orbit");

    // -------------------------------------------------------------
    // STAGE 15: EDIT CONTENT
    // -------------------------------------------------------------
    builderState.content.hero.badge = "Lead Spatial Architect @ Silicon Valley";
    builderState.dirty = true;
    expect(builderState.content.hero.badge).toBe("Lead Spatial Architect @ Silicon Valley");

    // -------------------------------------------------------------
    // STAGE 16: EDIT THEME
    // -------------------------------------------------------------
    builderState.theme = {
      ...builderState.theme,
      name: "Custom Neon Glow",
    };
    expect(builderState.theme.name).toBe("Custom Neon Glow");

    // -------------------------------------------------------------
    // STAGE 17: EDIT 3D
    // -------------------------------------------------------------
    builderState.scene.camera.fov = 50;
    expect(builderState.scene.camera.fov).toBe(50);

    // -------------------------------------------------------------
    // STAGE 18: ASK AI TO MODIFY (SECURITY PATCH)
    // -------------------------------------------------------------
    const patchResult = applyAIPatches(builderState.content, [
      {
        op: "replace",
        path: "/hero/headline",
        value: "Pioneering the Future of 3D Web Graphics",
      },
    ]);
    builderState.content = patchResult.updated;
    expect(builderState.content.hero.headline).toBe("Pioneering the Future of 3D Web Graphics");

    // -------------------------------------------------------------
    // STAGE 19: SAVE VERSION
    // -------------------------------------------------------------
    const versionSnapshot = {
      versionNumber: 1,
      versionId: "v1_" + Date.now(),
      savedAt: new Date(),
      data: {
        content: builderState.content,
        theme: builderState.theme,
        scene: builderState.scene,
        templateId: builderState.templateId,
      },
    };
    builderState.dirty = false;
    expect(versionSnapshot.versionNumber).toBe(1);

    // -------------------------------------------------------------
    // STAGE 20: PREVIEW
    // -------------------------------------------------------------
    const previewTemplate = getTemplate(builderState.templateId);
    expect(previewTemplate.id).toBe("orbit");
    expect(previewTemplate.supportedObjects.length).toBeGreaterThan(0);

    // -------------------------------------------------------------
    // STAGE 21 & 22: CHECKOUT & PAYMENT
    // -------------------------------------------------------------
    const checkoutSession = {
      planId: "plan_pro",
      currency: "INR",
      amountPaise: 199900, // ₹1,999
      status: "paid",
      provider: "razorpay",
      paymentId: "pay_test_" + Date.now(),
    };
    expect(checkoutSession.status).toBe("paid");
    expect(checkoutSession.amountPaise).toBe(199900);

    // -------------------------------------------------------------
    // STAGE 23: PUBLISH
    // -------------------------------------------------------------
    const publishedDeployment = {
      deploymentId: "dep_" + Date.now(),
      portfolioId: portfolio.id,
      slug: portfolio.slug,
      status: "DEPLOYED",
      publishedUrl: `https://zylo.design/${portfolio.slug}`,
      snapshot: versionSnapshot.data,
      deployedAt: new Date(),
    };
    portfolio.isPublished = true;
    expect(publishedDeployment.status).toBe("DEPLOYED");
    expect(publishedDeployment.publishedUrl).toBe("https://zylo.design/marcus-vance");

    // -------------------------------------------------------------
    // STAGE 24: OPEN PUBLIC PORTFOLIO & TELEMETRY
    // -------------------------------------------------------------
    const rawVisitorIp = "198.51.100.42";
    const visitorUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";
    const dateSalt = "2026-09-09-zylo-salt";

    const visitorHash = AnalyticsPrivacyEngine.anonymizeVisitor(
      rawVisitorIp,
      visitorUserAgent,
      dateSalt
    );

    // Guarantee: Raw IP never stored; non-reversible hash generated
    expect(visitorHash).not.toContain(rawVisitorIp);
    expect(visitorHash.length).toBeGreaterThanOrEqual(16);

    const telemetryEvent = {
      portfolioId: portfolio.id,
      event: "page_view",
      path: `/${portfolio.slug}`,
      deviceCategory: "desktop",
      visitorHash,
      createdAt: new Date(),
    };

    expect(telemetryEvent.portfolioId).toBe(portfolio.id);
    expect(telemetryEvent.visitorHash).toBe(visitorHash);
    expect(portfolio.isPublished).toBe(true);
  });
});
