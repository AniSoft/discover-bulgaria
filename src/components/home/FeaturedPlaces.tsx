import { PlaceCard } from "@/components/PlaceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/AppButton";
import { featuredPlaces } from "@/data/places";

export function FeaturedPlaces() {
  return (
    <section className="border-y border-border bg-card py-20 md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Featured"
          title="Places worth discovering"
          description="A handful of places that reward the detour, chosen for their light, quiet and character."
          action={
            <ButtonLink to="/categories" variant="outline">
              Browse all places
            </ButtonLink>
          }
        />
        <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {featuredPlaces.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>
      </div>
    </section>
  );
}
