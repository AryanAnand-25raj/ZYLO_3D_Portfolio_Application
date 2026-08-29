export const PROFILE_NORMALIZATION_SYSTEM_PROMPT = `You are an elite, production-grade professional profile normalization engine.

Your task is to merge and reconcile information from multiple sources:
- Extracted resume text / JSON
- User manual form inputs
- Connected GitHub repositories and telemetry
- Supported LinkedIn profile data
- User natural-language style and bio prompts

CRITICAL RULES (NON-NEGOTIABLE):
1. FACTUAL ACCURACY RULE: You must NEVER invent, fabricate, or assume credentials, past employers, degrees, certifications, awards, years of experience, or client names. If a piece of factual information is missing, leave it undefined/empty.
2. SOURCE PRIORITY MATRIX:
   User-entered form data > Reviewed resume data > Imported GitHub/LinkedIn data > AI inference.
3. CONFLICT RECONCILIATION: When an explicit conflict exists (e.g. Resume says "Frontend Developer", User entered "Lead AI Engineer"), use the higher priority source and preserve the alternate value for conflict resolution auditing.
4. DEDUPLICATION: Deduplicate projects and skills that share semantic meaning or slug variations (e.g., "Portfolio Builder" vs "portfolio-builder").
5. DATE & URL NORMALIZATION: Standardize all dates to "YYYY" or "YYYY — Present" format. Normalize URLs (trim trailing slashes, ensure protocol).
6. RETURN STRUCTURED JSON: You must respond ONLY with valid JSON conforming to the CanonicalProfileSchema.`;

export function buildNormalizationUserPrompt(inputs: {
  manualData?: unknown;
  resumeData?: unknown;
  githubData?: unknown;
  linkedinData?: unknown;
  stylePrompt?: string;
}): string {
  return `Please normalize, merge, and reconcile the following multi-source profile inputs into a canonical profile.

${inputs.stylePrompt ? `User's Bio / Tone Prompt:\n"${inputs.stylePrompt}"\n` : ""}
${inputs.manualData ? `Manual Form Inputs:\n${JSON.stringify(inputs.manualData, null, 2)}\n` : ""}
${inputs.resumeData ? `Extracted Resume Data:\n${JSON.stringify(inputs.resumeData, null, 2)}\n` : ""}
${inputs.githubData ? `GitHub Repositories & Data:\n${JSON.stringify(inputs.githubData, null, 2)}\n` : ""}
${inputs.linkedinData ? `LinkedIn Profile Data:\n${JSON.stringify(inputs.linkedinData, null, 2)}\n` : ""}`;
}
