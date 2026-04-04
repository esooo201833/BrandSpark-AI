import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, generateEmailToken, sendVerificationEmail } from '@/lib/auth/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود مستخدم بنفس البريد
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // تجزئة الكلمة المرورية
    const hashedPassword = await hashPassword(password);

    // إنشاء token التحقق
    const emailToken = generateEmailToken();
    const emailTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ساعة

    // إنشاء المستخدم في قاعدة البيانات
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailToken,
        emailTokenExpiry,
        emailVerified: false,
        credits: 100, // اعطاء 100 credit مجاني عند التسجيل
      },
    });

    // إرسال بريد التحقق
    console.log('📧 Attempting to send verification email to:', email);
    const emailResult = await sendVerificationEmail(email, emailToken);
    console.log('📧 Email result:', emailResult);

    if (!emailResult.success) {
      console.error('❌ Failed to send verification email:', emailResult.error);
      // لا تحذف المستخدم - دعه يحاول إعادة إرسال البريد لاحقاً
      // لكن علمه كـ "معلق" حتى يتم التحقق
      return NextResponse.json({
        success: true,
        message: 'تم إنشاء الحساب، لكن فشل إرسال بريد التحقق. يرجى طلب إعادة إرسال الرابط.',
        message_en: 'Account created, but verification email failed. Please request a resend.',
        email: user.email,
        userId: user.id,
        emailFailed: true,
        emailError: emailResult.error,
      }, { status: 201 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'تم التسجيل بنجاح! تحقق من بريدك الإلكتروني للتحقق من الحساب.',
        message_en: 'Registered successfully! Check your email to verify your account.',
        email,
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 500 }
    );
  }
}
