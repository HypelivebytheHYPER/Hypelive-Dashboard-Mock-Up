import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { ROICalculator } from '@/components/analytics/roi-calculator';
import { PredictiveAnalytics } from '@/components/analytics/predictive-analytics';
import { CompetitiveIntelligence } from '@/components/analytics/competitive-intelligence';
import { CustomReportBuilder } from '@/components/analytics/custom-report-builder';

export const metadata = {
  title: 'Advanced Analytics | HypeLive Dashboard',
  description: 'Advanced analytics and insights for your business',
};

export default function AdvancedAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Deep insights into your business performance with predictive analytics and competitive intelligence.
        </p>
      </div>

      <AnalyticsOverview timeframe="month" />

      <div className="grid gap-6 md:grid-cols-2">
        <ROICalculator />
        <CustomReportBuilder />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PredictiveAnalytics />
        <CompetitiveIntelligence />
      </div>
    </div>
  );
}
