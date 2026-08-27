import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { PlaceCard, PlaceCardSkeleton } from "@/components/PlaceCard";
import { Button, ButtonLink } from "@/components/AppButton";
import { favoritePlacesQueryOptions } from "@/lib/favorites.queries";
import { useT } from "@/lib/i18n";

const title = "Favorites | Discover Bulgaria";
const description = "Your saved Bulgarian places, kept in one place for the next trip.";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const t = useT();
  const { data, isPending, isError, refetch, isFetching } = useQuery(favoritePlacesQueryOptions());

  return (
    <PageShell title={t("favorites.title")} description={t("favorites.description")}>
      {isPending ? (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <PlaceCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <EmptyBox title={t("favorites.error")}>
          <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
            {t("common.tryAgain")}
          </Button>
        </EmptyBox>
      ) : data.length === 0 ? (
        <EmptyBox title={t("favorites.empty")} body={t("favorites.emptyBody")}>
          <ButtonLink to="/" hash="places">
            {t("favorites.explorePlaces")}
          </ButtonLink>
        </EmptyBox>
      ) : (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {data.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function EmptyBox({
  title: heading,
  body,
  children,
}: {
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card p-12 text-center">
      <p className="text-lg text-foreground">{heading}</p>
      {body ? <p className="mt-2 text-sm text-muted-foreground">{body}</p> : null}
      {children ? <div className="mt-6 flex justify-center">{children}</div> : null}
    </div>
  );
}
