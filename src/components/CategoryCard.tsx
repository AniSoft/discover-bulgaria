import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/data/categories";
import { useCategoryLabel, useT } from "@/lib/i18n";

type Props = {
  category: Category;
  count?: number | undefined;
};

export function CategoryCard({ category, count }: Props) {
  const t = useT();
  const categoryLabel = useCategoryLabel();
  const name = categoryLabel(category.name);

  return (
    <Link
      to="/"
      search={{ category: category.name }}
      hash="places"
      className="group relative block overflow-hidden rounded-[var(--radius-card)]"
      aria-label={t("categories.exploreAria", { category: name })}
    >
      <div className="aspect-4/5 overflow-hidden sm:aspect-4/3">
        <img
          src={category.image}
          alt={category.alt}
          loading="lazy"
          width={1024}
          height={768}
          className="hover-zoom-img size-full object-cover"
        />
      </div>
      <div
        className="absolute inset-0 bg-linear-to-t from-overlay/85 via-overlay/25 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="eyebrow text-primary-foreground/60">
            {count === undefined
              ? "–"
              : t(count === 1 ? "categoryCard.placeCount" : "categoryCard.placesCount", { count })}
          </p>
          <h3 className="mt-1.5 truncate text-2xl leading-tight text-primary-foreground">{name}</h3>
        </div>
        <ArrowUpRight
          className="size-5 shrink-0 -translate-x-1 translate-y-1 text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
