import crypto from "crypto";
import path from "path";
import { FileValidationOptions, FileValidationResult } from "./types";

export const FILE_CATEGORY_RULES: Record<
  "resume" | "model3d" | "texture" | "image",
  FileValidationOptions
> = {
  resume: {
    category: "resume",
    allowedExtensions: [".pdf"],
    allowedMimeTypes: ["application/pdf"],
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
  },
  model3d: {
    category: "model3d",
    allowedExtensions: [".glb", ".gltf"],
    allowedMimeTypes: ["model/gltf-binary", "model/gltf+json", "application/octet-stream"],
    maxSizeBytes: 25 * 1024 * 1024, // 25 MB
  },
  texture: {
    category: "texture",
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp"],
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  },
  image: {
    category: "image",
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp", ".svg"],
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
  },
};

export class FileSecurityValidator {
  /**
   * Validates an uploaded file's metadata, size, extension, and MIME type.
   */
  public static validate(
    filename: string,
    mimeType: string,
    sizeBytes: number,
    category: "resume" | "model3d" | "texture" | "image" = "resume"
  ): FileValidationResult {
    const rules = FILE_CATEGORY_RULES[category];

    // 1. Sanitize filename & check path traversal
    const cleanFilename = this.sanitizeFilename(filename);
    if (!cleanFilename) {
      return {
        valid: false,
        sanitizedFilename: "",
        safeKey: "",
        error: "Invalid or dangerous filename.",
      };
    }

    // 2. Reject executable extensions strictly
    const rawExt = path.extname(filename).toLowerCase();
    const dangerousExtensions = [
      ".exe", ".sh", ".bash", ".bat", ".cmd", ".msi", ".php", ".py", ".rb",
      ".pl", ".js", ".mjs", ".ts", ".jsx", ".tsx", ".html", ".htm", ".vbs",
      ".jar", ".scr", ".pif",
    ];
    if (dangerousExtensions.includes(rawExt)) {
      return {
        valid: false,
        sanitizedFilename: cleanFilename,
        safeKey: "",
        error: `Executable or script extension "${rawExt}" is strictly prohibited.`,
      };
    }

    // 3. Extension allowlist check
    if (!rules.allowedExtensions.includes(rawExt)) {
      return {
        valid: false,
        sanitizedFilename: cleanFilename,
        safeKey: "",
        error: `Extension "${rawExt}" is not permitted for ${category}. Allowed: ${rules.allowedExtensions.join(", ")}`,
      };
    }

    // 4. MIME type check
    const normalizedMime = (mimeType || "").toLowerCase().trim();
    if (!rules.allowedMimeTypes.includes(normalizedMime)) {
      return {
        valid: false,
        sanitizedFilename: cleanFilename,
        safeKey: "",
        error: `MIME type "${mimeType}" is not permitted. Expected: ${rules.allowedMimeTypes.join(", ")}`,
      };
    }

    // 5. Size check
    if (sizeBytes > rules.maxSizeBytes) {
      const maxMb = Math.round(rules.maxSizeBytes / (1024 * 1024));
      return {
        valid: false,
        sanitizedFilename: cleanFilename,
        safeKey: "",
        error: `File size exceeds maximum permitted limit of ${maxMb}MB.`,
      };
    }

    // 6. Generate non-executable, isolated storage key
    const uniqueHash = crypto.randomBytes(8).toString("hex");
    const safeKey = `storage/uploads/${category}/${Date.now()}_${uniqueHash}${rawExt}`;

    return {
      valid: true,
      sanitizedFilename: cleanFilename,
      safeKey,
    };
  }

  /**
   * Sanitizes a filename: removes path traversals, null bytes, and non-safe characters.
   */
  public static sanitizeFilename(filename: string): string {
    if (!filename || typeof filename !== "string") return "";

    // Null byte injection protection
    if (filename.includes("\0") || filename.includes("%00")) {
      return "";
    }

    // Strip directory traversal
    let base = path.basename(filename);
    base = base.replace(/(\.\.[\/\\])+/g, "");
    base = base.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
    base = base.replace(/\s+/g, "_");

    return base.trim();
  }
}
