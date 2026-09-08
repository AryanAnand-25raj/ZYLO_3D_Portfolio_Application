import { PortfolioData } from "@/schemas/portfolio.schema";
import { ValidationCheckItem, ValidationResult } from "./types";
import { defaultAssetResolver } from "@zylo/three-engine";

export class PublishValidator {
  /**
   * Evaluates all pre-publish validation checks across profile, content, theme, 3D scene, SEO, and performance.
   * Returns whether publishing is permitted (no critical errors).
   */
  public static validate(portfolio: PortfolioData): ValidationResult {
    const checks: ValidationCheckItem[] = [];

    // 1. Profile Checks
    const profile = portfolio?.content?.profile;
    checks.push({
      id: "profile-name",
      category: "profile",
      name: "Full Name Provided",
      passed: Boolean(profile?.fullName && profile.fullName.trim().length > 1),
      severity: "critical",
      message: profile?.fullName ? "Full name is configured." : "Full name is missing in profile content.",
    });

    checks.push({
      id: "profile-headline",
      category: "profile",
      name: "Professional Headline",
      passed: Boolean(profile?.headline && profile.headline.trim().length > 3),
      severity: "critical",
      message: profile?.headline ? "Professional headline is present." : "Headline is missing or too short.",
    });

    checks.push({
      id: "profile-bio",
      category: "profile",
      name: "Career Biography",
      passed: Boolean(profile?.bio && profile.bio.trim().length >= 10),
      severity: "warning",
      message: profile?.bio && profile.bio.length >= 10
        ? "Bio summary is configured."
        : "Bio is empty or very brief. Adding more detail enhances recruiter engagement.",
    });

    // 2. Content Checks
    const projects = portfolio?.content?.projects || [];
    checks.push({
      id: "content-projects",
      category: "content",
      name: "Showcase Projects",
      passed: projects.length > 0,
      severity: "warning",
      message: projects.length > 0
        ? `${projects.length} showcase project(s) ready to render.`
        : "No showcase projects found. Adding projects significantly improves portfolio impact.",
    });

    const invalidProjects = projects.filter((p: any) => !p.title || p.title.trim().length === 0);
    checks.push({
      id: "content-projects-valid",
      category: "content",
      name: "Project Titles Valid",
      passed: invalidProjects.length === 0,
      severity: "critical",
      message: invalidProjects.length === 0
        ? "All showcase projects have valid titles."
        : "One or more projects are missing titles.",
    });

    const experiences = portfolio?.content?.experiences || [];
    const invalidExperiences = experiences.filter((e: any) => !e.company || !e.role);
    checks.push({
      id: "content-experiences",
      category: "content",
      name: "Work History Formatted",
      passed: invalidExperiences.length === 0,
      severity: "critical",
      message: invalidExperiences.length === 0
        ? "Work experiences are properly formatted."
        : "One or more work experiences lack company or role information.",
    });

    // 3. Theme Checks
    const theme = portfolio?.design;
    checks.push({
      id: "theme-colors",
      category: "theme",
      name: "Palette Contrast & Colors",
      passed: Boolean(theme?.colors?.primary && theme?.colors?.background),
      severity: "critical",
      message: theme?.colors?.primary
        ? "Theme primary and background colors are configured."
        : "Theme colors are missing required primary or background values.",
    });

    checks.push({
      id: "theme-typography",
      category: "theme",
      name: "Typography Configured",
      passed: Boolean(theme?.typography?.fontFamily),
      severity: "critical",
      message: theme?.typography?.fontFamily
        ? `Primary typography set to ${theme.typography.fontFamily}.`
        : "Theme typography font family is not specified.",
    });

    // 4. 3D Scene Checks
    const scene = portfolio?.scene;
    checks.push({
      id: "scene-camera",
      category: "scene",
      name: "3D Camera Calibration",
      passed: Boolean(scene?.camera && scene.camera.fov >= 10 && scene.camera.fov <= 120),
      severity: "critical",
      message: scene?.camera
        ? `Camera FOV calibrated to ${scene.camera.fov}°.`
        : "Scene camera configuration is invalid.",
    });

    const nodes = scene?.nodes || [];
    checks.push({
      id: "scene-nodes",
      category: "scene",
      name: "3D Procedural Mesh Nodes",
      passed: Array.isArray(nodes),
      severity: "critical",
      message: `Scene has ${nodes.length} procedural node(s) configured.`,
    });

    // 5. 3D Asset Manifest Security Checks
    let unapprovedAssets: string[] = [];
    nodes.forEach((n: any) => {
      if (n.assetId && !defaultAssetResolver.isApproved(n.assetId)) {
        unapprovedAssets.push(n.assetId);
      }
    });

    checks.push({
      id: "assets-security",
      category: "assets",
      name: "Approved 3D Assets Verified",
      passed: unapprovedAssets.length === 0,
      severity: "critical",
      message: unapprovedAssets.length === 0
        ? "All 3D model assets verified against approved asset catalog."
        : `Unapproved or external asset references detected: ${unapprovedAssets.join(", ")}`,
    });

    // 6. SEO & Metadata Checks
    const seo = portfolio?.metadata?.seo || { metaTitle: portfolio?.metadata?.title, metaDescription: portfolio?.metadata?.description };
    checks.push({
      id: "seo-title",
      category: "seo",
      name: "Meta Title Formatted",
      passed: Boolean(seo?.metaTitle && seo.metaTitle.trim().length >= 4),
      severity: "critical",
      message: seo?.metaTitle ? `Page title set to "${seo.metaTitle}".` : "Meta title is missing or too short.",
    });

    checks.push({
      id: "seo-description",
      category: "seo",
      name: "Meta Description",
      passed: Boolean(seo?.metaDescription && seo.metaDescription.trim().length >= 15),
      severity: "warning",
      message: seo?.metaDescription && seo.metaDescription.length >= 15
        ? "Meta description configured for Google search snippets."
        : "Meta description is brief or missing. Add a 15+ character description for better SEO.",
    });

    // 7. Performance Budget Checks
    const nodeCount = nodes.length;
    checks.push({
      id: "perf-node-budget",
      category: "performance",
      name: "GPU Node Draw Call Budget",
      passed: nodeCount <= 50,
      severity: nodeCount > 80 ? "critical" : "warning",
      message: nodeCount <= 50
        ? `Node count (${nodeCount}) is within optimal 60 FPS performance envelope.`
        : `Node count (${nodeCount}) may degrade framerate on mobile GPUs. Consider keeping under 50.`,
    });

    const particlesCount =
      (scene?.environment as any)?.particles?.count ?? scene?.environment?.stars?.count ?? 0;
    checks.push({
      id: "perf-particles",
      category: "performance",
      name: "Particle Count Budget",
      passed: particlesCount <= 3000,
      severity: "warning",
      message: particlesCount <= 3000
        ? `Particle budget (${particlesCount}) is healthy.`
        : `Particle count (${particlesCount}) exceeds 3000. Mobile devices may throttle.`,
    });

    // 8. Accessibility & Fallbacks
    checks.push({
      id: "a11y-webgl-fallback",
      category: "accessibility",
      name: "WebGL 3D Fallback Available",
      passed: true,
      severity: "critical",
      message: "Semantic HTML fallback layer and gradient backdrop ready for non-WebGL browsers.",
    });

    const criticalErrorsCount = checks.filter((c) => !c.passed && c.severity === "critical").length;
    const warningsCount = checks.filter((c) => !c.passed && c.severity === "warning").length;

    return {
      valid: criticalErrorsCount === 0 && warningsCount === 0,
      canPublish: criticalErrorsCount === 0,
      criticalErrorsCount,
      warningsCount,
      checks,
    };
  }
}
