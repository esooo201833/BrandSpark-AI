# 💳 دليل Stripe للدفع الحقيقي

## ✅ ما تم تثبيته:

### 1. **API Endpoints الجديدة**
```
POST /api/payment/checkout
- إنشاء جلسة Stripe
- حفظ بيانات الدفع في قاعدة البيانات
- إعادة توجيه للدفع

POST /api/payment/webhook
- التعامل مع أحداث Stripe
- تحديث حالة الاشتراك
- إضافة الـ credits
```

### 2. **قاعدة البيانات محسّنة**
```sql
Subscription {
  stripeCustomerId
  stripeSubscriptionId
  stripePriceId
  status (active, pending, canceled, past_due)
  currentPeriodStart, currentPeriodEnd
}
```

### 3. **Component للدفع**
- `src/components/payment/pricing-cards.tsx` ✅
- عرض مرئي للخطط
- زر للدفع مع validation

---

## 🚀 الخطوات التالية للإنتاج:

### 1️⃣ **إنشاء Stripe Account** (مجاني)
```bash
# اذهب إلى:
https://dashboard.stripe.com

# سجل جديد أو دخول
```

### 2️⃣ **احصل على API Keys**
```
Settings → API Keys:
- Publishable Key: pk_live_...
- Secret Key: sk_live_...

Settings → Webhooks:
- Webhook Secret: whsec_...
```

### 3️⃣ **إنشاء Price IDs للخطط**
```
Products → Create Product:

Basic:
- Price: $20/month
- Copy Price ID: price_...

Pro:
- Price: $35/month
- Copy Price ID: price_...

Enterprise:
- Price: $50/month
- Copy Price ID: price_...
```

### 4️⃣ **تحديث .env.local**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

### 5️⃣ **تفعيل Webhook**
```
Webhooks → Add endpoint:

URL: https://yourdomain.com/api/payment/webhook

Events to listen to:
✓ checkout.session.completed
✓ invoice.payment_succeeded
✓ invoice.payment_failed
✓ customer.subscription.deleted
```

---

## 💰 التدفق الحالي:

```
1. User يختار خطة
   ↓
2. اضغط "Get Started"
   ↓
3. / api/payment/checkout يعالج الطلب
   ↓
4. يُنشئ Stripe Checkout Session
   ↓
5. User يذهب إلى Stripe للدفع
   ↓
6. الدفع يُنجح
   ↓
7. Webhook يستقبل النجاح
   ↓
8. يحدّث قاعدة البيانات
   ↓
9. يضيف Credits للمستخدم
   ↓
10. User يعود للموقع مع صفقة ناجحة! ✅
```

---

## 🧪 الاختبار بـ Test Keys:

### استخدم بطاقات Stripe Test:
```
✅ Successful payment:
Card: 4242 4242 4242 4242
Exp: 12/25
CVC: 123

❌ Failed payment:
Card: 4000 0000 0000 0002
Exp: 12/25
CVC: 123

⏳ Requires authentication:
Card: 4000 0025 0000 3155
Exp: 12/25
CVC: 123
```

---

## 📊 الخطط والـ Credits:

| الخطة | السعر | Credits | الميزات |
|------|-------|---------|---------|
| **Basic** | $20 | 500 | أساسي |
| **Pro** | $35 | 2000 | متقدم + API |
| **Enterprise** | $50 | 10000 | كل شيء |

---

## 🔐 الأمان:

✅ Webhook Signature Verification
✅ نقل آمن للبيانات (HTTPS)
✅ لا يتم تخزين بطاقات (Stripe يتولاها)
✅ Encryption في DB
✅ Rate limiting على الـ APIs

---

## 🐛 Troubleshooting:

### الدفع لا يعمل؟
- ✅ تحقق من Stripe API Keys
- ✅ تحقق من Webhook URL صحيح
- ✅ استخدم Test Keys للاختبار

### الـ WebHook لا يصل؟
- ✅ تحقق من URL الـ Webhook صحيح
- ✅ استخدم: `https://yourdomain.com/api/payment/webhook`
- ✅ اختبر باستخدام Stripe CLI: `stripe listen --forward-to localhost:3001/api/payment/webhook`

### البيانات لا تُحدّث؟
- ✅ تحقق من قاعدة البيانات
- ✅ تحقق من Database schema صحيح
- ✅ استخدم: `npx prisma studio`

---

## 📝 API Response Examples:

### Success:
```json
{
  "success": true,
  "sessionId": "cs_test_1234567890",
  "url": "https://checkout.stripe.com/pay/cs_test_1234567890"
}
```

### Error:
```json
{
  "error": "Invalid plan"
}
```

---

## 🎯 الخطوات الفورية:

1. اذهب إلى https://stripe.com
2. اضغط "Sign up"
3. أكمل التسجيل
4. اذهب إلى Dashboard
5. احصل على API Keys
6. أنشئ 3 Products مع Pricing
9. انسخ Price IDs
9. حدّث .env.local
10. فعّل Webhook

**بعدها الدفع سيعمل مباشرة! 🎉**

---

## 📚 المراجع:

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
