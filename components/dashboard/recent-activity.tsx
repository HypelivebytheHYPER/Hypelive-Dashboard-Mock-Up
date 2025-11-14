"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { analyticsService } from "@/lib/api/services/analytics-service"
import { logger } from "@/lib/core/observability/logger"
import { cn } from "@/lib/utils"
import { AlertCircle, Clock, User } from "lucide-react"

export interface RecentActivityProps extends React.ComponentPropsWithoutRef<"div"> {
  maxItems?: number
  autoRefresh?: boolean
  refreshInterval?: number
  showUserAvatars?: boolean
  className?: string
}

export interface ActivityItem {
  id: string
  type: 'campaign_launch' | 'kol_onboarded' | 'content_published' | 'campaign_completed' | 'contract_signed' | 'payment_processed'
  description: string
  timestamp: string
  user: string
  userAvatar?: string
  campaign_id?: string
  metadata?: Record<string, any>
}

export interface ActivityTypeConfig {
  icon: string
  color: string
  label: string
}

// Activity type configurations
const ACTIVITY_TYPE_CONFIGS: Record<ActivityItem['type'], ActivityTypeConfig> = {
  campaign_launch: {
    icon: '🚀',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    label: 'Campaign Launch'
  },
  kol_onboarded: {
    icon: '👥',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    label: 'KOL Onboarded'
  },
  content_published: {
    icon: '📝',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    label: 'Content Published'
  },
  campaign_completed: {
    icon: '✅',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    label: 'Campaign Completed'
  },
  contract_signed: {
    icon: '📋',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    label: 'Contract Signed'
  },
  payment_processed: {
    icon: '💳',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    label: 'Payment Processed'
  }
}

// Loading skeleton component
export const RecentActivitySkeleton: React.FC<{ className?: string }> = React.memo(({ className }) => (
  <Card className={cn("animate-pulse", className)}>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
      <CardDescription>Loading recent activities...</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="h-10 w-10 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
))

RecentActivitySkeleton.displayName = "RecentActivitySkeleton"

