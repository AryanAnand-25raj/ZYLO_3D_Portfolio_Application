import { NextRequest, NextResponse } from "next/server";
import { RBACService } from "@/modules/security/rbac";
import { AdminStoreManager } from "@/modules/admin/admin-store";

export async function GET(req: NextRequest) {
  const auth = await RBACService.verifyAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || undefined;
    const template = url.searchParams.get("template") || undefined;
    const isPublishedParam = url.searchParams.get("isPublished");
    const isPublished = isPublishedParam === null ? undefined : isPublishedParam === "true";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    const result = await AdminStoreManager.listPortfolios({
      search,
      template,
      isPublished,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      portfolios: result.portfolios,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to list portfolios",
      },
      { status: 500 }
    );
  }
}
