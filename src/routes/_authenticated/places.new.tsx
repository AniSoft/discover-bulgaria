import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, ImageIcon, Sparkles } from "lucide-react";
import { Button, ButtonLink } from "@/components/AppButton";
import { createPlace } from "@/lib/place-submit.functions";
import { placeSubmissionSchema, SUITABLE_FOR_OPTIONS } from "@/lib/place-submit.shared";
import { PLACE_CATEGORIES, PLACE_COSTS, PLACE_DIFFICULTIES } from "@/lib/places.types";
import { cn } from "@/lib/utils";

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

type Values = {
  title: string;
  short_description: string;
  description: string;
  region: string;
  city: string;
  location_text: string;
  category: string;
  suitable_for: string[];
  best_time: string;
  duration: string;
  approximate_cost: string;
  difficulty: string;
  why_visit: string;
  local_secret: string;
};

const emptyValues: Values = {
  title: "",
  short_description: "",
  description: "",
  region: "",
  city: "",
  location_text: "",
  category: "",
  suitable_for: [],
  best_time: "",
  duration: "",
  approximate_cost: "",
  difficulty: "",
  why_visit: "",
  local_secret: "",
};

const inputClass =
  "w-full rounded-[var(--radius-button)] border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors duration-250 placeholder:text-muted-foreground focus:border-accent";

function Field({
  label,
  htmlFor,
  required,
  help,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  help?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </label>
      {help ? <p className="mt-1 text-xs text-muted-foreground">{help}</p> : null}
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-2 text-xs text-accent">{error}</p> : null}
    </div>
  );
}

function Section({
  step,
  heading,
  children,
}: {
  step: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{step}</p>
      <h2 className="mt-2 text-2xl leading-snug text-foreground">{heading}</h2>
      <div className="mt-6 grid gap-6">{children}</div>
    </section>
  );
}

function NewPlacePage() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const submit = useServerFn(createPlace);

  const dirty = !submitted && JSON.stringify(values) !== JSON.stringify(emptyValues);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const mutation = useMutation({
    mutationFn: (data: Values) => submit({ data }),
    onSuccess: () => setSubmitted(true),
    onError: (error) => console.error("[places] submission failed", error),
  });

  const set = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const toggleSuitable = (option: string) =>
    setValues((prev) => ({
      ...prev,
      suitable_for: prev.suitable_for.includes(option)
        ? prev.suitable_for.filter((v) => v !== option)
        : [...prev.suitable_for, option],
    }));

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
        <Section step="Section A" heading="Basic information">
          <Field label="Place Name" htmlFor="title" required error={errors["title"]}>
            <input
              id="title"
              value={values.title}
              maxLength={120}
              onChange={(e) => set("title", e.target.value)}
              className={inputClass}
              placeholder="Krushuna Waterfalls"
            />
          </Field>
          <Field
            label="Short Description"
            htmlFor="short_description"
            required
            help="A brief summary shown on the place card."
            error={errors["short_description"]}
          >
            <input
              id="short_description"
              value={values.short_description}
              maxLength={200}
              onChange={(e) => set("short_description", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field
            label="Full Description"
            htmlFor="description"
            required
            error={errors["description"]}
          >
            <textarea
              id="description"
              value={values.description}
              rows={8}
              maxLength={5000}
              onChange={(e) => set("description", e.target.value)}
              className={cn(inputClass, "resize-y leading-relaxed")}
            />
          </Field>
        </Section>

        <Section step="Section B" heading="Location">
          <Field label="Region" htmlFor="region" required error={errors["region"]}>
            <input
              id="region"
              value={values.region}
              onChange={(e) => set("region", e.target.value)}
              className={inputClass}
              placeholder="Lovech"
            />
          </Field>
          <Field label="City / Village" htmlFor="city" error={errors["city"]}>
            <input
              id="city"
              value={values.city}
              onChange={(e) => set("city", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field
            label="Location Details"
            htmlFor="location_text"
            help="How to find it — nearby landmarks, access roads, parking."
            error={errors["location_text"]}
          >
            <textarea
              id="location_text"
              value={values.location_text}
              rows={3}
              onChange={(e) => set("location_text", e.target.value)}
              className={cn(inputClass, "resize-y")}
            />
          </Field>
        </Section>

        <Section step="Section C" heading="Category">
          <Field label="Category" htmlFor="category" required error={errors["category"]}>
            <select
              id="category"
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClass}
            >
              <option value="">Select a category</option>
              {PLACE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </Section>

        <Section step="Section D" heading="Experience">
          <fieldset>
            <legend className="text-sm font-medium text-foreground">Suitable For</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUITABLE_FOR_OPTIONS.map((option) => {
                const active = values.suitable_for.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleSuitable(option)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-250",
                      active
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-secondary text-foreground hover:border-accent",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Best Time to Visit" htmlFor="best_time" error={errors["best_time"]}>
              <input
                id="best_time"
                value={values.best_time}
                onChange={(e) => set("best_time", e.target.value)}
                className={inputClass}
                placeholder="May to September"
              />
            </Field>
            <Field label="Recommended Duration" htmlFor="duration" error={errors["duration"]}>
              <input
                id="duration"
                value={values.duration}
                onChange={(e) => set("duration", e.target.value)}
                className={inputClass}
                placeholder="2–3 h"
              />
            </Field>
            <Field label="Approximate Cost" htmlFor="approximate_cost">
              <select
                id="approximate_cost"
                value={values.approximate_cost}
                onChange={(e) => set("approximate_cost", e.target.value)}
                className={inputClass}
              >
                <option value="">Not specified</option>
                {PLACE_COSTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Difficulty" htmlFor="difficulty">
              <select
                id="difficulty"
                value={values.difficulty}
                onChange={(e) => set("difficulty", e.target.value)}
                className={inputClass}
              >
                <option value="">Not specified</option>
                {PLACE_DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section step="Section E" heading="Share your knowledge">
          <Field
            label="Why Visit?"
            htmlFor="why_visit"
            help="What makes this place worth discovering?"
            error={errors["why_visit"]}
          >
            <textarea
              id="why_visit"
              value={values.why_visit}
              rows={4}
              onChange={(e) => set("why_visit", e.target.value)}
              className={cn(inputClass, "resize-y")}
            />
          </Field>
          <div className="rounded-[var(--radius-card)] border border-accent/25 bg-secondary p-6">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="size-5" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Local secret</span>
            </div>
            <Field
              label="Local Secret"
              htmlFor="local_secret"
              help="Share a useful tip that visitors may not find in a typical guidebook."
              error={errors["local_secret"]}
            >
              <textarea
                id="local_secret"
                value={values.local_secret}
                rows={4}
                onChange={(e) => set("local_secret", e.target.value)}
                className={cn(inputClass, "resize-y")}
              />
            </Field>
          </div>
        </Section>

        <section className="rounded-[var(--radius-card)] border border-dashed border-border bg-card p-8 text-center">
          <ImageIcon className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-3 text-2xl leading-snug text-foreground">Photos</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Photo uploads will be available soon.
          </p>
        </section>

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
