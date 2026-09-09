import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// In-memory fallback cache for development / mock sessions
const globalDraftCache = new Map<string, any>();

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "guest-user";

    try {
      const dbDraft = await db.portfolioDraft.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      if (dbDraft) {
        return NextResponse.json({
          success: true,
          draft: {
            id: dbDraft.id,
            currentStep: dbDraft.currentStep,
            profileData: dbDraft.profileData,
            extractedData: dbDraft.extractedData,
            canonicalProfile: dbDraft.canonicalProfile,
            preferences: dbDraft.preferences,
            stylePrompt: dbDraft.stylePrompt,
            selectedSections: dbDraft.selectedSections,
            completenessScore: dbDraft.completenessScore,
            completenessData: dbDraft.completenessData,
            followUpQuestions: dbDraft.followUpQuestions,
            generatedContent: dbDraft.generatedContent,
          },
        });
      }
    } catch {
      // In-memory fallback
    }

    const cached = globalDraftCache.get(userId);
    return NextResponse.json({
      success: true,
      draft: cached || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load draft" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "guest-user";
    const draftData = await req.json();

    globalDraftCache.set(userId, draftData);

    try {
      const user = await getOrCreateUser(userId);
      const saved = await db.portfolioDraft.upsert({
        where: { id: draftData.id || `draft-${userId}` },
        update: {
          currentStep: draftData.currentStep || "profile",
          profileData: draftData.profileData as any,
          extractedData: draftData.extractedData as any,
          canonicalProfile: draftData.canonicalProfile as any,
          preferences: draftData.preferences as any,
          stylePrompt: draftData.preferences?.stylePrompt || "",
          selectedSections: draftData.preferences?.selectedSections as any,
          completenessScore: draftData.completeness?.score || 0,
          completenessData: draftData.completeness as any,
          followUpQuestions: draftData.completeness?.questions as any,
          generatedContent: draftData.generatedContent as any,
        },
        create: {
          id: draftData.id || `draft-${userId}`,
          userId: user.id,
          currentStep: draftData.currentStep || "profile",
          profileData: draftData.profileData as any,
          extractedData: draftData.extractedData as any,
          canonicalProfile: draftData.canonicalProfile as any,
          preferences: draftData.preferences as any,
          stylePrompt: draftData.preferences?.stylePrompt || "",
          selectedSections: draftData.preferences?.selectedSections as any,
          completenessScore: draftData.completeness?.score || 0,
          completenessData: draftData.completeness as any,
          followUpQuestions: draftData.completeness?.questions as any,
          generatedContent: draftData.generatedContent as any,
        },
      });

      return NextResponse.json({ success: true, draftId: saved.id });
    } catch {
      return NextResponse.json({ success: true, draftId: `cached-${Date.now()}` });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save draft" },
      { status: 500 }
    );
  }
}

async function getOrCreateUser(userId: string) {
  const existing = await db.user.findFirst({ where: { id: userId } });
  if (existing) return existing;
  return db.user.create({
    data: {
      id: userId === "guest-user" ? undefined : userId,
      email: "founder@zylo.design",
      name: "Alex Vance",
      role: "CREATOR",
    },
  });
}
