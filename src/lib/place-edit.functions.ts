import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { placeSubmissionSchema, slugify } from "@/lib/place-submit.shared";

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
};

const EDIT_COLUMNS =
  "id, slug, status, title, short_description, description, why_visit, region, city, location_text, category, suitable_for, best_time, duration, approximate_cost, difficulty, local_secret";

/** Loads a place the signed-in user owns, for editing. RLS scopes the row. */
export const getPlaceForEdit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<EditablePlace | null> => {
    const { data: row, error } = await context.supabase
      .from("places")
      .select(EDIT_COLUMNS)
      .eq("id", data.id)
      .eq("owner_id", context.userId)
      .maybeSingle();

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
    const { data: current, error: loadError } = await context.supabase
      .from("places")
      .select("id, slug, title")
      .eq("id", data.id)
      .eq("owner_id", context.userId)
      .maybeSingle();

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
    };

    for (let attempt = 1; attempt <= 25; attempt++) {
      const slug = !titleChanged
        ? current.slug
        : attempt === 1
          ? base
          : `${base}-${attempt}`;

      const { error } = await context.supabase
        .from("places")
        .update({ ...fields, slug })
        .eq("id", data.id)
        .eq("owner_id", context.userId);

      if (!error) return { slug };
      if (!titleChanged || error.code !== "23505") {
        console.error("[places] updateMyPlace failed", error);
        throw new Error("PLACE_UPDATE_FAILED");
      }
    }

    console.error("[places] updateMyPlace could not find a free slug for", base);
    throw new Error("PLACE_UPDATE_FAILED");
  });
