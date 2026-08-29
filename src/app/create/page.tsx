"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDraft } from "@/components/create/DraftProvider";

export default function CreateIndexPage() {
  const router = useRouter();
  const { currentStep } = useDraft();

  useEffect(() => {
    router.replace(`/create/${currentStep || "profile"}`);
  }, [currentStep, router]);

  return null;
}
