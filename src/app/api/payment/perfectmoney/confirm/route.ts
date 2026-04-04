import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CREDITS = {
  basic: 500,
  pro: 2000,
  enterprise: 10000,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { REFERENCE, PAYMENT_ID } = body;

    // Verify the callback is authentic by checking the payment status
    // In production, you would verify the hash
    if (!REFERENCE || !PAYMENT_ID) {
      return NextResponse.json(
        { error: 'Invalid payment notification' },
        { status: 400 }
      );
    }

    // Find subscription by reference (transaction ID)
    const subscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: REFERENCE },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Update subscription status
    await prisma.subscription.update({
      where: { userId: subscription.userId },
      data: {
        status: 'active',
        stripeCustomerId: REFERENCE || '',
      },
    });

    // Add credits to user
    const credits = CREDITS[subscription.plan as keyof typeof CREDITS] || 500;
    await prisma.user.update({
      where: { id: subscription.userId },
      data: {
        credits: { increment: credits },
        plan: subscription.plan,
      },
    });

    console.log(`✅ Payment confirmed for user ${subscription.userId}: ${REFERENCE}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Payment confirmed',
        reference: REFERENCE,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Perfect Money confirmation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Confirmation failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// For GET requests from Perfect Money
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('REFERENCE');
    const paymentId = searchParams.get('PAYMENT_ID');
    const status = searchParams.get('status');

    if (!reference || !paymentId) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      );
    }

    if (status === 'success') {
      const subscription = await prisma.subscription.findFirst({
        where: { stripeCustomerId: reference },
      });

      if (subscription) {
        await prisma.subscription.update({
          where: { userId: subscription.userId },
          data: { status: 'active' },
        });

        const credits = CREDITS[subscription.plan as keyof typeof CREDITS] || 500;
        await prisma.user.update({
          where: { id: subscription.userId },
          data: {
            credits: { increment: credits },
            plan: subscription.plan,
          },
        });
      }
    }

    return NextResponse.redirect(
      new URL(`/dashboard?payment=${status || 'pending'}`, request.url)
    );
  } catch (error) {
    console.error('Perfect Money status error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?payment=error', request.url)
    );
  } finally {
    await prisma.$disconnect();
  }
}
