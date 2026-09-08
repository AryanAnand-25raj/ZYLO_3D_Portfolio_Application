import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PublishingStoreManager } from "@/modules/publishing/store";

export async function POST(
  _req: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const { portfolioId } = params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "guest-user";

    const success = await PublishingStoreManager.unpublishPortfolio(
      portfolioId,
      userId
    );

    if (!success) {
      return NextResponse.json(
        { error: "Portfolio is not currently published or could not be found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio has been unpublished. Public route is now disabled.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to unpublish" },
      { status: 500 }
    );
  }
}
