import { describe, it, expect } from "vitest";
import {
  templateRegistry,
  getTemplate,
  hasTemplate,
  getAllTemplates,
  getDefaultTemplate,
  resolveTemplateWithFallback,
  TemplateSchema,
  TemplateCapabilities,
  TemplateMigration,
  TemplateVersioning,
  DESIGN_TOKENS,
  PRESET_CATALOG,
  getAllPresets,
} from "@zylo/templates";

describe("Template System — Registry & Loading", () => {
  it("contains all 13 approved templates", () => {
    const keys = Object.keys(templateRegistry);
    expect(keys).toHaveLength(13);
    expect(keys).toContain("neural");
    expect(keys).toContain("orbit");
    expect(keys).toContain("glass");
    expect(keys).toContain("creative");
    expect(keys).toContain("minimal");
    expect(keys).toContain("cyberpunk");
    expect(keys).toContain("matrix");
    expect(keys).toContain("spatial");
    expect(keys).toContain("anime");
    expect(keys).toContain("architecture");
    expect(keys).toContain("automotive");
    expect(keys).toContain("corporate");
    expect(keys).toContain("gaming");
  });

  it("retrieves templates by ID case-insensitively", () => {
    const neural = getTemplate("neural");
    expect(neural.id).toBe("neural");
    expect(neural.name).toBe("Neural Nexus");

    const orbit = getTemplate("ORBIT");
    expect(orbit.id).toBe("orbit");
    expect(orbit.category).toBe("Aerospace & Science");
  });

  it("strictly rejects unknown templates with an error", () => {
    expect(() => getTemplate("non-existent-template")).toThrowError(
      /\[templateRegistry\] Unknown template/
    );
    expect(() => getTemplate("")).toThrowError(/Invalid template ID/);
  });

  it("checks template presence via hasTemplate", () => {
    expect(hasTemplate("glass")).toBe(true);
    expect(hasTemplate("creative")).toBe(true);
    expect(hasTemplate("fake-preset")).toBe(false);
  });

  it("provides safe fallback to minimal template when requested", () => {
    const fallback = resolveTemplateWithFallback("invalid-unknown");
    expect(fallback.id).toBe("minimal");

    const nullFallback = resolveTemplateWithFallback(null);
    expect(nullFallback.id).toBe("minimal");
  });

  it("returns minimal as the default template", () => {
    const def = getDefaultTemplate();
    expect(def.id).toBe("minimal");
  });
});

