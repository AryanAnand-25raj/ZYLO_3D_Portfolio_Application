import { DesignInput, DesignPlan, DesignPlanSchema } from "./schemas";
import { STAGE_1_DESIGN_PLANNER_SYSTEM_PROMPT, buildStage1UserPrompt } from "./prompts";
import { getAIProvider, AIProvider } from "../providers/provider-factory";

export function planDesignProcedurally(input: DesignInput): DesignPlan {
  const profession = (input.profession || "").toLowerCase();
  const prompt = (input.style.prompt || "").toLowerCase();
  const templateId = input.template.id;

  let primaryColor = "#00F0FF";
  let secondaryColor = "#9D00FF";
  let accentColor = "#FF007A";
  let backgroundColor = "#030712";
  let surfaceColor = "#0D111C";
  let fontFamily: any = "Inter";
  let headingFontFamily: any = "Outfit";
  let mood = "Futuristic High-Tech";
  let style = "Cybernetic Spatial";
  let lightingMood: any = "cyberpunk";
  let focalElement = "Exoplanet Core with Neon Rings";

  if (profession.includes("ai") || profession.includes("ml") || profession.includes("data")) {
    primaryColor = "#00F0FF";
    secondaryColor = "#7B2CBF";
    accentColor = "#00FF66";
    fontFamily = "JetBrains Mono";
    headingFontFamily = "Space Grotesk";
    mood = "Synaptic & Intelligent";
    style = "Neural Data Dimension";
    lightingMood = "neon-noir";
    focalElement = "Neural Network Cluster & Vortex";
  } else if (profession.includes("aero") || profession.includes("space") || prompt.includes("space") || prompt.includes("planet")) {
    primaryColor = "#38BDF8";
    secondaryColor = "#9D00FF";
    accentColor = "#00F0FF";
    fontFamily = "Inter";
    headingFontFamily = "Space Grotesk";
    mood = "Atmospheric & Celestial";
    style = "Orbital Deep-Space";
    lightingMood = "deep-space";
    focalElement = "Celestial Planet with Particle Horizon";
  } else if (profession.includes("design") || profession.includes("creative") || prompt.includes("glass") || prompt.includes("luxury")) {
    primaryColor = "#FF007A";
    secondaryColor = "#FF7B00";
    accentColor = "#00F0FF";
    fontFamily = "Plus Jakarta Sans";
    headingFontFamily = "Syne";
    mood = "Refined & Tactile";
    style = "Refractive Kinetic";
    lightingMood = "studio";
    focalElement = "Refractive Crystal Prism";
  } else if (profession.includes("exec") || profession.includes("founder") || prompt.includes("minimal")) {
    primaryColor = "#E2E8F0";
    secondaryColor = "#94A3B8";
    accentColor = "#38BDF8";
    backgroundColor = "#0A0A0C";
    surfaceColor = "#121217";
    fontFamily = "Inter";
    headingFontFamily = "Plus Jakarta Sans";
    mood = "Understated & Monolithic";
    style = "Minimalist Sculptural";
    lightingMood = "minimal-white";
    focalElement = "Precision Sculptural Torus";
  }

  return {
    concept: `${mood} 3D Portfolio experience optimized for ${input.profile.personal.fullName}`,
    visualDirection: {
      mood,
      style,
      paletteDescription: `Tailored ${style} palette featuring vibrant accents on deep spatial darks.`,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      surfaceColor,
      fontFamily,
      headingFontFamily,
    },
    layout: {
      hero: "split",
      about: "split-metrics",
      projects: "cards-grid",
      experience: "timeline",
      skills: "categorized-matrix",
      contact: "minimal-form",
    },
    motion: {
      intensity: input.reducedMotion ? "none" : "medium",
      scrollEffects: !input.reducedMotion,
      cameraParallax: !input.reducedMotion,
      hoverSpring: !input.reducedMotion,
      sectionTransitions: input.reducedMotion ? "none" : "slide-up",
    },
    sceneConcept: {
      concept: `Interactive 3D ${focalElement} reflecting expertise in ${input.profession || "Engineering"}.`,
      templateId,
      focalElement,
      lightingMood,
      particleAtmosphere: "Atmospheric ambient stardust and glowing light sweeps.",
    },
  };
}

export async function planDesign(
  input: DesignInput,
  provider?: AIProvider
): Promise<DesignPlan> {
  const ai = provider || getAIProvider();

  try {
    const response = await ai.generateStructuredOutput<DesignPlan>({
      task: "DESIGN_PLANNING",
      systemPrompt: STAGE_1_DESIGN_PLANNER_SYSTEM_PROMPT,
      userPrompt: buildStage1UserPrompt(input),
      schema: DesignPlanSchema,
      temperature: 0.3,
      maxTokens: 2500,
    });

    if (response.success && response.data) {
      return DesignPlanSchema.parse(response.data);
    }
  } catch (err) {
    console.warn("[DesignPlanner] AI generation failed, using procedural synthesis:", err);
  }

  return planDesignProcedurally(input);
}
