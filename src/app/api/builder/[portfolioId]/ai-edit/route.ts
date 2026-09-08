import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AIBuilderCommands } from "@/modules/builder/ai-commands";
import { PatchSafetyValidator } from "@/modules/builder/patch-safety";
import { applyAIPatches } from "../../../../../../packages/ai/src/patch-system";
import { BuilderStorageManager } from "@/modules/builder/builder-store";
import { PortfolioData, PortfolioSchema } from "@/schemas/portfolio.schema";

interface RouteParams {
  params: {
    portfolioId: string;
  };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { portfolioId } = params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    const body = await req.json();
    const { prompt, currentPortfolio, previewOnly = false } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt string is required" }, { status: 400 });
    }

    const targetPortfolio: PortfolioData =
      currentPortfolio || BuilderStorageManager.getPortfolio(portfolioId)?.portfolio;

    if (!targetPortfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // 1. Generate patches from prompt
    const { explanation, operations } = AIBuilderCommands.generatePatchesFromPrompt(
      prompt,
      targetPortfolio
    );

    // 2. Validate patches against safety whitelist/blacklist
    const safetyCheck = PatchSafetyValidator.validatePatches(operations);
    if (!safetyCheck.safe) {
      return NextResponse.json(
        {
          error: "Unsafe patch detected by security validator",
          blocked: safetyCheck.blockedOperations,
        },
        { status: 403 }
      );
    }

    // 3. Apply safe patches to clone
    const { updated, appliedCount, errors } = applyAIPatches(
      targetPortfolio,
      safetyCheck.allowedOperations
    );

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Error applying patch operations", details: errors },
        { status: 422 }
      );
    }

    // Validate the updated schema
    const parsed = PortfolioSchema.safeParse(updated);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Patched portfolio violates schema constraints", details: parsed.error.format() },
        { status: 422 }
      );
    }

    // 4. Save if not previewOnly
    if (!previewOnly) {
      BuilderStorageManager.savePortfolio(portfolioId, parsed.data, userId);
      BuilderStorageManager.addVersion(
        portfolioId,
        `AI Edit: ${prompt.slice(0, 30)}...`,
        explanation,
        parsed.data
      );
    }

    return NextResponse.json({
      success: true,
      explanation,
      appliedCount,
      operations: safetyCheck.allowedOperations,
      updatedPortfolio: parsed.data,
      isSaved: !previewOnly,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI edit failed" }, { status: 500 });
  }
}
