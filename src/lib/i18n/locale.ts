import { createIsomorphicFn } from "@tanstack/react-start";

export const LOCALES = ["en", "bg"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "db_locale";
export const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

function fromDocumentCookie(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.split("; ").find((part) => part.startsWith(`${LOCALE_COOKIE}=`));
  const value = match?.slice(LOCALE_COOKIE.length + 1);
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Reads the locale cookie on the server (during SSR) and in the browser, so the
 * markup rendered on both sides matches and hydration stays clean.
 */
export const readLocale = createIsomorphicFn()
  .server((): Locale => {
    // Imported lazily so the browser bundle never pulls in server-only code.
    const { getCookie } = require("@tanstack/react-start/server") as {
      getCookie: (name: string) => string | undefined;
    };
    const value = getCookie(LOCALE_COOKIE);
    return isLocale(value) ? value : DEFAULT_LOCALE;
  })
  .client(fromDocumentCookie);

export function persistLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_MAX_AGE}; samesite=lax`;
}
