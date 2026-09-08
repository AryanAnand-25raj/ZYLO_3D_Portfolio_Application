import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublishingStoreManager } from "@/modules/publishing/store";
import { PublicPortfolioView } from "@/components/publishing/PublicPortfolioView";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const published = await PublishingStoreManager.getPublishedBySlug(params.slug);

  if (!published || published.status !== "published") {
    return {
      title: "Portfolio Not Found | ZYLO 3D",
      description: "The requested portfolio does not exist or has been taken offline.",
    };
  }

  const snapshot = published.snapshot;
  const fullName = snapshot.content?.profile?.fullName || "Creator";
  const headline = snapshot.content?.profile?.headline || "Interactive 3D Portfolio";
  const bio = snapshot.content?.profile?.bio || "Interactive 3D spatial web portfolio.";
  const metaTitle = snapshot.metadata?.seo?.metaTitle || `${fullName} — ${headline} | ZYLO 3D`;
  const metaDescription = snapshot.metadata?.seo?.metaDescription || bio;
  const ogImage = snapshot.metadata?.seo?.ogImage;
  const canonicalUrl = `https://zylo.design/${params.slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: snapshot.metadata?.seo?.keywords || ["3D Portfolio", "WebGL", "Spatial Web"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: "ZYLO 3D",
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const published = await PublishingStoreManager.getPublishedBySlug(params.slug);

  if (!published || published.status !== "published") {
    return (
      <main className="min-h-screen bg-[#05070f] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Portfolio Not Found</h1>
        <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
          The spatial portfolio at <code className="text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded">/{params.slug}</code> is currently unpublished, private, or does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to ZYLO Home</span>
        </Link>
      </main>
    );
  }

  const snapshot = published.snapshot;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: snapshot.content?.profile?.fullName || "Creator",
    jobTitle: snapshot.content?.profile?.headline,
    description: snapshot.content?.profile?.bio,
    url: `https://zylo.design/${params.slug}`,
    sameAs: snapshot.content?.socials?.map((s) => s.url).filter(Boolean) || [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicPortfolioView portfolio={published.snapshot} slug={params.slug} />
    </>
  );
}
