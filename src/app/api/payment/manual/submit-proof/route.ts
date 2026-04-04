import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const paymentRequestId = formData.get('paymentRequestId') as string;
    const screenshot = formData.get('screenshot') as File | null;
    const referenceNumber = formData.get('referenceNumber') as string;

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

    // في الحقيقة، يجب أن تحفظ الـ screenshot في storage (S3, Vercel Storage, etc.)
    // هنا نحفظ الـ URL فقط كـ placeholder
    const screenshotUrl = screenshot
      ? `/uploads/payments/${Date.now()}-${screenshot.name}`
      : null;

    await prisma.paymentRequest.update({
      where: { id: paymentRequestId },
      data: {
        status: 'submitted',
        referenceNumber,
        screenshotUrl,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Payment proof submitted. Awaiting admin approval.',
        paymentRequestId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error submitting payment proof:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit proof' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
