import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  Mountain,
  Sparkles,
  Wallet,
} from "lucide-react";
import { ButtonLink, Button } from "@/components/AppButton";
import { placeDetailQueryOptions } from "@/lib/places.queries";
import { placeImage, placeImageAlt, placeLocation } from "@/lib/place-display";
import { PlaceGallery } from "@/components/places/PlaceGallery";
import { FavoriteActionButton } from "@/components/FavoriteButton";
import { useAuth } from "@/lib/auth";
import { ownedPlaceBySlugQueryOptions } from "@/lib/my-places.queries";
import { StatusBadge } from "@/components/places/OwnedPlaceCard";
import type { PublicPlaceDetail } from "@/lib/places.functions";
import { useT, useCategoryLabel, useSuitableLabel, useDifficultyLabel } from "@/lib/i18n";

export const Route = createFileRoute("/places/$slug")({
  loader: async ({ params, context }) => {
    try {
      const place = await context.queryClient.ensureQueryData(
        placeDetailQueryOptions(params.slug),
      );
      return { place };
    } catch {
      return { place: null };
    }
  },
  head: ({ loaderData }) => {
    const place = loaderData?.place;
    const title = place
      ? `${place.title} — Discover Bulgaria`
      : "Place not found — Discover Bulgaria";
    const description = place?.short_description ??
      "Details, practical information and local tips for places in Bulgaria.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(place ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  errorComponent: () => <ErrorState onRetry={() => window.location.reload()} />,
  notFoundComponent: () => <NotFoundState />,
  component: PlaceDetailsPage,
});

function PlaceDetailsPage() {
  const { slug } = Route.useParams();
  const { place: loaderPlace } = Route.useLoaderData();
  const { user } = useAuth();

  // The loader already resolved this place, so the first client render must
  // start from that same value. Falling back to a loading skeleton here would
  // not match the server-rendered HTML and breaks hydration.
  const { data, isError, refetch } = useQuery({
    ...placeDetailQueryOptions(slug),
    ...(loaderPlace ? { initialData: loaderPlace } : {}),
  });

  const place = data ?? loaderPlace;

  // Owners may preview their own not-yet-published places (RLS scopes the row).
  const ownerFallback = useQuery(ownedPlaceBySlugQueryOptions(slug, Boolean(user) && !place));

  if (place) return <PlaceDetail place={place} />;
  if (isError) return <ErrorState onRetry={() => void refetch()} />;
  if (user && (ownerFallback.isPending || ownerFallback.isFetching)) return <DetailSkeleton />;
  if (ownerFallback.data) {
    return <PlaceDetail place={ownerFallback.data} ownerStatus={ownerFallback.data.status} />;
  }
  return <NotFoundState />;
}



function Practical({ place }: { place: PublicPlaceDetail }) {
  const difficultyLabel = useDifficultyLabel();
  const items = [
    { icon: Clock, value: place.duration },
    { icon: Wallet, value: place.approximate_cost },
    { icon: Mountain, value: place.difficulty ? difficultyLabel(place.difficulty) : undefined },
    { icon: Calendar, value: place.best_time },
  ].filter((i) => Boolean(i.value));

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--radius-card)] border border-border bg-card px-6 py-4 shadow-card">
      {items.map(({ icon: Icon, value }) => (
        <span key={value} className="flex items-center gap-2 text-sm text-foreground">
          <Icon className="size-4 text-accent" aria-hidden="true" />
          {value}
        </span>
      ))}
    </div>
  );
}

