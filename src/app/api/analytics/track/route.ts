import { NextRequest, NextResponse } from "next/server";
import { AnalyticsPrivacyEngine, AnalyticsStoreManager } from "@/modules/analytics";
import { CentralRateLimiter } from "@/modules/security/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Rate limiting check (60/min per IP)
    const rateCheck = CentralRateLimiter.check(clientIp, "general");
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfterSeconds || 60) },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { portfolioId, event, path = "/", referrer, metadata } = body;

    if (!portfolioId || !event) {
      return NextResponse.json(
        { success: false, error: "Missing required fields 'portfolioId' and 'event'." },
        { status: 400 }
      );
    }

    // 2. Privacy Check: DNT / GPC / User Opt-Out
    const userAgent = req.headers.get("user-agent") || "";
    const shouldTrack = AnalyticsPrivacyEngine.shouldTrack(req.headers, body.optOut);

    if (!shouldTrack) {
      return NextResponse.json({
        success: true,
        tracked: false,
        message: "Tracking suppressed per user privacy signal (DNT / GPC / Opt-Out).",
      });
    }

    // 3. Resolve metadata safely
    const deviceCategory = AnalyticsPrivacyEngine.resolveDeviceCategory(userAgent);
    const countryRegion = AnalyticsPrivacyEngine.sanitizeCountryRegion(req.headers);
    const visitorHash = AnalyticsPrivacyEngine.anonymizeVisitor(clientIp, userAgent);

    // 4. Record Event and Visit
    const eventRecord = await AnalyticsStoreManager.recordEvent({
      portfolioId,
      event,
      path,
      deviceCategory,
      referrer,
      countryRegion,
      metadata,
    });

    await AnalyticsStoreManager.recordVisit(
      portfolioId,
      visitorHash,
      deviceCategory,
      referrer,
      countryRegion,
      path
    );

    return NextResponse.json({
      success: true,
      tracked: true,
      eventId: eventRecord.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Analytics ingestion failed",
      },
      { status: 500 }
    );
  }
}
