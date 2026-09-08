"use client";

import React, { useState } from "react";
import { MessageSquare, AlertTriangle, CheckCircle2, X, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface FeedbackSubmission {
  type: "feedback" | "bug";
  category: "3d_engine" | "ai_generation" | "builder" | "billing" | "other";
  message: string;
  email?: string;
}

export const FeedbackModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"feedback" | "bug">("feedback");
  const [category, setCategory] = useState<FeedbackSubmission["category"]>("3d_engine");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      // In production, posts to /api/feedback or admin audit logger
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setMessage("");
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Non-intrusive bottom-right trigger pill */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2 rounded-full glass-panel border border-white/10 hover:border-zylo-cyan/40 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 shadow-2xl transition-all hover:scale-105"
        aria-label="Feedback & Report Problem"
      >
        <MessageSquare className="w-3.5 h-3.5 text-zylo-cyan" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl glass-panel border border-zylo-border p-6 shadow-2xl bg-zylo-surface/95">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white">Thank You!</h3>
                <p className="text-xs text-slate-400">
                  Your feedback helps us make ZYLO&apos;s spatial computing experience better for everyone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan" className="text-[10px]">
                      Creator Support
                    </Badge>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-white">
                    Share Feedback or Report Problem
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tell us what you love or report an issue. We read every submission.
                  </p>
                </div>

                {/* Type Switcher */}
                <div className="flex rounded-lg bg-black/40 p-1 border border-white/5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setType("feedback")}
                    className={`flex-1 py-1.5 rounded-md transition-all ${
                      type === "feedback"
                        ? "bg-zylo-cyan/15 text-zylo-cyan border border-zylo-cyan/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    ✨ Idea / Feedback
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("bug")}
                    className={`flex-1 py-1.5 rounded-md transition-all ${
                      type === "bug"
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    ⚠️ Report Bug
                  </button>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Topic Area</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs bg-black/60 border border-white/10 rounded-lg p-2.5 text-white focus:border-zylo-cyan focus:outline-none"
                  >
                    <option value="3d_engine">3D Graphics & Shaders</option>
                    <option value="ai_generation">AI Content & Resumes</option>
                    <option value="builder">Studio Builder & Themes</option>
                    <option value="billing">Billing & Domains</option>
                    <option value="other">General Experience</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Your Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      type === "bug"
                        ? "What happened? Describe steps to reproduce..."
                        : "What would make ZYLO even better for you?"
                    }
                    required
                    maxLength={1000}
                    className="w-full text-xs bg-black/60 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-600 focus:border-zylo-cyan focus:outline-none resize-none"
                  />
                  <div className="text-[10px] text-right text-slate-500 font-mono">
                    {message.length} / 1000
                  </div>
                </div>

                {/* Contact Email (Optional) */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Email (Optional, for follow-up)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@design.io"
                    className="w-full text-xs bg-black/60 border border-white/10 rounded-lg p-2.5 text-white placeholder:text-slate-600 focus:border-zylo-cyan focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="glow"
                  disabled={submitting || !message.trim()}
                  className="w-full text-xs gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? "Sending..." : "Submit Feedback"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
