import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { categories } from "@/data/categories";
import { categoryCountsQueryOptions } from "@/lib/places.queries";

export function CategorySection() {
  const { data: counts } = useQuery(categoryCountsQueryOptions());

  return (
    <section className="container-page py-20 md:py-24">
      <SectionHeading
        eyebrow="Start somewhere"
        title="Explore by category"
        description="Eight ways into the country — from empty coastline to forgotten mountain villages."
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
