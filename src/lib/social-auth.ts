import { supabase } from "@/integrations/supabase/client";
import { safeRedirect } from "@/lib/safe-redirect";

/**
 * Feature flag for Facebook Login. Set to `true` once Meta Business
 * Verification is complete and the provider is ready for general users.
 *
 * Hiding Facebook only removes the UI button; the OAuth code, Supabase
 * provider configuration, and callback flow remain intact.
 */
export const FACEBOOK_LOGIN_ENABLED = false;

/**
 * Social identity providers that are actually wired up. Adding "facebook" here
 * (once it is configured in the Supabase dashboard) is all that is needed to
 * surface a Facebook button, because every consumer renders from this list.
 */
export const SOCIAL_PROVIDERS = FACEBOOK_LOGIN_ENABLED
  ? (["google", "facebook"] as const)
  : (["google"] as const);

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];

export const AUTH_CALLBACK_PATH = "/auth/callback";

/**
 * Starts a Supabase OAuth redirect for the given provider. The browser comes
 * back to our own callback route, which restores the intended internal path.
 * Browser-only: never call during SSR.
 */
export async function signInWithSocialProvider(
  provider: SocialProvider,
  redirectPath?: string | undefined,
): Promise<{ error: string | null }> {
  if (typeof window === "undefined") return { error: "unavailable" };

  const target = safeRedirect(redirectPath);
  const callback = new URL(AUTH_CALLBACK_PATH, window.location.origin);
  callback.searchParams.set("redirect", target);

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: callback.toString() },
  });

  if (error) {
    // Keep provider/config details out of the UI; surface a generic failure.
    console.error("[auth] social sign-in failed", provider, error.message);
    return { error: "failed" };
  }
  return { error: null };
}
