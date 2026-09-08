import { NextRequest, NextResponse } from "next/server";
import { DomainService } from "@/modules/publishing/domains";
import { PublishingStoreManager } from "@/modules/publishing/store";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EntitlementService } from "@/modules/billing/entitlements";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "guest-user";

    // Server-side entitlement verification: custom domain requires Pro
    if (userId !== "guest-user") {
      const entitlement = await EntitlementService.canUse(userId, "custom_domain");
      if (!entitlement.allowed) {
        return NextResponse.json(
          {
            error: entitlement.reason || "Custom domain verification requires a Pro plan.",
            code: "UPGRADE_REQUIRED",
          },
          { status: 403 }
        );
      }
    }

    const domain = await PublishingStoreManager.getDomain(id);
    if (!domain) {
      return NextResponse.json(
        { error: `Domain record ${id} not found` },
        { status: 404 }
      );
    }

    const verificationResult = await DomainService.verifyDomainDns(domain);
    await PublishingStoreManager.saveDomain(verificationResult.updatedDomain);

    return NextResponse.json({
      success: verificationResult.verified,
      domain: verificationResult.updatedDomain,
      verified: verificationResult.verified,
      error: verificationResult.error,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Domain verification failed" },
      { status: 500 }
    );
  }
}
