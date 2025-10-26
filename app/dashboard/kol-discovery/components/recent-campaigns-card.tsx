/**
 * Recent Campaigns Card - Server Component
 * Static component with no client-side interaction
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentCampaignsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Campaigns</CardTitle>
        <CardDescription>Latest collaboration activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[200px] items-center justify-center text-muted-foreground">
          Campaign timeline coming soon
        </div>
      </CardContent>
    </Card>
  );
}
