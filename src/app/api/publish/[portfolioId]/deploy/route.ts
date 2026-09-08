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
    const { slug } = body;

    const result = await PublishingStoreManager.deployPortfolio(
      portfolioId,
      userId,
      slug
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Pre-publish validation failed",
          validation: result.validation,
          deployment: result.deployment,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      publishedUrl: result.published?.deploymentUrl,
      published: result.published,
      deployment: result.deployment,
      validation: result.validation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Deployment failed" },
      { status: 500 }
    );
  }
}
