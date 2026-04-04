import { NextRequest, NextResponse } from "next/server";

// بيانات دخول الأدمن الثابتة
const ADMIN_EMAIL = "eslammmohamed201933@gmail.com";
const ADMIN_PASSWORD = "Moh@01102";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // التحقق من البيانات
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "البريد وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    // مقارنة البيانات مع بيانات الأدمن
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        message: "تم تسجيل الدخول بنجاح",
        admin: {
          email: ADMIN_EMAIL,
          name: "Admin",
        },
      });
    }

    // فشل تسجيل الدخول
    return NextResponse.json(
      { success: false, error: "بيانات الدخول غير صحيحة" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
