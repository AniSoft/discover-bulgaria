import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Returns true when at least one auth user has app_metadata.is_admin === true. */
export const getAdminSetupStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error("Could not check admin status.");
  const adminExists = data.users.some(
    (u) => (u.app_metadata as Record<string, unknown> | null)?.["is_admin"] === true,
  );
  return { adminExists };
});

/** Server-verified admin check for the signed-in user. */
export const verifyAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(context.userId);
    if (error || !data.user) return { isAdmin: false };
    const isAdmin =
      (data.user.app_metadata as Record<string, unknown> | null)?.["is_admin"] === true;
    return { isAdmin };
  });

/** One-time bootstrap: creates or promotes the first admin, only while none exists. */
export const createInitialAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; password: string }) => {
    const email = String(input?.email ?? "").trim().toLowerCase();
    const password = String(input?.password ?? "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
    if (password.length < 8) throw new Error("Password must be at least 8 characters.");
    return { email, password };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (listError) throw new Error("Could not check admin status.");

    const adminExists = list.users.some(
      (u) => (u.app_metadata as Record<string, unknown> | null)?.["is_admin"] === true,
    );
    if (adminExists) throw new Error("An admin already exists. Setup is closed.");

    const existing = list.users.find((u) => (u.email ?? "").toLowerCase() === data.email);

    if (existing) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: data.password,
        app_metadata: { ...(existing.app_metadata ?? {}), is_admin: true },
      });
      if (error) throw new Error(error.message);
      return { ok: true, promoted: true };
    }

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      app_metadata: { is_admin: true },
      user_metadata: { full_name: "Administrator" },
    });
    if (error) throw new Error(error.message);
    return { ok: true, promoted: false };
  });
