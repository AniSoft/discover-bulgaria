import { z } from "zod";
import { PLACE_CATEGORIES, PLACE_COSTS, PLACE_DIFFICULTIES } from "@/lib/places.types";

export const SUITABLE_FOR_OPTIONS = [
  "Couples",
  "Families",
  "Solo Travelers",
  "Friends",
  "Photography",
  "Adventure",
  "Relax",
] as const;

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
    .replace(/^-|-$/g, "");
}

export const placeSubmissionSchema = z.object({
  title: z.string().trim().min(3, "Please enter a place name").max(120, "Keep this under 120 characters"),
  short_description: z
    .string()
    .trim()
    .min(10, "Please add a short summary")
    .max(200, "Keep this under 200 characters"),
  description: z
    .string()
    .trim()
    .min(30, "Please describe the place in a bit more detail")
    .max(5000, "Keep this under 5000 characters"),
  region: z.string().trim().min(2, "Please enter a region").max(100),
  city: z.string().trim().max(100).optional().default(""),
  location_text: z.string().trim().max(500).optional().default(""),
  category: z.enum(PLACE_CATEGORIES, { message: "Please choose a category" }),
  suitable_for: z.array(z.enum(SUITABLE_FOR_OPTIONS)).max(7).default([]),
  best_time: z.string().trim().max(100).optional().default(""),
  duration: z.string().trim().max(100).optional().default(""),
  approximate_cost: z.union([z.enum(PLACE_COSTS), z.literal("")]).optional().default(""),
  difficulty: z.union([z.enum(PLACE_DIFFICULTIES), z.literal("")]).optional().default(""),
  why_visit: z.string().trim().max(2000).optional().default(""),
  local_secret: z.string().trim().max(2000).optional().default(""),
  // Optional Bulgarian translations. Empty means "fall back to English".
  title_bg: z.string().trim().max(120).optional().default(""),
  short_description_bg: z.string().trim().max(300).optional().default(""),
  description_bg: z.string().trim().max(5000).optional().default(""),
  why_visit_bg: z.string().trim().max(2000).optional().default(""),
  city_bg: z.string().trim().max(100).optional().default(""),
  best_time_bg: z.string().trim().max(100).optional().default(""),
  duration_bg: z.string().trim().max(100).optional().default(""),
  location_text_bg: z.string().trim().max(500).optional().default(""),
  local_secret_bg: z.string().trim().max(2000).optional().default(""),
});

export type PlaceSubmission = z.input<typeof placeSubmissionSchema>;
