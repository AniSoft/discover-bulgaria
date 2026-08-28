import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  analyticsEnabled,
  analyticsLoaded,
  applyConsent,
  initAnalytics,
  readConsent,
  trackPageView,
} from "@/lib/analytics";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Any component can reopen the preferences dialog through this event. */
export const COOKIE_SETTINGS_EVENT = "discoverbulgaria:cookie-settings";

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}

/**
 * Basic consent behaviour: the Google tag is only loaded after an explicit
 * Accept (now or remembered from a prior visit). Until then nothing is loaded
 * and no requests leave the browser. After Accept, one manual page_view is sent
 * per route change; enhanced-measurement history page views are disabled in the
 * GA config, so there is exactly one page_view per navigation.
 */
export function Analytics() {
  const href = useRouterState({ select: (state) => state.location.href });

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!analyticsEnabled() || !analyticsLoaded()) return;
    // Let the route's head() title land before reporting it.
    const id = window.setTimeout(() => {
      trackPageView(window.location.href, document.title);
    }, 60);
    return () => window.clearTimeout(id);
  }, [href]);

  return <ConsentLayer />;
}

const buttonBase =
  "inline-flex h-10 items-center justify-center rounded-[var(--radius-button)] px-5 text-sm font-medium transition-colors duration-250 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const solidButton = cn(buttonBase, "bg-primary text-primary-foreground hover:bg-primary/90");
const outlineButton = cn(
  buttonBase,
  "border border-border bg-card text-foreground hover:bg-secondary",
);

function ConsentLayer() {
  const t = useT();
  const [bannerVisible, setBannerVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setAnalyticsOn(Boolean(stored?.analytics));
    if (stored === null) setBannerVisible(true);
  }, []);

  useEffect(() => {
    const open = () => {
      setAnalyticsOn(Boolean(readConsent()?.analytics));
      setSettingsOpen(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open);
  }, []);

  const decide = useCallback((analytics: boolean) => {
    applyConsent(analytics);
    setAnalyticsOn(analytics);
    setBannerVisible(false);
    setSettingsOpen(false);
    if (analytics) trackPageView(window.location.href, document.title);
  }, []);

  return (
    <>
      {bannerVisible && !settingsOpen ? (
        <div
          role="region"
          aria-label={t("consent.aria")}
          className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-card/98 p-5 shadow-card backdrop-blur-sm">
            <p className="text-sm leading-relaxed text-muted-foreground">{t("consent.text")}</p>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => decide(true)} className={solidButton}>
                {t("consent.accept")}
              </button>
              <button type="button" onClick={() => decide(false)} className={outlineButton}>
                {t("consent.decline")}
              </button>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className={cn(
                  buttonBase,
                  "px-2 text-muted-foreground underline underline-offset-4 hover:text-foreground",
                )}
              >
                {t("consent.settings")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {settingsOpen ? (
        <CookieSettingsDialog
          analyticsOn={analyticsOn}
          onToggleAnalytics={setAnalyticsOn}
          onSave={() => decide(analyticsOn)}
          onClose={() => {
            setSettingsOpen(false);
            setAnalyticsOn(Boolean(readConsent()?.analytics));
          }}
        />
      ) : null}
    </>
  );
}

function CookieSettingsDialog({
  analyticsOn,
  onToggleAnalytics,
  onSave,
  onClose,
}: {
  analyticsOn: boolean;
  onToggleAnalytics: (value: boolean) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 px-4 py-6 backdrop-blur-sm sm:items-center">
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        className="w-full max-w-lg rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card outline-none sm:p-8"
      >
        <h2 id="cookie-settings-title" className="text-2xl leading-snug text-foreground">
          {t("consent.settingsTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t("consent.settingsIntro")}
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-[var(--radius-card)] border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-medium text-foreground">
                  {t("consent.necessaryTitle")}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t("consent.necessaryBody")}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                {t("consent.alwaysActive")}
              </span>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-medium text-foreground">
                  {t("consent.analyticsTitle")}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t("consent.analyticsBody")}
                </p>
              </div>
              <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={analyticsOn}
                  onChange={(event) => onToggleAnalytics(event.target.checked)}
                  className="size-4 accent-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                />
                {analyticsOn ? t("consent.on") : t("consent.off")}
              </label>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          <button type="button" onClick={onSave} className={solidButton}>
            {t("consent.savePreferences")}
          </button>
          <button type="button" onClick={onClose} className={outlineButton}>
            {t("consent.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
