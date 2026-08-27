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

// Used when a component renders outside the provider (e.g. the root error
// boundary): English, no switching, never throws.
const fallbackValue: LocaleContextValue = {
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key, vars) => interpolate(messages[DEFAULT_LOCALE][key] ?? key, vars),
};

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
  return useContext(LocaleContext) ?? fallbackValue;
}

/** Shorthand for components that only need the translate function. */
export function useT(): Translate {
  return useLocale().t;
}

function labelFactory(prefix: string, t: Translate) {
  return (value: string) => {
    const key = `${prefix}.${value}` as MessageKey;
    const label = t(key);
    // Unknown stored values fall back to the raw database value.
    return label === key ? value : label;
  };
}

/** Display label for a stored (English) category value. */
export function useCategoryLabel() {
  const { t } = useLocale();
  return labelFactory("category", t);
}

/** Display label for a stored (English) "suitable for" value. */
export function useSuitableLabel() {
  const { t } = useLocale();
  return labelFactory("suitable", t);
}

/** Display label for a stored (English) difficulty value. */
export function useDifficultyLabel() {
  const { t } = useLocale();
  return labelFactory("difficulty", t);
}

/** Display label for a stored place status value. */
export function useStatusLabel() {
  const { t } = useLocale();
  return (status: string, plural = false) =>
    labelFactory(plural ? "statusPlural" : "status", t)(status);
}
