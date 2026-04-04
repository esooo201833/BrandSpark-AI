'use client';

import { ContentGenerator } from '@/components/generator/content-generator';
import { GenerationStats } from '@/components/dashboard/stats';
import { HistoryList } from '@/components/history/history-list';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          // Redirect to login if not authenticated
          router.push('/login?redirect=/dashboard');
        }
      } catch {
        // If check fails, assume not authenticated
        router.push('/login?redirect=/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h1>
          <p className="text-slate-600">{t('generateContent')} powered by AI</p>
        </div>

        {/* Stats */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Stats</h2>
          <GenerationStats />
        </div>

        {/* Main Content - Generator and Quick History */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Generator - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('generateContent')}</h2>
            <ContentGenerator />
          </div>

          {/* Recent Generations - Takes up 1 column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">{t('history')}</h2>
              <Link href="/dashboard/history">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <Card className="p-4">
              <HistoryList limit={5} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
