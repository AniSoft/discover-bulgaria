import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { LIST_BG_COLUMNS, type PlaceBgFields } from "@/lib/place-i18n.shared";

export type AdminPlace = {
  id: string;
  slug: string;
  title: string;
  region: string;
  city: string | null;
  category: string;
  status: string;
  created_at: string;
  owner_id: string | null;
  author: string | null;
} & PlaceBgFields;

export type AdminStats = {
  for_review: number;
  published: number;
  rejected: number;
  total: number;
};

const ADMIN_COLUMNS = `id, slug, title, region, city, category, status, created_at, owner_id, ${LIST_BG_COLUMNS}`;

const statusValues = ["for_review", "published", "rejected"] as const;

async function withAuthors(
  rows: Omit<AdminPlace, "author">[],
): Promise<AdminPlace[]> {
  const { authorNames } = await import("@/lib/admin.server");
  const names = await authorNames(rows.map((r) => r.owner_id));
  return rows.map((r) => ({ ...r, author: (r.owner_id && names[r.owner_id]) || null }));
}

/** Counts by status across every place. Admin only. */
export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminStats> => {
    const { assertAdmin } = await import("@/lib/admin.server");
    await assertAdmin(context.userId);

    const count = async (status?: string) => {
      let query = context.supabase.from("places").select("id", { count: "exact", head: true });
      if (status) query = query.eq("status", status);
      const { count: value, error } = await query;
      if (error) {
        console.error("[admin] stats count failed", error);
        throw new Error("ADMIN_STATS_FAILED");
      }
      return value ?? 0;
    };

    const [for_review, published, rejected, total] = await Promise.all([
      count("for_review"),
      count("published"),
      count("rejected"),
      count(),
    ]);

    return { for_review, published, rejected, total };
  });

/** Latest submissions waiting for review, for the dashboard. Admin only. */
export const listRecentSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminPlace[]> => {
    const { assertAdmin } = await import("@/lib/admin.server");
    await assertAdmin(context.userId);

    const { data, error } = await context.supabase
      .from("places")
      .select(ADMIN_COLUMNS)
      .eq("status", "for_review")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("[admin] listRecentSubmissions failed", error);
      throw new Error("ADMIN_PLACES_FAILED");
    }
    return withAuthors((data ?? []) as Omit<AdminPlace, "author">[]);
  });

/** Every place, any owner, any status. Admin only; RLS also enforces this. */
export const listAdminPlaces = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminPlace[]> => {
    const { assertAdmin } = await import("@/lib/admin.server");
    await assertAdmin(context.userId);

    const { data, error } = await context.supabase
      .from("places")
      .select(ADMIN_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) {
      console.error("[admin] listAdminPlaces failed", error);
      throw new Error("ADMIN_PLACES_FAILED");
    }
    return withAuthors((data ?? []) as Omit<AdminPlace, "author">[]);
  });

/** Approve / reject a place. Admin only; the database policies enforce it too. */
export const setPlaceStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(statusValues) }).parse(data),
  )
  .handler(async ({ data, context }): Promise<{ id: string; status: string }> => {
    const { assertAdmin } = await import("@/lib/admin.server");
    await assertAdmin(context.userId);

    const { error } = await context.supabase
      .from("places")
      .update({ status: data.status })
      .eq("id", data.id);

    if (error) {
      console.error("[admin] setPlaceStatus failed", error);
      throw new Error("ADMIN_STATUS_UPDATE_FAILED");
    }
    return { id: data.id, status: data.status };
  });

/** Delete any place. Admin only. */
export const deletePlaceAsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { assertAdmin } = await import("@/lib/admin.server");
    await assertAdmin(context.userId);

    const { data: photos } = await context.supabase
      .from("place_photos")
      .select("storage_path")
      .eq("place_id", data.id);

    const { error } = await context.supabase.from("places").delete().eq("id", data.id);

    if (!error && photos?.length) {
      const { removePhotoObjects } = await import("@/lib/place-photos.server");
      await removePhotoObjects(context.supabase, photos.map((p) => p.storage_path));
    }

    if (error) {
      console.error("[admin] deletePlaceAsAdmin failed", error);
      throw new Error("ADMIN_DELETE_FAILED");
    }
    return { id: data.id };
  });