describe("Template System — Schemas & Defaults", () => {
  const templates = getAllTemplates();

  it.each(templates)("template $id satisfies strict TemplateSchema", (tpl) => {
    const parsed = TemplateSchema.parse(tpl);
    expect(parsed.id).toBe(tpl.id);
    expect(parsed.name).toBeTruthy();
    expect(parsed.description).toBeTruthy();
    expect(parsed.bestFor).toBeTruthy();
    expect(parsed.templateVersion).toMatch(/^\d+\.\d+\.\d+$/);

    // Default Theme verification
    expect(parsed.defaultTheme).toBeDefined();
    expect(parsed.defaultTheme.colors?.primary).toBeTruthy();
    expect(parsed.defaultTheme.colors?.background).toBeTruthy();

    // Default Scene verification
    expect(parsed.defaultScene).toBeDefined();
    expect(parsed.defaultScene.nodes.length).toBeGreaterThan(0);
    expect(parsed.defaultScene.camera).toBeDefined();
    expect(parsed.defaultScene.lighting).toBeDefined();

    // Default Layout & Motion verification
    expect(parsed.defaultLayout).toBeDefined();
    expect(parsed.defaultMotion).toBeDefined();

    // Performance verification
    expect(["low", "medium", "high", "ultra"]).toContain(parsed.performance.tier);
  });

  it("minimal template enforces low-tier lightweight footprint", () => {
    const minimal = getTemplate("minimal");
    expect(minimal.performance.tier).toBe("low");
    expect(minimal.defaultScene.nodes).toHaveLength(1); // exactly one floating object
    expect(minimal.defaultScene.nodes[0].componentType).toBe("sphere");
    expect(minimal.defaultScene.postProcessing.bloom.enabled).toBe(false); // No heavy bloom
  });

  it("neural template enforces high-tier technical AI aesthetic", () => {
    const neural = getTemplate("neural");
    expect(neural.performance.tier).toBe("high");
    expect(neural.defaultTheme.colors.primary).toBe(DESIGN_TOKENS.colors.cyberCyan);
    expect(neural.supportedObjects).toContain("NeuralNodes");
    expect(neural.supportedObjects).toContain("ParticleVortex");
  });

  it("orbit template enforces astronomical aerospace aesthetics", () => {
    const orbit = getTemplate("orbit");
    expect(orbit.performance.tier).toBe("medium");
    expect(orbit.supportedObjects).toContain("SphereOrb");
    expect(orbit.supportedObjects).toContain("NeonRings");
    expect(orbit.defaultScene.environment.stars.enabled).toBe(true);
  });

  it("glass template enforces controlled bloom and glassmorphism", () => {
    const glass = getTemplate("glass");
    expect(glass.defaultTheme.glassmorphism.enabled).toBe(true);
    expect(glass.defaultTheme.glassmorphism.blurIntensity).toBeGreaterThanOrEqual(16);
    expect(glass.defaultScene.postProcessing.bloom.intensity).toBeLessThanOrEqual(1.0);
  });

  it("creative template allows expressive motion and bold accents", () => {
    const creative = getTemplate("creative");
    expect(creative.performance.tier).toBe("high");
    expect(creative.defaultTheme.colors.primary).toBe(DESIGN_TOKENS.colors.creativeRose);
    expect(creative.defaultMotion.rotationSpeed).toBeGreaterThan(0.5);
  });

  it("cyberpunk template enforces high-octane neon cyber aesthetic", () => {
    const cyberpunk = getTemplate("cyberpunk");
    expect(cyberpunk.performance.tier).toBe("high");
    expect(cyberpunk.defaultTheme.colors.primary).toBe("#FF007F");
    expect(cyberpunk.supportedObjects).toContain("CyberGrid");
    expect(cyberpunk.supportedObjects).toContain("NeonRings");
  });

  it("matrix template enforces quantum cryptographic aesthetic", () => {
    const matrix = getTemplate("matrix");
    expect(matrix.performance.tier).toBe("medium");
    expect(matrix.defaultTheme.colors.primary).toBe("#00FF66");
    expect(matrix.supportedObjects).toContain("NeuralNodes");
  });

  it("spatial template enforces Apple Vision Pro holographic aesthetic", () => {
    const spatial = getTemplate("spatial");
    expect(spatial.performance.tier).toBe("high");
    expect(spatial.defaultTheme.colors.primary).toBe("#A855F7");
    expect(spatial.supportedObjects).toContain("CrystalPrism");
    expect(spatial.supportedObjects).toContain("HologramPillar");
  });

  it("anime template enforces cel-shaded character and floating sakura petals", () => {
    const anime = getTemplate("anime");
    expect(anime.performance.tier).toBe("high");
    expect(anime.category).toBe("Anime & Character");
    expect(anime.supportedObjects).toContain("AnimeCharacterAvatar");
    expect(anime.supportedObjects).toContain("SakuraPetalField");
    expect(anime.supportedObjects).toContain("CyberGrid");
    expect(anime.defaultLayout.heroLayout).toBe("anime-showcase");
    expect(anime.defaultLayout.cardStyle).toBe("anime-cel");
  });

  it("architecture, automotive, corporate, and gaming templates are fully configured", () => {
    const arch = getTemplate("architecture");
    expect(arch.supportedObjects).toContain("BuildingWireframe");
    expect(arch.supportedObjects).toContain("CADStructure");

    const auto = getTemplate("automotive");
    expect(auto.supportedObjects).toContain("AutomotiveChassis");
    expect(auto.supportedObjects).toContain("MechanicalGears");

    const corp = getTemplate("corporate");
    expect(corp.supportedObjects).toContain("ExecutiveMonolith");

    const game = getTemplate("gaming");
    expect(game.supportedObjects).toContain("MechaCore");
  });

  it("loads 100-preset catalog spanning all creative, AI, aerospace, and architecture domains", () => {
    expect(PRESET_CATALOG).toHaveLength(100);
    expect(getAllPresets()).toHaveLength(100);

    // Test specific requested real-world presets
    const fusionAi = getTemplate("fusion-ai");
    expect(fusionAi.name).toContain("Fusion AI");
    expect(fusionAi.category).toBe("Technology");

    const mahadeva = getTemplate("mahadeva");
    expect(mahadeva.name).toContain("Mahadeva");

    const inky = getTemplate("inky");
    expect(inky.name).toContain("INKY");

    const monoX = getTemplate("mono-x");
    expect(monoX.name).toContain("Mōno X");

    const sakuraRpg = getTemplate("sakura-rpg");
    expect(sakuraRpg.name).toContain("Sakura");
    expect(sakuraRpg.category).toBe("Anime & Character");
  });
});

