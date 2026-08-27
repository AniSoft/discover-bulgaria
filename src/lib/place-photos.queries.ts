import { queryOptions } from "@tanstack/react-query";
import { listPlacePhotos } from "@/lib/place-photos.functions";

export const placePhotosKey = (placeId: string) => ["places", "photos", placeId] as const;

export function placePhotosQueryOptions(placeId: string) {
  return queryOptions({
    queryKey: placePhotosKey(placeId),
    queryFn: () => listPlacePhotos({ data: { place_id: placeId } }),
    staleTime: 30_000,
  });
}
