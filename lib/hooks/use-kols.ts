import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchKOLs, searchKOLs, type SearchOptions, type LarkbaseResponse } from "@/lib/api/larkbase";
import { transformKOL, type KOL } from "@/lib/utils/kol-transform";

// Query keys for cache management
export const kolQueryKeys = {
  all: ["kols"] as const,
  lists: () => [...kolQueryKeys.all, "list"] as const,
  list: (filters: SearchOptions) => [...kolQueryKeys.lists(), filters] as const,
  details: () => [...kolQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...kolQueryKeys.details(), id] as const,
  stats: () => [...kolQueryKeys.all, "stats"] as const
};

/**
 * Hook to fetch all KOLs with pagination and search
 */
export function useKOLs(options?: SearchOptions) {
  return useQuery({
    queryKey: kolQueryKeys.list(options || {}),
    queryFn: async () => {
      const response = options?.filter || options?.sort
        ? await searchKOLs(options)
        : await fetchKOLs(options);

      if (response.code === 0 && response.data) {
        return {
          ...response.data,
          items: response.data.items.map(transformKOL)
        };
      }

      throw new Error(response.msg || "Failed to fetch KOLs");
    },
    // Enable background refetching
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    // Placeholder data while loading
    placeholderData: (previousData) => previousData
  });
}

/**
 * Hook to get KOL statistics (total count, revenue, etc.)
 */
export function useKOLStats() {
  return useQuery({
    queryKey: kolQueryKeys.stats(),
    queryFn: async () => {
      // Fetch minimal data to get total count
      const response = await fetchKOLs({ page_size: 1 });

      if (response.code === 0 && response.data) {
        // Calculate stats from the total
        const totalKOLs = response.data.total;

        // Fetch a small sample to calculate averages
        const sampleResponse = await fetchKOLs({ page_size: 100 });
        const kols = sampleResponse.data?.items.map(transformKOL) || [];

        const totalRevenue = kols.reduce((sum, kol) => sum + kol.revenue, 0);
        const avgEngagement =
          kols.reduce((sum, kol) => sum + kol.engagementRate, 0) / kols.length;
        const activeCollabs = kols.filter(
          (kol) => kol.collaborationStage === "Contacted" || kol.collaborationStage === "Sample"
        ).length;

        return {
          totalKOLs,
          totalRevenue,
          avgEngagement,
          activeCollabs,
          // Calculate growth (placeholder - would need historical data)
          growthPercent: 10.4
        };
      }

      throw new Error(response.msg || "Failed to fetch KOL stats");
    },
    // Stats don't change as frequently, cache for longer
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 10 * 60 * 1000 // Refetch every 10 minutes
  });
}

/**
 * Hook for infinite scroll / pagination
 */
export function useInfiniteKOLs(options?: Omit<SearchOptions, "page_token">) {
  return useQuery({
    queryKey: [...kolQueryKeys.lists(), "infinite", options],
    queryFn: async ({ pageParam = undefined }) => {
      const response = await fetchKOLs({
        ...options,
        page_token: pageParam as string | undefined
      });

      if (response.code === 0 && response.data) {
        return {
          items: response.data.items.map(transformKOL),
          nextCursor: response.data.has_more ? response.data.page_token : undefined
        };
      }

      throw new Error(response.msg || "Failed to fetch KOLs");
    }
  });
}
