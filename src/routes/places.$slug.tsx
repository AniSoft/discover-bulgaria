import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "Place Details — Discover Bulgaria";
const description = "Details, practical information and local tips for a place in Bulgaria.";

export const Route = createFileRoute("/places/$slug")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PlaceDetailsPage,
});

function PlaceDetailsPage() {
  const { slug } = Route.useParams();
  return (
    <PageShell
      title="Place Details"
      description={`The full page for "${slug}" will be designed in a later step.`}
    />
  );
}
