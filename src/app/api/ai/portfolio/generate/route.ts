import { NextRequest, NextResponse } from "next/server";
import { globalAIOrchestrator, globalAIRateLimiter, regenerateSection } from "@zylo/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const userId = (session?.user as any)?.id || "anonymous-user";

    const rateCheck = globalAIRateLimiter.checkLimit(userId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.error || "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { profile, preferences, answeredQuestions, currentContent, sectionToRegenerate } = body;

    if (!profile) {
      return NextResponse.json({ error: "Profile data is required" }, { status: 400 });
    }

    // Single-component regeneration
    if (sectionToRegenerate && currentContent) {
      const updated = regenerateSection(
        currentContent,
        sectionToRegenerate,
        profile,
        preferences?.preset || "Professional",
        preferences?.stylePrompt
      );
      return NextResponse.json({
        success: true,
        generatedContent: updated,
        regeneratedSection: sectionToRegenerate,
      });
    }

    // Full portfolio content generation
    const generated = await globalAIOrchestrator.generateContent({
      profile,
      style: preferences?.preset || "Professional",
      stylePrompt: preferences?.stylePrompt,
      targetAudience: preferences?.targetAudience,
      portfolioGoal: preferences?.portfolioGoal,
      answeredQuestions: answeredQuestions || [],
    });

    return NextResponse.json({
      success: true,
      generatedContent: generated,
    });
  } catch (error) {
    console.error("[API Portfolio Generate Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate portfolio content" },
      { status: 500 }
    );
  }
}
