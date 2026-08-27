import { queryOptions } from "@tanstack/react-query";
import { getPlaceForEdit } from "@/lib/place-edit.functions";

export function placeForEditQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["places", "edit", id],
    queryFn: () => getPlaceForEdit({ data: { id } }),
    staleTime: 0,
  });
}
