import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "Manage Places — Discover Bulgaria";
const description = "Review, edit and publish places submitted by the community.";

export const Route = createFileRoute("/admin/places")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ManagePlacesPage,
});

function ManagePlacesPage() {
  return (
    <PageShell title="Manage Places" description="The moderation table will be built later." />
  );
}
