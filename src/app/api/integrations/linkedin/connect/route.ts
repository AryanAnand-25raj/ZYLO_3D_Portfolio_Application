import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LinkedInProvider, OAuthStateService } from "@zylo/integrations";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo-user-1";

    const host = req.headers.get("host") || "localhost:3000";
    const proto = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${proto}://${host}/api/integrations/linkedin/callback`;

    const state = OAuthStateService.generateState(userId, "linkedin");
    const provider = new LinkedInProvider();
    const authUrl = await provider.getAuthorizationUrl(state, redirectUri);

    const acceptHeader = req.headers.get("accept") || "";
    if (acceptHeader.includes("text/html")) {
      const response = NextResponse.redirect(authUrl);
      response.cookies.set("zylo_oauth_state_li", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600,
        path: "/",
      });
      return response;
    }

    const response = NextResponse.json({
      success: true,
      authUrl,
      state,
    });

    response.cookies.set("zylo_oauth_state_li", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to initiate LinkedIn OAuth" },
      { status: 500 }
    );
  }
}
