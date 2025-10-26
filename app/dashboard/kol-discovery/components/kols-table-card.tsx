"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ChevronDownIcon, ChevronsUpDown, Ellipsis, ExternalLinkIcon, GitCompareIcon } from "lucide-react";
import { useKOLs } from "@/lib/hooks/use-kols";
import { formatNumber, formatCurrency, formatPercent, getLevelColor, getStageColor, type KOL } from "@/lib/utils/kol-transform";
import { KOLComparison } from "./kol-comparison";
import { type FilterValues } from "./advanced-filters";

export const kolColumns: ColumnDef<KOL>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: "profile",
    header: "Profile",
    cell: ({ row }) => {
      const kol = row.original;
      const initials = kol.nickname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return (
        <Avatar className="size-10">
          <AvatarImage src={kol.profileImageUrl || undefined} alt={kol.nickname} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    }
  },
  {
    accessorKey: "kolId",
    header: "KOL ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("kolId")}</div>
  },
  {
    accessorKey: "nickname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          KOL Name
          <ChevronsUpDown className="ml-2 size-3!" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const kol = row.original;
      return (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{kol.nickname}</div>
          <div className="text-xs text-muted-foreground">@{kol.handle}</div>
        </div>
      );
    }
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => {
      const level = row.getValue("level") as string;
      return (
        <Badge variant="outline" className={getLevelColor(level)}>
          {level}
        </Badge>
      );
    }
  },
  {
    accessorKey: "follower",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Followers
          <ChevronsUpDown className="ml-2 size-3!" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const followers = row.getValue("follower") as number;
      return <div className="font-mono text-right">{formatNumber(followers)}</div>;
    }
  },
  {
    accessorKey: "engagementRate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Engagement
          <ChevronsUpDown className="ml-2 size-3!" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rate = row.getValue("engagementRate") as number;
      return <div className="font-mono text-right">{formatPercent(rate, 1)}</div>;
    }
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Revenue
          <ChevronsUpDown className="ml-2 size-3!" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const revenue = row.getValue("revenue") as number;
      return <div className="font-mono text-right">{formatCurrency(revenue)}</div>;
    }
  },
  {
    accessorKey: "qualityScore",
    header: "Quality",
    cell: ({ row }) => {
      const score = row.getValue("qualityScore") as number;
      return (
        <div className="flex items-center gap-1">
          <span className="font-mono">{score.toFixed(1)}</span>
          <span className="text-yellow-500">★</span>
        </div>
      );
    }
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const locations = row.getValue("location") as string[];
      if (!locations || locations.length === 0) return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex flex-wrap gap-1 max-w-[120px]">
          {locations.slice(0, 2).map((loc) => (
            <Badge key={loc} variant="secondary" className="text-xs">
              {loc}
            </Badge>
          ))}
          {locations.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{locations.length - 2}
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) => {
      const specs = row.getValue("specialization") as string[];
      if (!specs || specs.length === 0) return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {specs.slice(0, 2).map((spec) => (
            <Badge key={spec} variant="outline" className="text-xs">
              {spec}
            </Badge>
          ))}
          {specs.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{specs.length - 2}
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "collaborationStage",
    header: "Stage",
    cell: ({ row }) => {
      const stage = row.getValue("collaborationStage") as string;
      if (!stage) return <span className="text-muted-foreground">-</span>;

      return (
        <Badge variant="secondary" className={getStageColor(stage)}>
          {stage}
        </Badge>
      );
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const kol = row.original;

      return (
        <div className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <span className="sr-only">Open menu</span>
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(kol.kolId)}>
                Copy KOL ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>View Campaigns</DropdownMenuItem>
              <DropdownMenuItem>View Rates</DropdownMenuItem>
              <DropdownMenuSeparator />
              {kol.tiktokUrl && (
                <DropdownMenuItem asChild>
                  <a href={kol.tiktokUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    Open TikTok
                    <ExternalLinkIcon className="ml-2 size-3" />
                  </a>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];

interface KOLsTableCardProps {
  filters?: FilterValues;
}

export function KOLsTableCard({ filters }: KOLsTableCardProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showComparison, setShowComparison] = React.useState(false);

  const { data: kolsData, isLoading, isError, error } = useKOLs({ page_size: 50 });

  if (isError) {
    console.error("[KOLs Table] Error:", error);
  }

  let data = kolsData?.items || [];

  // Apply filters
  if (filters) {
    data = data.filter((kol) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !kol.nickname.toLowerCase().includes(searchLower) &&
          !kol.handle.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Level filter
      if (filters.level && filters.level.length > 0) {
        if (!filters.level.includes(kol.level)) return false;
      }

      // Follower range filter
      if (filters.followerRange) {
        const [min, max] = filters.followerRange;
        if (kol.follower < min || kol.follower > max) return false;
      }

      // Engagement range filter
      if (filters.engagementRange) {
        const [min, max] = filters.engagementRange;
        if (kol.engagementRate < min || kol.engagementRate > max) return false;
      }

      // Revenue range filter
      if (filters.revenueRange) {
        const [min, max] = filters.revenueRange;
        if (kol.revenue < min || kol.revenue > max) return false;
      }

      // Quality score filter
      if (filters.qualityScoreMin && kol.qualityScore < filters.qualityScoreMin) {
        return false;
      }

      // Collaboration stage filter
      if (filters.collaborationStage && filters.collaborationStage.length > 0) {
        if (!filters.collaborationStage.includes(kol.collaborationStage || "")) return false;
      }

      return true;
    });
  }

  const table = useReactTable({
    data,
    columns: kolColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  const selectedKOLs = table.getFilteredSelectedRowModel().rows.map((row) => row.original);

  return (
    <>
      <Card className="col-span-2 border-0 shadow-none">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-xl">KOL Database</CardTitle>
          <div className="flex items-center gap-3">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowComparison(true)}
                className="gap-2">
                <GitCompareIcon className="size-4" />
                Compare ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            )}
            <div className="text-sm text-muted-foreground font-medium">
              {data.length} total KOLs
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="Search by name or handle..."
              value={(table.getColumn("nickname")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("nickname")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="[&:has([role=checkbox])]:pl-3">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={kolColumns.length} className="h-24 text-center">
                    Loading KOLs...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="[&:has([role=checkbox])]:pl-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={kolColumns.length} className="h-24 text-center">
                    No KOLs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 pt-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <KOLComparison
      kols={selectedKOLs}
      open={showComparison}
      onOpenChange={setShowComparison}
      onRemove={(kolId) => {
        const row = table.getRowModel().rows.find((r) => r.original.kolId === kolId);
        if (row) {
          row.toggleSelected(false);
        }
      }}
    />
    </>
  );
}