// Error state component
export const RecentActivityError: React.FC<{ 
  error: Error
  onRetry?: () => void
  className?: string 
}> = React.memo(({ error, onRetry, className }) => (
  <Card className={cn("border-destructive", className)}>
    <CardHeader>
      <CardTitle className="text-destructive">Failed to Load Activities</CardTitle>
      <CardDescription>Unable to load recent activities</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred while loading the activities."}
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

RecentActivityError.displayName = "RecentActivityError"

// Empty state component
export const RecentActivityEmpty: React.FC<{ className?: string }> = React.memo(({ className }) => (
  <Card className={cn("border-dashed", className)}>
    <CardHeader>
      <CardTitle>No Recent Activity</CardTitle>
      <CardDescription>No recent activities to display</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Clock className="h-8 w-8 text-muted-foreground" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            There are no recent activities to display at the moment.
          </p>
          <p className="text-xs text-muted-foreground">
            Activities will appear here as they occur in your campaigns.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
))

RecentActivityEmpty.displayName = "RecentActivityEmpty"

// Activity item component
export const ActivityItem: React.FC<{ 
  activity: ActivityItem
  showUserAvatar?: boolean
  className?: string 
}> = React.memo(({
  activity,
  showUserAvatar = true,
  className
}) => {
  const config = React.useMemo(() => ACTIVITY_TYPE_CONFIGS[activity.type], [activity.type])
  
  const formatTimestamp = React.useCallback((timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }, [])

  const userInitials = React.useMemo(() => {
    if (!showUserAvatar || !activity.user) return 'U'
    return activity.user.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }, [activity.user, showUserAvatar])

  return (
    <div className={cn("flex items-start space-x-4 py-3 hover:bg-muted/50 rounded-lg transition-colors", className)}>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-lg", config.color)}>
        {config.icon}
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <p className="text-sm font-medium leading-tight break-words">
          {activity.description}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {formatTimestamp(activity.timestamp)}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {config.label}
          </Badge>
          {activity.campaign_id && (
            <Badge variant="outline" className="text-xs">
              Campaign {activity.campaign_id}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {showUserAvatar && (
            <div className="flex items-center gap-1">
              <Avatar className="h-4 w-4">
                <AvatarImage src={activity.userAvatar} />
                <AvatarFallback>
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span>by {activity.user}</span>
            </div>
          )}
          {!showUserAvatar && (
            <span>by {activity.user}</span>
          )}
        </div>
      </div>
    </div>
  )
})

ActivityItem.displayName = "ActivityItem"

// Main component with full optimization
export const RecentActivity: React.FC<RecentActivityProps> = React.memo(({
  maxItems = 10,
  autoRefresh = false,
  refreshInterval = 60000, // 1 minute
  showUserAvatars = true,
  className,
  ...props
}) => {
  const [activities, setActivities] = React.useState<ActivityItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  // Memoized data fetching function
  const fetchActivities = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      logger.info('Fetching recent activities', { maxItems, showUserAvatars })
      
      // Mock data for development - replace with real API calls
      const mockActivities: ActivityItem[] = [
        {
          id: 'ACT001',
          type: 'campaign_launch',
          description: 'New campaign "Summer Beauty" launched successfully',
          timestamp: '2024-01-15T10:30:00Z',
          user: 'USER001',
          campaign_id: 'CMP001'
        },
        {
          id: 'ACT002',
          type: 'kol_onboarded',
          description: '5 new KOLs onboarded for tech campaign',
          timestamp: '2024-01-14T14:20:00Z',
          user: 'USER002',
          campaign_id: 'CMP002'
        },
        {
          id: 'ACT003',
          type: 'content_published',
          description: 'Summer skincare routine video published on Instagram',
          timestamp: '2024-01-13T09:15:00Z',
          user: 'KOL001',
          campaign_id: 'CMP001'
        },
        {
          id: 'ACT004',
          type: 'campaign_completed',
          description: 'Tech product launch campaign completed successfully',
          timestamp: '2024-01-12T16:45:00Z',
          user: 'USER003',
          campaign_id: 'CMP002'
        },
        {
          id: 'ACT005',
          type: 'contract_signed',
          description: 'Contract signed with beauty influencer for Q2 campaign',
          timestamp: '2024-01-11T11:30:00Z',
          user: 'USER004'
        }
      ]
      
      setActivities(mockActivities.slice(0, maxItems))
      
      logger.info('Recent activities loaded successfully', { count: mockActivities.length })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load recent activities')
      setError(error)
      logger.error('Failed to load recent activities', { error: err })
    } finally {
      setLoading(false)
    }
  }, [maxItems, showUserAvatars])

  // Auto-refresh logic
  React.useEffect(() => {
    if (!autoRefresh) return
    
    logger.debug('Setting up auto-refresh for recent activities', { refreshInterval })
    
    const interval = setInterval(() => {
      logger.debug('Auto-refreshing recent activities')
      fetchActivities()
    }, refreshInterval)
    
    return () => {
      logger.debug('Cleaning up auto-refresh interval for recent activities')
      clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, fetchActivities])

  // Initial data load
  React.useEffect(() => {
    logger.debug('Initial recent activities load')
    fetchActivities()
  }, [fetchActivities])

  // Error state
  if (error) {
    return <RecentActivityError error={error} onRetry={fetchActivities} className={className} />
  }

  // Loading state
  if (loading) {
    return <RecentActivitySkeleton className={className} />
  }

  // Empty state
  if (activities.length === 0) {
    return <RecentActivityEmpty className={className} />
  }

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-1">
            {activities.map((activity) => (
              <ActivityItem 
                key={activity.id} 
                activity={activity} 
                showUserAvatar={showUserAvatars}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
})

RecentActivity.displayName = "RecentActivity"

// Export all component parts for reusability
export { RecentActivitySkeleton, RecentActivityError, RecentActivityEmpty, ActivityItem }
export type { RecentActivityProps, ActivityTypeConfig }