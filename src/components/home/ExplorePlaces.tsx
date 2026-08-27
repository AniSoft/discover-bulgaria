import { useQuery } from "@tanstack/react-query";
import { PlaceCard, PlaceCardSkeleton } from "@/components/PlaceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/AppButton";
import { placesQueryOptions } from "@/lib/places.queries";

type Props = {
  q: string;
  category: string;
  onReset: () => void;
};

export function ExplorePlaces({ q, category, onReset }: Props) {
  const { data, isPending, isError, refetch, isFetching } = useQuery(
    placesQueryOptions({ q, category }),
  );

  const hasFilters = Boolean(q || category);
  const description = hasFilters
    ? [
        category ? `Category: ${category}` : null,
        q ? `Search: “${q}”` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "A handful of places that reward the detour, chosen for their light, quiet and character.";

  return (
    <section id="places" className="scroll-mt-24 border-y border-border bg-card py-20 md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow={hasFilters ? "Results" : "Featured"}
          title="Places worth discovering"
          description={description}
          action={
            hasFilters ? (
              <Button variant="outline" onClick={onReset}>
                Clear filters
              </Button>
            ) : null
          }
        />

        <div className="mt-10">
          {isPending ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <PlaceCardSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <EmptyBox
              title="We couldn't load places right now. Please try again."
              action={
                <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
                  Try again
                </Button>
              }
            />
          ) : data.length === 0 ? (
            hasFilters ? (
              <EmptyBox
                title="No places found."
                body="Try another search or explore a different category."
                action={
                  <Button variant="outline" onClick={onReset}>
                    Reset search and filters
                  </Button>
                }
              />
            ) : (
              <EmptyBox title="No places have been published yet." />
            )
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {data.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyBox({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-background p-12 text-center">
      <p className="text-lg text-foreground">{title}</p>
      {body ? <p className="mt-2 text-sm text-muted-foreground">{body}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
