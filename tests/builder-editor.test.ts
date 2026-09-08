import { describe, it, expect, beforeEach } from "vitest";
import { PatchSafetyValidator } from "../src/modules/builder/patch-safety";
import { AIBuilderCommands } from "../src/modules/builder/ai-commands";
import { BuilderStorageManager } from "../src/modules/builder/builder-store";
import { applyAIPatches } from "../packages/ai/src/patch-system";
import { PortfolioSchema, PortfolioData } from "../src/schemas/portfolio.schema";

describe("Visual Builder — Patch Safety & Security Validator", () => {
  it("approves safe customization paths on content, theme, design, and scene", () => {
    const validPatches = [
      { op: "replace" as const, path: "/content/profile/headline", value: "New Headline" },
      { op: "replace" as const, path: "/design/colors/primary", value: "#00F0FF" },
      { op: "replace" as const, path: "/scene/camera/fov", value: 50 },
      { op: "add" as const, path: "/scene/nodes/-", value: { id: "node-1" } },
      { op: "replace" as const, path: "/metadata/title", value: "New Portfolio Title" },
    ];

    const result = PatchSafetyValidator.validatePatches(validPatches);
    expect(result.safe).toBe(true);
    expect(result.allowedOperations).toHaveLength(5);
    expect(result.blockedOperations).toHaveLength(0);
  });

  it("strictly blocks sensitive auth, users, billing, and database paths", () => {
    const maliciousPatches = [
      { op: "replace" as const, path: "/users/role", value: "ADMIN" },
      { op: "replace" as const, path: "/auth/session", value: "hijacked" },
      { op: "replace" as const, path: "/billing/subscription", value: "FREE_FOREVER" },
      { op: "replace" as const, path: "/database/drop", value: true },
      { op: "replace" as const, path: "/__proto__/polluted", value: "exploit" },
    ];

    const result = PatchSafetyValidator.validatePatches(maliciousPatches);
    expect(result.safe).toBe(false);
    expect(result.blockedOperations).toHaveLength(5);
    expect(result.allowedOperations).toHaveLength(0);
  });
});

describe("Visual Builder — AI Commands & Natural Language Transforms", () => {
  it("transforms text content using professional, creative, shorten, and expand directives", () => {
    const original = "I built a cool and fast web app.";

    const professional = AIBuilderCommands.transformText(original, "professional");
    expect(professional).toContain("Architected and delivered");
    expect(professional).not.toContain("cool");

    const expanded = AIBuilderCommands.transformText(original, "expand");
    expect(expanded).toContain("60 FPS");

    const creative = AIBuilderCommands.transformText(original, "creative");
    expect(creative).toContain("spatial");
  });

  it("generates safe structured patches from natural language prompt", () => {
    const demo = BuilderStorageManager.getPortfolio("port-demo-1")!.portfolio;

    // 1. Accent color change
    const violetResult = AIBuilderCommands.generatePatchesFromPrompt(
      "Change the accent color to violet",
      demo
    );
    expect(violetResult.operations.some((op) => op.path === "/design/colors/accent")).toBe(true);
    expect(violetResult.explanation).toContain("violet");

    // 2. Futuristic hero
    const futuristicResult = AIBuilderCommands.generatePatchesFromPrompt(
      "Make my hero look more futuristic",
      demo
    );
    expect(
      futuristicResult.operations.some((op) => op.path === "/content/profile/headline")
    ).toBe(true);

    // 3. Minimalist
    const minimalResult = AIBuilderCommands.generatePatchesFromPrompt(
      "Make the portfolio more minimal",
      demo
    );
    expect(minimalResult.operations.some((op) => op.path === "/design/variant")).toBe(true);
    expect(minimalResult.operations.some((op) => op.path === "/scene/nodes")).toBe(true);
  });
});

