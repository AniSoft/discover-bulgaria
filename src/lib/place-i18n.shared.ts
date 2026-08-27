/**
 * Bulgarian translations of place content live in nullable `*_bg` columns on
 * the same row — never in duplicate rows. English stays the base content and
 * is used whenever a Bulgarian value is missing.
 */

export type PlaceBgFields = {
  title_bg?: string | null;
  short_description_bg?: string | null;
  description_bg?: string | null;
  why_visit_bg?: string | null;
  city_bg?: string | null;
  best_time_bg?: string | null;
  duration_bg?: string | null;
  location_text_bg?: string | null;
  local_secret_bg?: string | null;
};

/** Translated columns needed by cards / list views. */
export const LIST_BG_COLUMNS = "title_bg, short_description_bg, city_bg, duration_bg";

/** Translated columns beyond the list set, for detail views. */
export const EXTRA_DETAIL_BG_COLUMNS =
  "description_bg, why_visit_bg, best_time_bg, location_text_bg, local_secret_bg";

/** Translated columns needed by the full place details view. */
export const DETAIL_BG_COLUMNS = `${LIST_BG_COLUMNS}, ${EXTRA_DETAIL_BG_COLUMNS}`;

/** All translated columns, for the edit form. */
export const ALL_BG_COLUMNS = DETAIL_BG_COLUMNS;

const FIELD_PAIRS = [
  ["title", "title_bg"],
  ["short_description", "short_description_bg"],
  ["description", "description_bg"],
  ["why_visit", "why_visit_bg"],
  ["city", "city_bg"],
  ["best_time", "best_time_bg"],
  ["duration", "duration_bg"],
  ["location_text", "location_text_bg"],
  ["local_secret", "local_secret_bg"],
] as const;

/** Stored display values that have a translated label (values never change). */
const LABELLED_FIELDS = [
  ["region", "region"],
  ["approximate_cost", "cost"],
  ["difficulty", "difficulty"],
] as const;

/**
 * Returns a copy of the place with display fields resolved for the locale:
 * Bulgarian text when present, otherwise the original English content.
 * Stored values (slug, id, category, suitable_for, status) are never changed.
 */
export function localizePlaceForDisplay<T extends Record<string, unknown>>(
  place: T,
  locale: string,
  label: (prefix: string, value: string) => string,
): T {
  const out: Record<string, unknown> = { ...place };

  if (locale === "bg") {
    for (const [base, bg] of FIELD_PAIRS) {
      if (!(base in place)) continue;
      const value = place[bg];
      if (typeof value === "string" && value.trim()) out[base] = value;
    }
  }

  for (const [field, prefix] of LABELLED_FIELDS) {
    const value = place[field];
    if (typeof value === "string" && value.trim()) out[field] = label(prefix, value);
  }

  return out as T;
}
