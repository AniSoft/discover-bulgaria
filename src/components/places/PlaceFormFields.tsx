import { Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SUITABLE_FOR_OPTIONS } from "@/lib/place-submit.shared";
import { PLACE_CATEGORIES, PLACE_COSTS, PLACE_DIFFICULTIES } from "@/lib/places.types";
import { cn } from "@/lib/utils";

export type PlaceFormValues = {
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

export const emptyPlaceFormValues: PlaceFormValues = {
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

export const inputClass =
  "w-full min-h-12 rounded-[var(--radius-button)] border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors duration-250 placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

export function Field({
  label,
  htmlFor,
  required,
  help,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean | undefined;
  help?: string | undefined;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  const t = useT();
  const reqLabel = t("form.requiredMark");
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="ml-1 text-accent" title={reqLabel}>
            *<span className="sr-only">({reqLabel})</span>
          </span>
        ) : null}
      </label>
      {help ? <p className="mt-1 text-xs text-muted-foreground">{help}</p> : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Section({
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

/** The shared Add / Edit place form body: sections A–E plus a photos slot. */
export function PlaceFormFields({
  values,
  errors,
  onChange,
  photosSlot,
}: {
  values: PlaceFormValues;
  errors: Record<string, string>;
  onChange: <K extends keyof PlaceFormValues>(key: K, value: PlaceFormValues[K]) => void;
  photosSlot?: React.ReactNode;
}) {
  const t = useT();
  const toggleSuitable = (option: string) =>
    onChange(
      "suitable_for",
      values.suitable_for.includes(option)
        ? values.suitable_for.filter((v) => v !== option)
        : [...values.suitable_for, option],
    );

  return (
    <>
      <Section step={t("form.sectionA")} heading={t("form.basicInfo")}>
        <Field label={t("form.placeName")} htmlFor="title" required error={errors["title"]}>
          <input
            id="title"
            value={values.title}
            maxLength={120}
            onChange={(e) => onChange("title", e.target.value)}
            className={inputClass}
            placeholder="Krushuna Waterfalls"
          />
        </Field>
        <Field
          label={t("form.shortDescription")}
          htmlFor="short_description"
          required
          help={t("form.shortDescHelp")}
          error={errors["short_description"]}
        >
          <input
            id="short_description"
            value={values.short_description}
            maxLength={200}
            onChange={(e) => onChange("short_description", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t("form.fullDescription")} htmlFor="description" required error={errors["description"]}>
          <textarea
            id="description"
            value={values.description}
            rows={8}
            maxLength={5000}
            onChange={(e) => onChange("description", e.target.value)}
            className={cn(inputClass, "resize-y leading-relaxed")}
          />
        </Field>
      </Section>

      <Section step={t("form.sectionB")} heading={t("form.location")}>
        <Field label={t("form.region")} htmlFor="region" required error={errors["region"]}>
          <input
            id="region"
            value={values.region}
            onChange={(e) => onChange("region", e.target.value)}
            className={inputClass}
            placeholder="Lovech"
          />
        </Field>
        <Field label={t("form.city")} htmlFor="city" error={errors["city"]}>
          <input
            id="city"
            value={values.city}
            onChange={(e) => onChange("city", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field
          label={t("form.locationDetails")}
          htmlFor="location_text"
          help={t("form.locationDetailsHelp")}
          error={errors["location_text"]}
        >
          <textarea
            id="location_text"
            value={values.location_text}
            rows={3}
            onChange={(e) => onChange("location_text", e.target.value)}
            className={cn(inputClass, "resize-y")}
          />
        </Field>
      </Section>

      <Section step={t("form.sectionC")} heading={t("form.category")}>
        <Field label={t("form.category")} htmlFor="category" required error={errors["category"]}>
          <select
            id="category"
            value={values.category}
            onChange={(e) => onChange("category", e.target.value)}
            className={inputClass}
          >
            <option value="">{t("form.selectCategory")}</option>
            {PLACE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section step={t("form.sectionD")} heading={t("form.experience")}>
        <fieldset>
          <legend className="text-sm font-medium text-foreground">{t("form.suitableFor")}</legend>
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
          <Field label={t("form.bestTimeToVisit")} htmlFor="best_time" error={errors["best_time"]}>
            <input
              id="best_time"
              value={values.best_time}
              onChange={(e) => onChange("best_time", e.target.value)}
              className={inputClass}
              placeholder="May to September"
            />
          </Field>
          <Field label={t("form.recommendedDuration")} htmlFor="duration" error={errors["duration"]}>
            <input
              id="duration"
              value={values.duration}
              onChange={(e) => onChange("duration", e.target.value)}
              className={inputClass}
              placeholder="2–3 h"
            />
          </Field>
          <Field label={t("form.approximateCost")} htmlFor="approximate_cost">
            <select
              id="approximate_cost"
              value={values.approximate_cost}
              onChange={(e) => onChange("approximate_cost", e.target.value)}
              className={inputClass}
            >
              <option value="">{t("form.notSpecified")}</option>
              {PLACE_COSTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("form.difficulty")} htmlFor="difficulty">
            <select
              id="difficulty"
              value={values.difficulty}
              onChange={(e) => onChange("difficulty", e.target.value)}
              className={inputClass}
            >
              <option value="">{t("form.notSpecified")}</option>
              {PLACE_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section step={t("form.sectionE")} heading={t("form.shareKnowledge")}>
        <Field
          label={t("form.whyVisit")}
          htmlFor="why_visit"
          help={t("form.whyVisitHelp")}
          error={errors["why_visit"]}
        >
          <textarea
            id="why_visit"
            value={values.why_visit}
            rows={4}
            onChange={(e) => onChange("why_visit", e.target.value)}
            className={cn(inputClass, "resize-y")}
          />
        </Field>
        <div className="rounded-[var(--radius-card)] border border-accent/25 bg-secondary p-6">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="size-5" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">{t("form.localSecretBadge")}</span>
          </div>
          <Field
            label={t("form.localSecret")}
            htmlFor="local_secret"
            help={t("form.localSecretHelp")}
            error={errors["local_secret"]}
          >
            <textarea
              id="local_secret"
              value={values.local_secret}
              rows={4}
              onChange={(e) => onChange("local_secret", e.target.value)}
              className={cn(inputClass, "resize-y")}
            />
          </Field>
        </div>
      </Section>

      {photosSlot}
    </>
  );
}
