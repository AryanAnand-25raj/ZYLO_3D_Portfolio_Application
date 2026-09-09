import { NextRequest, NextResponse } from "next/server";
import { RBACService } from "@/modules/security/rbac";
import { AuditLogger } from "@/modules/security/audit-logger";
import { AuditAction } from "@/modules/security/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await RBACService.verifyAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || undefined;
    const action = (url.searchParams.get("action") as AuditAction) || undefined;
    const targetResource = url.searchParams.get("targetResource") || undefined;
    const status = (url.searchParams.get("status") as "SUCCESS" | "FAILURE") || undefined;
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    const result = await AuditLogger.query({
      userId,
      action,
      targetResource,
      status,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      logs: result.logs,
      total: result.total,
      limit,
      offset,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load audit logs",
      },
      { status: 500 }
    );
  }
}
