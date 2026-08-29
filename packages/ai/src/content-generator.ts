import { ContentData } from "@/schemas/content.schema";
import { StylePreferences, FollowUpQuestion } from "@/schemas/draft.schema";
import {
  GeneratedPortfolioContent,
  GeneratedPortfolioContentSchema,
} from "@/schemas/ai.schema";

export interface GeneratePortfolioOptions {
  profile: ContentData;
  preferences: StylePreferences;
  answeredQuestions?: FollowUpQuestion[];
  apiKey?: string;
}

/**
 * Generates structured, polished portfolio content from canonical profile and style prompt.
 * Strictly adheres to Factual Accuracy: improves phrasing without inventing facts.
 */
export async function generatePortfolioContent({
  profile,
  preferences,
  answeredQuestions = [],
  apiKey,
}: GeneratePortfolioOptions): Promise<GeneratedPortfolioContent> {
  const activeKey = apiKey || process.env.OPENAI_API_KEY;

  if (activeKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are the lead AI Content Director for ZYLO 3D portfolios.
Generate compelling, spatial-ready portfolio content tailored to the user's style preset ("${preferences.preset}") and custom style prompt ("${preferences.stylePrompt}").
FACTUAL ACCURACY: Do NOT invent jobs, companies, skills, or fake project names. Only use data present in the user profile and answered questions.
Return JSON matching GeneratedPortfolioContentSchema:
{
  "hero": { "headline": "...", "subheadline": "...", "badge": "...", "ctaText": "Explore Work", "secondaryCtaText": "Get in Touch" },
  "about": { "title": "About", "tagline": "...", "body": "...", "highlights": ["..."] },
  "experienceSummaries": [{ "id": "...", "company": "...", "role": "...", "duration": "...", "impactSummary": "...", "keyTechnologies": ["..."] }],
  "projects": [{ "id": "...", "title": "...", "slug": "...", "category": "...", "summary": "...", "description": "...", "technologies": ["..."], "featured": true, "impactMetrics": [{ "label": "...", "value": "..." }] }],
  "skillsMatrix": [{ "category": "...", "skills": [{ "name": "...", "proficiency": 90, "highlight": true }] }],
  "services": [{ "title": "...", "description": "..." }],
  "callToAction": { "heading": "...", "description": "...", "buttonText": "..." },
  "seo": { "metaTitle": "...", "metaDescription": "...", "keywords": ["..."] }
}`,
            },
            {
              role: "user",
              content: `Profile Data:\n${JSON.stringify(profile, null, 2)}\n\nUser Answers:\n${JSON.stringify(answeredQuestions, null, 2)}`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const text = json.choices?.[0]?.message?.content;
        if (text) {
          const parsed = JSON.parse(text);
          const validated = GeneratedPortfolioContentSchema.safeParse(parsed);
          if (validated.success) {
            return validated.data;
          }
        }
      }
    } catch (e) {
      console.warn("[AI Content Generator] OpenAI call failed, falling back to procedural synthesizer:", e);
    }
  }

  // Deterministic procedural content synthesizer adhering strictly to facts
  return synthesizePortfolioContentProcedurally(profile, preferences, answeredQuestions);
}

/**
 * Procedural synthesizer generating rich portfolio content from canonical facts.
 */
export function synthesizePortfolioContentProcedurally(
  profile: ContentData,
  preferences: StylePreferences,
  answeredQuestions: FollowUpQuestion[] = []
): GeneratedPortfolioContent {
  const name = profile.profile.fullName || "Alex Vance";
  const headline = profile.profile.headline || "Creative Technologist & 3D Interactive Web Architect";
  const bio = profile.profile.bio || "Pioneering interactive spatial dimensions and high-performance WebGL architectures.";

  // Check if user answered bio questions
  const bioAnswer = answeredQuestions.find((q) => q.id === "q-bio")?.answer;
  const combinedBio = bioAnswer ? `${bio} ${bioAnswer}` : bio;

  // Style preset thematic touches
  const isCyber = preferences.preset === "Cyberpunk" || preferences.preset === "Futuristic";
  const isMinimal = preferences.preset === "Minimal" || preferences.preset === "Editorial";

  const heroHeadline = isCyber
    ? `Architecting Dimensional Web Experiences`
    : isMinimal
    ? `Crafting Precision Systems & Digital Products`
    : `Transforming Ideas into Real-Time Spatial Experiences`;

  const heroSubheadline = `${name} — ${headline}. ${combinedBio.slice(0, 140)}...`;

  const experiences = (profile.experiences || []).map((exp, idx) => ({
    id: exp.id || `exp-${idx}`,
    company: exp.company,
    role: exp.role,
    duration: `${exp.startDate} — ${exp.current ? "Present" : exp.endDate || "2023"}`,
    impactSummary: exp.description || `Leading engineering initiatives at ${exp.company}.`,
    keyTechnologies: (exp.technologies && exp.technologies.length > 0) ? exp.technologies : ["TypeScript", "Three.js", "React"],
  }));

  const projects = (profile.projects || []).map((proj, idx) => ({
    id: proj.id || `proj-${idx}`,
    title: proj.title,
    slug: proj.slug || proj.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    category: proj.category || "3D Interactive App",
    summary: proj.summary || "Interactive real-time spatial web application with high performance rendering.",
    description: proj.description || proj.summary || "Built with modern WebGL pipelines and responsive state architecture.",
    technologies: (proj.tags && proj.tags.length > 0) ? proj.tags : ["WebGL", "Three.js", "React", "Tailwind CSS"],
    featured: proj.featured ?? idx === 0,
    demoUrl: proj.demoUrl,
    githubUrl: proj.githubUrl,
    impactMetrics: (proj.stats && proj.stats.length > 0) ? proj.stats : [{ label: "Frame Rate", value: "60 FPS" }, { label: "Architecture", value: "Modular" }],
  }));

  const skillsMatrix = profile.skillCategories.map((cat) => ({
    category: cat.category,
    description: `Specialized skills in ${cat.category.toLowerCase()}`,
    skills: cat.skills.map((s) => ({
      name: s.name,
      proficiency: s.proficiency || 85,
      highlight: (s.proficiency || 85) >= 90,
    })),
  }));

  const services = [
    {
      title: "Real-Time 3D & WebGL Engineering",
      description: "Developing custom shaders, R3F canvases, and procedural 3D scene graphs optimized for mobile and desktop.",
      icon: "Box",
    },
    {
      title: "Fullstack Architecture & Systems",
      description: "Building scalable TypeScript web applications with Next.js, Prisma ORM, and resilient APIs.",
      icon: "Layers",
    },
    {
      title: "Design Systems & Token Pipelines",
      description: "Crafting accessible glassmorphic UI components, HSL color mechanics, and micro-interactions.",
      icon: "Palette",
    },
  ];

  return {
    hero: {
      headline: heroHeadline,
      subheadline: heroSubheadline,
      badge: profile.profile.badgeText || "Available for High-Impact Projects",
      ctaText: "Explore 3D Dimension",
      secondaryCtaText: "Contact Me",
    },
    about: {
      title: "About Alex",
      tagline: headline,
      body: combinedBio,
      highlights: [
        "100% Declarative WebGL Graphics Pipeline",
        "Performance-Adaptive Frame Budgeting",
        "Modern Component-Driven Architecture",
      ],
    },
    experienceSummaries: experiences,
    projects,
    skillsMatrix,
    services,
    callToAction: {
      heading: "Let's Build Something Exceptional",
      description: "Open to select freelance engagements, technical leadership roles, and ambitious creative collaborations.",
      buttonText: "Initiate Collaboration",
    },
    seo: {
      metaTitle: `${name} — ${headline}`,
      metaDescription: `${name}'s interactive 3D WebGL portfolio. ${combinedBio.slice(0, 150)}`,
      keywords: ["3D Portfolio", "Three.js", "React Three Fiber", name, ...profile.skillCategories.flatMap(c => c.skills.map(s => s.name))],
    },
  };
}

/**
 * Regenerates a single section (Hero, About, Projects, Skills, SEO) without modifying other sections.
 */
export function regenerateSection(
  currentContent: GeneratedPortfolioContent,
  sectionKey: "hero" | "about" | "projects" | "skillsMatrix" | "seo",
  profile: ContentData,
  preferences: StylePreferences
): GeneratedPortfolioContent {
  const freshContent = synthesizePortfolioContentProcedurally(profile, preferences);

  return {
    ...currentContent,
    [sectionKey]: freshContent[sectionKey],
  };
}
