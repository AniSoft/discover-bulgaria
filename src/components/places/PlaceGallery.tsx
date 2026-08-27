import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { PlacePhoto } from "@/lib/place-photos.shared";

/** Editorial hero + gallery for the place details page. */
export function PlaceGallery({
  photos,
  title,
  fallbackSrc,
  fallbackAlt,
}: {
  photos: PlacePhoto[];
  title: string;
  fallbackSrc: string;
  fallbackAlt: string;
}) {
  const usable = photos.filter((photo) => photo.url);
  const cover = usable.find((photo) => photo.is_cover) ?? usable[0];
  const rest = usable.filter((photo) => photo.id !== cover?.id);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-border bg-secondary">
        <div className="relative aspect-21/9 max-h-[520px] w-full">
          <img
            src={cover?.url ?? fallbackSrc}
            alt={cover ? `${title} — cover photo` : fallbackAlt}
            className="size-full object-cover"
            width={1600}
            height={686}
          />
        </div>
      </div>

      {rest.length ? (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rest.map((photo, index) => (
            <li key={photo.id}>
              <button
                type="button"
                onClick={() => setLightbox(photo.url)}
                className="group block w-full overflow-hidden rounded-[var(--radius-card)] border border-border bg-secondary"
              >
                <span className="relative block aspect-4/3">
                  <img
                    src={photo.url!}
                    alt={`${title} — photo ${index + 2}`}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="hover-zoom-img size-full object-cover"
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo`}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/85 p-6"
        >
          <img
            src={lightbox}
            alt={`${title} — enlarged photo`}
            className="max-h-[85vh] max-w-full rounded-[var(--radius-card)] object-contain"
          />
          <button
            type="button"
            aria-label="Close photo"
            onClick={() => setLightbox(null)}
            className="absolute right-6 top-6 grid size-10 place-items-center rounded-full bg-card text-foreground"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </>
  );
}
