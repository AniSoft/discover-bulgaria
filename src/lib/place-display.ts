import tyulenovo from "@/assets/place-tyulenovo.jpg";
import kovachevitsa from "@/assets/place-kovachevitsa.jpg";
import devilsBridge from "@/assets/place-devils-bridge.jpg";
import belogradchik from "@/assets/place-belogradchik.jpg";
import shirokaLaka from "@/assets/place-shiroka-laka.jpg";
import beglikTash from "@/assets/place-beglik-tash.jpg";
import neutralPlaceholder from "@/assets/placeholder-neutral.svg";
import hiddenGems from "@/assets/cat-hidden-gems.jpg";
import nature from "@/assets/cat-nature.jpg";
import mountains from "@/assets/cat-mountains.jpg";
import sea from "@/assets/cat-sea.jpg";
import culture from "@/assets/cat-culture.jpg";
import views from "@/assets/cat-views.jpg";
import photo from "@/assets/cat-photo.jpg";
import food from "@/assets/cat-food.jpg";
import type { PublicPlace } from "@/lib/places.functions";

// Editorial fallback imagery for places without uploaded photos.
const bySlug: Record<string, string> = {
  "tyulenovo-cliffs": tyulenovo,
  kovachevitsa,
  "devils-bridge": devilsBridge,
  "belogradchik-rocks": belogradchik,
  "shiroka-laka": shirokaLaka,
  "beglik-tash": beglikTash,
  // No verified Prohodna Cave photo exists yet — use the neutral placeholder
  // instead of the Nature category image (a waterfall), which is unrelated.
  "prohodna-cave": neutralPlaceholder,
  // No verified Krushuna Waterfalls photo — the Nature category image shows an
  // unrelated waterfall, which would read as a false depiction of the site.
  "krushuna-waterfalls": neutralPlaceholder,
};

const byCategory: Record<string, string> = {
  "Hidden Gems": hiddenGems,
  Nature: nature,
  Mountains: mountains,
  Sea: sea,
  "History & Culture": culture,
  "Best Views": views,
  "Photo Spots": photo,
  "Food & Wine": food,
};

export function placeImage(place: Pick<PublicPlace, "slug" | "category">) {
  return bySlug[place.slug] ?? byCategory[place.category] ?? nature;
}

/** Uploaded cover photo when the place has one, otherwise the editorial fallback. */
export function placeCover(
  place: Pick<PublicPlace, "slug" | "category"> & { cover_url?: string | null },
) {
  return place.cover_url ?? placeImage(place);
}

/**
 * Meaningful, non keyword-stuffed alt text: the (already localised) place
 * title plus where it is. Example: "Prohodna Cave, Karlukovo, Bulgaria".
 */
export function placeImageAlt(
  place: Pick<PublicPlace, "title" | "category"> & Partial<Pick<PublicPlace, "region" | "city">>,
) {
  const where = [place.city, place.region].filter(Boolean).join(", ");
  return where ? `${place.title}, ${where}, Bulgaria` : `${place.title}, Bulgaria`;
}

export function placePractical(place: Pick<PublicPlace, "approximate_cost" | "duration">) {
  return [place.approximate_cost, place.duration].filter(Boolean).join(" · ");
}

export function placeLocation(place: Pick<PublicPlace, "region" | "city">) {
  return place.city ? `${place.city}, ${place.region}` : place.region;
}
