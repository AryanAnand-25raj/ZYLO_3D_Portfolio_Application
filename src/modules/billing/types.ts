export type Currency = "INR" | "USD";

export type BillingInterval = "month" | "year" | "one_time";

export type PaymentStatus =
  | "created"
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled"
  | "expired";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "paused"
  | "cancelled"
  | "expired";

export type PaymentProviderName = "stripe" | "razorpay" | "mock";

export type PlanCode = "STARTER" | "PRO" | "AGENCY";

export type FeatureKey =
  | "custom_domain"
  | "premium_templates"
  | "advanced_3d"
  | "analytics"
  | "ai_generations"
  | "portfolios_count"
  | "remove_branding"
  | "white_label"
  | "priority_cdn";

export interface FeatureEntitlementDefinition {
  featureKey: FeatureKey;
  enabled: boolean;
  limit?: number; // numerical limit, undefined if unlimited or boolean
  description?: string;
}

export interface PlanDefinition {
  id: string;
  code: PlanCode;
  name: string;
  tagline: string;
  description: string;
  priceInr: number; // Smallest unit: paise (₹500 = 50000)
  priceUsd: number; // Smallest unit: cents ($49 = 4900)
  displayPriceInr: number; // ₹500
  displayPriceUsd: number; // $49
  billingInterval: BillingInterval;
  isPopular?: boolean;
  isActive: boolean;
  entitlements: FeatureEntitlementDefinition[];
  highlights: string[];
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  planId: string;
  planCode: PlanCode;
  tier: "FREE" | "PRO" | "AGENCY";
  status: SubscriptionStatus;
  provider: PaymentProviderName;
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  subscriptionId?: string;
  provider: PaymentProviderName;
  providerPaymentId?: string;
  providerOrderId?: string;
  amount: number; // in paise or cents
  currency: Currency;
  status: PaymentStatus;
  receiptUrl?: string;
  errorMessage?: string;
  refundedAmount?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceRecord {
  id: string;
  userId: string;
  subscriptionId?: string;
  paymentId?: string;
  invoiceNumber: string;
  amount: number;
  currency: Currency;
  status: "paid" | "open" | "void";
  hostedInvoiceUrl?: string;
  pdfUrl?: string;
  periodStart: string;
  periodEnd: string;
  paidAt?: string;
  createdAt: string;
}

export interface CheckoutOptions {
  planId: string;
  currency: Currency;
  provider?: PaymentProviderName;
  userId: string;
  userEmail?: string;
  userName?: string;
  successUrl: string;
  cancelUrl: string;
  billingInterval?: BillingInterval;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
  provider: PaymentProviderName;
  amount: number;
  currency: Currency;
  providerOrderId?: string;
}

export interface PaymentVerificationResult {
  verified: boolean;
  paymentId: string;
  orderId?: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  error?: string;
}

export interface CancelSubscriptionResult {
  success: boolean;
  cancelAtPeriodEnd: boolean;
  effectiveDate: string;
  status: SubscriptionStatus;
}

export interface ReactivateSubscriptionResult {
  success: boolean;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
}

export interface WebhookEventResult {
  received: boolean;
  provider: PaymentProviderName;
  eventId: string;
  eventType: string;
  status: PaymentStatus | SubscriptionStatus;
  paymentId?: string;
  subscriptionId?: string;
  userId?: string;
  planId?: string;
  amount?: number;
  currency?: Currency;
  metadata?: Record<string, any>;
}

export interface EntitlementCheckResult {
  allowed: boolean;
  featureKey: FeatureKey;
  limit?: number;
  currentUsage?: number;
  reason?: string;
}
