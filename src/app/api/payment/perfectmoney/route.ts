import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Pricing in USD
const PRICING = {
  basic: 20,
  pro: 35,
  enterprise: 50,
};

const CREDITS = {
  basic: 500,
  pro: 2000,
  enterprise: 10000,
};

const PM_ACCOUNT = process.env.PERFECT_MONEY_ACCOUNT || '';
const PM_PASSPHRASE = process.env.PERFECT_MONEY_PASSPHRASE || '';

export async function POST(request: NextRequest) {
  try {
    const { plan, userId } = await request.json();

    if (!plan || !['basic', 'pro', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const amount = PRICING[plan as keyof typeof PRICING];
    const credits = CREDITS[plan as keyof typeof CREDITS];

    if (!PM_ACCOUNT || !PM_PASSPHRASE) {
      return NextResponse.json(
        { error: 'Perfect Money is not configured' },
        { status: 503 }
      );
    }

    // Generate unique transaction ID
    const transactionId = `SPARK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store pending payment in database
    await prisma.subscription.upsert({
      where: { userId: userId || 'anonymous' },
      create: {
        userId: userId || 'anonymous',
        stripeCustomerId: transactionId,
        plan,
        status: 'pending',
      },
      update: {
        stripeCustomerId: transactionId,
        plan,
        status: 'pending',
      },
    });

    // Perfect Money payment URL
    const perfectMoneyUrl = new URL('https://perfectmoney.com/api/step1.asp');
    perfectMoneyUrl.searchParams.append('AccountID', PM_ACCOUNT);
    perfectMoneyUrl.searchParams.append('PassPhrase', PM_PASSPHRASE);
    perfectMoneyUrl.searchParams.append('PayerAccount', PM_ACCOUNT);
    perfectMoneyUrl.searchParams.append('ReceiverAccount', PM_ACCOUNT);
    perfectMoneyUrl.searchParams.append('Amount', amount.toString());
    perfectMoneyUrl.searchParams.append('Memo', `BrandSpark AI - ${plan} Plan (${credits} credits)`);
    perfectMoneyUrl.searchParams.append('Reference', transactionId);
    perfectMoneyUrl.searchParams.append('ReturnURL', `${process.env.NEXTAUTH_URL}/api/payment/perfectmoney/confirm`);
    perfectMoneyUrl.searchParams.append('StatusURL', `${process.env.NEXTAUTH_URL}/api/payment/perfectmoney/status`);
    perfectMoneyUrl.searchParams.append('NORF', '2');

    return NextResponse.json(
      {
        success: true,
        transactionId,
        paymentUrl: perfectMoneyUrl.toString(),
        amount,
        credits,
        plan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Perfect Money checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
