import { db } from "@/lib/db";
import {
  SubscriptionRecord,
  PaymentRecord,
  InvoiceRecord,
  SubscriptionStatus,
  PaymentStatus,
  PaymentProviderName,
  PlanCode,
  Currency,
} from "./types";
import { PlanService } from "./plans.config";

// In-memory persistent caches for unit tests and DB fallback
const inMemorySubscriptions = new Map<string, SubscriptionRecord>();
const inMemoryPayments = new Map<string, PaymentRecord>();
const inMemoryInvoices = new Map<string, InvoiceRecord>();
const inMemoryPaymentEvents = new Map<string, { provider: string; eventId: string; processed: boolean; timestamp: string }>();

export class BillingStoreManager {
  /**
   * Resets in-memory storage (used extensively in test suites).
   */
  public static resetBillingState(): void {
    inMemorySubscriptions.clear();
    inMemoryPayments.clear();
    inMemoryInvoices.clear();
    inMemoryPaymentEvents.clear();
  }

  /**
   * Retrieves active subscription for a user.
   * If none exists in DB/memory, returns a default STARTER (Free) subscription.
   */
  public static async getSubscription(userId: string): Promise<SubscriptionRecord> {
    // 1. Check in-memory
    const memSub = inMemorySubscriptions.get(userId);
    if (memSub) return memSub;

    // 2. Check Prisma DB
    try {
      const dbSub = await (db as any).subscription.findUnique({
        where: { userId },
        include: { plan: true },
      });

      if (dbSub) {
        const mapped: SubscriptionRecord = {
          id: dbSub.id,
          userId: dbSub.userId,
          planId: dbSub.planId || "plan_starter",
          planCode: (dbSub.tier as PlanCode) || "STARTER",
          tier: (dbSub.tier as "FREE" | "PRO" | "AGENCY") || "FREE",
          status: (dbSub.status?.toLowerCase() as SubscriptionStatus) || "active",
          provider: (dbSub.provider as PaymentProviderName) || "mock",
          providerCustomerId: dbSub.providerCustomerId || dbSub.stripeCustomerId || undefined,
          providerSubscriptionId: dbSub.providerSubscriptionId || dbSub.stripeSubscriptionId || undefined,
          currentPeriodStart: dbSub.currentPeriodStart?.toISOString(),
          currentPeriodEnd: dbSub.currentPeriodEnd?.toISOString(),
          cancelAtPeriodEnd: Boolean(dbSub.cancelAtPeriodEnd),
          canceledAt: dbSub.canceledAt?.toISOString(),
          createdAt: dbSub.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: dbSub.updatedAt?.toISOString() || new Date().toISOString(),
        };
        inMemorySubscriptions.set(userId, mapped);
        return mapped;
      }
    } catch {
      // In-memory fallback
    }

    // 3. Fallback: Default Starter Tier
    const defaultSub: SubscriptionRecord = {
      id: `sub-starter-${userId}`,
      userId,
      planId: "plan_starter",
      planCode: "STARTER",
      tier: "FREE",
      status: "active",
      provider: "mock",
      cancelAtPeriodEnd: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemorySubscriptions.set(userId, defaultSub);
    return defaultSub;
  }

  /**
   * Upserts a subscription record across memory and database.
   */
  public static async saveSubscription(
    sub: Omit<SubscriptionRecord, "createdAt" | "updatedAt"> & { createdAt?: string; updatedAt?: string }
  ): Promise<SubscriptionRecord> {
    const now = new Date().toISOString();
    const record: SubscriptionRecord = {
      ...sub,
      createdAt: sub.createdAt || now,
      updatedAt: now,
    };

    inMemorySubscriptions.set(sub.userId, record);

    try {
      await (db as any).subscription.upsert({
        where: { userId: sub.userId },
        update: {
          planId: sub.planId,
          tier: sub.planCode === "PRO" ? "PRO" : sub.planCode === "AGENCY" ? "AGENCY" : "FREE",
          status: sub.status.toUpperCase(),
          provider: sub.provider,
          providerCustomerId: sub.providerCustomerId,
          providerSubscriptionId: sub.providerSubscriptionId,
          currentPeriodStart: sub.currentPeriodStart ? new Date(sub.currentPeriodStart) : null,
          currentPeriodEnd: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : null,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          canceledAt: sub.canceledAt ? new Date(sub.canceledAt) : null,
          updatedAt: new Date(),
        },
        create: {
          id: sub.id,
          userId: sub.userId,
          planId: sub.planId,
          tier: sub.planCode === "PRO" ? "PRO" : sub.planCode === "AGENCY" ? "AGENCY" : "FREE",
          status: sub.status.toUpperCase(),
          provider: sub.provider,
          providerCustomerId: sub.providerCustomerId,
          providerSubscriptionId: sub.providerSubscriptionId,
          currentPeriodStart: sub.currentPeriodStart ? new Date(sub.currentPeriodStart) : null,
          currentPeriodEnd: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : null,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          canceledAt: sub.canceledAt ? new Date(sub.canceledAt) : null,
        },
      });
    } catch {
      // In-memory fallback
    }

    return record;
  }

  /**
   * Graceful subscription cancellation: sets cancelAtPeriodEnd.
   * Access remains active until the end of currentPeriodEnd.
   */
  public static async cancelSubscription(
    userId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<SubscriptionRecord> {
    const sub = await this.getSubscription(userId);

    const updated: SubscriptionRecord = {
      ...sub,
      cancelAtPeriodEnd,
      canceledAt: new Date().toISOString(),
      status: cancelAtPeriodEnd ? sub.status : "cancelled",
      updatedAt: new Date().toISOString(),
    };

    return this.saveSubscription(updated);
  }

  /**
   * Reactivates a subscription pending cancellation prior to period end.
   */
  public static async reactivateSubscription(userId: string): Promise<SubscriptionRecord> {
    const sub = await this.getSubscription(userId);

    const updated: SubscriptionRecord = {
      ...sub,
      cancelAtPeriodEnd: false,
      canceledAt: undefined,
      status: "active",
      updatedAt: new Date().toISOString(),
    };

    return this.saveSubscription(updated);
  }

  /**
   * Records a payment transaction.
   */
  public static async createPayment(
    payment: Omit<PaymentRecord, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ): Promise<PaymentRecord> {
    const id = payment.id || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const record: PaymentRecord = {
      ...payment,
      id,
      refundedAmount: payment.refundedAmount || 0,
      createdAt: now,
      updatedAt: now,
    };

    inMemoryPayments.set(id, record);

    try {
      await (db as any).payment.create({
        data: {
          id: record.id,
          userId: record.userId,
          subscriptionId: record.subscriptionId,
          provider: record.provider,
          providerPaymentId: record.providerPaymentId,
          providerOrderId: record.providerOrderId,
          amount: record.amount,
          currency: record.currency,
          status: record.status,
          receiptUrl: record.receiptUrl,
          errorMessage: record.errorMessage,
          refundedAmount: record.refundedAmount,
          metadata: record.metadata || {},
        },
      });
    } catch {
      // In-memory fallback
    }

    return record;
  }

  /**
   * Updates an existing payment record.
   */
  public static async updatePayment(
    paymentId: string,
    updates: Partial<PaymentRecord>
  ): Promise<PaymentRecord | null> {
    let payment = inMemoryPayments.get(paymentId);
    if (!payment) {
      for (const p of inMemoryPayments.values()) {
        if (p.providerPaymentId === paymentId || p.providerOrderId === paymentId) {
          payment = p;
          break;
        }
      }
    }

    if (!payment) return null;

    const updated: PaymentRecord = {
      ...payment,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    inMemoryPayments.set(updated.id, updated);

    try {
      await (db as any).payment.update({
        where: { id: updated.id },
        data: {
          status: updated.status,
          refundedAmount: updated.refundedAmount,
          errorMessage: updated.errorMessage,
          receiptUrl: updated.receiptUrl,
          updatedAt: new Date(),
        },
      });
    } catch {
      // In-memory fallback
    }

    return updated;
  }

  public static async getPayment(paymentId: string): Promise<PaymentRecord | null> {
    return inMemoryPayments.get(paymentId) || null;
  }

  public static async getPaymentByProviderId(providerPaymentId: string): Promise<PaymentRecord | null> {
    for (const p of inMemoryPayments.values()) {
      if (p.providerPaymentId === providerPaymentId) return p;
    }
    return null;
  }

  public static async listUserPayments(userId: string): Promise<PaymentRecord[]> {
    const list: PaymentRecord[] = [];
    for (const p of inMemoryPayments.values()) {
      if (p.userId === userId) list.push(p);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Creates an invoice record.
   */
  public static async createInvoice(
    invoice: Omit<InvoiceRecord, "id" | "createdAt"> & { id?: string }
  ): Promise<InvoiceRecord> {
    const id = invoice.id || `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const record: InvoiceRecord = {
      ...invoice,
      id,
      createdAt: now,
    };

    inMemoryInvoices.set(id, record);

    try {
      await (db as any).invoice.create({
        data: {
          id: record.id,
          userId: record.userId,
          subscriptionId: record.subscriptionId,
          paymentId: record.paymentId,
          invoiceNumber: record.invoiceNumber,
          amount: record.amount,
          currency: record.currency,
          status: record.status,
          hostedInvoiceUrl: record.hostedInvoiceUrl,
          pdfUrl: record.pdfUrl,
          periodStart: new Date(record.periodStart),
          periodEnd: new Date(record.periodEnd),
          paidAt: record.paidAt ? new Date(record.paidAt) : null,
        },
      });
    } catch {
      // In-memory fallback
    }

    return record;
  }

  public static async listUserInvoices(userId: string): Promise<InvoiceRecord[]> {
    const list: InvoiceRecord[] = [];
    for (const inv of inMemoryInvoices.values()) {
      if (inv.userId === userId) list.push(inv);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Idempotency check for incoming webhook events.
   * Returns true if event has already been recorded and processed.
   */
  public static async isPaymentEventProcessed(
    provider: string,
    eventId: string
  ): Promise<boolean> {
    const key = `${provider}:${eventId}`;
    const mem = inMemoryPaymentEvents.get(key);
    if (mem?.processed) return true;

    try {
      const record = await (db as any).paymentEvent.findUnique({
        where: { eventId },
      });
      if (record && record.processed) {
        inMemoryPaymentEvents.set(key, {
          provider,
          eventId,
          processed: true,
          timestamp: record.createdAt.toISOString(),
        });
        return true;
      }
    } catch {
      // In-memory
    }

    return false;
  }

  /**
   * Records a webhook event idempotently.
   */
  public static async recordPaymentEvent(
    provider: string,
    eventId: string,
    eventType: string,
    payload: any,
    processed: boolean = true
  ): Promise<void> {
    const key = `${provider}:${eventId}`;
    inMemoryPaymentEvents.set(key, {
      provider,
      eventId,
      processed,
      timestamp: new Date().toISOString(),
    });

    try {
      await (db as any).paymentEvent.upsert({
        where: { eventId },
        update: {
          processed,
          processedAt: processed ? new Date() : null,
        },
        create: {
          provider,
          eventId,
          eventType,
          payload,
          processed,
          processedAt: processed ? new Date() : null,
        },
      });
    } catch {
      // In-memory fallback
    }
  }
}
