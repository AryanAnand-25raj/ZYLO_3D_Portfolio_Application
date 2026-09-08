import { AssetManifestEntry, AssetManifestEntrySchema } from "../manifest/types";
import { isAssetCategory } from "../manifest/categories";

export interface AssetValidationLimits {
  maxFileSize: number; // In bytes (default 5MB = 5,242,880)
  maxPolyBudget: number; // Max vertices/triangles (default 50,000)
  allowedExtensions: string[];
  allowedTextureFormats: string[];
}

export const DEFAULT_VALIDATION_LIMITS: AssetValidationLimits = {
  maxFileSize: 5 * 1024 * 1024, // 5 MB
  maxPolyBudget: 50000,
  allowedExtensions: [".glb", ".gltf"],
  allowedTextureFormats: ["image/webp", "image/png", "image/jpeg", "image/ktx2"],
};

export interface AssetValidationResult {
  valid: boolean;
  assetId: string;
  errors: string[];
  warnings: string[];
}

export class AssetValidator {
  private limits: AssetValidationLimits;

  constructor(limits: Partial<AssetValidationLimits> = {}) {
    this.limits = { ...DEFAULT_VALIDATION_LIMITS, ...limits };
  }

  /**
   * Validate an asset manifest entry against strict schema and operational limits
   */
  public validateManifestEntry(entry: unknown): AssetValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const parseResult = AssetManifestEntrySchema.safeParse(entry);
    if (!parseResult.success) {
      parseResult.error.errors.forEach((err) => {
        errors.push(`[Schema] ${err.path.join(".")}: ${err.message}`);
      });
      return {
        valid: false,
        assetId: (entry as any)?.id || "unknown",
        errors,
        warnings,
      };
    }

    const data: AssetManifestEntry = parseResult.data;

    // 1. Format check & extension validation
    const fileLower = data.file.toLowerCase();
    const hasValidExt = this.limits.allowedExtensions.some((ext) => fileLower.endsWith(ext));
    if (!hasValidExt) {
      errors.push(
        `[Format] File "${data.file}" must end with one of: ${this.limits.allowedExtensions.join(", ")}`
      );
    }

    // 2. File size limit check
    if (data.fileSize > this.limits.maxFileSize) {
      errors.push(
        `[Size] File size ${data.fileSize} bytes exceeds max allowable limit of ${this.limits.maxFileSize} bytes (5MB)`
      );
    } else if (data.fileSize > 2 * 1024 * 1024) {
      warnings.push(
        `[Size Warning] File size ${Math.round(data.fileSize / 1024)}KB is relatively large for web delivery. Consider Draco/Meshopt compression.`
      );
    }

    // 3. Polygon count limit check
    if (data.polyBudget > this.limits.maxPolyBudget) {
      errors.push(
        `[Polycount] Polygon budget ${data.polyBudget} exceeds max allowable limit of ${this.limits.maxPolyBudget}`
      );
    } else if (data.polyBudget > 25000) {
      warnings.push(
        `[Polycount Warning] Polygon budget ${data.polyBudget} may cause frame drops on low-end mobile devices.`
      );
    }

    // 4. Category check
    if (!isAssetCategory(data.category)) {
      errors.push(`[Category] Unknown asset category "${data.category}"`);
    }

    // 5. Allowed flag check
    if (!data.allowed) {
      errors.push(`[Access] Asset "${data.id}" is marked as disallowed in manifest`);
    }

    // 6. Security: Prevent external URL injection in file path
    if (/^https?:\/\//i.test(data.file)) {
      errors.push(`[Security] Asset file URL cannot be an arbitrary external link: "${data.file}"`);
    }

    return {
      valid: errors.length === 0,
      assetId: data.id,
      errors,
      warnings,
    };
  }

  /**
   * Validate raw file before ingestion or registration
   */
  public validateRawAssetFile(fileName: string, sizeBytes: number): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const lowerName = fileName.toLowerCase();

    if (!this.limits.allowedExtensions.some((ext) => lowerName.endsWith(ext))) {
      errors.push(`Invalid file extension for "${fileName}". Expected .glb or .gltf`);
    }

    if (sizeBytes > this.limits.maxFileSize) {
      errors.push(`File "${fileName}" (${sizeBytes} bytes) exceeds limit (${this.limits.maxFileSize} bytes)`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const defaultAssetValidator = new AssetValidator();
