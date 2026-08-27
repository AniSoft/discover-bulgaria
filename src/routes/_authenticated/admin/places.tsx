import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/AppButton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AdminPlaceRow, AdminRowSkeleton } from "@/components/admin/AdminPlaceRow";
import {
  deletePlaceAsAdmin,
  setPlaceStatus,
  type AdminPlace,
} from "@/lib/admin-places.functions";
import {
  adminPlacesKey,
  adminPlacesQueryOptions,
  adminRecentKey,
  adminStatsKey,
} from "@/lib/admin-places.queries";
import { myPlacesKey } from "@/lib/my-places.queries";
import { cn } from "@/lib/utils";

const title = "Manage Places — Discover Bulgaria";
const description = "Review, publish and organise places submitted by the community.";

export const Route = createFileRoute("/_authenticated/admin/places")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ManagePlacesPage,
});

type Tab = "for_review" | "published" | "rejected" | "all";

const TABS: { value: Tab; label: string }[] = [
  { value: "for_review", label: "For Review" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

const EMPTY: Record<Tab, string> = {
  for_review: "No places are waiting for review.",
  published: "No published places yet.",
  rejected: "No rejected places.",
  all: "No places yet.",
};

type Pending =
  | { kind: "approve" | "reject" | "delete"; place: AdminPlace }
  | null;

function ManagePlacesPage() {
  const [tab, setTab] = useState<Tab>("for_review");
  const [pending, setPending] = useState<Pending>(null);
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery(adminPlacesQueryOptions());

  const refreshCounts = () => {
    void queryClient.invalidateQueries({ queryKey: adminStatsKey });
    void queryClient.invalidateQueries({ queryKey: adminRecentKey });
    void queryClient.invalidateQueries({ queryKey: myPlacesKey });
    void queryClient.invalidateQueries({ queryKey: ["places"] });
  };

  const status = useMutation({
    mutationFn: (input: { id: string; status: "published" | "rejected" }) =>
      setPlaceStatus({ data: input }),
    onSuccess: (result) => {
      queryClient.setQueryData<AdminPlace[]>(adminPlacesKey, (prev) =>
        (prev ?? []).map((p) => (p.id === result.id ? { ...p, status: result.status } : p)),
      );
      refreshCounts();
      setPending(null);
      toast.success(result.status === "published" ? "Place published." : "Place rejected.");
    },
    onError: () => toast.error("We couldn't update this place. Please try again."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePlaceAsAdmin({ data: { id } }),
    onSuccess: ({ id }) => {
      queryClient.setQueryData<AdminPlace[]>(adminPlacesKey, (prev) =>
        (prev ?? []).filter((p) => p.id !== id),
      );
      refreshCounts();
      setPending(null);
      toast.success("Place deleted.");
    },
    onError: () => toast.error("We couldn't delete this place. Please try again."),
  });

  const counts = useMemo(() => {
    const rows = data ?? [];
    return {
      for_review: rows.filter((p) => p.status === "for_review").length,
      published: rows.filter((p) => p.status === "published").length,
      rejected: rows.filter((p) => p.status === "rejected").length,
      all: rows.length,
    } satisfies Record<Tab, number>;
  }, [data]);

  const visible = useMemo(
    () => (tab === "all" ? (data ?? []) : (data ?? []).filter((p) => p.status === tab)),
    [data, tab],
  );

  const busy = status.isPending || remove.isPending;

  return (
    <div className="container-page pt-34 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Admin</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Manage Places
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Review submissions and keep the collection curated.
          </p>
        </div>
        <Link
          to="/admin"
          className="rounded-[var(--radius-button)] border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Back to Dashboard
        </Link>
      </div>

      <div
        role="tablist"
        aria-label="Place status"
        className="mt-10 flex flex-wrap gap-2 border-b border-border pb-3"
      >
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium transition-colors",
              tab === t.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {t.label}
            {!isPending && !isError ? (
              <span className="ml-2 opacity-70">{counts[t.value]}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {isPending ? (
          [0, 1, 2].map((i) => <AdminRowSkeleton key={i} />)
        ) : isError ? (
          <div className="rounded-[var(--radius-card)] border border-border bg-card p-12 text-center shadow-card">
            <p className="text-base text-foreground">We couldn&apos;t load places right now.</p>
            <div className="mt-6">
              <Button onClick={() => void refetch()}>Try Again</Button>
            </div>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">{EMPTY[tab]}</p>
          </div>
        ) : (
          visible.map((place) => (
            <AdminPlaceRow
              key={place.id}
              place={place}
              onApprove={(p) => setPending({ kind: "approve", place: p })}
              onReject={(p) => setPending({ kind: "reject", place: p })}
              onDelete={(p) => setPending({ kind: "delete", place: p })}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        open={pending?.kind === "approve"}
        title="Publish this place?"
        body="This place will become visible to everyone."
        detail={pending?.place.title}
        confirmLabel="Publish Place"
        pendingLabel="Publishing…"
        pending={busy}
        onCancel={() => setPending(null)}
        onConfirm={() =>
          pending && status.mutate({ id: pending.place.id, status: "published" })
        }
      />

      <ConfirmDialog
        open={pending?.kind === "reject"}
        title="Reject this place?"
        body="The contributor will be able to edit and submit it for review again."
        detail={pending?.place.title}
        confirmLabel="Reject Place"
        pendingLabel="Rejecting…"
        pending={busy}
        onCancel={() => setPending(null)}
        onConfirm={() => pending && status.mutate({ id: pending.place.id, status: "rejected" })}
      />

      <ConfirmDialog
        open={pending?.kind === "delete"}
        title="Delete this place?"
        body="This action cannot be undone."
        detail={pending?.place.title}
        confirmLabel="Delete Place"
        pendingLabel="Deleting…"
        destructive
        pending={busy}
        onCancel={() => setPending(null)}
        onConfirm={() => pending && remove.mutate(pending.place.id)}
      />
    </div>
  );
}
