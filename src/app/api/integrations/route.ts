import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IntegrationStorageManager } from "@/modules/integrations/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    const list = await IntegrationStorageManager.listIntegrations(userId);

    // Sanitize output: NEVER expose encrypted tokens to client response
    const sanitized = list.map((conn) => ({
      id: conn.id,
      provider: conn.provider,
      status: conn.status,
      externalAccountId: conn.externalAccountId,
      externalUsername: conn.externalUsername,
      scopes: conn.scopes,
      lastSyncedAt: conn.lastSyncedAt,
      tokenExpiresAt: conn.tokenExpiresAt,
      metadata: conn.metadata,
      createdAt: conn.createdAt,
    }));

    return NextResponse.json({
      success: true,
      integrations: sanitized,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to list integrations" },
      { status: 500 }
    );
  }
}
