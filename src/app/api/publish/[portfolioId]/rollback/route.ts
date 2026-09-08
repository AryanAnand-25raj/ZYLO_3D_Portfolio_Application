import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PublishingStoreManager } from "@/modules/publishing/store";

export async function POST(
  req: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const { portfolioId } = params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "guest-user";

    const body = await req.json().catch(() => ({}));
    const { targetDeploymentId } = body;

    if (!targetDeploymentId) {
      return NextResponse.json(
        { error: "targetDeploymentId is required for rollback" },
        { status: 400 }
      );
    }

    const result = await PublishingStoreManager.rollbackPortfolio(
      portfolioId,
      targetDeploymentId,
      userId
    );

    return NextResponse.json({
      success: true,
      restoredVersionNumber: result.restoredVersionNumber,
      published: result.published,
      message: `Successfully rolled back to version ${result.restoredVersionNumber}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Rollback failed" },
      { status: 500 }
    );
  }
}
