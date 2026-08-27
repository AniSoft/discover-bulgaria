import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/data/categories";

type Props = {
  category: Category;
  count?: number | undefined;
};

export function CategoryCard({ category, count }: Props) {
  return (
    <Link
      to="/"
      search={{ category: category.name }}
      hash="places"
      className="group relative block overflow-hidden rounded-[var(--radius-card)] border border-border bg-card"
      aria-label={`Explore ${category.name}`}
    >
      <div className="aspect-4/3 overflow-hidden">
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
        className="absolute inset-0 bg-linear-to-t from-overlay/80 via-overlay/10 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div>
          <h3 className="text-xl text-primary-foreground">{category.name}</h3>
          <p className="mt-1 text-xs text-primary-foreground/75">
            {count === undefined ? "—" : `${count} ${count === 1 ? "place" : "places"}`}
          </p>
        </div>
        <ArrowUpRight
          className="size-5 shrink-0 text-primary-foreground opacity-0 transition-opacity duration-250 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
