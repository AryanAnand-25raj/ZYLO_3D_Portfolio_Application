import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DataLifecycleService } from "@/modules/security/data-lifecycle";
import { CentralRateLimiter } from "@/modules/security/rate-limiter";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const userId =
      req.headers.get("x-user-id") ||
      (session?.user as any)?.id ||
      new URL(req.url).searchParams.get("userId") ||
      "user-demo";

    // Rate limiting (10 req/min)
    const rateCheck = CentralRateLimiter.check(userId, "general");
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many export requests. Please try again later." },
        { status: 429 }
      );
    }

    const exportData = await DataLifecycleService.exportUserData(userId);

    return NextResponse.json({
      success: true,
      export: exportData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Data export failed",
      },
      { status: 500 }
    );
  }
}
