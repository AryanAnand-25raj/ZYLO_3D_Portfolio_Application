import { NextRequest, NextResponse } from "next/server";
import { applyAIPatches } from "@zylo/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target, operations } = body;

    if (!target || !operations) {
      return NextResponse.json(
        { error: "Target object and patch operations array are required" },
        { status: 400 }
      );
    }

    const result = applyAIPatches(target, operations);

    return NextResponse.json({
      success: result.errors.length === 0,
      updated: result.updated,
      appliedCount: result.appliedCount,
      errors: result.errors,
    });
  } catch (error) {
    console.error("[API AI Patch Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to apply AI patch" },
      { status: 500 }
    );
  }
}
