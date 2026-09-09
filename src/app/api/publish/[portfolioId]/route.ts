import { NextRequest, NextResponse } from "next/server";
import { PublishingStoreManager } from "@/modules/publishing/store";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const { portfolioId } = params;

    if (!portfolioId) {
      return NextResponse.json(
        { error: "portfolioId is required" },
        { status: 400 }
      );
    }

    const published = await PublishingStoreManager.getPublishedByPortfolioId(portfolioId);
    const deployments = await PublishingStoreManager.getDeploymentHistory(portfolioId);
    const domains = await PublishingStoreManager.listDomainsForPortfolio(portfolioId);

    return NextResponse.json({
      success: true,
      published,
      isPublished: published?.status === "published",
      activeUrl: published?.status === "published" ? published.deploymentUrl : null,
      deployments,
      domains,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load publishing status" },
      { status: 500 }
    );
  }
}
