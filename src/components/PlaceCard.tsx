import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Heart, MapPin } from "lucide-react";
import type { Place } from "@/data/places";

export function PlaceCard({ place }: { place: Place }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-card transition-shadow duration-250 hover:shadow-lift">
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={place.image}
          alt={place.alt}
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
          aria-label={`Save ${place.name} to favorites`}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-card/95 text-foreground transition-colors duration-250 hover:text-accent"
        >
          <Heart className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl leading-snug text-foreground">{place.name}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" aria-hidden="true" />
          {place.region}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{place.description}</p>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="flex items-center gap-1.5 text-sm text-foreground">
            <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
            {place.practical}
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
