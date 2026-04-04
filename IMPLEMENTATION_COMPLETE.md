# Email Verification و Payment Integration - التنفيذ الكامل ✅

## 📋 ما تم إنجازه

### 1. ✅ Email Verification الحقيقية
- **File:** `src/lib/auth/email.ts`
- **Update:** تحديث `sendVerificationEmail()` لـ استخدام SMTP أو Gmail
- **Feature:** إرسال emails حقيقية مع SMTP configuration
- **DB:** إضافة `emailVerified`, `emailToken`, `emailTokenExpiry` في User model

### 2. ✅ Email Verification Page
- **File:** `src/app/verify-email/page.tsx`
- **Feature:** صفحة تفاعلية لتأكيد البريد
- **UI:** Loading state → Success/Error states
- **Redirect:** إعادة توجيه تلقائية بعد النجاح

### 3. ✅ Verification Endpoint Update
- **File:** `src/app/api/auth/verify/route.ts`
- **Update:** من API response إلى automatic redirect
- **Security:** التحقق من token expiry و validity

### 4. ✅ Credit Engine
- **File:** `src/lib/payment/credit-engine.ts`
- **Functions:**
  - `applyPurchasedPlan(userId, plan, provider)` - إضافة credits
  - `deductCredits(userId, amount)` - خصم credits
  - `getUserCredits(userId)` - الحصول على رصيد المستخدم
- **Safety:** لا يمكن إضافة credits بدون security checks

### 5. ✅ Manual Payment Endpoints

#### أ) Perfect Money (يدوي)
- **File:** `src/app/api/payment/manual/perfectmoney/route.ts`
- **Feature:** إنشاء طلب دفع مع reference code
- **Response:** Account details + payment reference

#### ب) Bank Transfer (يدوي)
- **File:** `src/app/api/payment/manual/bank/route.ts`
- **Feature:** عرض تفاصيل البنك
- **Support:** IBAN, Account Number, Account Holder

#### ج) Submit Proof
- **File:** `src/app/api/payment/manual/submit-proof/route.ts`
- **Feature:** رفع الـ screenshot + reference number
- **Format:** Multipart form data (file upload)

#### د) Admin Approval
- **File:** `src/app/api/admin/payments/approve/route.ts`
- **Feature:** Override endpoint لموافقة/رفض payments
- **Security:** إعادة التفعيل عبر ADMIN_SECRET_TOKEN
- **Action:** تطبيق الـ credits تلقائياً

### 6. ✅ Database Updates
- **File:** `prisma/schema.prisma`
- **New Model:** `PaymentRequest`
- **Fields:**
  - Status tracking (pending → submitted → approved/rejected)
  - Screenshot URL storage
  - Bank/Perfect Money details
  - Timestamps للـ audit trail
- **Migration:** تم تطبيق migration بنجاح

### 7. ✅ Environment Variables
- **File:** `.env.local`
- **Added:**
  - SMTP configuration (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
  - Bank details (BANK_NAME, ACCOUNT_NUMBER, IBAN)
  - Admin token (ADMIN_SECRET_TOKEN)
  - Back Perfect Money (PERFECT_MONEY_ACCOUNT)

---

## 🏗️ Architecture

### Email Flow:
```
User Signs Up
    ↓
POST /api/auth/signup
    ↓
Generate emailToken (32 random bytes)
    ↓
Set emailTokenExpiry = now + 24h
    ↓
Save User (emailVerified=false)
    ↓
Send Email with verification link
    ↓
GET /api/auth/verify?token=XXX&email=YYY
    ↓
Validate token + expiry
    ↓
Update User (emailVerified=true, emailToken=null)
    ↓
Redirect to /verify-email?success=true
```

### Payment Flow (Version 1 - Manual):
```
User clicks "Upgrade"
    ↓
Check emailVerified (MUST be true)
    ↓
Choose Payment Method:
  - Perfect Money → POST /api/payment/manual/perfectmoney
  - Bank Transfer → POST /api/payment/manual/bank
    ↓
Create PaymentRequest in DB
    ↓
Show reference code + payment details
    ↓
User sends payment + uploads proof
    ↓
POST /api/payment/manual/submit-proof
    ↓
Admin reviews (backend/external system)
    ↓
POST /api/admin/payments/approve?paymentRequestId=XXX
    ↓
applyPurchasedPlan() → Credits added
    ↓
User can generate content
```

---

## 🔒 Security Features

✅ **Email Verification Required**
- لا يمكن استخدام أي ميزة بدون `emailVerified=true`
- يجب للمستخدم الدفع بعد تحقق البريد

✅ **Server-side Pricing**
- السعر يأتي من السيرفر، لا من Frontend
- لا يمكن للـ Frontend تعديل السعر

✅ **Token Expiry**
- Email tokens تنتهي بعد 24 ساعة
- Payment reference codes تُسجّل بـ timestamps

✅ **Admin Secret**
- `/api/admin/payments/approve` يتطلب `ADMIN_SECRET_TOKEN`
- حماية من الـ unauthorized approvals

✅ **Database Audit Trail**
- تسجيل كل transaction مع timestamps
- Tracking من pending → approved/rejected

---

## 📝 API Documentation

### Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "message": "تم التسجيل بنجاح! تحقق من بريدك...",
  "email": "ahmed@example.com",
  "userId": "user-id"
}
```

### Verify Email
```bash
GET /api/auth/verify?token=abc123def456&email=ahmed@example.com

