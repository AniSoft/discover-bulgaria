import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "@/components/CategoryCard";
import { PageShell } from "@/components/PageShell";
import { categories } from "@/data/categories";
import { categoryCountsQueryOptions } from "@/lib/places.queries";
import { useT } from "@/lib/i18n";
import { readLocale } from "@/lib/i18n/locale";
import { CATEGORIES_SEO, SITE_URL, jsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/categories")({
  loader: () => ({ locale: readLocale() }),
  head: ({ loaderData }) => {
    const copy = CATEGORIES_SEO[loaderData?.locale ?? "en"];
    return {
      ...seo({ title: copy.title, description: copy.description, path: "/categories" }),
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Discover Bulgaria", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: copy.title.split(" | ")[0], item: `${SITE_URL}/categories` },
          ],
        }),
      ],
    };
  },
  component: CategoriesPage,
});


function CategoriesPage() {
  const { data: counts, isError } = useQuery(categoryCountsQueryOptions());
  const t = useT();

  return (
    <PageShell
      title={t("categories.pageTitle")}
      description={t("categories.pageDescription")}
    >
      {isError ? (
        <p className="mb-8 rounded-[var(--radius-card)] border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
          {t("common.loadError")}
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
