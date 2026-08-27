import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Pencil, Trash2, Eye } from "lucide-react";
import { buttonClasses, Button } from "@/components/AppButton";
import { placeLocation } from "@/lib/place-display";
import type { OwnedPlace } from "@/lib/my-places.functions";
import { cn } from "@/lib/utils";

export const STATUS_META: Record<
  string,
  { label: string; badge: string; note?: string }
> = {
  for_review: {
    label: "FOR REVIEW",
    badge: "border-amber-500/35 bg-amber-500/12 text-amber-700",
    note: "Waiting for administrator review.",
  },
  published: {
    label: "PUBLISHED",
    badge: "border-primary/30 bg-primary/10 text-primary",
  },
  rejected: {
    label: "REJECTED",
    badge: "border-red-500/30 bg-red-500/10 text-red-700",
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
    <article className="flex flex-col rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-xs font-medium text-accent">{place.category}</span>
          <h3 className="mt-1.5 text-2xl leading-snug text-foreground">{place.title}</h3>
        </div>
        <StatusBadge status={place.status} />
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-4" aria-hidden="true" />
        {placeLocation(place)}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {place.short_description}
      </p>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="size-3.5" aria-hidden="true" />
        Added {formatDate(place.created_at)}
      </p>

      {meta?.note ? <p className="mt-2 text-xs text-amber-700">{meta.note}</p> : null}

      <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
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
          variant="ghost"
          size="sm"
          className="text-red-700 hover:bg-red-500/10"
          onClick={() => onDelete(place)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </Button>
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
