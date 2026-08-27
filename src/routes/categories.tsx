import { createFileRoute } from "@tanstack/react-router";
import { CategoryCard } from "@/components/CategoryCard";
import { PageShell } from "@/components/PageShell";
import { categories } from "@/data/categories";

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
  return (
    <PageShell
      title="Categories"
      description="Eight ways into the country. Pick a direction and start exploring."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </PageShell>
  );
}
