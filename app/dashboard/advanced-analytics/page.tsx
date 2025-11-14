/**
 * Advanced Analytics Dashboard
 * Comprehensive analytics with ROI calculation, predictive insights, and custom reporting
 */

import { Suspense } from 'react';
import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { ROICalculator } from '@/components/analytics/roi-calculator';
import { PredictiveAnalytics } from '@/components/analytics/predictive-analytics';
import { CompetitiveIntelligence } from '@/components/analytics/competitive-intelligence';
import { CustomReportBuilder } from '@/components/analytics/custom-report-builder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Target, FileText, Download, Filter } from 'lucide-react';

export const metadata = {
  title: 'Advanced Analytics',
  description: 'Comprehensive analytics with ROI calculation and predictive insights',
};

export default function AdvancedAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Deep insights into campaign performance, ROI analysis, and predictive analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter Data
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <Suspense fallback={<AnalyticsOverviewSkeleton />}>
        <AnalyticsOverview />
      </Suspense>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="roi" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            ROI Analysis
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictive Insights
          </TabsTrigger>
          <TabsTrigger value="competitive" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Competitive Intel
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Custom Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Suspense fallback={<PerformanceAnalyticsSkeleton />}>
            <PerformanceAnalytics />
          </Suspense>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <Suspense fallback={<ROISkeleton />}>
            <ROICalculator />
          </Suspense>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Suspense fallback={<PredictiveSkeleton />}>
            <PredictiveAnalytics />
          </Suspense>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-4">
          <Suspense fallback={<CompetitiveSkeleton />}>
            <CompetitiveIntelligence />
          </Suspense>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Suspense fallback={<ReportsSkeleton />}>
            <CustomReportBuilder />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnalyticsOverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-40 bg-muted animate-pulse rounded mb-2" />
            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PerformanceAnalyticsSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Trends</CardTitle>
          <CardDescription>Multi-touch attribution and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
      
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>KOL Performance Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ROISkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>ROI Calculator</CardTitle>
          <CardDescription>Multi-touch attribution modeling and ROI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Attribution Model Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    </div>
  );
}

function PredictiveSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics</CardTitle>
          <CardDescription>ML-powered forecasting and trend prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-48 bg-muted animate-pulse rounded" />
                <div className="h-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CompetitiveSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Competitive Intelligence</CardTitle>
          <CardDescription>Market benchmarking and competitor analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-80 bg-muted animate-pulse rounded" />
            <div className="h-80 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
        <CardDescription>Create personalized reports with drag-and-drop interface</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-96 bg-muted animate-pulse rounded" />
          <div className="h-96 bg-muted animate-pulse rounded" />
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}