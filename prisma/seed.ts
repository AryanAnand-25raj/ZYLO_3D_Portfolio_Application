import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ZYLO database foundation...");

  const user = await prisma.user.upsert({
    where: { email: "founder@zylo.design" },
    update: {},
    create: {
      email: "founder@zylo.design",
      name: "Alex Vance",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      role: "CREATOR",
      subscription: {
        create: {
          tier: "PRO",
          status: "ACTIVE",
          maxPortfolios: 5,
          customDomainEnabled: true,
          aiGenerationQuota: 50,
        },
      },
    },
  });

  const samplePortfolio = await prisma.portfolio.upsert({
    where: { slug: "alex-vance-3d" },
    update: {},
    create: {
      userId: user.id,
      slug: "alex-vance-3d",
      title: "Alex Vance — Creative Technologist & 3D Web Architect",
      description: "Interactive 3D portfolio powered by Three.js, React Three Fiber and ZYLO.",
      isPublished: true,
      content: {
        create: {
          profileHeader: {
            fullName: "Alex Vance",
            headline: "Creative Technologist & 3D Interactive Web Architect",
            bio: "Crafting dimensional web experiences bridging real-time WebGL graphics, generative design, and high-performance frontend engineering.",
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            location: "San Francisco, CA",
            availableForHire: true,
            badgeText: "Available for Q3/Q4 Projects",
          },
          socials: [
            { platform: "github", url: "https://github.com", label: "GitHub" },
            { platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
            { platform: "twitter", url: "https://twitter.com", label: "X" },
          ],
          experiences: [
            {
              id: "exp-1",
              company: "Aura Spatial",
              role: "Lead 3D Web Engineer",
              startDate: "2023",
              current: true,
              description: "Architected real-time browser WebGL renderers and spatial design tooling.",
              highlights: ["Reduced shader draw calls by 45%", "Built dynamic R3F component pipeline"],
              technologies: ["Three.js", "React Three Fiber", "TypeScript", "GLSL", "Next.js"],
            },
          ],
          projects: [
            {
              id: "proj-1",
              title: "HyperSpace Dimension",
              slug: "hyperspace-dimension",
              summary: "Interactive WebGL environment exploring procedural particle dynamics and post-processing.",
              category: "3D Graphics",
              tags: ["Three.js", "R3F", "GLSL", "Tailwind"],
              featured: true,
            },
          ],
          skillCategories: [
            {
              id: "skills-1",
              category: "3D & Graphics",
              skills: [
                { name: "Three.js", proficiency: 95 },
                { name: "React Three Fiber", proficiency: 95 },
                { name: "GLSL / Shaders", proficiency: 85 },
                { name: "Blender Pipeline", proficiency: 80 },
              ],
            },
          ],
          education: [
            {
              id: "edu-1",
              institution: "Stanford University",
              degree: "B.S. Computer Science",
              fieldOfStudy: "Computer Graphics & Human-Computer Interaction",
              startDate: "2018",
              endDate: "2022",
            },
          ],
        },
      },
      design: {
        create: {
          themeId: "theme-neon-cyber",
          themeName: "Neon Cyberpunk",
          variant: "dark",
          colors: {
            primary: "#00F0FF",
            secondary: "#9D00FF",
            accent: "#FF007A",
            background: "#05070D",
            surface: "#0D111C",
            textPrimary: "#F8FAFC",
            textMuted: "#94A3B8",
            border: "rgba(255, 255, 255, 0.08)",
            glowColor: "rgba(0, 240, 255, 0.3)",
          },
          typography: {
            fontFamily: "Inter",
            headingFontFamily: "Outfit",
            baseSize: "md",
            scaleRatio: 1.25,
          },
          glassmorphism: {
            enabled: true,
            blurIntensity: 16,
            opacity: 0.65,
            borderWidth: 1,
            reflectionGlow: true,
          },
          animations: {
            reducedMotion: false,
            transitionSpeed: "normal",
            entranceEffects: true,
            hoverSpring: true,
          },
          layout: {
            containerWidth: "wide",
            cardStyle: "glass",
            borderRadius: "lg",
          },
        },
      },
      scene: {
        create: {
          sceneId: "scene-cyber-dimension",
          sceneName: "Cyber Dimension",
          version: "1.0.0",
          cameraConfig: {
            type: "perspective",
            fov: 45,
            position: [0, 0, 8],
            target: [0, 0, 0],
            controls: {
              enabled: true,
              autoRotate: true,
              autoRotateSpeed: 0.8,
            },
          },
          lightingConfig: {
            preset: "cyberpunk",
            lights: [
              { id: "ambient-1", type: "ambient", color: "#00F0FF", intensity: 0.8 },
              { id: "point-1", type: "point", color: "#9D00FF", intensity: 4, position: [3, 3, 2] },
              { id: "point-2", type: "point", color: "#00F0FF", intensity: 4, position: [-3, -2, 2] },
            ],
          },
          envConfig: {
            preset: "night",
            background: false,
            fog: { enabled: true, color: "#05070d", near: 5, far: 20 },
            particles: { enabled: true, count: 600, color: "#00F0FF", size: 0.025, speed: 0.4 },
          },
          postProcessing: {
            bloom: { enabled: true, intensity: 1.2 },
            vignette: { enabled: true, darkness: 0.5 },
          },
          nodes: [
            {
              id: "core-node",
              componentType: "TorusKnotCore",
              position: [0, 0, 0],
              scale: [1, 1, 1],
              materialProps: {
                color: "#00F0FF",
                roughness: 0.1,
                metalness: 0.9,
                wireframe: false,
                transparent: true,
                opacity: 0.85,
              },
              animation: {
                rotateSpeed: [0.2, 0.4, 0.1],
                floatAmplitude: 0.15,
                floatSpeed: 1.2,
              },
            },
            {
              id: "neon-rings",
              componentType: "NeonRings",
              position: [0, 0, 0],
              scale: [1.6, 1.6, 1.6],
              materialProps: {
                color: "#9D00FF",
                wireframe: true,
                opacity: 0.5,
              },
              animation: {
                rotateSpeed: [-0.3, 0.1, 0.2],
              },
            },
          ],
          interactivity: {
            mouseParallax: true,
            parallaxFactor: 0.6,
            scrollDriven: true,
          },
          quality: "high",
        },
      },
    },
  });

  console.log(`✅ Seeded demo user: ${user.email} with portfolio: ${samplePortfolio.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
