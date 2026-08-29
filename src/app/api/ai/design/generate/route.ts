import { NextRequest, NextResponse } from "next/server";
import { generateDesignAndScene, DesignInputSchema, globalAIRateLimiter, recordAIUsage, getAIProvider } from "@zylo/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const userId = (session?.user as any)?.id || "anonymous-user";

    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimitKey = `design-generate:${userId !== "anonymous-user" ? userId : clientIp}`;
    const rateCheck = globalAIRateLimiter.checkLimit(rateLimitKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.error || "Too many design generation requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsedInput = DesignInputSchema.safeParse(body);

    if (!parsedInput.success) {
      return NextResponse.json(
        { error: "Invalid design generation input", details: parsedInput.error.format() },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const result = await generateDesignAndScene(parsedInput.data, provider);

    // Record token usage if available
    await recordAIUsage({
      userId: userId !== "anonymous-user" ? userId : "anonymous",
      portfolioId: body.portfolioId,
      provider: provider.name,
      model: "gpt-4o-mini",
      task: "DESIGN_GENERATION",
      inputTokens: 1200,
      outputTokens: 1800,
      estimatedCost: 0.0013,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[API AI Design Generate Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate design & 3D scene" },
      { status: 500 }
    );
  }
}
