import { NextRequest, NextResponse } from "next/server";
import { PublishingStoreManager } from "@/modules/publishing/store";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const success = await PublishingStoreManager.deleteDomain(id);
    if (!success) {
      return NextResponse.json(
        { error: `Domain record ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Custom domain configuration removed.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove domain" },
      { status: 500 }
    );
  }
}