Response: Redirects to /verify-email?success=true
```

### Perfect Money Payment
```bash
POST /api/payment/manual/perfectmoney
Content-Type: application/json

{
  "plan": "starter",  # starter, pro, unlimited
  "userId": "user-id",
  "email": "ahmed@example.com"
}

Response:
{
  "success": true,
  "referenceCode": "PM_1234567_abcd1234",
  "amount": 20,
  "accountNumber": "12345678",
  "paymentRequestId": "payment-id"
}
```

### Bank Transfer Payment
```bash
POST /api/payment/manual/bank
Content-Type: application/json

{
  "plan": "pro",
  "userId": "user-id",
  "email": "ahmed@example.com"
}

Response:
{
  "success": true,
  "referenceCode": "BANK_1234567_abcd1234",
  "amount": 35,
  "bankName": "Your Bank",
  "accountHolder": "BrandSpark AI",
  "iban": "DE89370400440532013000"
}
```

### Submit Payment Proof
```bash
POST /api/payment/manual/submit-proof
Content-Type: multipart/form-data

Fields:
- paymentRequestId: "payment-id"
- referenceNumber: "transfer-ref-123"
- screenshot: <file>

Response:
{
  "success": true,
  "message": "Payment proof submitted. Awaiting admin approval."
}
```

### Admin Approve Payment
```bash
POST /api/admin/payments/approve
Headers:
  X-Admin-Token: your-secure-admin-token

{
  "paymentRequestId": "payment-id",
  "approved": true/false,
  "notes": "Optional admin notes"
}

Response:
{
  "success": true,
  "message": "Payment approved and credits applied",
  "creditsAdded": 500
}
```

---

## ⚙️ Configuration Required

### 1. Gmail Setup (للـ Email)
```env
# Choose one:

# Option A: Direct Gmail
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=app-specific-password

# Option B: SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-specific-password
SMTP_SECURE=false
```

**كيف تحصل على App Password:**
1. https://myaccount.google.com → Security
2. 2-Step Verification (enable)
3. App passwords → Select Mail, Windows
4. Copy password

### 2. Bank Details
```env
BANK_NAME="Your Bank Egypt"
BANK_ACCOUNT_HOLDER="BrandSpark AI"
BANK_ACCOUNT_NUMBER="1234567890"
BANK_IBAN="EG1234567890123456789012"
```

### 3. Perfect Money (Optional)
```env
PERFECT_MONEY_ACCOUNT=U123456789
PERFECT_MONEY_PASSPHRASE=your-passphrase
```

### 4. Admin Token
```env
ADMIN_SECRET_TOKEN=generate-secure-random-token-here
```

---

## 🧪 Testing

### اختبر Email:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### اختبر Perfect Money:
```bash
curl -X POST http://localhost:3000/api/payment/manual/perfectmoney \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "starter",
    "userId": "test-user-id",
    "email": "test@example.com"
  }'
```

### اختبر Admin Approval:
```bash
curl -X POST http://localhost:3000/api/admin/payments/approve \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: your-secure-admin-token" \
  -d '{
    "paymentRequestId": "payment-id-from-db",
    "approved": true,
    "notes": "Approved"
  }'
```

---

## 🚀 Next Steps

### Phase 2 (بعدين):
- [ ] PayPal JavaScript SDK integration
- [ ] PayPal Webhooks for automatic credit
- [ ] Local Payment Gateway (Paymob/Fawry for Egypt)
- [ ] Invoice generation
- [ ] Email receipts
- [ ] Admin dashboard

### Production Checklist:
- [ ] Use Resend or Brevo instead of Gmail
- [ ] Enable PayPal webhooks
- [ ] Add rate limiting
- [ ] Enable CORS properly
- [ ] Add logging (Sentry)
- [ ] Database backups
- [ ] Monitor email delivery

---

## 📞 Support

**لو في حاجة مش واضحة:**
- Email endpoint test first
- Then test payment endpoints
- Check .env variables are set
- Check database migrations applied

**Files to check:**
- `src/lib/auth/email.ts` - Email logic
- `src/lib/payment/credit-engine.ts` - Payment logic
- `src/app/api/payment/manual/` - Payment endpoints
- `prisma/schema.prisma` - Database schema
