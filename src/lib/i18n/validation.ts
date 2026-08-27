import { useLocale, type MessageKey } from "@/lib/i18n";
import {
  PHOTO_CONTENT_MESSAGE,
  PHOTO_FILE_MESSAGE,
  PHOTO_LIMIT_MESSAGE,
  PHOTO_UPLOAD_ERROR,
  MAX_PLACE_PHOTOS,
} from "@/lib/place-photos.shared";

/**
 * Zod schemas and shared photo helpers produce English messages so they can run
 * on the server too. This maps those exact strings onto translation keys for
 * display; anything unmapped falls through untouched.
 */
const messageKeys: Record<string, MessageKey> = {
  "Please enter a place name": "form.err.titleMin",
  "Keep this under 120 characters": "form.err.titleMax",
  "Please add a short summary": "form.err.shortDescMin",
  "Keep this under 200 characters": "form.err.shortDescMax",
  "Please describe the place in a bit more detail": "form.err.descriptionMin",
  "Keep this under 5000 characters": "form.err.descriptionMax",
  "Please enter a region": "form.err.regionMin",
  "Please choose a category": "form.err.categoryRequired",
  [PHOTO_FILE_MESSAGE]: "photos.fileMessage",
  [PHOTO_CONTENT_MESSAGE]: "photos.contentMessage",
  [PHOTO_LIMIT_MESSAGE]: "photos.limitMessage",
  [PHOTO_UPLOAD_ERROR]: "photos.uploadError",
};

export function useMessageTranslator() {
  const { t } = useLocale();
  return (message: string | null | undefined) => {
    if (!message) return message ?? "";
    const key = messageKeys[message];
    return key ? t(key, { max: MAX_PLACE_PHOTOS }) : message;
  };
}
