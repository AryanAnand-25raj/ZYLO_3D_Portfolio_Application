import { PlanDefinition, PlanCode, Currency } from "./types";

export const PLANS: Record<PlanCode, PlanDefinition> = {
  STARTER: {
    id: "plan_starter",
    code: "STARTER",
    name: "Starter Dimension",
    tagline: "Ideal for aspiring developers & designers launching their first 3D portfolio.",
    description: "Full WebGL 3D portfolio generation with resume parsing, neural templates, and free hosted subdomain.",
    priceInr: 50000, // ₹500 in paise
    priceUsd: 4900,  // $49 in cents
    displayPriceInr: 500,
    displayPriceUsd: 49,
    billingInterval: "month",
    isPopular: false,
    isActive: true,
    highlights: [
      "1 Live 3D WebGL Portfolio",
      "Standard 3D Components & Presets",
      "Neural & Minimal Templates",
      "Free zylo.design/{slug} Subdomain",
      "5 AI generations / month",
      "PDF Resume Parser",
      "Community Support",
    ],
    entitlements: [
      { featureKey: "portfolios_count", enabled: true, limit: 1, description: "1 Active 3D Portfolio" },
      { featureKey: "ai_generations", enabled: true, limit: 5, description: "5 AI content & 3D generations" },
      { featureKey: "premium_templates", enabled: false, description: "Access only to Neural & Minimal templates" },
      { featureKey: "custom_domain", enabled: false, description: "Custom domain connection requires Pro" },
      { featureKey: "advanced_3d", enabled: false, description: "Advanced post-processing requires Pro" },
      { featureKey: "analytics", enabled: false, description: "Visitor analytics requires Pro" },
      { featureKey: "remove_branding", enabled: false, description: "Powered by ZYLO badge visible" },
      { featureKey: "white_label", enabled: false },
      { featureKey: "priority_cdn", enabled: false },
    ],
  },
  PRO: {
    id: "plan_pro",
    code: "PRO",
    name: "Pro Spatial Dimension",
    tagline: "For professional creators, engineers, and freelancers needing top-tier personal branding.",
    description: "Full access to Orbit, Glassmorphism, and Creative templates, custom domain SSL, 50 AI tokens, and analytics.",
    priceInr: 199900, // ₹1,999 in paise
    priceUsd: 14900,  // $149 in cents
    displayPriceInr: 1999,
    displayPriceUsd: 149,
    billingInterval: "month",
    isPopular: true,
    isActive: true,
    highlights: [
      "5 Live 3D WebGL Portfolios",
      "Custom Domain with Auto SSL (TLS 1.3)",
      "All Premium Templates (Glass, Orbit, Creative, Neural)",
      "Full 3D Visual Customizer & Procedural Shaders",
      "50 AI generations / month",
      "Real-Time Visitor & Geo Analytics",
      "Priority Global Edge CDN Acceleration",
      "Remove 'Created with ZYLO' Branding",
    ],
    entitlements: [
      { featureKey: "portfolios_count", enabled: true, limit: 5, description: "5 Active 3D Portfolios" },
      { featureKey: "ai_generations", enabled: true, limit: 50, description: "50 AI generations" },
      { featureKey: "premium_templates", enabled: true, description: "All templates (Glass, Orbit, Creative, etc.)" },
      { featureKey: "custom_domain", enabled: true, description: "Unlimited custom domain bindings with auto SSL" },
      { featureKey: "advanced_3d", enabled: true, description: "Full bloom, shaders, particles, and post-processing" },
      { featureKey: "analytics", enabled: true, description: "Pageviews, referrers, and device metrics" },
      { featureKey: "remove_branding", enabled: true, description: "Option to hide ZYLO platform watermark" },
      { featureKey: "priority_cdn", enabled: true, description: "Global edge CDN distribution" },
      { featureKey: "white_label", enabled: false },
    ],
  },
  AGENCY: {
    id: "plan_agency",
    code: "AGENCY",
    name: "Agency & Studio Suite",
    tagline: "For design studios and agencies managing client portfolios at scale.",
    description: "Multi-tenant client workspaces, 25 portfolios, 200 AI generations, white-label client sharing, and dedicated support.",
    priceInr: 599900, // ₹5,999 in paise
    priceUsd: 39900,  // $399 in cents
    displayPriceInr: 5999,
    displayPriceUsd: 399,
    billingInterval: "month",
    isPopular: false,
    isActive: true,
    highlights: [
      "25 Live 3D Client Portfolios",
      "Full White-Labeling (Zero ZYLO branding anywhere)",
      "200 AI generations / month",
      "Unlimited Custom Domains",
      "Studio Client Preview Links",
      "Dedicated GPU Infrastructure & Priority Edge CDN",
      "Direct Priority Support & Custom Shaders",
    ],
    entitlements: [
      { featureKey: "portfolios_count", enabled: true, limit: 25, description: "25 Active Portfolios" },
      { featureKey: "ai_generations", enabled: true, limit: 200, description: "200 AI generations" },
      { featureKey: "premium_templates", enabled: true, description: "All templates included" },
      { featureKey: "custom_domain", enabled: true, description: "Unlimited custom domains" },
      { featureKey: "advanced_3d", enabled: true, description: "Unlimited 3D visual parameters" },
      { featureKey: "analytics", enabled: true, description: "Studio-grade analytics" },
      { featureKey: "remove_branding", enabled: true, description: "Complete brand removal" },
      { featureKey: "white_label", enabled: true, description: "Custom client dashboard portal" },
      { featureKey: "priority_cdn", enabled: true, description: "Dedicated edge nodes" },
    ],
  },
};

export class PlanService {
  public static getAllPlans(): PlanDefinition[] {
    return Object.values(PLANS).filter((p) => p.isActive);
  }

  public static getPlanById(planId: string): PlanDefinition | null {
    const plan = Object.values(PLANS).find(
      (p) => p.id === planId || p.code.toLowerCase() === planId.toLowerCase()
    );
    return plan || null;
  }

  public static getPlanByCode(code: string): PlanDefinition | null {
    const upper = code.toUpperCase() as PlanCode;
    return PLANS[upper] || null;
  }

  /**
   * Returns server-authoritative price in smallest currency unit (paise / cents).
   * Prevents client-side price tampering.
   */
  public static getAuthoritativePrice(
    planId: string,
    currency: Currency
  ): { amount: number; displayPrice: number; currency: Currency } | null {
    const plan = this.getPlanById(planId);
    if (!plan) return null;

    if (currency === "INR") {
      return {
        amount: plan.priceInr,
        displayPrice: plan.displayPriceInr,
        currency: "INR",
      };
    } else {
      return {
        amount: plan.priceUsd,
        displayPrice: plan.displayPriceUsd,
        currency: "USD",
      };
    }
  }
}
