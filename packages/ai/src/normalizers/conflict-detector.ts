import { DataSource } from "../schemas/canonical-profile.schema";

export interface DataConflictValue {
  source: DataSource;
  value: unknown;
}

export interface DataConflict {
  id: string;
  field: string;
  label: string;
  values: DataConflictValue[];
  resolved: boolean;
  resolvedValue?: unknown;
  requiresUserDecision: boolean;
}

export function detectProfileConflicts(sources: {
  manual?: Record<string, unknown>;
  resume?: Record<string, unknown>;
  github?: Record<string, unknown>;
  linkedin?: Record<string, unknown>;
}): DataConflict[] {
  const conflicts: DataConflict[] = [];

  const checkField = (field: string, label: string) => {
    const values: DataConflictValue[] = [];

    if (sources.manual && sources.manual[field]) {
      values.push({ source: "manual", value: sources.manual[field] });
    }
    if (sources.resume && sources.resume[field]) {
      values.push({ source: "resume", value: sources.resume[field] });
    }
    if (sources.github && sources.github[field]) {
      values.push({ source: "github", value: sources.github[field] });
    }
    if (sources.linkedin && sources.linkedin[field]) {
      values.push({ source: "linkedin", value: sources.linkedin[field] });
    }

    // Check if there are multiple unique string values
    const stringVals = values.map((v) => String(v.value).trim().toLowerCase());
    const uniqueStrings = new Set(stringVals);

    if (values.length > 1 && uniqueStrings.size > 1) {
      conflicts.push({
        id: `conflict-${field}-${Date.now()}`,
        field,
        label,
        values,
        resolved: false,
        requiresUserDecision: true,
      });
    }
  };

  checkField("fullName", "Full Name");
  checkField("headline", "Professional Headline");
  checkField("location", "Current Location");
  checkField("email", "Primary Email");

  return conflicts;
}
