import { queryOptions } from "@tanstack/react-query";
import {
  getAdminStats,
  listAdminPlaces,
  listRecentSubmissions,
} from "@/lib/admin-places.functions";

export const adminStatsKey = ["admin", "stats"] as const;
export const adminPlacesKey = ["admin", "places"] as const;
export const adminRecentKey = ["admin", "recent"] as const;

export function adminStatsQueryOptions() {
  return queryOptions({
    queryKey: adminStatsKey,
    queryFn: () => getAdminStats(),
    staleTime: 10_000,
  });
}

export function adminRecentSubmissionsQueryOptions() {
  return queryOptions({
    queryKey: adminRecentKey,
    queryFn: () => listRecentSubmissions(),
    staleTime: 10_000,
  });
}

export function adminPlacesQueryOptions() {
  return queryOptions({
    queryKey: adminPlacesKey,
    queryFn: () => listAdminPlaces(),
    staleTime: 10_000,
  });
}
