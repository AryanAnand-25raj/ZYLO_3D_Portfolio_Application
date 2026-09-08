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
    const parsed = PortfolioSchema.safeParse(body.portfolio);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid schema for autosave" }, { status: 400 });
    }

    const existing = BuilderStorageManager.getPortfolio(portfolioId);
    if (existing && existing.userId !== userId && userId !== "demo-user-1") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // Lightweight save without version commit
    BuilderStorageManager.savePortfolio(portfolioId, parsed.data, userId);

    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Autosave failed" }, { status: 500 });
  }
}
