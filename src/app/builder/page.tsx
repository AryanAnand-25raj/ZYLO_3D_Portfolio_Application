"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BuilderRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/builder/port-demo-1");
  }, [router]);

  return (
    <div className="min-h-screen bg-zylo-dark flex items-center justify-center">
      <div className="text-xs font-mono text-zylo-cyan flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-zylo-cyan animate-ping" />
        <span>Loading 3D Visual Studio...</span>
      </div>
    </div>
  );
}
