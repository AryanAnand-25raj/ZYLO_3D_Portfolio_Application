import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BuilderStorageManager } from "@/modules/builder/builder-store";

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
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json({ error: "versionId is required" }, { status: 400 });
    }

    const restoredPortfolio = BuilderStorageManager.restoreVersion(portfolioId, versionId, userId);
    if (!restoredPortfolio) {
      return NextResponse.json({ error: "Version checkpoint not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      portfolio: restoredPortfolio,
      versions: BuilderStorageManager.getVersions(portfolioId),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to restore version" }, { status: 500 });
  }
}
