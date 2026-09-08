import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BillingStoreManager } from "@/modules/billing/store";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "user-demo";

    const payments = await BillingStoreManager.listUserPayments(userId);
    const invoices = await BillingStoreManager.listUserInvoices(userId);

    return NextResponse.json({
      success: true,
      payments,
      invoices,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch payments",
      },
      { status: 500 }
    );
  }
}
