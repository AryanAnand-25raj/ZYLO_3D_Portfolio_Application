import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/api/integrations/github/callback";
  return NextResponse.redirect(url);
}
