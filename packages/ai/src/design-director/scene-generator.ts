import { SceneConfig, SceneSchema } from "@zylo/three-engine";
import { DesignPlan } from "./schemas";
import { STAGE_2_SCENE_GENERATOR_SYSTEM_PROMPT, buildStage2UserPrompt } from "./prompts";
import { getTemplateMetadata } from "./templates-meta";
import { validateAndSanitizeScene } from "./validators";
import { getAIProvider, AIProvider } from "../providers/provider-factory";

export async function generateSceneFromPlan(
  plan: DesignPlan,
  performanceTier = "high",
  reducedMotion = false,
  provider?: AIProvider
): Promise<SceneConfig> {
  const ai = provider || getAIProvider();
  const templateMeta = getTemplateMetadata(plan.sceneConcept.templateId);
  const defaultScene = templateMeta.defaultScene;

  try {
    const response = await ai.generateStructuredOutput<SceneConfig>({
      task: "SCENE_GENERATION",
      systemPrompt: STAGE_2_SCENE_GENERATOR_SYSTEM_PROMPT,
      userPrompt: buildStage2UserPrompt(plan, performanceTier, reducedMotion),
      schema: SceneSchema,
      temperature: 0.2,
      maxTokens: 3500,
    });

    if (response.success && response.data) {
      const validation = validateAndSanitizeScene(
        response.data,
        plan.sceneConcept.templateId,
        performanceTier,
        reducedMotion
      );

      if (validation.valid || validation.sanitizedConfig.nodes.length > 0) {
        return validation.sanitizedConfig;
      }
    }
  } catch (err) {
    console.warn("[SceneGenerator] AI scene generation failed, falling back to customized template default:", err);
  }

  // Fallback: Return customized template default scene with plan colors and lighting
  const rawFallback = {
    ...defaultScene,
    lighting: {
      ...defaultScene.lighting,
      preset: plan.sceneConcept.lightingMood || defaultScene.lighting.preset,
    },
    environment: {
      ...defaultScene.environment,
      background: {
        type: "solid",
        color: plan.visualDirection.backgroundColor,
      },
    },
    nodes: defaultScene.nodes.map((node, idx) => ({
      ...node,
      materialProps: {
        ...node.materialProps,
        color: idx === 0 ? plan.visualDirection.primaryColor : plan.visualDirection.accentColor,
        emissive: idx === 0 ? plan.visualDirection.secondaryColor : plan.visualDirection.accentColor,
      },
    })),
  };

  const fallbackValidation = validateAndSanitizeScene(
    rawFallback,
    plan.sceneConcept.templateId,
    performanceTier,
    reducedMotion
  );

  return fallbackValidation.sanitizedConfig;
}
