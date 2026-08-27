import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { PLACE_IMAGES_BUCKET, type PlacePhoto } from "@/lib/place-photos.shared";

type Client = SupabaseClient<Database>;

const SIGNED_URL_TTL = 60 * 60; // one hour

/**
 * Signs storage paths with whichever client (anon, user, admin) is calling.
 * Storage policies decide what can be signed, so unpublished photos stay private.
 */
export async function signPhotoUrls(
  client: Client,
  paths: string[],
): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return {};

  const { data, error } = await client.storage
    .from(PLACE_IMAGES_BUCKET)
    .createSignedUrls(unique, SIGNED_URL_TTL);

  if (error) {
    console.error("[photos] signing failed", error);
    return {};
  }

  const out: Record<string, string> = {};
  for (const item of data ?? []) {
    if (item.signedUrl && item.path) out[item.path] = item.signedUrl;
  }
  return out;
}

type PhotoRow = { id: string; storage_path: string; is_cover: boolean; sort_order: number };

export async function withSignedUrls(client: Client, rows: PhotoRow[]): Promise<PlacePhoto[]> {
  const urls = await signPhotoUrls(
    client,
    rows.map((r) => r.storage_path),
  );
  return rows.map((row) => ({ ...row, url: urls[row.storage_path] ?? null }));
}

/** Loads ordered photos for a set of places (RLS decides visibility). */
export async function loadPlacePhotos(
  client: Client,
  placeIds: string[],
  coverOnly = false,
): Promise<Record<string, PlacePhoto[]>> {
  if (placeIds.length === 0) return {};

  let query = client
    .from("place_photos")
    .select("id, place_id, storage_path, is_cover, sort_order")
    .in("place_id", placeIds)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (coverOnly) query = query.eq("is_cover", true);

  const { data, error } = await query;
  if (error) {
    console.error("[photos] loadPlacePhotos failed", error);
    return {};
  }

  const rows = data ?? [];
  const signed = await withSignedUrls(
    client,
    rows.map(({ id, storage_path, is_cover, sort_order }) => ({
      id,
      storage_path,
      is_cover,
      sort_order,
    })),
  );

  const out: Record<string, PlacePhoto[]> = {};
  rows.forEach((row, index) => {
    (out[row.place_id] ??= []).push(signed[index]!);
  });
  return out;
}

/** Cover image URL per place id. */
export async function loadCoverUrls(
  client: Client,
  placeIds: string[],
): Promise<Record<string, string>> {
  const byPlace = await loadPlacePhotos(client, placeIds, true);
  const out: Record<string, string> = {};
  for (const [placeId, photos] of Object.entries(byPlace)) {
    const url = photos[0]?.url;
    if (url) out[placeId] = url;
  }
  return out;
}

/** Best-effort removal of storage objects so deleted places leave no orphans. */
export async function removePhotoObjects(client: Client, paths: string[]) {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return;
  const { error } = await client.storage.from(PLACE_IMAGES_BUCKET).remove(unique);
  if (error) console.error("[photos] storage cleanup failed", error);
}
