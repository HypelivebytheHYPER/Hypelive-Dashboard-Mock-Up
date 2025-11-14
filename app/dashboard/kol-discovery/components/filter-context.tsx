"use client";

/**
 * Filter Context for KOL Discovery Page
 * Provides filter state to all child components
 */

import * as React from "react";
import { type FilterValues } from "@/app/dashboard/kol-discovery/components";

interface FilterContextValue {
  filters: FilterValues;
  setFilters: (filters: FilterValues) => void;
}

const FilterContext = React.createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = React.useState<FilterValues>({});

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = React.useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within FilterProvider");
  }
  return context;
}
