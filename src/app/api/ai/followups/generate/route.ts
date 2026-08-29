import { NextRequest, NextResponse } from "next/server";
import { generatePrioritizedFollowUps, globalAIRateLimiter } from "@zylo/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const userId = (session?.user as any)?.id || "anonymous-user";

    const rateCheck = globalAIRateLimiter.checkLimit(userId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.error || "Rate limit exceeded." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { profile, requiredMissing, recommendedMissing } = body;

    if (!profile) {
      return NextResponse.json({ error: "Profile data is required" }, { status: 400 });
    }

    const questions = generatePrioritizedFollowUps(
      profile,
      requiredMissing || [],
      recommendedMissing || []
    );

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("[API Follow-ups Generate Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate follow-up questions" },
      { status: 500 }
    );
  }
}
