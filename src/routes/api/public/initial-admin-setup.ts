import { createFileRoute } from "@tanstack/react-router";

/**
 * One-time initial admin bootstrap endpoint (server-side, privileged).
 *
 * GET  -> { adminExists: boolean }
 * POST -> { email, password } creates/promotes the first admin.
 *
 * The service-role key is read only inside the handler and never reaches the
 * browser. Once any user has app_metadata.is_admin === true, POST is rejected.
 */

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const isAdminUser = (u: { app_metadata?: Record<string, unknown> | null }) =>
  (u.app_metadata as Record<string, unknown> | null)?.["is_admin"] === true;

export const Route = createFileRoute("/api/public/initial-admin-setup")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        if (error) return json({ error: "Could not check admin status." }, 500);
        return json({ adminExists: data.users.some(isAdminUser) });
      },

      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 1000,
        });
        if (listError) return json({ error: "Could not check admin status." }, 500);

        // Hard server-side guard: setup is closed forever once an admin exists.
        if (list.users.some(isAdminUser)) {
          return json({ error: "An admin already exists. Setup is closed." }, 403);
        }

        const body = (await request.json().catch(() => ({}))) as {
          email?: unknown;
          password?: unknown;
        };
        const email = String(body?.email ?? "").trim().toLowerCase();
        const password = String(body?.password ?? "");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return json({ error: "Enter a valid email address." }, 400);
        }
        if (password.length < 8) {
          return json({ error: "Password must be at least 8 characters." }, 400);
        }

        const existing = list.users.find((u) => (u.email ?? "").toLowerCase() === email);

        if (existing) {
          const { error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
            password,
            app_metadata: { ...(existing.app_metadata ?? {}), is_admin: true },
          });
          if (error) return json({ error: error.message }, 400);
          return json({ ok: true, promoted: true });
        }

        const { error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          app_metadata: { is_admin: true },
          user_metadata: { full_name: "Administrator" },
        });
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true, promoted: false });
      },
    },
  },
});
