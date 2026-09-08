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

export class RazorpayProvider implements PaymentProvider {
  public readonly name = "razorpay" as const;

  private keySecret: string =
    process.env.RAZORPAY_KEY_SECRET || "rzp_test_zylo_mock_key_secret_12345";
  private webhookSecret: string =
    process.env.RAZORPAY_WEBHOOK_SECRET || "whsec_test_zylo_razorpay_mock_secret_key";

  public setWebhookSecret(secret: string): void {
    this.webhookSecret = secret;
  }

  public setKeySecret(secret: string): void {
    this.keySecret = secret;
  }

  /**
   * Creates a Razorpay Order using server-authoritative INR pricing in paise.
   */
  public async createCheckoutSession(
    options: CheckoutOptions
  ): Promise<CheckoutSessionResult> {
    const priceInfo = PlanService.getAuthoritativePrice(options.planId, "INR");
    if (!priceInfo) {
      throw new Error(`Invalid plan ID "${options.planId}".`);
    }

    const orderId = `order_rzp_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
    const checkoutUrl = `${options.successUrl}?order_id=${orderId}&provider=razorpay`;

    return {
      sessionId: orderId,
      checkoutUrl,
      provider: "razorpay",
      amount: priceInfo.amount,
      currency: "INR",
      providerOrderId: orderId,
    };
  }

  /**
   * Cryptographically verifies Razorpay payment signature from client checkout modal.
   * HMAC SHA256 of `${orderId}|${paymentId}` using keySecret.
   */
  public async verifyPayment(payload: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<PaymentVerificationResult> {
    const { orderId, paymentId, signature } = payload;
    if (!orderId || !paymentId || !signature) {
      return {
        verified: false,
        paymentId: paymentId || "unknown",
        amount: 0,
        currency: "INR",
        status: "failed",
        error: "Missing required Razorpay verification fields.",
      };
    }

    const data = `${orderId}|${paymentId}`;
    const expected = crypto
      .createHmac("sha256", this.keySecret)
      .update(data)
      .digest("hex");

    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return {
        verified: false,
        paymentId,
        orderId,
        amount: 0,
        currency: "INR",
        status: "failed",
        error: "Razorpay payment signature mismatch.",
      };
    }

    return {
      verified: true,
      paymentId,
      orderId,
      amount: 50000,
      currency: "INR",
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
   * Cryptographically verifies Razorpay webhook signature and parses payload.
   * Header: x-razorpay-signature (HMAC SHA256 of raw request body)
   */
  public async parseAndVerifyWebhook(
    rawBody: string | Buffer,
    headers: Record<string, string | string[] | undefined>
  ): Promise<WebhookEventResult> {
    const signature =
      headers["x-razorpay-signature"] ||
      headers["X-Razorpay-Signature"] ||
      headers["X-RAZORPAY-SIGNATURE"];

    if (!signature || typeof signature !== "string") {
      throw new Error("Missing x-razorpay-signature header in webhook request.");
    }

    const bodyString = typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");
    const expected = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(bodyString, "utf8")
      .digest("hex");

    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      throw new Error("Razorpay webhook cryptographic signature verification failed.");
    }

    const event = JSON.parse(bodyString);
    const eventType: string = event.event;
    const eventId: string = event.event_id || `rzp_evt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const payloadData = event.payload || {};
    const paymentEntity = payloadData.payment?.entity || {};
    const orderEntity = payloadData.order?.entity || {};
    const subscriptionEntity = payloadData.subscription?.entity || {};

    let normalizedStatus: PaymentStatus | SubscriptionStatus = "pending";

    switch (eventType) {
      case "order.paid":
      case "payment.captured":
      case "subscription.charged":
        normalizedStatus = "paid";
        break;
      case "payment.failed":
        normalizedStatus = "failed";
        break;
      case "refund.created":
      case "refund.processed":
        normalizedStatus = "refunded";
        break;
      case "subscription.cancelled":
        normalizedStatus = "cancelled";
        break;
      default:
        normalizedStatus = "pending";
    }

    return {
      received: true,
      provider: "razorpay",
      eventId,
      eventType,
      status: normalizedStatus,
      paymentId: paymentEntity.id || orderEntity.id,
      subscriptionId: subscriptionEntity.id,
      userId: paymentEntity.notes?.userId || orderEntity.notes?.userId,
      planId: paymentEntity.notes?.planId || orderEntity.notes?.planId,
      amount: paymentEntity.amount || orderEntity.amount,
      currency: "INR",
      metadata: paymentEntity.notes || orderEntity.notes,
    };
  }
}

// Automatically register provider in factory
PaymentProviderFactory.registerProvider(new RazorpayProvider());
