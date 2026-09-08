import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  const pathname = url.pathname;

  let response: NextResponse = NextResponse.next();

  // Clean host (remove port if any)
  const currentHost = hostname.replace(/:\d+$/, "").toLowerCase();

  // 1. Subdomain routing: e.g. alex.zylo.design or alex.localhost
  const isPlatformPath =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/builder") ||
    pathname.startsWith("/preview") ||
    pathname.startsWith("/connect") ||
    pathname.startsWith("/create") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".");

  if (!isPlatformPath) {
    const zyloSubdomainMatch =
      currentHost.match(/^([a-z0-9-]+)\.zylo\.design$/) ||
      currentHost.match(/^([a-z0-9-]+)\.localhost$/);

    if (zyloSubdomainMatch) {
      const subdomain = zyloSubdomainMatch[1];
      const reserved = new Set([
        "www",
        "app",
        "api",
        "admin",
        "dashboard",
        "preview",
        "cdn",
        "staging",
      ]);

      if (!reserved.has(subdomain)) {
        url.pathname = pathname === "/" ? `/${subdomain}` : `/${subdomain}${pathname}`;
        response = NextResponse.rewrite(url);
      }
    }
  }

  // 2. Attach Content Security & Hardening Headers (compatible with Three.js WebGL & Payment Gateways)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.stripe.com https://api.razorpay.com https://api.github.com https://api.linkedin.com ws: wss: https:",
    "worker-src 'self' blob:",
    "child-src 'self' blob: https://checkout.razorpay.com https://js.stripe.com",
    "frame-src 'self' https://checkout.razorpay.com https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  response.headers.set("Content-Security-Policy", cspDirectives.join("; "));

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /_next (Next.js internals)
     * 2. /_static (inside /public)
     * 3. Static assets with extensions (e.g. .png, .jpg, .ico)
     */
    "/((?!_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};
