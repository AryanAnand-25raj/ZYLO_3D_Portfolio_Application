import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BillingStoreManager } from "@/modules/billing/store";

export async function POST(req?: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const body = req ? await req.json().catch(() => ({})) : {};
    const userId = body.userId || (session?.user as any)?.id || "user-demo";

    const updated = await BillingStoreManager.reactivateSubscription(userId);

    return NextResponse.json({
      success: true,
      subscription: updated,
      message: "Your subscription has been successfully reactivated. Automatic renewals will continue.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to reactivate subscription",
      },
      { status: 500 }
    );
  }
}
