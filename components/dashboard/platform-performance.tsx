"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { analyticsService } from "@/lib/api/services/analytics-service"
import { logger } from "@/lib/core/observability/logger"
import { cn } from "@/lib/utils"
import { BarChart3, TrendingUp, Users, DollarSign, Target } from "lucide-react"

export interface PlatformPerformanceProps extends React.ComponentPropsWithoutRef<"div"> {
  showCharts?: boolean
  showProgressBars?: boolean
  maxPlatforms?: number
  className?: string
}

export interface PlatformData {
  platform: string
  campaigns: number
  reach: number
  engagement: number
  spend: number
  engagement_rate?: number
  growth_rate?: number
}

export interface ChartDataPoint {
  platform: string
  reach: number
  engagement: number
  spend: number
}

// Loading skeleton component
export const PlatformPerformanceSkeleton: React.FC<{ className?: string }> = React.memo(({ className }) => (
  <div className={cn("space-y-6 animate-pulse", className)}>
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
        <CardDescription>Loading platform data...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-8 w-8 animate-pulse" />
            <span className="text-sm">Loading chart data...</span>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Platform Breakdown</CardTitle>
        <CardDescription>Loading platform breakdown...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-muted rounded w-32" />
                <div className="h-4 bg-muted rounded w-16" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
))

PlatformPerformanceSkeleton.displayName = "PlatformPerformanceSkeleton"

// Error state component
export const PlatformPerformanceError: React.FC<{ 
  error: Error
  onRetry?: () => void
  className?: string 
}> = React.memo(({ error, onRetry, className }) => (
  <div className={cn("space-y-6", className)}>
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Failed to Load Platform Data</CardTitle>
        <CardDescription>Unable to load platform performance data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Target className="h-8 w-8 text-destructive" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {error.message || "An unexpected error occurred while loading the platform data."}
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
  </div>
))

PlatformPerformanceError.displayName = "PlatformPerformanceError"

// Empty state component
export const PlatformPerformanceEmpty: React.FC<{ className?: string }> = React.memo(({ className }) => (
  <div className={cn("space-y-6", className)}>
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>No Platform Data Available</CardTitle>
        <CardDescription>No platform data to display</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Target className="h-8 w-8 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              There is no platform data available at the moment.
            </p>
            <p className="text-xs text-muted-foreground">
              Platform data will appear here as campaigns are created and run.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
))

PlatformPerformanceEmpty.displayName = "PlatformPerformanceEmpty"

