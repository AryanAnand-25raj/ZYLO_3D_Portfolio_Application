import { NextRequest, NextResponse } from "next/server";
import { BuilderStorageManager } from "@/modules/builder/builder-store";
import { PublishValidator } from "@/modules/publishing/validator";

export async function POST(
  _req: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const { portfolioId } = params;

    const draftEntry = BuilderStorageManager.getPortfolio(portfolioId);
    if (!draftEntry) {
      return NextResponse.json(
        { error: `Draft portfolio ${portfolioId} not found` },
        { status: 404 }
      );
    }

    const validation = PublishValidator.validate(draftEntry.portfolio);

    return NextResponse.json({
      success: true,
      canPublish: validation.canPublish,
      validation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Validation check failed" },
      { status: 500 }
    );
  }
}
