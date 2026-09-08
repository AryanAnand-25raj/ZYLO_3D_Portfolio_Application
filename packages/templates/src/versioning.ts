export interface ParsedTemplateVersion {
  templateId: string;
  major: number;
  minor: number;
  patch: number;
  fullVersion: string;
}

export class TemplateVersioning {
  /**
   * Parse a versioned template identifier like "orbit@1.0.0" or "neural@1.2"
   */
  public static parse(templateIdentifier: string): ParsedTemplateVersion {
    const parts = templateIdentifier.split("@");
    const templateId = parts[0].toLowerCase().trim();
    const versionStr = parts[1] || "1.0.0";

    const semverParts = versionStr.split(".").map((n) => parseInt(n, 10) || 0);
    const major = semverParts[0] ?? 1;
    const minor = semverParts[1] ?? 0;
    const patch = semverParts[2] ?? 0;

    return {
      templateId,
      major,
      minor,
      patch,
      fullVersion: `${templateId}@${major}.${minor}.${patch}`,
    };
  }

  /**
   * Format a template ID and version into an official templateVersion tag
   */
  public static format(templateId: string, version: string = "1.0.0"): string {
    const parsed = this.parse(`${templateId}@${version}`);
    return parsed.fullVersion;
  }

  /**
   * Check if two template versions are compatible (same major version)
   */
  public static isCompatible(currentVersion: string, targetVersion: string): boolean {
    const current = this.parse(currentVersion);
    const target = this.parse(targetVersion);

    if (current.templateId !== target.templateId) {
      return false; // Different templates require migration
    }

    return current.major === target.major;
  }
}
