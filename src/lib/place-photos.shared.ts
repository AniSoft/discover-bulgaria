/** Shared photo rules used by both the browser and the server. */

export const PLACE_IMAGES_BUCKET = "place-images";

export const MAX_PLACE_PHOTOS = 8;
export const MAX_PHOTO_BYTES = 1024 * 1024; // 1 MB

export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const PHOTO_ACCEPT_ATTR = "image/jpeg,image/png,image/webp";

export const PHOTO_FILE_MESSAGE = "Please upload a JPG, PNG or WebP image up to 1 MB.";
export const PHOTO_CONTENT_MESSAGE =
  "This file isn't a valid JPG, PNG or WebP image. Please choose a real photo.";
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

/**
 * The real media type of the bytes, read from the file signature. A browser's
 * `File.type` comes from the filename, so a renamed script would pass the
 * checks above; this reads the actual content instead.
 */
export function sniffPhotoMime(bytes: Uint8Array): string | null {
  const at = (i: number) => bytes[i];
  // JPEG: FF D8 FF
  if (bytes.length >= 3 && at(0) === 0xff && at(1) === 0xd8 && at(2) === 0xff) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 8 && png.every((byte, i) => at(i) === byte)) return "image/png";
  // WebP: "RIFF" .... "WEBP"
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...Array.from(bytes.slice(start, end)));
  if (bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

/** Normalizes the declared type so image/jpg and image/jpeg compare equal. */
function normalizeType(type: string) {
  const lower = type.toLowerCase();
  return lower === "image/jpg" ? "image/jpeg" : lower;
}

/**
 * Full check for one file: name, declared type, size and actual file content.
 * Returns a friendly message, or null when the photo is acceptable.
 */
export async function validatePhotoFileContent(file: File): Promise<string | null> {
  const basic = validatePhotoFile(file);
  if (basic) return basic;

  let sniffed: string | null = null;
  try {
    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    sniffed = sniffPhotoMime(header);
  } catch {
    return PHOTO_CONTENT_MESSAGE;
  }

  if (!sniffed) return PHOTO_CONTENT_MESSAGE;
  if (sniffed !== normalizeType(file.type)) return PHOTO_CONTENT_MESSAGE;
  return null;
}

/** Validates a list of files, returning the first problem found. */
export async function validatePhotoFiles(files: File[]): Promise<string | null> {
  for (const file of files) {
    const problem = await validatePhotoFileContent(file);
    if (problem) return problem;
  }
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
