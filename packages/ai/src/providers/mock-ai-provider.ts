import { AIProvider, AIRequest, AIResponse, TokenUsage } from "./ai-provider.interface";

export class MockAIProvider implements AIProvider {
  public readonly name = "mock";

  public async generateStructuredOutput<T>(request: AIRequest): Promise<AIResponse<T>> {
    const startTime = Date.now();

    // Generate deterministic mock output based on task
    let resultData: unknown = null;

    if (request.task === "PROFILE_NORMALIZE") {
      resultData = {
        personal: {
          fullName: "Alex Vance",
          headline: "Staff 3D Web Graphics Engineer & Creative Technologist",
          email: "alex@zylo.design",
          phone: "(555) 019-2834",
          location: "San Francisco, CA",
          profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
          availableForHire: true,
        },
        summary: "Pioneering interactive spatial dimensions and real-time WebGL graphics.",
        skills: [
          {
            id: "cat-3d",
            category: "3D & Real-Time Graphics",
            skills: [
              { name: "Three.js", proficiency: 95, source: "manual" },
              { name: "React Three Fiber", proficiency: 90, source: "manual" },
              { name: "GLSL / Shaders", proficiency: 85, source: "manual" },
              { name: "WebGL", proficiency: 85, source: "manual" },
            ],
          },
        ],
        experience: [
          {
            id: "exp-1",
            company: "Aura Spatial",
            role: "Lead 3D Web Engineer",
            location: "San Francisco, CA",
            startDate: "2023",
            endDate: "Present",
            current: true,
            description: "Architected WebGL spatial canvas pipelines reducing shader latency by 45%.",
            highlights: ["Engineered procedural rendering engine", "Optimized WebGL memory allocation"],
            technologies: ["Three.js", "R3F", "TypeScript"],
            source: "manual",
          },
        ],
        education: [
          {
            id: "edu-1",
            institution: "Stanford University",
            degree: "B.S. in Computer Science",
            fieldOfStudy: "Computer Graphics & HCI",
            startDate: "2017",
            endDate: "2021",
            source: "manual",
          },
        ],
        projects: [
          {
            id: "proj-1",
            title: "HyperSpace WebGL Dimension",
            slug: "hyperspace-dimension",
            summary: "Procedural real-time 3D universe with custom post-processing shaders.",
            description: "Built with modern WebGL pipelines and responsive state architecture.",
            category: "3D Graphics",
            tags: ["Three.js", "R3F", "GLSL", "WebGL"],
            featured: true,
            demoUrl: "https://example.com/demo",
            githubUrl: "https://github.com/alexvance/hyperspace",
            stats: [{ label: "Frame Rate", value: "60 FPS" }],
            source: "manual",
          },
        ],
        certifications: [],
        achievements: [],
        publications: [],
        services: [
          {
            id: "serv-1",
            title: "Real-Time 3D & WebGL Engineering",
            description: "Custom shaders, R3F canvases, and procedural geometries.",
          },
        ],
        socials: [
          { platform: "github", url: "https://github.com/alexvance" },
          { platform: "linkedin", url: "https://linkedin.com/in/alexvance" },
        ],
        sourceMetadata: {
          resume: true,
          github: false,
          linkedin: false,
          manual: true,
          normalizedAt: new Date().toISOString(),
        },
      };
    } else if (request.task === "CONTENT_GENERATE" || request.task === "SECTION_REGENERATE") {
      resultData = {
        style: "Professional",
        hero: {
          headline: "Architecting Dimensional Web Experiences",
          subheadline: "Alex Vance — Staff 3D Web Graphics Engineer. Pioneering interactive spatial computing and real-time graphics pipelines.",
          badge: "Available for High-Impact Projects",
          ctaText: "Explore 3D Work",
          secondaryCtaText: "Get in Touch",
        },
        about: {
          title: "About Alex Vance",
          tagline: "Bridging real-time WebGL graphics, generative design, and high-performance engineering.",
          body: "Over 6 years of experience engineering spatial web interfaces, custom GLSL shaders, and hardware-accelerated interactive applications.",
          highlights: [
            "100% Declarative WebGL Graphics Pipeline",
            "Hardware-Adaptive DPR & Dynamic LOD",
            "Sub-millisecond Shader Computation",
          ],
        },
        experienceSummaries: [
          {
            id: "exp-1",
            company: "Aura Spatial",
            role: "Lead 3D Web Engineer",
            duration: "2023 — Present",
            impactSummary: "Architected WebGL spatial canvas pipelines reducing shader latency by 45%.",
            keyTechnologies: ["Three.js", "R3F", "TypeScript"],
          },
        ],
        projects: [
          {
            id: "proj-1",
            title: "HyperSpace WebGL Dimension",
            slug: "hyperspace-dimension",
            category: "3D Graphics",
            summary: "Procedural real-time 3D universe with custom post-processing shaders.",
            description: "Built with modern WebGL pipelines and responsive state architecture.",
            technologies: ["Three.js", "R3F", "GLSL", "WebGL"],
            featured: true,
            demoUrl: "https://example.com/demo",
            githubUrl: "https://github.com/alexvance/hyperspace",
            impactMetrics: [{ label: "Frame Rate", value: "60 FPS" }],
          },
        ],
        skillsMatrix: [
          {
            category: "3D & Real-Time Graphics",
            description: "Core WebGL and shader proficiencies",
            skills: [
              { name: "Three.js", proficiency: 95, highlight: true },
              { name: "React Three Fiber", proficiency: 90, highlight: true },
              { name: "GLSL / Shaders", proficiency: 85, highlight: false },
            ],
          },
        ],
        services: [
          {
            title: "Real-Time 3D & WebGL Engineering",
            description: "Custom shaders, R3F canvases, and procedural geometries.",
          },
        ],
        callToAction: {
          heading: "Ready to Build Something Extraordinary?",
          description: "Let's collaborate on spatial web experiences and creative engineering.",
          buttonText: "Initiate Collaboration",
        },
        contactCopy: {
          heading: "Get In Touch",
          description: "Feel free to reach out regarding consulting, full-time opportunities, or tech talks.",
          formPlaceholder: "Leave a message about your project...",
        },
        seo: {
          metaTitle: "Alex Vance — Staff 3D Web Graphics Engineer Portfolio",
          metaDescription: "Interactive 3D portfolio of Alex Vance featuring WebGL architectures, procedural systems, and spatial computing.",
          keywords: ["3D Portfolio", "WebGL", "Three.js", "React Three Fiber", "Creative Developer"],
          openGraphDescription: "Explore interactive 3D WebGL projects and creative engineering work by Alex Vance.",
        },
        generatedAt: new Date().toISOString(),
      };
    } else if (request.task === "COMPLETENESS_ANALYZE") {
      resultData = {
        score: 88,
        categoryScores: [
          { category: "Profile", score: 95, weight: 0.2, status: "complete" },
          { category: "Experience", score: 90, weight: 0.2, status: "complete" },
          { category: "Projects", score: 85, weight: 0.25, status: "complete" },
          { category: "Skills", score: 90, weight: 0.15, status: "complete" },
          { category: "Education", score: 80, weight: 0.1, status: "adequate" },
          { category: "Socials", score: 85, weight: 0.1, status: "complete" },
        ],
        requiredMissing: [],
        recommendedMissing: [
          {
            field: "projectLinks",
            section: "Projects",
            reason: "Adding live preview URLs significantly increases recruiter engagement.",
            type: "recommended",
          },
        ],
        recommendations: [
          "Profile is rich and ready for high-fidelity 3D generation.",
          "Consider adding live demo links to featured projects.",
        ],
        questions: [
          {
            id: "q-1",
            section: "Projects",
            field: "projectHighlight",
            question: "What was your most proud architectural challenge solved in your featured project?",
            type: "recommended",
            answer: "",
            skipped: false,
          },
        ],
        analyzedAt: new Date().toISOString(),
      };
    } else if (request.task === "FOLLOW_UP_GENERATE") {
      resultData = {
        questions: [
          {
            id: "q-1",
            section: "Projects",
            field: "featuredMetric",
            question: "What measurable performance metric (e.g. 60 FPS, 45% load reduction) best represents your work?",
            type: "recommended",
            answer: "",
            skipped: false,
          },
          {
            id: "q-2",
            section: "Hero",
            field: "elevatorPitch",
            question: "What specific domain or role are you targeting for your next high-impact project?",
            type: "optional",
            answer: "",
            skipped: false,
          },
        ],
      };
    } else if (request.task === "RESUME_EXTRACT") {
      resultData = {
        profile: {
          fullName: "Alex Vance",
          headline: "Staff 3D Web Graphics Engineer",
          email: "alex@zylo.design",
          phone: "(555) 019-2834",
          location: "San Francisco, CA",
        },
        experiences: [
          {
            company: "Aura Spatial",
            role: "Lead 3D Web Engineer",
            startDate: "2023",
            endDate: "Present",
            current: true,
            description: "Architected WebGL spatial canvas pipelines reducing shader latency by 45%.",
            highlights: ["Spearheaded real-time systems", "Optimized render pipeline latency"],
            technologies: ["TypeScript", "Next.js", "Three.js"],
          },
        ],
        education: [
          {
            institution: "Stanford University",
            degree: "B.S. in Computer Science",
            fieldOfStudy: "Computer Graphics & HCI",
            startDate: "2017",
            endDate: "2021",
          },
        ],
        skills: ["Three.js", "React", "TypeScript", "WebGL", "GLSL", "Next.js", "Node.js", "Tailwind CSS"],
        projects: [
          {
            title: "HyperSpace WebGL Dimension",
            summary: "Procedural real-time 3D universe with custom post-processing shaders.",
            technologies: ["Three.js", "R3F", "GLSL"],
          },
        ],
        socials: [
          { platform: "github", url: "https://github.com/alexvance" },
          { platform: "linkedin", url: "https://linkedin.com/in/alexvance" },
        ],
      };
    }

    // Validate with provided schema if present
    if (request.schema && resultData) {
      const parsed = request.schema.safeParse(resultData);
      if (!parsed.success) {
        throw new Error(`MockAIProvider output schema validation failed: ${parsed.error.message}`);
      }
      resultData = parsed.data;
    }

    const latencyMs = Date.now() - startTime;
    const usage: TokenUsage = {
      promptTokens: 250,
      completionTokens: 450,
      totalTokens: 700,
      estimatedCostUsd: 0.0015,
    };

    return {
      success: true,
      data: resultData as T,
      rawText: JSON.stringify(resultData, null, 2),
      usage,
      model: "mock-model-v1",
      provider: this.name,
      latencyMs,
    };
  }

  public estimateCost(promptTokens: number, completionTokens: number): number {
    return (promptTokens * 0.0015 + completionTokens * 0.002) / 1000;
  }
}
