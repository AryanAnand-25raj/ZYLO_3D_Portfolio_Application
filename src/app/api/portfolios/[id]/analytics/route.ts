import { NextRequest, NextResponse } from "next/server";
import { AnalyticsStoreManager, TimeRangeFilter } from "@/modules/analytics";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portfolioId } = await params;
    const url = new URL(req.url);
    const timeRange = (url.searchParams.get("timeRange") as TimeRangeFilter) || "30d";

    const summary = await AnalyticsStoreManager.getPortfolioSummary(
      portfolioId,
      timeRange
    );

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load analytics",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portfolioId } = await params;
    await AnalyticsStoreManager.purgePortfolioAnalytics(portfolioId);

    return NextResponse.json({
      success: true,
      message: `Analytics data for portfolio '${portfolioId}' has been purged.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to purge analytics",
      },
      { status: 500 }
    );
  }
}
