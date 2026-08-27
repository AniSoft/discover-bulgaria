import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "My Places — Discover Bulgaria";
const description = "Track the places you have submitted to Discover Bulgaria and their status.";

export const Route = createFileRoute("/my-places")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: MyPlacesPage,
});

function MyPlacesPage() {
  return <PageShell title="My Places" description="Your submitted places will appear here." />;
}
