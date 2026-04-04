import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe only if key is available
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

const PLANS = {
  basic: {
    name: 'Basic',
    price: 2000, // $20 in cents
    credits: 500,
    stripePriceId: 'price_basic',
  },
  pro: {
    name: 'Pro',
    price: 3500, // $35 in cents
    credits: 2000,
    stripePriceId: 'price_pro',
  },
  enterprise: {
    name: 'Enterprise',
    price: 5000, // $50 in cents
    credits: 10000,
    stripePriceId: 'price_enterprise',
  },
};

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.' },
        { status: 503 }
      );
    }

    const { plan, email, userId } = await request.json();

    if (!plan || !email || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const planData = PLANS[plan as keyof typeof PLANS];
    if (!planData) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `BrandSpark ${planData.name} Plan`,
              description: `${planData.credits} AI Generation Credits`,
            },
            unit_amount: planData.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/pricing?payment=canceled`,
      customer_email: email,
      metadata: {
        userId,
        plan,
        credits: planData.credits,
      },
    });

    return NextResponse.json(
      { sessionId: session.id, url: session.url },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
