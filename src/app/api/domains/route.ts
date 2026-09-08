import { NextRequest, NextResponse } from "next/server";
import { DomainService } from "@/modules/publishing/domains";
import { PublishingStoreManager } from "@/modules/publishing/store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const portfolioId = searchParams.get("portfolioId");

    if (!portfolioId) {
      return NextResponse.json(
        { error: "portfolioId query parameter is required" },
        { status: 400 }
      );
    }

    const domains = await PublishingStoreManager.listDomainsForPortfolio(portfolioId);
    return NextResponse.json({ success: true, domains });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list domains" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { portfolioId, hostname } = body;

    if (!portfolioId || !hostname) {
      return NextResponse.json(
        { error: "portfolioId and hostname are required" },
        { status: 400 }
      );
    }

    // SSRF & validity checks
    const validation = DomainService.validateCustomDomain(hostname);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Invalid domain format" },
        { status: 400 }
      );
    }

    // Check collision
    const existing = await PublishingStoreManager.getDomainByHostname(validation.hostname);
    if (existing && existing.portfolioId !== portfolioId) {
      return NextResponse.json(
        { error: `Domain ${validation.hostname} is already configured for another portfolio.` },
        { status: 409 }
      );
    }

    const domainRecord = DomainService.createDomainRecord(
      portfolioId,
      validation.hostname,
      validation.type
    );

    await PublishingStoreManager.saveDomain(domainRecord);

    return NextResponse.json({
      success: true,
      domain: domainRecord,
      instructions: domainRecord.dnsRecords,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to register custom domain" },
      { status: 500 }
    );
  }
}
