import {
  PaymentProviderName,
  Currency,
  CheckoutOptions,
  CheckoutSessionResult,
  PaymentVerificationResult,
  CancelSubscriptionResult,
  ReactivateSubscriptionResult,
  WebhookEventResult,
} from "../types";

export interface PaymentProvider {
  readonly name: PaymentProviderName;

  createCheckoutSession(options: CheckoutOptions): Promise<CheckoutSessionResult>;

  verifyPayment(payload: any): Promise<PaymentVerificationResult>;

  cancelSubscription(
    providerSubscriptionId: string,
    immediately?: boolean
  ): Promise<CancelSubscriptionResult>;

  reactivateSubscription(
    providerSubscriptionId: string
  ): Promise<ReactivateSubscriptionResult>;

  parseAndVerifyWebhook(
    rawBody: string | Buffer,
    headers: Record<string, string | string[] | undefined>
  ): Promise<WebhookEventResult>;
}

export class PaymentProviderFactory {
  private static providers: Map<PaymentProviderName, PaymentProvider> = new Map();

  public static registerProvider(provider: PaymentProvider): void {
    this.providers.set(provider.name, provider);
  }

  public static getProvider(identifier: Currency | PaymentProviderName): PaymentProvider {
    if (identifier === "INR") {
      const p = this.providers.get("razorpay");
      if (!p) throw new Error("Razorpay provider not registered.");
      return p;
    }

    if (identifier === "USD") {
      const p = this.providers.get("stripe");
      if (!p) throw new Error("Stripe provider not registered.");
      return p;
    }

    const p = this.providers.get(identifier as PaymentProviderName);
    if (!p) throw new Error(`Provider "${identifier}" not registered.`);
    return p;
  }
}
