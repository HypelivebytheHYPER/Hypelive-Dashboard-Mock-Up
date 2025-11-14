import { Suspense } from 'react'
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { TopCampaigns } from "@/components/dashboard/top-campaigns"
import { PlatformPerformance } from "@/components/dashboard/platform-performance"

// Cache Components enabled in next.config.ts
// Note: ISR revalidate removed due to conflict with cacheComponents

// Loading skeleton components
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 bg-muted rounded-lg" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 h-80 bg-muted rounded-lg" />
        <div className="lg:col-span-3 h-80 bg-muted rounded-lg" />
      </div>
      <div className="h-96 bg-muted rounded-lg" />
    </div>
  )
}

function MetricsSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="h-[350px] bg-muted rounded-lg" />
      <div className="h-[300px] bg-muted rounded-lg" />
    </div>
  )
}

function PlatformSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="h-[300px] bg-muted rounded-lg" />
      <div className="h-[400px] bg-muted rounded-lg" />
    </div>
  )
}

function CampaignsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3 p-4 bg-muted rounded-lg">
          <div className="h-5 bg-muted-foreground/20 rounded w-32" />
          <div className="h-3 bg-muted-foreground/20 rounded w-full" />
          <div className="h-3 bg-muted-foreground/20 rounded w-24" />
        </div>
      ))}
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start space-x-4">
          <div className="h-10 w-10 bg-muted rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-3 bg-muted rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Main dashboard page with streaming SSR
export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      {/* Stream components progressively for better performance */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <Suspense fallback={<PlatformSkeleton />}>
            <PlatformPerformance />
          </Suspense>
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<CampaignsSkeleton />}>
            <TopCampaigns />
          </Suspense>
        </div>
      </div>
      
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}