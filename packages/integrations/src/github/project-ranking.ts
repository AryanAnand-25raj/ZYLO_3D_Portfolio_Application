import { GitHubProject, ProjectRecommendation } from "./types";

const RELEVANT_TOPICS = new Set([
  "threejs",
  "three-js",
  "webgl",
  "webgpu",
  "glsl",
  "shader",
  "3d",
  "ai",
  "machine-learning",
  "deep-learning",
  "llm",
  "neural-network",
  "react",
  "nextjs",
  "next-js",
  "typescript",
  "rust",
  "golang",
  "wasm",
  "webassembly",
]);

const HIGH_VALUE_LANGUAGES = new Set([
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "c++",
  "swift",
  "kotlin",
]);

/**
 * Deterministic + AI-assisted project ranking algorithm.
 * Evaluates completeness, documentation, stack relevance, and activity.
 * Does NOT equate raw stars with project quality.
 */
export class ProjectQualityScorer {
  public static evaluateProject(
    project: GitHubProject,
    targetAudienceDomain?: string
  ): ProjectRecommendation {
    let score = 0;
    const reasons: string[] = [];

    // 1. Completeness & Summary (Max 25)
    if (project.description && project.description.trim().length > 0) {
      score += 15;
      if (project.description.length >= 35) {
        score += 10;
        reasons.push("Clear, informative project description");
      } else {
        reasons.push("Basic project description present");
      }
    } else {
      reasons.push("Missing repository description");
    }

    // 2. Live Demo / Homepage URL (Max 15)
    if (project.homepage && project.homepage.startsWith("http")) {
      score += 15;
      reasons.push("Live interactive demo available");
    }

    // 3. Recent Activity & Maintenance (Max 15)
    const refDate = project.pushedAt ? new Date(project.pushedAt) : new Date(project.updatedAt);
    const daysSincePushed = Math.floor((Date.now() - refDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSincePushed <= 90) {
      score += 15;
      reasons.push("Recent active commits within 90 days");
    } else if (daysSincePushed <= 180) {
      score += 10;
      reasons.push("Updated within the past 6 months");
    } else if (daysSincePushed <= 365) {
      score += 5;
      reasons.push("Maintained within the past year");
    } else {
      reasons.push("Inactive for over a year");
    }

    // 4. Technology Relevance & Topics (Max 25)
    const langLower = (project.language || "").toLowerCase();
    if (HIGH_VALUE_LANGUAGES.has(langLower)) {
      score += 10;
      reasons.push(`Built with modern ${project.language} stack`);
    }

    const matchedTopics = (project.topics || []).filter((t) =>
      RELEVANT_TOPICS.has(t.toLowerCase())
    );

    if (matchedTopics.length > 0) {
      score += 15;
      reasons.push(`Targeted domain topics: ${matchedTopics.slice(0, 3).join(", ")}`);
    } else if ((project.topics || []).length > 0) {
      score += 8;
      reasons.push("Repository topics configured");
    }

    // 5. Community Signals: Logarithmic Scaling (Max 15)
    // Avoids star bias while giving healthy credit for validated adoption
    const starScore = Math.min(10, Math.floor(Math.log10((project.stars || 0) + 1) * 5));
    const forkScore = Math.min(5, Math.floor(Math.log10((project.forks || 0) + 1) * 3));
    score += starScore + forkScore;

    if (project.stars > 25) {
      reasons.push(`Community validated (${project.stars} stars, ${project.forks} forks)`);
    }

    // 6. Original Work vs Fork Penalties
    if (project.isFork) {
      score -= 20;
      reasons.push("Forked repository (penalized for portfolio recommendation)");
    }

    // Clamp score between 10 and 99 (reserving 100 for manual user override)
    const finalScore = Math.max(10, Math.min(98, score));

    // Determine category
    let recommendedCategory = "Open Source";
    const textCorpus = `${project.name} ${project.description || ""} ${project.topics.join(" ")} ${project.language || ""}`.toLowerCase();

    if (textCorpus.includes("three") || textCorpus.includes("webgl") || textCorpus.includes("3d") || textCorpus.includes("shader")) {
      recommendedCategory = "Interactive 3D / WebGL";
    } else if (textCorpus.includes("ai") || textCorpus.includes("llm") || textCorpus.includes("agent") || textCorpus.includes("gpt")) {
      recommendedCategory = "AI & Machine Learning";
    } else if (textCorpus.includes("react") || textCorpus.includes("next") || textCorpus.includes("frontend") || textCorpus.includes("fullstack")) {
      recommendedCategory = "Full Stack Web";
    } else if (textCorpus.includes("cli") || textCorpus.includes("tool") || textCorpus.includes("package")) {
      recommendedCategory = "Developer Tooling";
    }

    const highlightedTags = Array.from(
      new Set([
        ...(project.language ? [project.language] : []),
        ...(project.topics || []).slice(0, 4),
      ])
    );

    return {
      repositoryId: project.id,
      score: finalScore,
      reasons,
      recommendedCategory,
      highlightedTags,
    };
  }

  /**
   * Sorts and categorizes a list of repositories into AI Recommended, All, and Highlights.
   */
  public static rankProjects(
    projects: GitHubProject[],
    targetAudienceDomain?: string
  ): {
    evaluated: Array<{ project: GitHubProject; recommendation: ProjectRecommendation }>;
    topRecommended: Array<{ project: GitHubProject; recommendation: ProjectRecommendation }>;
  } {
    const evaluated = projects.map((project) => ({
      project,
      recommendation: this.evaluateProject(project, targetAudienceDomain),
    }));

    // Sort descending by quality score
    evaluated.sort((a, b) => b.recommendation.score - a.recommendation.score);

    // Top recommended are repos with score >= 60 and not forks
    const topRecommended = evaluated.filter(
      (item) => item.recommendation.score >= 60 && !item.project.isFork
    );

    return {
      evaluated,
      topRecommended: topRecommended.length > 0 ? topRecommended : evaluated.slice(0, 3),
    };
  }
}
