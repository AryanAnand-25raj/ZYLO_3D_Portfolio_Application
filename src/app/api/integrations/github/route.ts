import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IntegrationStorageManager } from "@/modules/integrations/storage";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    const connection = await IntegrationStorageManager.getIntegration(userId, "github");
    if (!connection) {
      return NextResponse.json(
        { error: "No GitHub integration found to disconnect." },
        { status: 404 }
      );
    }

    // Purge stored credentials and connection
    await IntegrationStorageManager.deleteIntegration(userId, "github");

    return NextResponse.json({
      success: true,
      message: "GitHub integration disconnected and OAuth credentials securely purged.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to disconnect GitHub" },
      { status: 500 }
    );
  }
}
