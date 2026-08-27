import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type PlaceRow = Tables<"places">;
export type PlaceInsert = TablesInsert<"places">;
export type PlaceUpdate = TablesUpdate<"places">;

export const PLACE_STATUSES = ["for_review", "published", "rejected"] as const;
export type PlaceStatus = (typeof PLACE_STATUSES)[number];

export const PLACE_CATEGORIES = [
  "Hidden Gems",
  "Nature",
  "Mountains",
  "Sea",
  "History & Culture",
  "Best Views",
  "Photo Spots",
  "Food & Wine",
] as const;
export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export const PLACE_COSTS = ["Free", "€", "€€", "€€€"] as const;
export type PlaceCost = (typeof PLACE_COSTS)[number];

export const PLACE_DIFFICULTIES = ["Easy", "Moderate", "Challenging"] as const;
export type PlaceDifficulty = (typeof PLACE_DIFFICULTIES)[number];
