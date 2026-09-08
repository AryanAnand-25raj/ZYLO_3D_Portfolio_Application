import { NextRequest, NextResponse } from "next/server";
import { RBACService } from "@/modules/security/rbac";
import { AdminStoreManager } from "@/modules/admin/admin-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await RBACService.verifyAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const { id: userId } = await params;
    const body = await req.json().catch(() => ({}));
    const { status } = body;

    if (status !== "ACTIVE" && status !== "SUSPENDED") {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be 'ACTIVE' or 'SUSPENDED'." },
        { status: 400 }
      );
    }

    const updated = await AdminStoreManager.updateUserStatus(userId, status, auth.user?.id);
    if (!updated) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updated,
      message: `User '${userId}' status updated to ${status}.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update user status",
      },
      { status: 500 }
    );
  }
}
