import { supabase } from "@/integrations/supabase/client";
import { registerPlacePhoto } from "@/lib/place-photos.functions";
import {
  PLACE_IMAGES_BUCKET,
  PHOTO_UPLOAD_ERROR,
  buildPhotoPath,
  validatePhotoFileContent,
  type PlacePhoto,
} from "@/lib/place-photos.shared";

/**
 * Uploads one photo with the signed-in user's session (storage policies keep
 * users inside their own places' folders), then records it in the database.
 * The file's name, declared type, size and actual bytes are all checked first,
 * and the bucket's own allow-list is the final guard.
 */
export async function uploadPlacePhoto(placeId: string, file: File): Promise<PlacePhoto> {
  const invalid = await validatePhotoFileContent(file);
  if (invalid) throw new Error(invalid);

  const path = buildPhotoPath(placeId, file);
  const { error } = await supabase.storage
    .from(PLACE_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[photos] upload failed", error);
    throw new Error(PHOTO_UPLOAD_ERROR);
  }

  return registerPlacePhoto({ data: { place_id: placeId, storage_path: path } });
}

