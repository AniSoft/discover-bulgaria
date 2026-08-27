import { queryOptions } from "@tanstack/react-query";
import {
  getPublishedCategoryCounts,
  getPublishedPlaceBySlug,
  listPublishedPlaces,
} from "@/lib/places.functions";

export type PlacesFilters = { q?: string; category?: string };

export function placesQueryOptions(filters: PlacesFilters) {
  const q = filters.q?.trim() ?? "";
  const category = filters.category?.trim() ?? "";
  return queryOptions({
    queryKey: ["places", "published", { q, category }],
    queryFn: () => listPublishedPlaces({ data: { q, category } }),
    staleTime: 30_000,
  });
}

export function categoryCountsQueryOptions() {
  return queryOptions({
    queryKey: ["places", "category-counts"],
    queryFn: () => getPublishedCategoryCounts(),
    staleTime: 60_000,
  });
}

export function placeDetailQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ["places", "detail", slug],
    queryFn: () => getPublishedPlaceBySlug({ data: { slug } }),
    staleTime: 60_000,
  });
}
