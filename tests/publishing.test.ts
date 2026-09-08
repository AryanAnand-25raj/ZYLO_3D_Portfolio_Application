import { describe, it, expect, beforeEach } from "vitest";
import { PublishValidator } from "../src/modules/publishing/validator";
import { SlugService } from "../src/modules/publishing/slugs";
import { DomainService } from "../src/modules/publishing/domains";
import { PublishingStoreManager } from "../src/modules/publishing/store";
import { BuilderStorageManager } from "../src/modules/builder/builder-store";
import { PortfolioData } from "../src/schemas/portfolio.schema";

describe("Task 9 — Pre-Publish Validation Engine", () => {
  let sampleDraft: PortfolioData;

  beforeEach(() => {
    const demo = BuilderStorageManager.getPortfolio("port-demo-1");
    sampleDraft = JSON.parse(JSON.stringify(demo!.portfolio));
  });

  it("passes comprehensive validation on a complete, valid portfolio draft", () => {
    const result = PublishValidator.validate(sampleDraft);
    expect(result.valid).toBe(true);
    expect(result.canPublish).toBe(true);
    expect(result.criticalErrorsCount).toBe(0);
    expect(result.checks.length).toBeGreaterThanOrEqual(10);
  });

  it("blocks publishing with critical error when profile full name is missing", () => {
    sampleDraft.content.profile.fullName = "";
    const result = PublishValidator.validate(sampleDraft);
    expect(result.valid).toBe(false);
    expect(result.canPublish).toBe(false);
    expect(result.criticalErrorsCount).toBeGreaterThanOrEqual(1);

    const nameCheck = result.checks.find((c) => c.id === "profile-name");
    expect(nameCheck?.passed).toBe(false);
    expect(nameCheck?.severity).toBe("critical");
  });

  it("blocks publishing when 3D scene camera configuration is invalid", () => {
    (sampleDraft.scene.camera as any).fov = 0; // invalid FOV
    const result = PublishValidator.validate(sampleDraft);
    expect(result.canPublish).toBe(false);

    const cameraCheck = result.checks.find((c) => c.id === "scene-camera");
    expect(cameraCheck?.passed).toBe(false);
    expect(cameraCheck?.severity).toBe("critical");
  });

  it("blocks publishing if 3D scene contains unapproved or unvetted asset IDs", () => {
    sampleDraft.scene.nodes.push({
      id: "malicious-node",
      componentType: "model",
      assetId: "unvetted-external-hack.glb",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      material: { color: "#ffffff", roughness: 0.5, metalness: 0.5, wireframe: false },
      animation: { type: "none", speed: 1 },
      interactivity: { clickable: false, hoverable: false },
    } as any);

    const result = PublishValidator.validate(sampleDraft);
    expect(result.canPublish).toBe(false);

    const assetCheck = result.checks.find((c) => c.id === "assets-security");
    expect(assetCheck?.passed).toBe(false);
    expect(assetCheck?.severity).toBe("critical");
  });

  it("allows publishing with non-blocking warnings when optional items (e.g. SEO description) are sparse", () => {
    sampleDraft.metadata.seo.metaDescription = "";
    sampleDraft.content.profile.bio = ""; // sparse bio
    const result = PublishValidator.validate(sampleDraft);

    const seoCheck = result.checks.find((c) => c.id === "seo-description");
    expect(seoCheck?.severity).toBe("warning");
    // Warnings do NOT block publishing if critical errors are 0
    if (result.criticalErrorsCount === 0) {
      expect(result.canPublish).toBe(true);
    }
  });

});

describe("Task 9 — Slug Service & Reserved Route Security", () => {
  it("normalizes human titles into clean, URL-safe slugs", () => {
    expect(SlugService.normalizeSlug("Alex Vance  #3D Architect!")).toBe("alex-vance-3d-architect");
    expect(SlugService.normalizeSlug("---John__Doe---")).toBe("john-doe");
    expect(SlugService.normalizeSlug("Cyber   Spaces")).toBe("cyber-spaces");
  });

  it("validates slug character set and length strictly", () => {
    expect(SlugService.validateSlug("alex-vance-3d").valid).toBe(true);
    expect(SlugService.validateSlug("al").valid).toBe(false); // Too short
    expect(SlugService.validateSlug("Alex_Vance").valid).toBe(false); // Uppercase and underscore
    expect(SlugService.validateSlug("alex vance").valid).toBe(false); // Spaces
  });

  it("strictly prohibits collision with internal platform routes", () => {
    const reservedSlugs = [
      "admin",
      "api",
      "builder",
      "preview",
      "dashboard",
      "settings",
      "login",
      "register",
      "connect",
      "templates",
      "_next",
      "sitemap",
      "robots",
    ];

    for (const reserved of reservedSlugs) {
      const check = SlugService.validateSlug(reserved);
      expect(check.valid).toBe(false);
      expect(check.error).toContain("reserved");
    }
  });

  it("resolves slug collisions by appending a unique numeric suffix", () => {
    const existing = new Set(["alex-vance", "alex-vance-1", "alex-vance-2"]);
    const resolved = SlugService.resolveCollision("alex-vance", existing);
    expect(resolved).toBe("alex-vance-3");
  });
});

