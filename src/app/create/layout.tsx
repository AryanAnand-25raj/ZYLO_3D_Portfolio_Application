import React from "react";
import { DraftProvider } from "@/components/create/DraftProvider";
import { StepIndicator } from "@/components/create/StepIndicator";
import { Navbar } from "@/components/marketing/Navbar";

export default function CreatePortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DraftProvider>
      <div className="min-h-screen flex flex-col bg-zylo-dark text-foreground">
        <Navbar />
        <StepIndicator />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-10">
          {children}
        </main>
      </div>
    </DraftProvider>
  );
}
