import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  addFavorite,
  listFavoriteIds,
  listFavoritePlaces,
} from "@/lib/favorites.functions";
import { removeFavorite } from "@/lib/favorites.functions";
import { useAuth } from "@/lib/auth";

export const favoriteIdsKey = ["favorites", "ids"] as const;
export const favoritePlacesKey = ["favorites", "places"] as const;

export function favoriteIdsQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: favoriteIdsKey,
    queryFn: () => listFavoriteIds(),
    staleTime: 30_000,
    enabled,
  });
}

export function favoritePlacesQueryOptions() {
  return queryOptions({
    queryKey: favoritePlacesKey,
    queryFn: () => listFavoritePlaces(),
    staleTime: 15_000,
  });
}

/**
 * Single source of truth for heart state across every page: one shared
 * query of saved place IDs plus an optimistic toggle.
 */
export function useFavorites() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.href });

  const { data: ids } = useQuery(favoriteIdsQueryOptions(Boolean(user) && !loading));
  const idSet = new Set(ids ?? []);

  const mutation = useMutation({
    mutationFn: ({ placeId, next }: { placeId: string; next: boolean }) =>
      next ? addFavorite({ data: { placeId } }) : removeFavorite({ data: { placeId } }),
    onMutate: async ({ placeId, next }) => {
      await queryClient.cancelQueries({ queryKey: favoriteIdsKey });
      const previous = queryClient.getQueryData<string[]>(favoriteIdsKey);
      queryClient.setQueryData<string[]>(favoriteIdsKey, (current) => {
        const list = current ?? [];
        return next ? [...new Set([...list, placeId])] : list.filter((id) => id !== placeId);
      });
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(favoriteIdsKey, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: favoriteIdsKey });
      void queryClient.invalidateQueries({ queryKey: favoritePlacesKey });
    },
  });

  return {
    isSignedIn: Boolean(user),
    isFavorite: (placeId: string) => idSet.has(placeId),
    isPending: mutation.isPending,
    toggle: (placeId: string) => {
      if (!user) {
        void navigate({ to: "/login", search: { redirect: pathname } });
        return;
      }
      mutation.mutate({ placeId, next: !idSet.has(placeId) });
    },
  };
}
