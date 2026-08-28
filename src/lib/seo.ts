/**
 * Centralised SEO helpers. Every route builds its metadata through these so
 * titles, descriptions, canonicals and social tags stay consistent and
 * localisation logic lives in exactly one place.
 */
import type { Locale } from "@/lib/i18n/locale";

/** Canonical production origin. Never the Netlify subdomain. */
export const SITE_URL = "https://discoverbulgaria.net";
export const SITE_NAME = "Discover Bulgaria";
export const SOCIAL_FALLBACK_IMAGE = `${SITE_URL}/social/discover-bulgaria.jpg`;

/** Absolute canonical URL for a site-relative path (query strings stripped). */
export function canonicalUrl(path: string): string {
  const clean = path.split("?")[0]!.split("#")[0]!;
  const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
  return `${SITE_URL}${withSlash === "/" ? "/" : withSlash.replace(/\/+$/, "")}`;
}

export function truncate(text: string, max = 165): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const cut = normalized.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:·-]$/, "")}…`;
}

/** Bulgarian value when the locale is bg and a translation exists. */
export function localized(
  locale: Locale,
  base: string | null | undefined,
  bg: string | null | undefined,
): string {
  if (locale === "bg" && typeof bg === "string" && bg.trim()) return bg.trim();
  return (base ?? "").trim();
}

type MetaEntry = Record<string, string>;

export type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
  /** Robots directive when the page should not be indexed. */
  robots?: string;
};

/** Meta + canonical link pair for a leaf route. */
export function seo({ title, description, path, image, type = "website", noindex, robots }: SeoInput): {
  meta: MetaEntry[];
  links: { rel: string; href: string }[];
} {
  const url = canonicalUrl(path);
  const socialImage = image || SOCIAL_FALLBACK_IMAGE;
  const meta: MetaEntry[] = [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: socialImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: socialImage },
  ];
  if (noindex) meta.push({ name: "robots", content: robots ?? "noindex, nofollow" });
  return { meta, links: [{ rel: "canonical", href: url }] };
}

/** Metadata for private / authenticated screens: never indexed, no canonical. */
export function privateSeo(title: string, description = "Private area of Discover Bulgaria.") {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
    ],
  };
}

export const HOME_SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Discover Bulgaria | Places, Nature & Hidden Destinations",
    description:
      "Discover remarkable places across Bulgaria, from hidden villages and ancient landmarks to mountains, caves, waterfalls and the Black Sea coast.",
  },
  bg: {
    title: "Discover Bulgaria | Места, природа и скрити забележителности",
    description:
      "Открий забележителни места из България, от скрити села и древни обекти до планини, пещери, водопади и дивото Черноморие.",
  },
};

export const CATEGORIES_SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Categories | Discover Bulgaria",
    description:
      "Browse Bulgarian destinations by category: hidden gems, nature, mountains, the Black Sea coast, history and culture, best views, photo spots, food and wine.",
  },
  bg: {
    title: "Категории | Discover Bulgaria",
    description:
      "Разгледай места в България по категории: скрити съкровища, природа, планини, море, история и култура, гледки, места за снимки, храна и вино.",
  },
};

/** JSON-LD script entry helper for route head(). */
export function jsonLd(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}
