import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ImageIcon, Star, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/AppButton";
import { uploadPlacePhoto } from "@/lib/place-photos.upload";
import {
  deletePlacePhoto,
  reorderPlacePhotos,
  setPlaceCoverPhoto,
} from "@/lib/place-photos.functions";
import { placePhotosKey, placePhotosQueryOptions } from "@/lib/place-photos.queries";
import {
  MAX_PLACE_PHOTOS,
  PHOTO_ACCEPT_ATTR,
  PHOTO_CONTENT_MESSAGE,
  PHOTO_FILE_MESSAGE,
  PHOTO_LIMIT_MESSAGE,
  PHOTO_UPLOAD_ERROR,
  validatePhotoFiles,
  type PlacePhoto,
} from "@/lib/place-photos.shared";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useMessageTranslator } from "@/lib/i18n/validation";

/** Photo management for a place that already exists (Edit Place, admins included). */
export function PhotoManager({ placeId }: { placeId: string }) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const t = useT();
  const translateMessage = useMessageTranslator();

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

    // Checks the filename, declared type, size and the actual image bytes.
    const invalid = await validatePhotoFiles(selected);
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
      setMessage(
        uploaded === 1 ? t("photos.uploadedOne") : t("photos.uploadedCount", { count: uploaded }),
      );
    } catch (uploadError) {
      console.error("[photos] upload failed", uploadError);
      const known =
        uploadError instanceof Error &&
        (uploadError.message === PHOTO_FILE_MESSAGE ||
          uploadError.message === PHOTO_CONTENT_MESSAGE);
      setError(known ? (uploadError as Error).message : PHOTO_UPLOAD_ERROR);
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
      setMessage(t("photos.deleted"));
      await refresh();
    },
    onError: () => setError(t("photos.deleteError")),
  });

  const coverMutation = useMutation({
    mutationFn: (id: string) => setPlaceCoverPhoto({ data: { id } }),
    onSuccess: async () => {
      setError(null);
      setMessage(t("photos.coverUpdated"));
      await refresh();
    },
    onError: () => setError(t("photos.coverError")),
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => reorderPlacePhotos({ data: { place_id: placeId, ids } }),
    onSuccess: async () => {
      setError(null);
      setMessage(t("photos.orderSaved"));
      await refresh();
    },
    onError: () => setError(t("photos.orderError")),
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
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t("photos.section")}</p>
      <h2 className="mt-2 text-2xl leading-snug text-foreground">{t("photos.title")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("photos.managerDescription", { max: MAX_PLACE_PHOTOS })}
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
              labels={{
                earlier: t("photos.movePhotoEarlier"),
                later: t("photos.movePhotoLater"),
                cover: t("photos.makeCover"),
                delete: t("photos.delete"),
                coverBadge: t("photos.coverBadge"),
                alt: t("photos.altPhoto", { index: index + 1 }),
              }}
            />
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-border p-8 text-center">
          <ImageIcon className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">{t("photos.empty")}</p>
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
          {busy ? t("photos.uploading") : t("photos.upload")}
        </Button>
        <p className="text-sm text-muted-foreground">
          {t("photos.countOf", { count: photos.length, max: MAX_PLACE_PHOTOS })}
          {full ? ` · ${t("photos.limitMessage", { max: MAX_PLACE_PHOTOS })}` : ""}
        </p>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-accent">
          {translateMessage(error)}
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
  labels,
}: {
  photo: PlacePhoto;
  index: number;
  total: number;
  disabled: boolean;
  onCover: () => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
  labels: {
    earlier: string;
    later: string;
    cover: string;
    delete: string;
    coverBadge: string;
    alt: string;
  };
}) {
  return (
    <li className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-secondary">
      <div className="relative aspect-4/3">
        {photo.url ? (
          <img
            src={photo.url}
            alt={labels.alt}
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
            {labels.coverBadge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-1 p-2">
        <IconAction
          label={labels.earlier}
          disabled={disabled || index === 0}
          onClick={() => onMove(-1)}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </IconAction>
        <IconAction
          label={labels.later}
          disabled={disabled || index === total - 1}
          onClick={() => onMove(1)}
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </IconAction>
        <IconAction
          label={labels.cover}
          disabled={disabled || photo.is_cover}
          onClick={onCover}
        >
          <Star className="size-4" aria-hidden="true" />
        </IconAction>
        <IconAction
          label={labels.delete}
          disabled={disabled}
          onClick={onDelete}
          className="ml-auto text-destructive hover:bg-destructive/10"
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
