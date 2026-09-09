import { NextRequest, NextResponse } from "next/server";
import {
  GitHubProvider,
  OAuthStateService,
  TokenEncryptionService,
  ProjectQualityScorer,
  Connection,
} from "@zylo/integrations";
import { IntegrationStorageManager } from "@/modules/integrations/storage";

export const dynamic = "force-dynamic";

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

    // 1. Validate State & CSRF
    const stateValidation = OAuthStateService.validateAndConsumeState(state, "github");
    const cookieState = req.cookies.get("zylo_oauth_state_gh")?.value;

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
    const redirectUri = `${proto}://${host}/api/integrations/github/callback`;

    // 2. Exchange authorization code for token
    const provider = new GitHubProvider();
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

    const tempConn: Connection = {
      id: `conn-gh-${Date.now()}`,
      userId,
      provider: "github",
      status: "connected",
      externalAccountId: result.externalAccountId,
      externalUsername: result.externalUsername,
      scopes: result.scopes,
      encryptedAccessToken,
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 4. Import public repositories and compute Quality Scores
    let reposWithScores: any[] = [];
    try {
      const publicRepos = await provider.fetchRepositories(tempConn);
      const ranking = ProjectQualityScorer.rankProjects(publicRepos);
      reposWithScores = ranking.evaluated;
    } catch (repoErr) {
      console.warn("[GitHub Callback] Repo fetch non-fatal warning:", repoErr);
    }

    tempConn.metadata = {
      profile: result.profile,
      repositories: reposWithScores,
      repoCount: reposWithScores.length,
    };

    // 5. Persist connection
    await IntegrationStorageManager.saveIntegration(tempConn);

    const res = NextResponse.redirect(
      new URL("/dashboard/settings/integrations?status=github_connected", req.url)
    );
    res.cookies.delete("zylo_oauth_state_gh");
    return res;
  } catch (error: any) {
    console.error("[GitHub Callback Error]:", error);
    return NextResponse.redirect(
      new URL(
        `/dashboard/settings/integrations?error=${encodeURIComponent(error.message || "Failed to process GitHub callback")}`,
        req.url
      )
    );
  }
}
