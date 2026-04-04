import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // التحقق من أن البريد مُتحقق منه
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          error: 'Please verify your email first',
          error_ar: 'يرجى التحقق من بريدك الإلكتروني أولاً',
          canResendEmail: true,
        },
        { status: 403 }
      );
    }

    // التحقق من كلمة المرور
    if (!user.password) {
      return NextResponse.json(
        { error: 'Invalid user account' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // إنشاء session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 أيام

    return NextResponse.json(
      {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        message_en: 'Logged in successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          credits: user.credits,
          plan: user.plan,
        },
        token: sessionToken,
        expiresAt: sessionExpiry,
        redirectUrl: '/dashboard',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    );
  }
}
