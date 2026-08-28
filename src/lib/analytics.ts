/**
 * Google Analytics 4 (Consent Mode v2).
 *
 * Page views are sent MANUALLY on router navigation: the GA config sets
 * `send_page_view: false`, so enhanced-measurement history events never
 * duplicate our SPA page views. Analytics storage stays denied until the
 * visitor accepts; advertising storage is always denied (no ads on this site).
 *
 * No personal data (email, name, user id, tokens, free-form text) is ever sent.
 */

export const GA_MEASUREMENT_ID = "G-NP4Y2XRK9Q";
export const CONSENT_STORAGE_KEY = "db_analytics_consent";

export type ConsentChoice = "accepted" | "declined";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Analytics runs on the production domain only: no localhost, no previews. */
export function analyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "discoverbulgaria.net" || host === "www.discoverbulgaria.net";
}

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* storage unavailable: choice simply isn't remembered */
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(args);
}

let initialized = false;

/** Loads the Google tag exactly once and applies the stored consent choice. */
export function initAnalytics() {
  if (initialized || !analyticsEnabled()) return;
  initialized = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = gtag;

  // Consent defaults must be set before the config command.
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (readConsent() === "accepted") {
    gtag("consent", "update", { analytics_storage: "granted" });
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function updateConsent(choice: ConsentChoice) {
  if (!analyticsEnabled() || typeof window.gtag !== "function") return;
  gtag("consent", "update", {
    analytics_storage: choice === "accepted" ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function trackPageView(location: string, title: string) {
  if (!analyticsEnabled() || typeof window.gtag !== "function") return;
  gtag("event", "page_view", { page_location: location, page_title: title });
}

/** Safe identifiers only: slugs, categories, language codes. */
export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (!analyticsEnabled() || typeof window.gtag !== "function") return;
  gtag("event", name, params);
}
