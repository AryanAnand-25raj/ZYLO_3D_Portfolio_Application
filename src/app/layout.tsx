import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";

export const metadata: Metadata = {
  title: "ZYLO — AI-Powered 3D Portfolio Generator",
  description:
    "Generate hyper-immersive, real-time 3D WebGL portfolios in seconds. Powered by Three.js, React Three Fiber, and intelligent design tokens.",
  keywords: ["3D Portfolio", "WebGL", "Three.js", "AI Portfolio Generator", "Developer Portfolio", "SaaS"],
  authors: [{ name: "ZYLO Team" }],
  openGraph: {
    title: "ZYLO — AI-Powered 3D Portfolio Generator",
    description: "Generate hyper-immersive, real-time 3D WebGL portfolios in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zylo-dark text-foreground flex flex-col font-sans">
        <AuthProvider>
          {children}
          <FeedbackModal />
        </AuthProvider>
      </body>
    </html>
  );
}
