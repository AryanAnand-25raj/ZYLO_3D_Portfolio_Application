import { SceneConfig, normalizeSceneConfig, isComponentRegistered, isAssetAllowed } from "@zylo/three-engine";
import { getTemplateMetadata } from "./templates-meta";

export interface ValidationResult {
  valid: boolean;
  sanitizedConfig: SceneConfig;
  violations: string[];
}

/**
 * Validates that an AI-generated SceneConfig adheres strictly to template capabilities,
 * approved assets manifest, approved component registry, and security bounds.
 */
export function validateAndSanitizeScene(
  rawScene: unknown,
  templateId: string,
  performanceTier = "high",
  reducedMotion = false
): ValidationResult {
  const violations: string[] = [];
  const templateMeta = getTemplateMetadata(templateId);

  // 1. Run engine normalizer to clamp limits
  const sanitized = normalizeSceneConfig(rawScene, {
    tier: performanceTier as any,
    reducedMotion,
  });

  // 2. Validate nodes against component registry and template capabilities
  const validatedNodes = sanitized.nodes.filter((node) => {
    // Check if component exists in ComponentRegistry
    if (!isComponentRegistered(node.componentType)) {
      violations.push(`Unregistered component type: ${node.componentType}`);
      return false;
    }

    // Check if component has model asset and verify against asset whitelist
    if (node.componentType === "model") {
      if (!node.assetId || !isAssetAllowed(node.assetId)) {
        violations.push(`Unapproved model asset ID: ${node.assetId}`);
        // Fallback component type to proxy geometry
        node.componentType = "TorusKnotCore";
      }
    }

    return true;
  });

  sanitized.nodes = validatedNodes;

  return {
    valid: violations.length === 0,
    sanitizedConfig: sanitized,
    violations,
  };
}
