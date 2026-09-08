import crypto from "crypto";
import { DeviceCategory } from "./types";

const ROTATING_SALT = process.env.ANALYTICS_SALT || "zylo_privacy_salt_daily_rot_2026";

export class AnalyticsPrivacyEngine {
  /**
   * Evaluates if analytics tracking is permitted for this request.
   * Respects Do Not Track (DNT), Global Privacy Control (Sec-GPC),
   * and explicit user opt-outs.
   */
  public static shouldTrack(
    headers: Headers | Record<string, string | string[] | undefined>,
    userOptedOut: boolean = false
  ): boolean {
    if (userOptedOut) return false;

    const getHeader = (key: string): string | undefined => {
      if (typeof (headers as any).get === "function") {
        return (headers as Headers).get(key) || undefined;
      }
      const val = (headers as Record<string, any>)[key] ||
        (headers as Record<string, any>)[key.toLowerCase()];
      return Array.isArray(val) ? val[0] : val;
    };

    // 1. Do Not Track header
    const dnt = getHeader("dnt") || getHeader("DNT");
    if (dnt === "1") return false;

    // 2. Global Privacy Control (GPC)
    const gpc = getHeader("sec-gpc") || getHeader("Sec-GPC");
    if (gpc === "1") return false;

    // 3. Opt-out cookie check
    const cookieHeader = getHeader("cookie") || "";
    if (cookieHeader.includes("zylo_analytics_optout=true")) {
      return false;
    }

    return true;
  }

  /**
   * Generates a non-reversible, daily-salted visitor hash for unique visitor calculations.
   * Raw IP addresses are NEVER persisted to any storage medium.
   */
  public static anonymizeVisitor(
    clientIp: string = "127.0.0.1",
    userAgent: string = "",
    dateStr?: string
  ): string {
    const today = dateStr || new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const payload = `${clientIp}::${userAgent}::${ROTATING_SALT}::${today}`;
    return crypto.createHash("sha256").update(payload).digest("hex").slice(0, 32);
  }

  /**
   * Normalizes and cleans referrers to prevent leaking tracking tokens,
   * query strings, or private search queries.
   */
  public static sanitizeReferrer(rawReferrer?: string): string {
    if (!rawReferrer || typeof rawReferrer !== "string") {
      return "Direct";
    }

    try {
      const url = new URL(rawReferrer);
      const host = url.hostname.toLowerCase();

      if (host.includes("google.")) return "Google";
      if (host.includes("github.com")) return "GitHub";
      if (host.includes("linkedin.com")) return "LinkedIn";
      if (host.includes("twitter.com") || host.includes("x.com")) return "X (Twitter)";
      if (host.includes("producthunt.com")) return "Product Hunt";
      if (host.includes("reddit.com")) return "Reddit";
      if (host.includes("zylo.design") || host === "localhost") return "Internal / Direct";

      return host.replace(/^www\./, "");
    } catch {
      return "Direct / Unknown";
    }
  }

  /**
   * Resolves basic device category from user-agent string without invasive fingerprinting.
   */
  public static resolveDeviceCategory(userAgent: string = ""): DeviceCategory {
    const ua = userAgent.toLowerCase();
    if (ua.includes("ipad") || ua.includes("tablet") || (ua.includes("android") && !ua.includes("mobile"))) {
      return "tablet";
    }
    if (ua.includes("mobile") || ua.includes("iphone") || ua.includes("android")) {
      return "mobile";
    }
    return "desktop";
  }

  /**
   * Sanitizes country/region codes from headers without exposing GPS or exact coordinates.
   */
  public static sanitizeCountryRegion(
    headers: Headers | Record<string, string | string[] | undefined>
  ): string {
    const getHeader = (key: string): string | undefined => {
      if (typeof (headers as any).get === "function") {
        return (headers as Headers).get(key) || undefined;
      }
      const val = (headers as Record<string, any>)[key] ||
        (headers as Record<string, any>)[key.toLowerCase()];
      return Array.isArray(val) ? val[0] : val;
    };

    const country =
      getHeader("x-vercel-ip-country") ||
      getHeader("cf-ipcountry") ||
      getHeader("x-country-code");

    if (country && /^[A-Z]{2}$/i.test(country)) {
      return country.toUpperCase();
    }
    return "Global";
  }
}
