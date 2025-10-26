/**
 * Active Collaborations Card - Server Component
 * Fetches data on the server for better performance
 */

import { TrendingUpIcon } from "lucide-react";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import type { KOLStats } from "@/lib/api/kols-server";

interface ActiveCollabsCardProps {
  stats: KOLStats;
}

export function ActiveCollabsCard({ stats }: ActiveCollabsCardProps) {
  const activeCount = stats?.activeCollabs || 0;

  return (
    <Card>
      <CardHeader>
        <CardDescription>Active Collaborations</CardDescription>
        <div className="flex flex-col gap-2">
          <h4 className="font-display text-2xl lg:text-3xl">
            <AnimatedNumber value={activeCount} />
          </h4>
          <div className="text-muted-foreground text-sm">
            <span className="text-green-600">Ongoing campaigns</span> this month
          </div>
        </div>
        <CardAction>
          <div className="flex gap-4">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full border">
              <TrendingUpIcon className="size-5" />
            </div>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
