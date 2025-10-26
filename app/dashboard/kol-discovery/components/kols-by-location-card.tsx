/**
 * KOLs by Location Card - Server Component
 * Static component with no client-side interaction
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function KOLsByLocationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>KOLs by Location</CardTitle>
        <CardDescription>Distribution across Thailand</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[200px] items-center justify-center text-muted-foreground">
          Chart visualization coming soon
        </div>
      </CardContent>
    </Card>
  );
}
