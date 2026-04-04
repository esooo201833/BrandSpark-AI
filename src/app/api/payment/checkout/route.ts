import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

// Prevent static evaluation during build
export const dynamic = 'force-dynamic';

// Lazy initialization of Stripe - only called at runtime
let stripeInstance: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(apiKey, {
      apiVersion: undefined,
    });
  }
  return stripeInstance;
}

const prisma = new PrismaClient();

const PLANS = {
  basic: {
    name: 'Basic',
    priceId: process.env.STRIPE_BASIC_PRICE_ID || '',
    amount: 2000, // $20 in cents
    credits: 500,
    description: '500 AI Credits/month',
  },
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    amount: 3500, // $35 in cents
    credits: 2000,
    description: '2000 AI Credits/month',
  },
  enterprise: {
    name: 'Enterprise',
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    amount: 5000, // $50 in cents
    credits: 10000,
    description: '10000 AI Credits/month',
  },
};

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();

    const { plan: planId, email } = await request.json();

    if (!planId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const selectedPlan = PLANS[planId as keyof typeof PLANS];
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // إنشاء أو البحث عن مستخدم في قاعدة البيانات
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          credits: selectedPlan.credits,
          plan: planId,
        },
      });
    }

    // إنشاء Stripe customer إذا لم يكن موجود
    let customer;
    if (user.id) {
      const existingCustomer = await prisma.subscription.findUnique({
        where: { userId: user.id },
      });

      if (existingCustomer?.stripeCustomerId) {
        customer = await stripe.customers.retrieve(existingCustomer.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email,
          metadata: {
            userId: user.id,
            plan: planId,
          },
        });
      }
    } else {
      customer = await stripe.customers.create({
        email,
        metadata: {
          plan: planId,
        },
      });
    }

    // إنشاء Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${selectedPlan.name} Plan`,
              description: selectedPlan.description,
            },
            unit_amount: selectedPlan.amount,
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pricing?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pricing?status=cancel`,
      metadata: {
        userId: user.id || 'anonymous',
        plan: planId,
        credits: selectedPlan.credits.toString(),
      },
    });

    // حفظ بيانات الدفع
    if (user.id) {
      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeCustomerId: customer.id,
          stripePriceId: selectedPlan.priceId,
          plan: planId,
          status: 'pending',
        },
        update: {
          stripeCustomerId: customer.id,
          stripePriceId: selectedPlan.priceId,
          plan: planId,
          status: 'pending',
        },
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      clientSecret: session.client_secret,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment processing failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
