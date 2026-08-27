import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import type { PublicPlace } from "@/lib/places.functions";
import { FavoriteHeartButton } from "@/components/FavoriteButton";
import { placeCover, placeImageAlt, placeLocation, placePractical } from "@/lib/place-display";


export function PlaceCard({ place }: { place: PublicPlace }) {
  const practical = placePractical(place);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-card transition-shadow duration-250 hover:shadow-lift">
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={placeCover(place)}
          alt={placeImageAlt(place)}
          loading="lazy"
          width={1024}
          height={768}
          className="hover-zoom-img size-full object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1 text-xs font-medium text-primary">
          {place.category}
        </span>
        <button
          type="button"
          aria-label={`Save ${place.title} to favorites`}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-card/95 text-foreground transition-colors duration-250 hover:text-accent"
        >
          <Heart className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl leading-snug text-foreground">{place.title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" aria-hidden="true" />
          {placeLocation(place)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {place.short_description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="flex items-center gap-1.5 text-sm text-foreground">
            {practical ? (
              <>
                <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
                {practical}
              </>
            ) : null}
          </span>
          <Link
            to="/places/$slug"
            params={{ slug: place.slug }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors duration-250 hover:text-accent"
          >
            Explore
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-card">
      <div className="aspect-4/3 bg-muted" />
      <div className="flex flex-1 flex-col p-5">
        <div className="h-6 w-3/4 rounded bg-muted" />
        <div className="mt-3 h-4 w-1/3 rounded bg-muted" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-5/6 rounded bg-muted" />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
