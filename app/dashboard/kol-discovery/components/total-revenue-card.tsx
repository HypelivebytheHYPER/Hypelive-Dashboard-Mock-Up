/**
 * Total Revenue Card - Server Component
 * Fetches data on the server for better performance
 */

import { DollarSignIcon } from "lucide-react";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import type { KOLStats } from "@/lib/api/kols-server";

interface TotalRevenueCardProps {
  stats: KOLStats;
}

export function TotalRevenueCard({ stats }: TotalRevenueCardProps) {
  const totalRevenue = stats?.totalRevenue || 0;
  const growthPercent = stats?.revenueGrowth || 0;

  return (
    <Card>
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <div className="flex flex-col gap-2">
          <h4 className="font-display text-2xl lg:text-3xl font-mono">
            THB <AnimatedNumber value={Math.round(totalRevenue / 1000000)} />M
          </h4>
          <div className="text-muted-foreground text-sm">
            <span className={growthPercent >= 0 ? "text-green-600" : "text-red-600"}>
              {growthPercent >= 0 ? "+" : ""}
              {growthPercent}%
            </span>{" "}
            from last month
          </div>
        </div>
        <CardAction>
          <div className="flex gap-4">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full border">
              <DollarSignIcon className="size-5" />
            </div>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
