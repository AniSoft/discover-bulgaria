import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { PublicPlace } from "@/lib/places.functions";
import { FavoriteHeartButton } from "@/components/FavoriteButton";
import { placeCover, placeImageAlt, placeLocation, placePractical } from "@/lib/place-display";
import { useCategoryLabel, useT } from "@/lib/i18n";
import { useLocalizedPlace } from "@/lib/place-i18n";
import { trackEvent } from "@/lib/analytics";

export function PlaceCard({ place: source }: { place: PublicPlace }) {
  const place = useLocalizedPlace(source);
  const practical = placePractical(place);
  const t = useT();
  const categoryLabel = useCategoryLabel();

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-[var(--radius-card)]">
        <Link
          to="/places/$slug"
          params={{ slug: place.slug }}
          onClick={() => trackEvent("select_content", { content_type: "place", place_slug: place.slug, place_category: place.category })}
          aria-label={t("place.exploreAria", { title: place.title })}
          className="block"
        >
          <div className="aspect-4/5 overflow-hidden sm:aspect-4/3">
            <img
              src={placeCover(place)}
              alt={placeImageAlt(place)}
              loading="lazy"
              width={1024}
              height={768}
              className="hover-zoom-img size-full object-cover"
            />
          </div>
          <div
            className="absolute inset-0 bg-linear-to-t from-overlay/70 via-overlay/5 to-transparent"
            aria-hidden="true"
          />
          <span className="eyebrow absolute top-4 left-4 text-primary-foreground drop-shadow-[0_1px_4px_oklch(0_0_0/45%)]">
            {categoryLabel(place.category)}
          </span>
          <p className="eyebrow absolute right-4 bottom-4 left-4 truncate text-primary-foreground/85">
            {placeLocation(place)}
          </p>
        </Link>
        <FavoriteHeartButton
          placeId={place.id}
          title={place.title}
          slug={place.slug}
          category={place.category}
          className="absolute top-3 right-3"
        />
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <h3 className="line-clamp-2 text-2xl leading-[1.15] text-foreground">
          <Link
            to="/places/$slug"
            params={{ slug: place.slug }}
            onClick={() => trackEvent("select_content", { content_type: "place", place_slug: place.slug, place_category: place.category })}
            className="transition-colors duration-300 hover:text-accent"
          >
            {place.title}
          </Link>
        </h3>
        <p className="mt-3 mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {place.short_description}
        </p>

        <div className="topo-rule mt-auto text-foreground" aria-hidden="true" />
        <div className="flex items-center justify-between gap-3 pt-4">
          <span className="eyebrow text-muted-foreground">{practical}</span>
          <Link
            to="/places/$slug"
            params={{ slug: place.slug }}
            onClick={() => trackEvent("select_content", { content_type: "place", place_slug: place.slug, place_category: place.category })}
            className="eyebrow inline-flex items-center gap-1.5 text-primary transition-colors duration-300 hover:text-accent"
          >
            {t("common.explore")}
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col">
      <div className="aspect-4/5 rounded-[var(--radius-card)] bg-muted sm:aspect-4/3" />
      <div className="flex flex-1 flex-col pt-5">
        <div className="h-6 w-3/4 rounded bg-muted" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-5/6 rounded bg-muted" />
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