describe("Task 9 — Custom Domains & SSRF Protection", () => {
  it("blocks SSRF attacks targeting localhost and loopbacks", () => {
    const loopbacks = ["localhost", "localhost.localdomain", "127.0.0.1", "127.0.1.10"];
    for (const host of loopbacks) {
      const res = DomainService.validateCustomDomain(host);
      expect(res.valid).toBe(false);
      expect(res.error).toBeDefined();
    }
  });

  it("blocks SSRF attacks targeting private RFC 1918 subnets and cloud metadata endpoints", () => {
    const internalTargets = [
      "10.0.0.1",
      "10.254.0.1",
      "192.168.1.1",
      "172.16.0.1",
      "172.31.255.255",
      "169.254.169.254", // AWS/GCP metadata
    ];

    for (const target of internalTargets) {
      const res = DomainService.validateCustomDomain(target);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("Private or internal IP");
    }
  });

  it("blocks disallowed internal TLDs", () => {
    const internalTLDs = [
      "server.local",
      "cluster.internal",
      "router.lan",
      "intranet.corp",
      "hidden.onion",
    ];

    for (const host of internalTLDs) {
      const res = DomainService.validateCustomDomain(host);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("reserved or internal");
    }
  });

  it("accepts and differentiates valid apex and subdomains", () => {
    const apexRes = DomainService.validateCustomDomain("alexvance.design");
    expect(apexRes.valid).toBe(true);
    expect(apexRes.type).toBe("apex");
    expect(apexRes.hostname).toBe("alexvance.design");

    const subRes = DomainService.validateCustomDomain("portfolio.alexvance.com");
    expect(subRes.valid).toBe(true);
    expect(subRes.type).toBe("subdomain");
    expect(subRes.hostname).toBe("portfolio.alexvance.com");
  });

  it("generates correct DNS instructions for apex (A record) and subdomain (CNAME)", () => {
    const apexDomain = DomainService.createDomainRecord("port-1", "alexvance.design", "apex");
    const aRecord = apexDomain.dnsRecords.find((r) => r.type === "A");
    expect(aRecord).toBeDefined();
    expect(aRecord?.name).toBe("@");
    expect(aRecord?.value).toBe("76.76.21.21");

    const txtRecord = apexDomain.dnsRecords.find((r) => r.type === "TXT");
    expect(txtRecord).toBeDefined();
    expect(txtRecord?.value).toBe(apexDomain.verificationToken);

    const subDomain = DomainService.createDomainRecord("port-1", "portfolio.alexvance.com", "subdomain");
    const cnameRecord = subDomain.dnsRecords.find((r) => r.type === "CNAME");
    expect(cnameRecord).toBeDefined();
    expect(cnameRecord?.value).toBe("cname.zylo.design");
  });

  it("sets SSL status strictly upon verification (never fake active SSL while pending)", async () => {
    const domain = DomainService.createDomainRecord("port-1", "my-portfolio.com", "apex");
    expect(domain.sslStatus).toBe("pending");
    expect(domain.status).toBe("pending");

    // In mock/test environment, verification validates and updates status
    const verifiedResult = await DomainService.verifyDomainDns(domain);
    if (verifiedResult.verified) {
      expect(verifiedResult.updatedDomain.status).toBe("verified");
      expect(verifiedResult.updatedDomain.sslStatus).toBe("active");
    }
  });
});

