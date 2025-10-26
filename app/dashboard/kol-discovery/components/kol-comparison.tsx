"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { XIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react";
import { type KOL } from "@/lib/utils/kol-transform";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/utils/kol-transform";

interface KOLComparisonProps {
  kols: KOL[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (kolId: string) => void;
}

export function KOLComparison({ kols, open, onOpenChange, onRemove }: KOLComparisonProps) {
  const comparisonMetrics = [
    { label: "Followers", key: "follower" as const, format: formatNumber },
    { label: "Engagement Rate", key: "engagementRate" as const, format: formatPercent },
    { label: "Quality Score", key: "qualityScore" as const, format: (v: number) => v.toFixed(1) },
    { label: "Revenue", key: "revenue" as const, format: formatCurrency },
    { label: "Avg Views", key: "avgViews" as const, format: formatNumber },
    { label: "Avg Likes", key: "avgLikes" as const, format: formatNumber }
  ];

  const getComparisonIndicator = (kol: KOL, key: keyof KOL, allKols: KOL[]) => {
    const value = kol[key] as number;
    const values = allKols.map((k) => k[key] as number);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    if (value > avg * 1.1) {
      return <TrendingUpIcon className="size-4 text-green-600" />;
    } else if (value < avg * 0.9) {
      return <TrendingDownIcon className="size-4 text-red-600" />;
    }
    return <MinusIcon className="size-4 text-muted-foreground" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare KOLs ({kols.length})</DialogTitle>
          <DialogDescription>
            Side-by-side comparison of selected influencers and their performance metrics
          </DialogDescription>
        </DialogHeader>

        {kols.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Select KOLs from the table to compare them here
          </div>
        ) : (
          <div className="space-y-6">
            {/* KOL Headers */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${kols.length}, 1fr)` }}>
              <div></div>
              {kols.map((kol) => (
                <div key={kol.kolId} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <Avatar className="size-12">
                      <AvatarImage src={kol.profileImageUrl || undefined} alt={kol.nickname} />
                      <AvatarFallback>
                        {kol.nickname
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-6 p-0"
                      onClick={() => onRemove(kol.kolId)}>
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                  <div>
                    <div className="font-medium truncate">{kol.nickname}</div>
                    <div className="text-xs text-muted-foreground">@{kol.handle}</div>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {kol.level}
                  </Badge>
                </div>
              ))}
            </div>

            <Separator />

            {/* Metrics Comparison */}
            <div className="space-y-4">
              <h3 className="font-semibold">Performance Metrics</h3>
              <div className="space-y-3">
                {comparisonMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="grid gap-4"
                    style={{ gridTemplateColumns: `200px repeat(${kols.length}, 1fr)` }}>
                    <div className="flex items-center text-sm font-medium">{metric.label}</div>
                    {kols.map((kol) => (
                      <div
                        key={kol.kolId}
                        className="flex items-center justify-between rounded-lg border p-3">
                        <span className="font-mono text-sm">
                          {metric.format(kol[metric.key] as number)}
                        </span>
                        {getComparisonIndicator(kol, metric.key, kols)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Location & Specialization */}
            <div className="space-y-4">
              <h3 className="font-semibold">Demographics & Specialization</h3>

              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `200px repeat(${kols.length}, 1fr)` }}>
                <div className="flex items-center text-sm font-medium">Location</div>
                {kols.map((kol) => (
                  <div key={kol.kolId} className="rounded-lg border p-3">
                    <div className="flex flex-wrap gap-1">
                      {kol.location && kol.location.length > 0 ? (
                        kol.location.map((loc) => (
                          <Badge key={loc} variant="secondary" className="text-xs">
                            {loc}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `200px repeat(${kols.length}, 1fr)` }}>
                <div className="flex items-center text-sm font-medium">Specialization</div>
                {kols.map((kol) => (
                  <div key={kol.kolId} className="rounded-lg border p-3">
                    <div className="flex flex-wrap gap-1">
                      {kol.specialization && kol.specialization.length > 0 ? (
                        kol.specialization.map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `200px repeat(${kols.length}, 1fr)` }}>
                <div className="flex items-center text-sm font-medium">Collaboration Stage</div>
                {kols.map((kol) => (
                  <div key={kol.kolId} className="rounded-lg border p-3">
                    <Badge variant="secondary" className="w-fit text-xs">
                      {kol.collaborationStage || "Not Contacted"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline">Export Comparison</Button>
              <Button>Add to Campaign</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
