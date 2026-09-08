import { z } from "zod";
import { ASSET_CATEGORIES } from "./categories";

export const AssetTypeEnum = z.enum(["model", "texture", "environment"]);
export type AssetType = z.infer<typeof AssetTypeEnum>;

export const AssetManifestEntrySchema = z.object({
  id: z.string().min(1, "Asset ID is required").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1, "Name is required"),
  type: AssetTypeEnum.default("model"),
  category: z.enum(ASSET_CATEGORIES),
  file: z.string().min(1, "File path is required"),
  preview: z.string().optional().default(""),
  polyBudget: z.number().int().positive().max(100000).default(10000),
  fileSize: z.number().int().positive().max(10000000).default(500000), // Max 10MB, default 500KB
  allowed: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  optimization: z
    .object({
      draco: z.boolean().default(false),
      meshopt: z.boolean().default(false),
      ktx2: z.boolean().default(false),
      lodLevels: z.number().int().min(1).max(4).default(1),
    })
    .default({}),
});

export type AssetManifestEntry = z.infer<typeof AssetManifestEntrySchema>;
