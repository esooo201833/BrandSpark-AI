'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface PaymentMethodsModalProps {
  isOpen: boolean;
  planId: string;
  planName: string;
  price: number;
  credits: number;
  onClose: () => void;
  onPaymentStart: (method: string) => void;
}

export function PaymentMethodsModal({
  isOpen,
  planId,
  planName,
  price,
  credits,
  onClose,
  onPaymentStart,
}: PaymentMethodsModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('stripe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PAYMENT_METHODS = [
    {
      id: 'stripe',
      name: 'Credit Card (Stripe)',
      icon: '💳',
      description: 'Safe and secure credit card payments',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'PayPal',
      description: 'Quick and easy with your PayPal account',
    },
    {
      id: 'perfectmoney',
      name: 'Perfect Money',
      icon: '💰',
      description: 'Popular payment method for online services',
    },
  ];

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const email = localStorage.getItem('userEmail') || '';
      const userId = localStorage.getItem('userId') || '';

      let endpoint = '';
      switch (selectedMethod) {
        case 'paypal':
          endpoint = '/api/payment/paypal';
          break;
        case 'perfectmoney':
          endpoint = '/api/payment/perfectmoney';
          break;
        default:
          endpoint = '/api/payment/checkout';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId,
          planName,
          price,
          credits,
          email,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      onPaymentStart(selectedMethod);

      // Redirect based on payment method
      if (selectedMethod === 'stripe' && data.url) {
        window.location.href = data.url;
      } else if (selectedMethod === 'paypal' && data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else if (selectedMethod === 'perfectmoney' && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('No valid payment URL returned');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <h2 className="text-2xl font-bold mb-2">Select Payment Method</h2>
        <p className="text-gray-600 text-sm mb-6">
          Upgrade to {planName} - ${price}/month ({credits.toLocaleString()} credits)
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold text-gray-900">{method.name}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              <span className="text-xl">{method.icon}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Continue to Payment'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
