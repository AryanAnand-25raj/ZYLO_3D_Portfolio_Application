import { TemplateDefinition } from "./types";
import { getTemplate } from "./registry";
import { SceneConfig, SceneMeshNode } from "@zylo/three-engine";

export interface TemplateCompatibilityReport {
  compatible: boolean;
  templateId: string;
  unsupportedSections: string[];
  unsupportedObjects: string[];
  unsupportedAnimations: string[];
  suggestedFallbacks: Record<string, string>;
  performanceWarning?: string;
}

export class TemplateCapabilities {
  /**
   * Check whether a scene is compatible with a target template.
   */
  public static checkSceneCompatibility(template: TemplateDefinition, scene: SceneConfig): TemplateCompatibilityReport {
    const unsupportedObjects: string[] = [];
    const unsupportedAnimations: string[] = [];
    const suggestedFallbacks: Record<string, string> = {};

    scene.nodes.forEach((node: SceneMeshNode) => {
      // Check object support
      if (!template.supportedObjects.includes(node.componentType)) {
        unsupportedObjects.push(`${node.id} (${node.componentType})`);
        suggestedFallbacks[node.componentType] = template.supportedObjects[0] || "sphere";
      }

      // Check animation support
      if (node.animation?.type && node.animation.type !== "none") {
        if (!template.supportedAnimations.includes(node.animation.type)) {
          unsupportedAnimations.push(`${node.id} (${node.animation.type})`);
          suggestedFallbacks[node.animation.type] = template.supportedAnimations[0] || "float";
        }
      }
    });

    let performanceWarning: string | undefined;
    if (template.performance.tier === "low" && scene.nodes.length > 10) {
      performanceWarning = `Template "${template.name}" is optimized for low-tier hardware, but scene contains ${scene.nodes.length} objects. Downsampling recommended.`;
    }

    const compatible = unsupportedObjects.length === 0 && unsupportedAnimations.length === 0;

    return {
      compatible,
      templateId: template.id,
      unsupportedSections: [],
      unsupportedObjects,
      unsupportedAnimations,
      suggestedFallbacks,
      performanceWarning,
    };
  }

  /**
   * Check whether given portfolio sections are supported by the template.
   */
  public static checkSectionsSupported(templateId: string, requestedSections: string[]): {
    supported: string[];
    unsupported: string[];
  } {
    const template = getTemplate(templateId);
    const supported: string[] = [];
    const unsupported: string[] = [];

    requestedSections.forEach((sec) => {
      const lower = sec.toLowerCase();
      if (template.supportedSections.includes(lower)) {
        supported.push(lower);
      } else {
        unsupported.push(lower);
      }
    });

    return { supported, unsupported };
  }
}
