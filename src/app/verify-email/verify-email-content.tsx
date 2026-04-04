'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setError('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        const url = new URL('/api/auth/verify', window.location.origin);
        url.searchParams.append('token', token);
        url.searchParams.append('email', email);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // For redirect responses
        if (response.redirected) {
          setVerified(true);
          setError(null);
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        setVerified(true);
        setError(null);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, email, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-4">
          {loading ? (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold">جاري التحقق من بريدك...</h1>
              <p className="text-gray-600">Verifying your email...</p>
            </>
          ) : verified ? (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-green-600">تم التحقق بنجاح!</h1>
              <p className="text-gray-600">Email verified successfully!</p>
              <p className="text-sm text-gray-500">
                جاري إعادة التوجيه إلى صفحة الدخول...
                <br />
                Redirecting to login page...
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-green-600 hover:bg-green-700 mt-4"
              >
                اذهب إلى تسجيل الدخول / Go to Login
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-red-600">فشل التحقق</h1>
              <p className="text-gray-600">Verification failed</p>
              <p className="text-sm text-red-600">{error}</p>
              
              <div className="space-y-2 mt-6">
                <Button
                  onClick={() => router.push('/signup')}
                  variant="outline"
                  className="w-full"
                >
                  عودة إلى التسجيل / Back to Signup
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  تسجيل الدخول / Login
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>ملاحظة:</strong> لا تشارك هذا الرابط مع أحد آخر.
            <br />
            <strong>Note:</strong> Don&apos;t share this link with anyone else.
          </p>
        </div>
      </Card>
    </div>
  );
}
