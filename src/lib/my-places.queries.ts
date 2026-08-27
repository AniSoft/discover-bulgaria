import { queryOptions } from "@tanstack/react-query";
import {
  getOwnedPlaceById,
  getOwnedPlaceBySlug,
  listMyPlaces,
} from "@/lib/my-places.functions";

export const myPlacesKey = ["places", "mine"] as const;

export function myPlacesQueryOptions() {
  return queryOptions({
    queryKey: myPlacesKey,
    queryFn: () => listMyPlaces(),
    staleTime: 15_000,
  });
}

export function ownedPlaceBySlugQueryOptions(slug: string, enabled: boolean) {
  return queryOptions({
    queryKey: ["places", "mine", "slug", slug],
    queryFn: () => getOwnedPlaceBySlug({ data: { slug } }),
    staleTime: 15_000,
    enabled,
  });
}

export function ownedPlaceByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["places", "mine", "id", id],
    queryFn: () => getOwnedPlaceById({ data: { id } }),
    staleTime: 15_000,
  });
}
