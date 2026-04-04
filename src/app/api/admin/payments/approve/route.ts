import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { applyPurchasedPlan } from '@/lib/payment/credit-engine';

const prisma = new PrismaClient();

// Admin-only endpoint للموافقة على الدفع
export async function POST(request: NextRequest) {
  try {
    const { paymentRequestId, approved, notes } = await request.json();

    // يجب أن تتحقق من أن الـ Admin ممنوح صلاحيات كافية
    // هنا نتخطى هذا للآن ولكن في الإنتاج أضف admin check
    const adminToken = request.headers.get('x-admin-token');
    if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (!paymentRequestId) {
      return NextResponse.json(
        { error: 'Payment request ID is required' },
        { status: 400 }
      );
    }

    const paymentRequest = await prisma.paymentRequest.findUnique({
      where: { id: paymentRequestId },
      include: { user: true },
    });

    if (!paymentRequest) {
      return NextResponse.json(
        { error: 'Payment request not found' },
        { status: 404 }
      );
    }

    if (approved) {
      // الموافقة على الدفع
      const result = await applyPurchasedPlan(
        paymentRequest.userId,
        paymentRequest.planName,
        `${paymentRequest.provider}_manual`
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: 400 }
        );
      }

      await prisma.paymentRequest.update({
        where: { id: paymentRequestId },
        data: {
          status: 'approved',
          approvedAt: new Date(),
          approverNotes: notes,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Payment approved and credits applied',
          creditsAdded: result.credits,
          user: paymentRequest.user.name,
        },
        { status: 200 }
      );
    } else {
      // رفض الدفع
      await prisma.paymentRequest.update({
        where: { id: paymentRequestId },
        data: {
          status: 'rejected',
          rejectedAt: new Date(),
          rejectionReason: notes,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Payment rejected',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('❌ Error approving payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Approval failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
