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
import { PhotoPicker, type PickedPhoto } from "@/components/places/PhotoPicker";
import { uploadPlacePhoto } from "@/lib/place-photos.upload";
import { createPlace } from "@/lib/place-submit.functions";
import { placeSubmissionSchema } from "@/lib/place-submit.shared";
import { useT } from "@/lib/i18n";
import { useMessageTranslator } from "@/lib/i18n/validation";
import { privateSeo } from "@/lib/seo";

const title = "Add a Place | Discover Bulgaria";
const description =
  "Share a place worth discovering in Bulgaria and help other travellers experience it too.";

export const Route = createFileRoute("/_authenticated/places/new")({
  head: () => privateSeo(title, description),
  component: NewPlacePage,
});

function NewPlacePage() {
  const [values, setValues] = useState<PlaceFormValues>(emptyPlaceFormValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [failedPhotos, setFailedPhotos] = useState(0);
  const submit = useServerFn(createPlace);
  const t = useT();
  const translateMessage = useMessageTranslator();

  const dirty =
    !submitted &&
    (photos.length > 0 || JSON.stringify(values) !== JSON.stringify(emptyPlaceFormValues));

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const mutation = useMutation({
    // The place row must exist before photos can be uploaded into its folder.
    mutationFn: async (data: PlaceFormValues) => {
      const created = await submit({ data });
      let failed = 0;
      for (const photo of photos) {
        try {
          await uploadPlacePhoto(created.id, photo.file);
        } catch (error) {
          failed += 1;
          console.error("[places] photo upload failed", error);
        }
      }
      return { failed };
    },
    onSuccess: ({ failed }) => {
      setFailedPhotos(failed);
      setSubmitted(true);
    },
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
        if (!next[key]) next[key] = translateMessage(issue.message);
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
            {t("form.submittedHeading")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t("form.submittedBody")}
          </p>
          {failedPhotos ? (
            <p className="mt-4 text-sm text-accent">
              {t("form.photoWarning", { failed: failedPhotos })}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink to="/my-places">{t("form.viewMyPlaces")}</ButtonLink>
            <ButtonLink to="/" variant="outline">
              {t("form.exploreMore")}
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
          {t("form.shareTitle")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {t("form.shareSubtitle")}
        </p>
      </header>

      <form onSubmit={onSubmit} noValidate className="mt-10 grid max-w-3xl gap-6">
        <PlaceFormFields
          values={values}
          errors={errors}
          onChange={onChange}
          photosSlot={
            <PhotoPicker photos={photos} onChange={setPhotos} disabled={mutation.isPending} />
          }
        />

        {mutation.isError ? (
          <p role="alert" className="rounded-[var(--radius-card)] border border-accent/30 bg-secondary px-5 py-4 text-sm text-foreground">
            {t("form.submitErrorGeneric")}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={mutation.isPending}>
            {mutation.isPending
              ? photos.length
                ? t("form.submittingUploading")
                : t("form.submitting")
              : t("form.submitForReview")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t("form.reviewedNotice")}
          </p>
        </div>
      </form>
    </div>
  );
}
