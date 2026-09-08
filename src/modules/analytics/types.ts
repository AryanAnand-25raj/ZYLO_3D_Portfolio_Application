export type AnalyticsEventType =
  | "page_view"
  | "project_view"
  | "contact_click"
  | "resume_download"
  | "github_click"
  | "linkedin_click"
  | "cta_click";

export type DeviceCategory = "desktop" | "mobile" | "tablet";

export type TimeRangeFilter = "7d" | "30d" | "90d" | "all";

export interface AnalyticsEventRecord {
  id: string;
  portfolioId: string;
  event: AnalyticsEventType;
  path: string;
  deviceCategory: DeviceCategory;
  referrer?: string;
  countryRegion?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface PortfolioVisitRecord {
  id: string;
  portfolioId: string;
  visitorHash: string; // One-way daily salted hash, never raw IP
  deviceCategory: DeviceCategory;
  countryRegion?: string;
  referrer?: string;
  path: string;
  startedAt: string;
  lastActiveAt: string;
  durationSeconds: number;
}

export interface AnalyticsEventInput {
  portfolioId: string;
  event: AnalyticsEventType;
  path?: string;
  deviceCategory?: DeviceCategory;
  referrer?: string;
  countryRegion?: string;
  metadata?: Record<string, any>;
}

export interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}

export interface TrafficSource {
  referrer: string;
  count: number;
  percentage: number;
}

export interface TopSection {
  section: string;
  views: number;
}

export interface PortfolioAnalyticsSummary {
  portfolioId: string;
  timeRange: TimeRangeFilter;
  totalVisitors: number;
  uniqueVisitors: number;
  totalViews: number;
  ctaClicks: number;
  resumeDownloads: number;
  topSections: TopSection[];
  trafficSources: TrafficSource[];
  deviceBreakdown: DeviceBreakdown;
  eventsOverTime: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
}
