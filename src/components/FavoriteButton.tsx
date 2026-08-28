import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites.queries";
import { useT } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

type Props = {
  placeId: string;
  title: string;
  /** Public slug / category only: never user data. */
  slug?: string;
  category?: string;
  className?: string;
};

export function FavoriteHeartButton({ placeId, title, slug, category, className }: Props) {
  const { isFavorite, toggle, isPending } = useFavorites();
  const t = useT();
  const saved = isFavorite(placeId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? t("place.removeAria", { title }) : t("place.saveAria", { title })}
      disabled={isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!saved) trackEvent("favorite_place", { place_slug: slug ?? "", place_category: category ?? "" });
        toggle(placeId);
      }}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-card/95 shadow-card transition-colors duration-250 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60",
        saved ? "text-accent" : "text-foreground hover:text-accent",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-transform duration-250 ease-out", saved && "scale-115 fill-current")}
        aria-hidden="true"
      />
    </button>
  );
}

export function FavoriteActionButton({ placeId, title, slug, category, className }: Props) {
  const { isFavorite, toggle, isPending } = useFavorites();
  const t = useT();
  const saved = isFavorite(placeId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? t("place.removeAria", { title }) : t("place.saveAria", { title })}
      disabled={isPending}
      onClick={() => {
        if (!saved) trackEvent("favorite_place", { place_slug: slug ?? "", place_category: category ?? "" });
        toggle(placeId);
      }}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-2 rounded-[var(--radius-button)] border px-5 text-sm font-medium transition-colors duration-250 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60",
        saved
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-border bg-card text-foreground hover:bg-secondary",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-transform duration-250 ease-out", saved && "scale-115 fill-current")}
        aria-hidden="true"
      />
      {saved ? t("common.saved") : t("common.save")}
    </button>
  );
}
