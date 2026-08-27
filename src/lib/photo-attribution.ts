/**
 * Internal attribution record for the production cover photographs.
 *
 * Every cover photo currently stored in the `place-images` bucket comes from
 * Wikimedia Commons. This file preserves the source page, author and license
 * for each one. It is documentation-only (no database schema change) and must
 * be kept in sync when a cover photo is replaced.
 *
 * Discover Bulgaria does not own these photographs.
 */

export type PhotoAttribution = {
  /** Place slug the photo is used as cover for. */
  slug: string;
  /** Wikimedia Commons file page. */
  source: string;
  /** Photographer/author as credited on Commons. */
  author: string;
  /** License as stated on Commons. */
  license: string;
  /** Storage object path inside the `place-images` bucket. */
  storagePath: string;
};

export const PHOTO_ATTRIBUTIONS: PhotoAttribution[] = [
  {
    slug: "tyulenovo-cliffs",
    source: "https://commons.wikimedia.org/wiki/File:Tyulenovo_cliffs_1.jpg",
    author: "Spiritia (Vassia Atanassova)",
    license: "CC BY-SA 4.0",
    storagePath: "places/45df5325-9027-483b-9642-9005d5baec78/tyulenovo-cliffs-cover.webp",
  },
  {
    slug: "kovachevitsa",
    source:
      "https://commons.wikimedia.org/wiki/File:Kovachevica,_Bulgaria_-_general_view.jpg",
    author: "Stanislav Yordanov (User:StanProg)",
    license: "CC BY 3.0",
    storagePath: "places/6c505f31-9530-42c4-98c5-00a32fcd289b/kovachevitsa-cover.webp",
  },
  {
    slug: "devils-bridge",
    source: "https://commons.wikimedia.org/wiki/File:Devils-bridge-Ardino1.jpg",
    author: "Vassia Atanassova – Spiritia",
    license: "Public Domain",
    storagePath: "places/7e75f89c-f350-4530-ba27-a2ee8657f3b4/devils-bridge-cover.webp",
  },
  {
    slug: "belogradchik-rocks",
    source: "https://commons.wikimedia.org/wiki/File:%D0%91%D0%B5%D0%BB%D0%BE%D0%B3%D1%80%D0%B0%D0%B4%D1%87%D0%B8%D1%88%D0%BA%D0%B8_%D1%81%D0%BA%D0%B0%D0%BB%D0%B8.jpg",
    author: "Interact-Bulgaria",
    license: "CC BY-SA 4.0",
    storagePath: "places/54229d14-ef51-4b1e-8d7b-cd7178497b5c/belogradchik-rocks-cover.webp",
  },
  {
    slug: "beglik-tash",
    source: "https://commons.wikimedia.org/wiki/File:Beglik_Tash_001.jpg",
    author: "Vislupus",
    license: "CC BY-SA 4.0",
    storagePath: "places/804fac39-b315-439a-a345-fec30522442a/beglik-tash-cover.webp",
  },
  {
    slug: "krushuna-waterfalls",
    source: "https://commons.wikimedia.org/wiki/File:Krushuna_Falls_1.jpg",
    author: "Elena Tatiana Chis",
    license: "CC BY-SA 4.0",
    storagePath: "places/9bbd5797-ffee-4e58-8fb9-31f10eec7a67/krushuna-waterfalls-cover.webp",
  },
  {
    slug: "prohodna-cave",
    source: "https://commons.wikimedia.org/wiki/File:Prohodna-eyes1.JPG",
    author: "Vassia Atanassova – Spiritia",
    license: "Public Domain",
    storagePath: "places/dcdeb6f5-1f26-411e-97bc-bb9e6b271732/prohodna-cave-cover.webp",
  },
  {
    slug: "shiroka-laka",
    source: "https://commons.wikimedia.org/wiki/File:Shiroka_Laka.jpg",
    author: "Artkostov",
    license: "CC BY-SA 4.0",
    storagePath: "places/eac4acc8-1c74-4ecc-a73b-e660302b1de2/shiroka-laka-cover.webp",
  },
];

export function photoAttributionForSlug(slug: string) {
  return PHOTO_ATTRIBUTIONS.find((entry) => entry.slug === slug) ?? null;
}
