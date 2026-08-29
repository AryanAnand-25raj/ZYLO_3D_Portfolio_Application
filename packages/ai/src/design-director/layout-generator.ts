import { DesignPlan, LayoutConfig, LayoutConfigSchema } from "./schemas";

export function generateLayoutFromPlan(plan: DesignPlan): LayoutConfig {
  const layout = {
    hero: plan.layout.hero || "split",
    about: plan.layout.about || "split-metrics",
    projects: plan.layout.projects || "cards-grid",
    experience: plan.layout.experience || "timeline",
    skills: plan.layout.skills || "categorized-matrix",
    contact: plan.layout.contact || "minimal-form",
  };

  return LayoutConfigSchema.parse(layout);
}
