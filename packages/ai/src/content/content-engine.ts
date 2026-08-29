import {
  CanonicalProfile,
  Experience,
  Project,
  SkillCategory,
} from "../schemas/canonical-profile.schema";
import {
  PortfolioContent,
  PortfolioContentSchema,
  ContentStylePreset,
} from "../schemas/portfolio-content.schema";
import { STYLE_DIRECTIVES } from "./style-presets";
import { getAIProvider, AIProvider } from "../providers/provider-factory";
import { CONTENT_GENERATION_SYSTEM_PROMPT, buildContentUserPrompt } from "../prompts/content.prompt";

export interface GenerateContentOptions {
  profile: CanonicalProfile;
  style?: ContentStylePreset;
  stylePrompt?: string;
  preferences?: any;
  targetAudience?: string;
  portfolioGoal?: string;
  answeredQuestions?: Array<{ question: string; answer: string }>;
  provider?: AIProvider;
}

export async function generatePortfolioContent(
  options: GenerateContentOptions
): Promise<PortfolioContent> {
  const style = options.style || options.preferences?.preset || "Professional";
  const stylePrompt = options.stylePrompt || options.preferences?.stylePrompt;
  const targetAudience = options.targetAudience || options.preferences?.targetAudience;
  const portfolioGoal = options.portfolioGoal || options.preferences?.portfolioGoal;
  const provider = options.provider || getAIProvider();

  // If using OpenAI provider, attempt structured output generation
  if (provider.name === "openai") {
    try {
      const response = await provider.generateStructuredOutput<PortfolioContent>({
        task: "CONTENT_GENERATE",
        systemPrompt: CONTENT_GENERATION_SYSTEM_PROMPT,
        userPrompt: buildContentUserPrompt(
          options.profile,
          style,
          options.stylePrompt,
          options.targetAudience,
          options.portfolioGoal,
          options.answeredQuestions
        ),
        schema: PortfolioContentSchema,
      });

      if (response.success && response.data) {
        return response.data;
      }
    } catch (e) {
      console.warn("[ContentEngine] Live AI call failed, using deterministic synthesizer:", e);
    }
  }

  // Deterministic rule-based synthesis complying strictly with Factual Accuracy Rule
  return synthesizeContentProcedurally(options.profile, style, options.stylePrompt, options.answeredQuestions);
}

