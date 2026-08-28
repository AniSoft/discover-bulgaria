import { useState } from "react";
import { FormAlert } from "@/components/auth/AuthCard";
import { useT, type MessageKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SOCIAL_PROVIDERS, signInWithSocialProvider, type SocialProvider } from "@/lib/social-auth";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.28a12 12 0 0 0 0 10.76l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.18 15.23 0 12 0A12 12 0 0 0 1.28 6.62l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77Z"
      />
    </svg>
  );
}

const PROVIDER_META: Record<
  SocialProvider,
  { icon: typeof GoogleIcon; labelKey: MessageKey; loadingKey: MessageKey }
> = {
  google: {
    icon: GoogleIcon,
    labelKey: "auth.continueWithGoogle",
    loadingKey: "auth.connectingGoogle",
  },
};

/**
 * Social sign-in block rendered above the email/password form. Only providers
 * listed in SOCIAL_PROVIDERS (i.e. actually configured) are shown.
 */
export function SocialAuth({ redirectPath, className }: { redirectPath?: string | undefined; className?: string }) {
  const t = useT();
  const [pending, setPending] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);



  async function start(provider: SocialProvider) {
    if (pending) return;
    setError(null);
    setPending(provider);
    const result = await signInWithSocialProvider(provider, redirectPath);
    if (result.error) {
      setError(t("auth.socialFailed"));
      setPending(null);
    }
    // On success the browser navigates away; keep the button disabled.
  }

  return (
    <div className={cn("space-y-5", className)}>
      {error ? <FormAlert>{error}</FormAlert> : null}

      <div className="space-y-3">
        {SOCIAL_PROVIDERS.map((provider) => {
          const meta = PROVIDER_META[provider];
          const Icon = meta.icon;
          const busy = pending === provider;
          return (
            <button
              key={provider}
              type="button"
              onClick={() => void start(provider)}
              disabled={pending !== null}
              aria-busy={busy}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-[var(--radius-button)] border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Icon className="size-5 shrink-0" />
              <span className="truncate">{busy ? t(meta.loadingKey) : t(meta.labelKey)}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">{t("auth.or")}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
