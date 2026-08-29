import { NextRequest, NextResponse } from "next/server";
import { globalAIOrchestrator, globalAIRateLimiter, regenerateSection } from "@zylo/ai";
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
        { error: rateCheck.error || "Rate limit exceeded. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { profile, style, stylePrompt, targetAudience, portfolioGoal, answeredQuestions, currentContent, sectionToRegenerate } = body;

    if (!profile) {
      return NextResponse.json({ error: "Canonical profile data is required" }, { status: 400 });
    }

    // Single section regeneration
    if (sectionToRegenerate && currentContent) {
      const updated = regenerateSection(
        currentContent,
        sectionToRegenerate,
        profile,
        style || "Professional",
        stylePrompt
      );
      return NextResponse.json({
        success: true,
        generatedContent: updated,
        regeneratedSection: sectionToRegenerate,
      });
    }

    // Full structured content generation
    const generated = await globalAIOrchestrator.generateContent({
      profile,
      style: style || "Professional",
      stylePrompt,
      targetAudience,
      portfolioGoal,
      answeredQuestions: answeredQuestions || [],
    });

    return NextResponse.json({
      success: true,
      generatedContent: generated,
    });
  } catch (error) {
    console.error("[API Content Generate Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate portfolio content" },
      { status: 500 }
    );
  }
}
