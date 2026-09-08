import { GitHubProject } from "../github/types";
import { LinkedInParsedData } from "../linkedin/types";
import { ExternalProfile, DataSourceField } from "../core/types";
import { normalizeMultiSourceProfile, NormalizationResult } from "@zylo/ai";

export class IntegrationNormalizer {
  /**
   * Wraps an imported value with source attribution metadata for auditing and conflict resolution.
   */
  public static createSourceField<T>(
    value: T,
    source: "github" | "linkedin" | "resume" | "manual" | "ai"
  ): DataSourceField<T> {
    return {
      value,
      source,
      importedAt: new Date().toISOString(),
      verified: source !== "manual",
    };
  }

  /**
   * Maps GitHub public projects into canonical portfolio projects with full source metadata.
   */
  public static mapGitHubToCanonicalProjects(repos: GitHubProject[]): any[] {
    return repos.map((repo, idx) => ({
      id: `proj-gh-${repo.id}`,
      title: repo.name,
      slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      summary: repo.description || "Open source project on GitHub.",
      description: repo.description || "Engineered with modern fullstack architecture and performance optimization.",
      category: "Open Source",
      tags: repo.topics.length > 0 ? repo.topics : [repo.language || "TypeScript"],
      featured: repo.stars >= 25 || idx === 0,
      demoUrl: repo.homepage || "",
      githubUrl: repo.url,
      stats: [
        { label: "Stars", value: String(repo.stars) },
        { label: "Forks", value: String(repo.forks) },
      ],
      stars: repo.stars,
      forks: repo.forks,
      source: "github" as const,
      sourceMetadata: {
        importedFrom: "github",
        externalRepoId: repo.id,
        fullName: repo.fullName,
        importedAt: new Date().toISOString(),
      },
    }));
  }

  /**
   * Unifies GitHub, LinkedIn, Resume, and Manual data into the canonical portfolio profile
   * using the Task 3 AI Normalization Service.
   */
  public static unifyProfessionalProfile(inputs: {
    manualData?: Record<string, any>;
    resumeData?: Record<string, any>;
    githubProfile?: ExternalProfile;
    githubProjects?: GitHubProject[];
    linkedinData?: LinkedInParsedData;
    stylePrompt?: string;
  }): NormalizationResult {
    const ghPayload: Record<string, any> = {};
    if (inputs.githubProfile) {
      ghPayload.name = inputs.githubProfile.fullName;
      ghPayload.bio = inputs.githubProfile.bio;
      ghPayload.location = inputs.githubProfile.location;
      ghPayload.avatarUrl = inputs.githubProfile.avatarUrl;
    }
    if (inputs.githubProjects) {
      ghPayload.repositories = inputs.githubProjects.map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        topics: r.topics,
        stargazersCount: r.stars,
        forksCount: r.forks,
        homepage: r.homepage,
        htmlUrl: r.url,
      }));
    }

    const liPayload: Record<string, any> = {};
    if (inputs.linkedinData) {
      liPayload.profile = {
        fullName: inputs.linkedinData.fullName,
        headline: inputs.linkedinData.headline,
        bio: inputs.linkedinData.bio,
        location: inputs.linkedinData.location,
        avatarUrl: inputs.linkedinData.avatarUrl,
      };
      liPayload.experiences = inputs.linkedinData.experiences;
      liPayload.skills = inputs.linkedinData.skills;
    }

    return normalizeMultiSourceProfile({
      manualData: inputs.manualData,
      resumeData: inputs.resumeData,
      githubData: ghPayload,
      linkedinData: liPayload,
      stylePrompt: inputs.stylePrompt,
    });
  }
}
