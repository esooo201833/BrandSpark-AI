# Email Verification و Payment الحقيقي - دليل الإعدادات

## 🔐 Email Verification الحقيقية

### الـ Flow:
1. المستخدم يعمل **Sign Up**
2. يتم إنشاء `verification_token` مع انتهاء صلاحية بـ 24 ساعة
3. يتم إرسال **Email** بـ رابط التحقق
4. المستخدم يضغط على الرابط
5. يتم تحديث حالة البريد إلى `emailVerified = true`
6. **لا يمكن** للمستخدم استخدام أي ميزة قبل التحقق من البريد

### الإعدادات المطلوبة:

#### الخيار 1: Gmail (للتجربة المحلية)
```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password  # ليس كلمة السر العادية!
GMAIL_FROM=noreply@brandspark.ai
```

**كيف تحصل على App Password من Gmail:**
1. اذهب إلى https://myaccount.google.com
2. اختر "Security" (الأمان)
3. فعّل "2-Step Verification"
4. اذهب إلى "App passwords"
5. اختر "Mail" و "Windows Computer"
6. انسخ الـ Password الذي تم توليده

#### الخيار 2: SMTP مخصص (بروتوكول أفضل)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@brandspark.ai
SMTP_SECURE=false  # true for port 465
```

---

## 💳 نظام الدفع

### المرحلة الأولى (Version 1):

#### 1️⃣ **PayPal** (الأولوية)
```env
PAYPAL_CLIENT_ID=AXX...
PAYPAL_SECRET=EBZ...
```

**Flow:**
```
User clicks "Choose Plan"
       ↓
Frontend shows payment methods modal
       ↓
User selects PayPal
       ↓
Frontend redirects to PayPal payment
       ↓
PayPal processes payment
       ↓
Backend webhook receives confirmation
       ↓
Credits added to user account
```

#### 2️⃣ **Perfect Money** (يدوي في البداية)
```env
PERFECT_MONEY_ACCOUNT=your-account
PERFECT_MONEY_PASSPHRASE=your-passphrase
```

**Flow:**
```
User clicks "Choose Plan"
       ↓
Selects "Perfect Money"
       ↓
System shows account details + reference code
       ↓
User sends money
       ↓
User uploads screenshot
       ↓
Admin reviews & approves
       ↓
Credits added
```

#### 3️⃣ **Bank Transfer** (يدوي)
```env
BANK_NAME="Your Bank"
BANK_ACCOUNT_HOLDER="BrandSpark AI"
BANK_ACCOUNT_NUMBER="1234567890"
BANK_IBAN="DE89370400440532013000"
```

**Flow:**
```
User clicks "Bank Transfer"
       ↓
Shows bank details + amount
       ↓
User does transfer
       ↓
Uploads proof (screenshot, transaction ID)
       ↓
Admin approves
       ↓
Credits added
```

---

## 📊 Database Structure

### User Model
```prisma
model User {
  id                    String
  email                 String (unique)
  emailVerified         Boolean  (default: false) ← مهم!
  emailToken            String?
  emailTokenExpiry      DateTime?
  
  credits               Int      (default: 100)
  plan                  String   (free, basic, pro, unlimited)
}
```

### PaymentRequest Model
```prisma
model PaymentRequest {
  id              String
  userId          String
  provider        String  (perfectmoney, bank_transfer, paypal_manual)
  planName        String  (starter, pro, unlimited)
  amount          Float
  status          String  (pending, submitted, approved, rejected)
  referenceCode   String  (unique)
  screenshotUrl   String?
  
  submittedAt     DateTime?
  approvedAt      DateTime?
}
```

---

## 🔄 Credit Engine Logic

### كل طريقة دفع تستخدم نفس اللوجيك:

```typescript
async function applyPurchasedPlan(userId, plan, provider) {
  const planConfig = {
    starter: 500,     // credits
    pro: 2000,        // credits
    unlimited: true,  // unlimited for 1 month
  };
  
  // Deduct from credits OR set unlimited flag
  // Log transaction
  // Notify user
}
```

**الأمان:**
- ✅ السعر يأتي من السيرفر فقط
- ✅ لا يمكن للـ Frontend تعديل السعر
- ✅ التحقق من `emailVerified` قبل الدفع
- ✅ كل transaction يُسجّل في database

---

## 🛡️ Webhooks vs Manual

### لماذا Webhooks مهمة؟
```
سيناريو بدون Webhooks:
- المستخدم يدفع
- الدفع ينجح
- لكن النت قطع
- Credits لم تُضف
- الفلوس ضاعت! ❌

سيناريو مع Webhooks:
- المستخدم يدفع
- PayPal.webhook يرسل تأكيد للسيرفر
- السيرفر يضيف credits
- آمن ✅
```

---

## 🚀 التطبيق العملي

### 1. Setup Email أولاً
```bash
# في .env.local
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password-from-gmail
```

### 2. اختبر Signup + Email
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. انتظر البريد → افتح الرابط

### 4. تحقق من Database
```sql
SELECT * FROM "User" WHERE email = 'test@example.com';
-- emailVerified يجب يكون true
```

### 5. جرب الدفع المويدي
```bash
curl -X POST http://localhost:3000/api/payment/manual/perfectmoney \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "starter",
    "userId": "user-id",
    "email": "test@example.com"
  }'
```

---

## ✅ Checklist

- [ ] إعداد Gmail App Password أو SMTP
- [ ] اختبار Email Verification
- [ ] إعداد PayPal credentials
- [ ] اختبار Payment Flow
- [ ] إعداد Manual Payment endpoints
- [ ] اختبار Admin Approval
- [ ] تفعيل Webhooks (بعد)
- [ ] إضافة Local Payment Gateway (مصر: Paymob, Fawry)

---

## 📚 الموارد

- **Nodemailer Docs:** https://nodemailer.com/
- **Prisma:** https://www.prisma.io/docs/
- **PayPal SDK:** https://developer.paypal.com/
- **SMTP Credentials:** https://myaccount.google.com/

---

**نصيحة ذهبية:** في الإنتاج:
1. استخدم Resend أو Brevo للـ Email (أسهل وأموثوق)
2. فعّل Webhooks لكل payment gateway
3. أضف logging قوي
4. استخدم monitoring (Sentry, etc)
