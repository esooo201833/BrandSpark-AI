import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const PRICING = {
  starter: { amount: 20, credits: 500 },
  pro: { amount: 35, credits: 2000 },
  unlimited: { amount: 50, credits: -1, period: '1 month' },
};

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, email } = await request.json();

    if (!plan || !['starter', 'pro', 'unlimited'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    const planConfig = PRICING[plan as keyof typeof PRICING];
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan configuration' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before purchasing' },
        { status: 403 }
      );
    }

    // إنشاء Bank Transfer Request
    const referenceCode = `BANK_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        userId,
        provider: 'bank_transfer',
        planName: plan,
        amount: planConfig.amount,
        currency: 'USD',
        status: 'pending',
        referenceCode,
        bankName: process.env.BANK_NAME || 'BrandSpark AI Bank',
        accountHolder: process.env.BANK_ACCOUNT_HOLDER || 'BrandSpark AI',
        accountNumber: process.env.BANK_ACCOUNT_NUMBER,
        iban: process.env.BANK_IBAN,
        notes: `Bank transfer for ${plan} plan`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        referenceCode,
        amount: planConfig.amount,
        bankName: process.env.BANK_NAME,
        accountHolder: process.env.BANK_ACCOUNT_HOLDER,
        accountNumber: process.env.BANK_ACCOUNT_NUMBER,
        iban: process.env.BANK_IBAN,
        message: 'Bank transfer details provided. Please complete the transfer and submit proof.',
        paymentRequestId: paymentRequest.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Bank transfer request error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment request failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
