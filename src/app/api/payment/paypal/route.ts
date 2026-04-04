import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Pricing configuration - Server-side only
const PRICING = {
  starter: { amount: '20.00', credits: 500 },
  pro: { amount: '35.00', credits: 2000 },
  unlimited: { amount: '50.00', credits: -1 },
};

const PAYPAL_API = process.env.PAYPAL_MODE === 'production'
  ? 'https://api.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || '';

// Get PayPal access token
async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  
  try {
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal auth failed: ${error}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting PayPal access token:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { plan, email, userId } = await request.json();

    // Validate plan
    if (!plan || !Object.keys(PRICING).includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Validate user
    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    // Check if user is verified
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
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

    // Get pricing from server (not from client)
    const planConfig = PRICING[plan as keyof typeof PRICING];
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan configuration' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create order using PayPal Orders API (not Subscriptions)
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `${userId}_${plan}_${Date.now()}`,
            amount: {
              currency_code: 'USD',
              value: planConfig.amount,
            },
            description: `BrandSpark AI - ${plan} Plan (${planConfig.credits} credits)`,
            custom_id: userId,
          },
        ],
        payer: {
          email_address: email,
        },
        application_context: {
          brand_name: 'BrandSpark AI',
          locale: 'en-US',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXTAUTH_URL}/api/payment/paypal/return`,
          cancel_url: `${process.env.NEXTAUTH_URL}/api/payment/paypal/cancel`,
        },
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      console.error('❌ PayPal order creation failed:', error);
      throw new Error(`PayPal order creation failed: ${error}`);
    }

    const order = await orderResponse.json();

    if (!order.id || !order.links) {
      throw new Error('Invalid PayPal response');
    }

    // Find the approval link
    const approvalLink = order.links.find(
      (link: { rel: string; href: string }) => link.rel === 'approve'
    );

    if (!approvalLink) {
      throw new Error('No approval link in PayPal response');
    }

    // Store order reference for later capture
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeCustomerId: order.id,
        plan,
        status: 'pending',
      },
      update: {
        stripeCustomerId: order.id,
        plan,
        status: 'pending',
      },
    });

    console.log(`✅ PayPal order created: ${order.id} for user ${userId}`);

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        approvalUrl: approvalLink.href,
        amount: planConfig.amount,
        plan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ PayPal checkout error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'PayPal checkout failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
