import { useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";
import { buttonClasses } from "@/components/AppButton";
import {
  coordinatePair,
  directionsUrl,
  formatLat,
  formatLng,
  googleMapsUrl,
  placeCoordinates,
  type PlaceCoordinates,
} from "@/lib/place-coordinates";
import { cn } from "@/lib/utils";

function openExternal(url: string) {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
  return Boolean(newWindow);
}

/** Decorative contour motif — never interactive. */
function TopoMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none", className)}
    >
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M-20 210C60 170 110 205 170 175s110-60 190-30" />
        <path d="M-20 232C60 192 112 227 172 197s112-58 192-28" />
        <path d="M-20 254C62 214 114 249 174 219s114-56 194-26" />
        <path d="M-20 130C50 104 96 132 150 112s108-42 180-14" opacity="0.7" />
        <path d="M-20 60C48 40 92 66 146 48" opacity="0.5" />
      </g>
      <g stroke="currentColor" strokeWidth="1">
        <path d="M40 20v18M31 29h18" opacity="0.6" />
      </g>
    </svg>
  );
}

function MapPlaceholder({ title, label }: { title: string; label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-secondary text-center">
      <TopoMotif className="inset-0 h-full w-full text-primary/10" />
      <span className="relative flex size-4 items-center justify-center">
        <span className="absolute size-4 rounded-full border border-accent/50" />
        <span className="size-2 rounded-full bg-accent" />
      </span>
      <p className="relative text-sm text-foreground">{title}</p>
      <p className="relative text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function LeafletMap({
  coords,
  title,
  onError,
  onReady,
}: {
  coords: PlaceCoordinates;
  title: string;
  onError: () => void;
  onReady: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let map: { remove: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const L = (await import("leaflet")).default;
        if (cancelled || !ref.current) return;
        const instance = L.map(ref.current, {
          center: [coords.lat, coords.lng],
          zoom: 13,
          scrollWheelZoom: false,
          attributionControl: true,
        });
        map = instance;
        L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        ).addTo(instance);

        const icon = L.divIcon({
          className: "db-marker",
          html: '<span class="db-marker__ring"></span><span class="db-marker__dot"></span>',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        L.marker([coords.lat, coords.lng], { icon, title, alt: title, keyboard: true }).addTo(
          instance,
        );
        instance.whenReady(() => instance.invalidateSize());
        setTimeout(() => instance.invalidateSize(), 250);
        setReady(true);
        onReady();
      } catch {
        if (!cancelled) onError();
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [coords.lat, coords.lng, title, onError, onReady]);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
        ready ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

export function PlaceMapSection({
  slug,
  title,
  location,
  regionLabel,
}: {
  slug: string;
  title: string;
  location: string;
  regionLabel: string;
}) {
  const t = useT();
  const coords = placeCoordinates(slug);
  const query = `${title}, ${location}, Bulgaria`;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  const copy = async () => {
    if (!coords) return;
    try {
      await navigator.clipboard.writeText(coordinatePair(coords));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — nothing else to do */
    }
  };

  return (
    <section className="relative mt-20 overflow-hidden border-t border-border/70 pt-14">
      <TopoMotif className="-left-24 top-0 h-[520px] w-[720px] text-primary/[0.06]" />

      <div className="relative">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-accent">
          {t("map.eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl leading-tight text-foreground sm:text-4xl">
          {t("map.heading")}
        </h2>
        <p className="mt-3 max-w-xl text-base text-muted-foreground">{t("map.support")}</p>
      </div>

      <div className="relative mt-10 grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:gap-12">
        <div
          ref={containerRef}
          className="relative h-[320px] overflow-hidden rounded-[14px] border border-border bg-secondary sm:h-[360px] lg:aspect-16/10 lg:h-auto"
        >
          {mapReady && !failed ? null : (
            <MapPlaceholder title={title} label={failed ? t("map.error") : t("map.loading")} />
          )}
          {coords && visible && !failed ? (
            <div
              className="absolute inset-0"
              role="region"
              aria-label={t("map.aria", { title })}
            >
              <LeafletMap
                coords={coords}
                title={title}
                onError={() => setFailed(true)}
                onReady={() => setMapReady(true)}
              />
            </div>
          ) : null}
        </div>

        <div className="relative">
          {/* Decorative route line connecting map and metadata (desktop only) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 40"
            className="pointer-events-none absolute -left-12 top-6 hidden h-10 w-24 text-accent/40 lg:block"
          >
            <path
              d="M0 32C30 32 40 8 118 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
          </svg>

          <h3 className="text-2xl leading-snug text-foreground">{title}</h3>

          <dl className="mt-6 space-y-5">
            <div>
              <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-accent">
                {t("map.labelLocation")}
              </dt>
              <dd className="mt-1.5 text-base text-foreground">{location}</dd>
            </div>
            {coords ? (
              <div>
                <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-accent">
                  {t("map.labelCoordinates")}
                </dt>
                <dd className="mt-1.5 font-mono text-sm text-foreground">
                  {formatLat(coords.lat)}
                  <br />
                  {formatLng(coords.lng)}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-accent">
                {t("map.labelRoute")}
              </dt>
              <dd className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!openExternal(directionsUrl(coords, query))) {
                      toast.error(t("map.popupBlocked"));
                    }
                  }}
                  className={buttonClasses("primary", "md", "rounded-[8px]")}
                >
                  <Navigation className="size-4" aria-hidden="true" />
                  {t("map.directions")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!openExternal(googleMapsUrl(coords, query))) {
                      toast.error(t("map.popupBlocked"));
                    }
                  }}
                  className={buttonClasses("outline", "md", "rounded-[8px]")}
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  {t("map.openGoogle")}
                </button>
                {coords ? (
                  <button
                    type="button"
                    onClick={() => void copy()}
                    className={buttonClasses("link", "md", "gap-1.5 text-xs")}
                  >
                    {copied ? (
                      <Check className="size-3.5" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3.5" aria-hidden="true" />
                    )}
                    {copied ? t("map.copied") : t("map.copy")}
                  </button>
                ) : null}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="relative mt-10 text-[0.625rem] uppercase tracking-[0.28em] text-muted-foreground">
        {regionLabel}
      </p>
    </section>
  );
}
