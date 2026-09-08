import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DataLifecycleService } from "@/modules/security/data-lifecycle";
import { BillingStoreManager } from "@/modules/billing/store";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const body = await req.json().catch(() => ({}));
    const userId =
      body.userId ||
      req.headers.get("x-user-id") ||
      (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to delete account." },
        { status: 401 }
      );
    }

    // Cancel active subscription with provider first
    await BillingStoreManager.cancelSubscription(userId, false);

    // Perform GDPR account deletion & legal data retention
    const result = await DataLifecycleService.deleteAccount(userId);

    return NextResponse.json({
      success: true,
      message: "Your account and personal portfolios have been permanently deleted. Financial records have been anonymized for legal accounting.",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Account deletion failed",
      },
      { status: 500 }
    );
  }
}
