/**
 * Google Analytics 4 with BASIC consent behaviour.
 *
 * Discover Bulgaria does not use advertising products, so the Google tag is NOT
 * loaded until the visitor explicitly accepts analytics. Before consent:
 *
 * - no gtag.js script is loaded
 * - no dataLayer / gtag stub is created
 * - no GA4 events or cookieless pings are sent
 *
 * On Accept: the tag loads, G-NP4Y2XRK9Q initializes with analytics_storage
 * granted, and manual SPA page-view tracking starts. On Decline: nothing is
 * ever loaded. Advertising storage stays denied at all times.
 *
 * Withdrawal: turning Analytics off in Cookie Settings stops all future events
 * immediately (the in-page tag stays inert until the next page load, where it
 * is not loaded at all).
 *
 * No personal data (email, name, user id, tokens, free-form text such as raw
 * search terms) is ever sent.
 */

export const GA_MEASUREMENT_ID = "G-NP4Y2XRK9Q";
export const CONSENT_STORAGE_KEY = "db_cookie_consent";
/** Legacy key from the first consent implementation ("accepted" | "declined"). */
const LEGACY_CONSENT_KEY = "db_analytics_consent";
export const CONSENT_VERSION = "1";

export type ConsentRecord = {
  necessary: true;
  analytics: boolean;
  version: string;
};

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

/** The stored decision, or null when the visitor has not decided (yet). */
export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
      if (typeof parsed?.analytics === "boolean" && parsed.version === CONSENT_VERSION) {
        return { necessary: true, analytics: parsed.analytics, version: CONSENT_VERSION };
      }
      return null;
    }
    const legacy = window.localStorage.getItem(LEGACY_CONSENT_KEY);
    if (legacy === "accepted" || legacy === "declined") {
      const migrated: ConsentRecord = {
        necessary: true,
        analytics: legacy === "accepted",
        version: CONSENT_VERSION,
      };
      writeConsent(migrated);
      window.localStorage.removeItem(LEGACY_CONSENT_KEY);
      return migrated;
    }
    return null;
  } catch {
    return null;
  }
}

function writeConsent(record: ConsentRecord) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* storage unavailable: the choice simply isn't remembered */
  }
}

// Must push the real `arguments` object: gtag.js ignores plain arrays, which
// silently drops every command (no config, no page_view, no network hit).
function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

let loaded = false;
/** Runtime switch: false stops every event even if the tag was loaded earlier. */
let analyticsAllowed = false;

/** True only when the Google tag is loaded AND analytics consent is active. */
export function analyticsLoaded(): boolean {
  return loaded && analyticsAllowed && typeof window.gtag === "function";
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
 * Boots analytics on page load ONLY when analytics consent was given before.
 * Otherwise nothing loads: basic consent behaviour, zero pre-consent pings.
 */
export function initAnalytics() {
  if (!analyticsEnabled()) return;
  const consent = readConsent();
  if (consent?.analytics) {
    analyticsAllowed = true;
    loadAnalytics();
  }
}

/** Records the choice; analytics on loads the tag, off stops all tracking. */
export function applyConsent(analytics: boolean) {
  const record: ConsentRecord = { necessary: true, analytics, version: CONSENT_VERSION };
  writeConsent(record);
  if (!analyticsEnabled()) return;
  analyticsAllowed = analytics;
  if (analytics) {
    loadAnalytics();
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
  } else if (typeof window.gtag === "function") {
    window.gtag("consent", "update", { analytics_storage: "denied" });
  }
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
