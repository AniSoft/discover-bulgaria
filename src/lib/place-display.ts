import tyulenovo from "@/assets/place-tyulenovo.jpg";
import kovachevitsa from "@/assets/place-kovachevitsa.jpg";
import devilsBridge from "@/assets/place-devils-bridge.jpg";
import belogradchik from "@/assets/place-belogradchik.jpg";
import shirokaLaka from "@/assets/place-shiroka-laka.jpg";
import beglikTash from "@/assets/place-beglik-tash.jpg";
import hiddenGems from "@/assets/cat-hidden-gems.jpg";
import nature from "@/assets/cat-nature.jpg";
import mountains from "@/assets/cat-mountains.jpg";
import sea from "@/assets/cat-sea.jpg";
import culture from "@/assets/cat-culture.jpg";
import views from "@/assets/cat-views.jpg";
import photo from "@/assets/cat-photo.jpg";
import food from "@/assets/cat-food.jpg";
import type { PublicPlace } from "@/lib/places.functions";

// Temporary placeholder imagery until photo uploads are implemented.
const bySlug: Record<string, string> = {
  "tyulenovo-cliffs": tyulenovo,
  kovachevitsa,
  "devils-bridge": devilsBridge,
  "belogradchik-rocks": belogradchik,
  "shiroka-laka": shirokaLaka,
  "beglik-tash": beglikTash,
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

export function placeImageAlt(place: Pick<PublicPlace, "title" | "category">) {
  return `${place.title} — ${place.category} in Bulgaria`;
}

export function placePractical(place: Pick<PublicPlace, "approximate_cost" | "duration">) {
  return [place.approximate_cost, place.duration].filter(Boolean).join(" · ");
}

export function placeLocation(place: Pick<PublicPlace, "region" | "city">) {
  return place.city ? `${place.city}, ${place.region}` : place.region;
}
