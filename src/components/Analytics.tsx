import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  analyticsEnabled,
  initAnalytics,
  readConsent,
  trackPageView,
  updateConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/analytics";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Boots the Google tag once and sends one manual page_view per route change.
 * Enhanced-measurement history page views are disabled in the GA config, so
 * there is exactly one page_view per navigation.
 */
export function Analytics() {
  const href = useRouterState({ select: (state) => state.location.href });

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!analyticsEnabled()) return;
    // Let the route's head() title land before reporting it.
    const id = window.setTimeout(() => {
      trackPageView(window.location.href, document.title);
    }, 60);
    return () => window.clearTimeout(id);
  }, [href]);

  return <ConsentBanner />;
}

function ConsentBanner() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (analyticsEnabled() && readConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  const choose = (choice: ConsentChoice) => {
    writeConsent(choice);
    updateConsent(choice);
    setVisible(false);
    if (choice === "accepted") trackPageView(window.location.href, document.title);
  };

  const button =
    "inline-flex h-10 items-center justify-center rounded-[var(--radius-button)] px-5 text-sm font-medium transition-colors duration-250 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <div
      role="dialog"
      aria-label={t("consent.aria")}
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-card/98 p-5 shadow-card backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted-foreground">{t("consent.text")}</p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose("accepted")}
            className={cn(button, "bg-primary text-primary-foreground hover:bg-primary/90")}
          >
            {t("consent.accept")}
          </button>
          <button
            type="button"
            onClick={() => choose("declined")}
            className={cn(button, "border border-border bg-card text-foreground hover:bg-secondary")}
          >
            {t("consent.decline")}
          </button>
        </div>
      </div>
    </div>
  );
}
