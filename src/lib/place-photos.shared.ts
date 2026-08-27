/** Shared photo rules used by both the browser and the server. */

export const PLACE_IMAGES_BUCKET = "place-images";

export const MAX_PLACE_PHOTOS = 8;
export const MAX_PHOTO_BYTES = 1024 * 1024; // 1 MB

export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const PHOTO_ACCEPT_ATTR = "image/jpeg,image/png,image/webp";

export const PHOTO_FILE_MESSAGE = "Please upload a JPG, PNG or WebP image up to 1 MB.";
export const PHOTO_LIMIT_MESSAGE = `Maximum ${MAX_PLACE_PHOTOS} photos per place.`;
export const PHOTO_UPLOAD_ERROR = "We couldn't upload this photo. Please try again.";

export type PlacePhoto = {
  id: string;
  storage_path: string;
  is_cover: boolean;
  sort_order: number;
  url: string | null;
};

/** Returns a friendly message when the file is not an acceptable photo. */
export function validatePhotoFile(file: { type: string; size: number; name: string }) {
  const type = file.type.toLowerCase();
  const extensionOk = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!ACCEPTED_PHOTO_TYPES.includes(type) || !extensionOk) return PHOTO_FILE_MESSAGE;
  if (file.size > MAX_PHOTO_BYTES) return PHOTO_FILE_MESSAGE;
  return null;
}

function photoExtension(file: { type: string; name: string }) {
  const fromName = file.name.toLowerCase().match(/\.(jpe?g|png|webp)$/);
  if (fromName) return fromName[1] === "jpeg" ? "jpg" : fromName[1]!;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

/** Predictable, collision-free object paths: places/{place_id}/{unique}.{ext} */
export function buildPhotoPath(placeId: string, file: { type: string; name: string }) {
  const unique =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `places/${placeId}/${unique}.${photoExtension(file)}`;
}

export function isValidPhotoPath(placeId: string, path: string) {
  return (
    path.startsWith(`places/${placeId}/`) &&
    /^places\/[0-9a-f-]{36}\/[0-9a-zA-Z-]+\.(jpg|jpeg|png|webp)$/.test(path)
  );
}
