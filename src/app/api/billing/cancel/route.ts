import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BillingStoreManager } from "@/modules/billing/store";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || (session?.user as any)?.id || "user-demo";
    const { cancelAtPeriodEnd = true } = body;

    const updated = await BillingStoreManager.cancelSubscription(
      userId,
      cancelAtPeriodEnd
    );

    return NextResponse.json({
      success: true,
      subscription: updated,
      effectiveDate: updated.currentPeriodEnd || new Date().toISOString(),
      message: cancelAtPeriodEnd
        ? "Your subscription cancellation has been scheduled. You will retain full access until the end of your billing cycle."
        : "Your subscription has been cancelled.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to cancel subscription",
      },
      { status: 500 }
    );
  }
}
