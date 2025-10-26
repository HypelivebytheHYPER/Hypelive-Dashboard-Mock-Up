/**
 * Total KOLs Card - Server Component
 * Fetches data on the server for better performance
 */

import { UsersIcon } from "lucide-react";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import type { KOLStats } from "@/lib/api/kols-server";

interface TotalKOLsCardProps {
  stats: KOLStats;
}

export function TotalKOLsCard({ stats }: TotalKOLsCardProps) {
  const totalKOLs = stats?.totalKOLs || 0;
  const growthPercent = stats?.growthPercent || 0;

  return (
    <Card>
      <CardHeader>
        <CardDescription>Total KOLs</CardDescription>
        <div className="flex flex-col gap-2">
          <h4 className="font-display text-2xl lg:text-3xl">
            <AnimatedNumber value={totalKOLs} />
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
              <UsersIcon className="size-5" />
            </div>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