describe("Visual Builder — Storage, Versioning & Undo/Redo Engine", () => {
  const testPortfolioId = "test-builder-port-1";
  let samplePortfolio: PortfolioData;

  beforeEach(() => {
    samplePortfolio = JSON.parse(
      JSON.stringify(BuilderStorageManager.getPortfolio("port-demo-1")!.portfolio)
    );
    samplePortfolio.metadata.id = testPortfolioId;
    BuilderStorageManager.savePortfolio(testPortfolioId, samplePortfolio, "test-user-1");
  });

  it("saves and retrieves portfolio configurations", () => {
    const record = BuilderStorageManager.getPortfolio(testPortfolioId);
    expect(record).toBeDefined();
    expect(record?.portfolio.metadata.id).toBe(testPortfolioId);
  });

  it("creates named checkpoint versions and restores them non-destructively", () => {
    // 1. Create version checkpoint A
    const ver1 = BuilderStorageManager.addVersion(
      testPortfolioId,
      "Version A: Initial",
      "First initial setup",
      samplePortfolio
    );

    // 2. Modify portfolio and save Version B
    const modifiedPortfolio = JSON.parse(JSON.stringify(samplePortfolio));
    modifiedPortfolio.content.profile.headline = "Modified Headline B";
    BuilderStorageManager.savePortfolio(testPortfolioId, modifiedPortfolio, "test-user-1");

    const ver2 = BuilderStorageManager.addVersion(
      testPortfolioId,
      "Version B: Modified",
      "Updated headline",
      modifiedPortfolio
    );

    const versions = BuilderStorageManager.getVersions(testPortfolioId);
    expect(versions.length).toBeGreaterThanOrEqual(2);

    // 3. Restore to Version A
    const restored = BuilderStorageManager.restoreVersion(testPortfolioId, ver1.id, "test-user-1");
    expect(restored).toBeDefined();
    expect(restored?.content.profile.headline).toBe(samplePortfolio.content.profile.headline);

    // Active portfolio in store is now restored
    const current = BuilderStorageManager.getPortfolio(testPortfolioId);
    expect(current?.portfolio.content.profile.headline).toBe(
      samplePortfolio.content.profile.headline
    );
  });

  it("simulates client undo / redo stack transitions accurately", () => {
    const stack: PortfolioData[] = [];
    let pointer = -1;

    // Push initial
    stack.push(JSON.parse(JSON.stringify(samplePortfolio)));
    pointer = 0;

    // Mutate 1: Change title
    const mutation1 = JSON.parse(JSON.stringify(stack[pointer]));
    mutation1.metadata.title = "Step 1 Title";
    stack.push(mutation1);
    pointer++;
    expect(stack[pointer].metadata.title).toBe("Step 1 Title");

    // Mutate 2: Change accent
    const mutation2 = JSON.parse(JSON.stringify(stack[pointer]));
    mutation2.design.colors.accent = "#FF0055";
    stack.push(mutation2);
    pointer++;
    expect(stack[pointer].design.colors.accent).toBe("#FF0055");

    // Undo step 2
    pointer--;
    expect(stack[pointer].metadata.title).toBe("Step 1 Title");
    expect(stack[pointer].design.colors.accent).not.toBe("#FF0055");

    // Undo step 1 (back to initial)
    pointer--;
    expect(stack[pointer].metadata.title).toBe(samplePortfolio.metadata.title);

    // Redo step 1
    pointer++;
    expect(stack[pointer].metadata.title).toBe("Step 1 Title");

    // Redo step 2
    pointer++;
    expect(stack[pointer].design.colors.accent).toBe("#FF0055");
  });
});

describe("Visual Builder — 3D & Content Property Mutations", () => {
  it("modifies 3D scene node transforms, materials, and animations", () => {
    const demo = JSON.parse(
      JSON.stringify(BuilderStorageManager.getPortfolio("port-demo-1")!.portfolio)
    );

    // Add a new model node
    const newNode = {
      id: "test-satellite-node",
      componentType: "box" as const,
      position: [1, 2, 3] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1.5, 1.5, 1.5] as [number, number, number],
      materialProps: { color: "#38BDF8", metalness: 0.9, roughness: 0.1 },
      animation: { type: "rotate" as const, speed: 0.8 },
      interactive: { hoverScale: 1.1 },
      visible: true,
    };

    demo.scene.nodes.push(newNode);
    expect(demo.scene.nodes.length).toBeGreaterThan(1);

    // Mutate position and material
    const targetNode = demo.scene.nodes.find((n: any) => n.id === "test-satellite-node");
    targetNode.position = [4, 5, 6];
    targetNode.materialProps.color = "#FF0077";
    targetNode.animation.speed = 1.2;

    expect(targetNode.position).toEqual([4, 5, 6]);
    expect(targetNode.materialProps.color).toBe("#FF0077");
    expect(targetNode.animation.speed).toBe(1.2);

    // Ensure whole mutated structure still strictly parses against PortfolioSchema
    const validated = PortfolioSchema.parse(demo);
    expect(validated).toBeDefined();
  });
});
