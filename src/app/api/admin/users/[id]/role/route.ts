import { NextRequest, NextResponse } from "next/server";
import { RBACService } from "@/modules/security/rbac";
import { AdminStoreManager } from "@/modules/admin/admin-store";
import { UserRoleType } from "@/modules/security/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Super Admin verification required
  const auth = await RBACService.verifySuperAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const { id: userId } = await params;
    const body = await req.json().catch(() => ({}));
    const { role } = body;

    const validRoles: UserRoleType[] = ["USER", "CREATOR", "ADMIN", "SUPER_ADMIN"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: `Invalid role '${role}'. Valid roles: ${validRoles.join(", ")}.` },
        { status: 400 }
      );
    }

    const updated = await AdminStoreManager.updateUserRole(userId, role, auth.user?.id);
    if (!updated) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updated,
      message: `User '${userId}' role updated to ${role}.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update user role",
      },
      { status: 500 }
    );
  }
}
