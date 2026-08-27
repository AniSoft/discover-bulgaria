import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Info } from "lucide-react";
import { Button, ButtonLink, buttonClasses } from "@/components/AppButton";

import {
  PlaceFormFields,
  emptyPlaceFormValues,
  type PlaceFormValues,
} from "@/components/places/PlaceFormFields";
import { placeForEditQueryOptions } from "@/lib/place-edit.queries";
import { updateMyPlace, type EditablePlace } from "@/lib/place-edit.functions";
import { placeSubmissionSchema } from "@/lib/place-submit.shared";
import { myPlacesKey } from "@/lib/my-places.queries";
import { adminPlacesKey, adminRecentKey, adminStatsKey } from "@/lib/admin-places.queries";
import { useAuth } from "@/lib/auth";

const title = "Edit Place — Discover Bulgaria";
const description = "Update a place you have shared with the Discover Bulgaria community.";

export const Route = createFileRoute("/_authenticated/places/$id/edit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditPlacePage,
});

function toFormValues(place: EditablePlace): PlaceFormValues {
  return {
    title: place.title,
    short_description: place.short_description,
    description: place.description,
    region: place.region,
    city: place.city ?? "",
    location_text: place.location_text ?? "",
    category: place.category,
    suitable_for: place.suitable_for ?? [],
    best_time: place.best_time ?? "",
    duration: place.duration ?? "",
    approximate_cost: place.approximate_cost ?? "",
    difficulty: place.difficulty ?? "",
    why_visit: place.why_visit ?? "",
    local_secret: place.local_secret ?? "",
  };
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="container-page pt-34 pb-24">{children}</div>;
}

function EditSkeleton() {
  return (
    <Shell>
      <div className="h-10 w-72 animate-pulse rounded-full bg-secondary" />
      <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded-full bg-secondary" />
      <div className="mt-10 grid max-w-3xl gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-[var(--radius-card)] bg-secondary" />
        ))}
      </div>
    </Shell>
  );
}

function NotFound() {
  return (
    <Shell>
      <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-border bg-card p-12 text-center shadow-card">
        <h1 className="text-3xl leading-tight text-foreground">Place not found</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          This place doesn't exist, or it isn't one of yours.
        </p>
        <div className="mt-8">
          <ButtonLink to="/my-places" variant="outline">
            Back to My Places
          </ButtonLink>
        </div>
      </div>
    </Shell>
  );
}

function EditPlacePage() {
  const { id } = Route.useParams();
  const query = useQuery(placeForEditQueryOptions(id));

  if (query.isPending) return <EditSkeleton />;
  if (query.isError) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-border bg-card p-12 text-center shadow-card">
          <h1 className="text-3xl leading-tight text-foreground">
            We couldn't load this place right now.
          </h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => void query.refetch()}>Try Again</Button>
            <ButtonLink to="/my-places" variant="outline">
              Back to My Places
            </ButtonLink>
          </div>
        </div>
      </Shell>
    );
  }
  if (!query.data) return <NotFound />;

  return <EditPlaceForm place={query.data} />;
}

function EditPlaceForm({ place }: { place: EditablePlace }) {
  const { isAdmin } = useAuth();
  const initial = useMemo(() => toFormValues(place), [place]);
  const [values, setValues] = useState<PlaceFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const save = useServerFn(updateMyPlace);

  const dirty = !savedSlug && JSON.stringify(values) !== JSON.stringify(initial);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const mutation = useMutation({
    mutationFn: (data: PlaceFormValues) => save({ data: { ...data, id: place.id } }),
    onSuccess: (result) => {
      setSavedSlug(result.slug);
      void queryClient.invalidateQueries({ queryKey: myPlacesKey });
      void queryClient.invalidateQueries({ queryKey: ["places", "edit", place.id] });
      void queryClient.invalidateQueries({ queryKey: adminPlacesKey });
      void queryClient.invalidateQueries({ queryKey: adminRecentKey });
      void queryClient.invalidateQueries({ queryKey: adminStatsKey });
    },
    onError: (error) => console.error("[places] update failed", error),
  });

  const onChange = <K extends keyof PlaceFormValues>(key: K, value: PlaceFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (mutation.isPending) return;

    const parsed = placeSubmissionSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    mutation.mutate(values);
  };

  if (savedSlug) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-border bg-card p-12 text-center shadow-card">
          <CheckCircle2 className="mx-auto size-9 text-accent" aria-hidden="true" />
          <h1 className="mt-5 text-3xl leading-tight text-foreground">
            {isAdmin ? "Changes saved." : "Your changes have been submitted for review."}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {isAdmin
              ? "The place keeps its current status."
              : "An administrator will review the updated place before it is published."}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {isAdmin ? (
              <ButtonLink to="/admin/places">Back to Manage Places</ButtonLink>
            ) : (
              <ButtonLink to="/my-places">Back to My Places</ButtonLink>
            )}
            <Link
              to="/places/$slug"
              params={{ slug: savedSlug }}
              className={buttonClasses("outline", "md")}
            >
              View Place
            </Link>

          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="max-w-2xl">
        <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">Edit Place</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Update your recommendation and submit it for review again.
        </p>
      </header>

      {!isAdmin && (place.status === "published" || place.status === "rejected") ? (
        <div className="mt-8 flex max-w-3xl items-start gap-3 rounded-[var(--radius-card)] border border-accent/25 bg-secondary px-5 py-4">
          <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-sm text-foreground">
            {place.status === "published"
              ? "Editing this published place will send it back for administrator review."
              : "You can update this place and submit it for review again."}
          </p>
        </div>
      ) : null}

      <form onSubmit={onSubmit} noValidate className="mt-8 grid max-w-3xl gap-6">
        <PlaceFormFields values={values} errors={errors} onChange={onChange} />

        {mutation.isError ? (
          <p
            role="alert"
            className="rounded-[var(--radius-card)] border border-accent/30 bg-secondary px-5 py-4 text-sm text-foreground"
          >
            We couldn't save your changes right now. Please try again.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
          <ButtonLink to={isAdmin ? "/admin/places" : "/my-places"} variant="outline" size="lg">
            Cancel
          </ButtonLink>
        </div>
      </form>
    </Shell>
  );
}
