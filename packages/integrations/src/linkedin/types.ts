export interface LinkedInExperience {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface LinkedInParsedData {
  fullName?: string;
  headline?: string;
  bio?: string;
  location?: string;
  email?: string;
  avatarUrl?: string;
  publicUrl?: string;
  experiences: LinkedInExperience[];
  skills: string[];
  education: Array<{
    institution: string;
    degree: string;
    startDate?: string;
    endDate?: string;
  }>;
  sourceType: "oauth_api" | "url_reference" | "pasted_text" | "exported_data" | "manual";
}
