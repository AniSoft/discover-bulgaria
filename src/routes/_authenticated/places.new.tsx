import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "Add a Place — Discover Bulgaria";
const description =
  "Share a place worth discovering in Bulgaria and help other travellers experience it too.";

export const Route = createFileRoute("/_authenticated/places/new")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: NewPlacePage,
});

function NewPlacePage() {
  return (
    <PageShell
      title="Add a Place"
      description="The submission form comes in a later step, once accounts and storage are in place."
    />
  );
}
