/**
 * Google Analytics 4 (Basic Consent Mode).
 *
 * Discover Bulgaria does not use Google Ads, so the Google tag is NOT loaded
 * until the visitor explicitly accepts analytics cookies. Before consent:
 *
 * - no gtag.js script is loaded
 * - no dataLayer / gtag stub is created
 * - no GA4 events or cookieless pings are sent
 *
 * On Accept: the tag loads, G-NP4Y2XRK9Q initializes with analytics_storage
 * granted, and manual SPA page-view tracking starts. On Decline: nothing is
 * ever loaded and no events are sent. Advertising storage stays denied always.
 *
 * Page views are sent MANUALLY on router navigation: the GA config sets
 * `send_page_view: false`, so enhanced-measurement history events never
 * duplicate our SPA page views.
 *
 * No personal data (email, name, user id, tokens, free-form text such as raw
 * search terms) is ever sent.
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

let loaded = false;

/** True only after the Google tag has actually been loaded (post-consent). */
export function analyticsLoaded(): boolean {
  return loaded && typeof window.gtag === "function";
}

/**
 * Loads the Google tag exactly once with analytics_storage granted.
 * Called only after an explicit Accept (now or remembered from a prior visit).
 */
function loadAnalytics() {
  if (loaded || !analyticsEnabled()) return;
  loaded = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = gtag;

  // Consent state is applied before the config command. Ads stay denied.
  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

/**
 * Boots analytics on page load ONLY when consent was previously accepted.
 * Otherwise nothing loads: basic consent mode, zero pre-consent pings.
 */
export function initAnalytics() {
  if (!analyticsEnabled()) return;
  if (readConsent() === "accepted") loadAnalytics();
}

/** Records the visitor's choice; Accept loads the tag, Decline stays silent. */
export function applyConsent(choice: ConsentChoice) {
  writeConsent(choice);
  if (!analyticsEnabled()) return;
  if (choice === "accepted") loadAnalytics();
  // "declined": intentionally do nothing. The tag was never loaded.
}

export function trackPageView(location: string, title: string) {
  if (!analyticsLoaded()) return;
  window.gtag!("event", "page_view", { page_location: location, page_title: title });
}

/** Safe identifiers only: slugs, categories, language codes, counts. */
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (!analyticsLoaded()) return;
  window.gtag!("event", name, params);
}
