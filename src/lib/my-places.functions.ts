import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { PublicPlaceDetail } from "@/lib/places.functions";
import type { PlacePhoto } from "@/lib/place-photos.shared";

export type OwnedPlace = {
  id: string;
  slug: string;
  title: string;
  region: string;
  city: string | null;
  category: string;
  short_description: string;
  approximate_cost: string | null;
  duration: string | null;
  status: string;
  created_at: string;
  cover_url: string | null;
};

const OWNED_COLUMNS =
  "id, slug, title, region, city, category, short_description, approximate_cost, duration, status, created_at";

/** Lists places owned by the signed-in user, any status. RLS scopes the rows. */
export const listMyPlaces = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<OwnedPlace[]> => {
    const { data, error } = await context.supabase
      .from("places")
      .select(OWNED_COLUMNS)
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[my-places] listMyPlaces failed", error);
      throw new Error("MY_PLACES_LOAD_FAILED");
    }

    const places = (data ?? []) as Omit<OwnedPlace, "cover_url">[];
    const { loadCoverUrls } = await import("@/lib/place-photos.server");
    const covers = await loadCoverUrls(context.supabase, places.map((p) => p.id));
    return places.map((place) => ({ ...place, cover_url: covers[place.id] ?? null }));
  });

export const deleteMyPlace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    // Collect the files first: the rows disappear with the place (cascade).
    const { data: photos } = await context.supabase
      .from("place_photos")
      .select("storage_path")
      .eq("place_id", data.id);

    const { error } = await context.supabase
      .from("places")
      .delete()
      .eq("id", data.id)
      .eq("owner_id", context.userId);

    if (!error && photos?.length) {
      const { removePhotoObjects } = await import("@/lib/place-photos.server");
      await removePhotoObjects(context.supabase, photos.map((p) => p.storage_path));
    }

    if (error) {
      console.error("[my-places] deleteMyPlace failed", error);
      throw new Error("MY_PLACE_DELETE_FAILED");
    }
    return { id: data.id };
  });

const DETAIL_COLUMNS =
  "id, slug, title, region, city, category, short_description, approximate_cost, duration, description, why_visit, location_text, suitable_for, best_time, difficulty, local_secret, status";

/** Owner-only preview of a place that is not published yet. */
export const getOwnedPlaceBySlug = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(
    async ({
      data,
      context,
    }): Promise<(PublicPlaceDetail & { status: string }) | null> => {
      const { isAdminUser } = await import("@/lib/admin.server");
      const admin = await isAdminUser(context.userId);

      let query = context.supabase.from("places").select(DETAIL_COLUMNS).eq("slug", data.slug);
      if (!admin) query = query.eq("owner_id", context.userId);
      const { data: row, error } = await query.maybeSingle();

      if (error) {
        console.error("[my-places] getOwnedPlaceBySlug failed", error);
        throw new Error("PLACE_LOAD_FAILED");
      }
      if (!row) return null;

      const place = row as Omit<PublicPlaceDetail, "cover_url" | "photos"> & { status: string };
      const { loadPlacePhotos } = await import("@/lib/place-photos.server");
      const photos: PlacePhoto[] =
        (await loadPlacePhotos(context.supabase, [place.id]))[place.id] ?? [];
      return {
        ...place,
        photos,
        cover_url: photos.find((photo) => photo.is_cover)?.url ?? photos[0]?.url ?? null,
      };
    },
  );

export const getOwnedPlaceById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<OwnedPlace | null> => {
    const { data: row, error } = await context.supabase
      .from("places")
      .select(OWNED_COLUMNS)
      .eq("id", data.id)
      .eq("owner_id", context.userId)
      .maybeSingle();

    if (error) {
      console.error("[my-places] getOwnedPlaceById failed", error);
      throw new Error("PLACE_LOAD_FAILED");
    }
    return row ? ({ ...row, cover_url: null } as OwnedPlace) : null;
  });
