import { NextRequest, NextResponse } from "next/server";
import { RBACService } from "@/modules/security/rbac";
import { AdminStoreManager } from "@/modules/admin/admin-store";

export async function GET(req: NextRequest) {
  const auth = await RBACService.verifyAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const overview = await AdminStoreManager.getOverview();
    return NextResponse.json({
      success: true,
      overview,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load admin overview",
      },
      { status: 500 }
    );
  }
}
