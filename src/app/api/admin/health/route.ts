import { NextRequest, NextResponse } from "next/server";
import { RBACService } from "@/modules/security/rbac";
import { SystemHealthService } from "@/modules/admin/health";

export async function GET(req: NextRequest) {
  const auth = await RBACService.verifyAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const health = await SystemHealthService.checkAll();
    return NextResponse.json({
      success: true,
      ...health,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "System health check failed",
      },
      { status: 500 }
    );
  }
}
