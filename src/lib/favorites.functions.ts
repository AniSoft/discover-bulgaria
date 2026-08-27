import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { PublicPlace } from "@/lib/places.functions";

export type FavoritePlace = PublicPlace & { favorited_at: string };

const PLACE_COLUMNS =
  "id, slug, title, region, city, category, short_description, approximate_cost, duration, status";

/** IDs of the places the signed-in user saved. RLS scopes the rows to them. */
export const listFavoriteIds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<string[]> => {
    const { data, error } = await context.supabase
      .from("favorites")
      .select("place_id")
      .eq("user_id", context.userId)
      .limit(1000);

    if (error) {
      console.error("[favorites] listFavoriteIds failed", error);
      throw new Error("FAVORITES_LOAD_FAILED");
    }
    return (data ?? []).map((row) => row.place_id);
  });

/** Saved places, newest first, published only. */
export const listFavoritePlaces = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<FavoritePlace[]> => {
    const { data, error } = await context.supabase
      .from("favorites")
      .select(`created_at, places (${PLACE_COLUMNS})`)
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[favorites] listFavoritePlaces failed", error);
      throw new Error("FAVORITES_LOAD_FAILED");
    }

    type Row = { created_at: string; places: (Omit<PublicPlace, "cover_url"> & { status: string }) | null };
    const rows = (data ?? []) as unknown as Row[];
    const places = rows
      .filter((row) => row.places && row.places.status === "published")
      .map((row) => ({ ...row.places!, favorited_at: row.created_at }));

    const { loadCoverUrls } = await import("@/lib/place-photos.server");
    const covers = await loadCoverUrls(context.supabase, places.map((p) => p.id));
    return places.map(({ status: _status, ...place }) => ({
      ...place,
      cover_url: covers[place.id] ?? null,
    }));
  });

const idInput = (data: unknown) => z.object({ placeId: z.string().uuid() }).parse(data);

export const addFavorite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(idInput)
  .handler(async ({ data, context }): Promise<{ placeId: string }> => {
    // user_id comes from the verified session, never from the client payload.
    const { error } = await context.supabase
      .from("favorites")
      .upsert(
        { user_id: context.userId, place_id: data.placeId },
        { onConflict: "user_id,place_id", ignoreDuplicates: true },
      );

    if (error) {
      console.error("[favorites] addFavorite failed", error);
      throw new Error("FAVORITE_SAVE_FAILED");
    }
    return { placeId: data.placeId };
  });

export const removeFavorite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(idInput)
  .handler(async ({ data, context }): Promise<{ placeId: string }> => {
    const { error } = await context.supabase
      .from("favorites")
      .delete()
      .eq("user_id", context.userId)
      .eq("place_id", data.placeId);

    if (error) {
      console.error("[favorites] removeFavorite failed", error);
      throw new Error("FAVORITE_REMOVE_FAILED");
    }
    return { placeId: data.placeId };
  });
