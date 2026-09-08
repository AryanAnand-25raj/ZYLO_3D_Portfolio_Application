import { LinkedInParsedData } from "./types";

/**
 * Robust fallback parser for LinkedIn profile information.
 * Complies with anti-scraping guidelines by parsing exclusively user-provided data.
 */
export class LinkedInFallbackParser {
  /**
   * Automatically detects input type (URL, JSON export, or freeform text) and parses it.
   */
  public static parse(input: string): LinkedInParsedData {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new Error("Input data cannot be empty");
    }

    // 1. Check if input is a valid LinkedIn URL
    if (/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?/i.test(trimmed)) {
      return this.parseUrl(trimmed);
    }

    // 2. Check if input is valid JSON (e.g. exported archive)
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return this.parseExportedJson(parsed);
      } catch {
        // Fall back to plain text parsing
      }
    }

    // 3. Parse freeform pasted profile text
    return this.parsePastedText(trimmed);
  }

  /**
   * Parses a user-supplied public LinkedIn profile URL.
   */
  public static parseUrl(url: string): LinkedInParsedData {
    const match = url.match(/linkedin\.com\/in\/([\w-]+)/i);
    const vanityName = match ? match[1] : "";
    const formattedName = vanityName
      ? vanityName
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      : undefined;

    return {
      fullName: formattedName,
      publicUrl: url,
      experiences: [],
      skills: [],
      education: [],
      sourceType: "url_reference",
    };
  }

  /**
   * Parses freeform pasted text from a LinkedIn profile view.
   */
  public static parsePastedText(text: string): LinkedInParsedData {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let fullName: string | undefined;
    let headline: string | undefined;
    let location: string | undefined;
    let bio: string | undefined;
    const skills: string[] = [];
    const experiences: Array<{ company: string; role: string; description?: string }> = [];

    // Heuristics for pasted profile lines
    if (lines.length > 0) {
      // First line without generic navigation keywords is typically full name
      const nameCandidate = lines.find(
        (l) =>
          !/home|my network|jobs|messaging|notifications|contact info|about|experience/i.test(l) &&
          l.length < 50
      );
      if (nameCandidate) {
        fullName = nameCandidate;
      }
    }

    // Headline detection
    const headlineCandidate = lines.find(
      (l) =>
        l !== fullName &&
        /engineer|architect|developer|designer|founder|manager|specialist|lead|director|consultant/i.test(
          l
        ) &&
        l.length < 150
    );
    if (headlineCandidate) {
      headline = headlineCandidate;
    }

    // Location detection
    const locationCandidate = lines.find((l) =>
      /area|united states|california|san francisco|new york|london|remote|germany|canada|india/i.test(l)
    );
    if (locationCandidate) {
      location = locationCandidate;
    }

    // Skills section detection
    const skillsHeaderIdx = lines.findIndex((l) => /^skills/i.test(l));
    if (skillsHeaderIdx !== -1) {
      const skillLines = lines.slice(skillsHeaderIdx + 1, skillsHeaderIdx + 15);
      for (const line of skillLines) {
        if (line.includes("·") || line.includes(",")) {
          const split = line.split(/[·,]/).map((s) => s.trim()).filter((s) => s.length > 1);
          skills.push(...split);
        } else if (line.length > 2 && line.length < 30) {
          skills.push(line);
        }
      }
    }

    // Experience detection (e.g. "Senior Engineer at Acme Corp" or "Company • Role")
    for (const line of lines) {
      const atMatch = line.match(/^(.+?)\s+at\s+([A-Z0-9].+?)$/i);
      if (atMatch && atMatch[1].length < 60 && atMatch[2].length < 60) {
        experiences.push({
          role: atMatch[1].trim(),
          company: atMatch[2].trim(),
        });
      }
    }

    // Bio detection (look for About section)
    const aboutIdx = lines.findIndex((l) => /^about/i.test(l));
    if (aboutIdx !== -1 && lines[aboutIdx + 1]) {
      bio = lines.slice(aboutIdx + 1, aboutIdx + 4).join(" ");
    }

    return {
      fullName,
      headline,
      location,
      bio,
      skills: Array.from(new Set(skills)),
      experiences,
      education: [],
      sourceType: "pasted_text",
    };
  }

  /**
   * Parses official exported JSON data archives from LinkedIn.
   */
  public static parseExportedJson(json: any): LinkedInParsedData {
    const profile = json.profile || json.Profile || json;
    const positions = json.positions || json.Positions || json.experiences || [];
    const skillsList = json.skills || json.Skills || [];
    const educationList = json.education || json.Education || [];

    const fullName =
      profile.fullName ||
      (profile.firstName && profile.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : undefined);

    const headline = profile.headline || profile.Headline;
    const location = profile.location || profile.geoLocation || profile.country;
    const bio = profile.summary || profile.bio;

    const experiences = Array.isArray(positions)
      ? positions.map((p: any) => ({
          company: p.companyName || p.company || "Company",
          role: p.title || p.role || "Professional",
          startDate: p.startedOn ? `${p.startedOn.year || ""}` : p.startDate,
          endDate: p.finishedOn ? `${p.finishedOn.year || ""}` : p.endDate || "Present",
          description: p.description || "",
        }))
      : [];

    const skills = Array.isArray(skillsList)
      ? skillsList.map((s: any) => (typeof s === "string" ? s : s.name || s.skill)).filter(Boolean)
      : [];

    const education = Array.isArray(educationList)
      ? educationList.map((e: any) => ({
          institution: e.schoolName || e.institution || "University",
          degree: e.degreeName || e.degree || "Degree",
          startDate: e.startDate,
          endDate: e.endDate,
        }))
      : [];

    return {
      fullName,
      headline,
      bio,
      location,
      skills,
      experiences,
      education,
      sourceType: "exported_data",
    };
  }
}
