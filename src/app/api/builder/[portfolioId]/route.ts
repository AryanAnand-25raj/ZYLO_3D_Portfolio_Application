import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BuilderStorageManager } from "@/modules/builder/builder-store";
import { PortfolioSchema } from "@/schemas/portfolio.schema";

interface RouteParams {
  params: {
    portfolioId: string;
  };
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { portfolioId } = params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    const record = BuilderStorageManager.getPortfolio(portfolioId);
    if (!record) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Ownership check (demo-user-1 has access to demo portfolios)
    if (record.userId !== userId && userId !== "demo-user-1") {
      return NextResponse.json({ error: "Unauthorized access to portfolio" }, { status: 403 });
    }

    const versions = BuilderStorageManager.getVersions(portfolioId);

    return NextResponse.json({
      success: true,
      portfolio: record.portfolio,
      versions,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load portfolio" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { portfolioId } = params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    const body = await req.json();
    const parsed = PortfolioSchema.safeParse(body.portfolio);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid portfolio configuration schema", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const existing = BuilderStorageManager.getPortfolio(portfolioId);
    if (existing && existing.userId !== userId && userId !== "demo-user-1") {
      return NextResponse.json({ error: "Unauthorized access to portfolio" }, { status: 403 });
    }

    // Save updated configuration
    BuilderStorageManager.savePortfolio(portfolioId, parsed.data, userId);

    // Record a version record
    const versionRecord = BuilderStorageManager.addVersion(
      portfolioId,
      body.versionName || "Manual Save",
      body.reason || "Saved in Visual Editor",
      parsed.data
    );

    return NextResponse.json({
      success: true,
      portfolio: parsed.data,
      version: versionRecord,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save portfolio" }, { status: 500 });
  }
}
