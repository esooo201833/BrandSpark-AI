import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const payments = await prisma.paymentRequest.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      userId: payment.userId,
      userEmail: payment.user?.email || "Unknown",
      amount: payment.amount,
      status: payment.status,
      method: payment.provider, // provider instead of method
      plan: payment.planName,   // planName instead of plan
      createdAt: payment.createdAt,
    }));

    return NextResponse.json({ payments: formattedPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
