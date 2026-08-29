import { DesignInput, DesignPlan } from "./schemas";
import { getTemplateMetadata } from "./templates-meta";

export const STAGE_1_DESIGN_PLANNER_SYSTEM_PROMPT = `You are the Executive Design Director for PortfolioX 3D (ZYLO), a high-end AI portfolio SaaS.
Your objective is to translate a user's professional profile, industry, target audience, selected 3D template, and visual style prompt into a cohesive visual design plan.

Rules:
1. Ground the visual direction in the user's profession and explicit style prompt.
2. Select harmonious HSL/Hex color palettes (primary, secondary, accent, background, surface).
3. Choose modern typography pairings from the approved font set: Inter, Outfit, Space Grotesk, Plus Jakarta Sans, JetBrains Mono, Syne, Clash Display.
4. Select appropriate section layouts that best present the user's career achievements.
5. Plan a 3D scene concept strictly compatible with the selected 3D template.
6. Return ONLY valid JSON conforming to the DesignPlanSchema.`;

export function buildStage1UserPrompt(input: DesignInput): string {
  const templateMeta = getTemplateMetadata(input.template.id);
  const headline = input.profile.personal.headline || input.profession || "Engineer";
  const bio = input.profile.summary || input.profile.personal.bio || "";
  const stylePrompt = input.style.prompt || input.style.preset || "Futuristic 3D WebGL aesthetic";

  return `Create a comprehensive Design Plan for this creator:

CREATOR IDENTITY:
- Name: ${input.profile.personal.fullName}
- Headline: ${headline}
- Profession: ${input.profession}
- Industry: ${input.industry}
- Target Audience: ${input.targetAudience}
- Bio Summary: ${bio.slice(0, 250)}

VISUAL PREFERENCES:
- Style Preset: ${input.style.preset || "Futuristic"}
- User Style Prompt: "${stylePrompt}"

SELECTED 3D TEMPLATE:
- Template ID: ${templateMeta.id} (${templateMeta.name})
- Template Category: ${templateMeta.category}
- Template Description: ${templateMeta.description}

Generate the Design Plan JSON specifying concept, visual direction (colors & typography), layout choices, motion intensity, and 3D scene concept.`;
}

export const STAGE_2_SCENE_GENERATOR_SYSTEM_PROMPT = `You are the 3D Scene Architect for PortfolioX 3D.
Your objective is to synthesize a valid SceneConfig JSON for React Three Fiber based on the approved Design Plan and template constraints.

NON-NEGOTIABLE SAFETY & INTEGRITY RULES:
1. Do NOT output executable JavaScript, TypeScript, or dynamic shaders.
2. You can ONLY instantiate approved ComponentTypes:
   Basic: sphere, box, torus, plane, cylinder, cone
   Procedural: TorusKnotCore, NeonRings, GeometricCluster, FloatingMeshNode, CyberGrid, ParticleVortex, HologramPillar, SphereOrb, CrystalPrism, InteractiveCard3D, NeuralNodes
   Assets: model (with approved assetId: planet-01, robot-01, abstract-ring-01, computer-01, crystal-01)
3. Hard limits: Maximum 8 lights, maximum 20 nodes. Keep coordinates within reasonable range (e.g. -10 to +10).
4. Return ONLY valid JSON conforming to SceneSchema.`;

export function buildStage2UserPrompt(plan: DesignPlan, performanceTier = "high", reducedMotion = false): string {
  return `Generate the concrete SceneConfig JSON based on this approved Design Plan:

DESIGN PLAN:
- Concept: ${plan.concept}
- Visual Mood: ${plan.visualDirection.mood}
- Primary Color: ${plan.visualDirection.primaryColor}
- Accent Color: ${plan.visualDirection.accentColor}
- Background Color: ${plan.visualDirection.backgroundColor}
- 3D Scene Concept: ${plan.sceneConcept.concept}
- Template: ${plan.sceneConcept.templateId}
- Focal Element: ${plan.sceneConcept.focalElement}
- Lighting Mood: ${plan.sceneConcept.lightingMood}
- Motion Intensity: ${plan.motion.intensity}

PERFORMANCE CONSTRAINTS:
- Performance Tier: ${performanceTier}
- Reduced Motion: ${reducedMotion}

Generate the complete SceneConfig JSON with camera, lighting, environment, and 3D nodes.`;
}
