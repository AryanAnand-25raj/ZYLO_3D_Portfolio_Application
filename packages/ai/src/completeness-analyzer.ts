import { ContentData } from "@/schemas/content.schema";
import { CompletenessResult, FollowUpQuestion, SectionName, StylePreferences } from "@/schemas/draft.schema";

/**
 * Analyzes the completeness of user profile data and generates high-value follow-up questions.
 */
export function analyzeProfileCompleteness(
  profile: ContentData,
  selectedSections: SectionName[] = ["Hero", "About", "Experience", "Skills", "Projects", "Contact"],
  _preferences?: StylePreferences
): CompletenessResult {
  let score = 0;
  const missing: string[] = [];
  const recommendations: string[] = [];
  const questions: FollowUpQuestion[] = [];

  // 1. Profile Core (30 points)
  if (profile.profile.fullName?.trim()) {
    score += 10;
  } else {
    missing.push("Full Name");
  }

  if (profile.profile.headline?.trim()) {
    score += 10;
  } else {
    missing.push("Professional Headline");
    recommendations.push("Add a strong professional headline (e.g. '3D Web Architect & Graphics Engineer').");
  }

  if (profile.profile.bio && profile.profile.bio.length >= 30) {
    score += 10;
  } else {
    missing.push("Short Bio");
    recommendations.push("Expand your short biography to help the AI craft an impactful About section.");
    questions.push({
      id: "q-bio",
      question: "What is your main engineering or design specialty, and what kind of problems excite you most?",
      section: "About",
      context: "Used to synthesize a compelling introduction and hero tagline.",
      answer: "",
      skipped: false,
    });
  }

  // 2. Experience Section (25 points)
  if (selectedSections.includes("Experience")) {
    if (profile.experiences && profile.experiences.length > 0) {
      score += 15;
      const hasHighlights = profile.experiences.some(
        (exp) => exp.highlights && exp.highlights.length > 0
      );
      if (hasHighlights) {
        score += 10;
      } else {
        recommendations.push("Add quantifiable achievements or key metrics to your work experiences.");
        questions.push({
          id: "q-exp-metric",
          question: `What was your biggest technical achievement or measurable impact at ${profile.experiences[0]?.company || "your latest role"}?`,
          section: "Experience",
          context: "Used to highlight measurable outcomes in 3D spatial cards.",
          answer: "",
          skipped: false,
        });
      }
    } else {
      missing.push("Work Experience");
      recommendations.push("Include at least one work experience to showcase your professional trajectory.");
    }
  } else {
    score += 25; // Section not requested, don't penalize
  }

  // 3. Projects Section (25 points)
  if (selectedSections.includes("Projects")) {
    if (profile.projects && profile.projects.length > 0) {
      score += 15;
      const featured = profile.projects.find((p) => p.featured) || profile.projects[0];
      if (featured && featured.description && featured.description.length > 20) {
        score += 10;
      } else {
        recommendations.push("Provide a descriptive summary for your featured project.");
        questions.push({
          id: "q-project-featured",
          question: `What specific challenge did you solve in "${featured?.title || "your featured project"}", and what technologies made it possible?`,
          section: "Projects",
          context: "Helps generate interactive 3D showcase callouts.",
          answer: "",
          skipped: false,
        });
      }
    } else {
      missing.push("Featured Projects");
      recommendations.push("Add at least 1-2 featured projects to anchor your 3D portfolio.");
      questions.push({
        id: "q-missing-project",
        question: "What is the most impressive project you have built recently?",
        section: "Projects",
        answer: "",
        skipped: false,
      });
    }
  } else {
    score += 25;
  }

  // 4. Skills & Socials (20 points)
  const hasSkills =
    profile.skillCategories?.some((cat) => cat.skills.length > 0) || false;

  if (hasSkills) {
    score += 10;
  } else {
    missing.push("Categorized Skills");
    recommendations.push("Add technical and design skills to populate interactive 3D skill clusters.");
  }

  if (profile.socials && profile.socials.length > 0) {
    score += 10;
  } else {
    recommendations.push("Link your GitHub, LinkedIn, or personal website for recruiter visibility.");
  }

  // Cap score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, score));

  return {
    score: normalizedScore,
    missing,
    recommendations,
    questions,
  };
}
