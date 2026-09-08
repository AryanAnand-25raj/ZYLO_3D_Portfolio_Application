import { TemplateDefinition } from "./types";
import { neuralTemplate } from "./neural/neural.template";
import { orbitTemplate } from "./orbit/orbit.template";
import { glassTemplate } from "./glass/glass.template";
import { creativeTemplate } from "./creative/creative.template";
import { minimalTemplate } from "./minimal/minimal.template";
import { cyberpunkTemplate } from "./cyberpunk/cyberpunk.template";
import { matrixTemplate } from "./matrix/matrix.template";
import { spatialTemplate } from "./spatial/spatial.template";
import { animeTemplate } from "./anime/anime.template";
import { architectureTemplate } from "./architecture/architecture.template";
import { automotiveTemplate } from "./automotive/automotive.template";
import { corporateTemplate } from "./corporate/corporate.template";
import { gamingTemplate } from "./gaming/gaming.template";
import { PRESET_CATALOG, PresetCatalogItem } from "./presets/catalog";

export const templateRegistry: Record<string, TemplateDefinition> = {
  neural: neuralTemplate,
  orbit: orbitTemplate,
  glass: glassTemplate,
  creative: creativeTemplate,
  minimal: minimalTemplate,
  cyberpunk: cyberpunkTemplate,
  matrix: matrixTemplate,
  spatial: spatialTemplate,
  anime: animeTemplate,
  architecture: architectureTemplate,
  automotive: automotiveTemplate,
  corporate: corporateTemplate,
  gaming: gamingTemplate,
};

export type TemplateId = keyof typeof templateRegistry;

// Preset fast lookup index with smart aliases
const presetIndex: Record<string, PresetCatalogItem> = {};
for (const preset of PRESET_CATALOG) {
  const normId = preset.id.toLowerCase().trim();
  presetIndex[normId] = preset;

  // Shorthand aliases:
  // e.g. "ai-fusion" -> "fusion", "fusion-ai"
  // e.g. "creative-inky" -> "inky"
  // e.g. "creative-mono-x" -> "mono-x"
  const prefixMatch = normId.match(/^(ai|space|creative|glass|cyber|arch|auto|corp|gaming|glsl|anime)-(.*)$/);
  if (prefixMatch) {
    const [, prefix, suffix] = prefixMatch;
    if (!presetIndex[suffix]) {
      presetIndex[suffix] = preset;
    }
    const flipped = `${suffix}-${prefix}`;
    if (!presetIndex[flipped]) {
      presetIndex[flipped] = preset;
    }
  }
}

/**
 * Retrieves a template by ID (supporting both core template families and the 100-preset catalog).
 * STRICT: Unknown templates must be rejected.
 * Throws an Error if template ID is not recognized.
 */
export function getTemplate(templateId: string): TemplateDefinition {
  if (!templateId || typeof templateId !== "string") {
    throw new Error(`[templateRegistry] Invalid template ID: "${templateId}".`);
  }

  const normalized = templateId.toLowerCase().trim();
  const template = templateRegistry[normalized] || presetIndex[normalized];

  if (!template) {
    throw new Error(
      `[templateRegistry] Unknown template "${templateId}". Supported templates are: ${Object.keys(templateRegistry).join(", ")}`
    );
  }

  return template;
}

/**
 * Safely resolves a template by ID, falling back to "minimal" if invalid or missing.
 */
export function resolveTemplateWithFallback(templateId?: string | null): TemplateDefinition {
  if (!templateId) return minimalTemplate;
  try {
    return getTemplate(templateId);
  } catch (err) {
    console.warn(`[templateRegistry] Template resolution fallback triggered for "${templateId}":`, err);
    return minimalTemplate;
  }
}

export function hasTemplate(templateId: string): boolean {
  if (!templateId) return false;
  const normalized = templateId.toLowerCase().trim();
  return Boolean(templateRegistry[normalized] || presetIndex[normalized]);
}

export function getAllTemplates(): TemplateDefinition[] {
  return Object.values(templateRegistry);
}

export function getAllTemplatesAndPresets(): TemplateDefinition[] {
  // Deduplicate and combine
  const map = new Map<string, TemplateDefinition>();
  for (const tpl of Object.values(templateRegistry)) {
    map.set(tpl.id, tpl);
  }
  for (const preset of PRESET_CATALOG) {
    map.set(preset.id, preset);
  }
  return Array.from(map.values());
}

export function getDefaultTemplate(): TemplateDefinition {
  return minimalTemplate;
}
