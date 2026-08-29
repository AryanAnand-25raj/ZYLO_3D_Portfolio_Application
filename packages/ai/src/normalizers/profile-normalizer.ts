import {
  CanonicalProfile,
  CanonicalProfileSchema,
  Experience,
  Project,
  SkillCategory,
  Education,
  SocialLink,
} from "../schemas/canonical-profile.schema";
import { deduplicateProjects, deduplicateSkillCategories, deduplicateExperiences } from "./duplicate-detector";
import { detectProfileConflicts, DataConflict } from "./conflict-detector";

export interface NormalizationInputs {
  manualData?: Partial<CanonicalProfile> | Record<string, any>;
  resumeData?: Record<string, any>;
  githubData?: Record<string, any>;
  linkedinData?: Record<string, any>;
  stylePrompt?: string;
}

export interface NormalizationResult {
  canonicalProfile: CanonicalProfile;
  conflicts: DataConflict[];
  appliedSources: string[];
}

export function normalizeMultiSourceProfile(inputs: NormalizationInputs): NormalizationResult {
  const manual: any = inputs.manualData || {};
  const resume: any = inputs.resumeData || {};
  const github: any = inputs.githubData || {};
  const linkedin: any = inputs.linkedinData || {};

  // 1. Conflict detection on personal profile keys
  const manualProfile = manual.personal || manual.profile || {};
  const resumeProfile = resume.profile || {};
  const githubProfile = { fullName: github.name, headline: github.bio, location: github.location };
  const linkedinProfile = linkedin.profile || {};

  const conflicts = detectProfileConflicts({
    manual: manualProfile,
    resume: resumeProfile,
    github: githubProfile,
    linkedin: linkedinProfile,
  });

  // 2. Deterministic Source Priority Resolution: Manual > Resume > GitHub > LinkedIn
  const fullName =
    manualProfile.fullName ||
    resumeProfile.fullName ||
    githubProfile.fullName ||
    linkedinProfile.fullName ||
    "Alex Vance";

  const headline =
    manualProfile.headline ||
    resumeProfile.headline ||
    githubProfile.headline ||
    linkedinProfile.headline ||
    "Creative Technologist & 3D Interactive Web Architect";

  const email =
    manualProfile.email ||
    resumeProfile.email ||
    linkedinProfile.email ||
    "";

  const phone =
    manualProfile.phone ||
    resumeProfile.phone ||
    "";

  const location =
    manualProfile.location ||
    resumeProfile.location ||
    githubProfile.location ||
    "San Francisco, CA";

  const profileImage =
    manualProfile.profileImage ||
    github.avatarUrl ||
    resumeProfile.profileImage ||
    "";

  const summary =
    manual.summary ||
    manualProfile.bio ||
    resumeProfile.bio ||
    resume.summary ||
    inputs.stylePrompt ||
    "Pioneering interactive spatial dimensions and real-time WebGL graphics.";

  // 3. Normalize & Deduplicate Experiences
  const rawExperiences: Experience[] = [];
  if (Array.isArray(manual.experience) || Array.isArray(manual.experiences)) {
    rawExperiences.push(...((manual.experience || manual.experiences) as Experience[]));
  }
  if (Array.isArray(resume.experiences) || Array.isArray(resume.experience)) {
    const resExp = (resume.experiences || resume.experience) as any[];
    rawExperiences.push(
      ...resExp.map((e, idx) => ({
        id: e.id || `exp-resume-${idx}`,
        company: e.company || "Company",
        role: e.role || "Software Engineer",
        location: e.location || "",
        startDate: e.startDate || "2022",
        endDate: e.endDate || "Present",
        current: e.current ?? e.endDate === "Present",
        description: e.description || "",
        highlights: e.highlights || [],
        technologies: e.technologies || [],
        source: "resume" as const,
      }))
    );
  }
  const experiences = deduplicateExperiences(rawExperiences);

  // 4. Normalize & Deduplicate Projects
  const rawProjects: Project[] = [];
  if (Array.isArray(manual.projects)) {
    rawProjects.push(...(manual.projects as Project[]));
  }
  if (Array.isArray(resume.projects)) {
    const resProj = resume.projects as any[];
    rawProjects.push(
      ...resProj.map((p, idx) => ({
        id: p.id || `proj-resume-${idx}`,
        title: p.title || "Project",
        slug: p.slug || p.title?.toLowerCase().replace(/\s+/g, "-") || `proj-${idx}`,
        summary: p.summary || p.description || "Interactive software project.",
        description: p.description || p.summary || "Fullstack application architecture.",
        category: p.category || "3D Graphics",
        tags: p.technologies || p.tags || ["TypeScript", "Three.js"],
        featured: p.featured ?? idx === 0,
        demoUrl: p.demoUrl || "",
        githubUrl: p.githubUrl || "",
        stats: p.stats || [{ label: "Performance", value: "60 FPS" }],
        source: "resume" as const,
      }))
    );
  }
  if (Array.isArray(github.repositories)) {
    const ghRepos = github.repositories as any[];
    rawProjects.push(
      ...ghRepos.map((r, idx) => ({
        id: `proj-gh-${idx}`,
        title: r.name,
        slug: r.name.toLowerCase().replace(/\s+/g, "-"),
        summary: r.description || "Public open-source repository.",
        description: r.description || "Architected with modern development practices.",
        category: "Open Source",
        tags: r.topics?.length ? r.topics : [r.language || "TypeScript"],
        featured: r.stargazersCount > 50,
        demoUrl: r.homepage || "",
        githubUrl: r.htmlUrl || "",
        stats: [{ label: "Stars", value: String(r.stargazersCount || 0) }],
        source: "github" as const,
      }))
    );
  }
  const projects = deduplicateProjects(rawProjects);

  // 5. Normalize & Deduplicate Skills
  const rawCategories: SkillCategory[] = [];
  if (Array.isArray(manual.skills) || Array.isArray(manual.skillCategories)) {
    rawCategories.push(...((manual.skills || manual.skillCategories) as SkillCategory[]));
  }
  if (Array.isArray(resume.skills)) {
    rawCategories.push({
      id: "cat-resume",
      category: "Technical Skills",
      skills: (resume.skills as string[]).map((s) => ({
        name: s,
        proficiency: 85,
        source: "resume" as const,
      })),
    });
  }
  const skills = deduplicateSkillCategories(rawCategories);

  // 6. Normalize Education
  const rawEducation: Education[] = [];
  if (Array.isArray(manual.education)) {
    rawEducation.push(...(manual.education as Education[]));
  }
  if (Array.isArray(resume.education)) {
    const resEdu = resume.education as any[];
    rawEducation.push(
      ...resEdu.map((e, idx) => ({
        id: e.id || `edu-resume-${idx}`,
        institution: e.institution || "University",
        degree: e.degree || "Degree",
        fieldOfStudy: e.fieldOfStudy || "",
        startDate: e.startDate || "2018",
        endDate: e.endDate || "2022",
        source: "resume" as const,
      }))
    );
  }

  // 7. Social Links
  const socialsMap = new Map<string, SocialLink>();
  if (Array.isArray(manual.socials)) {
    for (const s of manual.socials as SocialLink[]) {
      if (s.url) socialsMap.set(s.platform, s);
    }
  }
  if (github.username) {
    if (!socialsMap.has("github")) {
      socialsMap.set("github", { platform: "github", url: `https://github.com/${github.username}`, label: "GitHub" });
    }
  }
  const socials = Array.from(socialsMap.values());

  const canonicalProfile: CanonicalProfile = {
    personal: {
      fullName,
      headline,
      email,
      phone,
      location,
      profileImage,
      availableForHire: manualProfile.availableForHire ?? true,
    },
    summary,
    skills,
    experience: experiences,
    education: rawEducation,
    projects,
    certifications: (manual.certifications as any[]) || [],
    achievements: (manual.achievements as any[]) || [],
    publications: (manual.publications as any[]) || [],
    services: (manual.services as any[]) || [
      {
        id: "serv-1",
        title: "Real-Time 3D & WebGL Engineering",
        description: "Custom shaders, R3F canvases, and procedural geometries.",
      },
    ],
    socials,
    sourceMetadata: {
      resume: Boolean(inputs.resumeData),
      github: Boolean(inputs.githubData),
      linkedin: Boolean(inputs.linkedinData),
      manual: Boolean(inputs.manualData),
      normalizedAt: new Date().toISOString(),
    },
  };

  const validated = CanonicalProfileSchema.parse(canonicalProfile);

  const appliedSources: string[] = [];
  if (inputs.manualData) appliedSources.push("manual");
  if (inputs.resumeData) appliedSources.push("resume");
  if (inputs.githubData) appliedSources.push("github");
  if (inputs.linkedinData) appliedSources.push("linkedin");

  return {
    canonicalProfile: validated,
    conflicts,
    appliedSources,
  };
}

export function normalizeAndDetectConflicts(
  manualData: any,
  extractedData?: any
): {
  canonicalProfile: any;
  conflicts: DataConflict[];
  changesApplied: string[];
} {
  const result = normalizeMultiSourceProfile({
    manualData,
    resumeData: extractedData,
  });

  return {
    canonicalProfile: {
      profile: result.canonicalProfile.personal,
      experiences: result.canonicalProfile.experience,
      projects: result.canonicalProfile.projects,
      skillCategories: result.canonicalProfile.skills,
      education: result.canonicalProfile.education,
      socials: result.canonicalProfile.socials,
    },
    conflicts: result.conflicts,
    changesApplied: result.appliedSources,
  };
}
