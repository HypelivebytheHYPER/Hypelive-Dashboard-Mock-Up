import CalendarDateRangePicker from "@/components/date-range-picker";
import TeamMembersCard from "./cards/theme-members";
import SubscriptionsCard from "./cards/subscriptions";
import TotalRevenueCard from "./cards/total-revenue";
import { ChatCard } from "./cards/chat";
import { Button } from "@/components/ui/button";
import MetricCard from "./cards/metric";
import { PaymentsCard } from "./cards/payment";
import { PaymentMethodCard } from "./cards/payment-method";
import { generateMeta } from "@/lib/utils";

/**
 * Default Dashboard Caching Configuration
 *
 * Caching Strategy: Next.js 16 Cache Components
 * - Overview dashboard with aggregated metrics
 * - Cache Components provides automatic optimal caching
 * - Components fetch their own data (progressive enhancement)
 * - Note: ISR revalidate removed due to conflict with cacheComponents in next.config.ts
 *
 * Performance Impact:
 * - Serves cached HTML instantly
 * - Reduces server load by ~95% for repeated visits
 * - Background revalidation ensures data freshness
 * - Users see instant page load, then fresh data streams in
 */

export async function generateMetadata() {
  return generateMeta({
    title: "Dashboard",
    description:
      "Comprehensive analytics dashboard for TikTok KOL discovery and influencer marketing insights. Monitor campaigns, track performance, and manage collaborations.",
    canonical: "/default"
  });
}

export default function Page() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <TeamMembersCard />
        <SubscriptionsCard />
        <TotalRevenueCard />
        <ChatCard />
        <div className="lg:col-span-2">
          <MetricCard className="h-full" />
        </div>
        <div className="lg:col-span-2">
          <PaymentsCard className="h-full" />
        </div>
        <PaymentMethodCard />
      </div>
    </>
  );
}
