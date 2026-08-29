"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ContentData } from "@/schemas/content.schema";
import { ExtractedResumeData, GeneratedPortfolioContent } from "@/schemas/ai.schema";
import {
  StylePreferences,
  CompletenessResult,
  DataConflict,
  FollowUpQuestion,
} from "@/schemas/draft.schema";
import { DEFAULT_PORTFOLIO_CONTENT } from "@/modules/content";

export type OnboardingStep = "profile" | "resume" | "review" | "style" | "generate" | "result";

export const STEPS: { id: OnboardingStep; label: string; number: string; path: string }[] = [
  { id: "profile", label: "Profile", number: "01", path: "/create/profile" },
  { id: "resume", label: "Resume", number: "02", path: "/create/resume" },
  { id: "review", label: "Review", number: "03", path: "/create/review" },
  { id: "style", label: "Style", number: "04", path: "/create/style" },
  { id: "generate", label: "Generate", number: "05", path: "/create/generate" },
  { id: "result", label: "Draft", number: "06", path: "/create/result" },
];

interface DraftContextValue {
  currentStep: OnboardingStep;
  profileData: ContentData;
  setProfileData: React.Dispatch<React.SetStateAction<ContentData>>;
  extractedData: ExtractedResumeData | null;
  setExtractedData: React.Dispatch<React.SetStateAction<ExtractedResumeData | null>>;
  canonicalProfile: ContentData;
  setCanonicalProfile: React.Dispatch<React.SetStateAction<ContentData>>;
  preferences: StylePreferences;
  setPreferences: React.Dispatch<React.SetStateAction<StylePreferences>>;
  conflicts: DataConflict[];
  setConflicts: React.Dispatch<React.SetStateAction<DataConflict[]>>;
  resolveConflict: (conflictId: string, chosenValue: unknown) => void;
  completeness: CompletenessResult | null;
  setCompleteness: React.Dispatch<React.SetStateAction<CompletenessResult | null>>;
  followUpQuestions: FollowUpQuestion[];
  setFollowUpQuestions: React.Dispatch<React.SetStateAction<FollowUpQuestion[]>>;
  answerQuestion: (questionId: string, answer: string) => void;
  skipQuestion: (questionId: string) => void;
  generatedContent: GeneratedPortfolioContent | null;
  setGeneratedContent: React.Dispatch<React.SetStateAction<GeneratedPortfolioContent | null>>;
  isSaving: boolean;
  saveDraft: () => Promise<void>;
  goToStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const DraftContext = createContext<DraftContextValue | undefined>(undefined);

export const DraftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>("profile");
  const [profileData, setProfileData] = useState<ContentData>(DEFAULT_PORTFOLIO_CONTENT);
  const [extractedData, setExtractedData] = useState<ExtractedResumeData | null>(null);
  const [canonicalProfile, setCanonicalProfile] = useState<ContentData>(DEFAULT_PORTFOLIO_CONTENT);
  const [preferences, setPreferences] = useState<StylePreferences>({
    preset: "Futuristic",
    stylePrompt: "I want a futuristic dark portfolio inspired by space exploration. Use glowing cyan accents, glass panels, floating 3D objects, subtle particles and cinematic animations.",
    targetAudience: "Employers",
    portfolioGoal: "Get a Job",
    visualIntensity: "Highly Interactive",
    selectedSections: ["Hero", "About", "Experience", "Skills", "Projects", "Contact"],
  });
  const [conflicts, setConflicts] = useState<DataConflict[]>([]);
  const [completeness, setCompleteness] = useState<CompletenessResult | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedPortfolioContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync step with active URL route
  useEffect(() => {
    const matched = STEPS.find((s) => s.path === pathname);
    if (matched) {
      setCurrentStep(matched.id);
    }
  }, [pathname]);

  // Load draft from local storage / API on mount
  useEffect(() => {
    try {
      const savedLocal = localStorage.getItem("zylo_draft_v2");
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        if (parsed.profileData) setProfileData(parsed.profileData);
        if (parsed.extractedData) setExtractedData(parsed.extractedData);
        if (parsed.canonicalProfile) setCanonicalProfile(parsed.canonicalProfile);
        if (parsed.preferences) setPreferences(parsed.preferences);
        if (parsed.conflicts) setConflicts(parsed.conflicts);
        if (parsed.completeness) setCompleteness(parsed.completeness);
        if (parsed.generatedContent) setGeneratedContent(parsed.generatedContent);
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Autosave to localStorage
  const saveDraft = useCallback(async () => {
    setIsSaving(true);
    const draftPayload = {
      currentStep,
      profileData,
      extractedData,
      canonicalProfile,
      preferences,
      conflicts,
      completeness,
      generatedContent,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("zylo_draft_v2", JSON.stringify(draftPayload));
      await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftPayload),
      });
    } catch (e) {
      console.warn("[DraftProvider] Draft autosave to API failed:", e);
    } finally {
      setIsSaving(false);
    }
  }, [
    currentStep,
    profileData,
    extractedData,
    canonicalProfile,
    preferences,
    conflicts,
    completeness,
    generatedContent,
  ]);

  const resolveConflict = (conflictId: string, chosenValue: unknown) => {
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflictId ? { ...c, resolved: true, resolvedValue: chosenValue } : c))
    );
  };

  const answerQuestion = (questionId: string, answer: string) => {
    setFollowUpQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answer, skipped: false } : q))
    );
  };

  const skipQuestion = (questionId: string) => {
    setFollowUpQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, skipped: true } : q))
    );
  };

  const goToStep = (step: OnboardingStep) => {
    const target = STEPS.find((s) => s.id === step);
    if (target) {
      setCurrentStep(step);
      router.push(target.path);
    }
  };

  const nextStep = () => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx < STEPS.length - 1) {
      goToStep(STEPS[idx + 1].id);
    }
  };

  const prevStep = () => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx > 0) {
      goToStep(STEPS[idx - 1].id);
    }
  };

  return (
    <DraftContext.Provider
      value={{
        currentStep,
        profileData,
        setProfileData,
        extractedData,
        setExtractedData,
        canonicalProfile,
        setCanonicalProfile,
        preferences,
        setPreferences,
        conflicts,
        setConflicts,
        resolveConflict,
        completeness,
        setCompleteness,
        followUpQuestions,
        setFollowUpQuestions,
        answerQuestion,
        skipQuestion,
        generatedContent,
        setGeneratedContent,
        isSaving,
        saveDraft,
        goToStep,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};

export function useDraft() {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error("useDraft must be used within a DraftProvider");
  }
  return context;
}
