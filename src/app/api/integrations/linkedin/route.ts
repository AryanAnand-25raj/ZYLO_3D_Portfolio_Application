import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IntegrationStorageManager } from "@/modules/integrations/storage";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    await IntegrationStorageManager.deleteIntegration(userId, "linkedin");

    return NextResponse.json({
      success: true,
      message: "LinkedIn integration disconnected and credentials purged.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to disconnect LinkedIn" },
      { status: 500 }
    );
  }
}
