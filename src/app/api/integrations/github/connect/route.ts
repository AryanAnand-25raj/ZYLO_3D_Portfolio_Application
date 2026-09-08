import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GitHubProvider, OAuthStateService } from "@zylo/integrations";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    const host = req.headers.get("host") || "localhost:3000";
    const proto = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${proto}://${host}/api/integrations/github/callback`;

    const state = OAuthStateService.generateState(userId, "github");
    const provider = new GitHubProvider();
    const authUrl = await provider.getAuthorizationUrl(state, redirectUri);

    // If request accepts HTML or navigation, redirect directly
    const acceptHeader = req.headers.get("accept") || "";
    if (acceptHeader.includes("text/html")) {
      const response = NextResponse.redirect(authUrl);
      response.cookies.set("zylo_oauth_state_gh", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600, // 10 minutes
        path: "/",
      });
      return response;
    }

    const response = NextResponse.json({
      success: true,
      authUrl,
      state,
    });

    response.cookies.set("zylo_oauth_state_gh", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to initiate GitHub OAuth" },
      { status: 500 }
    );
  }
}
