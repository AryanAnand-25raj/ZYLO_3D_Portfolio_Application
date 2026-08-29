import { describe, it, expect } from "vitest";
import {
  ContentSchema,
  ThemeSchema,
  SceneSchema,
  PortfolioSchema,
} from "../src/schemas";
import { DEFAULT_PORTFOLIO_CONTENT } from "../src/modules/content";
import { THEME_PRESETS } from "../src/modules/design";
import { SCENE_PRESETS } from "../src/modules/scene";

describe("Domain Zod Schemas", () => {
  describe("ContentSchema", () => {
    it("successfully validates standard profile and experience content", () => {
      const parsed = ContentSchema.safeParse(DEFAULT_PORTFOLIO_CONTENT);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.profile.fullName).toBe("Alex Vance");
        expect(parsed.data.experiences.length).toBeGreaterThan(0);
        expect(parsed.data.projects.length).toBeGreaterThan(0);
      }
    });

    it("rejects invalid social link URLs", () => {
      const invalidContent = {
        ...DEFAULT_PORTFOLIO_CONTENT,
        socials: [{ platform: "github", url: "not-a-valid-url" }],
      };
      const parsed = ContentSchema.safeParse(invalidContent);
      expect(parsed.success).toBe(false);
    });
  });

  describe("ThemeSchema", () => {
    it("successfully validates neon-cyber theme preset", () => {
      const preset = THEME_PRESETS["neon-cyber"];
      const parsed = ThemeSchema.safeParse(preset);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.colors.primary).toBe("#00F0FF");
        expect(parsed.data.glassmorphism.enabled).toBe(true);
      }
    });

    it("rejects invalid non-hex color codes", () => {
      const invalidTheme = {
        ...THEME_PRESETS["neon-cyber"],
        colors: {
          ...THEME_PRESETS["neon-cyber"].colors,
          primary: "rgb(255, 0, 0)", // Needs to be hex per schema
        },
      };
      const parsed = ThemeSchema.safeParse(invalidTheme);
      expect(parsed.success).toBe(false);
    });
  });

  describe("SceneSchema & Security Sandboxing", () => {
    it("successfully validates cyber-dimension 3D scene preset", () => {
      const preset = SCENE_PRESETS["cyber-dimension"];
      const parsed = SceneSchema.safeParse(preset);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.camera.fov).toBe(45);
        expect(parsed.data.nodes.length).toBeGreaterThan(0);
      }
    });

    it("strictly rejects arbitrary code injection or unregistered component types", () => {
      const maliciousScene = {
        ...SCENE_PRESETS["cyber-dimension"],
        nodes: [
          {
            id: "exploit-node",
            componentType: "ArbitraryEvalScriptExecution", // Not in ComponentTypeEnum!
            position: [0, 0, 0],
          },
        ],
      };
      const parsed = SceneSchema.safeParse(maliciousScene);
      expect(parsed.success).toBe(false);
    });
  });

  describe("PortfolioSchema", () => {
    it("successfully validates complete composite portfolio data structure", () => {
      const fullPortfolio = {
        metadata: {
          slug: "alex-vance-3d",
          title: "Alex Vance 3D Portfolio",
          description: "Fullstack 3D portfolio",
          isPublished: true,
        },
        content: DEFAULT_PORTFOLIO_CONTENT,
        design: THEME_PRESETS["neon-cyber"],
        scene: SCENE_PRESETS["cyber-dimension"],
      };

      const parsed = PortfolioSchema.safeParse(fullPortfolio);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.metadata.slug).toBe("alex-vance-3d");
        expect(parsed.data.design.variant).toBe("dark");
      }
    });

    it("rejects invalid slugs containing uppercase or special characters", () => {
      const invalidPortfolio = {
        metadata: {
          slug: "Alex Vance Portfolio!", // Invalid slug format
          title: "Alex Vance 3D Portfolio",
        },
        content: DEFAULT_PORTFOLIO_CONTENT,
        design: THEME_PRESETS["neon-cyber"],
        scene: SCENE_PRESETS["cyber-dimension"],
      };

      const parsed = PortfolioSchema.safeParse(invalidPortfolio);
      expect(parsed.success).toBe(false);
    });
  });
});
