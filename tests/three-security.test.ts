import { describe, it, expect } from "vitest";
import {
  SceneMeshNodeSchema,
  isComponentRegistered,
  isAssetAllowed,
  getApprovedAsset,
  normalizeSceneConfig,
} from "../packages/three-engine/src";

describe("Three Engine Security & Sanitization", () => {
  it("rejects unregistered / arbitrary component types at schema level", () => {
    const maliciousNode = {
      id: "hack-node",
      componentType: "<script>alert(1)</script>", // Malicious code injection attempt
      position: [0, 0, 0],
    };

    const parsed = SceneMeshNodeSchema.safeParse(maliciousNode);
    expect(parsed.success).toBe(false);
    expect(isComponentRegistered("<script>alert(1)</script>")).toBe(false);
  });

  it("verifies only approved asset manifest IDs are resolved", () => {
    expect(isAssetAllowed("planet-01")).toBe(true);
    expect(isAssetAllowed("robot-01")).toBe(true);
    expect(getApprovedAsset("planet-01")?.url).toBe("/assets/models/planet-01.glb");

    // Rejects untrusted / unknown asset strings
    expect(isAssetAllowed("https://malicious-server.com/evil.glb")).toBe(false);
    expect(getApprovedAsset("https://malicious-server.com/evil.glb")).toBeNull();
  });

  it("clamps excessive node counts down to safe budget thresholds", () => {
    const hugeScene = {
      nodes: Array.from({ length: 200 }).map((_, i) => ({
        id: `node-${i}`,
        componentType: "sphere",
        scale: [500, 500, 500], // Giant screen-blocking scale
      })),
    };

    const normalized = normalizeSceneConfig(hugeScene, { tier: "high" });
    expect(normalized.nodes.length).toBeLessThanOrEqual(50);
    expect(normalized.nodes[0].scale[0]).toBeLessThanOrEqual(20);
  });
});
