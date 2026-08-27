import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Compass, Plus } from "lucide-react";
import { Button, ButtonLink } from "@/components/AppButton";
import {
  OwnedPlaceCard,
  OwnedPlaceCardSkeleton,
} from "@/components/places/OwnedPlaceCard";
import { deleteMyPlace } from "@/lib/my-places.functions";
import type { OwnedPlace } from "@/lib/my-places.functions";
import { myPlacesKey, myPlacesQueryOptions } from "@/lib/my-places.queries";
import { cn } from "@/lib/utils";
import { useStatusLabel, useT } from "@/lib/i18n";

const title = "My Places | Discover Bulgaria";
const description = "Manage the places you have shared with the Discover Bulgaria community.";

export const Route = createFileRoute("/_authenticated/my-places")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyPlacesPage,
});

type Tab = "all" | "for_review" | "published" | "rejected";

const TAB_VALUES: Tab[] = ["all", "for_review", "published", "rejected"];

function MyPlacesPage() {
  const t = useT();
  const statusLabel = useStatusLabel();
  const [tab, setTab] = useState<Tab>("all");
  const [pending, setPending] = useState<OwnedPlace | null>(null);
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery(myPlacesQueryOptions());

  const remove = useMutation({
    mutationFn: (id: string) => deleteMyPlace({ data: { id } }),
    onSuccess: ({ id }) => {
      queryClient.setQueryData<OwnedPlace[]>(myPlacesKey, (prev) =>
        (prev ?? []).filter((p) => p.id !== id),
      );
      setPending(null);
      toast.success(t("myPlaces.deleted"));
    },
    onError: () => {
      toast.error(t("myPlaces.deleteError"));
    },
  });

  const counts = useMemo(() => {
    const rows = data ?? [];
    return {
      all: rows.length,
      for_review: rows.filter((p) => p.status === "for_review").length,
      published: rows.filter((p) => p.status === "published").length,
      rejected: rows.filter((p) => p.status === "rejected").length,
    } satisfies Record<Tab, number>;
  }, [data]);

  const visible = useMemo(
    () => (tab === "all" ? (data ?? []) : (data ?? []).filter((p) => p.status === tab)),
    [data, tab],
  );

  return (
    <div className="container-page pt-34 pb-20">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">
            {t("myPlaces.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t("myPlaces.description")}
          </p>
        </div>
        <ButtonLink to="/places/new" variant="accent">
          <Plus className="size-4" aria-hidden="true" />
          {t("myPlaces.addPlace")}
        </ButtonLink>
      </header>

      {!isError && (data?.length ?? 0) > 0 ? (
        <div
          className="mt-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label={t("myPlaces.filterLabel")}
        >
          {TAB_VALUES.map((value) => (
            <button
              key={value}
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors duration-250",
                tab === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              {statusLabel(value, true)}
              <span className="ml-2 opacity-70">{counts[value]}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-8">
        {isPending ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <OwnedPlaceCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <StateCard heading={t("myPlaces.loadError")} body={t("myPlaces.checkConnection")}>
            <Button onClick={() => void refetch()}>{t("common.tryAgain")}</Button>
          </StateCard>
        ) : (data?.length ?? 0) === 0 ? (
          <StateCard heading={t("myPlaces.empty")} body={t("myPlaces.emptyBody")}>
            <ButtonLink to="/places/new" variant="accent">
              {t("myPlaces.addFirstPlace")}
            </ButtonLink>
          </StateCard>
        ) : visible.length === 0 ? (
          <StateCard
            heading={t("myPlaces.noneInCategory")}
            body={t("myPlaces.tryAnotherFilter")}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {visible.map((place) => (
              <OwnedPlaceCard key={place.id} place={place} onDelete={setPending} />
            ))}
          </div>
        )}
      </div>

      {pending ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-place-title"
        >
          <div className="w-full max-w-md rounded-[var(--radius-card)] border border-border bg-card p-8 shadow-card">
            <h2 id="delete-place-title" className="text-2xl text-foreground">
              {t("myPlaces.deleteTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("myPlaces.deleteBody")}
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">{pending.title}</p>
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setPending(null)}
                disabled={remove.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => remove.mutate(pending.id)}
                disabled={remove.isPending}
              >
                {remove.isPending ? t("common.deleting") : t("myPlaces.deletePlace")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StateCard({
  heading,
  body,
  children,
}: {
  heading: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-border bg-card p-12 text-center shadow-card">
      <Compass className="mx-auto size-8 text-accent" aria-hidden="true" />
      <h2 className="mt-5 text-2xl leading-tight text-foreground">{heading}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{body}</p>
      {children ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>
      ) : null}
    </div>
  );
}
