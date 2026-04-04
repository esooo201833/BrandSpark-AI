import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // جلب إحصائيات المستخدمين
    const totalUsers = await prisma.user.count();

    // جلب إحصائيات الدفعات
    const totalPayments = await prisma.paymentRequest.count();
    const pendingPayments = await prisma.paymentRequest.count({
      where: { status: "PENDING" },
    });

    // حساب إجمالي الإيرادات
    const payments = await prisma.paymentRequest.findMany({
      where: { status: "APPROVED" },
      select: { amount: true },
    });
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return NextResponse.json({
      totalUsers,
      totalPayments,
      pendingPayments,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
