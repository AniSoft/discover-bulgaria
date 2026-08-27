import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** True when the given auth user carries app_metadata.is_admin === true. */
export async function isAdminUser(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error || !data.user) return false;
  return (data.user.app_metadata as Record<string, unknown> | null)?.["is_admin"] === true;
}

/** Throws unless the caller is an administrator. */
export async function assertAdmin(userId: string): Promise<void> {
  if (!(await isAdminUser(userId))) throw new Error("FORBIDDEN");
}

/**
 * Resolves friendly author labels for owner ids. Raw user ids are never used as
 * a display label; callers fall back to a neutral "Community member".
 */
export async function authorNames(ownerIds: (string | null)[]): Promise<Record<string, string>> {
  const unique = [...new Set(ownerIds.filter((id): id is string => Boolean(id)))].slice(0, 60);
  const out: Record<string, string> = {};

  await Promise.all(
    unique.map(async (id) => {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
      if (error || !data.user) return;
      const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
      const name =
        (typeof meta["full_name"] === "string" && meta["full_name"]) ||
        (typeof meta["name"] === "string" && meta["name"]) ||
        data.user.email;
      if (name) out[id] = String(name);
    }),
  );

  return out;
}
