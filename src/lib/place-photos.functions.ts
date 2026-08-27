import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  MAX_PLACE_PHOTOS,
  isValidPhotoPath,
  type PlacePhoto,
} from "@/lib/place-photos.shared";

const PHOTO_COLUMNS = "id, storage_path, is_cover, sort_order";

/**
 * Photos of a place, for management screens. RLS scopes the rows to the owner
 * of the place or an administrator, so no extra ownership check is needed here.
 */
export const listPlacePhotos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ place_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<PlacePhoto[]> => {
    const { withSignedUrls } = await import("@/lib/place-photos.server");

    const { data: rows, error } = await context.supabase
      .from("place_photos")
      .select(PHOTO_COLUMNS)
      .eq("place_id", data.place_id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[photos] listPlacePhotos failed", error);
      throw new Error("PHOTOS_LOAD_FAILED");
    }
    return withSignedUrls(context.supabase, rows ?? []);
  });

/**
 * Records an uploaded object. The upload itself happens from the browser with
 * the user's session, and storage policies already restrict the target folder.
 */
export const registerPlacePhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ place_id: z.string().uuid(), storage_path: z.string().min(1).max(300) })
      .parse(data),
  )
  .handler(async ({ data, context }): Promise<PlacePhoto> => {
    const { withSignedUrls, removePhotoObjects, isStoredPhotoAcceptable } = await import(
      "@/lib/place-photos.server"
    );

    if (!isValidPhotoPath(data.place_id, data.storage_path)) {
      await removePhotoObjects(context.supabase, [data.storage_path]);
      throw new Error("PHOTO_PATH_INVALID");
    }

    // Trust the stored bytes, not the client's claim about them.
    if (!(await isStoredPhotoAcceptable(context.supabase, data.storage_path))) {
      await removePhotoObjects(context.supabase, [data.storage_path]);
      throw new Error("PHOTO_TYPE_INVALID");
    }


    const { data: existing, error: countError } = await context.supabase
      .from("place_photos")
      .select("sort_order")
      .eq("place_id", data.place_id)
      .order("sort_order", { ascending: false });

    if (countError) {
      console.error("[photos] registerPlacePhoto count failed", countError);
      throw new Error("PHOTO_SAVE_FAILED");
    }

    if ((existing ?? []).length >= MAX_PLACE_PHOTOS) {
      await removePhotoObjects(context.supabase, [data.storage_path]);
      throw new Error("PHOTO_LIMIT_REACHED");
    }

    const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

    const { data: row, error } = await context.supabase
      .from("place_photos")
      .insert({
        place_id: data.place_id,
        storage_path: data.storage_path,
        uploaded_by: context.userId,
        sort_order: nextOrder,
        // The database trigger makes the first photo of a place the cover.
        is_cover: false,
      })
      .select(PHOTO_COLUMNS)
      .single();

    if (error || !row) {
      console.error("[photos] registerPlacePhoto insert failed", error);
      await removePhotoObjects(context.supabase, [data.storage_path]);
      throw new Error("PHOTO_SAVE_FAILED");
    }

    const [photo] = await withSignedUrls(context.supabase, [row]);
    return photo!;
  });

export const deletePlacePhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { removePhotoObjects } = await import("@/lib/place-photos.server");

    const { data: row, error: loadError } = await context.supabase
      .from("place_photos")
      .select("id, storage_path")
      .eq("id", data.id)
      .maybeSingle();

    if (loadError) {
      console.error("[photos] deletePlacePhoto load failed", loadError);
      throw new Error("PHOTO_DELETE_FAILED");
    }
    if (!row) throw new Error("PHOTO_NOT_FOUND");

    const { error } = await context.supabase.from("place_photos").delete().eq("id", data.id);
    if (error) {
      console.error("[photos] deletePlacePhoto failed", error);
      throw new Error("PHOTO_DELETE_FAILED");
    }

    // The database promotes the next photo to cover; clean up the file as well.
    await removePhotoObjects(context.supabase, [row.storage_path]);
    return { id: data.id };
  });

export const setPlaceCoverPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { data: updated, error } = await context.supabase
      .from("place_photos")
      .update({ is_cover: true })
      .eq("id", data.id)
      .select("id");

    if (error) {
      console.error("[photos] setPlaceCoverPhoto failed", error);
      throw new Error("PHOTO_COVER_FAILED");
    }
    // RLS filters out photos the caller may not manage: report that clearly
    // instead of pretending the change succeeded.
    if (!updated || updated.length === 0) throw new Error("PHOTO_NOT_FOUND");
    return { id: data.id };
  });

export const reorderPlacePhotos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        place_id: z.string().uuid(),
        ids: z.array(z.string().uuid()).min(1).max(MAX_PLACE_PHOTOS),
      })
      .parse(data),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    for (const [index, id] of data.ids.entries()) {
      const { error } = await context.supabase
        .from("place_photos")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("place_id", data.place_id);

      if (error) {
        console.error("[photos] reorderPlacePhotos failed", error);
        throw new Error("PHOTO_REORDER_FAILED");
      }
    }
    return { ok: true };
  });
