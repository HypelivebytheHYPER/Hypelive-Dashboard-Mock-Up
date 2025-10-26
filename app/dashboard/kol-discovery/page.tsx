/**
 * KOL Discovery Page - Server Component
 * Fetches data on the server for optimal performance
 */

import { Suspense } from "react";
import {
  TotalKOLsCard,
  TotalRevenueCard,
  AvgEngagementCard,
  ActiveCollabsCard,
  KOLsTableCard,
  KOLsByLocationCard,
  RecentCampaignsCard,
  CollaborationPipelineCard,
  AudienceDemographicsCard
} from "@/app/dashboard/kol-discovery/components";
import { KOLDiscoveryClient } from "@/app/dashboard/kol-discovery/components/kol-discovery-client";
import { getKOLStats } from "@/lib/api/kols-server";
import { Skeleton } from "@/components/ui/skeleton";

// Loading skeletons
function StatCardsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

// Async component that fetches stats
async function StatCards() {
  const stats = await getKOLStats();

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <TotalKOLsCard stats={stats} />
      <TotalRevenueCard stats={stats} />
      <AvgEngagementCard stats={stats} />
      <ActiveCollabsCard stats={stats} />
    </div>
  );
}

export default function KOLDiscoveryPage() {
  return (
    <div className="space-y-6">
      <KOLDiscoveryClient>
        {(filters) => (
          <>
            {/* Stat Cards with Suspense for streaming */}
            <Suspense fallback={<StatCardsSkeleton />}>
              <StatCards />
            </Suspense>

            {/* Audience Demographics - Full Width */}
            <AudienceDemographicsCard />

            {/* Charts & Visualizations with better layout */}
            <div className="grid gap-6 xl:grid-cols-3">
              <KOLsByLocationCard />
              <RecentCampaignsCard />
              <CollaborationPipelineCard />
            </div>

            {/* Main KOL Table with enhanced card */}
            <div className="rounded-lg border bg-card shadow-sm">
              <KOLsTableCard filters={filters} />
            </div>
          </>
        )}
      </KOLDiscoveryClient>
    </div>
  );
}
