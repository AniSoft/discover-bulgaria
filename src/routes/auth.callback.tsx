import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthCard, FormAlert } from "@/components/auth/AuthCard";
import { Button } from "@/components/AppButton";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { useT } from "@/lib/i18n";
import { safeRedirect } from "@/lib/safe-redirect";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/auth/callback")({
  // The Supabase session lives in browser storage; nothing here can render server-side.
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {},
  head: () => privateSeo("Signing in | Discover Bulgaria", "Completing your sign-in to Discover Bulgaria."),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const t = useT();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const target = safeRedirect(search.redirect);

    async function finish() {
      // The provider reports refusals/errors in the query string or the hash.
      const params = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      if (params.get("error") || hash.get("error")) {
        if (active) setFailed(true);
        return;
      }

      // detectSessionInUrl handles the code exchange; poll briefly for the result.
      for (let attempt = 0; attempt < 20; attempt++) {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        if (data.session) {
          trackEvent("login", { method: data.session.user.app_metadata?.["provider"] === "google" ? "google" : "social" });
          navigate({ to: target, replace: true });
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      if (active) setFailed(true);
    }

    void finish();
    return () => {
      active = false;
    };
  }, [navigate, search.redirect]);

  return (
    <AuthCard
      eyebrow={t("auth.welcomeBack")}
      title={failed ? t("auth.socialFailedTitle") : t("auth.signingIn")}
      description={failed ? undefined : t("auth.completingSignIn")}
    >
      <div aria-live="polite">
        {failed ? (
          <div className="space-y-5">
            <FormAlert>{t("auth.socialFailed")}</FormAlert>
            <Button size="lg" className="w-full" onClick={() => navigate({ to: "/login", replace: true })}>
              {t("auth.goToSignIn")}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("auth.completingSignIn")}</p>
        )}
      </div>
    </AuthCard>
  );
}
