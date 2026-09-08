import { NextResponse } from "next/server";
import { PlanService } from "@/modules/billing/plans.config";

export async function GET() {
  try {
    const plans = PlanService.getAllPlans();
    return NextResponse.json({
      success: true,
      plans,
      currencies: ["INR", "USD"],
      defaultCurrency: "INR",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load plans",
      },
      { status: 500 }
    );
  }
}
