import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedPlaces } from "@/components/home/FeaturedPlaces";
import { LocalSecrets } from "@/components/home/LocalSecrets";
import { CommunityCta } from "@/components/home/CommunityCta";

const title = "Discover Bulgaria — Hidden places and local stories";
const description =
  "Discover beautiful, lesser-known places across Bulgaria: hidden gems, mountains, coastline, culture and local secrets worth the detour.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedPlaces />
      <LocalSecrets />
      <CommunityCta />
    </>
  );
}
