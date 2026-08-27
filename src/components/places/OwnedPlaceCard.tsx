import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Pencil, Trash2, Eye } from "lucide-react";
import { buttonClasses, Button } from "@/components/AppButton";
import { placeCover, placeImageAlt, placeLocation } from "@/lib/place-display";
import type { OwnedPlace } from "@/lib/my-places.functions";
import { cn } from "@/lib/utils";

export const STATUS_META: Record<
  string,
  { label: string; badge: string; note?: string }
> = {
  for_review: {
    label: "FOR REVIEW",
    badge: "border-warning/40 bg-warning/12 text-warning",
    note: "Waiting for administrator review.",
  },
  published: {
    label: "PUBLISHED",
    badge: "border-success/30 bg-success/10 text-success",
  },
  rejected: {
    label: "REJECTED",
    badge: "border-destructive/30 bg-destructive/10 text-destructive",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? {
    label: status.toUpperCase(),
    badge: "border-border bg-secondary text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.12em]",
        meta.badge,
      )}
    >
      {meta.label}
    </span>
  );
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function OwnedPlaceCard({
  place,
  onDelete,
}: {
  place: OwnedPlace;
  onDelete: (place: OwnedPlace) => void;
}) {
  const meta = STATUS_META[place.status];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-card transition-shadow duration-250 hover:shadow-lift">
      <div className="aspect-21/9 w-full overflow-hidden bg-secondary">
        <img
          src={placeCover(place)}
          alt={placeImageAlt(place)}
          loading="lazy"
          width={1024}
          height={439}
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-xs font-medium text-accent">{place.category}</span>
          <h3 className="mt-1.5 line-clamp-2 text-2xl leading-snug text-foreground">{place.title}</h3>
        </div>
        <StatusBadge status={place.status} />
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-4" aria-hidden="true" />
        {placeLocation(place)}
      </p>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {place.short_description}
      </p>

      <p className="mt-4 mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="size-3.5" aria-hidden="true" />
        Added {formatDate(place.created_at)}
      </p>

      {meta?.note ? <p className="mt-2 text-xs text-warning">{meta.note}</p> : null}

      <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-5">
        <Link
          to="/places/$slug"
          params={{ slug: place.slug }}
          className={buttonClasses("outline", "sm")}
        >
          <Eye className="size-4" aria-hidden="true" />
          View
        </Link>
        <Link
          to="/places/$id/edit"
          params={{ id: place.id }}
          className={buttonClasses("outline", "sm")}
        >
          <Pencil className="size-4" aria-hidden="true" />
          Edit
        </Link>
        <Button
          variant="destructive-ghost"
          size="sm"
          onClick={() => onDelete(place)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </Button>
      </div>
      </div>
    </article>
  );
}

export function OwnedPlaceCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card">
      <div className="h-3 w-20 rounded bg-muted" />
      <div className="mt-3 h-6 w-2/3 rounded bg-muted" />
      <div className="mt-4 h-3 w-1/3 rounded bg-muted" />
      <div className="mt-4 h-3 w-full rounded bg-muted" />
      <div className="mt-2 h-3 w-5/6 rounded bg-muted" />
      <div className="mt-6 h-9 w-40 rounded bg-muted" />
    </div>
  );
}
