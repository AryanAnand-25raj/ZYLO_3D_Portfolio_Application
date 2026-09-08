export const ASSET_CATEGORIES = [
  "space",
  "technology",
  "abstract",
  "architecture",
  "devices",
  "nature",
  "geometric",
  "creative",
  "education",
  "professional",
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export function isAssetCategory(category: string): category is AssetCategory {
  return (ASSET_CATEGORIES as readonly string[]).includes(category);
}
