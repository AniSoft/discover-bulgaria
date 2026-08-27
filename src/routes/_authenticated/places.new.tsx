import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/AppButton";
import {
  PlaceFormFields,
  emptyPlaceFormValues,
  type PlaceFormValues,
} from "@/components/places/PlaceFormFields";
import { createPlace } from "@/lib/place-submit.functions";
import { placeSubmissionSchema } from "@/lib/place-submit.shared";

const title = "Add a Place — Discover Bulgaria";
const description =
  "Share a place worth discovering in Bulgaria and help other travellers experience it too.";

export const Route = createFileRoute("/_authenticated/places/new")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: NewPlacePage,
});

function NewPlacePage() {
  const [values, setValues] = useState<PlaceFormValues>(emptyPlaceFormValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const submit = useServerFn(createPlace);

  const dirty = !submitted && JSON.stringify(values) !== JSON.stringify(emptyPlaceFormValues);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const mutation = useMutation({
    mutationFn: (data: PlaceFormValues) => submit({ data }),
    onSuccess: () => setSubmitted(true),
    onError: (error) => console.error("[places] submission failed", error),
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

  if (submitted) {
    return (
      <div className="container-page pt-34 pb-24">
        <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-border bg-card p-12 text-center shadow-card">
          <CheckCircle2 className="mx-auto size-9 text-accent" aria-hidden="true" />
          <h1 className="mt-5 text-3xl leading-tight text-foreground">
            Your place has been submitted for review.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Thank you for helping others discover Bulgaria. An administrator will review your
            submission before it becomes public.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink to="/my-places">View My Places</ButtonLink>
            <ButtonLink to="/" variant="outline">
              Explore More
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page pt-34 pb-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">
          Share a place worth discovering
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Help others discover a special corner of Bulgaria.
        </p>
      </header>

      <form onSubmit={onSubmit} noValidate className="mt-10 grid max-w-3xl gap-6">
        <PlaceFormFields values={values} errors={errors} onChange={onChange} />

        {mutation.isError ? (
          <p role="alert" className="rounded-[var(--radius-card)] border border-accent/30 bg-secondary px-5 py-4 text-sm text-foreground">
            We couldn't submit your place right now. Please try again.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit for review"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Submissions are reviewed by an administrator before they appear publicly.
          </p>
        </div>
      </form>
    </div>
  );
}
