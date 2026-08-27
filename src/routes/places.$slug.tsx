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
import { useAuth } from "@/lib/auth";
import { ownedPlaceBySlugQueryOptions } from "@/lib/my-places.queries";
import { StatusBadge } from "@/components/places/OwnedPlaceCard";
import type { PublicPlaceDetail } from "@/lib/places.functions";

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
  const { user } = useAuth();
  const { data, isPending, isError, refetch } = useQuery(placeDetailQueryOptions(slug));

  // Owners may preview their own not-yet-published places (RLS scopes the row).
  const ownerFallback = useQuery(
    ownedPlaceBySlugQueryOptions(slug, Boolean(user) && !isPending && !isError && !data),
  );

  if (isPending) return <DetailSkeleton />;
  if (isError) return <ErrorState onRetry={() => void refetch()} />;
  if (!data) {
    if (user && (ownerFallback.isPending || ownerFallback.isFetching)) return <DetailSkeleton />;
    if (ownerFallback.data) {
      return <PlaceDetail place={ownerFallback.data} ownerStatus={ownerFallback.data.status} />;
    }
    return <NotFoundState />;
  }

  return <PlaceDetail place={data} />;
}


function Practical({ place }: { place: PublicPlaceDetail }) {
  const items = [
    { icon: Clock, value: place.duration },
    { icon: Wallet, value: place.approximate_cost },
    { icon: Mountain, value: place.difficulty },
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
  return (
    <article className="pb-20">
      <div className="container-page pt-30">
        {ownerStatus ? (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] border border-border bg-secondary px-5 py-3">
            <StatusBadge status={ownerStatus} />
            <p className="text-sm text-muted-foreground">
              Private preview — this place is not public until it is published.
            </p>
          </div>
        ) : null}

        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors duration-250 hover:text-accent">
            Explore
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <Link
            to="/"
            search={{ category: place.category }}
            hash="places"
            className="transition-colors duration-250 hover:text-accent"
          >
            {place.category}
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{place.title}</span>
        </nav>

        <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-border bg-secondary">
          <div className="relative aspect-21/9 max-h-[520px] w-full">
            <img
              src={placeImage(place)}
              alt={placeImageAlt(place)}
              className="size-full object-cover"
              width={1600}
              height={686}
            />
          </div>
        </div>

        <header className="mt-8 max-w-3xl">
          <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
            {place.category}
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

        <div className="mt-8 max-w-3xl">
          <Practical place={place} />
        </div>

        <div className="max-w-3xl">
          <Section title="About">
            <p className="whitespace-pre-line">{place.description}</p>
          </Section>

          {place.why_visit ? (
            <Section title="Why visit?">
              <p className="whitespace-pre-line">{place.why_visit}</p>
            </Section>
          ) : null}

          {place.suitable_for?.length ? (
            <Section title="Suitable for">
              <ul className="flex flex-wrap gap-2">
                {place.suitable_for.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-secondary px-3.5 py-1.5 text-sm text-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {place.best_time ? (
            <Section title="Best time to visit">
              <p>{place.best_time}</p>
            </Section>
          ) : null}

          <Section title="Location">
            <p className="text-foreground">{placeLocation(place)}</p>
            {place.location_text ? <p className="mt-2">{place.location_text}</p> : null}
          </Section>

          {place.local_secret ? (
            <section className="mt-14 rounded-[var(--radius-card)] border border-accent/25 bg-secondary p-8">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="size-5" aria-hidden="true" />
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">Local secret</h2>
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
  return (
    <StateShell
      heading="Place not found"
      body="This place may not exist or may not be published yet."
    >
      <ButtonLink to="/" hash="places" variant="primary">
        Explore Places
      </ButtonLink>
      <ButtonLink to="/" variant="outline">
        Back Home
      </ButtonLink>
    </StateShell>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StateShell heading="We couldn't load this place right now." body="Please try again.">
      <Button onClick={onRetry}>Try again</Button>
      <ButtonLink to="/" variant="outline">
        Back Home
      </ButtonLink>
    </StateShell>
  );
}
