import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ImageIcon, Star, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/AppButton";
import { uploadPlacePhoto } from "@/lib/place-photos.client";
import {
  deletePlacePhoto,
  reorderPlacePhotos,
  setPlaceCoverPhoto,
} from "@/lib/place-photos.functions";
import { placePhotosKey, placePhotosQueryOptions } from "@/lib/place-photos.queries";
import {
  MAX_PLACE_PHOTOS,
  PHOTO_ACCEPT_ATTR,
  PHOTO_LIMIT_MESSAGE,
  PHOTO_UPLOAD_ERROR,
  validatePhotoFile,
  type PlacePhoto,
} from "@/lib/place-photos.shared";
import { cn } from "@/lib/utils";

/** Photo management for a place that already exists (Edit Place, admins included). */
export function PhotoManager({ placeId }: { placeId: string }) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const photosQuery = useQuery(placePhotosQueryOptions(placeId));
  const photos = photosQuery.data ?? [];

  const refresh = () => queryClient.invalidateQueries({ queryKey: placePhotosKey(placeId) });

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    setMessage(null);

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

    setBusy(true);
    let uploaded = 0;
    try {
      for (const file of selected) {
        await uploadPlacePhoto(placeId, file);
        uploaded += 1;
      }
      setMessage(uploaded === 1 ? "Photo uploaded." : `${uploaded} photos uploaded.`);
    } catch (uploadError) {
      console.error("[photos] upload failed", uploadError);
      setError(
        uploadError instanceof Error && uploadError.message.startsWith("Please")
          ? uploadError.message
          : PHOTO_UPLOAD_ERROR,
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
      await refresh();
    }
  };

  const removeMutation = useMutation({
    mutationFn: (id: string) => deletePlacePhoto({ data: { id } }),
    onSuccess: async () => {
      setError(null);
      setMessage("Photo deleted.");
      await refresh();
    },
    onError: () => setError("We couldn't delete this photo. Please try again."),
  });

  const coverMutation = useMutation({
    mutationFn: (id: string) => setPlaceCoverPhoto({ data: { id } }),
    onSuccess: async () => {
      setError(null);
      setMessage("Cover photo updated.");
      await refresh();
    },
    onError: () => setError("We couldn't update the cover photo. Please try again."),
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => reorderPlacePhotos({ data: { place_id: placeId, ids } }),
    onSuccess: async () => {
      setError(null);
      setMessage("Photo order saved.");
      await refresh();
    },
    onError: () => setError("We couldn't save the new order. Please try again."),
  });

  const move = (index: number, direction: -1 | 1) => {
    const next = [...photos];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    queryClient.setQueryData(placePhotosKey(placeId), next);
    reorderMutation.mutate(next.map((photo) => photo.id));
  };

  const pending =
    busy || removeMutation.isPending || coverMutation.isPending || reorderMutation.isPending;
  const full = photos.length >= MAX_PLACE_PHOTOS;

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Section F</p>
      <h2 className="mt-2 text-2xl leading-snug text-foreground">Photos</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        JPG, PNG or WebP up to 1 MB each. Up to {MAX_PLACE_PHOTOS} photos. The first photo becomes
        the cover unless you choose another one.
      </p>

      {photosQuery.isPending ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-4/3 animate-pulse rounded-[var(--radius-card)] bg-muted" />
          ))}
        </div>
      ) : photos.length ? (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <PhotoTile
              key={photo.id}
              photo={photo}
              index={index}
              total={photos.length}
              disabled={pending}
              onCover={() => coverMutation.mutate(photo.id)}
              onDelete={() => removeMutation.mutate(photo.id)}
              onMove={(direction) => move(index, direction)}
            />
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-border p-8 text-center">
          <ImageIcon className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">No photos yet.</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={PHOTO_ACCEPT_ATTR}
        className="sr-only"
        onChange={(event) => void handleFiles(event.target.files)}
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={pending || full}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" aria-hidden="true" />
          {busy ? "Uploading..." : "Upload photos"}
        </Button>
        <p className="text-sm text-muted-foreground">
          {photos.length} of {MAX_PLACE_PHOTOS} photos
          {full ? ` · ${PHOTO_LIMIT_MESSAGE}` : ""}
        </p>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-accent">
          {error}
        </p>
      ) : message ? (
        <p className="mt-4 text-sm text-primary">{message}</p>
      ) : null}
    </section>
  );
}

function PhotoTile({
  photo,
  index,
  total,
  disabled,
  onCover,
  onDelete,
  onMove,
}: {
  photo: PlacePhoto;
  index: number;
  total: number;
  disabled: boolean;
  onCover: () => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <li className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-secondary">
      <div className="relative aspect-4/3">
        {photo.url ? (
          <img
            src={photo.url}
            alt={`Place photo ${index + 1}`}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            <ImageIcon className="size-6" aria-hidden="true" />
          </div>
        )}
        {photo.is_cover ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.08em] text-primary">
            <Star className="size-3" aria-hidden="true" />
            COVER
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-1 p-2">
        <IconAction
          label="Move photo earlier"
          disabled={disabled || index === 0}
          onClick={() => onMove(-1)}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </IconAction>
        <IconAction
          label="Move photo later"
          disabled={disabled || index === total - 1}
          onClick={() => onMove(1)}
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </IconAction>
        <IconAction
          label="Make cover photo"
          disabled={disabled || photo.is_cover}
          onClick={onCover}
        >
          <Star className="size-4" aria-hidden="true" />
        </IconAction>
        <IconAction
          label="Delete photo"
          disabled={disabled}
          onClick={onDelete}
          className="ml-auto text-red-700 hover:bg-red-500/10"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </IconAction>
      </div>
    </li>
  );
}

function IconAction({
  label,
  disabled,
  onClick,
  className,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-full text-foreground transition-colors duration-250 hover:bg-secondary disabled:opacity-35",
        className,
      )}
    >
      {children}
    </button>
  );
}
