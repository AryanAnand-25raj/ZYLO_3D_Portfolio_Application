import { NextRequest, NextResponse } from "next/server";
import { PublishingStoreManager } from "@/modules/publishing/store";

export async function POST(
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

    const token = PublishingStoreManager.createSignedPreviewToken(portfolioId);
    const previewUrl = `/preview/${portfolioId}?token=${token}`;

    return NextResponse.json({
      success: true,
      token,
      previewUrl,
      expiresInHours: 24,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate preview URL" },
      { status: 500 }
    );
  }
}
