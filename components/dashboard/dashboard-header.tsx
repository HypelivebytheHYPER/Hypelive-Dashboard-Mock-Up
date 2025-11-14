"use client"

import * as React from "react"
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownRight, ArrowUpRight, Download, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DashboardHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string
  showDatePicker?: boolean
  showDownloadButton?: boolean
  showTabs?: boolean
  className?: string
}

export interface MetricCardProps extends React.ComponentPropsWithoutRef<"div"> {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  className?: string
}

export interface DashboardMetricsData {
  totalRevenue: { value: string; change: string; trend: 'up' | 'down' }
  activeCampaigns: { value: string; change: string; trend: 'up' | 'down' }
  kolPartners: { value: string; change: string; trend: 'up' | 'down' }
  engagementRate: { value: string; change: string; trend: 'up' | 'down' }
}

const MetricCard: React.FC<MetricCardProps> = React.memo(({
  title,
  value,
  change,
  trend,
  icon: Icon,
  className,
  ...props
}) => {
  const trendColor = React.useMemo(() => {
    return trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  }, [trend])

  const TrendIcon = React.useMemo(() => {
    return trend === 'up' ? ArrowUpRight : ArrowDownRight
  }, [trend])

  return (
    <Card className={cn("relative overflow-hidden", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
          <TrendIcon className="h-3 w-3" />
          {change}
        </div>
      </CardContent>
    </Card>
  )
})

MetricCard.displayName = "MetricCard"

export const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(({
  title = "Dashboard Overview",
  showDatePicker = true,
  showDownloadButton = true,
  showTabs = true,
  className,
  ...props
}) => {
  // Mock data - replace with real data from props or context
  const metricsData: DashboardMetricsData = React.useMemo(() => ({
    totalRevenue: { value: "$45,231.89", change: "+20.1% from last month", trend: 'up' },
    activeCampaigns: { value: "+12", change: "+5 since last week", trend: 'up' },
    kolPartners: { value: "+128", change: "+12% this month", trend: 'up' },
    engagementRate: { value: "+5.2%", change: "-0.3% from last week", trend: 'down' }
  }), [])

  const metricCards = React.useMemo(() => [
    {
      title: "Total Revenue",
      value: metricsData.totalRevenue.value,
      change: metricsData.totalRevenue.change,
      trend: metricsData.totalRevenue.trend,
      icon: TrendingUp
    },
    {
      title: "Active Campaigns",
      value: metricsData.activeCampaigns.value,
      change: metricsData.activeCampaigns.change,
      trend: metricsData.activeCampaigns.trend,
      icon: TrendingUp
    },
    {
      title: "KOL Partners",
      value: metricsData.kolPartners.value,
      change: metricsData.kolPartners.change,
      trend: metricsData.kolPartners.trend,
      icon: TrendingUp
    },
    {
      title: "Engagement Rate",
      value: metricsData.engagementRate.value,
      change: metricsData.engagementRate.change,
      trend: metricsData.engagementRate.trend,
      icon: TrendingUp
    }
  ], [metricsData])

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <div className="flex items-center space-x-2">
          {showDatePicker && <CalendarDateRangePicker />}
          {showDownloadButton && (
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          )}
        </div>
      </div>
      
      {showTabs && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {metricCards.map((card, index) => (
                <MetricCard key={index} {...card} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
})

DashboardHeader.displayName = "DashboardHeader"

// Export all component parts for flexibility
export { MetricCard }
export type { DashboardHeaderProps, MetricCardProps, DashboardMetricsData }