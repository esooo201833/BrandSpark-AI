import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { applyPurchasedPlan } from '@/lib/payment/credit-engine';

const prisma = new PrismaClient();
const PAYPAL_API = process.env.PAYPAL_MODE === 'production'
  ? 'https://api.paypal.com'
  : 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || '';

async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('token'); // PayPal uses 'token' parameter for order ID

    if (!orderId) {
      console.error('❌ Missing order ID in PayPal return');
      return NextResponse.redirect(
        new URL('/dashboard?error=missing_order_id', request.url).toString()
      );
    }

    console.log(`📝 PayPal return callback received for order: ${orderId}`);

    // Get access token
    const accessToken = await getPayPalAccessToken();

    // Capture the order
    const captureResponse = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
      }
    );

    if (!captureResponse.ok) {
      const error = await captureResponse.text();
      console.error(`❌ PayPal capture failed: ${error}`);
      return NextResponse.redirect(
        new URL('/dashboard?error=paypal_capture_failed', request.url).toString()
      );
    }

    const capturedOrder = await captureResponse.json();

    if (capturedOrder.status !== 'COMPLETED') {
      console.error(`❌ PayPal capture status: ${capturedOrder.status}`);
      return NextResponse.redirect(
        new URL(`/dashboard?error=paypal_status_${capturedOrder.status}`, request.url).toString()
      );
    }

    // Extract payment details from captured order
    const purchaseUnit = capturedOrder.purchase_units?.[0];
    const payment = purchaseUnit?.payments?.captures?.[0];

    if (!payment || payment.status !== 'COMPLETED') {
      console.error('❌ Payment not completed', payment);
      return NextResponse.redirect(
        new URL('/dashboard?error=paypal_not_completed', request.url).toString()
      );
    }

    // Extract user ID from custom_id
    const userId = purchaseUnit?.custom_id;

    if (!userId) {
      console.error('❌ Missing user ID in PayPal capture');
      return NextResponse.redirect(
        new URL('/dashboard?error=missing_user_id', request.url).toString()
      );
    }

    // Get plan from reference_id (format: userId_plan_timestamp)
    const referenceId = purchaseUnit?.reference_id;
    const plan = referenceId?.split('_')[1];

    if (!plan) {
      console.error('❌ Missing plan in PayPal capture');
      return NextResponse.redirect(
        new URL('/dashboard?error=missing_plan', request.url).toString()
      );
    }

    // Apply credits to user
    console.log(`✅ PayPal payment captured! Applying credits to user ${userId}`);
    
    try {
      await applyPurchasedPlan(userId, plan, 'paypal');
    } catch (creditError) {
      console.error('❌ Error applying credits:', creditError);
      // Still consider it success if payment was captured
    }

    // Update subscription status to completed
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (subscription) {
      await prisma.subscription.update({
        where: { userId },
        data: {
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }

    // Note: Consider adding a Payment audit model later for transaction tracking

    console.log(`✅ PayPal payment completed successfully for user ${userId}`);

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/dashboard?payment=success&method=paypal&plan=${plan}`, request.url).toString()
    );
  } catch (error) {
    console.error('❌ PayPal return error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?error=paypal_error', request.url).toString()
    );
  } finally {
    await prisma.$disconnect();
  }
}
