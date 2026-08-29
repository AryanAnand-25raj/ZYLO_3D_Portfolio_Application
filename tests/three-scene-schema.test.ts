import { describe, it, expect } from "vitest";
import {
  SceneSchema,
  CameraConfigSchema,
  LightingConfigSchema,
  EnvironmentConfigSchema,
  SceneMeshNodeSchema,
  normalizeSceneConfig,
} from "../packages/three-engine/src";

describe("Three Engine Scene Schemas & Normalizer", () => {
  it("validates and parses a standard default SceneConfig", () => {
    const scene = SceneSchema.parse({});
    expect(scene.version).toBe("1.0.0");
    expect(scene.camera.fov).toBe(45);
    expect(scene.camera.position).toEqual([0, 0, 8]);
    expect(scene.lighting.preset).toBe("cyberpunk");
    expect(scene.environment.fog.enabled).toBe(true);
  });

  it("clamps invalid camera FOV and extreme coordinates safely via normalizer", () => {
    const rawScene = {
      camera: {
        fov: 300, // Extreme FOV
        near: -5, // Invalid negative near plane
        far: 5,   // Far <= near
        controls: { autoRotateSpeed: 50 }, // Extreme speed
      },
      lighting: {
        lights: Array.from({ length: 25 }).map((_, i) => ({
          id: `light-${i}`,
          type: "point",
          intensity: 1000,
        })),
      },
    };

    const normalized = normalizeSceneConfig(rawScene);
    expect(normalized.camera.fov).toBe(110); // Clamped to max 110
    expect(normalized.camera.near).toBeGreaterThanOrEqual(0.01);
    expect(normalized.camera.far).toBe(20);
    expect(normalized.camera.controls.autoRotateSpeed).toBe(5); // Clamped
    expect(normalized.lighting.lights.length).toBeLessThanOrEqual(8); // Clamped to 8 lights max
  });

  it("strictly suppresses animation and particles when reducedMotion is active", () => {
    const rawScene = {
      nodes: [
        {
          id: "test-node",
          componentType: "TorusKnotCore",
          animation: {
            rotateSpeed: [1, 2, 3],
            floatAmplitude: 1.5,
            floatSpeed: 2,
          },
        },
      ],
      environment: {
        stars: { count: 4000, speed: 1.5 },
      },
    };

    const normalized = normalizeSceneConfig(rawScene, { reducedMotion: true });
    expect(normalized.performance.reducedMotion).toBe(true);
    expect(normalized.nodes[0].animation.rotateSpeed).toEqual([0, 0, 0]);
    expect(normalized.nodes[0].animation.floatAmplitude).toBe(0);
    expect(normalized.environment.stars.speed).toBe(0);
    expect(normalized.environment.stars.count).toBeLessThanOrEqual(100);
  });
});
