'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsOverviewProps {
  timeframe?: 'week' | 'month' | 'year';
}

export function AnalyticsOverview({ timeframe = 'month' }: AnalyticsOverviewProps) {
  const metrics = [
    {
      label: 'Total Conversions',
      value: '45,231',
      change: '+12.5%',
      type: 'positive' as const,
    },
    {
      label: 'Conversion Rate',
      value: '3.2%',
      change: '+2.1%',
      type: 'positive' as const,
    },
    {
      label: 'Avg Order Value',
      value: '$324.50',
      change: '-1.3%',
      type: 'negative' as const,
    },
    {
      label: 'Cost per Conversion',
      value: '$24.50',
      change: '+0.8%',
      type: 'negative' as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                metric.type === 'positive'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              <span className="mr-1">
                {metric.type === 'positive' ? (
                  <TrendingUp className="inline h-3 w-3" />
                ) : (
                  <TrendingDown className="inline h-3 w-3" />
                )}
              </span>
              {metric.change}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default AnalyticsOverview;
