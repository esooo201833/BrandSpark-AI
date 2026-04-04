'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, RefreshCw, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalGenerations: number;
  generationsByType: Record<string, number>;
  generationsByTone: Record<string, number>;
  popularContentTypes: Array<{ type: string; count: number }>;
  popularTones: Array<{ tone: string; count: number }>;
  averageResponseTime: number;
  requestsPerMinute: number;
  cacheHitRate: number;
  successRate: number;
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!analytics) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Loading analytics...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button onClick={fetchAnalytics} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Generations</div>
          <div className="text-3xl font-bold mt-2">{analytics.totalGenerations}</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-gray-600">Success Rate</div>
          <div className="text-3xl font-bold mt-2">{analytics.successRate.toFixed(1)}%</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-gray-600">Cache Hit Rate</div>
          <div className="text-3xl font-bold mt-2">{analytics.cacheHitRate.toFixed(1)}%</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-gray-600">Avg Response Time</div>
          <div className="text-3xl font-bold mt-2">{analytics.averageResponseTime.toFixed(0)}ms</div>
        </Card>
      </div>

      {/* Popular Content Types */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <BarChart className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Popular Content Types</h3>
        </div>
        <div className="space-y-3">
          {analytics.popularContentTypes.length > 0 ? (
            analytics.popularContentTypes.map(({ type, count }) => (
              <div key={type} className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium capitalize">{type}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(count / Math.max(...analytics.popularContentTypes.map(c => c.count))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-sm font-semibold ml-4">{count}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No data yet</p>
          )}
        </div>
      </Card>

      {/* Popular Tones */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Popular Tones</h3>
        </div>
        <div className="space-y-3">
          {analytics.popularTones.length > 0 ? (
            analytics.popularTones.map(({ tone, count }) => (
              <div key={tone} className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium capitalize">{tone}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(count / Math.max(...analytics.popularTones.map(c => c.count))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-sm font-semibold ml-4">{count}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No data yet</p>
          )}
        </div>
      </Card>
    </div>
  );
}
