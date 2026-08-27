import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Eye, MapPin } from "lucide-react";
import { Button, buttonClasses } from "@/components/AppButton";
import { StatusBadge } from "@/components/places/OwnedPlaceCard";
import { authorLabel, formatDate } from "@/components/admin/AdminPlaceRow";
import {
  adminRecentSubmissionsQueryOptions,
  adminStatsQueryOptions,
} from "@/lib/admin-places.queries";
import { placeLocation } from "@/lib/place-display";
import { useT } from "@/lib/i18n";

const title = "Admin Dashboard — Discover Bulgaria";
const description = "Manage community content and platform activity on Discover Bulgaria.";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const t = useT();
  const stats = useQuery(adminStatsQueryOptions());
  const recent = useQuery(adminRecentSubmissionsQueryOptions());

  const cards = [
    { label: t("admin.waitingForReview"), value: stats.data?.for_review },
    { label: t("admin.published"), value: stats.data?.published },
    { label: t("admin.rejected"), value: stats.data?.rejected },
    { label: t("admin.totalPlaces"), value: stats.data?.total },
  ];

  return (
    <div className="container-page pt-34 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
            {t("admin.badge")}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {t("admin.dashboardTitle")}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            {t("admin.dashboardDescription")}
          </p>
        </div>
        <Link
          to="/admin/places"
          className="rounded-[var(--radius-button)] bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {t("admin.managePlaces")}
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((s) => (
          <div
            key={s.label}
            className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card"
          >
            <p className="text-sm text-muted-foreground">{s.label}</p>
            {stats.isPending ? (
              <div className="mt-4 h-8 w-16 animate-pulse rounded-full bg-secondary" />
            ) : stats.isError ? (
              <p className="mt-3 font-display text-4xl text-muted-foreground">—</p>
            ) : (
              <p className="mt-3 font-display text-4xl text-foreground">{s.value ?? 0}</p>
            )}
          </div>
        ))}
      </div>

      {stats.isError ? (
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] border border-border bg-card p-5">
          <p className="text-sm text-foreground">{t("admin.loadError")}</p>
          <Button size="sm" onClick={() => void stats.refetch()}>
            {t("admin.tryAgain")}
          </Button>
        </div>
      ) : null}

      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-foreground">
            {t("admin.recentSubmissions")}
          </h2>
          <Link to="/admin/places" className={buttonClasses("outline", "sm")}>
            {t("admin.manageAll")}
          </Link>
        </div>

        <div className="mt-4 grid gap-3">
          {recent.isPending ? (
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-[var(--radius-card)] border border-border bg-card"
              />
            ))
          ) : recent.isError ? (
            <div className="rounded-[var(--radius-card)] border border-border bg-card p-10 text-center shadow-card">
              <p className="text-base text-foreground">{t("admin.loadError")}</p>
              <div className="mt-5">
                <Button onClick={() => void recent.refetch()}>{t("admin.tryAgain")}</Button>
              </div>
            </div>
          ) : (recent.data?.length ?? 0) === 0 ? (
            <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground">{t("admin.noRecentSubmissions")}</p>
            </div>
          ) : (
            recent.data?.map((place) => (
              <article
                key={place.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-card"
              >
                <div className="min-w-0">
                  <span className="text-xs font-medium text-accent">{place.category}</span>
                  <h3 className="mt-1 text-lg leading-snug text-foreground">{place.title}</h3>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
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
                <div className="flex items-center gap-3">
                  <StatusBadge status={place.status} />
                  <Link
                    to="/places/$slug"
                    params={{ slug: place.slug }}
                    className={buttonClasses("outline", "sm")}
                  >
                    <Eye className="size-4" aria-hidden="true" />
                    {t("admin.view")}
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
