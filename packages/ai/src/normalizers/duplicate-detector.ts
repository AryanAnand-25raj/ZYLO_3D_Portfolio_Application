import { Project, SkillCategory, Experience, Education } from "../schemas/canonical-profile.schema";

export function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function deduplicateProjects(projects: Project[]): Project[] {
  const seenSlugs = new Map<string, Project>();

  for (const proj of projects) {
    const canonicalSlug = slugifyTitle(proj.title || proj.slug || "");
    if (!canonicalSlug) continue;

    if (!seenSlugs.has(canonicalSlug)) {
      seenSlugs.set(canonicalSlug, { ...proj, slug: canonicalSlug });
    } else {
      // Merge properties if duplicate exists, preserving highest fidelity
      const existing = seenSlugs.get(canonicalSlug)!;
      seenSlugs.set(canonicalSlug, {
        ...existing,
        summary: existing.summary || proj.summary,
        description: existing.description || proj.description,
        demoUrl: existing.demoUrl || proj.demoUrl,
        githubUrl: existing.githubUrl || proj.githubUrl,
        tags: Array.from(new Set([...existing.tags, ...(proj.tags || [])])),
        stats: existing.stats?.length ? existing.stats : proj.stats || [],
        featured: existing.featured || proj.featured,
      });
    }
  }

  return Array.from(seenSlugs.values());
}

export function deduplicateSkillCategories(categories: SkillCategory[]): SkillCategory[] {
  const catMap = new Map<string, SkillCategory>();

  for (const cat of categories) {
    const catKey = cat.category.toLowerCase().trim();
    if (!catMap.has(catKey)) {
      catMap.set(catKey, {
        id: cat.id || `cat-${catKey.replace(/\s+/g, "-")}`,
        category: cat.category,
        skills: [],
      });
    }

    const targetCat = catMap.get(catKey)!;
    const skillMap = new Map<string, (typeof cat.skills)[0]>();

    // Index existing
    for (const s of targetCat.skills) {
      skillMap.set(s.name.toLowerCase().trim(), s);
    }

    // Merge new skills
    for (const s of cat.skills) {
      const sKey = s.name.toLowerCase().trim();
      if (!skillMap.has(sKey)) {
        skillMap.set(sKey, s);
      } else {
        const existing = skillMap.get(sKey)!;
        // Retain max proficiency
        if (s.proficiency > existing.proficiency) {
          skillMap.set(sKey, { ...existing, proficiency: s.proficiency });
        }
      }
    }

    targetCat.skills = Array.from(skillMap.values());
  }

  return Array.from(catMap.values());
}

export function deduplicateExperiences(experiences: Experience[]): Experience[] {
  const expMap = new Map<string, Experience>();

  for (const exp of experiences) {
    const key = `${exp.company.toLowerCase().trim()}_${exp.role.toLowerCase().trim()}`;
    if (!expMap.has(key)) {
      expMap.set(key, exp);
    } else {
      const existing = expMap.get(key)!;
      expMap.set(key, {
        ...existing,
        description: existing.description || exp.description,
        highlights: Array.from(new Set([...existing.highlights, ...(exp.highlights || [])])),
        technologies: Array.from(new Set([...existing.technologies, ...(exp.technologies || [])])),
      });
    }
  }

  return Array.from(expMap.values());
}
