"use client";

import React, { useMemo, useState } from "react";
import { SceneRenderer, SceneConfig } from "@zylo/three-engine";
import { resolveTemplateWithFallback, TemplateDefinition } from "@zylo/templates";
import {
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  Code2,
  Send,
  Eye,
  ArrowUpRight,
  RotateCw,
  Zap,
  Activity,
  Compass,
  Shield,
  Flame,
  Swords,
} from "lucide-react";

/**
 * Interactive 3D Perspective Tilt Card
 * Computes real-time X/Y rotational perspective on pointer hover
 */
const TiltCard3D: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = "", style = {} }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(6px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export interface PortfolioRendererProps {
  template: string;
  profile?: {
    fullName?: string;
    headline?: string;
    bio?: string;
    avatarUrl?: string;
    location?: string;
    availableForHire?: boolean;
    badgeText?: string;
  };
  content?: {
    profile?: any;
    socials?: Array<{ platform: string; url: string; label?: string }>;
    experiences?: Array<{
      id: string;
      company: string;
      role: string;
      location?: string;
      startDate: string;
      endDate?: string;
      current?: boolean;
      description?: string;
      technologies?: string[];
    }>;
    projects?: Array<{
      id: string;
      title: string;
      slug?: string;
      summary: string;
      description?: string;
      category?: string;
      tags?: string[];
      imageUrl?: string;
      demoUrl?: string;
      githubUrl?: string;
      featured?: boolean;
      stats?: Array<{ label: string; value: string }>;
    }>;
    skillCategories?: Array<{
      id: string;
      category: string;
      skills: Array<{ name: string; proficiency?: number }>;
    }>;
    education?: Array<{
      id: string;
      institution: string;
      degree: string;
      fieldOfStudy?: string;
      startDate: string;
      endDate?: string;
    }>;
  };
  theme?: Record<string, any>;
  scene?: SceneConfig;
  interactive?: boolean;
  enable3D?: boolean;
  className?: string;
}

export const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({
  template: templateId,
  profile,
  content,
  theme: userTheme,
  scene: userScene,
  interactive = true,
  enable3D = true,
  className = "",
}) => {
  // Resolve template definition from registry (with safe fallback)
  const template: TemplateDefinition = useMemo(
    () => resolveTemplateWithFallback(templateId),
    [templateId]
  );

  // Merge active theme and scene
  const activeTheme = userTheme || template.defaultTheme;
  const activeScene: SceneConfig = userScene || template.defaultScene;

  // Normalized profile & content fallbacks
  const safeProfile = profile || content?.profile || {
    fullName: "Alex Vance",
    headline: "Senior Interactive 3D & Frontend Architect",
    bio: "Pioneering the spatial web with WebGL, real-time procedural shaders, and high-performance React architectures. Bridging spatial design with rock-solid software engineering.",
    location: "San Francisco, CA / Remote",
    availableForHire: true,
    badgeText: "Available for Q3/Q4 Initiatives",
  };

  const safeExperiences = content?.experiences || [
    {
      id: "exp-1",
      company: "Dimension Studios",
      role: "Principal 3D Graphics Engineer",
      startDate: "2023",
      endDate: "Present",
      current: true,
      description: "Led the development of a real-time WebGL asset rendering engine serving 500k+ monthly active creators.",
      technologies: ["Three.js", "React Three Fiber", "WebGPU", "TypeScript"],
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
    },
  ];

  const safeProjects = content?.projects || [
    {
      id: "proj-1",
      title: "Hyperion Quantum Visualizer",
      summary: "Real-time WebGL simulation of orbital gravity mechanics and quantum field interactions.",
      category: "Interactive 3D",
      tags: ["Three.js", "R3F", "GLSL Shaders", "Zod"],
      demoUrl: "https://example.com/hyperion",
      githubUrl: "https://github.com/example/hyperion",
      featured: true,
    },
    {
      id: "proj-2",
      title: "Synthetix Neural Engine",
      summary: "Procedural node-graph editor and live WebGL shader synthesizer running entirely in-browser.",
      category: "Creative Tool",
      tags: ["TypeScript", "Web Audio", "WebGL", "Tailwind"],
      demoUrl: "https://example.com/synthetix",
      githubUrl: "https://github.com/example/synthetix",
      featured: true,
    },
    {
      id: "proj-3",
      title: "Aura Glassmorphism UI Kit",
      summary: "Declarative token-driven design system with optical refraction and accessible contrast layers.",
      category: "Design System",
      tags: ["CSS Tokens", "React", "Accessibility", "A11y"],
      demoUrl: "https://example.com/aura",
      githubUrl: "https://github.com/example/aura",
      featured: false,
    },
  ];

  const safeSkillCategories = content?.skillCategories || [
    {
      id: "cat-1",
      category: "3D & Real-Time Graphics",
      skills: [
        { name: "Three.js", proficiency: 95 },
        { name: "React Three Fiber", proficiency: 90 },
        { name: "GLSL / Shaders", proficiency: 85 },
        { name: "WebGL / WebGPU", proficiency: 80 },
      ],
    },
    {
      id: "cat-2",
      category: "Frontend & Architecture",
      skills: [
        { name: "React / Next.js", proficiency: 95 },
        { name: "TypeScript", proficiency: 95 },
        { name: "Tailwind CSS", proficiency: 90 },
        { name: "Zod / Schema Validation", proficiency: 90 },
      ],
    },
  ];

  // Dynamic style tokens based on template & theme
  const primaryColor = activeTheme.colors?.primary || "#00F0FF";
  const secondaryColor = activeTheme.colors?.secondary || "#9D00FF";
  const accentColor = activeTheme.colors?.accent || "#00FF66";
  const bgColor = activeTheme.colors?.background || "#05070D";
  const surfaceColor = activeTheme.colors?.surface || "#0E1528";
  const textPrimary = activeTheme.colors?.textPrimary || "#FFFFFF";
  const textMuted = activeTheme.colors?.textMuted || "#94A3B8";
  const borderColor = activeTheme.colors?.border || "rgba(255, 255, 255, 0.1)";

  // Interactive 3D controls state
  const [autoRotate3D, setAutoRotate3D] = useState<boolean>(true);

  // Template-specific styling quirks & domain family detection
  const tplId = (template.id || "").toLowerCase();
  const tplCat = ((template as any).category || "");
  const isAnime = tplId.includes("anime") || tplCat === "Anime & Character";
  const isArchitecture = tplId.includes("arch") || tplCat === "Architecture & Engineering";
  const isAutomotive = tplId.includes("auto") || tplCat === "Automotive & Mechanical";
  const isGaming = tplId.includes("game") || tplCat === "Gaming & Interactive";
  const isCorporate = tplId.includes("corp") || (tplCat === "Minimal & Professional" && tplId.includes("monolith"));
  const isMinimal = tplId === "minimal";
  const isGlass = tplId.includes("glass");
  const isCreative = tplId.includes("creative");
  const isOrbit = tplId.includes("orbit") || tplCat === "Aerospace & Science";
  const isNeural = tplId.includes("neural") || tplId.includes("ai");

  const cardBackdropClass = isAnime
    ? "bg-[#110D20]/90 backdrop-blur-xl border-2 border-[#FF2A85]/40 shadow-[0_0_30px_rgba(255,42,133,0.25)] rounded-2xl"
    : isArchitecture
    ? "bg-[#070E1C]/95 backdrop-blur-md border border-[#38BDF8]/35 shadow-[0_0_25px_rgba(56,189,248,0.15)] rounded-xl font-mono"
    : isAutomotive
    ? "bg-[#0D0E14]/95 border-l-4 border-l-[#EF4444] border-t border-r border-b border-white/10 shadow-[0_0_25px_rgba(239,68,68,0.15)] rounded-xl"
    : isGaming
    ? "bg-[#0B111D]/90 backdrop-blur-xl border border-[#10B981]/40 shadow-[0_0_30px_rgba(16,185,129,0.25)] rounded-2xl"
    : isCorporate
    ? "bg-[#090C16]/95 border border-[#D4AF37]/30 shadow-[0_0_25px_rgba(212,175,55,0.12)] rounded-lg"
    : isGlass
    ? "bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] shadow-2xl rounded-2xl"
    : isMinimal
    ? "bg-[#111622] border border-white/[0.08] rounded-xl"
    : isCreative
    ? "bg-[#170E1F] border border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.15)] rounded-2xl"
    : isOrbit
    ? "bg-[#080E1E] border border-sky-400/25 shadow-[0_0_30px_rgba(56,189,248,0.12)] rounded-2xl"
    : "bg-[#0A0F20] border border-cyan-400/25 shadow-[0_0_30px_rgba(0,240,255,0.12)] rounded-2xl";

  return (
    <div
      className={`relative min-h-screen text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* 3D Scene Layer (Decoupled behind semantic HTML) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {enable3D ? (
          <div className="w-full h-full pointer-events-auto">
            <SceneRenderer
              sceneConfig={activeScene}
              interactive={interactive}
              autoRotate={autoRotate3D}
              className="w-full h-full"
            />
          </div>
        ) : (
          /* Accessible Static Fallback Backdrop */
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${secondaryColor}25 0%, transparent 60%), radial-gradient(circle at 80% 80%, ${primaryColor}20 0%, transparent 50%), ${bgColor}`,
            }}
          />
        )}
      </div>

      {/* Screen Reader Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-cyan-600 text-white rounded-md font-medium"
      >
        Skip to main content
      </a>

      {/* Accessible Navigation Header */}
      <header className="relative z-20 w-full px-6 py-6 border-b border-white/[0.08] backdrop-blur-md bg-black/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: primaryColor }}
              aria-hidden="true"
            />
            <span className="font-mono text-sm tracking-wider font-semibold uppercase text-white">
              {safeProfile.fullName}
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono border border-white/10 text-slate-400">
              {template.name} • {template.templateVersion}
            </span>
          </div>

          <nav aria-label="Portfolio sections" className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
            <a href="#about" className="hover:text-white transition-colors">
              {isAnime ? "「概要」 About" : "About"}
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              {isAnime ? "「作品」 Projects" : "Projects"}
            </a>
            <a href="#experience" className="hover:text-white transition-colors">
              {isAnime ? "「経歴」 Experience" : "Experience"}
            </a>
            <a href="#skills" className="hover:text-white transition-colors">
              {isAnime ? "「技術」 Skills" : "Skills"}
            </a>
            <a
              href="#contact"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-transform hover:scale-105"
              style={{ backgroundColor: primaryColor, color: isMinimal ? "#000" : "#05070D" }}
            >
              {isAnime ? "「通信」 Connect" : "Get in Touch"}
            </a>
          </nav>
        </div>
      </header>

      {/* Main Semantic Content Container */}
      <main id="main-content" className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-28">
        {/* HERO SECTION */}
        <section id="hero" aria-labelledby="hero-title" className="min-h-[70vh] flex flex-col justify-center items-start">
          <div className="max-w-2xl space-y-6">
            {safeProfile.availableForHire && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border"
                style={{ borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: primaryColor }} />
                <span>{isAnime ? `「出撃可能」 ${safeProfile.badgeText}` : safeProfile.badgeText}</span>
              </div>
            )}

            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              {safeProfile.fullName}
            </h1>

            <p className="text-xl sm:text-2xl font-medium" style={{ color: primaryColor }}>
              {safeProfile.headline}
            </p>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {safeProfile.bio}
            </p>

            {/* Anime Character Status HUD */}
            {isAnime && (
              <div className="p-4 rounded-xl bg-black/60 border-2 border-[#FF2A85]/40 shadow-[0_0_20px_rgba(255,42,133,0.3)] backdrop-blur-md space-y-2.5 font-mono text-xs w-full max-w-md">
                <div className="flex items-center justify-between text-[#FF2A85] font-bold">
                  <span className="flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5" />
                    <span>「覚醒」 CHARACTER STATUS</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FF2A85]/20 text-[#FF2A85] border border-[#FF2A85]/40 text-[10px]">
                    Lv.99 SPECIAL GRADE
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[9px] block uppercase">Class</span>
                    <span className="text-[#00F0FF] font-semibold">Spatial Architect</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block uppercase">Power Level</span>
                    <span className="text-[#FFE600] font-semibold">9,999+ CP</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block uppercase">Realm</span>
                    <span className="text-emerald-400 font-semibold">Neo-Tokyo</span>
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>MANA ENERGY POOL</span>
                    <span className="text-[#FF2A85]">100% / MAX</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF2A85] via-[#00F0FF] to-[#FFE600] rounded-full animate-pulse" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
            )}

            {/* CAD Blueprint Stamp for Architecture */}
            {isArchitecture && (
              <div className="p-3 rounded-lg bg-[#070E1C]/80 border border-[#38BDF8]/30 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="text-[#38BDF8] font-bold">📐 CAD SPECIFICATION SHEET</div>
                <div className="flex gap-4 text-[10px]">
                  <span>SCALE: 1:50</span>
                  <span>ELEVATION: +48.0m</span>
                  <span>STATUS: STRUCTURALLY CERTIFIED</span>
                </div>
              </div>
            )}

            {/* Automotive Racing Telemetry */}
            {isAutomotive && (
              <div className="p-3 rounded-lg bg-[#0E0E14]/80 border-l-4 border-l-[#EF4444] border border-white/10 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#EF4444] animate-pulse" />
                  <span>AERO TELEMETRY ACTIVE</span>
                </div>
                <span className="text-[#EF4444] font-bold">DOWNFORCE: 850 KG</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 shadow-lg"
                style={{ backgroundColor: primaryColor, color: isMinimal ? "#000" : "#05070D" }}
              >
                <span>{isAnime ? "「作品を見る」 View Projects" : "View Portfolio Projects"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-white/20 hover:bg-white/5 transition-colors text-white"
              >
                <Mail className="w-4 h-4" />
                <span>{isAnime ? "「連絡」 Send Signal" : `Contact ${safeProfile.fullName.split(" ")[0]}`}</span>
              </a>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" aria-labelledby="projects-title" className="space-y-8">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {isAnime ? "「主要実績」 Featured Works" : "Featured Work"}
              </p>
              <h2 id="projects-title" className="text-3xl font-bold text-white tracking-tight">
                {isAnime
                  ? "Featured 3D & Anime Projects"
                  : isArchitecture
                  ? "Architectural Blueprints & CAD"
                  : isAutomotive
                  ? "Automotive & Mechanical Projects"
                  : "Architectural Projects"}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {safeProjects.length} Verified Deployments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeProjects.map((project) => (
              <TiltCard3D key={project.id} className="h-full">
                <article
                  className={`p-6 rounded-xl flex flex-col justify-between h-full transition-all hover:-translate-y-1 ${cardBackdropClass}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono px-2.5 py-0.5 rounded"
                        style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                      >
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-white/[0.08] mt-6">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold flex items-center gap-1 text-white hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold flex items-center gap-1 text-slate-400 hover:text-white hover:underline"
                      >
                        <Github className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                  </div>
                </article>
              </TiltCard3D>
            ))}
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" aria-labelledby="experience-title" className="space-y-8">
          <div className="border-b border-white/10 pb-4">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
              {isAnime ? "「冒険の軌跡」 Quest Trajectory" : "Career Trajectory"}
            </p>
            <h2 id="experience-title" className="text-3xl font-bold text-white tracking-tight">
              {isAnime ? "Character Work Experience" : "Work Experience"}
            </h2>
          </div>

          <div className="space-y-6">
            {safeExperiences.map((exp) => (
              <TiltCard3D key={exp.id}>
                <div className={`p-6 sm:p-8 rounded-xl ${cardBackdropClass}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      <p className="text-sm font-medium" style={{ color: primaryColor }}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {exp.startDate} — {exp.endDate || (exp.current ? "Present" : "")}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">{exp.description}</p>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2.5 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </TiltCard3D>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" aria-labelledby="skills-title" className="space-y-8">
          <div className="border-b border-white/10 pb-4">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
              {isAnime ? "「能力値」 Status Points" : "Technical Competencies"}
            </p>
            <h2 id="skills-title" className="text-3xl font-bold text-white tracking-tight">
              Skills & Proficiencies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeSkillCategories.map((cat) => (
              <TiltCard3D key={cat.id}>
                <div className={`p-6 rounded-xl ${cardBackdropClass}`}>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4" style={{ color: primaryColor }} />
                    {cat.category}
                  </h3>

                  <div className="space-y-3">
                    {cat.skills.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-200">{skill.name}</span>
                          {skill.proficiency && (
                            <span className="text-slate-400">{skill.proficiency}%</span>
                          )}
                        </div>
                        {skill.proficiency && (
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${skill.proficiency}%`,
                                backgroundColor: primaryColor,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard3D>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" aria-labelledby="contact-title" className={`p-8 sm:p-12 rounded-2xl ${cardBackdropClass}`}>
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: primaryColor }}>
              {isAnime ? "「通信」 Transmission" : "Connect & Collaborate"}
            </p>
            <h2 id="contact-title" className="text-3xl font-bold text-white tracking-tight">
              {isAnime ? "Initiate Transmission" : "Let's Build Something Spatial"}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Interested in real-time WebGL experiences, 3D graphics consulting, or senior architectural roles? Reach out directly.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="mailto:contact@example.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: primaryColor, color: isMinimal ? "#000" : "#05070D" }}
              >
                <Send className="w-4 h-4" />
                <span>{isAnime ? "「通信送信」 Send Query" : "Send Email Inquiry"}</span>
              </a>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 ml-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{safeProfile.location}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Interactive 3D WebGL Controls HUD */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#0A0E1A]/90 backdrop-blur-xl border border-white/15 px-3.5 py-2 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-2 pr-2 border-r border-white/10 font-mono text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="hidden sm:inline">WebGL 3D</span>
          <span className="text-xs text-emerald-400 font-semibold">60 FPS</span>
        </div>
        <button
          onClick={() => setAutoRotate3D(!autoRotate3D)}
          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
            autoRotate3D
              ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
          title="Toggle 3D Auto-Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate3D ? "animate-spin" : ""}`} style={{ animationDuration: "8s" }} />
          <span className="text-[10px] hidden md:inline">{autoRotate3D ? "Orbit: ON" : "Orbit: OFF"}</span>
        </button>
        <span className="text-[10px] font-mono text-slate-400 px-1 hidden lg:inline">
          Drag to Orbit 3D
        </span>
      </div>

      {/* Accessible Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] py-8 px-6 text-center text-xs font-mono text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {safeProfile.fullName}. Rendered via ZYLO 3D Engine.</p>
          <div className="flex items-center gap-4">
            <span>Template: {template.name} ({template.templateVersion})</span>
            <span>•</span>
            <span className="capitalize">{template.performance.tier} Performance Tier</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
