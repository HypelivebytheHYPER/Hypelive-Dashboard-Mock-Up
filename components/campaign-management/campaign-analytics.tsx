"use client";

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { campaignService } from '@/lib/api/services/campaign-service';
import { analyticsService } from '@/lib/api/services/analytics-service';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';

export function CampaignAnalytics() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['campaign-analytics'],
    queryFn: () => analyticsService.getCampaignAnalytics('current'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error Loading Analytics</CardTitle>
          <CardDescription>Failed to load campaign analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return null;
  }

  const platformColors = {
    tiktok: '#FF0050',
    instagram: '#E4405F',
    youtube: '#FF0000',
    facebook: '#1877F2'
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Campaign Performance Trends</CardTitle>
                <CardDescription>30-day performance overview</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.daily_metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tickFormatter={(value) => formatNumber(value)} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [formatNumber(value), 'Value']}
                />
                <Line 
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Impressions"
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Engagement"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#ffc658" 
                  strokeWidth={2}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Breakdown by social media platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.platform_breakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis tickFormatter={(value) => formatNumber(value)} />
                <Tooltip formatter={(value: number) => [formatNumber(value), 'Value']} />
                <Bar dataKey="impressions" fill="#8884d8" name="Impressions" />
                <Bar dataKey="engagement" fill="#82ca9d" name="Engagement" />
                <Bar dataKey="conversions" fill="#ffc658" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KOL Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>KOL Performance Ranking</CardTitle>
              <CardDescription>Top performing KOLs in your campaigns</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.kol_performance.slice(0, 5).map((kol, index) => (
              <div key={kol.kol_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{kol.kol_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {kol.content_pieces} content pieces • {kol.engagement_rate}% engagement
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(kol.revenue)}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{kol.roi}%</p>
                    <p className="text-sm text-muted-foreground">ROI</p>
                  </div>
                  <Badge variant={kol.roi > 300 ? 'default' : kol.roi > 200 ? 'secondary' : 'destructive'}>
                    {kol.roi > 300 ? 'Excellent' : kol.roi > 200 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Performance */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Type Performance</CardTitle>
            <CardDescription>Performance by content format</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.content_performance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.content_type}: ${entry.engagement_rate.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="engagement_rate"
                >
                  {analytics.content_performance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'][index % 6]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Engagement Rate']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audience Insights</CardTitle>
            <CardDescription>Demographics and engagement patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Top Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {analytics.audience_insights.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Best Engagement Times</h4>
                <div className="flex flex-wrap gap-2">
                  {analytics.audience_insights.engagement_patterns.best_times.map((time, index) => (
                    <Badge key={index} variant="outline">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Platform Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {analytics.audience_insights.demographics.platform_preferences?.map((platform, index) => (
                    <Badge key={index} variant="outline">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>Customer journey from awareness to conversion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.conversion_funnel.stages.map((stage, index) => (
              <div key={stage.name} className="relative">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{stage.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(stage.visitors)} visitors
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{stage.conversion_rate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(stage.conversions)} conversions
                    </p>
                  </div>
                </div>
                {index < analytics.conversion_funnel.stages.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        Drop-off: {stage.drop_off_rate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold">{analytics.conversion_funnel.conversion_rate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{formatCurrency(analytics.conversion_funnel.average_order_value)}</p>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{formatCurrency(analytics.conversion_funnel.customer_lifetime_value)}</p>
                <p className="text-sm text-muted-foreground">Customer Lifetime Value</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Recommendations</CardTitle>
              <CardDescription>AI-powered insights to optimize your campaigns</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}