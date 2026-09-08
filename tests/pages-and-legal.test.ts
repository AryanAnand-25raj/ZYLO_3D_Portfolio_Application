import { describe, it, expect } from "vitest";
import { templateRegistry, getAllTemplates, getTemplate } from "@zylo/templates";
import PrivacyPage, { metadata as privacyMetadata } from "@/app/privacy/page";
import TermsPage, { metadata as termsMetadata } from "@/app/terms/page";
import ArchitecturePage, { metadata as archMetadata } from "@/app/architecture/page";
import PricingPage from "@/app/pricing/page";
import DocsPage from "@/app/docs/page";

describe("Core Pages, Legal & Architecture Surfaces", () => {
  it("exports valid metadata and component for Privacy Page", () => {
    expect(typeof PrivacyPage).toBe("function");
    expect(privacyMetadata.title).toContain("Privacy Policy");
    expect(privacyMetadata.description).toContain("zero raw IP");
  });

  it("exports valid metadata and component for Terms of Service Page", () => {
    expect(typeof TermsPage).toBe("function");
    expect(termsMetadata.title).toContain("Terms of Service");
    expect(termsMetadata.description).toContain("3D WebGL");
  });

  it("exports valid metadata and component for Architecture Blueprint Page", () => {
    expect(typeof ArchitecturePage).toBe("function");
    expect(archMetadata.title).toContain("System Architecture");
    expect(archMetadata.description).toContain("7 decoupled core domains");
  });

  it("exports valid components for Pricing and Docs pages", () => {
    expect(typeof PricingPage).toBe("function");
    expect(typeof DocsPage).toBe("function");
  });

  it("verifies that all 13 production templates are registered and resolvable", () => {
    const templates = getAllTemplates();
    expect(templates.length).toBe(13);

    const ids = [
      "neural",
      "orbit",
      "glass",
      "creative",
      "minimal",
      "cyberpunk",
      "matrix",
      "spatial",
      "anime",
      "architecture",
      "automotive",
      "corporate",
      "gaming",
    ];
    ids.forEach((id) => {
      expect(templateRegistry[id]).toBeDefined();
      const template = getTemplate(id);
      expect(template.id).toBe(id);
      expect(template.name).toBeTruthy();
      expect(template.supportedObjects.length).toBeGreaterThan(0);
      expect(template.performance).toBeDefined();
    });
  });
});
