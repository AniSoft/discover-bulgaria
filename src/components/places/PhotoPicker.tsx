import { useEffect, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/AppButton";
import {
  MAX_PLACE_PHOTOS,
  PHOTO_ACCEPT_ATTR,
  PHOTO_LIMIT_MESSAGE,
  validatePhotoFile,
} from "@/lib/place-photos.shared";

export type PickedPhoto = { id: string; file: File; preview: string };

export function makePickedPhoto(file: File): PickedPhoto {
  return {
    id: `${file.name}-${file.size}-${Math.random().toString(16).slice(2)}`,
    file,
    preview: URL.createObjectURL(file),
  };
}

/**
 * Photo selection before a place exists. Files are kept in memory and uploaded
 * once the place record has been created successfully.
 */
export function PhotoPicker({
  photos,
  onChange,
  disabled,
}: {
  photos: PickedPhoto[];
  onChange: (next: PickedPhoto[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => photos.forEach((photo) => URL.revokeObjectURL(photo.preview)), [photos]);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    const selected = [...files];

    if (photos.length + selected.length > MAX_PLACE_PHOTOS) {
      setError(PHOTO_LIMIT_MESSAGE);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const invalid = selected.map(validatePhotoFile).find(Boolean);
    if (invalid) {
      setError(invalid);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    onChange([...photos, ...selected.map(makePickedPhoto)]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (id: string) => {
    const target = photos.find((photo) => photo.id === id);
    if (target) URL.revokeObjectURL(target.preview);
    onChange(photos.filter((photo) => photo.id !== id));
  };

  const full = photos.length >= MAX_PLACE_PHOTOS;

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Section F</p>
      <h2 className="mt-2 text-2xl leading-snug text-foreground">Photos</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        JPG, PNG or WebP up to 1 MB each. Up to {MAX_PLACE_PHOTOS} photos. Your first photo becomes
        the cover, and you can change it later from My Places.
      </p>

      {photos.length ? (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-secondary"
            >
              <div className="relative aspect-4/3">
                <img
                  src={photo.preview}
                  alt={`Selected photo ${index + 1}`}
                  className="size-full object-cover"
                />
                {index === 0 ? (
                  <span className="absolute left-2 top-2 rounded-full bg-card/95 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.08em] text-primary">
                    COVER
                  </span>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="truncate px-1 text-xs text-muted-foreground">
                  {photo.file.name}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${photo.file.name}`}
                  disabled={disabled}
                  onClick={() => remove(photo.id)}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-red-700 transition-colors duration-250 hover:bg-red-500/10 disabled:opacity-35"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-border p-8 text-center">
          <ImageIcon className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">No photos selected yet.</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={PHOTO_ACCEPT_ATTR}
        className="sr-only"
        onChange={(event) => addFiles(event.target.files)}
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || full}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" aria-hidden="true" />
          Select photos
        </Button>
        <p className="text-sm text-muted-foreground">
          {photos.length} of {MAX_PLACE_PHOTOS} selected{full ? ` · ${PHOTO_LIMIT_MESSAGE}` : ""}
        </p>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-accent">
          {error}
        </p>
      ) : null}
    </section>
  );
}
