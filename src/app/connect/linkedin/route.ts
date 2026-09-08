import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/api/integrations/linkedin/connect";
  return NextResponse.redirect(url);
}
