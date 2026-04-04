import { NextRequest, NextResponse } from 'next/server';

/**
 * Analytics and statistics endpoint
 * Tracks usage patterns and performance metrics
 */

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

// Simple in-memory analytics
const analytics = {
  totalGenerations: 0,
  successfulGenerations: 0,
  cachedGenerations: 0,
  totalResponseTime: 0,
  requestsLastMinute: 0,
  lastMinuteReset: Date.now(),
  generationsByType: new Map<string, number>(),
  generationsByTone: new Map<string, number>(),
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'hour', 'day', 'week', 'all'

    // Calculate statistics
    const sortedTypes = Array.from(analytics.generationsByType.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    const sortedTones = Array.from(analytics.generationsByTone.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tone, count]) => ({ tone, count }));

    const cacheHitRate =
      analytics.totalGenerations > 0
        ? (analytics.cachedGenerations / analytics.totalGenerations) * 100
        : 0;

    const successRate =
      analytics.totalGenerations > 0
        ? (analytics.successfulGenerations / analytics.totalGenerations) * 100
        : 0;

    const averageResponseTime =
      analytics.successfulGenerations > 0
        ? analytics.totalResponseTime / analytics.successfulGenerations
        : 0;

    const data: AnalyticsData = {
      totalGenerations: analytics.totalGenerations,
      generationsByType: Object.fromEntries(analytics.generationsByType),
      generationsByTone: Object.fromEntries(analytics.generationsByTone),
      popularContentTypes: sortedTypes,
      popularTones: sortedTones,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      requestsPerMinute: analytics.requestsLastMinute,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
    };

    return NextResponse.json({
      success: true,
      data,
      period,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, tone, cached, responseTime, success } = await request.json();

    if (!type || !tone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update counters
    analytics.totalGenerations++;
    
    if (success) {
      analytics.successfulGenerations++;
    }

    if (cached) {
      analytics.cachedGenerations++;
    }

    if (responseTime) {
      analytics.totalResponseTime += responseTime;
    }

    // Update type and tone maps
    analytics.generationsByType.set(
      type,
      (analytics.generationsByType.get(type) || 0) + 1
    );
    analytics.generationsByTone.set(
      tone,
      (analytics.generationsByTone.get(tone) || 0) + 1
    );

    // Update requests per minute
    const now = Date.now();
    if (now - analytics.lastMinuteReset > 60000) {
      analytics.requestsLastMinute = 0;
      analytics.lastMinuteReset = now;
    }
    analytics.requestsLastMinute++;

    return NextResponse.json({
      success: true,
      message: 'Analytics recorded',
    });
  } catch (error) {
    console.error('Analytics record error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record analytics' },
      { status: 500 }
    );
  }
}

export { analytics };
