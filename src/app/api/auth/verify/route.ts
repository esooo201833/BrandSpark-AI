import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/auth/email';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.redirect(
        new URL(`/verify-email?error=missing_token&email=${encodeURIComponent(email || '')}`, request.url)
      );
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL(`/verify-email?error=user_not_found&email=${encodeURIComponent(email)}`, request.url)
      );
    }

    // التحقق من أن الـ Token متطابق
    if (user.emailToken !== token) {
      return NextResponse.redirect(
        new URL(`/verify-email?error=invalid_token&email=${encodeURIComponent(email)}`, request.url)
      );
    }

    // التحقق من انتهاء صلاحية الـ Token (24 ساعة)
    if (!user.emailTokenExpiry || user.emailTokenExpiry < new Date()) {
      return NextResponse.redirect(
        new URL(`/verify-email?error=token_expired&email=${encodeURIComponent(email)}`, request.url)
      );
    }

    // تحديث المستخدم: وضع علامة كمُتحقق وحذف الـ Token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailToken: null,
        emailTokenExpiry: null,
      },
    });

    // إعادة التوجيه لصفحة النجاح
    return NextResponse.redirect(
      new URL(`/verify-email?success=true&email=${encodeURIComponent(email)}`, request.url)
    );
  } catch (error) {
    console.error('❌ Verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      new URL(`/verify-email?error=verification_failed&details=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}

// Resend verification email endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // إذا كان المستخدم مُتحقق بالفعل
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // إنشاء توكن جديد دائماً عند إعادة الإرسال
    const token = crypto.randomBytes(32).toString('hex');
    
    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailToken: token,
        emailTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // إرسال البريد الجديد
    const emailSent = await sendVerificationEmail(email, token);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email - check email configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'تم إرسال بريد التحقق إلى بريدك الإلكتروني',
        message_en: 'Verification email sent to your inbox',
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Resend verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
