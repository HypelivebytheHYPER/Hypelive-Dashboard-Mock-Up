'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Calculator } from 'lucide-react';

interface ROIData {
  investment: number;
  revenue: number;
  roi: number;
}

export function ROICalculator() {
  const [investment, setInvestment] = useState('5000');
  const [revenue, setRevenue] = useState('15000');
  const [result, setResult] = useState<ROIData | null>(null);

  const calculateROI = () => {
    const inv = parseFloat(investment) || 0;
    const rev = parseFloat(revenue) || 0;

    if (inv === 0) {
      return;
    }

    const roi = ((rev - inv) / inv) * 100;
    setResult({
      investment: inv,
      revenue: rev,
      roi: roi,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          ROI Calculator
        </CardTitle>
        <CardDescription>Calculate your return on investment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="investment">Investment Amount ($)</Label>
            <Input
              id="investment"
              type="number"
              placeholder="Enter investment amount"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue Generated ($)</Label>
            <Input
              id="revenue"
              type="number"
              placeholder="Enter revenue amount"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="text-base"
            />
          </div>
        </div>

        <Button onClick={calculateROI} className="w-full">
          Calculate ROI
        </Button>

        {result && (
          <div className="space-y-3 rounded-lg bg-muted p-4">
            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Investment</p>
                <p className="text-lg font-semibold">${result.investment.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-lg font-semibold">${result.revenue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-lg font-semibold text-green-600">
                  {result.roi.toFixed(2)}%
                </p>
              </div>
            </div>
            {result.roi >= 0 ? (
              <p className="text-xs text-green-700 dark:text-green-400">
                Great return! Your investment generated a positive ROI.
              </p>
            ) : (
              <p className="flex gap-2 text-xs text-red-700 dark:text-red-400">
                <AlertCircle className="h-3 w-3 shrink-0" />
                Your investment resulted in a loss.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ROICalculator;
