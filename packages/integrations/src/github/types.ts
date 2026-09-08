export interface GitHubProject {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage?: string;
  language?: string;
  languages: string[];
  topics: string[];
  stars: number;
  forks: number;
  isFork: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt?: string;
}

export interface ProjectRecommendation {
  repositoryId: string;
  score: number; // 0 to 100
  reasons: string[];
  recommendedCategory: string;
  highlightedTags: string[];
}
