import React from "react";
import Link from "next/link";
import { Box, Github, Twitter, Linkedin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zylo-border bg-zylo-dark/95 py-12 text-sm text-slate-400">
      <div className="container max-w-7xl px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-zylo-cyan to-zylo-purple flex items-center justify-center p-[1px]">
            <div className="w-full h-full bg-zylo-dark rounded-[7px] flex items-center justify-center">
              <Box className="w-4 h-4 text-zylo-cyan" />
            </div>
          </div>
          <span className="font-heading font-bold text-base text-white">ZYLO</span>
          <span className="text-xs text-slate-500">
            © {new Date().getFullYear()} ZYLO Inc. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <Link href="#architecture" className="hover:text-zylo-cyan transition-colors">
            Architecture
          </Link>
          <Link href="#pricing" className="hover:text-zylo-cyan transition-colors">
            Pricing
          </Link>
          <Link href="/privacy" className="hover:text-zylo-cyan transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-zylo-cyan transition-colors">
            Terms of Service
          </Link>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <Link href="https://github.com" target="_blank" className="hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </Link>
          <Link href="https://twitter.com" target="_blank" className="hover:text-white transition-colors">
            <Twitter className="w-4 h-4" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" className="hover:text-white transition-colors">
            <Linkedin className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
