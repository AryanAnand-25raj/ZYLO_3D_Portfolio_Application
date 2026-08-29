import { NextRequest, NextResponse } from "next/server";
import { globalAIOrchestrator, globalAIRateLimiter } from "@zylo/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const userId = (session?.user as any)?.id || "anonymous-user";

    // Rate Limiting Protection
    const rateCheck = globalAIRateLimiter.checkLimit(userId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.error || "Rate limit exceeded. Please try again in a few moments." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { manualData, extractedData, githubData, linkedinData, stylePrompt } = body;

    const result = globalAIOrchestrator.normalizeProfile({
      manualData: manualData || {},
      resumeData: extractedData,
      githubData,
      linkedinData,
      stylePrompt,
    });

    return NextResponse.json({
      success: true,
      canonicalProfile: result.canonicalProfile,
      conflicts: result.conflicts,
      appliedSources: result.appliedSources,
    });
  } catch (error) {
    console.error("[API Profile Normalize Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to normalize profile" },
      { status: 500 }
    );
  }
}
