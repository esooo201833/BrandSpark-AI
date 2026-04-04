'use client';

import { PricingCards } from '@/components/payment/pricing-cards';
import { useLanguage } from '@/hooks/useLanguage';

export default function PricingPage() {
  const { t, mounted } = useLanguage();

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">{t('pricing')}</h1>
          <p className="text-lg text-slate-600">
            {t('selectPlan')}
          </p>
        </div>

        {/* Pricing Cards with Payment Methods */}
        <PricingCards />
      </div>
    </div>
  );
}
