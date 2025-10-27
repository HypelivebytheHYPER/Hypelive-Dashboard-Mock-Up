"use client";

/**
 * Client-side interactive components for KOL Discovery Page
 * This component handles all client-side interactions (buttons, dialogs, filters)
 * while the parent page remains a Server Component
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import CustomDateRangePicker from "@/components/custom-date-range-picker";
import { SparklesIcon, DownloadIcon } from "lucide-react";
import {
  AdvancedFilters,
  type FilterValues,
  SmartSearchDialog,
  ExportDialog
} from "@/app/dashboard/kol-discovery/components";
import { useKOLs } from "@/lib/hooks/use-kols";

interface KOLDiscoveryClientProps {
  children: (filters: FilterValues) => React.ReactNode;
}

export function KOLDiscoveryClient({ children }: KOLDiscoveryClientProps) {
  const [filters, setFilters] = React.useState<FilterValues>({});
  const [showSmartSearch, setShowSmartSearch] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  // Fetch KOLs data for export only when dialog is open
  const { data: kolsData } = useKOLs({
    page_size: 1000
  });

  // Memoize the rendered children to avoid re-rendering
  const renderedChildren = React.useMemo(() => children(filters), [children, filters]);

  return (
    <>
      {/* Header with gradient background */}
      <div className="flex flex-col gap-4 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              KOL Discovery Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and discover TikTok influencers with data-driven insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CustomDateRangePicker />
            <Button
              onClick={() => setShowSmartSearch(true)}
              className="gap-2 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <SparklesIcon className="size-4" />
              AI Search
            </Button>
            <Button
              onClick={() => setShowExportDialog(true)}
              variant="outline"
              className="gap-2 shadow-lg">
              <DownloadIcon className="size-4" />
              Export KOLs
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Search and Filters */}
      <AdvancedFilters onFilterChange={setFilters} activeFilters={filters} />

      {/* Render children with filters */}
      {renderedChildren}

      {/* Smart Search Dialog */}
      <SmartSearchDialog
        open={showSmartSearch}
        onOpenChange={setShowSmartSearch}
        onSelectKOLs={(kols) => {
          setShowSmartSearch(false);
        }}
      />

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        kols={kolsData?.items || []}
        totalCount={kolsData?.total || 0}
      />
    </>
  );
}
