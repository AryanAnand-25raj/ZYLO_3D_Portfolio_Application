import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LinkedInProvider } from "@zylo/integrations";
import { IntegrationStorageManager } from "@/modules/integrations/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    const connection = await IntegrationStorageManager.getIntegration(userId, "linkedin");
    if (!connection) {
      return NextResponse.json(
        { error: "LinkedIn is not connected." },
        { status: 400 }
      );
    }

    if (connection.status === "limited_permissions") {
      return NextResponse.json({
        success: true,
        limitedPermissions: true,
        message:
          "LinkedIn connection has standard OpenID permissions. Use the fallback manual import to paste rich career sections.",
        profile: connection.metadata?.profile,
      });
    }

    const provider = new LinkedInProvider();
    const profile = await provider.fetchProfile(connection);

    await IntegrationStorageManager.updateSyncMetadata(userId, "linkedin", {
      profile,
    });

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      profile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to synchronize LinkedIn profile" },
      { status: 500 }
    );
  }
}