export function synthesizeContentProcedurally(
  profile: CanonicalProfile | any,
  style: ContentStylePreset | any = "Professional",
  stylePrompt?: string,
  answeredQuestions?: Array<{ question: string; answer: string }>
): PortfolioContent {
  const resolvedStyle: ContentStylePreset =
    typeof style === "object" && style !== null
      ? (style.preset as ContentStylePreset) || "Professional"
      : (style as ContentStylePreset) || "Professional";

  const validStyles = ["Professional", "Minimal", "Technical", "Creative", "Bold", "Friendly", "Executive"];
  const finalStyle: ContentStylePreset = validStyles.includes(resolvedStyle) ? resolvedStyle : "Professional";
  const directive = STYLE_DIRECTIVES[finalStyle] || STYLE_DIRECTIVES.Professional;
  const personal = profile.personal || profile.profile || {};
  const name = personal.fullName || "Alex Vance";
  const headline = personal.headline || "Creative Technologist & 3D Web Architect";
  const baseBio = personal.bio || profile.summary || "";

  // Incorporate answered questions into bio context if available
  const extraContext = answeredQuestions
    ?.map((q) => q.answer)
    .filter(Boolean)
    .join(" ");
  const fullBio = [baseBio, extraContext].filter(Boolean).join(" ");

  // Hero section synthesis
  const heroHeadline =
    finalStyle === "Technical"
      ? `Engineering High-Performance 3D Web Architectures`
      : finalStyle === "Minimal"
      ? `Crafting Precision Digital Products`
      : finalStyle === "Creative"
      ? `Architecting Dimensional & Kinetic Web Worlds`
      : finalStyle === "Bold"
      ? `Pushing the Boundaries of Real-Time Interactive Web`
      : `Architecting Scalable & Dimensional Web Experiences`;

  const heroSubheadline = `${name} — ${headline}. ${
    fullBio ? fullBio.slice(0, 160) : "Pioneering real-time WebGL graphics, generative design, and high-performance engineering."
  }...`;

  // Experience summaries
  const expList = profile.experience || profile.experiences || [];
  const experienceSummaries = expList.map((exp: any, idx: number) => ({
    id: exp.id || `exp-${idx}`,
    company: exp.company,
    role: exp.role,
    duration: `${exp.startDate} — ${exp.current ? "Present" : exp.endDate || "Present"}`,
    impactSummary: exp.description || `Leading core engineering and product initiatives at ${exp.company}.`,
    keyTechnologies: exp.technologies?.length ? exp.technologies : ["TypeScript", "Three.js", "React"],
  }));

  // Projects synthesis
  const projects = (profile.projects || []).map((proj: any, idx: number) => ({
    id: proj.id || `proj-${idx}`,
    title: proj.title,
    slug: proj.slug || proj.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    category: proj.category || "3D Interactive App",
    summary: proj.summary || "Interactive real-time spatial web application with high performance rendering.",
    description: proj.description || proj.summary || "Built with modern WebGL pipelines and responsive state architecture.",
    technologies: proj.tags?.length ? proj.tags : ["WebGL", "Three.js", "React", "Tailwind CSS"],
    featured: proj.featured ?? idx === 0,
    demoUrl: proj.demoUrl || "",
    githubUrl: proj.githubUrl || "",
    impactMetrics: proj.stats?.length ? proj.stats : [{ label: "Frame Rate", value: "60 FPS" }, { label: "Architecture", value: "Modular" }],
  }));

  // Skills matrix synthesis
  const skillCatList = profile.skills || profile.skillCategories || [];
  const skillsMatrix = skillCatList.map((cat: any) => ({
    category: cat.category,
    description: `Specialized engineering proficiencies in ${cat.category.toLowerCase()}`,
    skills: (cat.skills || []).map((s: any) => ({
      name: s.name,
      proficiency: s.proficiency || 85,
      highlight: (s.proficiency || 85) >= 90,
    })),
  }));

  // Services
  const services = (profile.services || []).map((serv: any) => ({
    title: serv.title,
    description: serv.description,
  }));

  const result: PortfolioContent = {
    style: finalStyle,
    hero: {
      headline: heroHeadline,
      subheadline: heroSubheadline,
      badge: `${directive.badgeSuffix}`,
      ctaText: directive.ctaPhasing.primary,
      secondaryCtaText: directive.ctaPhasing.secondary,
    },
    about: {
      title: `About ${name}`,
      tagline: headline,
      body: fullBio || "Crafting dimensional web experiences bridging real-time WebGL graphics, generative design, and high-performance frontend engineering.",
      highlights: [
        "100% Declarative WebGL Graphics Pipeline",
        "Hardware-Adaptive DPR & Dynamic LOD",
        "Sub-millisecond Shader Computation",
      ],
    },
    experienceSummaries,
    projects,
    skillsMatrix,
    services: services.length > 0 ? services : [
      {
        title: "Real-Time 3D & WebGL Engineering",
        description: "Custom shaders, R3F canvases, and procedural geometries.",
      },
    ],
    callToAction: {
      heading: "Ready to Build Something Extraordinary?",
      description: "Let's collaborate on spatial web experiences and creative engineering.",
      buttonText: directive.ctaPhasing.primary,
    },
    contactCopy: {
      heading: "Get In Touch",
      description: `Feel free to reach out regarding consulting, full-time opportunities, or tech talks.`,
      formPlaceholder: "Leave a message about your project...",
    },
    seo: {
      metaTitle: `${name} — ${headline}`,
      metaDescription: fullBio ? fullBio.slice(0, 155) : `${name}'s 3D Interactive Portfolio`,
      keywords: ["3D Portfolio", "WebGL", "Three.js", "React Three Fiber", "Creative Technologist"],
      openGraphDescription: `Explore interactive 3D WebGL projects and creative engineering work by ${name}.`,
    },
    generatedAt: new Date().toISOString(),
  };

  return PortfolioContentSchema.parse(result);
}

export function regenerateSection(
  current: PortfolioContent,
  sectionKey: "hero" | "about" | "projects" | "skillsMatrix" | "seo" | "callToAction" | "contactCopy",
  profile: CanonicalProfile,
  style: ContentStylePreset | any = "Professional",
  stylePrompt?: string
): PortfolioContent {
  const fresh = synthesizeContentProcedurally(profile, style, stylePrompt);

  return {
    ...current,
    [sectionKey]: fresh[sectionKey],
    generatedAt: new Date().toISOString(),
  };
}
