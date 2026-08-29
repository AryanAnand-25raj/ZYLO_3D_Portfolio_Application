import { ContentSchema, ContentData } from "@/schemas/content.schema";

export const DEFAULT_PORTFOLIO_CONTENT: ContentData = {
  profile: {
    fullName: "Alex Vance",
    headline: "Creative Technologist & 3D Interactive Web Architect",
    bio: "Pioneering interactive web dimensions, combining spatial computing, generative visual systems, and high-performance WebGL architectures.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    location: "San Francisco, CA",
    availableForHire: true,
    badgeText: "Open to High-Impact Roles",
  },
  socials: [
    { platform: "github", url: "https://github.com", label: "GitHub" },
    { platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
    { platform: "twitter", url: "https://twitter.com", label: "X" },
  ],
  experiences: [
    {
      id: "exp-1",
      company: "Aura Spatial Systems",
      role: "Staff 3D Graphics Engineer",
      location: "San Francisco, CA",
      startDate: "2023",
      current: true,
      description: "Leading WebGL engine development for spatial collaboration suites and interactive portfolio generation.",
      highlights: [
        "Architected GPU shader pipelines reducing frame render latency by 40%",
        "Engineered procedural layout systems for 3D web environments",
      ],
      technologies: ["Three.js", "React Three Fiber", "TypeScript", "GLSL", "Next.js"],
    },
    {
      id: "exp-2",
      company: "Nexus Labs",
      role: "Senior Frontend Developer",
      location: "Remote",
      startDate: "2021",
      endDate: "2023",
      current: false,
      description: "Built reactive web applications and real-time dashboard analytics with high rendering performance.",
      highlights: ["Implemented design token system across 4 web products"],
      technologies: ["React", "TypeScript", "Tailwind CSS", "GraphQL"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "HyperSpace WebGL Dimension",
      slug: "hyperspace-dimension",
      summary: "Procedural real-time 3D universe with custom post-processing shaders and dynamic particle physics.",
      description: "An open exploration into WebGL rendering capabilities directly inside modern mobile and desktop browsers.",
      category: "3D Graphics",
      tags: ["Three.js", "R3F", "GLSL", "WebGL"],
      featured: true,
      demoUrl: "https://example.com/demo",
      githubUrl: "https://github.com/example/demo",
      stats: [{ label: "Frame Rate", value: "60 FPS" }],
    },
    {
      id: "proj-2",
      title: "Chroma Real-Time Theme Engine",
      slug: "chroma-theme-engine",
      summary: "AI-assisted design token compiler generating accessible HSL palettes and glassmorphism textures.",
      description: "Automated color theory system producing dynamic light/dark interfaces with optimal contrast ratios.",
      category: "Design System",
      tags: ["TypeScript", "Tailwind CSS", "Zod"],
      featured: true,
      demoUrl: "https://example.com/chroma",
      stats: [],
    },
  ],
  skillCategories: [
    {
      id: "skills-core",
      category: "3D & Real-Time Graphics",
      skills: [
        { name: "Three.js", proficiency: 96 },
        { name: "React Three Fiber", proficiency: 94 },
        { name: "GLSL Shaders", proficiency: 86 },
        { name: "WebGPU", proficiency: 75 },
      ],
    },
    {
      id: "skills-web",
      category: "Frontend & Architecture",
      skills: [
        { name: "TypeScript", proficiency: 98 },
        { name: "Next.js / React", proficiency: 95 },
        { name: "Tailwind CSS", proficiency: 95 },
        { name: "Node.js / Prisma", proficiency: 90 },
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Stanford University",
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Computer Graphics & Human-Computer Interaction",
      startDate: "2017",
      endDate: "2021",
    },
  ],
  customSections: [],
};

export function validateContent(content: unknown): ContentData {
  return ContentSchema.parse(content);
}
