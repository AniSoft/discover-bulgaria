import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { EditorialIntro } from "@/components/home/EditorialIntro";
import { CinematicVideo } from "@/components/home/CinematicVideo";
import { CategorySection } from "@/components/home/CategorySection";
import { ExplorePlaces } from "@/components/home/ExplorePlaces";
import { LocalSecrets } from "@/components/home/LocalSecrets";
import { CommunityCta } from "@/components/home/CommunityCta";

const title = "Discover Bulgaria — Hidden places and local stories";
const description =
  "Discover beautiful, lesser-known places across Bulgaria: hidden gems, mountains, coastline, culture and local secrets worth the detour.";

type HomeSearch = { q?: string; category?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const q = typeof search["q"] === "string" ? search["q"].slice(0, 100).trim() : "";
    const category = typeof search["category"] === "string" ? search["category"].trim() : "";
    return {
      ...(q ? { q } : {}),
      ...(category ? { category } : {}),
    };
  },
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
  const { q = "", category = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const setSearch = (next: HomeSearch) =>
    navigate({ search: next, hash: "places", resetScroll: false });

  return (
    <>
      <Hero
        query={q}
        activeCategory={category}
        onSearch={(value) => setSearch({ ...(value ? { q: value } : {}), ...(category ? { category } : {}) })}
        onCategory={(value) =>
          setSearch({ ...(q ? { q } : {}), ...(value === category ? {} : { category: value }) })
        }
      />
      <EditorialIntro />
      <CategorySection />
      <ExplorePlaces q={q} category={category} onReset={() => navigate({ search: {}, resetScroll: false })} />
      <CinematicVideo />
      <LocalSecrets />
      <CommunityCta />
    </>
  );
}