// Platform metrics component
export const PlatformMetrics: React.FC<{ 
  platform: PlatformData
  showProgressBars?: boolean
  className?: string 
}> = React.memo(({
  platform,
  showProgressBars = true,
  className
}) => {
  const getEngagementColor = React.useCallback((engagementRate?: number) => {
    if (!engagementRate) return 'text-muted-foreground'
    if (engagementRate >= 8) return 'text-green-600 dark:text-green-400'
    if (engagementRate >= 5) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }, [])

  const getGrowthColor = React.useCallback((growthRate?: number) => {
    if (!growthRate) return 'text-muted-foreground'
    if (growthRate >= 15) return 'text-green-600 dark:text-green-400'
    if (growthRate >= 5) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }, [])

  const getPlatformIcon = React.useCallback((platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return '📸'
      case 'tiktok':
        return '🎵'
      case 'line':
        return '💬'
      case 'blog':
        return '📝'
      default:
        return '🌐'
    }
  }, [])

  const getPlatformColor = React.useCallback((platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-r from-pink-500 to-purple-500'
      case 'tiktok':
        return 'bg-gradient-to-r from-black to-gray-800'
      case 'line':
        return 'bg-gradient-to-r from-green-500 to-emerald-500'
      case 'blog':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-700'
    }
  }, [])

  const maxValues = React.useMemo(() => ({
    reach: Math.max(...[platform.reach, platform.engagement, platform.spend]),
    engagement: Math.max(...[platform.reach, platform.engagement, platform.spend]),
    spend: Math.max(...[platform.reach, platform.engagement, platform.spend])
  }), [platform])

  return (
    <div className={cn("space-y-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-lg", getPlatformColor(platform.platform))}>
            {getPlatformIcon(platform.platform)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold capitalize truncate">{platform.platform}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {platform.campaigns} campaigns
              </Badge>
              {platform.engagement_rate && (
                <Badge variant="outline" className={cn("text-xs", getEngagementColor(platform.engagement_rate))}>
                  {platform.engagement_rate}% engagement
                </Badge>
              )}
              {platform.growth_rate && (
                <Badge variant="outline" className={cn("text-xs", getGrowthColor(platform.growth_rate))}>
                  +{platform.growth_rate}% growth
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className={cn("flex items-center gap-1 text-sm font-medium", getEngagementColor(platform.engagement_rate))}>
          <TrendingUp className="h-4 w-4" />
          {platform.engagement_rate ? `${platform.engagement_rate}%` : 'N/A'}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Reach</span>
          </div>
          <span className="font-medium">{Math.round(platform.reach / 1000)}K</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Engagement</span>
          </div>
          <span className="font-medium">{Math.round(platform.engagement / 1000)}K</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Spend</span>
          </div>
          <span className="font-medium">${Math.round(platform.spend / 1000)}K</span>
        </div>
      </div>

      {showProgressBars && (
        <div className="space-y-2">
          <div className="grid gap-2">
            <div className="flex justify-between text-xs">
              <span>Reach</span>
              <span>{Math.round((platform.reach / maxValues.reach) * 100)}%</span>
            </div>
            <Progress value={(platform.reach / maxValues.reach) * 100} className="h-2" />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between text-xs">
              <span>Engagement</span>
              <span>{Math.round((platform.engagement / maxValues.engagement) * 100)}%</span>
            </div>
            <Progress value={(platform.engagement / maxValues.engagement) * 100} className="h-2" />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between text-xs">
              <span>Spend</span>
              <span>{Math.round((platform.spend / maxValues.spend) * 100)}%</span>
            </div>
            <Progress value={(platform.spend / maxValues.spend) * 100} className="h-2" />
          </div>
        </div>
      )}
    </div>
  )
})

PlatformMetrics.displayName = "PlatformMetrics"

// Main component with full optimization
export const PlatformPerformance: React.FC<PlatformPerformanceProps> = React.memo(({
  showCharts = true,
  showProgressBars = true,
  maxPlatforms = 10,
  className,
  ...props
}) => {
  const [platforms, setPlatforms] = React.useState<PlatformData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  // Memoized data fetching function
  const fetchPlatformData = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      logger.info('Fetching platform performance data', { showCharts, showProgressBars, maxPlatforms })
      
      // Mock data for development - replace with real API calls
      const mockPlatforms: PlatformData[] = [
        {
          platform: 'instagram',
          campaigns: 18,
          reach: 1250000,
          engagement: 78000,
          spend: 380000,
          engagement_rate: 6.22,
          growth_rate: 12.5
        },
        {
          platform: 'tiktok',
          campaigns: 12,
          reach: 980000,
          engagement: 52000,
          spend: 280000,
          engagement_rate: 5.31,
          growth_rate: 18.2
        },
        {
          platform: 'line',
          campaigns: 8,
          reach: 420000,
          engagement: 18000,
          spend: 120000,
          engagement_rate: 4.29,
          growth_rate: 8.7
        },
        {
          platform: 'blog',
          campaigns: 7,
          reach: 200000,
          engagement: 8000,
          spend: 70000,
          engagement_rate: 4.0,
          growth_rate: 6.1
        }
      ]
      
      setPlatforms(mockPlatforms.slice(0, maxPlatforms))
      
      logger.info('Platform performance data loaded successfully', { count: mockPlatforms.length })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load platform performance data')
      setError(error)
      logger.error('Failed to load platform performance data', { error: err })
    } finally {
      setLoading(false)
    }
  }, [showCharts, showProgressBars, maxPlatforms])

  // Error state
  if (error) {
    return <PlatformPerformanceError error={error} onRetry={fetchPlatformData} className={className} />
  }

  // Loading state
  if (loading) {
    return <PlatformPerformanceSkeleton className={className} />
  }

  // Empty state
  if (platforms.length === 0) {
    return <PlatformPerformanceEmpty className={className} />
  }

  // Memoized chart data transformation
  const chartData = React.useMemo<ChartDataPoint[]>(() => {
    return platforms.map((platform) => ({
      platform: platform.platform,
      reach: Math.round(platform.reach / 1000),
      engagement: Math.round(platform.engagement / 1000),
      spend: Math.round(platform.spend / 1000)
    }))
  }, [platforms])

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {showCharts && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Campaign metrics by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="platform" 
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
                      `${value}K`,
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                  />
                  <Bar dataKey="reach" fill="#8884d8" name="Reach" />
                  <Bar dataKey="engagement" fill="#82ca9d" name="Engagement" />
                  <Bar dataKey="spend" fill="#ffc658" name="Spend" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Platform Breakdown</CardTitle>
          <CardDescription>Detailed metrics for each platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platforms.map((platform) => (
              <PlatformMetrics 
                key={platform.platform}
                platform={platform}
                showProgressBars={showProgressBars}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

PlatformPerformance.displayName = "PlatformPerformance"

// Export all component parts for reusability
export { PlatformPerformanceSkeleton, PlatformPerformanceError, PlatformPerformanceEmpty, PlatformMetrics }
export type { PlatformPerformanceProps, PlatformData, ChartDataPoint }