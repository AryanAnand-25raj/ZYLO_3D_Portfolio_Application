import { ContentStylePreset } from "../schemas/portfolio-content.schema";

export interface StyleDirective {
  preset: ContentStylePreset;
  tone: string;
  headlineFormat: string;
  bodyGuidance: string;
  ctaPhasing: { primary: string; secondary: string };
  badgeSuffix: string;
}

export const STYLE_DIRECTIVES: Record<ContentStylePreset, StyleDirective> = {
  Professional: {
    preset: "Professional",
    tone: "Clean, structured, credible, and industry-standard executive clarity.",
    headlineFormat: "Architecting Scalable High-Performance Digital Products",
    bodyGuidance: "Highlight measurable outcomes, architectural responsibilities, and systematic execution.",
    ctaPhasing: { primary: "View Engineering Work", secondary: "Get in Touch" },
    badgeSuffix: "Available for High-Impact Roles",
  },
  Minimal: {
    preset: "Minimal",
    tone: "Ultra-concise, punchy, eliminating all filler words and corporate jargon.",
    headlineFormat: "Building Precision Systems.",
    bodyGuidance: "One to two dense, direct sentences outlining core domain mastery.",
    ctaPhasing: { primary: "Explore Work", secondary: "Contact" },
    badgeSuffix: "Open for Selected Engagements",
  },
  Technical: {
    preset: "Technical",
    tone: "High engineering density, architectural depth, and emphasis on performance and metrics.",
    headlineFormat: "Low-Latency Graphics & Real-Time Spatial Architectures",
    bodyGuidance: "Emphasize algorithms, shader pipelines, memory efficiency, frame rates, and distributed protocols.",
    ctaPhasing: { primary: "Inspect Repositories", secondary: "Technical Consultation" },
    badgeSuffix: "Systems & Graphics Specialist",
  },
  Creative: {
    preset: "Creative",
    tone: "Visionary, evocative storytelling, connecting code with spatial art and aesthetic wonder.",
    headlineFormat: "Crafting Dimensional Wonders & Kinetic Digital Worlds",
    bodyGuidance: "Frame engineering as a medium for memorable sensory interactions and artistic immersion.",
    ctaPhasing: { primary: "Enter Interactive Gallery", secondary: "Start a Collaboration" },
    badgeSuffix: "Creative Technologist",
  },
  Bold: {
    preset: "Bold",
    tone: "High-energy, disruptive, confident assertions of domain dominance and forward momentum.",
    headlineFormat: "Pushing the Absolute Frontier of Interactive Computing",
    bodyGuidance: "Speak directly to groundbreaking feats and transformative results.",
    ctaPhasing: { primary: "See What's Possible", secondary: "Let's Build Big" },
    badgeSuffix: "Available for Next-Gen Ventures",
  },
  Friendly: {
    preset: "Friendly",
    tone: "Approachable, warm, collaborative narrative emphasizing human connection and team growth.",
    headlineFormat: "Designing Friendly & Delightful Spatial Experiences",
    bodyGuidance: "Emphasize empathy for users, collaboration with product teams, and joyful interaction.",
    ctaPhasing: { primary: "Say Hello & View Work", secondary: "Let's Chat" },
    badgeSuffix: "Open to Friendly Conversations",
  },
  Executive: {
    preset: "Executive",
    tone: "Strategic impact, business outcomes, organizational leadership, and industry vision.",
    headlineFormat: "Directing Strategic Technology & Product Architecture",
    bodyGuidance: "Focus on organizational velocity, revenue impact, strategic roadmaps, and technical leadership.",
    ctaPhasing: { primary: "Review Strategic Portfolio", secondary: "Initiate Advisory Inquiry" },
    badgeSuffix: "Advisory & Principal Leadership",
  },
};
