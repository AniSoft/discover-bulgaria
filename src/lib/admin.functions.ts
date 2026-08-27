import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";



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

// Initial-admin bootstrap lives in the privileged HTTP endpoint
// src/routes/api/public/initial-admin-setup.ts

