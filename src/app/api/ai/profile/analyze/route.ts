import { NextRequest, NextResponse } from "next/server";
import { globalAIOrchestrator, globalAIRateLimiter } from "@zylo/ai";
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
    const { profile, selectedSections } = body;

    if (!profile) {
      return NextResponse.json({ error: "Profile data is required" }, { status: 400 });
    }

    const report = globalAIOrchestrator.analyzeCompleteness(profile, selectedSections);

    return NextResponse.json({
      success: true,
      score: report.score,
      missing: report.requiredMissing.map((m) => m.field),
      requiredMissing: report.requiredMissing,
      recommendedMissing: report.recommendedMissing,
      recommendations: report.recommendations,
      questions: report.questions,
      report,
    });
  } catch (error) {
    console.error("[API Profile Analyze Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze profile" },
      { status: 500 }
    );
  }
}
