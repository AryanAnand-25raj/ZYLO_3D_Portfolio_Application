import { TemplateDefinition } from "./types";
import { getTemplate } from "./registry";
import { TemplateCapabilities } from "./capabilities";
import { TemplateVersioning } from "./versioning";
import { SceneConfig, SceneMeshNode } from "@zylo/three-engine";

export interface MigrationOptions {
  preserveUserAccents?: boolean;
  strictObjectPruning?: boolean;
}

export interface MigrationResult {
  migratedPortfolio: {
    templateId: string;
    templateVersion: string;
    theme: Record<string, any>;
    scene: SceneConfig;
    content: Record<string, any>;
  };
  previousTemplateId: string;
  previousVersion: string;
  changesApplied: string[];
  compatibilityNotes: string[];
}

export class TemplateMigration {
  /**
   * Non-destructively migrates an existing portfolio to a new target template.
   * Preserves all user data and downsamples/maps incompatible 3D scene nodes
   * and theme tokens to the target template's supported architecture.
   */
  public static migrate(
    portfolio: {
      templateId?: string;
      templateVersion?: string;
      theme?: Record<string, any>;
      scene?: SceneConfig;
      content: Record<string, any>;
    },
    targetTemplateId: string,
    options: MigrationOptions = {}
  ): MigrationResult {
    const targetTemplate: TemplateDefinition = getTemplate(targetTemplateId);
    const prevTemplateId = portfolio.templateId || "minimal";
    const prevVersion = portfolio.templateVersion || `${prevTemplateId}@1.0.0`;

    const changesApplied: string[] = [];
    const compatibilityNotes: string[] = [];

    // 1. Compatibility Check
    const currentScene = portfolio.scene || targetTemplate.defaultScene;
    const report = TemplateCapabilities.checkSceneCompatibility(targetTemplate, currentScene);

    if (!report.compatible) {
      compatibilityNotes.push(
        `Scene contained unsupported items: ${report.unsupportedObjects.join(", ")}. Adapting to ${targetTemplate.name} spec.`
      );
    }

    // 2. Scene Migration & Incompatible Node Mapping
    const migratedScene: SceneConfig = JSON.parse(JSON.stringify(currentScene));
    migratedScene.id = `scene-${targetTemplate.id}-${Date.now()}`;
    migratedScene.name = `${targetTemplate.name} Scene`;

    // Adjust camera & lighting to target template defaults
    migratedScene.camera = { ...targetTemplate.defaultScene.camera };
    migratedScene.lighting = { ...targetTemplate.defaultScene.lighting };
    migratedScene.environment = { ...targetTemplate.defaultScene.environment };
    migratedScene.postProcessing = { ...targetTemplate.defaultScene.postProcessing };
    migratedScene.performance = { ...targetTemplate.defaultScene.performance };

    // Migrate or prune nodes based on target template capabilities
    if (targetTemplate.id === "minimal") {
      // Minimal template enforces exactly 1 lightweight floating object
      migratedScene.nodes = JSON.parse(JSON.stringify(targetTemplate.defaultScene.nodes));
      changesApplied.push("Scene downsampled to single minimal floating sphere for zero GPU overhead.");
    } else {
      const adaptedNodes: SceneMeshNode[] = [];
      const supportedObjs = new Set(targetTemplate.supportedObjects);

      migratedScene.nodes.forEach((node) => {
        if (supportedObjs.has(node.componentType)) {
          adaptedNodes.push(node);
        } else {
          // Map to closest supported equivalent
          const fallbackType = (targetTemplate.supportedObjects[0] || "sphere") as any;
          changesApplied.push(`Mapped object "${node.id}" (${node.componentType} → ${fallbackType})`);
          adaptedNodes.push({
            ...node,
            componentType: fallbackType,
            materialProps: {
              ...node.materialProps,
              color: targetTemplate.defaultTheme.colors?.primary || "#00F0FF",
            },
          });
        }
      });

      // If no valid nodes survived, use template defaults
      if (adaptedNodes.length === 0) {
        migratedScene.nodes = JSON.parse(JSON.stringify(targetTemplate.defaultScene.nodes));
        changesApplied.push(`Restored default ${targetTemplate.name} 3D nodes.`);
      } else {
        migratedScene.nodes = adaptedNodes.slice(0, targetTemplate.performance.maxLights * 8);
      }
    }

    // 3. Theme Migration
    const baseTheme = JSON.parse(JSON.stringify(targetTemplate.defaultTheme));
    if (options.preserveUserAccents && portfolio.theme?.colors?.accent) {
      baseTheme.colors.accent = portfolio.theme.colors.accent;
      changesApplied.push(`Preserved custom accent color: ${portfolio.theme.colors.accent}`);
    }

    // 4. Versioning stamp
    const newVersion = TemplateVersioning.format(targetTemplate.id, targetTemplate.templateVersion);
    changesApplied.push(`Template version stamped: ${newVersion}`);

    return {
      migratedPortfolio: {
        templateId: targetTemplate.id,
        templateVersion: newVersion,
        theme: baseTheme,
        scene: migratedScene,
        content: portfolio.content, // Content is NEVER destroyed
      },
      previousTemplateId: prevTemplateId,
      previousVersion: prevVersion,
      changesApplied,
      compatibilityNotes,
    };
  }
}
