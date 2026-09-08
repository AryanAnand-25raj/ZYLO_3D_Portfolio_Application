import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BillingStoreManager } from "@/modules/billing/store";
import { PlanService, PLANS } from "@/modules/billing/plans.config";
import { EntitlementService } from "@/modules/billing/entitlements";

export async function GET(req?: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const url = req ? new URL(req.url) : null;
    const userId = url?.searchParams.get("userId") || (session?.user as any)?.id || "user-demo";

    const subscription = await BillingStoreManager.getSubscription(userId);
    const plan = PlanService.getPlanByCode(subscription.planCode) || PLANS.STARTER;
    const entitlements = await EntitlementService.getUserEntitlements(userId);

    return NextResponse.json({
      success: true,
      subscription,
      plan,
      entitlements,
      usage: {
        aiGenerationsUsed: 2, // Example live usage counter
        aiGenerationsLimit: entitlements.ai_generations?.limit || 5,
        portfoliosCount: 1,
        portfoliosLimit: entitlements.portfolios_count?.limit || 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch subscription",
      },
      { status: 500 }
    );
  }
}
