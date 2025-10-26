/**
 * Collaboration Pipeline Card - Server Component
 * Static component with no client-side interaction
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CollaborationPipelineCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaboration Pipeline</CardTitle>
        <CardDescription>Contacted → Sample → Sales → GMV</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[200px] items-center justify-center text-muted-foreground">
          Funnel visualization coming soon
        </div>
      </CardContent>
    </Card>
  );
}
