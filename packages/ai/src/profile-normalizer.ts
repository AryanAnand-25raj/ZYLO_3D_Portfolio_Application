import { ContentData } from "@/schemas/content.schema";
import { ExtractedResumeData } from "@/schemas/ai.schema";
import { DataConflict, DataSource } from "@/schemas/draft.schema";

export interface NormalizationResult {
  canonicalProfile: ContentData;
  conflicts: DataConflict[];
  changesApplied: string[];
}

/**
 * Normalizes date formats into clean human/ISO compatible strings.
 */
export function normalizeDateString(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const clean = dateStr.trim();
  if (/present|current|now/i.test(clean)) return "Present";

  // Year only
  if (/^\d{4}$/.test(clean)) return clean;

  // Month Year (e.g. Jan 2023, 01/2023)
  const monthYearMatch = clean.match(/([a-zA-Z]+|\d{1,2})[\s/,-]+(\d{4})/);
  if (monthYearMatch) {
    return `${monthYearMatch[1]} ${monthYearMatch[2]}`;
  }

  return clean;
}

/**
 * Merges manual form entries and resume extracted entities, detecting data conflicts.
 */
export function normalizeAndDetectConflicts(
  manualData: Partial<ContentData>,
  extractedData?: Partial<ExtractedResumeData> | null
): NormalizationResult {
  const conflicts: DataConflict[] = [];
  const changesApplied: string[] = [];

  const manualProfile = manualData.profile || {
    fullName: "",
    headline: "",
    bio: "",
    location: "",
    availableForHire: true,
    badgeText: "Available for projects",
  };

  const extractedProfile: any = extractedData?.profile || {};

  // Conflict detection for Full Name
  let resolvedFullName = manualProfile.fullName || extractedProfile.fullName || "Alex Vance";
  if (
    manualProfile.fullName &&
    extractedProfile.fullName &&
    manualProfile.fullName.trim().toLowerCase() !== extractedProfile.fullName.trim().toLowerCase()
  ) {
    conflicts.push({
      id: "conflict-fullname",
      field: "profile.fullName",
      section: "profile",
      label: "Full Name Discrepancy",
      values: [
        { source: "manual" as DataSource, value: manualProfile.fullName, timestamp: new Date().toISOString() },
        { source: "resume" as DataSource, value: extractedProfile.fullName, timestamp: new Date().toISOString() },
      ],
      resolved: false,
      resolvedValue: manualProfile.fullName, // Default to manual preference
    });
  }

  // Conflict detection for Headline
  let resolvedHeadline =
    manualProfile.headline ||
    extractedProfile.headline ||
    "Creative Technologist & 3D Interactive Web Architect";

  if (
    manualProfile.headline &&
    extractedProfile.headline &&
    manualProfile.headline.trim().toLowerCase() !== extractedProfile.headline.trim().toLowerCase()
  ) {
    conflicts.push({
      id: "conflict-headline",
      field: "profile.headline",
      section: "profile",
      label: "Professional Headline Discrepancy",
      values: [
        { source: "manual" as DataSource, value: manualProfile.headline, timestamp: new Date().toISOString() },
        { source: "resume" as DataSource, value: extractedProfile.headline, timestamp: new Date().toISOString() },
      ],
      resolved: false,
      resolvedValue: manualProfile.headline,
    });
  }

  // Merge experiences
  const manualExperiences = manualData.experiences || [];
  const extractedExperiences = (extractedData?.experiences || []).map((exp) => ({
    ...exp,
    startDate: normalizeDateString(exp.startDate),
    endDate: normalizeDateString(exp.endDate),
  }));

  // Combine unique experiences by company name
  const expMap = new Map<string, any>();
  for (const exp of [...manualExperiences, ...extractedExperiences]) {
    const key = exp.company.toLowerCase().trim();
    if (!expMap.has(key)) {
      expMap.set(key, exp);
    }
  }
  const mergedExperiences = Array.from(expMap.values());

  // Merge projects
  const manualProjects = manualData.projects || [];
  const extractedProjects = extractedData?.projects || [];
  const projectMap = new Map<string, any>();
  for (const proj of [...manualProjects, ...extractedProjects]) {
    const key = proj.title.toLowerCase().trim();
    if (!projectMap.has(key)) {
      projectMap.set(key, proj);
    }
  }
  const mergedProjects = Array.from(projectMap.values());

  // Merge skill categories
  const manualSkills = manualData.skillCategories || [];
  const extractedSkills = extractedData?.skillCategories || [];
  const mergedSkillCategories = manualSkills.length > 0 ? manualSkills : extractedSkills;

  // Merge education
  const mergedEducation = (manualData.education && manualData.education.length > 0)
    ? manualData.education
    : (extractedData?.education || []);

  const canonicalProfile: ContentData = {
    profile: {
      fullName: resolvedFullName,
      headline: resolvedHeadline,
      bio: manualProfile.bio || extractedProfile.bio || "",
      avatarUrl: manualProfile.avatarUrl || "",
      location: manualProfile.location || extractedProfile.location || "",
      availableForHire: manualProfile.availableForHire ?? true,
      badgeText: manualProfile.badgeText || "Available for projects",
    },
    socials: manualData.socials || extractedProfile.socials || [],
    experiences: mergedExperiences,
    projects: mergedProjects,
    skillCategories: mergedSkillCategories,
    education: mergedEducation,
    customSections: manualData.customSections || [],
  };

  return {
    canonicalProfile,
    conflicts,
    changesApplied,
  };
}
