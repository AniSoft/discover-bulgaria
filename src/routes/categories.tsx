import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "@/components/CategoryCard";
import { PageShell } from "@/components/PageShell";
import { categories } from "@/data/categories";
import { categoryCountsQueryOptions } from "@/lib/places.queries";

const title = "Categories — Discover Bulgaria";
const description =
  "Browse Bulgarian places by category: hidden gems, nature, mountains, sea, history, views, photo spots and food & wine.";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: counts, isError } = useQuery(categoryCountsQueryOptions());

  return (
    <PageShell
      title="Categories"
      description="Eight ways into the country. Pick a direction and start exploring."
    >
      {isError ? (
        <p className="mb-8 rounded-[var(--radius-card)] border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
          We couldn't load places right now. Please try again.
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            category={category}
            count={counts ? (counts[category.name] ?? 0) : undefined}
          />
        ))}
      </div>
    </PageShell>
  );
}
