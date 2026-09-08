"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConnectIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/settings/integrations");
  }, [router]);

  return null;
}
