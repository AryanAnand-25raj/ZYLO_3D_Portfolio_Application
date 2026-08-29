import { CanonicalProfile } from "../schemas/canonical-profile.schema";
import { FollowUpQuestion, MissingFieldItem } from "../schemas/completeness.schema";

export function generatePrioritizedFollowUps(
  profile: CanonicalProfile,
  requiredMissing: MissingFieldItem[],
  recommendedMissing: MissingFieldItem[]
): FollowUpQuestion[] {
  const questions: FollowUpQuestion[] = [];

  // 1. Check if Bio/Summary is missing
  if (!profile.summary?.trim() && !profile.personal.bio?.trim()) {
    questions.push({
      id: "q-bio",
      section: "About",
      field: "bio",
      question: "What is your primary creative engineering philosophy or core domain specialization?",
      type: "recommended",
      answer: "",
      skipped: false,
    });
  }

  // 2. Check if Featured Project highlight is missing
  if (profile.projects && profile.projects.length > 0) {
    const featured = profile.projects.find((p) => p.featured) || profile.projects[0];
    if (featured && (!featured.stats || featured.stats.length === 0)) {
      questions.push({
        id: "q-project-metric",
        section: "Projects",
        field: "projectMetric",
        question: `What is the most notable measurable achievement in "${featured.title}" (e.g. 60 FPS, 50k users)?`,
        type: "recommended",
        answer: "",
        skipped: false,
      });
    }
  } else {
    questions.push({
      id: "q-top-project",
      section: "Projects",
      field: "topProject",
      question: "What is the standout project or application you would like to headline on your portfolio?",
      type: "required",
      answer: "",
      skipped: false,
    });
  }

  // 3. Check if Work Experience highlights are sparse
  if (profile.experience && profile.experience.length > 0) {
    const latest = profile.experience[0];
    if (!latest.highlights || latest.highlights.length === 0) {
      questions.push({
        id: "q-exp-highlight",
        section: "Experience",
        field: "experienceHighlight",
        question: `What key architectural or product milestone did you achieve at ${latest.company}?`,
        type: "recommended",
        answer: "",
        skipped: false,
      });
    }
  }

  // 4. Check if Socials are missing
  if (!profile.socials || profile.socials.length === 0) {
    questions.push({
      id: "q-socials",
      section: "Socials",
      field: "githubUrl",
      question: "Would you like to connect your GitHub or LinkedIn profile link to display floating 3D spatial pills?",
      type: "optional",
      answer: "",
      skipped: false,
    });
  }

  // 5. Target role aspiration
  questions.push({
    id: "q-target-aspiration",
    section: "Hero",
    field: "targetRole",
    question: "What specific role or engagement type are you looking for next?",
    type: "optional",
    answer: "",
    skipped: false,
  });

  // Return strictly top 3 to 5 questions
  return questions.slice(0, 4);
}
