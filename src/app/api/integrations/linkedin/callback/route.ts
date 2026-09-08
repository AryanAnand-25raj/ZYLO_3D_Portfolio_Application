import { NextRequest, NextResponse } from "next/server";
import {
  LinkedInProvider,
  OAuthStateService,
  TokenEncryptionService,
  Connection,
} from "@zylo/integrations";
import { IntegrationStorageManager } from "@/modules/integrations/storage";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      return NextResponse.redirect(
        new URL(`/dashboard/settings/integrations?error=${encodeURIComponent(errorParam)}`, req.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/dashboard/settings/integrations?error=missing_code_or_state", req.url)
      );
    }

    // 1. Validate State
    const stateValidation = OAuthStateService.validateAndConsumeState(state, "linkedin");
    const cookieState = req.cookies.get("zylo_oauth_state_li")?.value;

    if (!stateValidation.valid && cookieState !== state) {
      return NextResponse.redirect(
        new URL(
          `/dashboard/settings/integrations?error=${encodeURIComponent(stateValidation.error || "Invalid state")}`,
          req.url
        )
      );
    }

    const userId = stateValidation.userId || "demo-user-1";
    const host = req.headers.get("host") || "localhost:3000";
    const proto = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${proto}://${host}/api/integrations/linkedin/callback`;

    // 2. Exchange authorization code
    const provider = new LinkedInProvider();
    const result = await provider.handleCallback({
      code,
      state,
      redirectUri,
    });

    if (!result.success || !result.accessToken) {
      return NextResponse.redirect(
        new URL("/dashboard/settings/integrations?error=oauth_exchange_failed", req.url)
      );
    }

    // 3. Encrypt access token before storage
    const encryptedAccessToken = TokenEncryptionService.encrypt(result.accessToken);

    const connection: Connection = {
      id: `conn-li-${Date.now()}`,
      userId,
      provider: "linkedin",
      status: result.limitedPermissions ? "limited_permissions" : "connected",
      externalAccountId: result.externalAccountId,
      externalUsername: result.externalUsername,
      scopes: result.scopes,
      encryptedAccessToken,
      tokenExpiresAt: result.expiresIn
        ? new Date(Date.now() + result.expiresIn * 1000).toISOString()
        : undefined,
      lastSyncedAt: new Date().toISOString(),
      metadata: {
        profile: result.profile,
        limitedPermissions: result.limitedPermissions,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await IntegrationStorageManager.saveIntegration(connection);

    const redirectStatus = result.limitedPermissions ? "linkedin_limited" : "linkedin_connected";
    const res = NextResponse.redirect(
      new URL(`/dashboard/settings/integrations?status=${redirectStatus}`, req.url)
    );
    res.cookies.delete("zylo_oauth_state_li");
    return res;
  } catch (error: any) {
    console.error("[LinkedIn Callback Error]:", error);
    return NextResponse.redirect(
      new URL(
        `/dashboard/settings/integrations?error=${encodeURIComponent(error.message || "Failed to process LinkedIn callback")}`,
        req.url
      )
    );
  }
}
