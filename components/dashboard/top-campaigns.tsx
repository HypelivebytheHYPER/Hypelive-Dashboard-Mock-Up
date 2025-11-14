"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { analyticsService } from "@/lib/api/services/analytics-service"
import { logger } from "@/lib/core/observability/logger"
import { cn } from "@/lib/utils"
import { TrendingUp, Users, DollarSign, Target, Award } from "lucide-react"

export interface TopCampaignsProps extends React.ComponentPropsWithoutRef<"div"> {
  maxItems?: number
  showROI?: boolean
  showProgress?: boolean
  className?: string
}

export interface CampaignData {
  id: string
  name: string
  reach: number
  engagement: number
  engagement_rate: number
  spend: number
  revenue: number
  roi: number
  status?: 'active' | 'completed' | 'paused'
  progress?: number
}

// Loading skeleton component
export const TopCampaignsSkeleton: React.FC<{ className?: string }> = React.memo(({ className }) => (
  <Card className={cn("animate-pulse", className)}>
    <CardHeader>
      <CardTitle>Top Performing Campaigns</CardTitle>
      <CardDescription>Loading top campaigns...</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
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
))

TopCampaignsSkeleton.displayName = "TopCampaignsSkeleton"

// Error state component
export const TopCampaignsError: React.FC<{ 
  error: Error
  onRetry?: () => void
  className?: string 
}> = React.memo(({ error, onRetry, className }) => (
  <Card className={cn("border-destructive", className)}>
    <CardHeader>
      <CardTitle className="text-destructive">Failed to Load Campaigns</CardTitle>
      <CardDescription>Unable to load top performing campaigns</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Target className="h-8 w-8 text-destructive" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred while loading the campaigns."}
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

TopCampaignsError.displayName = "TopCampaignsError"

// Empty state component
export const TopCampaignsEmpty: React.FC<{ className?: string }> = React.memo(({ className }) => (
  <Card className={cn("border-dashed", className)}>
    <CardHeader>
      <CardTitle>No Campaigns Available</CardTitle>
      <CardDescription>No campaigns to display</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Target className="h-8 w-8 text-muted-foreground" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            There are no campaigns to display at the moment.
          </p>
          <p className="text-xs text-muted-foreground">
            Campaigns will appear here as they are created and launched.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
))

TopCampaignsEmpty.displayName = "TopCampaignsEmpty"

// Campaign card component
export const CampaignCard: React.FC<{ 
  campaign: CampaignData
  showROI?: boolean
  showProgress?: boolean
  className?: string 
}> = React.memo(({
  campaign,
  showROI = true,
  showProgress = true,
  className
}) => {
  const getROIColor = React.useCallback((roi: number) => {
    if (roi >= 3) return "text-green-600 dark:text-green-400"
    if (roi >= 2) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }, [])

  const getStatusBadge = React.useCallback((status?: string) => {
    if (!status) return null
    
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Completed</Badge>
      case 'paused':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Paused</Badge>
      default:
        return null
    }
  }, [])

  return (
    <div className={cn("space-y-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1 min-w-0 flex-1">
          <h4 className="text-sm font-semibold truncate">{campaign.name}</h4>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              Campaign ID: {campaign.id}
            </Badge>
            {getStatusBadge(campaign.status)}
          </div>
        </div>
        {showROI && (
          <div className={cn("flex items-center gap-1 text-sm font-medium", getROIColor(campaign.roi))}>
            <TrendingUp className="h-4 w-4" />
            {campaign.roi}x ROI
          </div>
        )}
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Reach</span>
          </div>
          <span className="font-medium">{Math.round(campaign.reach / 1000)}K</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Engagement</span>
          </div>
          <span className="font-medium">{Math.round(campaign.engagement / 1000)}K</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Spend</span>
          </div>
          <span className="font-medium">${Math.round(campaign.spend / 1000)}K</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Engagement Rate</span>
          </div>
          <span className="font-medium">{campaign.engagement_rate}%</span>
        </div>

        {showProgress && campaign.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Campaign Progress</span>
              <span>{campaign.progress}%</span>
            </div>
            <Progress value={campaign.progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Revenue: ${Math.round(campaign.revenue / 1000)}K
          </span>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
})

CampaignCard.displayName = "CampaignCard"

// Main component with full optimization
export const TopCampaigns: React.FC<TopCampaignsProps> = React.memo(({
  maxItems = 5,
  showROI = true,
  showProgress = true,
  className,
  ...props
}) => {
  const [campaigns, setCampaigns] = React.useState<CampaignData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  // Memoized data fetching function
  const fetchCampaigns = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      logger.info('Fetching top campaigns', { maxItems, showROI, showProgress })
      
      // Mock data for development - replace with real API calls
      const mockCampaigns: CampaignData[] = [
        {
          id: 'CMP001',
          name: 'Summer Beauty Campaign',
          reach: 185000,
          engagement: 12500,
          engagement_rate: 6.76,
          spend: 45000,
          revenue: 125000,
          roi: 2.78,
          status: 'active',
          progress: 75
        },
        {
          id: 'CMP002',
          name: 'Tech Product Launch',
          reach: 142000,
          engagement: 9800,
          engagement_rate: 6.90,
          spend: 38000,
          revenue: 95000,
          roi: 2.50,
          status: 'completed',
          progress: 100
        },
        {
          id: 'CMP003',
          name: 'Fashion Week Collaboration',
          reach: 98000,
          engagement: 7200,
          engagement_rate: 7.35,
          spend: 28000,
          revenue: 78000,
          roi: 2.79,
          status: 'active',
          progress: 60
        }
      ]
      
      setCampaigns(mockCampaigns.slice(0, maxItems))
      
      logger.info('Top campaigns loaded successfully', { count: mockCampaigns.length })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load top campaigns')
      setError(error)
      logger.error('Failed to load top campaigns', { error: err })
    } finally {
      setLoading(false)
    }
  }, [maxItems, showROI, showProgress])

  // Error state
  if (error) {
    return <TopCampaignsError error={error} onRetry={fetchCampaigns} className={className} />
  }

  // Loading state
  if (loading) {
    return <TopCampaignsSkeleton className={className} />
  }

  // Empty state
  if (campaigns.length === 0) {
    return <TopCampaignsEmpty className={className} />
  }

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Top Performing Campaigns</CardTitle>
        <CardDescription>Your best performing campaigns this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {campaigns.map((campaign) => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              showROI={showROI}
              showProgress={showProgress}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

TopCampaigns.displayName = "TopCampaigns"

// Export all component parts for reusability
export { TopCampaignsSkeleton, TopCampaignsError, TopCampaignsEmpty, CampaignCard }
export type { TopCampaignsProps, CampaignData }