describe("Template System — Capabilities & Compatibility", () => {
  it("validates supported sections against template definitions", () => {
    const res = TemplateCapabilities.checkSectionsSupported("orbit", [
      "hero",
      "projects",
      "non-standard-crypto-ticker",
    ]);

    expect(res.supported).toContain("hero");
    expect(res.supported).toContain("projects");
    expect(res.unsupported).toContain("non-standard-crypto-ticker");
  });

  it("detects incompatible 3D components and generates suggested fallbacks", () => {
    const minimal = getTemplate("minimal");
    const orbit = getTemplate("orbit");

    // Orbit scene contains "NeonRings" and "SphereOrb", which minimal does not support
    const report = TemplateCapabilities.checkSceneCompatibility(minimal, orbit.defaultScene);
    expect(report.compatible).toBe(false);
    expect(report.unsupportedObjects.length).toBeGreaterThan(0);
    expect(report.suggestedFallbacks["NeonRings"]).toBeDefined();
  });
});

describe("Template System — Non-Destructive Migration Pipeline", () => {
  it("migrates orbit portfolio to minimal without destroying content", () => {
    const dummyContent = {
      profile: { fullName: "Jane Doe" },
      experiences: [{ company: "TechCorp", role: "Dev" }],
    };

    const initialPortfolio = {
      templateId: "orbit",
      templateVersion: "orbit@1.0.0",
      theme: getTemplate("orbit").defaultTheme,
      scene: getTemplate("orbit").defaultScene,
      content: dummyContent,
    };

    const result = TemplateMigration.migrate(initialPortfolio, "minimal");

    expect(result.previousTemplateId).toBe("orbit");
    expect(result.migratedPortfolio.templateId).toBe("minimal");
    expect(result.migratedPortfolio.templateVersion).toBe("minimal@1.0.0");

    // Content is 100% preserved
    expect(result.migratedPortfolio.content).toEqual(dummyContent);

    // Scene was downsampled to minimal single sphere
    expect(result.migratedPortfolio.scene.nodes).toHaveLength(1);
    expect(result.migratedPortfolio.scene.nodes[0].componentType).toBe("sphere");

    expect(result.changesApplied.length).toBeGreaterThan(0);
  });

  it("preserves custom user accent color when configured in migration", () => {
    const initialPortfolio = {
      templateId: "glass",
      theme: { colors: { accent: "#FF0077" } },
      content: { projects: [] },
    };

    const result = TemplateMigration.migrate(initialPortfolio, "neural", {
      preserveUserAccents: true,
    });

    expect(result.migratedPortfolio.theme.colors.accent).toBe("#FF0077");
  });

  it("adapts incompatible 3D nodes to target template supported building blocks", () => {
    const initialPortfolio = {
      templateId: "neural",
      scene: getTemplate("neural").defaultScene,
      content: {},
    };

    const result = TemplateMigration.migrate(initialPortfolio, "creative");
    expect(result.migratedPortfolio.templateId).toBe("creative");
    expect(result.migratedPortfolio.scene.id).toContain("scene-creative-");
  });
});

describe("Template System — Versioning", () => {
  it("parses template version tags correctly", () => {
    const parsed = TemplateVersioning.parse("orbit@1.2.3");
    expect(parsed.templateId).toBe("orbit");
    expect(parsed.major).toBe(1);
    expect(parsed.minor).toBe(2);
    expect(parsed.patch).toBe(3);
    expect(parsed.fullVersion).toBe("orbit@1.2.3");
  });

  it("checks version compatibility for the same template", () => {
    expect(TemplateVersioning.isCompatible("neural@1.0.0", "neural@1.5.0")).toBe(true);
    expect(TemplateVersioning.isCompatible("neural@1.0.0", "neural@2.0.0")).toBe(false);
    expect(TemplateVersioning.isCompatible("neural@1.0.0", "orbit@1.0.0")).toBe(false);
  });

  it("formats version tags consistently", () => {
    const formatted = TemplateVersioning.format("glass", "2.1.0");
    expect(formatted).toBe("glass@2.1.0");
  });
});
