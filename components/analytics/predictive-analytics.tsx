'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Brain } from 'lucide-react';

export function PredictiveAnalytics() {
  const predictions = [
    {
      metric: 'Expected Revenue (Next 30 Days)',
      value: '$45,320',
      confidence: '92%',
      trend: '+8.5%',
    },
    {
      metric: 'Predicted Churn Rate',
      value: '3.2%',
      confidence: '85%',
      trend: '-1.2%',
    },
    {
      metric: 'Estimated Customer Lifetime Value',
      value: '$2,850',
      confidence: '88%',
      trend: '+12.3%',
    },
    {
      metric: 'Forecasted Conversion Rate',
      value: '3.8%',
      confidence: '90%',
      trend: '+0.6%',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Predictive Analytics
        </CardTitle>
        <CardDescription>AI-powered predictions for the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{prediction.metric}</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-2xl font-bold">{prediction.value}</p>
                  <Badge variant="secondary" className="text-xs">
                    {prediction.confidence} confidence
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">{prediction.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PredictiveAnalytics;
