import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "Admin Dashboard — Discover Bulgaria";
const description = "Internal dashboard for reviewing and publishing submitted places.";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <PageShell
      title="Admin Dashboard"
      description="Moderation tools will be added in a later step."
    />
  );
}
