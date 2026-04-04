import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PlanCredits {
  starter: number;
  pro: number;
  unlimited: boolean;
}

const PLAN_CREDITS: PlanCredits = {
  starter: 500,
  pro: 2000,
  unlimited: true, // unlimited للشهر
};

export async function applyPurchasedPlan(
  userId: string,
  plan: string,
  provider: string = 'unknown'
): Promise<{ success: boolean; message: string; credits?: number }> {
  try {
    if (!['starter', 'pro', 'unlimited'].includes(plan)) {
      return {
        success: false,
        message: 'Invalid plan',
      };
    }

    const planKey = plan as keyof PlanCredits;

    if (plan === 'unlimited') {
      // تفعيل Unlimited للشهر القادم
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: 'unlimited',
          credits: 999999, // رقم كبير جداً للدلالة على unlimited
        },
      });

      return {
        success: true,
        message: 'Unlimited plan activated',
        credits: 999999,
      };
    }

    // إضافة credits للخطط الأخرى
    const creditsToAdd = PLAN_CREDITS[planKey] as number;

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        credits: {
          increment: creditsToAdd,
        },
      },
    });

    // تسجيل العملية في Payment Log أو Audit
    console.log(`✅ Applied plan: ${plan} (+${creditsToAdd} credits) to user ${userId} via ${provider}`);

    return {
      success: true,
      message: `Plan activated: ${plan}`,
      credits: creditsToAdd,
    };
  } catch (error) {
    console.error('❌ Error applying plan:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to apply plan',
    };
  }
}

export async function deductCredits(
  userId: string,
  amount: number
): Promise<{ success: boolean; creditsRemaining: number }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.credits < amount) {
      return {
        success: false,
        creditsRemaining: user.credits,
      };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount,
        },
      },
      select: { credits: true },
    });

    return {
      success: true,
      creditsRemaining: updated.credits,
    };
  } catch (error) {
    console.error('❌ Error deducting credits:', error);
    return {
      success: false,
      creditsRemaining: 0,
    };
  }
}

export async function getUserCredits(
  userId: string
): Promise<{ credits: number; plan: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, plan: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      credits: user.credits,
      plan: user.plan,
    };
  } catch (error) {
    console.error('❌ Error fetching user credits:', error);
    return {
      credits: 0,
      plan: 'free',
    };
  }
}
