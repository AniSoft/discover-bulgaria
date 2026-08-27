import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { placeSubmissionSchema, slugify } from "@/lib/place-submit.shared";

export const createPlace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => placeSubmissionSchema.parse(data))
  .handler(async ({ data, context }): Promise<{ slug: string }> => {
    const base = slugify(data.title) || "place";

    for (let attempt = 1; attempt <= 25; attempt++) {
      const slug = attempt === 1 ? base : `${base}-${attempt}`;
      const { error } = await context.supabase.from("places").insert({
        title: data.title,
        slug,
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
        // Ownership and status are decided server-side, never by the client.
        owner_id: context.userId,
        status: "for_review",
      });

      if (!error) return { slug };
      if (error.code !== "23505") {
        console.error("[places] createPlace failed", error);
        throw new Error("PLACE_SUBMIT_FAILED");
      }
    }

    console.error("[places] createPlace could not find a free slug for", base);
    throw new Error("PLACE_SUBMIT_FAILED");
  });
