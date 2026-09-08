import { describe, it, expect, beforeEach } from "vitest";
import crypto from "crypto";
import { NextRequest } from "next/server";
import {
  PlanService,
  PLANS,
  BillingStoreManager,
  EntitlementService,
  EntitlementError,
  PaymentProviderFactory,
  StripeProvider,
  RazorpayProvider,
} from "../src/modules/billing";
import { POST as checkoutRoute } from "../src/app/api/billing/checkout/route";
import { GET as plansRoute } from "../src/app/api/billing/plans/route";
import { GET as subscriptionRoute } from "../src/app/api/billing/subscription/route";
import { POST as cancelRoute } from "../src/app/api/billing/cancel/route";
import { POST as reactivateRoute } from "../src/app/api/billing/reactivate/route";
import { POST as stripeWebhookRoute } from "../src/app/api/payments/stripe/webhook/route";
import { POST as razorpayWebhookRoute } from "../src/app/api/payments/razorpay/webhook/route";

describe("Task 10 — Payments & Billing Engine", () => {
  const STRIPE_SECRET = "whsec_test_zylo_stripe_mock_secret_key";
  const RZP_WEBHOOK_SECRET = "whsec_test_zylo_razorpay_mock_secret_key";
  const RZP_KEY_SECRET = "rzp_test_zylo_mock_key_secret_12345";

  beforeEach(() => {
    BillingStoreManager.resetBillingState();
  });

  // =========================================================================
  // 1. PLAN CONFIGURATION & AUTHORITATIVE PRICING
  // =========================================================================
  describe("1. Plan Configuration & Authoritative Pricing", () => {
    it("lists all active commercial plans with correct metadata", () => {
      const plans = PlanService.getAllPlans();
      expect(plans.length).toBe(3);

      const codes = plans.map((p) => p.code);
      expect(codes).toContain("STARTER");
      expect(codes).toContain("PRO");
      expect(codes).toContain("AGENCY");
    });

    it("fetches plans by ID and case-insensitive code", () => {
      const planStarter = PlanService.getPlanById("plan_starter");
      expect(planStarter).not.toBeNull();
      expect(planStarter?.code).toBe("STARTER");

      const planPro = PlanService.getPlanByCode("pro");
      expect(planPro).not.toBeNull();
      expect(planPro?.id).toBe("plan_pro");

      const invalid = PlanService.getPlanById("non-existent-plan");
      expect(invalid).toBeNull();
    });

    it("resolves exact server-authoritative pricing for India (INR) starting at ₹500", () => {
      const starterInr = PlanService.getAuthoritativePrice("plan_starter", "INR");
      expect(starterInr).not.toBeNull();
      expect(starterInr?.amount).toBe(50000); // 50000 paise = ₹500
      expect(starterInr?.displayPrice).toBe(500);
      expect(starterInr?.currency).toBe("INR");

      const proInr = PlanService.getAuthoritativePrice("plan_pro", "INR");
      expect(proInr?.amount).toBe(199900); // ₹1,999 in paise
      expect(proInr?.displayPrice).toBe(1999);

      const agencyInr = PlanService.getAuthoritativePrice("plan_agency", "INR");
      expect(agencyInr?.amount).toBe(599900); // ₹5,999 in paise
      expect(agencyInr?.displayPrice).toBe(5999);
    });

    it("resolves exact server-authoritative pricing for Global (USD) starting at $49", () => {
      const starterUsd = PlanService.getAuthoritativePrice("plan_starter", "USD");
      expect(starterUsd).not.toBeNull();
      expect(starterUsd?.amount).toBe(4900); // 4900 cents = $49
      expect(starterUsd?.displayPrice).toBe(49);
      expect(starterUsd?.currency).toBe("USD");

      const proUsd = PlanService.getAuthoritativePrice("plan_pro", "USD");
      expect(proUsd?.amount).toBe(14900); // $149 in cents
      expect(proUsd?.displayPrice).toBe(149);

      const agencyUsd = PlanService.getAuthoritativePrice("plan_agency", "USD");
      expect(agencyUsd?.amount).toBe(39900); // $399 in cents
      expect(agencyUsd?.displayPrice).toBe(399);
    });

    it("rejects price lookup for invalid plan identifiers", () => {
      const bad = PlanService.getAuthoritativePrice("fake_tier", "USD");
      expect(bad).toBeNull();
    });
  });

  // =========================================================================
  // 2. MULTI-PROVIDER ROUTING & CHECKOUT SESSIONS
  // =========================================================================
  describe("2. Payment Provider Routing & Checkout Sessions", () => {
    it("routes INR currency to RazorpayProvider", async () => {
      const provider = PaymentProviderFactory.getProvider("INR");
      expect(provider.name).toBe("razorpay");

      const session = await provider.createCheckoutSession({
        planId: "plan_starter",
        currency: "INR",
        userId: "user-in-1",
        successUrl: "https://zylo.design/billing/success",
        cancelUrl: "https://zylo.design/billing/cancel",
      });

      expect(session.provider).toBe("razorpay");
      expect(session.currency).toBe("INR");
      expect(session.amount).toBe(50000);
      expect(session.providerOrderId).toBeDefined();
      expect(session.sessionId).toContain("order_rzp_");
      expect(session.checkoutUrl).toContain("provider=razorpay");
    });

    it("routes USD currency to StripeProvider", async () => {
      const provider = PaymentProviderFactory.getProvider("USD");
      expect(provider.name).toBe("stripe");

      const session = await provider.createCheckoutSession({
        planId: "plan_pro",
        currency: "USD",
        userId: "user-us-1",
        successUrl: "https://zylo.design/billing/success",
        cancelUrl: "https://zylo.design/billing/cancel",
      });

      expect(session.provider).toBe("stripe");
      expect(session.currency).toBe("USD");
      expect(session.amount).toBe(14900);
      expect(session.sessionId).toContain("cs_stripe_");
      expect(session.checkoutUrl).toContain("provider=stripe");
    });

    it("prevents client-side price tampering by resolving authoritative prices server-side", async () => {
      const stripeProvider = PaymentProviderFactory.getProvider("stripe");
      const rzpProvider = PaymentProviderFactory.getProvider("razorpay");

      // Even if attacker attempted to supply lower amount, createCheckoutSession relies strictly on planId
      const sessionStripe = await stripeProvider.createCheckoutSession({
        planId: "plan_pro",
        currency: "USD",
        userId: "hacker-1",
        successUrl: "https://zylo.design/billing/success",
        cancelUrl: "https://zylo.design/billing/cancel",
      });
      expect(sessionStripe.amount).toBe(14900); // Guaranteed $149

      const sessionRzp = await rzpProvider.createCheckoutSession({
        planId: "plan_starter",
        currency: "INR",
        userId: "hacker-2",
        successUrl: "https://zylo.design/billing/success",
        cancelUrl: "https://zylo.design/billing/cancel",
      });
      expect(sessionRzp.amount).toBe(50000); // Guaranteed ₹500
    });

    it("throws when creating checkout session with invalid plan ID", async () => {
      const provider = PaymentProviderFactory.getProvider("USD");
      await expect(
        provider.createCheckoutSession({
          planId: "invalid_plan_999",
          currency: "USD",
          userId: "user-err",
          successUrl: "https://zylo.design",
          cancelUrl: "https://zylo.design",
        })
      ).rejects.toThrow(/Invalid plan ID/);
    });
  });

  // =========================================================================
  // 3. CRYPTOGRAPHIC WEBHOOK HMAC SIGNATURE VERIFICATION
  // =========================================================================
  describe("3. Webhook Cryptographic HMAC Signature Verification", () => {
    it("successfully verifies valid Stripe HMAC-SHA256 signature", async () => {
      const stripeProvider = new StripeProvider();
      stripeProvider.setWebhookSecret(STRIPE_SECRET);

      const timestamp = Math.floor(Date.now() / 1000).toString();
      const payloadObj = {
        id: "evt_stripe_test_123",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_stripe_mock_session_1",
            payment_intent: "pi_stripe_mock_1",
            subscription: "sub_stripe_mock_1",
            amount_total: 14900,
            metadata: {
              userId: "user-stripe-valid",
              planId: "plan_pro",
            },
          },
        },
      };
      const rawBody = JSON.stringify(payloadObj);
      const signedPayload = `${timestamp}.${rawBody}`;
      const validSignature = crypto
        .createHmac("sha256", STRIPE_SECRET)
        .update(signedPayload, "utf8")
        .digest("hex");

      const result = await stripeProvider.parseAndVerifyWebhook(rawBody, {
        "stripe-signature": `t=${timestamp},v1=${validSignature}`,
      });

      expect(result.received).toBe(true);
      expect(result.provider).toBe("stripe");
      expect(result.eventId).toBe("evt_stripe_test_123");
      expect(result.status).toBe("paid");
      expect(result.userId).toBe("user-stripe-valid");
      expect(result.planId).toBe("plan_pro");
      expect(result.amount).toBe(14900);
    });

    it("rejects tampered or spoofed Stripe webhook signatures", async () => {
      const stripeProvider = new StripeProvider();
      stripeProvider.setWebhookSecret(STRIPE_SECRET);

      const timestamp = Math.floor(Date.now() / 1000).toString();
      const rawBody = JSON.stringify({ id: "evt_spoof_1", type: "checkout.session.completed" });
      const spoofedSignature = "deadbeef1234567890abcdefdeadbeef1234567890abcdefdeadbeef12345678";

      await expect(
        stripeProvider.parseAndVerifyWebhook(rawBody, {
          "stripe-signature": `t=${timestamp},v1=${spoofedSignature}`,
        })
      ).rejects.toThrow(/cryptographic signature verification failed/);
    });

    it("rejects Stripe webhook request when signature header is missing", async () => {
      const stripeProvider = new StripeProvider();
      await expect(
        stripeProvider.parseAndVerifyWebhook("{}", {})
      ).rejects.toThrow(/Missing stripe-signature/);
    });

    it("successfully verifies valid Razorpay HMAC-SHA256 signature", async () => {
      const rzpProvider = new RazorpayProvider();
      rzpProvider.setWebhookSecret(RZP_WEBHOOK_SECRET);

      const payloadObj = {
        event: "payment.captured",
        event_id: "evt_rzp_test_456",
        payload: {
          payment: {
            entity: {
              id: "pay_rzp_mock_1",
              amount: 199900,
              notes: {
                userId: "user-rzp-valid",
                planId: "plan_pro",
              },
            },
          },
        },
      };
      const rawBody = JSON.stringify(payloadObj);
      const validSignature = crypto
        .createHmac("sha256", RZP_WEBHOOK_SECRET)
        .update(rawBody, "utf8")
        .digest("hex");

      const result = await rzpProvider.parseAndVerifyWebhook(rawBody, {
        "x-razorpay-signature": validSignature,
      });

      expect(result.received).toBe(true);
      expect(result.provider).toBe("razorpay");
      expect(result.eventId).toBe("evt_rzp_test_456");
      expect(result.status).toBe("paid");
      expect(result.userId).toBe("user-rzp-valid");
      expect(result.planId).toBe("plan_pro");
      expect(result.amount).toBe(199900);
    });

    it("rejects tampered Razorpay webhook signatures", async () => {
      const rzpProvider = new RazorpayProvider();
      rzpProvider.setWebhookSecret(RZP_WEBHOOK_SECRET);

      const rawBody = JSON.stringify({ event: "payment.captured", event_id: "evt_tampered" });
      const fakeSignature = "c0ffee1234567890abcdefc0ffee1234567890abcdefc0ffee1234567890abcdef";

      await expect(
        rzpProvider.parseAndVerifyWebhook(rawBody, {
          "x-razorpay-signature": fakeSignature,
        })
      ).rejects.toThrow(/signature verification failed/);
    });
  });

  // =========================================================================
  // 4. WEBHOOK IDEMPOTENCY & DUPLICATE EVENT HANDLING
  // =========================================================================
  describe("4. Webhook Idempotency & Duplicate Replay Protection", () => {
    it("processes webhook event once and rejects duplicate replay gracefully", async () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const payloadObj = {
        id: "evt_idempotent_test_001",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_idempotent",
            amount_total: 14900,
            metadata: {
              userId: "user-idempotent",
              planId: "plan_pro",
            },
          },
        },
      };
      const rawBody = JSON.stringify(payloadObj);
      const signedPayload = `${timestamp}.${rawBody}`;
      const signature = crypto
        .createHmac("sha256", STRIPE_SECRET)
        .update(signedPayload, "utf8")
        .digest("hex");

      const createReq = () =>
        new NextRequest("http://localhost:3000/api/payments/stripe/webhook", {
          method: "POST",
          body: rawBody,
          headers: {
            "content-type": "application/json",
            "stripe-signature": `t=${timestamp},v1=${signature}`,
          },
        });

      // First run: processes successfully
      const res1 = await stripeWebhookRoute(createReq());
      const body1 = await res1.json();
      expect(res1.status).toBe(200);
      expect(body1.received).toBe(true);
      expect(body1.idempotentReplay).toBeUndefined();

      // Verify user subscription was upgraded to PRO
      const sub1 = await BillingStoreManager.getSubscription("user-idempotent");
      expect(sub1.planCode).toBe("PRO");
      expect(sub1.status).toBe("active");

      // Verify 1 invoice and 1 payment were created
      const payments1 = await BillingStoreManager.listUserPayments("user-idempotent");
      expect(payments1.length).toBe(1);

      // Second run: duplicate replay with identical event ID
      const res2 = await stripeWebhookRoute(createReq());
      const body2 = await res2.json();
      expect(res2.status).toBe(200);
      expect(body2.received).toBe(true);
      expect(body2.idempotentReplay).toBe(true);
      expect(body2.message).toContain("already processed");

      // Verify NO duplicate payment or invoice was created
      const payments2 = await BillingStoreManager.listUserPayments("user-idempotent");
      expect(payments2.length).toBe(1);
    });
  });

  // =========================================================================
  // 5. DECOUPLED ENTITLEMENT SERVICE & FEATURE GATING
  // =========================================================================
  describe("5. Decoupled Entitlement Service (canUse & enforce)", () => {
    it("returns STARTER capabilities for default/new users", async () => {
      const userId = "user-starter-test";

      // Custom domain is gated for Starter
      const domainCheck = await EntitlementService.canUse(userId, "custom_domain");
      expect(domainCheck.allowed).toBe(false);
      expect(domainCheck.reason).toContain("Upgrade to unlock");

      // Premium templates are gated
      const templateCheck = await EntitlementService.canUse(userId, "premium_templates");
      expect(templateCheck.allowed).toBe(false);

      // Advanced 3D is gated
      const adv3dCheck = await EntitlementService.canUse(userId, "advanced_3d");
      expect(adv3dCheck.allowed).toBe(false);

      // Analytics is gated
      const analyticsCheck = await EntitlementService.canUse(userId, "analytics");
      expect(analyticsCheck.allowed).toBe(false);

      // Branding removal is gated
      const brandingCheck = await EntitlementService.canUse(userId, "remove_branding");
      expect(brandingCheck.allowed).toBe(false);

      // Portfolios count limit is 1
      const port0 = await EntitlementService.canUse(userId, "portfolios_count", { count: 0 });
      expect(port0.allowed).toBe(true);
      expect(port0.limit).toBe(1);

      const port1 = await EntitlementService.canUse(userId, "portfolios_count", { count: 1 });
      expect(port1.allowed).toBe(false);
      expect(port1.reason).toContain("reached your limit");
    });

    it("enforces AI generation quota on Starter tier (limit 5)", async () => {
      const userId = "user-ai-starter";

      // 4 generations used: allowed
      const check4 = await EntitlementService.canUse(userId, "ai_generations", { count: 4 });
      expect(check4.allowed).toBe(true);
      expect(check4.limit).toBe(5);

      // 5 generations used: quota exhausted
      const check5 = await EntitlementService.canUse(userId, "ai_generations", { count: 5 });
      expect(check5.allowed).toBe(false);
      expect(check5.reason).toContain("limit of 5");
    });

    it("unlocks PRO capabilities when upgraded", async () => {
      const userId = "user-pro-features";
      await BillingStoreManager.saveSubscription({
        id: `sub_${userId}`,
        userId,
        planId: "plan_pro",
        planCode: "PRO",
        tier: "PRO",
        status: "active",
        provider: "stripe",
        cancelAtPeriodEnd: false,
      });

      // Custom domain allowed
      const domainCheck = await EntitlementService.canUse(userId, "custom_domain");
      expect(domainCheck.allowed).toBe(true);

      // Premium templates allowed
      const templateCheck = await EntitlementService.canUse(userId, "premium_templates");
      expect(templateCheck.allowed).toBe(true);

      // Advanced 3D visual parameters allowed
      const adv3d = await EntitlementService.canUse(userId, "advanced_3d");
      expect(adv3d.allowed).toBe(true);

      // Analytics allowed
      const analytics = await EntitlementService.canUse(userId, "analytics");
      expect(analytics.allowed).toBe(true);

      // AI generations quota expanded to 50
      const ai25 = await EntitlementService.canUse(userId, "ai_generations", { count: 25 });
      expect(ai25.allowed).toBe(true);
      expect(ai25.limit).toBe(50);

      // White labeling remains gated (Agency only)
      const whiteLabel = await EntitlementService.canUse(userId, "white_label");
      expect(whiteLabel.allowed).toBe(false);
    });

    it("throws EntitlementError with HTTP 403 on enforce() failure", async () => {
      const userId = "user-unauth";
      await expect(
        EntitlementService.enforce(userId, "custom_domain")
      ).rejects.toThrow(EntitlementError);

      try {
        await EntitlementService.enforce(userId, "custom_domain");
      } catch (err: any) {
        expect(err.statusCode).toBe(403);
        expect(err.featureKey).toBe("custom_domain");
        expect(err.requiredTier).toBe("PRO");
      }
    });

    it("returns complete user entitlements map", async () => {
      const map = await EntitlementService.getUserEntitlements("user-map-test");
      expect(map.portfolios_count).toBeDefined();
      expect(map.ai_generations).toBeDefined();
      expect(map.custom_domain).toBeDefined();
      expect(map.custom_domain.enabled).toBe(false);
    });
  });

  // =========================================================================
  // 6. CANCELLATION GRACE PERIOD & REACTIVATION
  // =========================================================================
  describe("6. Subscription Cancellation Grace Period & Reactivation", () => {
    it("maintains PRO access during cancelAtPeriodEnd grace period", async () => {
      const userId = "user-grace-period";
      const periodEnd = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(); // 15 days left

      await BillingStoreManager.saveSubscription({
        id: `sub_${userId}`,
        userId,
        planId: "plan_pro",
        planCode: "PRO",
        tier: "PRO",
        status: "active",
        provider: "stripe",
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      });

      // User initiates cancellation
      const cancelled = await BillingStoreManager.cancelSubscription(userId, true);
      expect(cancelled.cancelAtPeriodEnd).toBe(true);
      expect(cancelled.status).toBe("active");
      expect(cancelled.canceledAt).toBeDefined();

      // Crucial: User is still entitled to Pro benefits during remaining period!
      const domainCheck = await EntitlementService.canUse(userId, "custom_domain");
      expect(domainCheck.allowed).toBe(true);

      const templateCheck = await EntitlementService.canUse(userId, "premium_templates");
      expect(templateCheck.allowed).toBe(true);
    });

    it("reactivates subscription before grace period expires", async () => {
      const userId = "user-reactivate";
      const periodEnd = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString();

      await BillingStoreManager.saveSubscription({
        id: `sub_${userId}`,
        userId,
        planId: "plan_pro",
        planCode: "PRO",
        tier: "PRO",
        status: "active",
        provider: "stripe",
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: true,
        canceledAt: new Date().toISOString(),
      });

      // Reactivate
      const reactivated = await BillingStoreManager.reactivateSubscription(userId);
      expect(reactivated.cancelAtPeriodEnd).toBe(false);
      expect(reactivated.canceledAt).toBeUndefined();
      expect(reactivated.status).toBe("active");

      const check = await EntitlementService.canUse(userId, "custom_domain");
      expect(check.allowed).toBe(true);
    });

    it("degrades to STARTER tier once subscription period expires", async () => {
      const userId = "user-expired";
      const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Expired 1 day ago

      await BillingStoreManager.saveSubscription({
        id: `sub_${userId}`,
        userId,
        planId: "plan_pro",
        planCode: "PRO",
        tier: "PRO",
        status: "expired",
        provider: "stripe",
        currentPeriodEnd: expiredDate,
        cancelAtPeriodEnd: true,
      });

      // Expired: custom_domain should now be denied
      const check = await EntitlementService.canUse(userId, "custom_domain");
      expect(check.allowed).toBe(false);
    });
  });

  // =========================================================================
  // 7. INVOICING & PAYMENT HISTORY
  // =========================================================================
  describe("7. Invoicing & Payment History", () => {
    it("creates, updates, and lists payments and invoices correctly", async () => {
      const userId = "user-invoice-test";

      const pay = await BillingStoreManager.createPayment({
        userId,
        provider: "razorpay",
        providerPaymentId: "pay_rzp_987",
        providerOrderId: "order_rzp_987",
        amount: 50000,
        currency: "INR",
        status: "paid",
        metadata: { planId: "plan_starter" },
      });

      expect(pay.id).toBeDefined();
      expect(pay.status).toBe("paid");

      const inv = await BillingStoreManager.createInvoice({
        userId,
        paymentId: pay.id,
        invoiceNumber: "INV-2026-0001",
        amount: 50000,
        currency: "INR",
        status: "paid",
        periodStart: new Date().toISOString(),
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date().toISOString(),
      });

      expect(inv.invoiceNumber).toBe("INV-2026-0001");

      const payments = await BillingStoreManager.listUserPayments(userId);
      expect(payments.length).toBe(1);
      expect(payments[0].amount).toBe(50000);

      const invoices = await BillingStoreManager.listUserInvoices(userId);
      expect(invoices.length).toBe(1);
      expect(invoices[0].invoiceNumber).toBe("INV-2026-0001");

      // Handle refund
      await BillingStoreManager.updatePayment(pay.id, {
        status: "refunded",
        refundedAmount: 50000,
      });

      const updatedPay = await BillingStoreManager.getPayment(pay.id);
      expect(updatedPay?.status).toBe("refunded");
      expect(updatedPay?.refundedAmount).toBe(50000);
    });
  });

  // =========================================================================
  // 8. API ROUTE ENDPOINTS
  // =========================================================================
  describe("8. Billing API Route Endpoints", () => {
    it("GET /api/billing/plans returns active plans with INR and USD pricing", async () => {
      const req = new NextRequest("http://localhost:3000/api/billing/plans");
      const res = await plansRoute();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.plans).toBeDefined();
      expect(data.plans.length).toBe(3);

      const starter = data.plans.find((p: any) => p.code === "STARTER");
      expect(starter.priceInr).toBe(50000);
      expect(starter.displayPriceInr).toBe(500);
      expect(starter.priceUsd).toBe(4900);
      expect(starter.displayPriceUsd).toBe(49);
    });

    it("POST /api/billing/checkout creates valid checkout session for INR", async () => {
      const req = new NextRequest("http://localhost:3000/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({
          planId: "plan_starter",
          currency: "INR",
          userId: "user-api-checkout",
        }),
        headers: { "content-type": "application/json" },
      });

      const res = await checkoutRoute(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.provider).toBe("razorpay");
      expect(data.amount).toBe(50000);
      expect(data.currency).toBe("INR");
      expect(data.checkoutUrl).toContain("provider=razorpay");
    });

    it("POST /api/billing/checkout creates valid checkout session for USD", async () => {
      const req = new NextRequest("http://localhost:3000/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({
          planId: "plan_pro",
          currency: "USD",
          userId: "user-api-checkout-usd",
        }),
        headers: { "content-type": "application/json" },
      });

      const res = await checkoutRoute(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.provider).toBe("stripe");
      expect(data.amount).toBe(14900);
      expect(data.currency).toBe("USD");
      expect(data.checkoutUrl).toContain("provider=stripe");
    });

    it("POST /api/billing/checkout rejects invalid plan", async () => {
      const req = new NextRequest("http://localhost:3000/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({
          planId: "plan_invalid",
          currency: "USD",
        }),
        headers: { "content-type": "application/json" },
      });

      const res = await checkoutRoute(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Invalid plan ID");
    });

    it("GET /api/billing/subscription returns subscription and user entitlements", async () => {
      const req = new NextRequest("http://localhost:3000/api/billing/subscription?userId=user-sub-api");
      const res = await subscriptionRoute(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.subscription).toBeDefined();
      expect(data.subscription.planCode).toBe("STARTER");
      expect(data.entitlements).toBeDefined();
      expect(data.entitlements.custom_domain.enabled).toBe(false);
    });

    it("POST /api/billing/cancel initiates grace period cancellation", async () => {
      const userId = "user-cancel-api";
      await BillingStoreManager.saveSubscription({
        id: `sub_${userId}`,
        userId,
        planId: "plan_pro",
        planCode: "PRO",
        tier: "PRO",
        status: "active",
        provider: "stripe",
        currentPeriodEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
      });

      const req = new NextRequest("http://localhost:3000/api/billing/cancel", {
        method: "POST",
        body: JSON.stringify({ userId, cancelAtPeriodEnd: true }),
        headers: { "content-type": "application/json" },
      });

      const res = await cancelRoute(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.subscription.cancelAtPeriodEnd).toBe(true);
      expect(data.effectiveDate).toBeDefined();
    });

    it("POST /api/billing/reactivate reactivates subscription before expiry", async () => {
      const userId = "user-reactivate-api";
      await BillingStoreManager.saveSubscription({
        id: `sub_${userId}`,
        userId,
        planId: "plan_pro",
        planCode: "PRO",
        tier: "PRO",
        status: "active",
        provider: "stripe",
        currentPeriodEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: true,
      });

      const req = new NextRequest("http://localhost:3000/api/billing/reactivate", {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: { "content-type": "application/json" },
      });

      const res = await reactivateRoute(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.subscription.cancelAtPeriodEnd).toBe(false);
      expect(data.subscription.status).toBe("active");
    });
  });
});
