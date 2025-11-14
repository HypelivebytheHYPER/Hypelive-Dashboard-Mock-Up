"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { analyticsService } from "@/lib/api/services/analytics-service"
import { logger } from "@/lib/core/observability/logger"
import { cn } from "@/lib/utils"
import { AlertCircle, BarChart3 } from "lucide-react"

export interface DashboardMetricsProps extends React.ComponentPropsWithoutRef<"div"> {
  timeframe?: 'day' | 'week' | 'month' | 'quarter'
  autoRefresh?: boolean
  refreshInterval?: number
  showCharts?: boolean
  className?: string
}

export interface DashboardMetricsData {
  overview: {
    total_campaigns: number
    active_campaigns: number
    total_kols: number
    total_reach: number
    total_engagement: number
    avg_engagement_rate: number
    total_spend: number
    total_revenue: number
    roi: number
  }
  performance_trends: Array<{
    date: string
    campaigns: number
    reach: number
    engagement: number
    spend: number
  }>
  platform_distribution: Record<string, {
    campaigns: number
    reach: number
    engagement: number
    spend: number
  }>
  top_performing_campaigns: Array<{
    id: string
    name: string
    reach: number
    engagement: number
    engagement_rate: number
    spend: number
    revenue: number
    roi: number
  }>
  recent_activities: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    user: string
    campaign_id?: string
  }>
}

export interface ChartDataPoint {
  date: string
  campaigns: number
  reach: number
  engagement: number
  spend: number
}

export interface PlatformData {
  platform: string
  campaigns: number
  reach: number
  engagement: number
  spend: number
}

// Loading skeleton component
export const DashboardMetricsSkeleton: React.FC<{ className?: string }> = React.memo(({ className }) => (
  <Card className={cn("animate-pulse", className)}>
    <CardHeader>
      <CardTitle>Performance Overview</CardTitle>
      <CardDescription>Loading metrics...</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[350px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <BarChart3 className="h-8 w-8 animate-pulse" />
          <span className="text-sm">Loading chart data...</span>
        </div>
      </div>
    </CardContent>
  </Card>
))

DashboardMetricsSkeleton.displayName = "DashboardMetricsSkeleton"

// Error state component
export const DashboardMetricsError: React.FC<{ 
  error: Error
  onRetry?: () => void
  className?: string 
}> = React.memo(({ error, onRetry, className }) => (
  <Card className={cn("border-destructive", className)}>
    <CardHeader>
      <CardTitle className="text-destructive">Failed to Load Metrics</CardTitle>
      <CardDescription>Unable to load dashboard metrics</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred while loading the metrics."}
          </p>
          <p className="text-xs text-muted-foreground">
            Please try again or contact support if the problem persists.
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            Try Again
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
))

DashboardMetricsError.displayName = "DashboardMetricsError"

// Empty state component
export const DashboardMetricsEmpty: React.FC<{ className?: string }> = React.memo(({ className }) => (
  <Card className={cn("border-dashed", className)}>
    <CardHeader>
      <CardTitle>No Data Available</CardTitle>
      <CardDescription>No metrics data to display</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            There is no metrics data available at the moment.
          </p>
          <p className="text-xs text-muted-foreground">
            This could be because no campaigns are active or data is still being processed.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
))

DashboardMetricsEmpty.displayName = "DashboardMetricsEmpty"

// Main component with full optimization
export const DashboardMetrics: React.FC<DashboardMetricsProps> = React.memo(({
  timeframe = 'month',
  autoRefresh = false,
  refreshInterval = 300000, // 5 minutes
  showCharts = true,
  className,
  ...props
}) => {
  const [metrics, setMetrics] = React.useState<DashboardMetricsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  // Memoized data fetching function
  const fetchMetrics = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      logger.info('Fetching dashboard metrics', { timeframe, autoRefresh })
      
      const data = await analyticsService.getDashboardMetrics(timeframe)
      setMetrics(data)
      
      logger.info('Dashboard metrics loaded successfully', { 
        totalCampaigns: data.overview.total_campaigns,
        totalRevenue: data.overview.total_revenue 
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load dashboard metrics')
      setError(error)
      logger.error('Failed to load dashboard metrics', { error: err, timeframe })
    } finally {
      setLoading(false)
    }
  }, [timeframe])

  // Auto-refresh logic
  React.useEffect(() => {
    if (!autoRefresh) return
    
    logger.debug('Setting up auto-refresh', { refreshInterval })
    
    const interval = setInterval(() => {
      logger.debug('Auto-refreshing metrics')
      fetchMetrics()
    }, refreshInterval)
    
    return () => {
      logger.debug('Cleaning up auto-refresh interval')
      clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, fetchMetrics])

  // Initial data load
  React.useEffect(() => {
    logger.debug('Initial metrics load', { timeframe })
    fetchMetrics()
  }, [fetchMetrics])

  // Memoized chart data transformation
  const chartData = React.useMemo<ChartDataPoint[]>(() => {
    if (!metrics?.performance_trends) return []
    
    return metrics.performance_trends.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      campaigns: item.campaigns,
      reach: Math.round(item.reach / 1000),
      engagement: Math.round(item.engagement / 1000),
      spend: Math.round(item.spend / 1000)
    }))
  }, [metrics?.performance_trends])

  // Memoized platform data
  const platformData = React.useMemo<PlatformData[]>(() => {
    if (!metrics?.platform_distribution) return []
    
    return Object.entries(metrics.platform_distribution).map(([platform, data]) => ({
      platform,
      campaigns: data.campaigns,
      reach: Math.round(data.reach / 1000),
      engagement: Math.round(data.engagement / 1000),
      spend: Math.round(data.spend / 1000)
    }))
  }, [metrics?.platform_distribution])

  // Error state
  if (error) {
    return <DashboardMetricsError error={error} onRetry={fetchMetrics} className={className} />
  }

  // Loading state
  if (loading) {
    return <DashboardMetricsSkeleton className={className} />
  }

  // Empty state
  if (!metrics) {
    return <DashboardMetricsEmpty className={className} />
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Campaign performance over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any, name: string) => [
                    name === 'reach' || name === 'engagement' || name === 'spend' 
                      ? `${value}K` 
                      : value,
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="campaigns" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Campaigns"
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Reach"
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#82ca9d', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#ffc658" 
                  strokeWidth={2}
                  name="Engagement"
                  dot={{ fill: '#ffc658', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ffc658', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {showCharts && platformData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Campaign performance by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {platformData.map((platform) => (
                <div 
                  key={platform.platform} 
                  className="space-y-2 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {platform.platform}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {platform.campaigns} campaigns
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Reach</span>
                      <span className="font-medium">{platform.reach}K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Engagement</span>
                      <span className="font-medium">{platform.engagement}K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Spend</span>
                      <span className="font-medium">${platform.spend}K</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
})

DashboardMetrics.displayName = "DashboardMetrics"

// Export all component parts for reusability
export { DashboardMetricsSkeleton, DashboardMetricsError, DashboardMetricsEmpty }
export type { DashboardMetricsProps, DashboardMetricsData, ChartDataPoint, PlatformData }