import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, persistLocale, type Locale } from "./locale";
import { messages, type MessageKey } from "./messages";

export type { Locale } from "./locale";
export type { MessageKey } from "./messages";
export { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, readLocale, isLocale } from "./locale";

export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next);
    setLocaleState(next);
    if (typeof document !== "undefined") document.documentElement.lang = next;
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const dictionary = messages[locale] ?? messages[DEFAULT_LOCALE];
    const t: Translate = (key, vars) =>
      interpolate(dictionary[key] ?? messages[DEFAULT_LOCALE][key] ?? key, vars);
    return { locale, setLocale, t };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}

/** Shorthand for components that only need the translate function. */
export function useT(): Translate {
  return useLocale().t;
}

/** Display label for a stored (English) category value. */
export function useCategoryLabel() {
  const { t } = useLocale();
  return (category: string) => t(`category.${category}` as MessageKey);
}

/** Display label for a stored (English) "suitable for" value. */
export function useSuitableLabel() {
  const { t } = useLocale();
  return (value: string) => t(`suitable.${value}` as MessageKey);
}

/** Display label for a stored place status value. */
export function useStatusLabel() {
  const { t } = useLocale();
  return (status: string, plural = false) =>
    t(`${plural ? "statusPlural" : "status"}.${status}` as MessageKey);
}
