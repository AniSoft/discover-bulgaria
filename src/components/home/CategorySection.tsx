import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { categories } from "@/data/categories";
import { categoryCountsQueryOptions } from "@/lib/places.queries";
import { useT } from "@/lib/i18n";

export function CategorySection() {
  const { data: counts } = useQuery(categoryCountsQueryOptions());
  const t = useT();

  return (
    <section className="container-page py-20 md:py-24">
      <SectionHeading
        eyebrow={t("categorySection.eyebrow")}
        title={t("categorySection.title")}
        description={t("categorySection.description")}
      />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            category={category}
            count={counts ? (counts[category.name] ?? 0) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
