"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  Download,
  Calendar,
  Layers,
  Cpu,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { SubscriptionRecord, PaymentRecord, InvoiceRecord } from "@/modules/billing/types";

export default function BillingDashboardPage() {
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [plan, setPlan] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const [subRes, payRes] = await Promise.all([
        fetch("/api/billing/subscription"),
        fetch("/api/billing/payments"),
      ]);

      const subData = await subRes.json();
      const payData = await payRes.json();

      if (subData.success) {
        setSubscription(subData.subscription);
        setPlan(subData.plan);
        setUsage(subData.usage);
      }

      if (payData.success) {
        setPayments(payData.payments || []);
        setInvoices(payData.invoices || []);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load billing information." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleCancelSubscription = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelAtPeriodEnd: true }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);
        setShowCancelModal(false);
        setMessage({
          type: "success",
          text: data.message || "Subscription scheduled for cancellation.",
        });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to cancel subscription." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error while cancelling." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/billing/reactivate", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);
        setMessage({
          type: "success",
          text: "Subscription successfully reactivated! Continuous access resumed.",
        });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to reactivate." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error while reactivating." });
    } finally {
      setActionLoading(false);
    }
  };

  const isPro = subscription?.planCode === "PRO" || subscription?.planCode === "AGENCY";
  const isPendingCancellation = subscription?.cancelAtPeriodEnd;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-cyan-400" />
            <span>Billing & Subscription Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your spatial computing tier, payment methods, and automated invoices.
          </p>
        </div>
        <Link
          href="/pricing"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-md shadow-cyan-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View All Plans</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Status Notifications */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs flex items-center justify-between border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/20 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Cancellation Warning Banner if pending period end */}
      {isPendingCancellation && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Your subscription is scheduled to cancel on{" "}
              <strong>
                {subscription?.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                  : "end of billing cycle"}
              </strong>
              . You still have full access to Pro features until this date.
            </span>
          </div>
          <button
            onClick={handleReactivateSubscription}
            disabled={actionLoading}
            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors shrink-0"
          >
            {actionLoading ? "Reactivating..." : "Reactivate Subscription"}
          </button>
        </div>
      )}

      {/* Active Subscription Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Active Tier
              </span>
              <span
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-bold flex items-center gap-1.5 ${
                  subscription?.status === "active"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-500/10 border-slate-500/30 text-slate-400"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{subscription?.status.toUpperCase() || "ACTIVE"}</span>
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">
                {plan?.name || "Starter Dimension"}
              </h2>
              {isPro && (
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
                  PRO
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {plan?.description ||
                "Standard portfolio generation with neural and minimal templates on free hosted subdomain."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs">
              <div>
                <div className="text-slate-500 font-mono text-[11px]">Billing Cycle</div>
                <div className="font-semibold text-slate-200 capitalize">
                  {plan?.billingInterval || "Monthly"}
                </div>
              </div>

              <div>
                <div className="text-slate-500 font-mono text-[11px]">Renewal Date</div>
                <div className="font-semibold text-slate-200">
                  {subscription?.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : "Lifetime / N/A"}
                </div>
              </div>

              <div>
                <div className="text-slate-500 font-mono text-[11px]">Provider</div>
                <div className="font-semibold text-slate-200 capitalize">
                  {subscription?.provider || "Stripe"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap items-center gap-3">
            {!isPro ? (
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Upgrade to Pro (₹1,999 / $149)</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
                >
                  Change Plan
                </Link>
                {!isPendingCancellation && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Quota & AI Usage Gauges */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
              Resource Usage & Quotas
            </div>

            {/* AI Generations */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Content & 3D Quota</span>
                </span>
                <span className="font-mono text-cyan-400">
                  {usage?.aiGenerationsUsed || 0} / {usage?.aiGenerationsLimit || 5}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      ((usage?.aiGenerationsUsed || 1) / (usage?.aiGenerationsLimit || 5)) * 100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Resets on your next billing cycle.
              </span>
            </div>

            {/* Portfolios Count */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>3D Dimensions Created</span>
                </span>
                <span className="font-mono text-purple-400">
                  {usage?.portfoliosCount || 1} / {usage?.portfoliosLimit || 1}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      ((usage?.portfoliosCount || 1) / (usage?.portfoliosLimit || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AI limits protect GPU infrastructure and prevent token exhaustion.</span>
          </div>
        </div>
      </div>

      {/* Invoices and Payments History Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-white/10 shadow-xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Payment & Invoicing History</span>
        </h3>

        {invoices.length === 0 && payments.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            No payment records found. Invoices will automatically appear here following completed checkouts.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                  <th className="pb-3 font-medium">Invoice / Transaction</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Provider</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-medium text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 text-slate-400">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-slate-200">
                      {inv.currency === "INR" ? `₹${inv.amount / 100}` : `$${inv.amount / 100}`}
                    </td>
                    <td className="py-3 text-slate-400">Razorpay / Stripe</td>
                    <td className="py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => alert(`Invoice ${inv.invoiceNumber} PDF download initiated.`)}
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-rose-500/30 p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Cancel Subscription?
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your 3D portfolios will <strong>not be deleted</strong>. You will retain full Pro benefits until{" "}
              <strong>
                {subscription?.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                  : "the end of your billing period"}
              </strong>
              , after which your account will gracefully downgrade to Starter limits.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-white transition-colors"
              >
                {actionLoading ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