function Section({ title: heading, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{heading}</h2>
      <div className="mt-4 text-base leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PlaceDetail({
  place,
  ownerStatus,
}: {
  place: PublicPlaceDetail;
  ownerStatus?: string;
}) {
  const t = useT();
  const categoryLabel = useCategoryLabel();
  const suitableLabel = useSuitableLabel();
  return (
    <article className="pb-20">
      <div className="container-page pt-30">
        {ownerStatus ? (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] border border-border bg-secondary px-5 py-3">
            <StatusBadge status={ownerStatus} />
            <p className="text-sm text-muted-foreground">{t("place.privatePreview")}</p>
          </div>
        ) : null}

        <nav aria-label={t("place.breadcrumbAria")} className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors duration-250 hover:text-accent">
            {t("place.breadcrumbExplore")}
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <Link
            to="/"
            search={{ category: place.category }}
            hash="places"
            className="transition-colors duration-250 hover:text-accent"
          >
            {categoryLabel(place.category)}
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{place.title}</span>
        </nav>

        <PlaceGallery
          photos={place.photos ?? []}
          title={place.title}
          fallbackSrc={placeImage(place)}
          fallbackAlt={placeImageAlt(place)}
        />


        <header className="mt-8 max-w-3xl">
          <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
            {categoryLabel(place.category)}
          </span>
          <h1 className="mt-4 text-4xl leading-tight text-foreground sm:text-5xl xl:text-6xl">
            {place.title}
          </h1>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden="true" />
            {placeLocation(place)}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-foreground/80">
            {place.short_description}
          </p>
        </header>

        <div className="mt-8 flex max-w-3xl flex-wrap items-center gap-4">
          <Practical place={place} />
          {ownerStatus ? null : (
            <FavoriteActionButton placeId={place.id} title={place.title} />
          )}
        </div>

        <div className="max-w-3xl">
          <Section title={t("place.about")}>
            <p className="whitespace-pre-line">{place.description}</p>
          </Section>

          {place.why_visit ? (
            <Section title={t("place.whyVisit")}>
              <p className="whitespace-pre-line">{place.why_visit}</p>
            </Section>
          ) : null}

          {place.suitable_for?.length ? (
            <Section title={t("place.suitableFor")}>
              <ul className="flex flex-wrap gap-2">
                {place.suitable_for.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-secondary px-3.5 py-1.5 text-sm text-foreground"
                  >
                    {suitableLabel(tag)}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {place.best_time ? (
            <Section title={t("place.bestTime")}>
              <p>{place.best_time}</p>
            </Section>
          ) : null}

          <Section title={t("place.location")}>
            <p className="text-foreground">{placeLocation(place)}</p>
            {place.location_text ? <p className="mt-2">{place.location_text}</p> : null}
          </Section>

          {place.local_secret ? (
            <section className="mt-14 rounded-[var(--radius-card)] border border-accent/25 bg-secondary p-8">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="size-5" aria-hidden="true" />
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">{t("place.localSecret")}</h2>
              </div>
              <p className="mt-4 text-xl leading-relaxed text-foreground">{place.local_secret}</p>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function DetailSkeleton() {
  return (
    <div className="container-page animate-pulse pt-30 pb-20">
      <div className="h-4 w-64 rounded bg-muted" />
      <div className="mt-6 aspect-21/9 max-h-[520px] w-full rounded-[var(--radius-card)] bg-muted" />
      <div className="mt-8 max-w-3xl space-y-4">
        <div className="h-6 w-28 rounded-full bg-muted" />
        <div className="h-12 w-3/4 rounded bg-muted" />
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-16 w-full rounded-[var(--radius-card)] bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
        <div className="h-3 w-4/6 rounded bg-muted" />
      </div>
    </div>
  );
}

function StateShell({
  heading,
  body,
  children,
}: {
  heading: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page pt-34 pb-24">
      <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-border bg-card p-12 text-center shadow-card">
        <Compass className="mx-auto size-8 text-accent" aria-hidden="true" />
        <h1 className="mt-5 text-3xl leading-tight text-foreground">{heading}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>
      </div>
    </div>
  );
}

function NotFoundState() {
  const t = useT();
  return (
    <StateShell
      heading={t("place.notFoundTitleFull")}
      body={t("place.notFoundBodyFull")}
    >
      <ButtonLink to="/" hash="places" variant="primary">
        {t("place.explorePlaces")}
      </ButtonLink>
      <ButtonLink to="/" variant="outline">
        {t("place.backHome")}
      </ButtonLink>
    </StateShell>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const t = useT();
  return (
    <StateShell heading={t("place.errorTitleFull")} body={t("place.errorBody")}>
      <Button onClick={onRetry}>{t("place.tryAgain")}</Button>
      <ButtonLink to="/" variant="outline">
        {t("place.backHome")}
      </ButtonLink>
    </StateShell>
  );
}
