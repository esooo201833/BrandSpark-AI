import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const prisma = new PrismaClient();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !endpointSecret) {
    return NextResponse.json(
      { error: 'Missing webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription;
    const customerId = session.customer as string;
    const planId = session.metadata?.plan || 'pro';
    const userId = session.metadata?.userId || '';
    const credits = parseInt(session.metadata?.credits || '0');

    // تحديث قاعدة البيانات
    if (userId && userId !== 'anonymous') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: { increment: credits },
          plan: planId,
        },
      });

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id,
          plan: planId,
          status: 'active',
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        },
        update: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id,
          plan: planId,
          status: 'active',
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        },
      });

      console.log(`✅ Subscription activated for user ${userId}`);
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = ((invoice as any).subscription as string | null);

  if (!subscriptionId || typeof subscriptionId !== 'string') {
    console.log('Invoice payment succeeded but no subscription associated');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
  const metadata = subscription.metadata;
  const userId = metadata?.userId;

  if (userId && userId !== 'anonymous') {
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: 'active',
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    });

    console.log(`✅ Payment succeeded for user ${userId}`);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = ((invoice as any).subscription as string | null);

  if (!subscriptionId || typeof subscriptionId !== 'string') {
    console.log('Invoice payment failed but no subscription associated');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
  const metadata = subscription.metadata;
  const userId = metadata?.userId;

  if (userId && userId !== 'anonymous') {
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: 'past_due',
      },
    });

    console.error(`❌ Payment failed for user ${userId}`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const metadata = subscription.metadata;
  const userId = metadata?.userId;

  if (userId && userId !== 'anonymous') {
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: 'canceled',
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'free',
      },
    });

    console.log(`✅ Subscription canceled for user ${userId}`);
  }
}
