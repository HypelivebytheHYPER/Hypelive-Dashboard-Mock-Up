'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Zap, Target } from 'lucide-react';

export function CompetitiveIntelligence() {
  const competitors = [
    {
      name: 'Competitor A',
      marketShare: '28%',
      strength: 'Brand Recognition',
      weakness: 'High Pricing',
      trend: '+2.3%',
    },
    {
      name: 'Competitor B',
      marketShare: '22%',
      strength: 'Customer Service',
      weakness: 'Limited Features',
      trend: '-0.8%',
    },
    {
      name: 'Your Company',
      marketShare: '31%',
      strength: 'Innovation',
      weakness: 'New to Market',
      trend: '+5.2%',
    },
    {
      name: 'Competitor C',
      marketShare: '19%',
      strength: 'Price Competition',
      weakness: 'Quality Concerns',
      trend: '+1.1%',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Competitive Intelligence
        </CardTitle>
        <CardDescription>Market position and competitor analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competitors.map((competitor, index) => (
            <div key={index} className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{competitor.name}</h4>
                <Badge variant={competitor.name === 'Your Company' ? 'default' : 'secondary'}>
                  {competitor.marketShare} Market Share
                </Badge>
              </div>

              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Strength
                  </p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {competitor.strength}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Weakness
                  </p>
                  <p className="font-medium text-red-600 dark:text-red-400">
                    {competitor.weakness}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-2 text-xs">
                <span className="text-muted-foreground">Market Position Change</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {competitor.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CompetitiveIntelligence;
