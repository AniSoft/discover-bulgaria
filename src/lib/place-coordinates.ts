/**
 * Real, verified coordinates for the production places, keyed by slug.
 * These are presentational only — no database schema is involved.
 */
export type PlaceCoordinates = { lat: number; lng: number };

const coordinates: Record<string, PlaceCoordinates> = {
  "tyulenovo-cliffs": { lat: 43.4989, lng: 28.5786 },
  kovachevitsa: { lat: 41.6392, lng: 23.8181 },
  "devils-bridge": { lat: 41.6203, lng: 25.3086 },
  "belogradchik-rocks": { lat: 43.6244, lng: 22.6786 },
  "shiroka-laka": { lat: 41.7383, lng: 24.5583 },
  "beglik-tash": { lat: 42.3806, lng: 27.7442 },
  "krushuna-waterfalls": { lat: 43.2589, lng: 25.0158 },
  "prohodna-cave": { lat: 43.1497, lng: 24.0783 },
};

export function placeCoordinates(slug: string): PlaceCoordinates | null {
  return coordinates[slug] ?? null;
}

export function formatLat(lat: number) {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
}

export function formatLng(lng: number) {
  return `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
}

export function coordinatePair({ lat, lng }: PlaceCoordinates) {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function googleMapsUrl(coords: PlaceCoordinates | null, query: string) {
  return coords
    ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function directionsUrl(coords: PlaceCoordinates | null, query: string) {
  return coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
