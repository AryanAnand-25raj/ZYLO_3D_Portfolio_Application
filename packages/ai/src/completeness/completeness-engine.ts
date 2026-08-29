import { CanonicalProfile } from "../schemas/canonical-profile.schema";
import {
  CompletenessReport,
  CompletenessReportSchema,
  CategoryScore,
  MissingFieldItem,
} from "../schemas/completeness.schema";
import { generatePrioritizedFollowUps } from "./followup-engine";

export function evaluateProfileCompleteness(
  profile: CanonicalProfile,
  enabledSections?: string[]
): CompletenessReport {
  const categoryScores: CategoryScore[] = [];
  const requiredMissing: MissingFieldItem[] = [];
  const recommendedMissing: MissingFieldItem[] = [];
  const recommendations: string[] = [];

  // 1. Profile Identity Category (Weight: 20%)
  let profileScore = 0;
  if (profile.personal.fullName?.trim()) profileScore += 35;
  else requiredMissing.push({ field: "fullName", section: "Profile", reason: "Full name is required for portfolio identification.", type: "required" });

  if (profile.personal.headline?.trim()) profileScore += 35;
  else requiredMissing.push({ field: "headline", section: "Profile", reason: "Professional headline anchors the 3D hero scene.", type: "required" });

  if (profile.summary?.trim() || profile.personal.bio?.trim()) profileScore += 20;
  else recommendedMissing.push({ field: "bio", section: "Profile", reason: "A short bio enriches the 3D About section.", type: "recommended" });

  if (profile.personal.profileImage?.trim()) profileScore += 10;

  categoryScores.push({
    category: "Profile",
    score: Math.min(100, profileScore),
    weight: 0.2,
    status: profileScore >= 80 ? "complete" : profileScore >= 50 ? "adequate" : "incomplete",
  });

  // 2. Experience Category (Weight: 20%)
  let experienceScore = 0;
  if (profile.experience && profile.experience.length > 0) {
    experienceScore = Math.min(100, 60 + profile.experience.length * 20);
    const missingHighlights = profile.experience.some((e) => !e.highlights || e.highlights.length === 0);
    if (missingHighlights) {
      recommendedMissing.push({ field: "experienceHighlights", section: "Experience", reason: "Adding measurable bullet points increases credibility.", type: "recommended" });
    }
  } else {
    recommendedMissing.push({ field: "workExperience", section: "Experience", reason: "No work experience records found.", type: "recommended" });
  }
  categoryScores.push({
    category: "Experience",
    score: experienceScore,
    weight: 0.2,
    status: experienceScore >= 70 ? "complete" : experienceScore >= 40 ? "adequate" : "incomplete",
  });

  // 3. Projects Category (Weight: 25%)
  let projectScore = 0;
  if (profile.projects && profile.projects.length > 0) {
    projectScore = Math.min(100, 50 + profile.projects.length * 25);
    const hasFeatured = profile.projects.some((p) => p.featured);
    if (!hasFeatured) {
      recommendedMissing.push({ field: "featuredProject", section: "Projects", reason: "Marking a standout project enables prominent 3D hero showcase.", type: "recommended" });
    }
    const hasLiveLinks = profile.projects.some((p) => p.demoUrl || p.githubUrl);
    if (!hasLiveLinks) {
      recommendedMissing.push({ field: "projectLinks", section: "Projects", reason: "Live demo or GitHub links boost engagement.", type: "recommended" });
    }
  } else {
    requiredMissing.push({ field: "projects", section: "Projects", reason: "At least one project is needed for a creative portfolio.", type: "required" });
  }
  categoryScores.push({
    category: "Projects",
    score: projectScore,
    weight: 0.25,
    status: projectScore >= 75 ? "complete" : projectScore >= 40 ? "adequate" : "incomplete",
  });

  // 4. Skills Category (Weight: 15%)
  let skillsScore = 0;
  const totalSkills = (profile.skills || []).reduce((acc, cat) => acc + cat.skills.length, 0);
  if (totalSkills >= 5) skillsScore = 100;
  else if (totalSkills >= 2) skillsScore = 70;
  else {
    skillsScore = 20;
    recommendedMissing.push({ field: "skills", section: "Skills", reason: "Add at least 5 skills to populate the 3D particle matrix.", type: "recommended" });
  }
  categoryScores.push({
    category: "Skills",
    score: skillsScore,
    weight: 0.15,
    status: skillsScore >= 80 ? "complete" : "incomplete",
  });

  // 5. Education Category (Weight: 10%)
  const educationScore = (profile.education && profile.education.length > 0) ? 100 : 60;
  categoryScores.push({
    category: "Education",
    score: educationScore,
    weight: 0.1,
    status: educationScore >= 80 ? "complete" : "adequate",
  });

  // 6. Socials & Contact (Weight: 10%)
  const socialsCount = (profile.socials || []).length;
  const socialsScore = socialsCount >= 2 ? 100 : socialsCount === 1 ? 70 : 30;
  categoryScores.push({
    category: "Socials",
    score: socialsScore,
    weight: 0.1,
    status: socialsScore >= 70 ? "complete" : "incomplete",
  });

  // Calculate weighted aggregate score
  const totalWeighted = categoryScores.reduce((sum, item) => sum + item.score * item.weight, 0);
  const finalScore = Math.round(totalWeighted);

  // Recommendations
  if (finalScore >= 85) {
    recommendations.push("Profile is rich, verified, and ready for high-fidelity 3D generation.");
  } else if (finalScore >= 70) {
    recommendations.push("Good foundation! Answering 1 or 2 follow-up questions will maximize presentation.");
  } else {
    recommendations.push("Provide key details such as project highlights and social links for a complete 3D portfolio.");
  }

  // Generate 3-5 prioritized follow-up questions
  const questions = generatePrioritizedFollowUps(profile, requiredMissing, recommendedMissing);

  return CompletenessReportSchema.parse({
    score: finalScore,
    categoryScores,
    requiredMissing,
    recommendedMissing,
    recommendations,
    questions,
    analyzedAt: new Date().toISOString(),
  });
}

export function analyzeProfileCompleteness(
  profileInput: any,
  enabledSections?: string[],
  preferences?: any
): {
  score: number;
  missing: string[];
  recommendations: string[];
  questions: any[];
} {
  const normalized: CanonicalProfile = {
    personal: profileInput.personal || profileInput.profile || { fullName: "Alex Vance" },
    summary: profileInput.summary || profileInput.profile?.bio || "",
    skills: profileInput.skills || profileInput.skillCategories || [],
    experience: profileInput.experience || profileInput.experiences || [],
    education: profileInput.education || [],
    projects: profileInput.projects || [],
    certifications: profileInput.certifications || [],
    achievements: profileInput.achievements || [],
    publications: profileInput.publications || [],
    services: profileInput.services || [],
    socials: profileInput.socials || [],
    sourceMetadata: { resume: false, github: false, linkedin: false, manual: true },
  };

  const report = evaluateProfileCompleteness(normalized, enabledSections);

  return {
    score: report.score,
    missing: report.requiredMissing.map((m) => m.field),
    recommendations: report.recommendations,
    questions: report.questions,
  };
}
