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

const title = "My Places — Discover Bulgaria";
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

const TABS: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "for_review", label: "For Review" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
];

function MyPlacesPage() {
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
      toast.success("Place deleted.");
    },
    onError: () => {
      toast.error("We couldn't delete this place. Please try again.");
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
          <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">My Places</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Manage the places you&apos;ve shared with the Discover Bulgaria community.
          </p>
        </div>
        <ButtonLink to="/places/new" variant="accent">
          <Plus className="size-4" aria-hidden="true" />
          Add a Place
        </ButtonLink>
      </header>

      {!isError && (data?.length ?? 0) > 0 ? (
        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
          {TABS.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors duration-250",
                tab === t.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              {t.label}
              <span className="ml-2 opacity-70">{counts[t.value]}</span>
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
          <StateCard
            heading="We couldn't load your places right now."
            body="Please check your connection and try again."
          >
            <Button onClick={() => void refetch()}>Try Again</Button>
          </StateCard>
        ) : (data?.length ?? 0) === 0 ? (
          <StateCard
            heading="You haven't shared any places yet."
            body="Know a special corner of Bulgaria?"
          >
            <ButtonLink to="/places/new" variant="accent">
              Add Your First Place
            </ButtonLink>
          </StateCard>
        ) : visible.length === 0 ? (
          <StateCard heading="No places in this category yet." body="Try another status filter." />
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
              Delete this place?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This action cannot be undone.
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">{pending.title}</p>
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setPending(null)}
                disabled={remove.isPending}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-700 text-white hover:bg-red-800"
                onClick={() => remove.mutate(pending.id)}
                disabled={remove.isPending}
              >
                {remove.isPending ? "Deleting…" : "Delete Place"}
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
