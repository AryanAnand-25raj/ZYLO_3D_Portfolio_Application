import {
  SceneConfig,
  SceneSchema,
  SceneMeshNode,
  PerformanceTier,
  ComponentTypeEnum,
} from "./scene.schema";

export interface NormalizationOptions {
  tier?: PerformanceTier;
  reducedMotion?: boolean;
}

/**
 * Normalizes, sanitizes, and enforces safety bounds on any incoming SceneConfig.
 * AI or user-provided scene JSON is strictly clamped to prevent crashes,
 * memory leaks, and excessive shader computation.
 */
export function normalizeSceneConfig(
  rawInput: unknown,
  options: NormalizationOptions = {}
): SceneConfig {
  const raw: any = typeof rawInput === "object" && rawInput !== null ? rawInput : {};
  const tier: PerformanceTier = options.tier || raw.performance?.tier || "high";
  const reducedMotion: boolean =
    options.reducedMotion ?? (tier === "reduced_motion" || Boolean(raw.performance?.reducedMotion));

  // 1. Camera validation & bounds clamping
  const rawCam = raw.camera || {};
  const rawControls = rawCam.controls || {};
  const fovInput = typeof rawCam.fov === "number" ? rawCam.fov : 45;
  const nearInput = typeof rawCam.near === "number" ? rawCam.near : 0.1;
  const farInput = typeof rawCam.far === "number" ? rawCam.far : 1000;
  const autoRotateSpeedInput = typeof rawControls.autoRotateSpeed === "number" ? rawControls.autoRotateSpeed : 0.8;

  const camera = {
    type: rawCam.type === "orthographic" ? ("orthographic" as const) : ("perspective" as const),
    fov: Math.min(Math.max(fovInput, 15), 110),
    position: Array.isArray(rawCam.position) && rawCam.position.length === 3 ? rawCam.position : [0, 0, 8],
    target: Array.isArray(rawCam.target) && rawCam.target.length === 3 ? rawCam.target : [0, 0, 0],
    near: Math.max(nearInput, 0.01),
    far: Math.max(farInput, 20),
    zoom: typeof rawCam.zoom === "number" ? Math.min(Math.max(rawCam.zoom, 0.1), 10) : 1,
    controls: {
      enabled: rawControls.enabled ?? true,
      autoRotate: reducedMotion ? false : (rawControls.autoRotate ?? true),
      autoRotateSpeed: reducedMotion ? 0 : Math.min(Math.max(autoRotateSpeedInput, -5), 5),
      enableZoom: rawControls.enableZoom ?? false,
      enablePan: rawControls.enablePan ?? false,
      maxPolarAngle: rawControls.maxPolarAngle ?? Math.PI / 2 + 0.1,
      minPolarAngle: rawControls.minPolarAngle ?? Math.PI / 3,
      dampingFactor: rawControls.dampingFactor ?? 0.05,
    },
  };

  // 2. Lighting hard limits (max 8 lights)
  const rawLights: any[] = Array.isArray(raw.lighting?.lights) ? raw.lighting.lights : [];
  const maxLights = tier === "mobile" ? 3 : tier === "low" ? 4 : 8;
  const lights = rawLights.slice(0, maxLights).map((light, idx) => ({
    id: light.id || `light-${idx}`,
    type: ["ambient", "directional", "point", "spot", "hemisphere"].includes(light.type)
      ? light.type
      : "point",
    color: light.color || "#ffffff",
    intensity: Math.min(Math.max(typeof light.intensity === "number" ? light.intensity : 1, 0), 20),
    position: Array.isArray(light.position) && light.position.length === 3 ? light.position : [0, 5, 0],
    castShadow: tier === "ultra" || tier === "high" ? Boolean(light.castShadow) : false,
  }));

  // 3. Environment & Starfield particles clamping
  const particleLimits: Record<PerformanceTier, number> = {
    ultra: 5000,
    high: 3000,
    medium: 1500,
    low: 500,
    mobile: 300,
    reduced_motion: 100,
  };
  const maxParticles = reducedMotion ? particleLimits.reduced_motion : particleLimits[tier] || 1500;
  const rawEnv = raw.environment || {};
  const rawStars = rawEnv.stars || {};
  const rawStarCount = typeof rawStars.count === "number" ? rawStars.count : 1200;

  const stars = {
    enabled: rawStars.enabled ?? true,
    count: Math.min(rawStarCount, maxParticles),
    color: rawStars.color || "#ffffff",
    radius: rawStars.radius || 50,
    depth: rawStars.depth || 40,
    speed: reducedMotion ? 0 : (rawStars.speed || 0.5),
  };

  // 4. Object nodes sanitization & limits (max 50 objects)
  const rawNodes: any[] = Array.isArray(raw.nodes) ? raw.nodes : [];
  const maxNodes = tier === "mobile" ? 15 : tier === "low" ? 25 : 50;
  const allowedComponents = ComponentTypeEnum.options;

  const nodes: SceneMeshNode[] = rawNodes
    .slice(0, maxNodes)
    .filter((n) => typeof n === "object" && n !== null)
    .map((node, idx) => {
      const rawScale = Array.isArray(node.scale) && node.scale.length === 3 ? node.scale : [1, 1, 1];
      const clampedScale: [number, number, number] = [
        Math.min(Math.max(rawScale[0], 0.01), 20),
        Math.min(Math.max(rawScale[1], 0.01), 20),
        Math.min(Math.max(rawScale[2], 0.01), 20),
      ];

      const rawAnim = node.animation || {};
      const rawRotSpeed = Array.isArray(rawAnim.rotateSpeed) && rawAnim.rotateSpeed.length === 3 ? rawAnim.rotateSpeed : [0.1, 0.2, 0];

      const animation = {
        type: rawAnim.type || "rotate",
        axis: rawAnim.axis || "y",
        speed: rawAnim.speed || 0.5,
        rotateSpeed: reducedMotion
          ? ([0, 0, 0] as [number, number, number])
          : ([
              Math.min(Math.max(rawRotSpeed[0], -2), 2),
              Math.min(Math.max(rawRotSpeed[1], -2), 2),
              Math.min(Math.max(rawRotSpeed[2], -2), 2),
            ] as [number, number, number]),
        floatAmplitude: reducedMotion ? 0 : Math.min(rawAnim.floatAmplitude || 0, 1.5),
        floatSpeed: reducedMotion ? 0 : Math.min(rawAnim.floatSpeed || 1, 3),
        pulseSpeed: reducedMotion ? 0 : Math.min(rawAnim.pulseSpeed || 0, 3),
        pulseRange: Array.isArray(rawAnim.pulseRange) ? rawAnim.pulseRange : ([0.9, 1.1] as [number, number]),
      };

      const rawComp = node.componentType;
      const componentType = allowedComponents.includes(rawComp) ? rawComp : "TorusKnotCore";

      return {
        id: node.id || `node-${idx}`,
        componentType,
        assetId: node.assetId,
        label: node.label,
        position: Array.isArray(node.position) && node.position.length === 3 ? node.position : [0, 0, 0],
        rotation: Array.isArray(node.rotation) && node.rotation.length === 3 ? node.rotation : [0, 0, 0],
        scale: clampedScale,
        materialProps: {
          type: node.materialProps?.type || "standard",
          color: node.materialProps?.color || "#00F0FF",
          emissive: node.materialProps?.emissive,
          emissiveIntensity: node.materialProps?.emissiveIntensity ?? 0.5,
          roughness: node.materialProps?.roughness ?? 0.2,
          metalness: node.materialProps?.metalness ?? 0.8,
          wireframe: Boolean(node.materialProps?.wireframe),
          transparent: node.materialProps?.transparent ?? true,
          opacity: node.materialProps?.opacity ?? 0.9,
          transmission: node.materialProps?.transmission,
          ior: node.materialProps?.ior,
        },
        animation,
        interactive: {
          hoverScale: node.interactive?.hoverScale ?? 1.08,
          hoverGlow: node.interactive?.hoverGlow ?? true,
          hoverColor: node.interactive?.hoverColor,
          clickAction: node.interactive?.clickAction || "none",
          pointerParallax: node.interactive?.pointerParallax ?? true,
          parallaxStrength: node.interactive?.parallaxStrength ?? 0.3,
        },
        visible: node.visible ?? true,
      };
    });

  const rawPost = raw.postProcessing || {};
  const postProcessing = {
    bloom: {
      enabled: tier === "mobile" || tier === "low" || reducedMotion ? false : Boolean(rawPost.bloom?.enabled ?? true),
      intensity: rawPost.bloom?.intensity ?? 1.2,
      luminanceThreshold: rawPost.bloom?.luminanceThreshold ?? 0.2,
      luminanceSmoothing: rawPost.bloom?.luminanceSmoothing ?? 0.9,
    },
    chromaticAberration: {
      enabled: Boolean(rawPost.chromaticAberration?.enabled),
      offset: Array.isArray(rawPost.chromaticAberration?.offset) ? rawPost.chromaticAberration.offset : ([0.002, 0.002] as [number, number]),
    },
    vignette: {
      enabled: Boolean(rawPost.vignette?.enabled ?? true),
      darkness: rawPost.vignette?.darkness ?? 0.5,
      offset: rawPost.vignette?.offset ?? 0.3,
    },
  };

  const finalConfig: SceneConfig = {
    id: raw.id || "scene-cyber-dimension",
    name: raw.name || "Cyber Dimension",
    version: raw.version || "1.0.0",
    camera,
    lighting: {
      preset: raw.lighting?.preset || "cyberpunk",
      ambientIntensity: raw.lighting?.ambientIntensity ?? 0.4,
      lights,
    },
    environment: {
      preset: rawEnv.preset || "night",
      background: {
        type: rawEnv.background?.type || "transparent",
        color: rawEnv.background?.color || "#05070d",
        gradientColors: rawEnv.background?.gradientColors,
      },
      blur: rawEnv.blur ?? 0.8,
      fog: {
        enabled: rawEnv.fog?.enabled ?? true,
        color: rawEnv.fog?.color || "#05070d",
        near: rawEnv.fog?.near ?? 5,
        far: rawEnv.fog?.far ?? 30,
      },
      stars,
    },
    postProcessing,
    performance: {
      tier,
      reducedMotion,
      maxParticles,
      maxLights,
      maxObjects: maxNodes,
      maxPixelRatio: tier === "ultra" ? 2 : tier === "high" ? 1.5 : 1,
      shadows: tier === "ultra" || tier === "high",
      postprocessing: tier !== "mobile" && tier !== "low" && !reducedMotion,
    },
    nodes,
    quality: raw.quality || "high",
    interactivity: {
      mouseParallax: raw.interactivity?.mouseParallax ?? true,
      parallaxFactor: raw.interactivity?.parallaxFactor ?? 0.5,
      scrollDriven: raw.interactivity?.scrollDriven ?? true,
    },
  };

  return SceneSchema.parse(finalConfig);
}
