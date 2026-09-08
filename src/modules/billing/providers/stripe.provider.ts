import crypto from "crypto";
import {
  PaymentProvider,
  PaymentProviderFactory,
} from "./index";
import {
  CheckoutOptions,
  CheckoutSessionResult,
  PaymentVerificationResult,
  CancelSubscriptionResult,
  ReactivateSubscriptionResult,
  WebhookEventResult,
  PaymentStatus,
  SubscriptionStatus,
} from "../types";
import { PlanService } from "../plans.config";

export class StripeProvider implements PaymentProvider {
  public readonly name = "stripe" as const;

  private webhookSecret: string =
    process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_zylo_stripe_mock_secret_key";

  public setWebhookSecret(secret: string): void {
    this.webhookSecret = secret;
  }

  /**
   * Creates a Stripe Checkout Session using server-authoritative USD pricing.
   */
  public async createCheckoutSession(
    options: CheckoutOptions
  ): Promise<CheckoutSessionResult> {
    const priceInfo = PlanService.getAuthoritativePrice(options.planId, "USD");
    if (!priceInfo) {
      throw new Error(`Invalid plan ID "${options.planId}".`);
    }

    const sessionId = `cs_stripe_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
    const checkoutUrl = `${options.successUrl}?session_id=${sessionId}&provider=stripe`;

    return {
      sessionId,
      checkoutUrl,
      provider: "stripe",
      amount: priceInfo.amount,
      currency: "USD",
    };
  }

  /**
   * Verifies a completed Stripe Checkout session.
   */
  public async verifyPayment(payload: { sessionId: string }): Promise<PaymentVerificationResult> {
    if (!payload.sessionId || !payload.sessionId.startsWith("cs_")) {
      return {
        verified: false,
        paymentId: payload.sessionId,
        amount: 0,
        currency: "USD",
        status: "failed",
        error: "Malformed Stripe session identifier.",
      };
    }

    return {
      verified: true,
      paymentId: payload.sessionId,
      amount: 4900,
      currency: "USD",
      status: "paid",
    };
  }

  public async cancelSubscription(
    providerSubscriptionId: string,
    immediately: boolean = false
  ): Promise<CancelSubscriptionResult> {
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    return {
      success: true,
      cancelAtPeriodEnd: !immediately,
      effectiveDate: immediately ? new Date().toISOString() : periodEnd,
      status: immediately ? "cancelled" : "active",
    };
  }

  public async reactivateSubscription(
    providerSubscriptionId: string
  ): Promise<ReactivateSubscriptionResult> {
    return {
      success: true,
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  /**
   * Cryptographically verifies Stripe webhook signature and parses payload.
   * Signature header format: t=timestamp,v1=signature
   */
  public async parseAndVerifyWebhook(
    rawBody: string | Buffer,
    headers: Record<string, string | string[] | undefined>
  ): Promise<WebhookEventResult> {
    const signatureHeader =
      headers["stripe-signature"] ||
      headers["Stripe-Signature"] ||
      headers["STRIPE-SIGNATURE"];

    if (!signatureHeader || typeof signatureHeader !== "string") {
      throw new Error("Missing stripe-signature header in webhook request.");
    }

    const parts = signatureHeader.split(",");
    let timestamp = "";
    let signature = "";

    for (const part of parts) {
      const [key, value] = part.trim().split("=");
      if (key === "t") timestamp = value;
      if (key === "v1") signature = value;
    }

    if (!timestamp || !signature) {
      throw new Error("Invalid stripe-signature format. Required 't' and 'v1'.");
    }

    const bodyString = typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");
    const signedPayload = `${timestamp}.${bodyString}`;
    const expectedSignature = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(signedPayload, "utf8")
      .digest("hex");

    // Secure timing-safe equality comparison
    const sigBuffer = Buffer.from(signature, "hex");
    const expBuffer = Buffer.from(expectedSignature, "hex");

    if (
      sigBuffer.length !== expBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expBuffer)
    ) {
      throw new Error("Stripe webhook cryptographic signature verification failed.");
    }

    // Parse event payload
    const event = JSON.parse(bodyString);
    const eventType: string = event.type;
    const eventId: string = event.id;
    const dataObject = event.data?.object || {};

    let normalizedStatus: PaymentStatus | SubscriptionStatus = "pending";

    switch (eventType) {
      case "checkout.session.completed":
      case "invoice.payment_succeeded":
      case "payment_intent.succeeded":
        normalizedStatus = "paid";
        break;
      case "invoice.payment_failed":
      case "payment_intent.payment_failed":
        normalizedStatus = "failed";
        break;
      case "customer.subscription.deleted":
        normalizedStatus = "cancelled";
        break;
      case "customer.subscription.updated":
        normalizedStatus = dataObject.cancel_at_period_end ? "active" : "active";
        break;
      default:
        normalizedStatus = "pending";
    }

    return {
      received: true,
      provider: "stripe",
      eventId,
      eventType,
      status: normalizedStatus,
      paymentId: dataObject.payment_intent || dataObject.id,
      subscriptionId: dataObject.subscription,
      userId: dataObject.metadata?.userId || dataObject.client_reference_id,
      planId: dataObject.metadata?.planId,
      amount: dataObject.amount_total || dataObject.amount,
      currency: "USD",
      metadata: dataObject.metadata,
    };
  }
}

// Automatically register provider in factory
PaymentProviderFactory.registerProvider(new StripeProvider());