describe("Task 9 — Publishing Pipeline, Snapshot Decoupling & Rollback", () => {
  const testPortfolioId = "port-test-publish-1";

  beforeEach(() => {
    const demo = BuilderStorageManager.getPortfolio("port-demo-1");
    const cloned = JSON.parse(JSON.stringify(demo!.portfolio));
    cloned.metadata.id = testPortfolioId;
    cloned.metadata.slug = "test-portfolio-snap";
    BuilderStorageManager.savePortfolio(testPortfolioId, cloned, "user-test");
    PublishingStoreManager.resetPortfolioPublishingState(testPortfolioId);
  });

  it("deploys portfolio and produces an immutable snapshot decoupled from draft changes", async () => {
    const deployResult = await PublishingStoreManager.deployPortfolio(
      testPortfolioId,
      "user-test",
      "test-portfolio-snap"
    );

    expect(deployResult.success).toBe(true);
    expect(deployResult.published).toBeDefined();
    expect(deployResult.published?.versionNumber).toBeGreaterThanOrEqual(1);

    const initialPublishedHeadline = deployResult.published?.snapshot.content.profile.headline;

    // Mutate the draft in the visual editor
    const draftEntry = BuilderStorageManager.getPortfolio(testPortfolioId);
    draftEntry!.portfolio.content.profile.headline = "MUTATED DRAFT AFTER PUBLISH";
    BuilderStorageManager.savePortfolio(testPortfolioId, draftEntry!.portfolio, "user-test");

    // Query published record again
    const livePublished = await PublishingStoreManager.getPublishedByPortfolioId(testPortfolioId);
    expect(livePublished?.snapshot.content.profile.headline).toBe(initialPublishedHeadline);
    expect(livePublished?.snapshot.content.profile.headline).not.toBe("MUTATED DRAFT AFTER PUBLISH");
  });

  it("records deployment pipeline log entries across all state machine phases", async () => {
    const deployResult = await PublishingStoreManager.deployPortfolio(
      testPortfolioId,
      "user-test",
      "test-portfolio-snap"
    );

    const logs = deployResult.deployment.logs;
    expect(logs.length).toBeGreaterThanOrEqual(4);

    const steps = logs.map((l) => l.step);
    expect(steps).toContain("queued");
    expect(steps).toContain("validating");
    expect(steps).toContain("building");
    expect(steps).toContain("uploading");
    expect(steps).toContain("success");
  });

  it("supports 1-click rollback to any historical deployment snapshot", async () => {
    // Release v1
    const v1 = await PublishingStoreManager.deployPortfolio(testPortfolioId, "user-test", "test-snap-rollback");
    const v1DepId = v1.deployment.id;

    // Update draft and release v2
    const draft = BuilderStorageManager.getPortfolio(testPortfolioId)!.portfolio;
    draft.content.profile.fullName = "Alex Vance v2 Edition";
    BuilderStorageManager.savePortfolio(testPortfolioId, draft, "user-test");
    const v2 = await PublishingStoreManager.deployPortfolio(testPortfolioId, "user-test", "test-snap-rollback");
    expect(v2.published?.snapshot.content.profile.fullName).toBe("Alex Vance v2 Edition");

    // Execute Rollback to v1
    const rollbackResult = await PublishingStoreManager.rollbackPortfolio(
      testPortfolioId,
      v1DepId,
      "user-test"
    );

    expect(rollbackResult.success).toBe(true);
    expect(rollbackResult.restoredVersionNumber).toBe(1);

    const activePublished = await PublishingStoreManager.getPublishedByPortfolioId(testPortfolioId);
    expect(activePublished?.snapshot.content.profile.fullName).toBe("Alex Vance");
  });

  it("supports unpublishing a portfolio without deleting drafts or deployment history", async () => {
    await PublishingStoreManager.deployPortfolio(testPortfolioId, "user-test", "test-unpublish-slug");

    const unpublished = await PublishingStoreManager.unpublishPortfolio(testPortfolioId, "user-test");
    expect(unpublished).toBe(true);

    const record = await PublishingStoreManager.getPublishedByPortfolioId(testPortfolioId);
    expect(record?.status).toBe("unpublished");

    // Draft remains intact
    const draft = BuilderStorageManager.getPortfolio(testPortfolioId);
    expect(draft).toBeDefined();

    // Deployment history remains intact
    const history = await PublishingStoreManager.getDeploymentHistory(testPortfolioId);
    expect(history.length).toBeGreaterThan(0);
  });

  it("creates and validates 24-hour private preview tokens", () => {
    const token = PublishingStoreManager.createSignedPreviewToken(testPortfolioId);
    expect(token).toHaveLength(48);

    // Valid token passes
    expect(PublishingStoreManager.validatePreviewToken(testPortfolioId, token)).toBe(true);

    // Wrong portfolio ID fails
    expect(PublishingStoreManager.validatePreviewToken("different-portfolio", token)).toBe(false);

    // Non-existent token fails
    expect(PublishingStoreManager.validatePreviewToken(testPortfolioId, "invalid-random-token")).toBe(false);
  });
});
