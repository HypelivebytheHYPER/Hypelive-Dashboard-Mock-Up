/**
 * Average Engagement Card - Server Component
 * Fetches data on the server for better performance
 */

import { ZapIcon } from "lucide-react";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";
import { AnimatedPercentage } from "@/components/ui/animated-number";
import type { KOLStats } from "@/lib/api/kols-server";

interface AvgEngagementCardProps {
  stats: KOLStats;
}

export function AvgEngagementCard({ stats }: AvgEngagementCardProps) {
  const avgEngagement = stats?.avgEngagement || 0;

  return (
    <Card>
      <CardHeader>
        <CardDescription>Avg Engagement Rate</CardDescription>
        <div className="flex flex-col gap-2">
          <h4 className="font-display text-2xl lg:text-3xl font-mono">
            <AnimatedPercentage value={avgEngagement} />
          </h4>
          <div className="text-muted-foreground text-sm">
            <span className="text-blue-600">High engagement</span> across platform
          </div>
        </div>
        <CardAction>
          <div className="flex gap-4">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full border">
              <ZapIcon className="size-5" />
            </div>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
