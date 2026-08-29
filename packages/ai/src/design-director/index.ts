import {
  DesignInput,
  DesignInputSchema,
  DesignDirectorOutput,
  DesignDirectorOutputSchema,
} from "./schemas";
import { planDesign } from "./planner";
import { generateThemeFromPlan } from "./theme-generator";
import { generateLayoutFromPlan } from "./layout-generator";
import { generateSceneFromPlan } from "./scene-generator";
import { AIProvider } from "../providers/provider-factory";

export * from "./schemas";
export * from "./prompts";
export * from "./templates-meta";
export * from "./planner";
export * from "./theme-generator";
export * from "./layout-generator";
export * from "./scene-generator";
export * from "./validators";

export async function generateDesignAndScene(
  rawInput: DesignInput,
  provider?: AIProvider
): Promise<DesignDirectorOutput> {
  const input = DesignInputSchema.parse(rawInput);

  // Stage 1: Plan visual identity, theme, layout, motion & 3D concept
  const plan = await planDesign(input, provider);

  // Synthesize ThemeConfig and LayoutConfig
  const theme = generateThemeFromPlan(plan, input.reducedMotion);
  const layout = generateLayoutFromPlan(plan);
  const motion = plan.motion;

  // Stage 2: Synthesize validated SceneConfig
  const scene = await generateSceneFromPlan(
    plan,
    input.performanceTier,
    input.reducedMotion,
    provider
  );

  return DesignDirectorOutputSchema.parse({
    theme,
    layout,
    motion,
    scene,
    plan,
    generatedAt: new Date().toISOString(),
  });
}
