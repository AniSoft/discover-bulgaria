import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { PlacePhoto } from "@/lib/place-photos.shared";
import {
  EXTRA_DETAIL_BG_COLUMNS,
  LIST_BG_COLUMNS,
  type PlaceBgFields,
} from "@/lib/place-i18n.shared";

export type PublicPlace = {
  id: string;
  slug: string;
  title: string;
  region: string;
  city: string | null;
  category: string;
  short_description: string;
  approximate_cost: string | null;
  duration: string | null;
  cover_url: string | null;
} & PlaceBgFields;

export type PublicPlaceDetail = PublicPlace & {
  description: string;
  why_visit: string | null;
  location_text: string | null;
  suitable_for: string[];
  best_time: string | null;
  difficulty: string | null;
  local_secret: string | null;
  photos: PlacePhoto[];
} & PlaceBgFields;

const PUBLIC_COLUMNS =
  `id, slug, title, region, city, category, short_description, approximate_cost, duration, ${LIST_BG_COLUMNS}`;

function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const listInput = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const listPublishedPlaces = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => listInput.parse(data ?? {}))
  .handler(async ({ data }): Promise<PublicPlace[]> => {
    const supabase = publicClient();
    let query = supabase
      .from("places")
      .select(PUBLIC_COLUMNS)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(200);

    const category = data.category?.trim();
    if (category) query = query.eq("category", category);

    const q = data.q?.replace(/\s+/g, " ").trim().slice(0, 100);
    const escaped = q ? q.replace(/[%,()*]/g, " ").replace(/\s+/g, " ").trim() : "";
    if (escaped) {
      // Bilingual: match English base columns and Bulgarian *_bg translations.
      query = query.or(
        [
          "title",
          "title_bg",
          "region",
          "city",
          "city_bg",
          "location_text",
          "location_text_bg",
          "short_description",
          "short_description_bg",
        ]
          .map((column) => `${column}.ilike.%${escaped}%`)
          .join(","),
      );
    }

    const { data: rows, error } = await query;
    if (error) {
      console.error("[places] listPublishedPlaces failed", error);
      throw new Error("PLACES_LOAD_FAILED");
    }

    let places = (rows ?? []) as Omit<PublicPlace, "cover_url">[];

    if (escaped) {
      const needle = escaped.toLocaleLowerCase("bg");
      const score = (place: Omit<PublicPlace, "cover_url">) => {
        const titles = [place.title, place.title_bg].filter(Boolean).map((v) =>
          String(v).toLocaleLowerCase("bg"),
        );
        if (titles.some((t) => t === needle)) return 0;
        if (titles.some((t) => t.includes(needle))) return 1;
        const places_ = [place.city, place.city_bg, place.region]
          .filter(Boolean)
          .map((v) => String(v).toLocaleLowerCase("bg"));
        if (places_.some((t) => t.includes(needle))) return 2;
        const summaries = [place.short_description, place.short_description_bg]
          .filter(Boolean)
          .map((v) => String(v).toLocaleLowerCase("bg"));
        if (summaries.some((t) => t.includes(needle))) return 3;
        return 4;
      };
      places = [...places].sort((a, b) => score(a) - score(b));
    }

    const { loadCoverUrls } = await import("@/lib/place-photos.server");
    const covers = await loadCoverUrls(supabase, places.map((p) => p.id));
    return places.map((place) => ({ ...place, cover_url: covers[place.id] ?? null }));
  });


export const getPublishedCategoryCounts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Record<string, number>> => {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("places")
      .select("category")
      .eq("status", "published")
      .limit(1000);

    if (error) {
      console.error("[places] getPublishedCategoryCounts failed", error);
      throw new Error("PLACES_LOAD_FAILED");
    }

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.category] = (counts[row.category] ?? 0) + 1;
    }
    return counts;
  },
);

const DETAIL_COLUMNS = `${PUBLIC_COLUMNS}, description, why_visit, location_text, suitable_for, best_time, difficulty, local_secret, ${EXTRA_DETAIL_BG_COLUMNS}`;

export const getPublishedPlaceBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }): Promise<PublicPlaceDetail | null> => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("places")
      .select(DETAIL_COLUMNS)
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) {
      console.error("[places] getPublishedPlaceBySlug failed", error);
      throw new Error("PLACE_LOAD_FAILED");
    }
    if (!row) return null;

    const place = row as Omit<PublicPlaceDetail, "cover_url" | "photos">;
    const { loadPlacePhotos } = await import("@/lib/place-photos.server");
    const photos = (await loadPlacePhotos(supabase, [place.id]))[place.id] ?? [];
    return {
      ...place,
      photos,
      cover_url: photos.find((photo) => photo.is_cover)?.url ?? photos[0]?.url ?? null,
    };
  });
