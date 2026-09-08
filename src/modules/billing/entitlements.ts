import { FeatureKey, EntitlementCheckResult, PlanCode } from "./types";
import { BillingStoreManager } from "./store";
import { PlanService, PLANS } from "./plans.config";

export class EntitlementError extends Error {
  public readonly featureKey: FeatureKey;
  public readonly requiredTier: PlanCode;
  public readonly statusCode: number = 403;

  constructor(featureKey: FeatureKey, message: string, requiredTier: PlanCode = "PRO") {
    super(message);
    this.name = "EntitlementError";
    this.featureKey = featureKey;
    this.requiredTier = requiredTier;
  }
}

export class EntitlementService {
  /**
   * Decoupled entitlement checker.
   * Call `canUse(userId, "custom_domain")` instead of inspecting plan string.
   */
  public static async canUse(
    userId: string,
    featureKey: FeatureKey,
    options?: { count?: number }
  ): Promise<EntitlementCheckResult> {
    const subscription = await BillingStoreManager.getSubscription(userId);

    // 1. Determine effective plan based on subscription status and period
    let effectivePlanCode: PlanCode = subscription.planCode;

    const isWithinGracePeriod =
      subscription.cancelAtPeriodEnd &&
      subscription.currentPeriodEnd &&
      new Date(subscription.currentPeriodEnd).getTime() > Date.now();

    const isSubscriptionValid =
      subscription.status === "active" ||
      subscription.status === "trialing" ||
      isWithinGracePeriod;

    if (!isSubscriptionValid) {
      // Degrade to Starter/Free limits if subscription is expired or cancelled past period
      effectivePlanCode = "STARTER";
    }

    const plan = PlanService.getPlanByCode(effectivePlanCode) || PLANS.STARTER;
    const entitlement = plan.entitlements.find((e) => e.featureKey === featureKey);

    if (!entitlement || !entitlement.enabled) {
      return {
        allowed: false,
        featureKey,
        limit: entitlement?.limit,
        reason: `The feature "${featureKey}" is not included in the ${plan.name} plan. Upgrade to unlock this capability.`,
      };
    }

    // 2. Numerical limit validation (e.g. AI generations, Portfolios count)
    if (entitlement.limit !== undefined) {
      const currentUsage = options?.count ?? 0;
      if (currentUsage >= entitlement.limit) {
        return {
          allowed: false,
          featureKey,
          limit: entitlement.limit,
          currentUsage,
          reason: `You have reached your limit of ${entitlement.limit} for "${featureKey}" on the ${plan.name} plan. Upgrade for higher quotas.`,
        };
      }

      return {
        allowed: true,
        featureKey,
        limit: entitlement.limit,
        currentUsage,
      };
    }

    return {
      allowed: true,
      featureKey,
    };
  }

  /**
   * Returns configured numerical limit for a feature.
   */
  public static async getFeatureLimit(
    userId: string,
    featureKey: FeatureKey
  ): Promise<number | undefined> {
    const subscription = await BillingStoreManager.getSubscription(userId);
    const plan = PlanService.getPlanByCode(subscription.planCode) || PLANS.STARTER;
    const entitlement = plan.entitlements.find((e) => e.featureKey === featureKey);
    return entitlement?.limit;
  }

  /**
   * Returns complete entitlement map for an authenticated user.
   */
  public static async getUserEntitlements(
    userId: string
  ): Promise<Record<FeatureKey, { enabled: boolean; limit?: number; description?: string }>> {
    const subscription = await BillingStoreManager.getSubscription(userId);

    const isWithinGracePeriod =
      subscription.cancelAtPeriodEnd &&
      subscription.currentPeriodEnd &&
      new Date(subscription.currentPeriodEnd).getTime() > Date.now();

    const isSubscriptionValid =
      subscription.status === "active" ||
      subscription.status === "trialing" ||
      isWithinGracePeriod;

    const planCode = isSubscriptionValid ? subscription.planCode : "STARTER";
    const plan = PlanService.getPlanByCode(planCode) || PLANS.STARTER;

    const result = {} as Record<FeatureKey, { enabled: boolean; limit?: number; description?: string }>;
    for (const ent of plan.entitlements) {
      result[ent.featureKey] = {
        enabled: ent.enabled,
        limit: ent.limit,
        description: ent.description,
      };
    }

    return result;
  }

  /**
   * Enforces feature entitlement and throws `EntitlementError` if unauthorized.
   */
  public static async enforce(
    userId: string,
    featureKey: FeatureKey,
    options?: { count?: number }
  ): Promise<void> {
    const check = await this.canUse(userId, featureKey, options);
    if (!check.allowed) {
      throw new EntitlementError(
        featureKey,
        check.reason || `Access to ${featureKey} is restricted.`,
        featureKey === "white_label" ? "AGENCY" : "PRO"
      );
    }
  }
}
