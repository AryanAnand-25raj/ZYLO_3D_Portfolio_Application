export interface RawResumeSection {
  heading: string;
  content: string;
  lines: string[];
}

export interface RawResumeData {
  text: string;
  sections: RawResumeSection[];
  metadata?: {
    pageCount?: number;
    detectedType?: string;
    charCount: number;
    wordCount: number;
  };
}

export interface ResumeParser {
  supports(mimeType: string, fileName?: string): boolean;
  parse(buffer: Buffer, fileName?: string): Promise<RawResumeData>;
}

/**
 * Common heuristic section segmenter for raw resume text.
 */
export function segmentResumeText(fullText: string): RawResumeSection[] {
  const lines = fullText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const commonSectionKeywords = [
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "education",
    "academic background",
    "skills",
    "technical skills",
    "projects",
    "personal projects",
    "featured projects",
    "certifications",
    "awards",
    "achievements",
    "publications",
    "languages",
    "summary",
    "profile",
    "about me",
    "contact",
  ];

  const sections: RawResumeSection[] = [];
  let currentHeading = "Summary / Header";
  let currentLines: string[] = [];

  for (const line of lines) {
    const cleanLower = line.toLowerCase().replace(/[^a-z\s]/g, "").trim();
    const isHeading =
      commonSectionKeywords.includes(cleanLower) ||
      (line.length < 35 && line === line.toUpperCase() && /[A-Z]/.test(line));

    if (isHeading && currentLines.length > 0) {
      sections.push({
        heading: currentHeading,
        content: currentLines.join("\n"),
        lines: [...currentLines],
      });
      currentHeading = line;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentLines.join("\n"),
      lines: currentLines,
    });
  }

  return sections;
}
