import { PortfolioData } from "@/schemas/portfolio.schema";
import { PortfolioVersionRecord } from "./types";
import { SCENE_PRESETS } from "@/modules/scene";
import { THEME_PRESETS } from "@/modules/design";

// In-memory store for portfolios and their version checkpoints
const portfolioStore = new Map<string, { portfolio: PortfolioData; userId: string }>();
const versionStore = new Map<string, PortfolioVersionRecord[]>();

// Initialize with a default demo portfolio so /builder/port-demo-1 is instantly playable
const demoPortfolioData: PortfolioData = {
  metadata: {
    id: "port-demo-1",
    slug: "alex-vance-3d",
    title: "Alex Vance — 3D Web Architect",
    description: "Interactive 3D WebGL portfolio featuring real-time torus knots, neon wireframe rings, and glassmorphic depth.",
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: {
      metaTitle: "Alex Vance — 3D Web Architect",
      metaDescription: "Interactive 3D WebGL portfolio",
      keywords: ["3D", "WebGL", "Portfolio"],
    },
  },
  content: {
    profile: {
      fullName: "Alex Vance",
      headline: "Senior Interactive 3D & Frontend Architect",
      bio: "Pioneering spatial web applications with real-time WebGL graphics, procedural shaders, and high-performance React architectures. Bridging spatial design with rock-solid engineering.",
      avatarUrl: "",
      location: "San Francisco, CA / Remote",
      availableForHire: true,
      badgeText: "Available for Q3/Q4 Initiatives",
    },
    socials: [
      { platform: "github", url: "https://github.com" },
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "twitter", url: "https://twitter.com" },
    ],
    experiences: [
      {
        id: "exp-1",
        company: "Dimension Studios",
        role: "Principal 3D Graphics Engineer",
        startDate: "2023",
        endDate: "Present",
        current: true,
        description: "Led the development of a real-time WebGL asset rendering engine serving 500k+ monthly active creators.",
        technologies: ["Three.js", "React Three Fiber", "WebGPU", "TypeScript"],
        highlights: [],
      },
      {
        id: "exp-2",
        company: "Nexus Labs",
        role: "Senior Full Stack Architect",
        startDate: "2021",
        endDate: "2023",
        current: false,
        description: "Designed decoupled micro-frontend pipelines and scalable 3D canvas viewports with 60 FPS performance guarantees.",
        technologies: ["Next.js", "WebGL", "GLSL", "Node.js"],
        highlights: [],
      },
    ],
    projects: [
      {
        id: "proj-1",
        title: "Hyperion Quantum Visualizer",
        slug: "hyperion-quantum",
        summary: "Real-time WebGL simulation of orbital gravity mechanics and quantum field interactions.",
        description: "Full WebGL canvas simulation with GPU compute shaders and interactive orbit camera.",
        category: "Interactive 3D",
        tags: ["Three.js", "R3F", "GLSL", "Zod"],
        demoUrl: "https://example.com/hyperion",
        githubUrl: "https://github.com/example/hyperion",
        featured: true,
        stats: [],
      },
      {
        id: "proj-2",
        title: "Synthetix Neural Engine",
        slug: "synthetix-neural",
        summary: "Procedural node-graph editor and live WebGL shader synthesizer running entirely in-browser.",
        description: "In-browser node-graph shader generator supporting glTF 2.0 PBR materials.",
        category: "Creative Tool",
        tags: ["TypeScript", "Web Audio", "WebGL", "Tailwind"],
        demoUrl: "https://example.com/synthetix",
        githubUrl: "https://github.com/example/synthetix",
        featured: true,
        stats: [],
      },
    ],
    skillCategories: [
      {
        id: "cat-1",
        category: "3D & Real-Time Graphics",
        skills: [
          { name: "Three.js", proficiency: 95 },
          { name: "React Three Fiber", proficiency: 90 },
          { name: "GLSL / Shaders", proficiency: 85 },
        ],
      },
      {
        id: "cat-2",
        category: "Frontend & Architecture",
        skills: [
          { name: "React / Next.js", proficiency: 95 },
          { name: "TypeScript", proficiency: 95 },
          { name: "Tailwind CSS", proficiency: 90 },
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
  },
  design: THEME_PRESETS["neon-cyber"] as any,
  scene: SCENE_PRESETS["cyber-dimension"] as any,
};

portfolioStore.set("port-demo-1", {
  portfolio: demoPortfolioData,
  userId: "demo-user-1",
});

versionStore.set("port-demo-1", [
  {
    id: "ver-init",
    portfolioId: "port-demo-1",
    name: "Initial AI Generation",
    reason: "Initial baseline synthesized by AI design director",
    createdAt: new Date().toISOString(),
    snapshot: demoPortfolioData,
  },
]);

export class BuilderStorageManager {
  public static getPortfolio(portfolioId: string): { portfolio: PortfolioData; userId: string } | null {
    return portfolioStore.get(portfolioId) || null;
  }

  public static savePortfolio(portfolioId: string, data: PortfolioData, userId: string): void {
    portfolioStore.set(portfolioId, { portfolio: JSON.parse(JSON.stringify(data)), userId });
  }

  public static getVersions(portfolioId: string): PortfolioVersionRecord[] {
    return versionStore.get(portfolioId) || [];
  }

  public static addVersion(portfolioId: string, name: string, reason: string, snapshot: PortfolioData): PortfolioVersionRecord {
    const versions = versionStore.get(portfolioId) || [];
    const newRecord: PortfolioVersionRecord = {
      id: `ver-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      portfolioId,
      name,
      reason,
      createdAt: new Date().toISOString(),
      snapshot: JSON.parse(JSON.stringify(snapshot)),
    };
    versions.unshift(newRecord);
    versionStore.set(portfolioId, versions);
    return newRecord;
  }

  public static restoreVersion(portfolioId: string, versionId: string, userId: string): PortfolioData | null {
    const versions = versionStore.get(portfolioId) || [];
    const record = versions.find((v) => v.id === versionId);
    if (!record) return null;

    // Non-destructive: save current as rollback before restoring
    const restoredSnapshot = JSON.parse(JSON.stringify(record.snapshot));
    this.savePortfolio(portfolioId, restoredSnapshot, userId);
    this.addVersion(
      portfolioId,
      `Restored: ${record.name}`,
      `Restored checkpoint from ${new Date(record.createdAt).toLocaleTimeString()}`,
      restoredSnapshot
    );

    return restoredSnapshot;
  }
}
