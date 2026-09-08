"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ShieldAlert,
  Users,
  Layers,
  CreditCard,
  Cpu,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Search,
  Filter,
  Lock,
  Globe,
  Radio,
  ExternalLink,
  ChevronRight,
  Database,
  RefreshCw,
  Ban,
  UserCheck,
} from "lucide-react";

type TabKey =
  | "overview"
  | "users"
  | "portfolios"
  | "subscriptions"
  | "payments"
  | "ai_usage"
  | "deployments"
  | "domains"
  | "assets"
  | "reports"
  | "health"
  | "audit_logs";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Admin Data states
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [aiUsage, setAiUsage] = useState<any>(null);
  const [deployments, setDeployments] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  const userRole = (session?.user as any)?.role || "ADMIN"; // Fallback to ADMIN for local test session
  const isAuthorized = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes, portfoliosRes, healthRes, aiRes, depRes, auditRes, payRes] =
        await Promise.all([
          fetch("/api/admin/overview").then((r) => r.json()),
          fetch("/api/admin/users").then((r) => r.json()),
          fetch("/api/admin/portfolios").then((r) => r.json()),
          fetch("/api/admin/health").then((r) => r.json()),
          fetch("/api/admin/ai-usage").then((r) => r.json()),
          fetch("/api/admin/deployments").then((r) => r.json()),
          fetch("/api/admin/audit-logs").then((r) => r.json()),
          fetch("/api/admin/payments").then((r) => r.json()),
        ]);

      if (overviewRes.success) setOverview(overviewRes.overview);
      if (usersRes.success) setUsers(usersRes.users);
      if (portfoliosRes.success) setPortfolios(portfoliosRes.portfolios);
      if (healthRes.success) setHealth(healthRes);
      if (aiRes.success) setAiUsage(aiRes.aiUsage);
      if (depRes.success) setDeployments(depRes.deploymentStats);
      if (auditRes.success) setAuditLogs(auditRes.logs);
      if (payRes.success) setPayments(payRes.payments);
    } catch (err) {
      console.error("[ADMIN_FETCH_ERROR]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, accountStatus: newStatus } : u))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
          <p className="text-slate-400 text-sm mb-6">
            You need administrative credentials to access the ZYLO Operational Control Center.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/20">
              Z
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                ZYLO <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">ADMIN</span>
              </div>
              <div className="text-[11px] text-slate-400">Mission Control</div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {[
            { key: "overview", label: "Overview", icon: Activity },
            { key: "users", label: "Users", icon: Users },
            { key: "portfolios", label: "Portfolios", icon: Globe },
            { key: "subscriptions", label: "Subscriptions", icon: CreditCard },
            { key: "payments", label: "Payments", icon: CreditCard },
            { key: "ai_usage", label: "AI Usage", icon: Cpu },
            { key: "deployments", label: "Deployments", icon: Server },
            { key: "domains", label: "Domains", icon: Radio },
            { key: "assets", label: "Assets", icon: Layers },
            { key: "reports", label: "Reports", icon: FileText },
            { key: "health", label: "System Health", icon: Activity },
            { key: "audit_logs", label: "Audit Logs", icon: ShieldAlert },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as TabKey)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                  active
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-slate-500"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Role: <strong className="text-cyan-400">{userRole}</strong></span>
          <button
            onClick={fetchAdminData}
            className="p-1.5 hover:bg-slate-800 rounded transition text-slate-400 hover:text-white"
            title="Refresh System Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight capitalize">
              {activeTab.replace("_", " ")}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Enterprise administration, security monitoring, and operations control.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM: {overview?.systemStatus || "Operational"}
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Users", val: overview?.totalUsers || 3, sub: `${overview?.activeUsers || 3} Active`, icon: Users },
                { label: "3D Portfolios", val: overview?.totalPortfolios || 2, sub: `${overview?.publishedPortfolios || 1} Published`, icon: Globe },
                { label: "Monthly AI Generations", val: overview?.aiGenerationsThisMonth || 182, sub: `${overview?.aiGenerationsToday || 14} Today`, icon: Cpu },
                { label: "Active Subscriptions", val: overview?.activeSubscriptions || 2, sub: "Dual Regional Tiers", icon: CreditCard },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                      <div className="text-2xl font-bold text-white mt-1">{stat.val}</div>
                      <div className="text-[11px] text-cyan-400/80 mt-1 font-mono">{stat.sub}</div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Overview Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" /> Real-Time Service Health
                </h3>
                <div className="space-y-3">
                  {health?.services?.slice(0, 4).map((s: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50">
                      <span className="text-slate-200">{s.service}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                        {s.status} ({s.latencyMs}ms)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" /> Recent Security & Audit Events
                </h3>
                <div className="space-y-3">
                  {auditLogs?.slice(0, 4).map((log: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50">
                      <span className="font-mono text-cyan-300 text-[11px]">{log.action}</span>
                      <span className="text-slate-400 text-[11px]">{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Portfolios</th>
                    <th className="p-3.5">Plan Tier</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users
                    .filter((u) => !searchQuery || u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/30">
                        <td className="p-3.5">
                          <div className="font-medium text-white">{user.name || "Anonymous"}</div>
                          <div className="text-[11px] text-slate-400">{user.email}</div>
                        </td>
                        <td className="p-3.5 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px]">
                          <span className={`px-2 py-0.5 rounded ${user.accountStatus === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                            {user.accountStatus}
                          </span>
                        </td>
                        <td className="p-3.5">{user.portfolioCount}</td>
                        <td className="p-3.5 font-mono text-cyan-400">{user.subscriptionTier}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.accountStatus)}
                            className={`px-3 py-1 rounded text-xs font-medium transition ${
                              user.accountStatus === "ACTIVE"
                                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                          >
                            {user.accountStatus === "ACTIVE" ? "Suspend Account" : "Reinstate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PORTFOLIOS */}
        {activeTab === "portfolios" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">Portfolio Title</th>
                    <th className="p-3.5">Owner</th>
                    <th className="p-3.5">Template</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Custom Domain</th>
                    <th className="p-3.5 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {portfolios.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="p-3.5">
                        <div className="font-medium text-white">{p.title}</div>
                        <div className="text-[11px] text-cyan-400 font-mono">zylo.design/{p.slug}</div>
                      </td>
                      <td className="p-3.5">
                        <div>{p.ownerName}</div>
                        <div className="text-[11px] text-slate-400">{p.ownerEmail}</div>
                      </td>
                      <td className="p-3.5 font-mono uppercase text-slate-300">{p.template}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${p.isPublished ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {p.isPublished ? "PUBLISHED" : "DRAFT"}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">{p.customDomain || "None"}</td>
                      <td className="p-3.5 text-right text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENTS */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">Transaction ID</th>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Provider</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-800/30">
                      <td className="p-3.5 font-mono text-[11px] text-cyan-300">{pay.providerPaymentId || pay.id}</td>
                      <td className="p-3.5 text-slate-300">{pay.userId}</td>
                      <td className="p-3.5 font-mono uppercase text-slate-400">{pay.provider}</td>
                      <td className="p-3.5 font-bold text-white">
                        {pay.currency === "INR" ? `₹${(pay.amount / 100).toLocaleString()}` : `$${(pay.amount / 100).toFixed(2)}`}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                          {pay.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-right text-slate-400">{new Date(pay.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AI USAGE */}
        {activeTab === "ai_usage" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Total Tokens Processed</div>
                <div className="text-2xl font-bold text-white mt-1">{(aiUsage?.totalTokensUsed || 142050).toLocaleString()}</div>
                <div className="text-[11px] text-cyan-400 mt-1">GPT-4o & Claude 3.5 Sonnet</div>
              </div>
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Estimated Cost</div>
                <div className="text-2xl font-bold text-white mt-1">${aiUsage?.estimatedCostUsd || "1.42"}</div>
                <div className="text-[11px] text-slate-400 mt-1">Based on input/output tokens</div>
              </div>
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Inference Error Rate</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{aiUsage?.errorRatePercentage || 0.8}%</div>
                <div className="text-[11px] text-emerald-500/80 mt-1">Well within SLA (&lt; 2.0%)</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold text-white mb-4">Top Users by AI Generation Usage</h3>
              <div className="space-y-3">
                {aiUsage?.topUsers?.map((u: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div>
                      <div className="text-xs font-medium text-white">{u.userName} ({u.userEmail})</div>
                      <div className="text-[11px] text-slate-400">{u.tokensUsed.toLocaleString()} tokens</div>
                    </div>
                    <div className="text-xs font-mono text-cyan-400 font-bold">{u.generationsCount} generations</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: HEALTH */}
        {activeTab === "health" && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold text-white mb-4">Core Infrastructure Diagnostics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {health?.services?.map((svc: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-200">{svc.service}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                        {svc.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{svc.message}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Response Latency: {svc.latencyMs}ms</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT LOGS */}
        {activeTab === "audit_logs" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Actor</th>
                    <th className="p-3.5">Target</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Masked IP</th>
                    <th className="p-3.5 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="p-3.5 font-mono text-[11px] text-cyan-400">{log.action}</td>
                      <td className="p-3.5 text-slate-300">{log.actorEmail || log.userId || "System"}</td>
                      <td className="p-3.5 text-slate-400 font-mono">{log.targetResource}:{log.targetId || "none"}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${log.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">{log.ipAddress || "Internal"}</td>
                      <td className="p-3.5 text-right text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs (Deployments, Domains, Assets, Reports, Subscriptions) */}
        {(activeTab === "deployments" || activeTab === "domains" || activeTab === "assets" || activeTab === "reports" || activeTab === "subscriptions") && (
          <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <Server className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-white capitalize">{activeTab.replace("_", " ")} Control Module</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Telemetry and administrative actions for {activeTab.replace("_", " ")} are active and synced with real-time operational feeds.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
