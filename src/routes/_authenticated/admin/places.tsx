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
import { useStatusLabel, useT, type MessageKey } from "@/lib/i18n";

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

const TAB_VALUES: Tab[] = ["for_review", "published", "rejected", "all"];

const EMPTY_KEY: Record<Tab, MessageKey> = {
  for_review: "admin.emptyForReview",
  published: "admin.emptyPublished",
  rejected: "admin.emptyRejected",
  all: "admin.emptyAll",
};

type Pending =
  | { kind: "approve" | "reject" | "delete"; place: AdminPlace }
  | null;

function ManagePlacesPage() {
  const t = useT();
  const statusLabel = useStatusLabel();
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
      toast.success(result.status === "published" ? t("admin.approved") : t("admin.rejectedToast"));
    },
    onError: () => toast.error(t("admin.actionError")),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePlaceAsAdmin({ data: { id } }),
    onSuccess: ({ id }) => {
      queryClient.setQueryData<AdminPlace[]>(adminPlacesKey, (prev) =>
        (prev ?? []).filter((p) => p.id !== id),
      );
      refreshCounts();
      setPending(null);
      toast.success(t("admin.deleted"));
    },
    onError: () => toast.error(t("admin.deleteError")),
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
          <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
            {t("admin.badge")}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {t("admin.managePlaces")}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            {t("admin.managePlacesDescription")}
          </p>
        </div>
        <Link
          to="/admin"
          className="rounded-[var(--radius-button)] border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          {t("admin.backToDashboard")}
        </Link>
      </div>

      <div
        role="tablist"
        aria-label={t("myPlaces.filterLabel")}
        className="mt-10 flex flex-wrap gap-2 border-b border-border pb-3"
      >
        {TAB_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              "rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium transition-colors",
              tab === value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {statusLabel(value, true)}
            {!isPending && !isError ? (
              <span className="ml-2 opacity-70">{counts[value]}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {isPending ? (
          [0, 1, 2].map((i) => <AdminRowSkeleton key={i} />)
        ) : isError ? (
          <div className="rounded-[var(--radius-card)] border border-border bg-card p-12 text-center shadow-card">
            <p className="text-base text-foreground">{t("admin.loadError")}</p>
            <div className="mt-6">
              <Button onClick={() => void refetch()}>{t("admin.tryAgain")}</Button>
            </div>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">{t(EMPTY_KEY[tab])}</p>
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
        title={t("admin.publishTitle")}
        body={t("admin.publishBody")}
        detail={pending?.place.title}
        confirmLabel={t("admin.publishConfirm")}
        pendingLabel={t("admin.publishing")}
        pending={busy}
        onCancel={() => setPending(null)}
        onConfirm={() =>
          pending && status.mutate({ id: pending.place.id, status: "published" })
        }
      />

      <ConfirmDialog
        open={pending?.kind === "reject"}
        title={t("admin.rejectTitle")}
        body={t("admin.rejectBody")}
        detail={pending?.place.title}
        confirmLabel={t("admin.rejectConfirm")}
        pendingLabel={t("admin.rejecting")}
        pending={busy}
        onCancel={() => setPending(null)}
        onConfirm={() => pending && status.mutate({ id: pending.place.id, status: "rejected" })}
      />

      <ConfirmDialog
        open={pending?.kind === "delete"}
        title={t("admin.deleteTitle")}
        body={t("admin.deleteBody")}
        detail={pending?.place.title}
        confirmLabel={t("admin.deleteConfirm")}
        pendingLabel={t("admin.deleting")}
        destructive
        pending={busy}
        onCancel={() => setPending(null)}
        onConfirm={() => pending && remove.mutate(pending.place.id)}
      />
    </div>
  );
}
