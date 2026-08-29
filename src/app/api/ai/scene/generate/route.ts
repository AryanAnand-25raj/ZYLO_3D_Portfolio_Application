import { NextRequest, NextResponse } from "next/server";
import { generateSceneFromPlan, DesignPlanSchema, globalAIRateLimiter, recordAIUsage, getAIProvider } from "@zylo/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const userId = (session?.user as any)?.id || "anonymous-user";

    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimitKey = `scene-generate:${userId !== "anonymous-user" ? userId : clientIp}`;
    const rateCheck = globalAIRateLimiter.checkLimit(rateLimitKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.error || "Too many scene generation requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsedPlan = DesignPlanSchema.safeParse(body.plan);

    if (!parsedPlan.success) {
      return NextResponse.json(
        { error: "Invalid design plan provided for scene synthesis", details: parsedPlan.error.format() },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const scene = await generateSceneFromPlan(
      parsedPlan.data,
      body.performanceTier || "high",
      body.reducedMotion || false,
      provider
    );

    // Record token usage
    await recordAIUsage({
      userId: userId !== "anonymous-user" ? userId : "anonymous",
      portfolioId: body.portfolioId,
      provider: provider.name,
      model: "gpt-4o-mini",
      task: "SCENE_GENERATION",
      inputTokens: 800,
      outputTokens: 1400,
      estimatedCost: 0.0009,
    });

    return NextResponse.json({
      success: true,
      scene,
    });
  } catch (error) {
    console.error("[API AI Scene Generate Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate 3D scene" },
      { status: 500 }
    );
  }
}
