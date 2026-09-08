"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Box, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("founder@zylo.design");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid credentials. Try the demo account below.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail("founder@zylo.design");
    setPassword("password123");
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: "founder@zylo.design",
        password: "password123",
      });

      if (res?.error) {
        setError("Could not sign in with demo credentials.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred during demo sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zylo-dark relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zylo-cyan/10 blur-[130px] pointer-events-none rounded-full" />

      <Card className="glass-panel border-zylo-border w-full max-w-md p-2 shadow-2xl relative z-10">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-zylo-cyan via-zylo-purple to-zylo-pink flex items-center justify-center p-[1px] shadow-[0_0_25px_rgba(0,240,255,0.35)]">
            <div className="w-full h-full bg-zylo-dark rounded-[15px] flex items-center justify-center">
              <Box className="w-6 h-6 text-zylo-cyan" />
            </div>
          </div>
          <CardTitle className="text-2xl font-heading font-bold text-white">
            Welcome to ZYLO
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Sign in to access your 3D portfolio studio and rendering pipeline.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zylo-cyan" /> Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="bg-zylo-surface/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zylo-cyan" /> Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-zylo-surface/80"
              />
            </div>

            <Button
              type="submit"
              variant="glow"
              className="w-full h-11 text-sm font-semibold gap-2 mt-2"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to Studio"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Access Pill */}
          <div className="mt-6 p-3 rounded-xl bg-zylo-elevated border border-zylo-border text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zylo-cyan" /> Demo Foundation Account:
              </span>
              <Badge variant="cyan" className="text-[10px] py-0 px-1.5">
                Instant Access
              </Badge>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Email: <span className="text-zylo-cyan">founder@zylo.design</span>
            </div>
            <Button
              type="button"
              onClick={handleQuickDemoLogin}
              variant="outline"
              size="sm"
              className="w-full text-xs border-zylo-cyan/40 hover:bg-zylo-cyan/10 text-zylo-cyan hover:text-white gap-1.5 transition-colors"
              disabled={loading}
            >
              <Sparkles className="w-3 h-3" /> Quick Sign In as Demo Founder
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-zylo-border/60 pt-4 text-xs text-slate-400">
          <span>Don&apos;t have an account? </span>
          <Link href="/register" className="text-zylo-cyan hover:underline ml-1 font-medium">
            Create account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
