'use client';

import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import VerifyEmailContent from './verify-email-content';

export const dynamic = 'force-dynamic';

function VerifyEmailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold">جاري التحقق من بريدك...</h1>
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
