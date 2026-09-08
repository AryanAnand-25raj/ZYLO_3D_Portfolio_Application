export * from "./types";
export * from "./plans.config";
export * from "./store";
export * from "./entitlements";
export * from "./providers";
export * from "./providers/stripe.provider";
export * from "./providers/razorpay.provider";

// Backward-compatible adapters
export type PlanTier = "FREE" | "PRO" | "AGENCY";

export interface PlanFeatureLimits {
  tier: PlanTier;
  name: string;
  priceMonthly: number;
  maxPortfolios: number;
  customDomain: boolean;
  aiGenerationQuota: number;
  highQuality3D: boolean;
  removeBranding: boolean;
  analytics: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanFeatureLimits> = {
  FREE: {
    tier: "FREE",
    name: "Starter",
    priceMonthly: 0,
    maxPortfolios: 1,
    customDomain: false,
    aiGenerationQuota: 5,
    highQuality3D: false,
    removeBranding: false,
    analytics: false,
  },
  PRO: {
    tier: "PRO",
    name: "Pro Creator",
    priceMonthly: 19,
    maxPortfolios: 5,
    customDomain: true,
    aiGenerationQuota: 50,
    highQuality3D: true,
    removeBranding: true,
    analytics: true,
  },
  AGENCY: {
    tier: "AGENCY",
    name: "Agency & Studio",
    priceMonthly: 59,
    maxPortfolios: 25,
    customDomain: true,
    aiGenerationQuota: 200,
    highQuality3D: true,
    removeBranding: true,
    analytics: true,
  },
};

export function checkPlanEntitlement(
  userTier: PlanTier,
  currentPortfolioCount: number
): { allowed: boolean; reason?: string } {
  const plan = PLAN_LIMITS[userTier];
  if (currentPortfolioCount >= plan.maxPortfolios) {
    return {
      allowed: false,
      reason: `You have reached the maximum limit of ${plan.maxPortfolios} portfolio(s) for the ${plan.name} plan. Upgrade to create more.`,
    };
  }
  return { allowed: true };
}
