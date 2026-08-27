import { Link } from "@tanstack/react-router";
import { CalendarDays, Check, Eye, MapPin, Pencil, Trash2, X } from "lucide-react";
import { Button, buttonClasses } from "@/components/AppButton";
import { StatusBadge } from "@/components/places/OwnedPlaceCard";
import type { AdminPlace } from "@/lib/admin-places.functions";
import { placeLocation } from "@/lib/place-display";
import { useT } from "@/lib/i18n";
import { useLocalizedPlace } from "@/lib/place-i18n";

export function formatDate(value: string) {
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

export function authorLabel(place: AdminPlace, communityMemberLabel: string) {
  return place.author ?? communityMemberLabel;
}

export function AdminPlaceRow({
  place: source,
  onApprove,
  onReject,
  onDelete,
}: {
  place: AdminPlace;
  onApprove: (place: AdminPlace) => void;
  onReject: (place: AdminPlace) => void;
  onDelete: (place: AdminPlace) => void;
}) {
  const place = useLocalizedPlace(source);
  const t = useT();
  const canApprove = place.status !== "published";
  const canReject = place.status !== "rejected";

  return (
    <article className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-medium text-accent">{place.category}</span>
          <h3 className="mt-1 line-clamp-2 text-xl leading-snug text-foreground">{place.title}</h3>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {placeLocation(place)}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {formatDate(place.created_at)}
            </span>
            <span>
              {t("admin.by", { name: authorLabel(place, t("admin.communityMember")) })}
            </span>
          </p>
        </div>
        <StatusBadge status={place.status} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <Link
          to="/places/$slug"
          params={{ slug: place.slug }}
          className={buttonClasses("outline", "sm")}
        >
          <Eye className="size-4" aria-hidden="true" />
          {t("admin.view")}
        </Link>
        <Link
          to="/places/$id/edit"
          params={{ id: place.id }}
          className={buttonClasses("outline", "sm")}
        >
          <Pencil className="size-4" aria-hidden="true" />
          {t("admin.edit")}
        </Link>
        {canApprove ? (
          <Button variant="primary" size="sm" onClick={() => onApprove(place)}>
            <Check className="size-4" aria-hidden="true" />
            {t("admin.approve")}
          </Button>
        ) : null}
        {canReject ? (
          <Button variant="outline" size="sm" onClick={() => onReject(place)}>
            <X className="size-4" aria-hidden="true" />
            {t("admin.reject")}
          </Button>
        ) : null}
        <Button
          variant="destructive-ghost"
          size="sm"
          onClick={() => onDelete(place)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          {t("admin.delete")}
        </Button>
      </div>
    </article>
  );
}

export function AdminRowSkeleton() {
  return (
    <div className="animate-pulse rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card">
      <div className="h-4 w-24 rounded-full bg-secondary" />
      <div className="mt-3 h-6 w-2/3 rounded-full bg-secondary" />
      <div className="mt-3 h-4 w-1/2 rounded-full bg-secondary" />
      <div className="mt-6 h-9 w-64 max-w-full rounded-full bg-secondary" />
    </div>
  );
}
