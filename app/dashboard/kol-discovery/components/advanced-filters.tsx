"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { FilterIcon, XIcon, SaveIcon, SearchIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export type FilterValues = {
  search?: string;
  level?: string[];
  followerRange?: [number, number];
  engagementRange?: [number, number];
  revenueRange?: [number, number];
  location?: string[];
  specialization?: string[];
  collaborationStage?: string[];
  qualityScoreMin?: number;
};

type SavedFilter = {
  id: string;
  name: string;
  filters: FilterValues;
  count?: number;
};

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  activeFilters: FilterValues;
}

export function AdvancedFilters({ onFilterChange, activeFilters }: AdvancedFiltersProps) {
  const [filters, setFilters] = React.useState<FilterValues>(activeFilters);
  const [savedFilters, setSavedFilters] = React.useState<SavedFilter[]>([
    {
      id: "1",
      name: "High Performers",
      filters: { engagementRange: [5, 100], qualityScoreMin: 8 },
      count: 234
    },
    {
      id: "2",
      name: "Mega KOLs",
      filters: { level: ["Mega"], followerRange: [1000000, 100000000] },
      count: 89
    },
    {
      id: "3",
      name: "Active Collabs",
      filters: { collaborationStage: ["Contacted", "Sample"] },
      count: 156
    }
  ]);

  const updateFilter = <K extends keyof FilterValues>(key: K, value: FilterValues[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const applySavedFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters);
    onFilterChange(savedFilter.filters);
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof FilterValues];
    return value !== undefined && value !== "" && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  return (
    <div className="space-y-4">
      {/* Search Bar with Filters Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, handle, or TikTok URL..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FilterIcon className="size-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 rounded-full px-1.5 py-0.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[600px] p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Advanced Filters</h4>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <XIcon className="mr-1 size-3" />
                    Clear All
                  </Button>
                )}
              </div>

              <Separator />

              {/* Saved Filters */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Quick Filters</Label>
                <div className="flex flex-wrap gap-2">
                  {savedFilters.map((savedFilter) => (
                    <Button
                      key={savedFilter.id}
                      variant="outline"
                      size="sm"
                      onClick={() => applySavedFilter(savedFilter)}
                      className="gap-2">
                      {savedFilter.name}
                      {savedFilter.count && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {savedFilter.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                {/* KOL Level */}
                <div className="space-y-2">
                  <Label>KOL Level</Label>
                  <Select
                    value={filters.level?.[0] || ""}
                    onValueChange={(value) => updateFilter("level", value ? [value] : [])}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All levels</SelectItem>
                      <SelectItem value="Mega">Mega KOL (1M+ followers)</SelectItem>
                      <SelectItem value="Macro">Macro KOL (100K-1M)</SelectItem>
                      <SelectItem value="Micro">Micro KOL (10K-100K)</SelectItem>
                      <SelectItem value="Nano">Nano KOL (&lt;10K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Collaboration Stage */}
                <div className="space-y-2">
                  <Label>Collaboration Stage</Label>
                  <Select
                    value={filters.collaborationStage?.[0] || ""}
                    onValueChange={(value) =>
                      updateFilter("collaborationStage", value ? [value] : [])
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="All stages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All stages</SelectItem>
                      <SelectItem value="Not Contacted">Not Contacted</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Sample">Sample Sent</SelectItem>
                      <SelectItem value="Negotiation">In Negotiation</SelectItem>
                      <SelectItem value="Contract">Contract Signed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Follower Range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Follower Range</Label>
                  <span className="text-xs text-muted-foreground">
                    {(filters.followerRange?.[0] || 0).toLocaleString()} -{" "}
                    {(filters.followerRange?.[1] || 10000000).toLocaleString()}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={10000000}
                  step={10000}
                  value={filters.followerRange || [0, 10000000]}
                  onValueChange={(value) => updateFilter("followerRange", value as [number, number])}
                  className="w-full"
                />
              </div>

              {/* Engagement Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Engagement Rate (%)</Label>
                  <span className="text-xs text-muted-foreground">
                    {filters.engagementRange?.[0] || 0}% - {filters.engagementRange?.[1] || 100}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={0.1}
                  value={filters.engagementRange || [0, 100]}
                  onValueChange={(value) =>
                    updateFilter("engagementRange", value as [number, number])
                  }
                  className="w-full"
                />
              </div>

              {/* Quality Score */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Minimum Quality Score</Label>
                  <span className="text-xs text-muted-foreground">
                    {filters.qualityScoreMin || 0} / 10
                  </span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={0.1}
                  value={[filters.qualityScoreMin || 0]}
                  onValueChange={(value) => updateFilter("qualityScoreMin", value[0])}
                  className="w-full"
                />
              </div>

              {/* Revenue Range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Revenue Range (THB)</Label>
                  <span className="text-xs text-muted-foreground">
                    THB {(filters.revenueRange?.[0] || 0).toLocaleString()} - THB{" "}
                    {(filters.revenueRange?.[1] || 10000000).toLocaleString()}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={10000000}
                  step={10000}
                  value={filters.revenueRange || [0, 10000000]}
                  onValueChange={(value) => updateFilter("revenueRange", value as [number, number])}
                  className="w-full"
                />
              </div>

              <Separator />

              <div className="flex justify-between">
                <Button variant="outline" size="sm" className="gap-2">
                  <SaveIcon className="size-3" />
                  Save Filter
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Reset
                  </Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.level && filters.level.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Level: {filters.level.join(", ")}
              <XIcon
                className="size-3 cursor-pointer"
                onClick={() => updateFilter("level", [])}
              />
            </Badge>
          )}
          {filters.collaborationStage && filters.collaborationStage.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Stage: {filters.collaborationStage.join(", ")}
              <XIcon
                className="size-3 cursor-pointer"
                onClick={() => updateFilter("collaborationStage", [])}
              />
            </Badge>
          )}
          {filters.qualityScoreMin && filters.qualityScoreMin > 0 && (
            <Badge variant="secondary" className="gap-1">
              Quality Score ≥ {filters.qualityScoreMin}
              <XIcon
                className="size-3 cursor-pointer"
                onClick={() => updateFilter("qualityScoreMin", 0)}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
