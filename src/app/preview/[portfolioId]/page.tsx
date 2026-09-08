import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BuilderStorageManager } from "@/modules/builder/builder-store";
import { PublishingStoreManager } from "@/modules/publishing/store";
import { PublicPortfolioView } from "@/components/publishing/PublicPortfolioView";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

interface PreviewPageProps {
  params: { portfolioId: string };
  searchParams: { token?: string };
}

export const metadata: Metadata = {
  title: "Draft Preview | ZYLO 3D",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { portfolioId } = params;
  const token = searchParams.token;

  // Check signed token
  let isAuthorized = false;
  if (token && PublishingStoreManager.validatePreviewToken(portfolioId, token)) {
    isAuthorized = true;
  } else {
    // Check logged in session fallback
    const session = await getServerSession(authOptions);
    if (session?.user) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-[#05070f] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-6 text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Preview Access Denied</h1>
        <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
          This preview link has expired (24h limit), is invalid, or requires you to log in to your creator account.
        </p>
        <Link
          href={`/builder/${portfolioId}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Open in Visual Editor</span>
        </Link>
      </main>
    );
  }

  const draftEntry = BuilderStorageManager.getPortfolio(portfolioId);
  if (!draftEntry) {
    return (
      <main className="min-h-screen bg-[#05070f] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Draft Not Found</h1>
        <p className="text-slate-400 max-w-md mb-6 text-sm">
          The requested portfolio draft <code className="text-cyan-400">{portfolioId}</code> could not be found.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium transition-colors"
        >
          <span>Return Home</span>
        </Link>
      </main>
    );
  }

  return (
    <PublicPortfolioView
      portfolio={draftEntry.portfolio}
      isPreview={true}
    />
  );
}
