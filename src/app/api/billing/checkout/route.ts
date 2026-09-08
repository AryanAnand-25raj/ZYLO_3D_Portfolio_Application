import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PlanService } from "@/modules/billing/plans.config";
import { BillingStoreManager } from "@/modules/billing/store";
import { PaymentProviderFactory } from "@/modules/billing/providers";
import { Currency, PaymentProviderName } from "@/modules/billing/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const body = await req.json().catch(() => ({}));

    const userId = body.userId || (session?.user as any)?.id || "user-demo";
    const userEmail = session?.user?.email || body.userEmail || "creator@zylo.design";
    const userName = session?.user?.name || body.userName || "Creator";

    const {
      planId,
      currency = "INR",
      provider: requestedProvider,
      successUrl = "http://localhost:3000/dashboard/billing?payment=success",
      cancelUrl = "http://localhost:3000/pricing?payment=cancelled",
    } = body;

    if (!planId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter 'planId'." },
        { status: 400 }
      );
    }

    const plan = PlanService.getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { success: false, error: `Invalid plan ID "${planId}".` },
        { status: 400 }
      );
    }

    // 1. Authoritative price lookup — client amount is strictly ignored
    const selectedCurrency: Currency = currency === "USD" ? "USD" : "INR";
    const priceInfo = PlanService.getAuthoritativePrice(plan.id, selectedCurrency);
    if (!priceInfo) {
      return NextResponse.json(
        { success: false, error: "Failed to resolve authoritative plan pricing." },
        { status: 500 }
      );
    }

    // 2. Select appropriate payment provider (Razorpay for INR, Stripe for USD or explicit override)
    const providerName: PaymentProviderName =
      requestedProvider || (selectedCurrency === "INR" ? "razorpay" : "stripe");
    const provider = PaymentProviderFactory.getProvider(providerName);

    // 3. Create checkout session via provider
    const checkoutResult = await provider.createCheckoutSession({
      planId: plan.id,
      currency: selectedCurrency,
      provider: providerName,
      userId,
      userEmail,
      userName,
      successUrl,
      cancelUrl,
      billingInterval: plan.billingInterval,
    });

    // 4. Log pending payment record
    const payment = await BillingStoreManager.createPayment({
      userId,
      provider: providerName,
      providerPaymentId: checkoutResult.sessionId,
      providerOrderId: checkoutResult.providerOrderId,
      amount: checkoutResult.amount,
      currency: selectedCurrency,
      status: "pending",
      metadata: {
        planId: plan.id,
        planCode: plan.code,
        billingInterval: plan.billingInterval,
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutResult.checkoutUrl,
      sessionId: checkoutResult.sessionId,
      paymentId: payment.id,
      provider: providerName,
      amount: checkoutResult.amount,
      currency: selectedCurrency,
      plan: {
        id: plan.id,
        code: plan.code,
        name: plan.name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Checkout initialization failed",
      },
      { status: 500 }
    );
  }
}
