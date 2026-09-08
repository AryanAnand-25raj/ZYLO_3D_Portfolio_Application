import { NextRequest, NextResponse } from "next/server";
import { PaymentProviderFactory } from "@/modules/billing/providers";
import { BillingStoreManager } from "@/modules/billing/store";
import { PlanService } from "@/modules/billing/plans.config";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headers: Record<string, string | undefined> = {};
    req.headers.forEach((val, key) => {
      headers[key] = val;
    });

    const rzpProvider = PaymentProviderFactory.getProvider("razorpay");
    const event = await rzpProvider.parseAndVerifyWebhook(rawBody, headers);

    // 1. Idempotency Check — discard duplicate events
    const alreadyProcessed = await BillingStoreManager.isPaymentEventProcessed(
      "razorpay",
      event.eventId
    );

    if (alreadyProcessed) {
      return NextResponse.json({
        received: true,
        idempotentReplay: true,
        message: `Event ${event.eventId} was already processed.`,
      });
    }

    // 2. Process Business Logic based on event type
    const userId = event.userId || "user-demo";
    const plan = event.planId ? PlanService.getPlanById(event.planId) : PlanService.getPlanByCode("PRO");

    if (event.status === "paid") {
      const periodStart = new Date().toISOString();
      const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      // Upgrade/Activate Subscription
      await BillingStoreManager.saveSubscription({
        id: `sub_rzp_${userId}`,
        userId,
        planId: plan?.id || "plan_pro",
        planCode: plan?.code || "PRO",
        tier: plan?.code === "AGENCY" ? "AGENCY" : "PRO",
        status: "active",
        provider: "razorpay",
        providerSubscriptionId: event.subscriptionId,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      });

      // Update / Create Payment record
      await BillingStoreManager.createPayment({
        userId,
        provider: "razorpay",
        providerPaymentId: event.paymentId || event.eventId,
        amount: event.amount || 199900,
        currency: "INR",
        status: "paid",
        metadata: {
          planId: plan?.id,
          eventId: event.eventId,
        },
      });

      // Issue invoice
      await BillingStoreManager.createInvoice({
        userId,
        paymentId: event.paymentId || event.eventId,
        invoiceNumber: `INV-RZP-${Date.now().toString().slice(-6)}`,
        amount: event.amount || 199900,
        currency: "INR",
        status: "paid",
        periodStart,
        periodEnd,
        paidAt: new Date().toISOString(),
      });
    } else if (event.status === "failed") {
      await BillingStoreManager.createPayment({
        userId,
        provider: "razorpay",
        providerPaymentId: event.paymentId || event.eventId,
        amount: event.amount || 199900,
        currency: "INR",
        status: "failed",
        errorMessage: "Payment captured failure.",
        metadata: { eventId: event.eventId },
      });
    } else if (event.status === "refunded") {
      const existingPay = await BillingStoreManager.getPaymentByProviderId(event.paymentId || "");
      if (existingPay) {
        await BillingStoreManager.updatePayment(existingPay.id, {
          status: "refunded",
          refundedAmount: event.amount || existingPay.amount,
        });
      }
    } else if (event.status === "cancelled") {
      await BillingStoreManager.cancelSubscription(userId, false);
    }

    // 3. Mark event as processed (Idempotency ledger)
    await BillingStoreManager.recordPaymentEvent(
      "razorpay",
      event.eventId,
      event.eventType,
      JSON.parse(rawBody)
    );

    return NextResponse.json({
      received: true,
      eventId: event.eventId,
      status: event.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        received: false,
        error: error instanceof Error ? error.message : "Razorpay webhook processing failed",
      },
      { status: 400 }
    );
  }
}
