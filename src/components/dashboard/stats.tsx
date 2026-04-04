'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Zap, TrendingUp, Clock } from 'lucide-react';

interface Stats {
  today: number;
  thisMonth: number;
  total: number;
}

export function GenerationStats() {
  const [stats, setStats] = useState<Stats>({
    today: 0,
    thisMonth: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/history');
        const data = await response.json();

        if (data.success && data.data) {
          const generations = data.data.generations || [];
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

          const todayCount = generations.filter((g: { createdAt: string }) => {
            const genDate = new Date(g.createdAt);
            return genDate >= today;
          }).length;

          const thisMonthCount = generations.filter((g: { createdAt: string }) => {
            const genDate = new Date(g.createdAt);
            return genDate >= monthStart;
          }).length;

          setStats({
            today: todayCount,
            thisMonth: thisMonthCount,
            total: generations.length,
          });
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
        // Set default stats on error
        setStats({ today: 0, thisMonth: 0, total: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      label: 'Today',
      value: stats.today,
      icon: Zap,
      color: 'amber',
    },
    {
      label: 'This Month',
      value: stats.thisMonth,
      icon: TrendingUp,
      color: 'blue',
    },
    {
      label: 'Total',
      value: stats.total,
      icon: Clock,
      color: 'slate',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const colorClasses = {
          amber: 'text-amber-500',
          blue: 'text-blue-500',
          slate: 'text-slate-500',
        };

        return (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? '—' : stat.value}
                </p>
              </div>
              <Icon
                className={`w-8 h-8 opacity-30 ${colorClasses[stat.color as keyof typeof colorClasses]}`}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
