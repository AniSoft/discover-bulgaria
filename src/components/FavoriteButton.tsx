import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites.queries";

type Props = {
  placeId: string;
  title: string;
  className?: string;
};

export function FavoriteHeartButton({ placeId, title, className }: Props) {
  const { isFavorite, toggle, isPending } = useFavorites();
  const saved = isFavorite(placeId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from favorites` : `Save ${title}`}
      disabled={isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(placeId);
      }}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-card/95 transition-colors duration-250",
        saved ? "text-accent" : "text-foreground hover:text-accent",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-transform duration-250", saved && "scale-110 fill-current")}
        aria-hidden="true"
      />
    </button>
  );
}

export function FavoriteActionButton({ placeId, title, className }: Props) {
  const { isFavorite, toggle, isPending } = useFavorites();
  const saved = isFavorite(placeId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from favorites` : `Save ${title}`}
      disabled={isPending}
      onClick={() => toggle(placeId)}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-[var(--radius-button)] border px-5 text-sm font-medium transition-colors duration-250 disabled:opacity-60",
        saved
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-border bg-card text-foreground hover:bg-secondary",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-transform duration-250", saved && "scale-110 fill-current")}
        aria-hidden="true"
      />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
