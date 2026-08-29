"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Box, Lock, Mail, User, ArrowRight, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct signIn via credentials handles account generation in foundation stage
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zylo-dark relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zylo-purple/15 blur-[130px] pointer-events-none rounded-full" />

      <Card className="glass-panel border-zylo-border w-full max-w-md p-2 shadow-2xl relative z-10">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-zylo-cyan via-zylo-purple to-zylo-pink flex items-center justify-center p-[1px] shadow-[0_0_25px_rgba(157,0,255,0.35)]">
            <div className="w-full h-full bg-zylo-dark rounded-[15px] flex items-center justify-center">
              <Box className="w-6 h-6 text-zylo-cyan" />
            </div>
          </div>
          <CardTitle className="text-2xl font-heading font-bold text-white">
            Create Your 3D Studio Account
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Build and launch high-impact 3D portfolios in minutes.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zylo-purple" /> Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                required
                className="bg-zylo-surface/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zylo-purple" /> Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@design.io"
                required
                className="bg-zylo-surface/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zylo-purple" /> Password
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
              variant="neon"
              className="w-full h-11 text-sm font-semibold gap-2 mt-2"
              disabled={loading}
            >
              {loading ? "Creating Studio..." : "Get Started Free"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-zylo-border/60 pt-4 text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link href="/login" className="text-zylo-cyan hover:underline ml-1 font-medium">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
