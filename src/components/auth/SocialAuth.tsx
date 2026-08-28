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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
      />
      <path
        fill="#FFFFFF"
        d="m16.67 15.56.53-3.49h-3.33V9.81c0-.96.47-1.89 1.96-1.89h1.51V4.96s-1.37-.24-2.68-.24c-2.74 0-4.53 1.67-4.53 4.69v2.66H7.08v3.49h3.05V24a12.2 12.2 0 0 0 3.74 0v-8.44h2.8Z"
      />
    </svg>
  );
}

const PROVIDER_META: Record<
  SocialProvider,
  { icon: typeof GoogleIcon; labelKey: MessageKey; loadingKey: MessageKey; errorKey: MessageKey }
> = {
  google: {
    icon: GoogleIcon,
    labelKey: "auth.continueWithGoogle",
    loadingKey: "auth.connectingGoogle",
    errorKey: "auth.socialFailedGoogle",
  },
  facebook: {
    icon: FacebookIcon,
    labelKey: "auth.continueWithFacebook",
    loadingKey: "auth.connectingFacebook",
    errorKey: "auth.socialFailedFacebook",
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
      setError(t(PROVIDER_META[provider].errorKey));
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
