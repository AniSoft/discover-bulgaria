import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { placeSubmissionSchema, slugify } from "@/lib/place-submit.shared";
import { ALL_BG_COLUMNS } from "@/lib/place-i18n.shared";

export type EditablePlace = {
  id: string;
  slug: string;
  status: string;
  title: string;
  short_description: string;
  description: string;
  why_visit: string | null;
  region: string;
  city: string | null;
  location_text: string | null;
  category: string;
  suitable_for: string[] | null;
  best_time: string | null;
  duration: string | null;
  approximate_cost: string | null;
  difficulty: string | null;
  local_secret: string | null;
  title_bg: string | null;
  short_description_bg: string | null;
  description_bg: string | null;
  why_visit_bg: string | null;
  city_bg: string | null;
  best_time_bg: string | null;
  duration_bg: string | null;
  location_text_bg: string | null;
  local_secret_bg: string | null;
};

const EDIT_COLUMNS = `id, slug, status, title, short_description, description, why_visit, region, city, location_text, category, suitable_for, best_time, duration, approximate_cost, difficulty, local_secret, ${ALL_BG_COLUMNS}`;

/** Loads a place the signed-in user owns, for editing. RLS scopes the row. */
export const getPlaceForEdit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<EditablePlace | null> => {
    const { isAdminUser } = await import("@/lib/admin.server");
    const admin = await isAdminUser(context.userId);

    let query = context.supabase.from("places").select(EDIT_COLUMNS).eq("id", data.id);
    if (!admin) query = query.eq("owner_id", context.userId);
    const { data: row, error } = await query.maybeSingle();

    if (error) {
      console.error("[places] getPlaceForEdit failed", error);
      throw new Error("PLACE_LOAD_FAILED");
    }
    return (row as EditablePlace | null) ?? null;
  });

const updateSchema = placeSubmissionSchema.extend({ id: z.string().uuid() });

/**
 * Updates a place owned by the signed-in user. Ownership and status are never
 * taken from the client: RLS scopes the row and a database trigger forces the
 * place back to `for_review` for non-admin edits.
 */
export const updateMyPlace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => updateSchema.parse(data))
  .handler(async ({ data, context }): Promise<{ slug: string }> => {
    const { isAdminUser } = await import("@/lib/admin.server");
    const admin = await isAdminUser(context.userId);

    let currentQuery = context.supabase
      .from("places")
      .select("id, slug, title, status")
      .eq("id", data.id);
    if (!admin) currentQuery = currentQuery.eq("owner_id", context.userId);
    const { data: current, error: loadError } = await currentQuery.maybeSingle();

    if (loadError) {
      console.error("[places] updateMyPlace load failed", loadError);
      throw new Error("PLACE_UPDATE_FAILED");
    }
    if (!current) throw new Error("PLACE_NOT_FOUND");

    const titleChanged = current.title.trim() !== data.title;
    const base = slugify(data.title) || "place";

    const fields = {
      title: data.title,
      short_description: data.short_description,
      description: data.description,
      why_visit: data.why_visit || null,
      region: data.region,
      city: data.city || null,
      location_text: data.location_text || null,
      category: data.category,
      suitable_for: data.suitable_for,
      best_time: data.best_time || null,
      duration: data.duration || null,
      approximate_cost: data.approximate_cost || null,
      difficulty: data.difficulty || null,
      local_secret: data.local_secret || null,
      title_bg: data.title_bg || null,
      short_description_bg: data.short_description_bg || null,
      description_bg: data.description_bg || null,
      why_visit_bg: data.why_visit_bg || null,
      city_bg: data.city_bg || null,
      best_time_bg: data.best_time_bg || null,
      duration_bg: data.duration_bg || null,
      location_text_bg: data.location_text_bg || null,
      local_secret_bg: data.local_secret_bg || null,
    };

    for (let attempt = 1; attempt <= 25; attempt++) {
      const slug = !titleChanged
        ? current.slug
        : attempt === 1
          ? base
          : `${base}-${attempt}`;

      let updateQuery = context.supabase
        .from("places")
        .update({ ...fields, slug })
        .eq("id", data.id);
      if (!admin) updateQuery = updateQuery.eq("owner_id", context.userId);
      const { error } = await updateQuery;

      if (!error) return { slug };
      if (!titleChanged || error.code !== "23505") {
        console.error("[places] updateMyPlace failed", error);
        throw new Error("PLACE_UPDATE_FAILED");
      }
    }

    console.error("[places] updateMyPlace could not find a free slug for", base);
    throw new Error("PLACE_UPDATE_FAILED");
  });
