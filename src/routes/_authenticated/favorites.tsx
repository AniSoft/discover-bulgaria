import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "Favorites — Discover Bulgaria";
const description = "Your saved Bulgarian places, kept in one place for the next trip.";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  return <PageShell title="Favorites" description="Saved places will be listed here." />;
}
