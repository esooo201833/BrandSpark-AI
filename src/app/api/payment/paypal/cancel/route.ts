import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('token'); // PayPal token parameter

    console.log(`❌ PayPal payment cancelled for order: ${orderId}`);

    // Redirect back to pricing/dashboard with cancellation message
    return NextResponse.redirect(
      new URL('/dashboard/pricing?payment=cancelled', request.url).toString()
    );
  } catch (error) {
    console.error('❌ PayPal cancel error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?error=paypal_cancel', request.url).toString()
    );
  }
}
