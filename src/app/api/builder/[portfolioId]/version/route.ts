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

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { portfolioId } = params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    const body = await req.json();
    const { name, reason, portfolio } = body;

    const parsed = PortfolioSchema.safeParse(portfolio);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid schema for version checkpoint" }, { status: 400 });
    }

    const existing = BuilderStorageManager.getPortfolio(portfolioId);
    if (existing && existing.userId !== userId && userId !== "demo-user-1") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const versionRecord = BuilderStorageManager.addVersion(
      portfolioId,
      name || "Checkpoint",
      reason || "Manual checkpoint created in editor",
      parsed.data
    );

    return NextResponse.json({
      success: true,
      version: versionRecord,
      versions: BuilderStorageManager.getVersions(portfolioId),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create version" }, { status: 500 });
  }
}
