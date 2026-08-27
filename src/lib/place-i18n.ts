import { useMemo } from "react";
import { useLocale, type MessageKey } from "@/lib/i18n";
import { localizePlaceForDisplay } from "@/lib/place-i18n.shared";

export type { PlaceBgFields } from "@/lib/place-i18n.shared";

/**
 * Central place-content localizer. Components call this instead of scattering
 * locale conditionals; missing Bulgarian text falls back to English.
 */
export function useLocalizedPlace<T extends Record<string, unknown>>(place: T): T;
export function useLocalizedPlace<T extends Record<string, unknown>>(
  place: T | null | undefined,
): T | null;
export function useLocalizedPlace<T extends Record<string, unknown>>(
  place: T | null | undefined,
): T | null {
  const { locale, t } = useLocale();
  return useMemo(() => {
    if (!place) return null;
    return localizePlaceForDisplay(place, locale, (prefix, value) => {
      const key = `${prefix}.${value}` as MessageKey;
      const label = t(key);
      return label === key ? value : label;
    });
  }, [place, locale, t]);
}

/** List variant of {@link useLocalizedPlace}. */
export function useLocalizedPlaces<T extends Record<string, unknown>>(
  places: readonly T[] | undefined,
): T[] {
  const { locale, t } = useLocale();
  return useMemo(() => {
    if (!places) return [];
    return places.map((place) =>
      localizePlaceForDisplay(place, locale, (prefix, value) => {
        const key = `${prefix}.${value}` as MessageKey;
        const label = t(key);
        return label === key ? value : label;
      }),
    );
  }, [places, locale, t]);
}
