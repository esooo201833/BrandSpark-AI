import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Pricing configuration - يجب أن يكون من السيرفر فقط
const PRICING = {
  starter: { amount: 20, credits: 500 },
  pro: { amount: 35, credits: 2000 },
  unlimited: { amount: 50, credits: -1, period: '1 month' },
};

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, email } = await request.json();

    // التحقق من المدخلات
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

    // التحقق من أن الـ السعر جاي من السيرفر فقط، لا من الـ Frontend
    const planConfig = PRICING[plan as keyof typeof PRICING];
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan configuration' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم
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

    // منع الدفع قبل التحقق من البريد
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before purchasing' },
        { status: 403 }
      );
    }

    // إنشاء Payment Request يدوي
    const referenceCode = `PM_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        userId,
        provider: 'perfectmoney',
        planName: plan,
        amount: planConfig.amount,
        currency: 'USD',
        status: 'pending',
        referenceCode,
        accountNumber: process.env.PERFECT_MONEY_ACCOUNT,
        notes: `Manual Perfect Money payment for ${plan} plan`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        referenceCode,
        amount: planConfig.amount,
        accountNumber: process.env.PERFECT_MONEY_ACCOUNT,
        message: 'Payment request created. Please send payment and upload screenshot.',
        paymentRequestId: paymentRequest.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Perfect Money request error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment request failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
