import { Skeleton } from "@/components/ui/skeleton";

export default function KOLDiscoveryLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6">
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Large Card (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Card (1 col) */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
