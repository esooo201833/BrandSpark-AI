'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { PaymentMethodsModal } from './payment-methods-modal';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 20,
    credits: 500,
    description: 'Perfect for getting started',
    features: [
      '500 AI Credits/month',
      'All content types',
      '4 tone variations',
      'Email support',
      'History storage (30 days)',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 35,
    credits: 2000,
    description: 'For growing teams',
    features: [
      '2000 AI Credits/month',
      'All content types',
      '4 tone variations',
      'Priority support',
      'History storage (90 days)',
      'API access',
      'Custom templates',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 50,
    credits: 10000,
    description: 'For large scale',
    features: [
      '10000 AI Credits/month',
      'All content types',
      '4 tone variations',
      '24/7 support',
      'History storage (unlimited)',
      'API access',
      'Custom templates',
      'Team collaboration',
      'Advanced analytics',
    ],
  },
];

export function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleUpgrade = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`p-6 relative flex flex-col ${
              plan.popular ? 'ring-2 ring-blue-500 md:scale-105' : ''
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
            )}

            <h3 className="text-2xl font-bold mt-4">{plan.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{plan.description}</p>

            <div className="mt-6 mb-6">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-gray-600">/month</span>
            </div>

            <div className="mb-6 p-3 bg-blue-50 rounded">
              <p className="text-sm font-semibold text-blue-900">
                {plan.credits.toLocaleString()} Credits
              </p>
            </div>

            <Button
              onClick={() => handleUpgrade(plan)}
              disabled={loading !== null}
              className={`w-full mb-6 ${
                plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-800 hover:bg-gray-900'
              }`}
            >
              {loading === plan.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get Started'
              )}
            </Button>

            <div className="space-y-3 flex-grow">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <PaymentMethodsModal
          isOpen={showPaymentModal}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          price={selectedPlan.price}
          credits={selectedPlan.credits}
          onClose={() => setShowPaymentModal(false)}
          onPaymentStart={() => setLoading(selectedPlan.id)}
        />
      )}
    </div>
  );
}
